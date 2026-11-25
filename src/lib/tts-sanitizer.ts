/**
 * Strict Speech-Text Sanitizer for Expressive Indian Neural TTS.
 * - Strips all Markdown, code blocks, URLs, emojis, and ASCII tree/diagram characters.
 * - Expands MAKAUT subject codes, Big-O notations, and engineering acronyms into natural spoken words.
 * - Caps spoken output to a concise 2-sentence examiner reaction + next question (~35–45 words).
 */

const MAKAUT_CODE_SPOKEN_MAP: Array<[RegExp, string]> = [
  [/\bPCC-CS301\b/gi, 'Data Structures'],
  [/\bPCC-CS302\b/gi, 'Computer Organisation'],
  [/\bESC\s*301\b/gi, 'Analog and Digital Electronics'],
  [/\bBSC\s*301\b|\bBS-M301\b/gi, 'Mathematics Three'],
  [/\bPCC-CS401\b/gi, 'Discrete Mathematics'],
  [/\bPCC-CS402\b/gi, 'Computer Architecture'],
  [/\bPCC-CS403\b/gi, 'Formal Language and Automata Theory'],
  [/\bPCC-CS404\b/gi, 'Design and Analysis of Algorithms'],
  [/\bPCC-CS501\b/gi, 'Compiler Design'],
  [/\bPCC-CS502\b/gi, 'Operating Systems'],
  [/\bPCC-CS503\b/gi, 'Object Oriented Programming'],
  [/\bPCC-CS601\b/gi, 'Database Management Systems'],
  [/\bPCC-CS602\b/gi, 'Computer Networks'],
];

export function sanitizeForSpeech(rawText: string): string {
  if (!rawText) return '';

  let text = rawText
    // Remove multiline code blocks completely
    .replace(/```[\s\S]*?```/g, ' ')
    // Remove inline code backticks while keeping inner text
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown headings, blockquotes, horizontal rules
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove bullet dashes / asterisks / numbered list prefixes
    .replace(/^[ \t]*[-*•]\s+/gm, '')
    // Remove bold, italic, strikethrough markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove markdown links [title](url) -> title
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bare URLs
    .replace(/https?:\/\/\S+/gi, '')
    // Remove unicode emojis
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ''
    )
    // Strip ASCII tree / box-drawing / diagram characters
    .replace(/[┌┐└┘├┤┬┴┼─│╔╗╚╝═║\\|]/g, ' ')
    .replace(/---+/g, ' ');

  // Expand MAKAUT subject codes into natural spoken names
  for (const [pattern, replacement] of MAKAUT_CODE_SPOKEN_MAP) {
    text = text.replace(pattern, replacement);
  }

  return (
    text
      // Expand Big-O Complexity Notation naturally into spoken English
      .replace(/\bO\(1\)/gi, 'Big O of 1')
      .replace(/\bO\(log\s*n\)/gi, 'Big O of log n')
      .replace(/\bO\(n\s*log\s*n\)/gi, 'Big O of n log n')
      .replace(/\bO\(n\^?2\)/gi, 'Big O of n squared')
      .replace(/\bO\(n²\)/gi, 'Big O of n squared')
      .replace(/\bO\(n\^?3\)/gi, 'Big O of n cubed')
      .replace(/\bO\(n³\)/gi, 'Big O of n cubed')
      .replace(/\bO\(2\^?n\)/gi, 'Big O of 2 to the power n')
      .replace(/\bO\(2ⁿ\)/gi, 'Big O of 2 to the power n')
      .replace(/\bO\(n!\)/gi, 'Big O of n factorial')
      .replace(/\bO\(n\)/gi, 'Big O of n')
      // Expand common engineering acronyms naturally for Indian phonetics
      .replace(/\bB\+\s*tree\b/gi, 'B plus tree')
      .replace(/\bBST\b/g, 'Binary Search Tree')
      .replace(/\bAVL\b/g, 'A-V-L')
      .replace(/\bDBMS\b/g, 'D-B-M-S')
      .replace(/\bFIFO\b/g, 'Fifo')
      .replace(/\bLIFO\b/g, 'Lifo')
      .replace(/\bLRU\b/g, 'L-R-U')
      .replace(/\bSQL\b/g, 'Sequel')
      .replace(/\bCPU\b/g, 'C-P-U')
      .replace(/\bRAM\b/g, 'Ram')
      .replace(/\bROM\b/g, 'Rom')
      .replace(/\bOS\b/g, 'O-S')
      .replace(/\bDSA\b/g, 'D-S-A')
      .replace(/\bCOA\b/g, 'C-O-A')
      .replace(/\bTLB\b/g, 'T-L-B')
      .replace(/\bAPI\b/g, 'A-P-I')
      .replace(/\bMAKAUT\b/g, 'Makaut')
      .replace(/\bSETGOI\b/g, 'Setgoi')
      // Slashes between words (e.g. LIFO/FIFO or DFS/BFS) -> " or "
      .replace(/\b([A-Za-z0-9]+)\/([A-Za-z0-9]+)\b/g, '$1 or $2')
      .replace(/\//g, ' ')
      // Expand directional and equality operators
      .replace(/->|→|=>/g, ' to ')
      .replace(/<-|←/g, ' from ')
      .replace(/!=|≠/g, ' not equal to ')
      .replace(/===|==/g, ' equals ')
      .replace(/>=|≥/g, ' greater than or equal to ')
      .replace(/<=|≤/g, ' less than or equal to ')
      .replace(/&&|&/g, ' and ')
      .replace(/\|\|/g, ' or ')
      // Clean remaining harsh special characters while keeping natural punctuation
      .replace(/[\^|\$#@~{}[\]*_`]/g, ' ')
      // Collapse whitespace while preserving commas and ellipses
      .replace(/[ \t]+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*\.\.\.\s*/g, '... ')
      .trim()
  );
}

/**
 * Ensures only the concise 2-sentence spoken reaction + next question (max ~45 words)
 * is sent to TTS—never long explanations or code blocks.
 */
export function buildSpokenSummary(
  spokenText?: string | null,
  reaction?: string | null,
  nextQuestion?: string | null,
  language: 'en' | 'hi' = 'en'
): string {
  const raw =
    spokenText?.trim() ||
    `${reaction || ''} ${
      nextQuestion
        ? (language === 'hi' ? 'Agla sawal suno: ' : 'Next question: ') + nextQuestion
        : ''
    }`.trim();

  const sanitized = sanitizeForSpeech(raw);
  if (!sanitized) return '';

  // Keep at most 2–3 crisp sentences and cap around 45 words
  const sentences = sanitized
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 3);
  const joined = sentences.join(' ');
  const words = joined.split(/\s+/);
  if (words.length <= 45) return joined;
  return words.slice(0, 45).join(' ').replace(/[,;:\s]+$/, '') + '.';
}
