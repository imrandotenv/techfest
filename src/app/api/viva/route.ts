import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';

export interface VivaRequest {
  question: string;
  answer: string;
  subject: string;
  difficulty?: 'Quick Viva' | 'External Examiner';
  language?: 'en' | 'hi';
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface VivaResponse {
  emotion: 'idle' | 'happy' | 'shocked' | 'thinking';
  reaction: string;
  explanation: string;
  nextQuestion: string;
  provider: 'groq' | 'gemini' | 'simulation';
  isCorrect: boolean;
}

// System prompts for English and Conversational Hinglish
function getSystemPrompt(language: 'en' | 'hi'): string {
  if (language === 'hi') {
    return `You are "Viva Buddy", a witty, supportive, and brilliant senior engineer/examiner taking viva for B.Tech engineering students at SETGOI (Sanaka Educational Trust's Group of Institutions, Durgapur, affiliated with MAKAUT).

SPEAKING STYLE (NATURAL HINGLISH):
- Speak in natural, everyday conversational Hinglish (Hindi written in Roman script, like "2 queues lagte hain bhai, ya 1 queue with rotation").
- Sound like a real, witty college senior or friendly professor who is evaluating viva.
- ZERO robotic jargon, ZERO textbook filler, and ZERO generic filler like "tests your foundational grasp of system tradeoffs".
- Keep it punchy, authentic, and human.

EVALUATION & RESPONSE RULES:
1. Determine if the student's answer is correct, partially correct, or wrong/surrendered ("dont know", "pass", "skip", "nahi pata").
2. "emotion": "happy" if correct; "shocked" if wrong or if the student surrenders/gives up.
3. "reaction": Exactly 1 short, witty Hinglish line (praise if correct e.g. "Arre shabash! External examiner bhi khush ho jayega!", witty roast/banter if wrong e.g. "Arre bhai! Pointer sidha segfault me gir gaya kya?!", friendly encouragement if skipped e.g. "Koi tension nahi bhai, seat pe baith kar panic mat ho!").
4. "explanation": ALWAYS state the EXACT, ACCURATE technical answer FIRST in direct, plain terms (e.g. "2 queues lagte hain bhai, ya 1 queue with rotation. Enqueue karte time purane elements rotate karke peeche le aate hain taaki LIFO order mil sake.").
5. "nextQuestion": Exactly 1 crisp, focused next viva question for this subject in natural Hinglish/English.
6. "isCorrect": true if technically sound, false if wrong or skipped.

OUTPUT FORMAT:
Return valid JSON only with keys:
{
  "emotion": "happy" | "shocked",
  "reaction": "<1 short witty Hinglish line>",
  "explanation": "<exact technical answer first, then 1 concise concept note in Hinglish>",
  "nextQuestion": "<1 crisp next viva question>",
  "isCorrect": true | false
}`;
  }

  return `You are "Viva Buddy", a witty, sharp, and encouraging B.Tech engineering senior and viva examiner at SETGOI (Sanaka Educational Trust's Group of Institutions, Durgapur, affiliated with MAKAUT).

SPEAKING STYLE (NATURAL INDIAN ENGLISH):
- Speak like an authentic, articulate engineering mentor or friendly professor.
- ZERO robotic filler phrases (never say "tests your foundational grasp of system tradeoffs" or "this demonstrates an invariant").
- Concise, conversational, witty, and crystal clear.

EVALUATION & RESPONSE RULES:
1. Determine if the student's answer is correct, partially correct, or wrong/surrendered ("dont know", "pass", "skip", etc.).
2. "emotion": "happy" if correct; "shocked" if wrong or if the student surrendered.
3. "reaction": Exactly 1 short, witty line (praise if correct e.g. "Spot on! That is an instant 10/10 from the external board.", witty roast if wrong e.g. "Ouch! Did your recursion just hit an infinite stack overflow?!", friendly encouragement if skipped e.g. "Caught in the hot seat! Don't sweat it, let's break it down.").
4. "explanation": ALWAYS state the EXACT, ACCURATE technical answer FIRST in direct, plain terms (e.g. "You need 2 queues, or 1 queue with rotation on push. One queue holds items, while the other is used to reverse order on push/pop.").
5. "nextQuestion": Exactly 1 crisp, clear next viva question matching this subject.
6. "isCorrect": true if technically sound, false if wrong or skipped.

OUTPUT FORMAT:
Return valid JSON only with keys:
{
  "emotion": "happy" | "shocked",
  "reaction": "<1 short witty line>",
  "explanation": "<exact technical answer first, then 1 concise concept sentence>",
  "nextQuestion": "<1 crisp next viva question>",
  "isCorrect": true | false
}`;
}

// Grounded intelligent simulation engine with exact technical answers (Zero generic filler)
function getSimulatedVivaResponse(
  question: string,
  answer: string,
  subject: string,
  language: 'en' | 'hi' = 'en'
): VivaResponse {
  const normAns = answer.toLowerCase().trim();
  const isSurrender =
    normAns.includes("don't know") ||
    normAns.includes('dont know') ||
    normAns.includes('pass') ||
    normAns.includes('skip') ||
    normAns.includes('nahi pata') ||
    normAns.includes('pata nahi') ||
    normAns.includes('dunno') ||
    normAns.length < 3;

  const isHi = language === 'hi';

  // Topic-matched precise knowledge base
  const normQ = question.toLowerCase();

  let isCorrect = false;
  let reaction = '';
  let explanation = '';
  let nextQuestion = '';

  if (normQ.includes('queue') && normQ.includes('stack')) {
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

  return {
    emotion: isCorrect ? 'happy' : 'shocked',
    reaction,
    explanation,
    nextQuestion,
    provider: 'simulation',
    isCorrect,
  };
}

export async function POST(req: Request) {
  try {
    const body: VivaRequest = await req.json();
    const { question, answer, subject = 'DSA', difficulty = 'Quick Viva', language = 'en' } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Both question and student answer are required.' },
        { status: 400 }
      );
    }

    const systemPrompt = getSystemPrompt(language);
    const userPrompt = `SUBJECT: ${subject}
DIFFICULTY: ${difficulty}
LANGUAGE MODE: ${language === 'hi' ? 'Hinglish (Conversational Roman Hindi)' : 'Natural Indian English'}
VIVA QUESTION ASKED: "${question}"
STUDENT'S ANSWER: "${answer}"

Evaluate the student's answer according to your system prompt rules. Remember to state the EXACT, SHORT, ACCURATE technical answer FIRST.`;

    // 1. Primary: Groq API (Try llama-3.3-70b-versatile, fallback to openai/gpt-oss-120b or qwen/qwen3.8-27b)
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey && groqApiKey.trim().length > 10 && !groqApiKey.includes('placeholder')) {
      const groqModels = ['llama-3.3-70b-versatile', 'openai/gpt-oss-120b', 'qwen/qwen3.8-27b'];

      for (const modelName of groqModels) {
        try {
          const groqController = new AbortController();
          const timeoutId = setTimeout(() => groqController.abort(), 5000);

          const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${groqApiKey.trim()}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: 'system', content: systemPrompt },
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
                reaction: parsed.reaction || (language === 'hi' ? 'Suno, chal aage badhte hain!' : 'Interesting answer! Let us proceed.'),
                explanation: parsed.explanation || '',
                nextQuestion: parsed.nextQuestion || (language === 'hi' ? 'Agla sawal: Array aur Linked list mein kya fark hai?' : 'Next question: Explain the difference between an array and a linked list.'),
                provider: 'groq',
                isCorrect: parsed.isCorrect ?? (emotion === 'happy'),
              } as VivaResponse);
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

