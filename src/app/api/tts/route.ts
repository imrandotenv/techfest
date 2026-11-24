import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { auth } from '@clerk/nextjs/server';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';

export const runtime = 'nodejs';

export interface TtsRequest {
  text: string;
  language?: 'en' | 'hi';
  voice?: 'female' | 'male';
  rate?: number | string; // e.g. 1.0, 1.15, or "+5%"
}

export interface TtsResponse {
  audio: string | null; // base64 encoded audio
  format: 'mp3' | 'wav' | null;
  provider: 'edge-neural' | 'sarvam' | 'browser';
  cleanText: string;
  cached?: boolean;
  voiceName?: string;
  error?: string;
}

// In-Memory LRU Audio Cache for instant (<10ms) re-plays & common phrases
interface CacheEntry {
  buffer: Buffer;
  format: 'mp3' | 'wav';
  provider: 'edge-neural' | 'sarvam';
  timestamp: number;
}

const AUDIO_CACHE = new Map<string, CacheEntry>();
const MAX_CACHE_SIZE = 120;

function getCacheKey(text: string, lang: string, voice: string, rate: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(`${lang}:${voice}:${rate}:${text.trim().toLowerCase()}`);
  return hash.digest('hex');
}

function addToCache(key: string, entry: CacheEntry) {
  if (AUDIO_CACHE.size >= MAX_CACHE_SIZE) {
    // Evict oldest 20 entries
    const keys = Array.from(AUDIO_CACHE.keys()).slice(0, 20);
    for (const k of keys) {
      AUDIO_CACHE.delete(k);
    }
  }
  AUDIO_CACHE.set(key, entry);
}

/**
 * Text humanizer for speech:
 * Strips markdown symbols, code blocks, URLs, and emojis.
 * Expands mathematical complexity (Big-O) and engineering acronyms into natural Indian phonetics.
 */
