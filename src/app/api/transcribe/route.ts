import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // 1. Rate limiting check (30 requests / hour per user/IP)
    const { userId } = await auth().catch(() => ({ userId: null }));
    const clientId = getClientIdentifier(req, userId);
    const rateCheck = await checkRateLimit(`${clientId}:transcribe`, 30, 60 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'Rate limit reached: Maximum 30 audio transcription requests per hour.',
          text: '',
          retryAfter: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.retryAfterSeconds),
          },
        }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey || groqApiKey.trim().length === 0) {
      return NextResponse.json(
        { error: 'Groq API key not configured on server', text: '' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get('file') as File | Blob | null;
    const languageHint = formData.get('language') as string | null;

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: 'No audio file provided in request', text: '' },
        { status: 400 }
      );
    }

    if (audioFile.size === 0) {
      return NextResponse.json(
        { error: 'Audio file is empty', text: '' },
        { status: 400 }
      );
    }

    // Determine extension from mime type or default to webm
    let filename = 'recording.webm';
    if (audioFile.type?.includes('wav')) filename = 'recording.wav';
    else if (audioFile.type?.includes('mp4') || audioFile.type?.includes('m4a')) filename = 'recording.mp4';
    else if (audioFile.type?.includes('ogg')) filename = 'recording.ogg';

    // Prepare Groq Whisper request
    const groqForm = new FormData();
    groqForm.append('file', audioFile, filename);
    groqForm.append('model', 'whisper-large-v3-turbo');
    
    // Engineering domain prompt hint: boosts accuracy on B.Tech terminology and Hinglish
    const domainPrompt = 
      'B.Tech engineering viva examination in English and Hinglish. ' +
      'Key vocabulary: DSA, MAKAUT, Stack, Queue, LinkedList, AVL Tree, Dijkstra, B-Tree, Heap, ' +
      'Operating System, Deadlock, Semaphore, Mutex, Paging, Thrashing, Virtual Memory, ' +
      'DBMS, Normalization, 1NF, 2NF, 3NF, BCNF, ACID, SQL, Indexing, B+ Tree, Foreign Key, ' +
      'COA, Flip-Flop, Multiplexer, ALU, Cache Mapping, Pipelining, Von Neumann, ' +
      'Computer Networks, OSI Model, TCP/IP, Three-way handshake, Subnetting, Routing, ' +
      'Hinglish conversation: samjha nahi, example do, next question, sahi hai, galat hai.';
    
    groqForm.append('prompt', domainPrompt);
    groqForm.append('response_format', 'json');
    groqForm.append('temperature', '0');

    // Language hint if explicitly requested
    if (languageHint === 'hi') {
      groqForm.append('language', 'hi');
    } else if (languageHint === 'en') {
      groqForm.append('language', 'en');
    }
    // If not specified, Whisper auto-detects language seamlessly

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey.trim()}`,
      },
      body: groqForm,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error(`[Whisper API] Groq transcription error (${groqRes.status}):`, errText);
      return NextResponse.json(
        { error: `Transcription failed (${groqRes.status})`, text: '' },
        { status: groqRes.status }
      );
    }

    const data = await groqRes.json();
    const transcribedText = (data.text || '').trim();

    return NextResponse.json({
      text: transcribedText,
      model: 'whisper-large-v3-turbo',
    });
  } catch (error: any) {
    console.error('[Whisper API] Internal error:', error?.message || error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error during audio transcription', text: '' },
      { status: 500 }
    );
  }
}
