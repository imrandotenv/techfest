import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';

export interface VivaRequest {
  question: string;
  answer: string;
  subject: string;
  difficulty: 'Quick Viva' | 'External Examiner';
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface VivaResponse {
  emotion: 'idle' | 'happy' | 'shocked' | 'thinking';
  reaction: string;
  explanation: string;
  nextQuestion: string;
  provider: 'groq' | 'gemini' | 'simulation';
  isCorrect?: boolean;
}

const SYSTEM_INSTRUCTION = `You are "Viva Buddy", a witty, expressive, and slightly dramatic B.Tech Engineering Viva Examiner for SETGOI (Sanaka Educational Trust's Group of Institutions) affiliated with MAKAUT (Maulana Abul Kalam Azad University of Technology, West Bengal).

You conduct rapid-fire viva voce examinations in B.Tech engineering subjects:
- DSA (Data Structures & Algorithms - PCC-CS301)
- COA (Computer Organization & Architecture - PCC-CS302)
- OS (Operating Systems - PCC-CS402)
- Analog & Digital (Digital Electronics & Analog Circuits - ESC301)
- DBMS (Database Management Systems - PCC-CS501)

PERSONALITY & EVALUATION RULES:
1. Carefully evaluate if the student's answer to the given question is technically correct, partially correct, or wrong.
2. If the answer is CORRECT:
   - "emotion": "happy"
   - "reaction": 1 short, witty, celebratory sentence praising their clarity or technical precision (e.g., "Spot on! Even the External Examiner would nod in pure satisfaction at that answer!", "Clean logic! Full 10/10 marks recorded on the viva sheet!").
3. If the answer is WRONG, confusing, or a common engineering misconception:
   - "emotion": "shocked"
   - "reaction": 1 short, witty, dramatic engineering roast/gasp (e.g., "Blunder alert! Did your pointers just segfault into the Bermuda Triangle?!", "Ouch! The External Examiner just dropped their red pen in utter disbelief!").
4. If the student says "I don't know", "pass", or gives up:
   - "emotion": "shocked"
   - "reaction": 1 short, lighthearted encouragement (e.g., "Caught blank in the hot seat! Don't panic, even Linus Torvalds had to read the man pages.").
5. "explanation": 2-3 sentences explaining the exact theoretical/technical concept clearly, citing time complexities, hardware architecture, or MAKAUT syllabus concepts as relevant.
6. "nextQuestion": Exactly 1 crisp, clear next viva question matching the subject and difficulty. If "Quick Viva", ask rapid conceptual questions. If "External Examiner", ask tricky edge-cases, design tradeoffs, or architectural differences.

OUTPUT FORMAT:
You MUST return ONLY valid JSON matching this exact structure:
{
  "emotion": "happy" | "shocked",
  "reaction": "<1 short witty sentence>",
  "explanation": "<2-3 sentence technical explanation>",
  "nextQuestion": "<1 crisp next viva question>",
  "isCorrect": true | false
}
Do NOT wrap the JSON in markdown code blocks like \`\`\`json. Return bare JSON.`;

// Grounded intelligent simulation fallback when offline or API keys are missing/exhausted
function getSimulatedVivaResponse(
  question: string,
  answer: string,
  subject: string,
  difficulty: string
): VivaResponse {
  const normAns = answer.toLowerCase().trim();
  const isSurrender = normAns.includes("don't know") || normAns.includes('dont know') || normAns.includes('pass') || normAns.includes('skip') || normAns.length < 3;

  // Curated subject question banks for next questions
  const nextQuestionBank: Record<string, string[]> = {
    DSA: [
      'What is the amortized time complexity of dynamic array resizing, and why is it O(1)?',
      'How does QuickSort behave when the array is already sorted, and how does randomized pivot selection fix it?',
      'Why is Dijkstra’s algorithm unable to handle negative edge weights, while Bellman-Ford can?',
      'Explain the difference between BFS and DFS in terms of memory footprint on a wide tree.',
      'How does an AVL tree ensure O(log n) worst-case search compared to a standard BST?',
    ],
    COA: [
      'What is the difference between Von Neumann and Harvard architectures regarding the memory bus?',
      'Explain structural, data, and control hazards in a 5-stage MIPS instruction pipeline.',
      'How does direct mapped cache differ from 4-way set associative cache in hit rate vs latency?',
      'What happens during a TLB miss in virtual memory address translation?',
      'Explain the difference between Memory-Mapped I/O and Isolated I/O.',
    ],
    OS: [
      'What are the 4 Coffman conditions required for a deadlock to occur?',
      'Explain the difference between a process context switch and a thread context switch.',
      'Why does Belady’s Anomaly occur in FIFO page replacement but never in LRU?',
      'How does a spinlock differ from a mutex semaphore, and when should you prefer a spinlock?',
      'What is the role of the dirty bit (modified bit) in page table entries?',
    ],
    'Analog & Digital': [
      'What is the difference between a combinational circuit and a sequential circuit?',
      'Why do CMOS logic gates consume near-zero static power compared to TTL?',
      'Explain the setup time (t_setup) and hold time (t_hold) violation in flip-flops.',
      'How does a Schmitt Trigger prevent false triggering caused by noise?',
      'What is the Barkhausen criterion for sustained oscillations in an analog oscillator?',
    ],
    DBMS: [
      'What is the difference between 2NF and 3NF regarding transitive functional dependencies?',
      'How does ACID isolation level "Read Committed" differ from "Repeatable Read"?',
      'Why do relational databases use B+ Trees instead of Hash indexes for range queries?',
      'Explain the Write-Ahead Logging (WAL) protocol and why it ensures durability.',
      'What is the difference between a Clustered Index and a Non-Clustered Index?',
    ],
  };

  const pool = nextQuestionBank[subject] || nextQuestionBank.DSA;
  const nextQ = pool[Math.floor(Math.random() * pool.length)];

  if (isSurrender) {
    return {
      emotion: 'shocked',
      reaction: 'Frozen in the viva hot seat! Take a deep breath, even Dennis Ritchie had to consult the manual.',
      explanation: `In ${subject}, questions like "${question.slice(0, 50)}..." test your foundational grasp of system tradeoffs and core concepts under the MAKAUT curriculum. Review the core definitions and boundary conditions.`,
      nextQuestion: nextQ,
      provider: 'simulation',
      isCorrect: false,
    };
  }

  // Question & Concept topic validation logic
  const normQ = question.toLowerCase();
  let isCorrect = false;
  let customExplanation = '';
  let customReaction = '';

  if (normQ.includes('quicksort') && normQ.includes('worst')) {
    if (normAns.includes('n^2') || normAns.includes('n*n') || normAns.includes('quadratic') || normAns.includes('n squared')) {
      isCorrect = true;
      customReaction = 'Spot on! Full marks on QuickSort worst-case complexity!';
      customExplanation = 'QuickSort degrades to O(n²) when the chosen pivot is always the maximum or minimum element (such as an already sorted array without randomized pivot). The recurrence relation T(n) = T(n-1) + O(n) yields quadratic time.';
    } else {
      isCorrect = false;
      customReaction = 'Blunder alert! Did your pivot selection just collapse your entire recursion tree?!';
      customExplanation = 'The worst-case time complexity of QuickSort is O(n²), occurring when partitioning produces an extremely unbalanced split (size 0 and n-1). Randomized pivot selection or median-of-three solves this by guaranteeing expected O(n log n).';
    }
  } else if (normQ.includes('deadlock') || normQ.includes('coffman')) {
    if (normAns.includes('mutual exclusion') || normAns.includes('hold and wait') || normAns.includes('circular wait') || normAns.includes('preemption')) {
      isCorrect = true;
      customReaction = 'Sharp answer! You named the fundamental Coffman conditions!';
      customExplanation = 'The 4 simultaneous Coffman conditions are Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. Breaking any one condition guarantees deadlock prevention.';
    } else {
      isCorrect = false;
      customReaction = 'Examiner raises an eyebrow! Your deadlock reasoning is trapped in a circular wait!';
      customExplanation = 'Deadlock requires 4 conditions simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Systems use Banker’s Algorithm or resource ordering graphs to avoid them.';
    }
  } else if (normQ.includes('array') && normQ.includes('linked list')) {
    if (normAns.includes('cache') || normAns.includes('contiguous') || normAns.includes('locality') || normAns.includes('pointer')) {
      isCorrect = true;
      customReaction = 'Clean architectural analysis! Cache locality was the exact key!';
      customExplanation = 'Arrays store elements in contiguous memory blocks, maximizing CPU L1/L2 spatial cache hits. Linked list nodes are scattered across the heap, incurring frequent cache misses due to pointer chasing.';
    } else {
      isCorrect = false;
      customReaction = 'Pointers tangled up! That misses the core memory hierarchy tradeoff.';
      customExplanation = 'Arrays have superior spatial locality because elements reside in contiguous memory addresses, allowing the CPU to prefetch entire cache lines. Linked lists require pointer traversals that trigger multiple cache misses.';
    }
  } else if (normQ.includes('von neumann') && normQ.includes('harvard')) {
    if (normAns.includes('bus') || normAns.includes('separate') || normAns.includes('instruction') || normAns.includes('data')) {
      isCorrect = true;
      customReaction = 'Brilliant! Even the HOD would applaud your architectural clarity!';
      customExplanation = 'Von Neumann shares a single memory bus for both instructions and data, creating the infamous Von Neumann bottleneck. Harvard architecture uses physically separated buses and memories, allowing simultaneous instruction fetch and data read.';
    } else {
      isCorrect = false;
      customReaction = 'Hardware mismatch! You just caused a memory bus stall!';
      customExplanation = 'In Von Neumann architecture, instructions and data share the same physical bus. Harvard architecture features distinct physical buses for instructions and data, eliminating memory contention.';
    }
  } else if (normQ.includes('acid')) {
    if (normAns.includes('atomicity') || normAns.includes('consistency') || normAns.includes('isolation') || normAns.includes('durability')) {
      isCorrect = true;
      customReaction = 'Flawless database fundamentals! 10/10 recorded on your viva card!';
      customExplanation = 'ACID stands for Atomicity (all-or-nothing), Consistency (integrity constraints preserved), Isolation (concurrent transactions do not interfere), and Durability (committed changes persist after crashes).';
    } else {
      isCorrect = false;
      customReaction = 'Transaction rolled back! That is not what ACID stands for in DBMS!';
      customExplanation = 'ACID stands for Atomicity, Consistency, Isolation, and Durability. These properties ensure database transactions remain reliable even amidst power loss and hardware crashes.';
    }
  } else {
    // Generic heuristic
    const blunderWords = ['dont know', "don't know", 'dunno', 'random', 'magic', 'maybe', 'guess', 'constant time'];
    const hasBlunder = blunderWords.some((w) => normAns.includes(w)) || normAns.length < 8;
    isCorrect = !hasBlunder && normAns.length > 20;

    if (isCorrect) {
      customReaction = 'Spot on! Even the SETGOI External Examiner would give an approving nod at that explanation!';
      customExplanation = `Your explanation addresses the core operational mechanism for ${subject}. In MAKAUT examinations, stating the exact operational invariant guarantees full marks.`;
    } else {
      customReaction = 'Blunder alert! Did your logic just segfault right in front of the department board?!';
      customExplanation = `Your answer missed the fundamental operational principle for this question. In ${subject}, precision regarding technical definitions and boundary conditions is mandatory.`;
    }
  }

  return {
    emotion: isCorrect ? 'happy' : 'shocked',
    reaction: customReaction,
    explanation: customExplanation,
    nextQuestion: nextQ,
    provider: 'simulation',
    isCorrect,
  };
}

export async function POST(req: Request) {
  try {
    const body: VivaRequest = await req.json();
    const { question, answer, subject, difficulty } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Both question and student answer are required.' },
        { status: 400 }
      );
    }