      for (const modelName of geminiModels) {
        try {
          const ai = new GoogleGenAI({ apiKey: geminiApiKey.trim() });
          const geminiResult = await ai.models.generateContent({
            model: modelName,
            contents: userPrompt,
            config: {
              systemInstruction: systemPrompt,
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
              reaction: parsed.reaction || (language === 'hi' ? 'Suno bhai, answer check kiya!' : 'Evaluated by Examiner.'),
              explanation: parsed.explanation || '',
              nextQuestion: parsed.nextQuestion || (language === 'hi' ? 'Agla sawal: QuickSort ka worst case kya hai?' : 'What is the worst-case time complexity of QuickSort?'),
              provider: 'gemini',
              isCorrect: parsed.isCorrect ?? (emotion === 'happy'),
            } as VivaResponse);
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
    const fallbackResponse = getSimulatedVivaResponse(
      question,
      answer,
      subject || 'DSA',
      language
    );

    return NextResponse.json(fallbackResponse);
  } catch (error: any) {
    console.error('[Viva Buddy] API Error:', error);
    return NextResponse.json(
      {
        emotion: 'shocked',
        reaction: 'Technical hiccup on the examiner desk! Let us tackle this question together.',
        explanation: 'You need 2 queues, or 1 queue with element rotation on push. Enqueue new elements and rotate existing elements behind it to reverse FIFO to LIFO.',
        nextQuestion: 'What is the worst-case time complexity of QuickSort and how can it be avoided?',
        provider: 'simulation',
        isCorrect: false,
      } as VivaResponse,
      { status: 200 }
    );
  }
}
