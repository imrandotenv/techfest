import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { auth } from '@clerk/nextjs/server';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { sanitizeForSpeech } from '@/lib/tts-sanitizer';

export { sanitizeForSpeech };
export const normalizeTextForSpeech = sanitizeForSpeech;

export const runtime = 'nodejs';

export interface TtsRequest {
  text: string;
  language?: 'en' | 'hi' | 'hinglish' | string;
  voice?: 'female' | 'male' | string;
  gender?: 'female' | 'male' | string;
  speed?: number | string;
  rate?: number | string; // e.g. 1.0, 1.15, or "+4%"
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

// Speech sanitizer imported from '@/lib/tts-sanitizer'

/**
 * Synthesize speech buffer using MsEdgeTTS with expressive pitch & natural pacing
 */
async function synthesizeWithEdge(
  text: string,
  voiceName: string,
  rateString: string
): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const { audioStream } = tts.toStream(text, { rate: rateString, pitch: '+0Hz' });
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

/**
 * Synthesize with resilient fallback:
 * If en-IN-NeerjaExpressiveNeural encounters an issue, fallback to en-IN-NeerjaNeural
 */
async function synthesizeWithEdgeSafe(
  text: string,
  primaryVoice: string,
  rateString: string
): Promise<{ buffer: Buffer; voiceUsed: string }> {
  try {
    const buffer = await synthesizeWithEdge(text, primaryVoice, rateString);
    return { buffer, voiceUsed: primaryVoice };
  } catch (err: any) {
    if (primaryVoice === 'en-IN-NeerjaExpressiveNeural') {
      console.warn('[TTS API] NeerjaExpressiveNeural failed, falling back to NeerjaNeural:', err?.message);
      const buffer = await synthesizeWithEdge(text, 'en-IN-NeerjaNeural', rateString);
      return { buffer, voiceUsed: 'en-IN-NeerjaNeural' };
    }
    throw err;
  }
}

function resolveVoice(
  language?: string,
  voicePref?: string,
  genderPref?: string
): string {
  const lang = (language || 'en').toLowerCase().trim();
  const pref = (voicePref || genderPref || '').toLowerCase().trim();

  if (lang === 'hi' || lang === 'hinglish') {
    // Hinglish defaults to expressive female (hi-IN-SwaraNeural), or male (hi-IN-MadhurNeural)
    if (pref === 'male' || pref.includes('madhur')) {
      return 'hi-IN-MadhurNeural';
    }
    return 'hi-IN-SwaraNeural';
  } else {
    // English defaults to expressive female (en-IN-NeerjaExpressiveNeural), or male (en-IN-PrabhatNeural)
    if (pref === 'male' || pref.includes('prabhat')) {
      return 'en-IN-PrabhatNeural';
    }
    return 'en-IN-NeerjaExpressiveNeural';
  }
}

function formatSpeechRate(speedOrRate: number | string | undefined): string {
  if (typeof speedOrRate === 'number') {
    const pct = Math.round((speedOrRate - 1) * 100);
    return pct >= 0 ? `+${pct + 3}%` : `${pct}%`;
  }
  if (typeof speedOrRate === 'string') {
    const trimmed = speedOrRate.trim();
    if (trimmed.startsWith('+') || trimmed.startsWith('-')) return trimmed;
    if (!isNaN(Number(trimmed))) {
      const num = Number(trimmed);
      const pct = Math.round((num - 1) * 100);
      return pct >= 0 ? `+${pct + 3}%` : `${pct}%`;
    }
    return `+${trimmed}`;
  }
  return '+3%';
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
    const language = (body.language || 'en').toLowerCase();
    const rawRate = body.speed !== undefined ? body.speed : (body.rate !== undefined ? body.rate : 1.0);

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        { audio: null, format: null, provider: 'browser', cleanText: '', error: 'No text provided' },
        { status: 400 }
      );
    }

    const cleanText = sanitizeForSpeech(rawText);
    const rateStr = formatSpeechRate(rawRate);
    let edgeVoice = resolveVoice(language, body.voice, body.gender);

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

        const targetLangCode = (language === 'hi' || language === 'hinglish') ? 'hi-IN' : 'en-IN';
        const speaker = (body.voice === 'male' || body.gender === 'male' || edgeVoice.includes('Madhur') || edgeVoice.includes('Prabhat')) ? 'arvind' : 'anushka';

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
      const { buffer: audioBuffer, voiceUsed } = await synthesizeWithEdgeSafe(cleanText, edgeVoice, rateStr);
      if (audioBuffer && audioBuffer.length > 0) {
        addToCache(cacheKey, { buffer: audioBuffer, format: 'mp3', provider: 'edge-neural', timestamp: Date.now() });

        return NextResponse.json({
          audio: audioBuffer.toString('base64'),
          format: 'mp3',
          provider: 'edge-neural',
          cleanText,
          cached: false,
          voiceName: voiceUsed,
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
    const language = (searchParams.get('language') || 'en').toLowerCase();
    const voicePref = searchParams.get('voice') || '';
    const genderPref = searchParams.get('gender') || '';
    const rate = searchParams.get('rate') || searchParams.get('speed') || '1.0';

    if (!text.trim()) {
      return new Response('No text provided', { status: 400 });
    }

    const cleanText = sanitizeForSpeech(text);
    const rateStr = formatSpeechRate(rate);
    const edgeVoice = resolveVoice(language, voicePref, genderPref);

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

    const { buffer } = await synthesizeWithEdgeSafe(cleanText, edgeVoice, rateStr);
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
