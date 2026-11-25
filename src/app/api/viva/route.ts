import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { auth, currentUser } from '@clerk/nextjs/server';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { prisma } from '@/lib/prisma';
import {
  getGuestAiStatus,
  recordGuestAiUsage,
  guestLimitExceededResponse,
} from '@/lib/guestAiLimit';

export const runtime = 'nodejs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface VivaRequest {
  question: string;
  answer: string;
  subject: string;
  subjectCode?: string;
  subjectName?: string;
  difficulty?: 'Quick Viva' | 'External Examiner';
  language?: 'en' | 'hi';
  history?: ChatMessage[];
  intent?: 'answer' | 'hint' | 'example' | 'skip' | 'harder' | 'opening';
  branch?: string;
  semester?: number;
  sessionId?: string | null;
}

export interface VivaResponse {
  interactionType?: 'EVALUATION' | 'GUIDANCE';
  emotion: 'idle' | 'happy' | 'shocked' | 'thinking';
  reaction: string;
  spokenFeedback?: string;
  explanation: string;
  conceptSummary?: string[];
  nextQuestion: string;
  spokenText: string; // Strictly 2-3 short, punchy, conversational sentences for voice synthesis
  difficulty?: 'Foundation' | 'Intermediate' | 'MAKAUT / GATE';
  provider: 'groq' | 'gemini' | 'simulation';
  isCorrect: boolean | null; // null for follow-up hints, examples, or questions
  topicTag: string;
  sessionId?: string | null;
  guestRemaining?: number;
}

function cleanConceptBullets(rawSummary: unknown, fallbackText: string): string[] {
  const cleanLine = (line: string) =>
    line
      .replace(/^[-*•\d.)\s]+/, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/[┌┐└┘├┤┬┴┼─│╔╗╚╝═║]/g, '')
      .trim();

  if (Array.isArray(rawSummary) && rawSummary.length > 0) {
    const cleaned = rawSummary
      .map((item) => cleanLine(String(item || '')))
      .filter((s) => s.length > 3)
      .slice(0, 3);
    if (cleaned.length > 0) return cleaned;
  }

  if (fallbackText) {
    const lines = fallbackText
      .split(/\n+/)
      .map(cleanLine)
      .filter((s) => s.length > 3)
      .slice(0, 3);
    if (lines.length > 0) return lines;
  }

  return [];
}

const SYLLABUS_ANGLES = [
  'Conceptual Foundations',
  'Code / Circuit Analysis',
  'Edge-Case Debugging',
  'Practical Lab Viva',
] as const;

async function resolveDbUser(clerkUserId: string) {
  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true, branch: true, semester: true },
  });
  if (existing) return existing;

  const clerkUser = await currentUser();
  const primaryEmail =
    clerkUser?.emailAddresses.find((e) => e.id === clerkUser?.primaryEmailAddressId)?.emailAddress ||
    clerkUser?.emailAddresses[0]?.emailAddress ||
    `${clerkUserId}@student.setgoi.ac.in`;
  const fullName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') ||
    clerkUser?.username ||
    'SETGOI Scholar';

  return prisma.user.upsert({
    where: { clerkId: clerkUserId },
    update: { email: primaryEmail, fullName },
    create: {
      clerkId: clerkUserId,
      email: primaryEmail,
      fullName,
      role: 'STUDENT',
      degree: 'B.Tech',
      branch: 'CSE',
      semester: 3,
      onboardingCompleted: true,
    },
    select: { id: true, branch: true, semester: true },
  });
}