    const userPrompt = `SUBJECT: ${subject || 'DSA'}
DIFFICULTY: ${difficulty || 'Quick Viva'}
VIVA QUESTION ASKED: "${question}"
STUDENT'S ANSWER: "${answer}"

Evaluate the student's answer and return the JSON reaction, explanation, next question, and correctness.`;

    // 1. Try Groq API as Primary (llama-3.3-70b-versatile or llama-3.1-8b-instant)
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey && groqApiKey.trim().length > 10 && !groqApiKey.includes('placeholder')) {
      try {
        const groqController = new AbortController();
        const timeoutId = setTimeout(() => groqController.abort(), 4500);

        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqApiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: SYSTEM_INSTRUCTION },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.6,
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
            const emotion = parsed.emotion === 'happy' ? 'happy' : 'shocked';
            return NextResponse.json({
              emotion,
              reaction: parsed.reaction || 'Interesting answer! Let us proceed.',
              explanation: parsed.explanation || '',
              nextQuestion: parsed.nextQuestion || 'Explain the difference between an array and a linked list.',
              provider: 'groq',
              isCorrect: parsed.isCorrect ?? (emotion === 'happy'),
            } as VivaResponse);
          }
        } else {
          console.warn(`[Viva Buddy] Groq API returned status ${groqResponse.status}. Triggering Gemini fallback...`);
        }
      } catch (groqErr: any) {
        console.warn('[Viva Buddy] Groq API call failed or timed out:', groqErr?.message || groqErr);
      }
    }

    // 2. Automatic Fallback to Google Gemini API (gemini-2.5-flash)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey && geminiApiKey.trim().length > 15 && !geminiApiKey.includes('mock')) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey.trim() });
        const geminiResult = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.6,
            responseMimeType: 'application/json',
          },
        });

        const geminiText = geminiResult.text;
        if (geminiText) {
          const parsed = JSON.parse(geminiText);
          const emotion = parsed.emotion === 'happy' ? 'happy' : 'shocked';
          return NextResponse.json({
            emotion,
            reaction: parsed.reaction || 'Evaluated by Gemini.',
            explanation: parsed.explanation || '',
            nextQuestion: parsed.nextQuestion || 'What is the time complexity of binary search?',
            provider: 'gemini',
            isCorrect: parsed.isCorrect ?? (emotion === 'happy'),
          } as VivaResponse);
        }
      } catch (geminiErr: any) {
        console.warn('[Viva Buddy] Gemini API fallback failed:', geminiErr?.message || geminiErr);
      }
    }

    // 3. Fallback to Grounded Educational Simulation Engine (Zero Cost & Zero Key Failure)
    const fallbackResponse = getSimulatedVivaResponse(
      question,
      answer,
      subject || 'DSA',
      difficulty || 'Quick Viva'
    );

    return NextResponse.json(fallbackResponse);
  } catch (error: any) {
    console.error('[Viva Buddy] API Error:', error);
    return NextResponse.json(
      {
        emotion: 'shocked',
        reaction: 'Technical hiccup on the examiner desk! Let us tackle this question together.',
        explanation: 'The viva engine encountered an unexpected error while evaluating your response. Please check your network or try again.',
        nextQuestion: 'What is the worst-case time complexity of QuickSort and how can it be avoided?',
        provider: 'simulation',
        isCorrect: false,
      } as VivaResponse,
      { status: 200 }
    );
  }
}
