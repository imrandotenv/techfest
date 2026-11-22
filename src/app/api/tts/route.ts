import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export interface TtsRequest {
  text: string;
  language?: 'en' | 'hi';
}

export interface TtsResponse {
  audio: string | null; // base64 encoded wav/mp3 or null for browser speech fallback
  format: 'wav' | 'mp3' | null;
  provider: 'sarvam' | 'browser';
  error?: string;
}

export async function POST(req: Request) {
  try {
    const body: TtsRequest = await req.json();
    const { text, language = 'en' } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { audio: null, format: null, provider: 'browser', error: 'No text provided' },
        { status: 400 }
      );
    }

    // Clean text: strip markdown symbols, asterisks, brackets, backticks
    const cleanText = text
      .replace(/[*_#`~[\]]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // 1. Primary Natural Voice: Sarvam AI TTS (bulbul:v2)
    const sarvamApiKey = process.env.SARVAM_API_KEY;
    if (sarvamApiKey && sarvamApiKey.trim().length > 10) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const targetLangCode = language === 'hi' ? 'hi-IN' : 'en-IN';
        const speaker = language === 'hi' ? 'meera' : 'amartya';

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
            pace: 1.02,
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
            return NextResponse.json({
              audio: base64Audio,
              format: 'wav',
              provider: 'sarvam',
            } as TtsResponse);
          }
        } else {
          console.warn(`[TTS API] Sarvam AI returned status ${sarvamRes.status}. Falling back to browser speech synthesis.`);
        }
      } catch (sarvamErr: any) {
        console.warn('[TTS API] Sarvam AI request failed:', sarvamErr?.message || sarvamErr);
      }
    }

    // 2. Zero-Cost High-Quality Fallback: Browser Web Speech API
    return NextResponse.json({
      audio: null,
      format: null,
      provider: 'browser',
    } as TtsResponse);
  } catch (err: any) {
    console.error('[TTS API] General Error:', err);
    return NextResponse.json({
      audio: null,
      format: null,
      provider: 'browser',
      error: err?.message || 'Internal server error',
    } as TtsResponse);
  }
}
