import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export interface TtsRequest {
  text: string;
  language?: 'en' | 'hi';
}

export interface TtsResponse {
  audio: string | null; // base64 encoded audio or null for browser speech fallback
  format: 'wav' | 'mp3' | null;
  provider: 'sarvam' | 'groq' | 'browser';
  cleanText: string;
  error?: string;
}

/**
 * Text normalizer for speech:
 * Strips markdown symbols, emojis, and raw code artifacts.
 * Expands mathematical complexity (Big-O) and engineering symbols into natural phonetics.
 */
export function normalizeTextForSpeech(rawText: string): string {
  if (!rawText) return '';

  return (
    rawText
      // Remove multiline code blocks completely or substitute with spoken summary
      .replace(/```[\s\S]*?```/g, ' [refer to the code block] ')
      // Remove inline code backticks while preserving content
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
      // Expand Big-O Complexity Notation
      .replace(/\bO\(1\)/gi, 'Big O of 1')
      .replace(/\bO\(log\s*n\)/gi, 'Big O of log n')
      .replace(/\bO\(n\s*log\s*n\)/gi, 'Big O of n log n')
      .replace(/\bO\(n\^?2\)/gi, 'Big O of n squared')
      .replace(/\bO\(n\^?3\)/gi, 'Big O of n cubed')
      .replace(/\bO\(2\^?n\)/gi, 'Big O of 2 to the power n')
      .replace(/\bO\(n!\)/gi, 'Big O of n factorial')
      .replace(/\bO\(n\)/gi, 'Big O of n')
      // Expand common logic and comparison operators
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

export async function POST(req: Request) {
  let text = '';
  try {
    const body: TtsRequest = await req.json();
    text = body.text || '';
    const language = body.language || 'en';

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { audio: null, format: null, provider: 'browser', cleanText: '', error: 'No text provided' },
        { status: 400 }
      );
    }

    const cleanText = normalizeTextForSpeech(text);

    // =========================================================================
    // Tier 1: Sarvam AI TTS (bulbul:v2) — Best Indian English & Hinglish Cadence
    // =========================================================================
    const sarvamApiKey = process.env.SARVAM_API_KEY;
    if (sarvamApiKey && sarvamApiKey.trim().length > 10) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const targetLangCode = language === 'hi' ? 'hi-IN' : 'en-IN';
        const speaker = language === 'hi' ? 'anushka' : 'anushka'; // Natural conversational Indian speaker

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
            return NextResponse.json({
              audio: base64Audio,
              format: 'wav',
              provider: 'sarvam',
              cleanText,
            } as TtsResponse);
          }
        } else {
          console.warn(`[TTS API] Sarvam AI returned status ${sarvamRes.status}. Proceeding to fallback tiers.`);
        }
      } catch (sarvamErr: any) {
        console.warn('[TTS API] Sarvam AI request failed:', sarvamErr?.message || sarvamErr);
      }
    }

    // =========================================================================
    // Tier 2: Groq Cloud Audio Speech (if available)
    // =========================================================================
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey && groqApiKey.trim().length > 10 && language === 'en') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const groqTtsRes = await fetch('https://api.groq.com/openai/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'canopylabs/orpheus-v1-english',
            input: cleanText,
            voice: 'default',
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (groqTtsRes.ok) {
          const arrayBuffer = await groqTtsRes.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          return NextResponse.json({
            audio: base64,
            format: 'wav',
            provider: 'groq',
            cleanText,
          } as TtsResponse);
        }
      } catch (groqTtsErr) {
        // Groq TTS not enabled or terms pending - gracefully advance to Tier 3
      }
    }

    // =========================================================================
    // Tier 3: High-Quality Browser Speech Synthesis Fallback
    // Returns cleanText so client speaks normalized text with natural neural voices
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
        cleanText: text || '',
        error: err?.message || 'Internal server error',
      } as TtsResponse,
      { status: 500 }
    );
  }
}