async function getPreviousQuestionsForSubject(
  dbUserId: string,
  subject: string,
  subjectCode?: string
): Promise<string[]> {
  const pastMessages = await prisma.vivaMessage.findMany({
    where: {
      role: 'assistant',
      session: {
        userId: dbUserId,
        OR: subjectCode
          ? [{ subjectCode }, { subject }]
          : [{ subject }],
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 15,
    select: { nextQuestion: true, content: true },
  });

  const seen = new Set<string>();
  const results: string[] = [];
  for (const m of pastMessages) {
    const q = (m.nextQuestion || '').trim();
    if (q && !seen.has(q.toLowerCase())) {
      seen.add(q.toLowerCase());
      results.push(q);
    }
  }
  return results;
}

// System prompts for English and Conversational Hinglish
function getSystemPrompt(language: 'en' | 'hi'): string {
  if (language === 'hi') {
    return `You are "Viva Buddy", a witty, supportive, and brilliant senior engineer & viva examiner taking viva for B.Tech engineering students at SETGOI (Sanaka Educational Trust's Group of Institutions, Durgapur, affiliated with MAKAUT).

SPEAKING STYLE (NATURAL HINGLISH):
- Speak in natural, everyday conversational Hinglish (Roman script, e.g. "2 queues lagte hain bhai, ya 1 queue with rotation").
- Sound like a real, witty college senior or friendly professor who is evaluating viva.
- ZERO robotic jargon, ZERO filler like "tests your foundational grasp of system tradeoffs".
- Keep it punchy, authentic, and direct.

VOICE VS VISUAL EXPLANATION DUALITY (CRITICAL):
- "spokenText": This text is fed DIRECTLY into our expressive Indian neural voice synthesizer. It MUST sound like a real, witty Indian engineering professor or senior talking aloud:
  * Short, punchy sentences (strictly max 12–16 words per sentence). Total length: strictly 2–3 sentences (max ~35–45 words total).
  * Use natural commas (,) and occasional ellipses (...) for natural breathing pauses.
  * Lead with your conversational reaction ("Spot on bhai!", "Arre close tha par..."), give the single most important 1-sentence takeaway, and end introducing the next question.
  * NEVER include markdown symbols (like **, *, #, backticks), bullet points, emojis, or raw math symbols in spokenText!
  * Always spell out notations in natural spoken words (e.g. write "O of n squared" instead of "O(n²)" or "O(n^2)", "B plus tree" instead of "B+ tree", "L I F O" instead of "LIFO", "A V L rotation" instead of "AVL").
- "explanation": This is displayed VISUALLY on screen in the EXACT CONCEPT card. Keep it cleanly formatted with structured markdown, bullet points, and accurate mathematical notation for reading on screen.

MULTI-TURN CONVERSATION & INTENT HANDLING:
1. If the student is giving an ANSWER to the viva question:
   - Evaluate technical correctness.
   - If correct: "emotion": "happy", "isCorrect": true, praise with witty cheer.
   - If wrong: "emotion": "shocked", "isCorrect": false, friendly witty roast.
   - "explanation": ALWAYS state the EXACT ACCURATE technical answer FIRST, then 1 concise concept note.
   - "nextQuestion": 1 crisp next viva question for this subject.
2. If the student asks for a HINT ("hint do", "thoda clue do", "clue", etc.):
   - "emotion": "thinking", "isCorrect": null (do NOT penalize score).
   - "reaction": "Chalo ek solid hint deta hu:"
   - "explanation": Give a crisp, insightful hint without revealing the entire solution.
   - "nextQuestion": Keep the current question active or ask them to complete the thought.
3. If the student asks for an EXAMPLE ("explain with example", "udaharan do", "samjha do"):
   - "emotion": "idle", "isCorrect": null (do NOT penalize score).
   - "reaction": "Real-world example se samajhte hain:"
   - "explanation": Provide a concrete, easy-to-grasp example or mini code mental model.
   - "nextQuestion": Ask a quick follow-up to check their understanding.
4. If the student SURRENDERS ("nahi pata", "dont know", "skip", "pass"):
   - "emotion": "shocked", "isCorrect": false.
   - "reaction": Friendly encouragement, e.g. "Seat pe panic mat ho bhai! Ye suno exact answer:"
   - "explanation": Give the exact technical answer directly.
   - "nextQuestion": 1 fresh next viva question.
5. If the student asks for a HARDER question ("ask harder", "kuch tough pucho"):
   - "emotion": "thinking", "isCorrect": null.
   - "reaction": "Oho! Heavy driver mode on?! Lo ye solve karke dikhao:"
   - "explanation": Brief context on why this is an advanced MAKAUT/GATE question.
   - "nextQuestion": An advanced, tricky viva question.

TOPIC TAG:
- Always supply a clean, specific 2-4 word topic tag in "topicTag" (e.g. "Stack via Queues", "QuickSort Worst Case", "Coffman Deadlock", "ACID Isolation", "Barkhausen Criterion", "Cache Locality", etc.).

OUTPUT FORMAT (STRICT JSON ONLY):
Return valid JSON with these exact keys:
{
  "interactionType": "EVALUATION" | "GUIDANCE",
  "emotion": "happy" | "shocked" | "thinking" | "idle",
  "spokenFeedback": "<1-2 crisp natural Hinglish sentences, plain text only, ZERO markdown>",
  "conceptSummary": ["<clean bullet 1 without ** asterisks or ASCII trees>", "<clean bullet 2>"],
  "spokenText": "<2-3 short, punchy sentences specifically for speech voice, max 40 words>",
  "nextQuestion": "<crisp next question>",
  "difficulty": "Foundation" | "Intermediate" | "MAKAUT / GATE",
  "isCorrect": true | false | null,
  "topicTag": "<concise topic tag>"
}
CRITICAL RULES:
- NEVER include raw "**" markdown asterisks or ASCII art trees in any field. If illustrating a tree/stack/circuit, describe the step-by-step trace cleanly in prose.
- When the student clicks Hint, Example, or Harder (GUIDANCE), set "interactionType": "GUIDANCE", "isCorrect": null, and respond like a helpful professor ("Chalo step-by-step samajhte hain...")—NEVER say "Spot on!" or grade them.`;
  }

  return `You are "Viva Buddy", a witty, sharp, and encouraging B.Tech engineering senior and viva examiner at SETGOI (Sanaka Educational Trust's Group of Institutions, Durgapur, affiliated with MAKAUT).

SPEAKING STYLE (NATURAL INDIAN ENGLISH):
- Speak like an articulate engineering mentor or friendly examiner.
- ZERO robotic filler phrases (never say "tests your foundational grasp of system tradeoffs" or "this demonstrates an invariant").
- Concise, conversational, witty, and crystal clear.

VOICE VS VISUAL EXPLANATION DUALITY (CRITICAL):
- "spokenText": This text is fed DIRECTLY into our expressive Indian neural voice synthesizer. It MUST sound like an articulate, encouraging Indian engineering mentor or professor speaking aloud:
  * Short, punchy sentences (strictly max 12–16 words per sentence). Total length: strictly 2–3 sentences (max ~35–45 words total).
  * Use natural commas (,) and occasional ellipses (...) for natural breathing pauses.
  * Lead with your natural reaction ("Spot on!", "Close attempt, but..."), state the key 1-sentence technical takeaway, and end introducing the next question.
  * NEVER include markdown symbols (like **, *, #, backticks), bullet points, emojis, or raw math symbols in spokenText!
  * Always spell out notations in natural spoken words (e.g. write "O of n squared" instead of "O(n²)" or "O(n^2)", "B plus tree" instead of "B+ tree", "L I F O" instead of "LIFO", "D S A" instead of "DSA").
- "explanation": This is displayed VISUALLY on screen in the EXACT CONCEPT card. Keep it cleanly formatted with structured markdown, bullet points, and accurate mathematical notation for reading on screen.

MULTI-TURN CONVERSATION & INTENT HANDLING:
1. If the student is giving an ANSWER to the viva question:
   - Evaluate technical correctness.
   - If correct: "emotion": "happy", "isCorrect": true, praise with witty cheer.
   - If wrong: "emotion": "shocked", "isCorrect": false, witty roast.
   - "explanation": ALWAYS state the EXACT ACCURATE technical answer FIRST, then 1 concise concept sentence.
   - "nextQuestion": 1 crisp next viva question for this subject.
2. If the student asks for a HINT ("give me a hint", "clue", etc.):
   - "emotion": "thinking", "isCorrect": null (do NOT penalize score).
   - "reaction": "Here is a guiding hint from the examiner desk:"
   - "explanation": Give a clear, helpful clue without spoiling the final answer.
   - "nextQuestion": Keep current question active or ask them to connect the clue.
3. If the student asks for an EXAMPLE ("explain with example", "give an analogy"):
   - "emotion": "idle", "isCorrect": null (do NOT penalize score).
   - "reaction": "Let us break it down with a concrete engineering example:"
   - "explanation": Provide a real-world system architecture or code example.
   - "nextQuestion": Ask a follow-up question to test their understanding.
4. If the student SURRENDERS ("don't know", "skip", "pass", "no idea"):
   - "emotion": "shocked", "isCorrect": false.
   - "reaction": Friendly encouragement, e.g. "Caught in the hot seat! Don't sweat it, here is the exact answer:"
   - "explanation": Give the exact technical answer directly.
   - "nextQuestion": 1 fresh next viva question.
5. If the student asks for a HARDER question ("ask harder", "give me something tougher"):
   - "emotion": "thinking", "isCorrect": null.
   - "reaction": "Leveling up! Let us see how you handle this MAKAUT/GATE favorite:"
   - "explanation": Brief note on why this is a high-depth topic.
   - "nextQuestion": An advanced, tricky viva question.

TOPIC TAG:
- Always supply a clean, specific 2-4 word topic tag in "topicTag" (e.g. "Stack via Queues", "QuickSort Worst Case", "Coffman Deadlock", "ACID Isolation", "Barkhausen Criterion", "Cache Locality", etc.).

OUTPUT FORMAT (STRICT JSON ONLY):
Return valid JSON with these exact keys:
{
  "interactionType": "EVALUATION" | "GUIDANCE",
  "emotion": "happy" | "shocked" | "thinking" | "idle",
  "spokenFeedback": "<1-2 crisp natural sentences, plain text only, ZERO markdown>",
  "conceptSummary": ["<clean bullet 1 without ** asterisks or ASCII trees>", "<clean bullet 2>"],
  "spokenText": "<2-3 short, punchy sentences specifically for speech voice, max 40 words>",
  "nextQuestion": "<crisp next question>",
  "difficulty": "Foundation" | "Intermediate" | "MAKAUT / GATE",
  "isCorrect": true | false | null,
  "topicTag": "<concise topic tag>"
}
CRITICAL RULES:
- NEVER include raw "**" markdown asterisks or ASCII art trees in any field. If illustrating a tree/stack/circuit, describe the step-by-step trace cleanly in prose.
- When the student asks for a Hint, Example, or Harder question (GUIDANCE), set "interactionType": "GUIDANCE", "isCorrect": null, and respond naturally as a helpful professor ("Sure, let us trace this step by step...")—NEVER say "Spot on!" or grade them.`;
}

// Grounded intelligent simulation engine with exact technical answers
function getSimulatedVivaResponse(
  question: string,
  answer: string,
  subject: string,
  language: 'en' | 'hi' = 'en',
  intent?: 'answer' | 'hint' | 'example' | 'skip' | 'harder'
): VivaResponse {
  const normAns = answer.toLowerCase().trim();
  const isHi = language === 'hi';
  const normQ = question.toLowerCase();

  // Detect student intent if not explicitly tagged
  const isHintRequest = intent === 'hint' || normAns.includes('hint') || normAns.includes('clue');
  const isExampleRequest = intent === 'example' || normAns.includes('example') || normAns.includes('udaharan') || normAns.includes('samjha');
  const isHarderRequest = intent === 'harder' || normAns.includes('harder') || normAns.includes('tough') || normAns.includes('mushkil');
  const isSurrender =
    intent === 'skip' ||
    normAns.includes("don't know") ||
    normAns.includes('dont know') ||
    normAns.includes('pass') ||
    normAns.includes('skip') ||
    normAns.includes('nahi pata') ||
    normAns.includes('pata nahi') ||
    normAns.includes('dunno') ||
    normAns.length < 3;

  // 1. Hint Handling
  if (isHintRequest) {
    let hintText = '';
    let topic = 'General Concept';
    if (normQ.includes('queue') || normQ.includes('stack')) {
      topic = 'Stack Implementation via Queues';
      hintText = isHi
        ? 'Hint: Socho jab naya element enqueue karte ho, to puraane elements ko pop karke rotate karne se kya LIFO order ban sakta hai?'
        : 'Hint: Think about rotation. After enqueuing a new element, what happens if you dequeue existing elements and push them back?';
    } else if (normQ.includes('quicksort')) {
      topic = 'QuickSort Complexity';
      hintText = isHi
        ? 'Hint: Jab array already sorted ho aur pivot first element chun liya jaye, to partition split kaisa banta hai?'
        : 'Hint: Consider an already sorted array where the pivot chosen is always the minimum or maximum element.';
    } else if (normQ.includes('deadlock') || normQ.includes('coffman')) {
      topic = 'Coffman Conditions';
      hintText = isHi
        ? 'Hint: Char conditions mein se ek circular chain of waiting hoti hai, aur doosra non-sharable resource use.'
        : 'Hint: One involves a circular chain of waiting threads, and another involves resources that cannot be shared simultaneously.';
    } else if (normQ.includes('acid')) {
      topic = 'ACID Properties';
      hintText = isHi
        ? 'Hint: "All-or-Nothing" transaction behavior kis letter se aata hai? Aur crash ke baad data survive karne ko kya kehte hain?'
        : 'Hint: Which letter ensures an "all-or-nothing" execution, and which one guarantees persistence after a power failure?';
    } else {
      topic = `${subject} Fundamentals`;
      hintText = isHi
        ? 'Hint: Core operational principle aur memory invariant ko focus karo.'
        : 'Hint: Focus on the fundamental hardware/memory trade-off behind this.';
    }

    const spokenText = isHi
      ? `Chalo ek solid hint deta hu: ${hintText}`
      : `Here is a guiding hint: ${hintText}`;

    return {
      emotion: 'thinking',
      reaction: isHi ? 'Chalo ek solid hint deta hu:' : 'Here is a guiding hint from the examiner:',
      explanation: hintText,
      nextQuestion: question,
      spokenText,
      provider: 'simulation',
      isCorrect: null,
      topicTag: topic,
    };
  }

  // 2. Example Handling
  if (isExampleRequest) {
    let exampleText = '';
    let topic = 'Practical Example';
    if (normQ.includes('queue') || normQ.includes('stack')) {
      topic = 'Stack Implementation via Queues';
      exampleText = isHi
        ? 'Real example: Maan lo queue me [10] hai. Tumhe 20 push karna hai. Pehle 20 enqueue karo -> [10, 20]. Phir 10 ko nikaal kar peeche daal do -> [20, 10]. Ab queue ka front 20 hai, jo LIFO top ban gaya!'
        : 'Concrete Example: Say your queue has [10]. You want to push 20. Enqueue 20 -> [10, 20]. Now dequeue 10 and enqueue it -> [20, 10]. The head is 20, perfectly emulating LIFO stack behavior!';
    } else if (normQ.includes('quicksort')) {
      topic = 'QuickSort Worst Case';
      exampleText = isHi
        ? 'Real example: Agar array [1, 2, 3, 4, 5] hai aur pivot pehla element (1) liya, to partitions banenge [] aur [2, 3, 4, 5]. Har baar n elements traverse honge, total steps: n + (n-1) + ... = O(n²)!'
        : 'Concrete Example: On an already sorted array [1, 2, 3, 4, 5], picking the first element yields partitions [] and [2, 3, 4, 5]. Recurrence becomes T(n) = T(n-1) + O(n), totaling O(n²)!';
    } else if (normQ.includes('deadlock') || normQ.includes('coffman')) {
      topic = 'Deadlock Prevention';
      exampleText = isHi
        ? 'Real example: Ek single-lane bridge par do trucks aamne-saamne aa gaye. Dono aage badhna chahte hain (Hold & Wait) aur koi reverse nahi karna chahta (No Preemption). Yahi circular deadlock hai!'
        : 'Concrete Example: Two trains heading towards each other on a single track. Neither can proceed (Mutual Exclusion), each claims its section (Hold & Wait), and neither can be derailed (No Preemption). Classic deadlock!';
    } else {
      topic = `${subject} Architecture`;
      exampleText = isHi
        ? 'Real-world example: System architecture mein cache line invalidation aur RAM bus delays is concept ko directly affect karte hain.'
        : 'Concrete Example: In production microarchitectures, cache line transfers across L1/L2 and bus contention illustrate this trade-off.';
    }

    const spokenText = isHi
      ? `Real-world example se samajhte hain. ${question}`
      : `Let us illustrate this with a concrete example. ${question}`;

    return {
      emotion: 'idle',
      reaction: isHi ? 'Real-world example se samajhte hain:' : 'Let us illustrate this with a concrete example:',
      explanation: exampleText,
      nextQuestion: question,
      spokenText,
      provider: 'simulation',
      isCorrect: null,
      topicTag: topic,
    };
  }

  // 3. Ask Harder Handling
  if (isHarderRequest) {
    const topic = `${subject} Advanced`;
    const nextQ = isHi
      ? 'B+ Tree mein leaf nodes ke beech doubly-linked list kyu hoti hai jabki standard B-Tree mein nahi hoti?'
      : 'Why do B+ Trees maintain a doubly-linked list among leaf nodes while B-Trees do not?';

    const spokenText = isHi
      ? `Oho, heavy driver mode on! Lo ye advance sawal solve karke dikhao: ${nextQ}`
      : `Leveling up! Let us see how you handle this advanced question: ${nextQ}`;

    return {
      emotion: 'thinking',
      reaction: isHi ? 'Oho! Heavy driver mode on! Ye advance sawal tackle karo:' : 'Leveling up! Here is an advanced question from MAKAUT / GATE:',
      explanation: isHi
        ? 'GATE aur external examiners aksar boundary conditions aur amortized complexity par students ko test karte hain.'
        : 'External examiners frequently probe edge-case amortized bounds and memory barrier semantics.',
      nextQuestion: nextQ,
      spokenText,
      provider: 'simulation',
      isCorrect: null,
      topicTag: topic,
    };
  }

  // 4. Standard Answer Evaluation
  let isCorrect = false;
  let reaction = '';
  let explanation = '';
  let nextQuestion = '';
  let topicTag = 'Technical Fundamentals';

  if (normQ.includes('queue') && normQ.includes('stack')) {
    topicTag = 'Stack Implementation via Queues';
    if (normAns.includes('2') || normAns.includes('two') || normAns.includes('1') || normAns.includes('one')) {
      isCorrect = true;
      reaction = isHi
        ? 'Bilkul sahi jawab! 2 queues lagte hain, ya 1 queue with rotation!'
        : 'Spot on! You need 2 queues, or 1 queue with rotation on push.';
      explanation = isHi
        ? '2 queues lagte hain bhai, ya 1 queue with rotation. Enqueue karte waqt purane elements ko pop karke rotate kar do taaki LIFO order maintain ho jaye.'
        : 'You need 2 queues, or 1 queue with element rotation on push. By dequeuing previous elements and reenqueuing them behind the newly pushed item, you invert FIFO into LIFO.';
      nextQuestion = isHi
        ? 'Stack ko implement karne mein push aur pop ki time complexity kya aati hai?'
        : 'What is the push and pop time complexity when implementing a stack using two queues?';
    } else {
      isCorrect = false;
      reaction = isHi
        ? 'Galat jawab bhai! External examiner ne red pen utha liya!'
        : 'Not quite! That misses the fundamental queue-to-stack implementation.';
      explanation = isHi
        ? '2 queues lagte hain bhai, ya 1 queue with rotation. Push operation mein new element daalne ke baad pehle ke sabhi elements ko rotate karke piche bhejna padta hai taaki top element sabse aage rahe.'
        : 'The exact answer is 2 queues (or 1 queue with rotation). During push, you enqueue the new element and rotate all existing elements behind it so the latest element is always at the queue head.';
      nextQuestion = isHi
        ? 'Array aur Singly Linked List mein memory cache locality ka kya difference hota hai?'
        : 'What is the difference between an Array and a Singly Linked List regarding CPU cache locality?';
    }
  } else if (normQ.includes('quicksort') && (normQ.includes('worst') || normQ.includes('average'))) {
    topicTag = 'QuickSort Worst Case';
    if (normAns.includes('n^2') || normAns.includes('n*n') || normAns.includes('quadratic') || normAns.includes('n squared')) {
      isCorrect = true;
      reaction = isHi
        ? 'Ekdum correct! O(n²) worst case time complexity hoti hai!'
        : 'Exact and spot-on! QuickSort worst case is O(n²).';
      explanation = isHi
        ? 'QuickSort ka worst case O(n²) hota hai jab pivot always smallest ya largest element ban jaye (jaise already sorted array). Randomized pivot ya median-of-three se ye O(n log n) ho jata hai.'
        : 'QuickSort worst-case time complexity is O(n²), which happens when the chosen pivot consistently splits the array into sizes 0 and n-1. Randomized pivot selection avoids this, guaranteeing expected O(n log n).';
      nextQuestion = isHi
        ? 'QuickSort aur MergeSort mein se kisme auxiliary memory jyada lagti hai aur kyu?'
        : 'Why does MergeSort require O(n) auxiliary space while QuickSort is in-place?';
    } else {
      isCorrect = false;
      reaction = isHi
        ? 'Blunder alert! QuickSort ka worst case O(n log n) nahi hota!'
        : 'Incorrect! QuickSort worst-case collapses to quadratic time.';
      explanation = isHi
        ? 'Worst-case complexity O(n²) hoti hai. Jab array pehle se sorted ho aur pivot pehla ya aakhri element choose kiya jaye, to recurrence T(n) = T(n-1) + O(n) ban jati hai jo O(n²) deti hai.'
        : 'The exact answer is O(n²). When the input array is already sorted and an unbalanced pivot is chosen, the partition step yields 0 and n-1 subproblems, degenerating into O(n²).';
      nextQuestion = isHi
        ? 'Dijkstra algorithm negative edge weights par kyu fail hota hai?'
        : 'Why does Dijkstra’s algorithm fail when a graph has negative edge weights?';
    }
  } else if (normQ.includes('coffman') || normQ.includes('deadlock')) {
    topicTag = 'Coffman Deadlock Conditions';
    if (normAns.includes('mutual exclusion') || normAns.includes('hold and wait') || normAns.includes('circular wait') || normAns.includes('preemption')) {
      isCorrect = true;
      reaction = isHi
        ? 'Shandar! Charo Coffman conditions yaad hain aapko!'
        : 'Excellent! You named the core Coffman conditions accurately.';
      explanation = isHi
        ? 'Deadlock hone ke liye 4 conditions simultaneously honi chahiye: Mutual Exclusion, Hold & Wait, No Preemption, aur Circular Wait. Inme se kisi ek ko break karne se deadlock avoid ho jata hai.'
        : 'The 4 mandatory conditions are Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. Breaking any single condition prevents deadlock entirely.';
      nextQuestion = isHi
        ? 'Banker’s Algorithm safe state check karne ke liye kaunsi data structures use karta hai?'
        : 'Which matrices are used by the Banker’s Algorithm to determine system safe states?';
    } else {
      isCorrect = false;
      reaction = isHi
        ? 'Ouch! Coffman conditions clear nahi hain bhai!'
        : 'Incorrect! The system just slipped into a circular wait.';
      explanation = isHi
        ? 'Deadlock ke 4 Coffman conditions hote hain: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, aur 4. Circular Wait. Agar ye charo ek sath sach hon tabhi deadlock banta hai.'
        : 'The 4 Coffman conditions are Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. All four must hold simultaneously for a deadlock to occur.';
      nextQuestion = isHi
        ? 'Process aur Thread ke memory space mein kya antar hota hai?'
        : 'What is the fundamental difference in address space between a Process and a Thread?';
    }
  } else if (normQ.includes('acid')) {
    topicTag = 'ACID Database Properties';
    if (normAns.includes('atomicity') || normAns.includes('consistency') || normAns.includes('isolation') || normAns.includes('durability')) {
      isCorrect = true;
      reaction = isHi
        ? 'Badhiya! ACID transactions ke charo pillars ekdum clear hain!'
        : 'Flawless! ACID properties are the backbone of relational DBMS.';
      explanation = isHi
        ? 'ACID ka matlab hai Atomicity (all-or-nothing), Consistency (integrity constraints), Isolation (concurrent transactions overlap na kare), aur Durability (commit ke baad crash pe bhi data safe rahe).'
        : 'ACID stands for Atomicity (all-or-nothing), Consistency (valid states preserved), Isolation (independent concurrent execution), and Durability (committed data survives crashes).';
      nextQuestion = isHi
        ? '2NF aur 3NF mein transitive dependency ka kya role hota hai?'
        : 'What is the role of transitive functional dependency in transitioning from 2NF to 3NF?';
    } else {
      isCorrect = false;
      reaction = isHi
        ? 'Transaction abort ho gaya! ACID ka full form galat bataya!'
        : 'Transaction rollback! That is not what ACID properties mean.';
      explanation = isHi
        ? 'ACID ka full form hai Atomicity, Consistency, Isolation, aur Durability. Ye database transactions ko crashes aur concurrent reads ke waqt reliable banaye rakhte hain.'
        : 'The exact answer is Atomicity, Consistency, Isolation, and Durability. These properties ensure database reliability and consistency during crashes and concurrent access.';
      nextQuestion = isHi
        ? 'B+ Tree aur B-Tree mein internal nodes ka kya difference hota hai?'
        : 'Why do relational databases use B+ Trees rather than Hash tables for indexing?';
    }
  } else if (normQ.includes('barkhausen') || normQ.includes('oscillator')) {
    topicTag = 'Barkhausen Criterion';
    if (normAns.includes('1') || normAns.includes('360') || normAns.includes('0') || normAns.includes('loop gain') || normAns.includes('phase')) {
      isCorrect = true;
      reaction = isHi
        ? 'Exact answer! Barkhausen criterion bilkul sahi bataya!'
        : 'Crisp and accurate! Barkhausen criterion stated correctly.';
      explanation = isHi
        ? 'Barkhausen criterion kehta hai ki loop gain |Aβ| barabar 1 hona chahiye, aur total phase shift 0° ya 360° hona chahiye (positive feedback) sustained oscillations ke liye.'
        : 'The Barkhausen criterion requires: 1. The magnitude of loop gain |Aβ| must equal 1, and 2. Total phase shift around the loop must be 0° or 360° for sustained oscillation.';
      nextQuestion = isHi
        ? 'Common Emitter (CE) BJT amplifier 180 degree phase shift kyu deta hai?'
        : 'Why does a Common Emitter (CE) amplifier invert the signal phase by 180 degrees?';
    } else {
      isCorrect = false;
      reaction = isHi
        ? 'Oscillator band pad gaya! Barkhausen condition miss ho gayi!'
        : 'Incorrect! The oscillator fails to sustain oscillations.';
      explanation = isHi
        ? 'Sustained oscillations ke liye 2 conditions hoti hain: 1. Loop gain |Aβ| = 1 hona chahiye, aur 2. Total phase shift loop ke around 0° ya 360° hona chahiye.'
        : 'The exact conditions are: 1. Loop gain magnitude |Aβ| must equal exactly 1, and 2. Total phase shift around the feedback loop must be 0° or 360°.';
      nextQuestion = isHi
        ? 'Flip-flop mein setup time aur hold time violation se kya hota hai?'
        : 'What is metastability and how does setup/hold time violation trigger it in flip-flops?';
    }
  } else {
    // General subject question handling
    topicTag = `${subject} Concepts`;
    if (isSurrender) {
      isCorrect = false;
      reaction = isHi
        ? 'Koi baat nahi bhai! Hot seat pe panic mat ho, yaha suno exact answer:'
        : 'No worries at all! Here is the exact technical answer so you ace this in the real viva:';
      explanation = isHi
        ? `Is sawal ka core point ye hai ki ${subject} mein hamesha standard definitions aur operational mechanism state karna hota hai. Exam mein pehle exact formula ya direct condition batao.`
        : `In ${subject}, always lead with the direct operational condition or complexity bound. Stating the exact mathematical invariant immediately secures full marks with the external examiner.`;
      nextQuestion = isHi
        ? 'Chalo agla sawal try karo: Array aur Linked List mein random access time complexity ka difference kya hai?'
        : 'Let us try this: What is the time complexity difference for random access between an Array and a Singly Linked List?';
    } else {
      isCorrect = normAns.length > 20 && !normAns.includes('magic') && !normAns.includes('random');
      reaction = isCorrect
        ? (isHi ? 'Badhiya explanation! Technical point pakad liya aapne!' : 'Solid answer! You hit the core technical mechanism.')
        : (isHi ? 'Arre nahi bhai! Ye concept syllabus ke hisab se galat hai!' : 'Not quite! That misses the primary syllabus definition.');
      explanation = isHi
        ? `Is sawal mein exact answer ke liye ${subject} ke core design principle aur boundary conditions ko dhyan mein rakhna hota hai.`
        : `For this question, always emphasize the architectural trade-off and boundary conditions specific to ${subject}.`;
      nextQuestion = isHi
        ? 'Agla sawal: Cache memory mein Spatial Locality aur Temporal Locality ka kya fark hai?'
        : 'Next question: What is the difference between Spatial Locality and Temporal Locality in cache memory?';
    }
  }

  const spokenText = `${reaction} ${
    isCorrect === true
      ? (isHi ? 'Bahut badhiya! ' : 'Great job! ')
      : isCorrect === false
      ? (isHi ? 'Sahi concept card par dekho. ' : 'Check the exact concept card. ')
      : ''
  }${nextQuestion ? (isHi ? 'Agla sawal suno: ' : 'Next question: ') + nextQuestion : ''}`.trim();

  return {
    emotion: isCorrect ? 'happy' : 'shocked',
    reaction,
    explanation,
    nextQuestion,
    spokenText,
    provider: 'simulation',
    isCorrect,
    topicTag,
  };
}

export async function POST(req: Request) {
  try {
    // 1. Auth & Strict 2-Response Guest Gate (BEFORE calling any LLM)
    const { userId } = await auth().catch(() => ({ userId: null }));
    const guestStatus = getGuestAiStatus(req, userId);
    if (!guestStatus.allowed) {
      return guestLimitExceededResponse();
    }

    // 2. Rate limiting check (40 requests / hour per user/IP)
    const clientId = getClientIdentifier(req, userId);
    const rateCheck = await checkRateLimit(`${clientId}:viva`, 40, 60 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'Rate limit reached. You have completed your 40 viva queries for this hour. Please try again later.',
          retryAfter: rateCheck.retryAfterSeconds,
          spokenText: 'You have hit your viva rate limit for this hour! Take a short break, review your notes, and jump back in shortly.',
          reaction: 'Rate limit reached! Take a breather.',
          explanation: `Hourly rate limit of 40 requests reached. Window resets in ${Math.ceil(rateCheck.retryAfterSeconds / 60)} minutes.`,
          emotion: 'thinking',
          nextQuestion: 'Ready to continue when your rate limit resets?',
          provider: 'simulation',
          isCorrect: null,
          topicTag: 'Rate Limit',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.retryAfterSeconds),
            'X-RateLimit-Limit': String(rateCheck.limit),
            'X-RateLimit-Remaining': String(rateCheck.remaining),
          },
        }
      );
    }

    const body: VivaRequest = await req.json();
    const {
      question,
      answer,
      subject = 'DSA',
      subjectCode,
      subjectName,
      difficulty = 'Quick Viva',
      language = 'en',
      history = [],
      intent: rawIntent = 'answer',
      branch,
      semester,
      sessionId,
    } = body;
    const intent = (String(rawIntent).toLowerCase() || 'answer') as
      | 'answer'
      | 'hint'
      | 'example'
      | 'skip'
      | 'harder'
      | 'opening';

    if (intent !== 'opening' && (!question || !answer)) {
      return NextResponse.json(
        { error: 'Both question and student answer are required.' },
        { status: 400 }
      );
    }

    // Resolve DB user & anti-repeat question history for logged-in students
    let dbUser: { id: string; branch: string | null; semester: number | null } | null = null;
    let previousQuestions: string[] = [];
    if (userId) {
      try {
        dbUser = await resolveDbUser(userId);
        previousQuestions = await getPreviousQuestionsForSubject(dbUser.id, subject, subjectCode);
      } catch (dbErr) {
        console.warn('[Viva Buddy] Could not fetch previous questions:', dbErr);
      }
    }

    const rotatedAngle =
      SYLLABUS_ANGLES[previousQuestions.length % SYLLABUS_ANGLES.length];

    // Fetch faculty-seeded CustomVivaQuestion items for this subject/branch
    let facultyQuestionsBlock = '';
    if (subjectCode || branch || dbUser?.branch) {
      try {
        const effectiveBranch = (branch || dbUser?.branch || '').toUpperCase().trim();
        const customQs = await prisma.customVivaQuestion.findMany({
          where: {
            ...(subjectCode ? { subjectCode: subjectCode.toUpperCase().trim() } : {}),
            ...(effectiveBranch ? { branch: effectiveBranch } : {}),
          },
          orderBy: { createdAt: 'desc' },
          take: 6,
        });
        const unaskedCustomQs = customQs.filter(
          (q) => !previousQuestions.some((pq) => pq.toLowerCase().includes(q.question.toLowerCase().slice(0, 28)))
        );
        if (unaskedCustomQs.length > 0) {
          facultyQuestionsBlock = `\n\nPRIORITY FACULTY-SEEDED VIVA QUESTIONS (SETGOI DEPARTMENT QUESTION BANK):
Prefer asking one of these official faculty-curated questions (and evaluate the student against the expected key points) before inventing a generic one:
${unaskedCustomQs
  .map((q, idx) => `${idx + 1}. Question: "${q.question}" | Expected Key Points: "${q.expectedKeyPoints}"`)
  .join('\n')}`;
        }
      } catch (qErr) {
        console.warn('[Viva Buddy] Could not load CustomVivaQuestion:', qErr);
      }
    }

    const antiRepeatBlock =
      previousQuestions.length > 0
        ? `\n\nANTI-REPETITION & SYLLABUS ROTATION (CRITICAL):
- Focus this question on the syllabus angle: "${rotatedAngle}".
- DO NOT REPEAT THESE PREVIOUSLY ASKED QUESTIONS: ${JSON.stringify(previousQuestions.slice(0, 15))}`
        : `\n\nSYLLABUS FOCUS ANGLE: "${rotatedAngle}". Ask a fresh, varied MAKAUT viva question from this angle.`;

    const systemPrompt = getSystemPrompt(language) + facultyQuestionsBlock + antiRepeatBlock;

    // Prepare conversational message list (last 8 turns)
    const recentHistory = (history || []).slice(-8);

    const currentUserPrompt =
      intent === 'opening'
        ? `SUBJECT: ${subject}${subjectCode ? ` (${subjectCode})` : ''}${subjectName ? ` - ${subjectName}` : ''}
STUDENT PROFILE: ${branch || dbUser?.branch ? `B.Tech ${branch || dbUser?.branch}` : 'B.Tech Engineering'}${semester || dbUser?.semester ? `, Semester ${semester || dbUser?.semester}` : ''} (MAKAUT Curriculum)
DIFFICULTY: ${difficulty}
LANGUAGE MODE: ${language === 'hi' ? 'Hinglish (Conversational Roman Hindi)' : 'Natural Indian English'}
TASK: Generate ONE fresh, engaging opening viva question for this subject from the "${rotatedAngle}" angle. Set "emotion": "idle", "isCorrect": null, "reaction": short warm welcome line, "explanation": "", "nextQuestion": "<your fresh opening question>", "spokenText": "<short spoken welcome + the opening question>", "topicTag": "<concise topic tag>".`
        : `SUBJECT: ${subject}${subjectCode ? ` (${subjectCode})` : ''}
STUDENT PROFILE: ${branch ? `B.Tech ${branch}` : 'B.Tech Engineering'}${semester ? `, Semester ${semester}` : ''} (MAKAUT Curriculum)
DIFFICULTY: ${difficulty}
STUDENT INTENT: ${intent}
LANGUAGE MODE: ${language === 'hi' ? 'Hinglish (Conversational Roman Hindi)' : 'Natural Indian English'}
CURRENT VIVA QUESTION: "${question}"
STUDENT'S RESPONSE: "${answer}"

Evaluate the student's response according to your system prompt rules.
Remember:
1. If answering: state EXACT SHORT ACCURATE technical answer FIRST.
2. If asking for a hint or example or harder question: set "isCorrect": null, provide insightful hint/example/harder question without penalizing score.
3. Always supply a concise "topicTag" representing the subject syllabus concept.`;

    const finalizeResponse = async (vivaRes: VivaResponse): Promise<NextResponse> => {
      const headers = new Headers();
      let finalSessionId: string | null = sessionId || null;

      // Persist turn to Neon DB for logged-in users (except initial opening prompt)
      if (dbUser && intent !== 'opening') {
        try {
          let activeSession = finalSessionId
            ? await prisma.vivaSession.findUnique({ where: { id: finalSessionId } })
            : null;

          if (activeSession && activeSession.userId !== dbUser.id) {
            activeSession = null;
          }

          const scoreDelta = vivaRes.isCorrect === true ? 1 : 0;
          const totalDelta = vivaRes.isCorrect !== null ? 1 : 0;

          if (!activeSession) {
            activeSession = await prisma.vivaSession.create({
              data: {
                userId: dbUser.id,
                subject,
                subjectCode: subjectCode || null,
                subjectName: subjectName || subject,
                branch: branch || dbUser.branch || 'CSE',
                semester: semester || dbUser.semester || 3,
                title: `${subjectCode ? `${subjectCode} • ` : ''}${subjectName || subject}`,
                language,
                score: scoreDelta,
                totalQuestions: totalDelta,
                weakTopics: vivaRes.isCorrect === false ? vivaRes.topicTag || subject : null,
              },
            });
          } else {
            activeSession = await prisma.vivaSession.update({
              where: { id: activeSession.id },
              data: {
                score: (activeSession.score || 0) + scoreDelta,
                totalQuestions: (activeSession.totalQuestions || 0) + totalDelta,
                ...(vivaRes.isCorrect === false && vivaRes.topicTag
                  ? {
                      weakTopics: activeSession.weakTopics
                        ? `${activeSession.weakTopics}, ${vivaRes.topicTag}`
                        : vivaRes.topicTag,
                    }
                  : {}),
              },
            });
          }

          finalSessionId = activeSession.id;

          await prisma.vivaMessage.createMany({
            data: [
              {
                sessionId: activeSession.id,
                role: 'user',
                content: answer,
                topicTag: vivaRes.topicTag || null,
              },
              {
                sessionId: activeSession.id,
                role: 'assistant',
                content: vivaRes.explanation || vivaRes.reaction || vivaRes.nextQuestion,
                reaction: vivaRes.reaction || null,
                explanation: vivaRes.explanation || null,
                nextQuestion: vivaRes.nextQuestion || null,
                spokenText: vivaRes.spokenText || null,
                emotion: vivaRes.emotion || 'idle',
                isCorrect: vivaRes.isCorrect,
                score: vivaRes.isCorrect === true ? 1 : vivaRes.isCorrect === false ? 0 : null,
                feedback: vivaRes.explanation || null,
                topicTag: vivaRes.topicTag || null,
                provider: vivaRes.provider || null,
              },
            ],
          });
        } catch (persistErr) {
          console.error('[Viva Buddy] Failed to persist VivaSession/VivaMessage:', persistErr);
        }
      }

      let guestRemaining: number | undefined = undefined;
      if (guestStatus.isGuest && intent !== 'opening') {
        const usage = recordGuestAiUsage(req, guestStatus.count);
        headers.set('Set-Cookie', usage.setCookieHeader);
        headers.set('X-Guest-Remaining', String(usage.remaining));
        guestRemaining = usage.remaining;
      }

      return NextResponse.json(
        {
          ...vivaRes,
          sessionId: finalSessionId,
          ...(guestRemaining !== undefined ? { guestRemaining } : {}),
        },
        { headers }
      );
    };

    // 1. Primary: Groq API
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey && groqApiKey.trim().length > 10 && !groqApiKey.includes('placeholder')) {
      const groqModels = ['llama-3.3-70b-versatile', 'openai/gpt-oss-120b', 'qwen/qwen3.8-27b'];

      const groqMessages = [
        { role: 'system', content: systemPrompt },
        ...recentHistory.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        { role: 'user', content: currentUserPrompt },
      ];

      for (const modelName of groqModels) {
        try {
          const groqController = new AbortController();
          const timeoutId = setTimeout(() => groqController.abort(), 5500);

          const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${groqApiKey.trim()}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelName,
              messages: groqMessages,
              temperature: 0.8,
              max_tokens: 450,
              response_format: { type: 'json_object' },
            }),
            signal: groqController.signal,
          });

          clearTimeout(timeoutId);

          if (groqResponse.ok) {
            const data = await groqResponse.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) {
              const parsed = JSON.parse(content);
              const isGuidance = intent === 'hint' || intent === 'example' || intent === 'harder' || intent === 'opening';
              const emotion = ['idle', 'happy', 'shocked', 'thinking'].includes(parsed.emotion)
                ? parsed.emotion
                : isGuidance
                ? 'thinking'
                : parsed.isCorrect === true
                ? 'happy'
                : 'shocked';

              const spokenFeedback = (
                parsed.spokenFeedback ||
                parsed.reaction ||
                (language === 'hi' ? 'Chalo aage badhte hain!' : 'Let us continue!')
              )
                .replace(/\*\*/g, '')
                .trim();
              const conceptSummary = cleanConceptBullets(
                parsed.conceptSummary,
                parsed.explanation || ''
              );
              const nextQuestion = (
                parsed.nextQuestion ||
                (language === 'hi'
                  ? 'Agla sawal: Array aur Linked list mein kya fark hai?'
                  : 'Next question: Explain the difference between an array and a linked list.')
              )
                .replace(/\*\*/g, '')
                .trim();
              const spokenText =
                parsed.spokenText ||
                `${spokenFeedback} ${language === 'hi' ? 'Agla sawal suno: ' : 'Next question: '}${nextQuestion}`.trim();
              const difficultyLevel: VivaResponse['difficulty'] =
                parsed.difficulty === 'Foundation' ||
                parsed.difficulty === 'Intermediate' ||
                parsed.difficulty === 'MAKAUT / GATE'
                  ? parsed.difficulty
                  : intent === 'harder'
                  ? 'MAKAUT / GATE'
                  : 'Intermediate';

              return finalizeResponse({
                interactionType: isGuidance ? 'GUIDANCE' : 'EVALUATION',
                emotion: intent === 'opening' ? 'idle' : emotion,
                reaction: spokenFeedback,
                spokenFeedback,
                explanation: conceptSummary.join('\n') || (parsed.explanation || '').replace(/\*\*/g, ''),
                conceptSummary,
                nextQuestion,
                spokenText,
                difficulty: difficultyLevel,
                provider: 'groq',
                isCorrect: isGuidance
                  ? null
                  : parsed.isCorrect !== undefined
                  ? parsed.isCorrect
                  : emotion === 'happy',
                topicTag: parsed.topicTag || `${subject} Core`,
              });
            }
          } else {
            console.warn(`[Viva Buddy] Groq model ${modelName} returned status ${groqResponse.status}.`);
          }
        } catch (groqErr: any) {
          console.warn(`[Viva Buddy] Groq model ${modelName} failed:`, groqErr?.message || groqErr);
        }
      }
    } else {
      console.warn('[Viva Buddy] GROQ_API_KEY not configured or empty. Checking Gemini fallback...');
    }

    // 2. Automatic Backup: Google Gemini API (gemini-2.5-flash / gemini-3.5-flash-lite)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey && geminiApiKey.trim().length > 15 && !geminiApiKey.includes('mock')) {
      const geminiModels = ['gemini-2.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];

      // Build context string including history
      const historyContext = recentHistory.length > 0
        ? `CONVERSATION RECENT HISTORY:\n` + recentHistory.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n') + '\n\n'
        : '';

      const fullGeminiPrompt = `${historyContext}${currentUserPrompt}`;

      for (const modelName of geminiModels) {
        try {
          const ai = new GoogleGenAI({ apiKey: geminiApiKey.trim() });
          const geminiResult = await ai.models.generateContent({
            model: modelName,
            contents: fullGeminiPrompt,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.8,
              maxOutputTokens: 450,
              responseMimeType: 'application/json',
            },
          });

          const geminiText = geminiResult.text;
          if (geminiText) {
            const parsed = JSON.parse(geminiText);
            const isGuidance = intent === 'hint' || intent === 'example' || intent === 'harder' || intent === 'opening';
            const emotion = ['idle', 'happy', 'shocked', 'thinking'].includes(parsed.emotion)
              ? parsed.emotion
              : isGuidance
              ? 'thinking'
              : parsed.isCorrect === true
              ? 'happy'
              : 'shocked';

            const spokenFeedback = (
              parsed.spokenFeedback ||
              parsed.reaction ||
              (language === 'hi' ? 'Chalo aage badhte hain!' : 'Let us continue.')
            )
              .replace(/\*\*/g, '')
              .trim();
            const conceptSummary = cleanConceptBullets(
              parsed.conceptSummary,
              parsed.explanation || ''
            );
            const nextQuestion = (
              parsed.nextQuestion ||
              (language === 'hi'
                ? 'Agla sawal: QuickSort ka worst case kya hai?'
                : 'What is the worst-case time complexity of QuickSort?')
            )
              .replace(/\*\*/g, '')
              .trim();
            const spokenText =
              parsed.spokenText ||
              `${spokenFeedback} ${language === 'hi' ? 'Agla sawal suno: ' : 'Next question: '}${nextQuestion}`.trim();
            const difficultyLevel: VivaResponse['difficulty'] =
              parsed.difficulty === 'Foundation' ||
              parsed.difficulty === 'Intermediate' ||
              parsed.difficulty === 'MAKAUT / GATE'
                ? parsed.difficulty
                : intent === 'harder'
                ? 'MAKAUT / GATE'
                : 'Intermediate';

            return finalizeResponse({
              interactionType: isGuidance ? 'GUIDANCE' : 'EVALUATION',
              emotion: intent === 'opening' ? 'idle' : emotion,
              reaction: spokenFeedback,
              spokenFeedback,
              explanation: conceptSummary.join('\n') || (parsed.explanation || '').replace(/\*\*/g, ''),
              conceptSummary,
              nextQuestion,
              spokenText,
              difficulty: difficultyLevel,
              provider: 'gemini',
              isCorrect: isGuidance
                ? null
                : parsed.isCorrect !== undefined
                ? parsed.isCorrect
                : emotion === 'happy',
              topicTag: parsed.topicTag || `${subject} Core`,
            });
          }
        } catch (geminiErr: any) {
          console.warn(`[Viva Buddy] Gemini model ${modelName} error:`, geminiErr?.message || geminiErr);
        }
      }
    } else {
      console.warn('[Viva Buddy] GEMINI_API_KEY not configured or empty.');
    }

    // 3. Fallback to Grounded Educational Simulation Engine (Zero Cost & Zero Key Failure)
    console.info('[Viva Buddy] Using Grounded Educational Simulation Engine for response.');
    if (intent === 'opening') {
      const openingNextQ =
        language === 'hi'
          ? `${subject} (${rotatedAngle}) se ek fresh sawal: is subject ke core practical tradeoff ko real-world example se explain karo.`
          : `Let us start ${subject} (${rotatedAngle}): explain one core architectural tradeoff and how it behaves under edge-case load.`;
      return finalizeResponse({
        emotion: 'idle',
        reaction: language === 'hi' ? `Namaste! ${subject} viva shuru karte hain:` : `Welcome to ${subject} Viva Studio! Let us begin:`,
        explanation: '',
        nextQuestion: openingNextQ,
        spokenText: openingNextQ,
        provider: 'simulation',
        isCorrect: null,
        topicTag: rotatedAngle,
      });
    }

    const fallbackResponse = getSimulatedVivaResponse(
      question,
      answer,
      subject || 'DSA',
      language,
      intent
    );

    return finalizeResponse(fallbackResponse);
  } catch (error: any) {
    console.error('[Viva Buddy] API Error:', error);
    return NextResponse.json(
      {
        emotion: 'shocked',
        reaction: 'Technical hiccup on the examiner desk! Let us tackle this question together.',
        explanation: 'You need 2 queues, or 1 queue with element rotation on push. Enqueue new elements and rotate existing elements behind it to reverse FIFO to LIFO.',
        nextQuestion: 'What is the worst-case time complexity of QuickSort and how can it be avoided?',
        spokenText: 'Technical hiccup on the examiner desk! Let us tackle this question together: What is the worst-case time complexity of QuickSort?',
        provider: 'simulation',
        isCorrect: false,
        topicTag: 'System Invariants',
      } as VivaResponse,
      { status: 200 }
    );
  }
}