export function normalizeTextForSpeech(rawText: string): string {
  if (!rawText) return '';

  return (
    rawText
      // Remove multiline code blocks or replace with speech cue
      .replace(/```[\s\S]*?```/g, ' [code concept] ')
      // Remove inline code backticks while keeping words
      .replace(/`([^`]+)`/g, '$1')
      // Remove markdown headings, bold, italics, strikethrough, blockquotes
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .replace(/^>\s+/gm, '')
      // Remove markdown links [title](url) -> title
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove bare URLs
      .replace(/https?:\/\/\S+/gi, '')
      // Remove unicode emojis
      .replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        ''
      )
      // Expand Big-O Complexity Notation naturally
      .replace(/\bO\(1\)/gi, 'Big O of 1')
      .replace(/\bO\(log\s*n\)/gi, 'Big O of log n')
      .replace(/\bO\(n\s*log\s*n\)/gi, 'Big O of n log n')
      .replace(/\bO\(n\^?2\)/gi, 'Big O of n squared')
      .replace(/\bO\(n\^?3\)/gi, 'Big O of n cubed')
      .replace(/\bO\(2\^?n\)/gi, 'Big O of 2 to the power n')
      .replace(/\bO\(n!\)/gi, 'Big O of n factorial')
      .replace(/\bO\(n\)/gi, 'Big O of n')
      // Expand common engineering acronyms naturally for phonetics
      .replace(/\bFIFO\b/g, 'Fifo')
      .replace(/\bLIFO\b/g, 'Lifo')
      .replace(/\bLRU\b/g, 'L-R-U')
      .replace(/\bDBMS\b/g, 'D-B-M-S')
      .replace(/\bSQL\b/g, 'Sequel')
      .replace(/\bCPU\b/g, 'C-P-U')
      .replace(/\bRAM\b/g, 'Ram')
      .replace(/\bROM\b/g, 'Rom')
      .replace(/\bOS\b/g, 'O-S')
      .replace(/\bDSA\b/g, 'D-S-A')
      .replace(/\bCOA\b/g, 'C-O-A')
      .replace(/\bAVL\b/g, 'A-V-L')
      .replace(/\bBST\b/g, 'B-S-T')
      .replace(/\bTLB\b/g, 'T-L-B')
      .replace(/\bAPI\b/g, 'A-P-I')
      .replace(/\bMAKAUT\b/g, 'Makaut')
      .replace(/\bSETGOI\b/g, 'Setgoi')
      // Expand comparison and directional operators
      .replace(/->|→/g, ' to ')
      .replace(/<-|←/g, ' from ')
      .replace(/!=|≠/g, ' not equal to ')
      .replace(/===|==/g, ' equals ')
      .replace(/<=|≤/g, ' less than or equal to ')
      .replace(/>=|≥/g, ' greater than or equal to ')
      .replace(/&&/g, ' and ')
      .replace(/\|\|/g, ' or ')
      // Clean remaining special punctuation
      .replace(/[~^|]/g, ' ')
      // Collapse whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Synthesize speech buffer using MsEdgeTTS
 */
async function synthesizeWithEdge(
  text: string,
  voiceName: string,
  rateString: string
): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const { audioStream } = tts.toStream(text, { rate: rateString });
  const chunks: Buffer[] = [];

  return new Promise<Buffer>((resolve, reject) => {
    const timeout = setTimeout(() => {
      try {
        tts.close();
      } catch {}
      reject(new Error('MsEdgeTTS stream timed out after 7000ms'));
    }, 7000);

    audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));
    audioStream.on('end', () => {
      clearTimeout(timeout);
      try {
        tts.close();
      } catch {}
      resolve(Buffer.concat(chunks));
    });
    audioStream.on('error', (err: any) => {
      clearTimeout(timeout);
      try {
        tts.close();
      } catch {}
      reject(err);
    });
  });
}

export async function POST(req: Request) {
  let rawText = '';
  try {
    // 1. Rate limiting check (60 requests / hour per user/IP)
    const { userId } = await auth().catch(() => ({ userId: null }));
    const clientId = getClientIdentifier(req, userId);
    const rateCheck = await checkRateLimit(`${clientId}:tts`, 60, 60 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          audio: null,
          format: null,
          provider: 'browser',
          cleanText: '',
          error: 'Rate limit reached: Maximum 60 voice synthesis requests per hour. Please wait before retrying.',
        } as TtsResponse,
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.retryAfterSeconds),
          },
        }
      );
    }

    const body: TtsRequest = await req.json();
    rawText = body.text || '';
    const language = body.language || 'en';
    const voiceGender = body.voice || 'female';
    const rawRate = body.rate || 1.0;

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        { audio: null, format: null, provider: 'browser', cleanText: '', error: 'No text provided' },
        { status: 400 }
      );
    }

    const cleanText = normalizeTextForSpeech(rawText);

    // Format speech rate (e.g., 1.15 -> "+15%", 1.0 -> "+4%" default for natural Indian pace)
    let rateStr = '+4%';
    if (typeof rawRate === 'number') {
      const pct = Math.round((rawRate - 1) * 100);
      rateStr = pct >= 0 ? `+${pct + 4}%` : `${pct}%`;
    } else if (typeof rawRate === 'string') {
      rateStr = rawRate.startsWith('+') || rawRate.startsWith('-') ? rawRate : `+${rawRate}`;
    }

    // Select Azure Neural Voice
    let edgeVoice = 'en-IN-NeerjaExpressiveNeural';
    if (language === 'hi') {
      edgeVoice = voiceGender === 'male' ? 'hi-IN-MadhurNeural' : 'hi-IN-SwaraNeural';
    } else {
      edgeVoice = voiceGender === 'male' ? 'en-IN-PrabhatNeural' : 'en-IN-NeerjaExpressiveNeural';
    }

    // Check In-Memory Audio Cache for instant (<10ms) playback
    const cacheKey = getCacheKey(cleanText, language, edgeVoice, rateStr);
    const cachedEntry = AUDIO_CACHE.get(cacheKey);
    if (cachedEntry) {
      return NextResponse.json({
        audio: cachedEntry.buffer.toString('base64'),
        format: cachedEntry.format,
        provider: cachedEntry.provider,
        cleanText,
        cached: true,
        voiceName: edgeVoice,
      } as TtsResponse, {
        headers: {
          'Cache-Control': 'public, max-age=3600',
          'X-TTS-Cache': 'HIT',
        },
      });
    }

    // =========================================================================
    // Tier 1: Sarvam AI (If explicit API Key provided)
    // =========================================================================
    const sarvamApiKey = process.env.SARVAM_API_KEY;
    if (sarvamApiKey && sarvamApiKey.trim().length > 10) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const targetLangCode = language === 'hi' ? 'hi-IN' : 'en-IN';
        const speaker = voiceGender === 'male' ? 'arvind' : 'anushka';

        const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'api-subscription-key': sarvamApiKey.trim(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: [cleanText],
            target_language_code: targetLangCode,
            speaker: speaker,
            pitch: 0,
            pace: 1.05,
            loudness: 1.0,
            speech_sample_rate: 22050,
            enable_preprocessing: true,
            model: 'bulbul:v2',
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (sarvamRes.ok) {
          const data = await sarvamRes.json();
          const base64Audio = data.audios?.[0];
          if (base64Audio) {
            const buf = Buffer.from(base64Audio, 'base64');
            addToCache(cacheKey, { buffer: buf, format: 'wav', provider: 'sarvam', timestamp: Date.now() });

            return NextResponse.json({
              audio: base64Audio,
              format: 'wav',
              provider: 'sarvam',
              cleanText,
              cached: false,
              voiceName: `Sarvam-${speaker}`,
            } as TtsResponse, {
              headers: { 'Cache-Control': 'public, max-age=3600' },
            });
          }
        }
      } catch (sarvamErr: any) {
        console.warn('[TTS API] Sarvam Tier skipped:', sarvamErr?.message || sarvamErr);
      }
    }

    // =========================================================================
    // Tier 2 (Primary Zero-Key Neural): Microsoft Azure Indian Voices via msedge-tts
    // =========================================================================
    try {
      const audioBuffer = await synthesizeWithEdge(cleanText, edgeVoice, rateStr);
      if (audioBuffer && audioBuffer.length > 0) {
        addToCache(cacheKey, { buffer: audioBuffer, format: 'mp3', provider: 'edge-neural', timestamp: Date.now() });

        return NextResponse.json({
          audio: audioBuffer.toString('base64'),
          format: 'mp3',
          provider: 'edge-neural',
          cleanText,
          cached: false,
          voiceName: edgeVoice,
        } as TtsResponse, {
          headers: {
            'Cache-Control': 'public, max-age=3600',
            'X-TTS-Cache': 'MISS',
          },
        });
      }
    } catch (edgeErr: any) {
      console.warn('[TTS API] Edge Neural TTS failed:', edgeErr?.message || edgeErr);
    }

    // =========================================================================
    // Tier 3: High-Quality Browser Speech Synthesis Fallback
    // =========================================================================
    return NextResponse.json({
      audio: null,
      format: null,
      provider: 'browser',
      cleanText,
    } as TtsResponse);
  } catch (err: any) {
    console.error('[TTS API] General Error:', err);
    return NextResponse.json(
      {
        audio: null,
        format: null,
        provider: 'browser',
        cleanText: rawText || '',
        error: err?.message || 'Internal server error',
      } as TtsResponse,
      { status: 500 }
    );
  }
}

/**
 * Direct GET endpoint: returns binary audio/mpeg with public caching
 * Example: /api/tts?text=Hello&language=en&voice=female&rate=1.0
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text') || '';
    const language = (searchParams.get('language') || 'en') as 'en' | 'hi';
    const voiceGender = (searchParams.get('voice') || 'female') as 'female' | 'male';
    const rate = searchParams.get('rate') || '1.0';

    if (!text.trim()) {
      return new Response('No text provided', { status: 400 });
    }

    const cleanText = normalizeTextForSpeech(text);
    const rateStr = rate === '1.15' ? '+15%' : '+4%';

    let edgeVoice = 'en-IN-NeerjaExpressiveNeural';
    if (language === 'hi') {
      edgeVoice = voiceGender === 'male' ? 'hi-IN-MadhurNeural' : 'hi-IN-SwaraNeural';
    } else {
      edgeVoice = voiceGender === 'male' ? 'en-IN-PrabhatNeural' : 'en-IN-NeerjaExpressiveNeural';
    }

    const cacheKey = getCacheKey(cleanText, language, edgeVoice, rateStr);
    const cachedEntry = AUDIO_CACHE.get(cacheKey);
    if (cachedEntry) {
      return new Response(new Uint8Array(cachedEntry.buffer), {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=3600',
          'X-TTS-Cache': 'HIT',
        },
      });
    }

    const buffer = await synthesizeWithEdge(cleanText, edgeVoice, rateStr);
    addToCache(cacheKey, { buffer, format: 'mp3', provider: 'edge-neural', timestamp: Date.now() });

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
        'X-TTS-Cache': 'MISS',
      },
    });
  } catch (err: any) {
    console.error('[TTS GET API] Error:', err);
    return new Response('TTS Synthesis Failed', { status: 500 });
  }
}
