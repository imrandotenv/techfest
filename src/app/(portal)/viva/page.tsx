'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  ArrowRight, 
  Languages, 
  Award, 
  GraduationCap, 
  Flame, 
  Lightbulb,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { VivaBuddyCharacter, VivaEmotion } from '@/components/VivaBuddyCharacter';
import { VivaResponse } from '@/app/api/viva/route';

export type VivaSubject = 'DSA' | 'COA' | 'OS' | 'Digital Electronics' | 'DBMS';
export type VivaLanguage = 'en' | 'hi';

interface SubjectInfo {
  code: string;
  name: string;
  semester: string;
  starterQuestions: {
    en: string[];
    hi: string[];
  };
}

const SUBJECT_CATALOG: Record<VivaSubject, SubjectInfo> = {
  DSA: {
    code: 'PCC-CS301',
    name: 'Data Structures & Algorithms',
    semester: 'Sem 3',
    starterQuestions: {
      en: [
        'What is the minimum number of queues needed to implement a Stack, and how does it work?',
        'What is the difference between an Array and a Singly Linked List regarding CPU cache locality?',
        'What is the worst-case time complexity of QuickSort, and why does it degrade to quadratic time?',
        'Why does Dijkstra’s algorithm fail when a graph contains negative edge weights?',
        'How does an AVL Tree guarantee O(log n) worst-case search compared to a standard BST?',
      ],
      hi: [
        'Bhai, ek Stack implement karne ke liye minimum kitne Queues chahiye hote hain aur kyu?',
        'Array aur Singly Linked List mein CPU cache locality ka kya fark hota hai?',
        'QuickSort ka worst-case time complexity kya hai aur ye O(n²) kab ban jata hai?',
        'Dijkstra algorithm negative edge weights par kyu fail ho jata hai?',
        'AVL Tree standard BST ke mukable O(log n) search guarantee kaise karta hai?',
      ],
    },
  },
  COA: {
    code: 'PCC-CS302',
    name: 'Computer Organization & Architecture',
    semester: 'Sem 3',
    starterQuestions: {
      en: [
        'What is the fundamental difference between Von Neumann and Harvard architecture regarding the memory bus?',
        'Explain the three major types of instruction pipeline hazards in a 5-stage MIPS CPU.',
        'What is the difference between Spatial Locality and Temporal Locality in cache memory hierarchy?',
        'What happens in hardware during a TLB (Translation Lookaside Buffer) miss?',
        'Why is Booth’s Multiplication algorithm more efficient for 2’s complement negative numbers?',
      ],
      hi: [
        'Von Neumann aur Harvard architecture mein memory bus ka kya main fark hota hai?',
        '5-stage MIPS CPU pipeline mein 3 kaun-kaun se major hazards aate hain?',
        'Cache memory mein Spatial Locality aur Temporal Locality ke beech kya difference hai?',
        'Virtual memory mein TLB miss hone par hardware aur OS kya steps lete hain?',
        'Booth’s Multiplication algorithm 2’s complement numbers ke liye itna efficient kyu mana jata hai?',
      ],
    },
  },
  OS: {
    code: 'PCC-CS402',
    name: 'Operating Systems',
    semester: 'Sem 4',
    starterQuestions: {
      en: [
        'What are the 4 Coffman conditions that must hold simultaneously for a system deadlock to occur?',
        'What is the difference between a Process and a Thread in terms of address space and context switching overhead?',
        'Why does Belady’s Anomaly occur in FIFO page replacement, and why can it never happen in LRU?',
        'What does Copy-On-Write (COW) do during a fork() system call in Unix/Linux?',
        'How does a Spinlock differ from a Mutex Semaphore under SMP multi-core processors?',
      ],
      hi: [
        'Operating system mein Deadlock hone ke liye kaunse 4 Coffman conditions zaroori hote hain?',
        'Process aur Thread ke memory space aur context switch overhead mein kya antar hai?',
        'Belady’s Anomaly FIFO page replacement mein kyu hoti hai aur LRU mein kyu nahi?',
        'Linux mein fork() system call ke time Copy-On-Write (COW) optimization kaise kaam karta hai?',
        'Spinlock aur Mutex semaphore mein kya fark hai aur single-core CPU pe spinning dangerous kyu hai?',
      ],
    },
  },
  'Digital Electronics': {
    code: 'ESC301',
    name: 'Analog & Digital Electronics',
    semester: 'Sem 3',
    starterQuestions: {
      en: [
        'What is the Barkhausen criterion for sustained oscillations in an electronic oscillator?',
        'Why do CMOS logic gates consume near-zero static power compared to TTL logic gates?',
        'What is the race-around condition in a basic J-K flip-flop, and how does a Master-Slave flip-flop eliminate it?',
        'Define setup time (t_setup) and hold time (t_hold), and what happens when metastability occurs?',
        'Why does a Common Emitter (CE) BJT amplifier introduce a 180-degree phase shift?',
      ],
      hi: [
        'Electronic oscillator mein sustained oscillation ke liye Barkhausen criterion kya kehta hai?',
        'CMOS logic gates TTL gates ke mukable near-zero static power kyu consume karte hain?',
        'J-K flip-flop mein race-around condition kya hoti hai aur Master-Slave setup isko kaise fix karta hai?',
        'Flip-flop mein setup time aur hold time violation hone se metastability kaise aati hai?',
        'Common Emitter (CE) amplifier input aur output signal ke beech 180° phase inversion kyu deta hai?',
      ],
    },
  },
  DBMS: {
    code: 'PCC-CS501',
    name: 'Database Management Systems',
    semester: 'Sem 5',
    starterQuestions: {
      en: [
        'What do the four letters in ACID transaction properties guarantee?',
        'What is the exact distinction between 2NF and 3NF regarding transitive functional dependencies?',
        'Why do relational database engines use B+ Trees instead of Hash indexes for table indexing?',
        'How does the Write-Ahead Logging (WAL) protocol guarantee atomicity and durability after a crash?',
        'What is the difference between a Clustered Index and a Non-Clustered Index on physical disk storage?',
      ],
      hi: [
        'Database transactions mein ACID properties ke charo letters ka kya exact matlab hota hai?',
        '2NF aur 3NF ke beech transitive functional dependency ka kya chakkar hota hai?',
        'Relational databases indexing ke liye Hash indexes ke badle B+ Trees kyu use karte hain?',
        'Write-Ahead Logging (WAL) protocol crash ke baad atomicity aur durability kaise ensure karta hai?',
        'Clustered Index aur Non-Clustered Index ke physical disk layout mein kya fark hota hai?',
      ],
    },
  },
};

const FREE_GUEST_LIMIT = 2;

export default function VivaStudioPage() {
  const { user, isLoaded, isSignedIn } = useUser();

  // Control bar state
  const [subject, setSubject] = useState<VivaSubject>('DSA');
  const [language, setLanguage] = useState<VivaLanguage>('en');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);

  // Viva stage state
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [emotion, setEmotion] = useState<VivaEmotion>('idle');
  const [reactionText, setReactionText] = useState<string>('');
  const [explanationText, setExplanationText] = useState<string>('');
  const [activeProvider, setActiveProvider] = useState<'groq' | 'gemini' | 'simulation' | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Free attempts for guest users
  const [freeCount, setFreeCount] = useState<number>(0);
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);

  // Speech Recognition state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Score stats
  const [scorecard, setScorecard] = useState({
    attempts: 0,
    correct: 0,
    streak: 0,
  });

  // Load free guest count from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sanakahub_viva_free_count');
      if (stored) {
        setFreeCount(parseInt(stored, 10) || 0);
      }
    }
  }, []);

  // Is guest locked?
  const isGuestLocked = !isSignedIn && freeCount >= FREE_GUEST_LIMIT;

  // Pick question based on subject and language
  const pickNewQuestion = useCallback((targetSubject: VivaSubject, targetLang: VivaLanguage) => {
    const list = SUBJECT_CATALOG[targetSubject]?.starterQuestions[targetLang] || SUBJECT_CATALOG.DSA.starterQuestions.en;
    const randomQ = list[Math.floor(Math.random() * list.length)];
    setCurrentQuestion(randomQ);
    setReactionText('');
    setExplanationText('');
    setEmotion('idle');
    setStudentAnswer('');
  }, []);

  // Update question when subject or language changes
  useEffect(() => {
    pickNewQuestion(subject, language);
  }, [subject, language, pickNewQuestion]);

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

        recog.onstart = () => {
          setIsListening(true);
          setEmotion('listening');
        };

        recog.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setStudentAnswer(transcript);
          }
        };

        recog.onerror = (err: any) => {
          console.warn('[Viva Speech] Error:', err);
          setIsListening(false);
          setEmotion((prev) => (prev === 'listening' ? 'idle' : prev));
        };

        recog.onend = () => {
          setIsListening(false);
          setEmotion((prev) => (prev === 'listening' ? 'idle' : prev));
        };

        recognitionRef.current = recog;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [language]);

  // High-Quality Speech Player (Sarvam AI TTS with Natural Browser Fallback)
  const speakVoice = useCallback(
    async (textToSpeak: string) => {
      if (!isVoiceEnabled || typeof window === 'undefined') return;

      // Stop any active speech
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (audioRef.current) audioRef.current.pause();

      // Clean text: strip markdown symbols, asterisks, brackets, backticks
      const cleanText = textToSpeak
        .replace(/[*_#`~[\]]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return;

      try {
        // Try server-side Sarvam AI TTS first
        const ttsRes = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanText, language }),
        });

        if (ttsRes.ok) {
          const ttsData = await ttsRes.json();
          if (ttsData.audio) {
            const audioUrl = `data:audio/wav;base64,${ttsData.audio}`;
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            setIsSpeaking(true);
            audio.onended = () => setIsSpeaking(false);
            audio.onerror = () => {
              setIsSpeaking(false);
              playBrowserSpeech(cleanText, language);
            };
            await audio.play();
            return;
          }
        }
      } catch (e) {
        console.warn('[TTS] Sarvam audio playback skipped, falling back to browser speech:', e);
      }

      // Upgraded Zero-Cost Browser Speech Synthesis
      playBrowserSpeech(cleanText, language);
    },
    [isVoiceEnabled, language]
  );

  // Helper for natural browser speech synthesis
  const playBrowserSpeech = (text: string, lang: VivaLanguage) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    let chosenVoice: SpeechSynthesisVoice | undefined;

    if (lang === 'hi') {
      // Look for natural Hindi voices
      chosenVoice =
        voices.find((v) => v.name.includes('Swara') || v.name.includes('Madhur') || v.name.includes('Neerja')) ||
        voices.find((v) => v.lang === 'hi-IN' || v.name.includes('Hindi') || v.name.includes('हिन्दी')) ||
        voices.find((v) => v.lang.includes('en-IN'));
    } else {
      // Look for natural Indian English or UK/US voices
      chosenVoice =
        voices.find((v) => v.name.includes('Neerja') || v.name.includes('Prabhat')) ||
        voices.find((v) => v.lang === 'en-IN') ||
        voices.find((v) => v.name.includes('Natural') || v.name.includes('Google UK English Female')) ||
        voices.find((v) => v.lang.startsWith('en'));
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop voice
  const stopVoice = () => {
    if (typeof window !== 'undefined') {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (audioRef.current) audioRef.current.pause();
      setIsSpeaking(false);
    }
  };

  // Toggle Microphone
  const toggleListening = () => {
    if (!speechSupported) {
      alert('Speech Recognition is not supported by your current browser. You can type your answer in the box below!');
      return;
    }

    if (isGuestLocked) {
      setShowSignInModal(true);
      return;
    }

    if (isSpeaking) {
      stopVoice();
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setEmotion('idle');
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
          recognitionRef.current.start();
        }
      } catch (err) {
        console.warn('Speech recognition restart issue:', err);
      }
    }
  };

  // Submit Answer to AI Viva Evaluator
  const handleSubmitAnswer = async (overrideAnswer?: string) => {
    // Check guest limit first
    if (!isSignedIn && freeCount >= FREE_GUEST_LIMIT) {
      setShowSignInModal(true);
      return;
    }

    const finalAnswer = (overrideAnswer !== undefined ? overrideAnswer : studentAnswer).trim();
    if (!finalAnswer) return;

    // Stop microphone if currently listening
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Stop ongoing audio
    stopVoice();

    setIsEvaluating(true);
    setEmotion('thinking');

    try {
      const res = await fetch('/api/viva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          answer: finalAnswer,
          subject,
          language,
        }),
      });

      const data: VivaResponse = await res.json();

      setReactionText(data.reaction);
      setExplanationText(data.explanation);
      setEmotion(data.emotion);
      setActiveProvider(data.provider);

      // Track guest count
      if (!isSignedIn) {
        const nextCount = freeCount + 1;
        setFreeCount(nextCount);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sanakahub_viva_free_count', nextCount.toString());
        }
        if (nextCount >= FREE_GUEST_LIMIT) {
          // Open sign in gate after this reaction
          setTimeout(() => {
            setShowSignInModal(true);
          }, 3500);
        }
      }

      // Update scorecard
      const wasCorrect = data.isCorrect ?? (data.emotion === 'happy');
      setScorecard((prev) => ({
        attempts: prev.attempts + 1,
        correct: prev.correct + (wasCorrect ? 1 : 0),
        streak: wasCorrect ? prev.streak + 1 : 0,
      }));

      // Speak reaction + explanation if voice enabled
      if (isVoiceEnabled) {
        const speechContent = `${data.reaction} ${data.explanation} ${language === 'hi' ? 'Agla sawal suno:' : 'Here is your next question:'} ${data.nextQuestion}`;
        speakVoice(speechContent);
      }

      // Transition to next question
      if (data.nextQuestion) {
        setCurrentQuestion(data.nextQuestion);
        setStudentAnswer('');
      }
    } catch (err) {
      console.error('Viva submission failed:', err);
      setReactionText(language === 'hi' ? 'Server connect nahi ho paya! Dobara try karo.' : 'Network connection error! Please retry.');
      setExplanationText(language === 'hi' ? 'Check your internet connection or server logs.' : 'Ensure your local server is running.');
      setEmotion('shocked');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Surrender / Skip Question
  const handleSkipQuestion = () => {
    if (isGuestLocked) {
      setShowSignInModal(true);
      return;
    }
    const surrenderPrompt = language === 'hi' 
      ? 'Mujhe nahi pata bhai, please exact jawab samjha do.' 
      : "I don't know the exact mechanism, please explain.";
    handleSubmitAnswer(surrenderPrompt);
  };

  const remainingFree = Math.max(0, FREE_GUEST_LIMIT - freeCount);

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex flex-col justify-between max-w-4xl mx-auto space-y-6">
      {/* Top Header & Compact Controls Strip */}
      <div className="w-full space-y-3">
        {/* Breadcrumb / Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E4E7]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#2563EB] shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-display text-[#09090B]">
                  AI Viva Studio
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-[#2563EB] border border-blue-200/70">
                  MAKAUT 2026
                </span>
              </div>
              <p className="text-xs text-[#52525B] font-sans">
                Real-time rapid-fire viva examiner with expressive animated feedback
              </p>
            </div>
          </div>

          {/* Access / Score Pill */}
          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>SETGOI Student • Unlimited</span>
              </div>
            ) : (
              <button
                onClick={() => setShowSignInModal(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                  remainingFree > 0
                    ? 'bg-amber-50 border border-amber-200 text-amber-800'
                    : 'bg-red-50 border border-red-200 text-red-700 animate-pulse'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>{remainingFree > 0 ? `${remainingFree} Free Round${remainingFree > 1 ? 's' : ''} Left` : 'Limit Reached • Sign In'}</span>
              </button>
            )}

            {/* Streak & Score Counter */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4E4E7] text-xs font-mono text-[#09090B] shadow-2xs">
              <span className="flex items-center gap-1 text-[#2563EB] font-bold">
                <Award className="w-3.5 h-3.5" />
                {scorecard.correct}/{scorecard.attempts}
              </span>
              {scorecard.streak > 1 && (
                <span className="flex items-center gap-0.5 text-orange-600 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  {scorecard.streak}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Minimal Control Pill Bar (Subject + Language + Voice) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white border border-[#E4E4E7] p-2 sm:p-2.5 rounded-xl shadow-2xs">
          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(Object.keys(SUBJECT_CATALOG) as VivaSubject[]).map((subj) => {
              const isSelected = subject === subj;
              return (
                <button
                  key={subj}
                  onClick={() => setSubject(subj)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563EB] text-white shadow-xs font-semibold'
                      : 'bg-zinc-50 text-[#52525B] hover:bg-zinc-100 hover:text-[#09090B] border border-transparent'
                  }`}
                >
                  {subj}
                </button>
              );
            })}
          </div>

          {/* Right Control Switches: Language & Voice */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <div className="inline-flex items-center bg-zinc-100 p-0.5 rounded-lg border border-[#E4E4E7] text-xs font-mono font-medium">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-[#09090B] shadow-2xs font-bold'
                    : 'text-[#52525B] hover:text-[#09090B]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-white text-[#2563EB] shadow-2xs font-bold'
                    : 'text-[#52525B] hover:text-[#09090B]'
                }`}
              >
                हिंदी / Hinglish
              </button>
            </div>

            {/* Voice Toggle */}
            <button
              onClick={() => {
                if (isVoiceEnabled) stopVoice();
                setIsVoiceEnabled(!isVoiceEnabled);
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isVoiceEnabled
                  ? 'bg-blue-50 border-blue-200/80 text-[#2563EB]'
                  : 'bg-zinc-50 border-[#E4E4E7] text-[#52525B] hover:text-[#09090B]'
              }`}
              title={isVoiceEnabled ? 'Voice output enabled' : 'Voice output muted'}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Center Stage: Clean Focus Studio */}
      <div className="flex-1 flex flex-col items-center justify-center py-4 sm:py-6 space-y-5 w-full">
        {/* Animated Expressive Character */}
        <div className="relative flex flex-col items-center">
          <VivaBuddyCharacter emotion={emotion} size={150} />
          
          {/* Subtle Emotion Status Pill */}
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#E4E4E7] text-[11px] font-mono text-[#52525B] shadow-2xs">
            <span
              className={`w-2 h-2 rounded-full ${
                emotion === 'happy'
                  ? 'bg-emerald-500'
                  : emotion === 'shocked'
                  ? 'bg-rose-500'
                  : emotion === 'thinking'
                  ? 'bg-amber-500 animate-pulse'
                  : emotion === 'listening'
                  ? 'bg-cyan-500 animate-ping'
                  : 'bg-blue-500'
              }`}
            />
            <span className="capitalize font-semibold text-[#09090B]">
              {isEvaluating
                ? 'Evaluating...'
                : isSpeaking
                ? 'Speaking...'
                : isListening
                ? 'Listening to you...'
                : emotion === 'shocked'
                ? 'Examiner Reaction'
                : emotion === 'happy'
                ? 'Full Marks!'
                : 'Ready for Answer'}
            </span>
            {activeProvider && !isEvaluating && (
              <span className="text-[10px] text-zinc-400 pl-1 border-l border-zinc-200">
                via {activeProvider}
              </span>
            )}
          </div>
        </div>

        {/* Examiner Question Card */}
        <div className="w-full bg-white border border-[#E4E4E7] rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] font-mono text-[11px] font-bold border border-blue-200/60">
                {SUBJECT_CATALOG[subject].code}
              </span>
              <span className="text-xs font-mono text-[#52525B]">
                {SUBJECT_CATALOG[subject].name}
              </span>
            </div>
            <button
              onClick={() => pickNewQuestion(subject, language)}
              className="text-xs font-mono text-[#2563EB] hover:text-blue-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Next Q</span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#52525B]">
              Current Viva Question
            </div>
            <p className="text-base sm:text-lg font-medium text-[#09090B] font-display leading-relaxed">
              &ldquo;{currentQuestion}&rdquo;
            </p>
          </div>
        </div>

        {/* Conversational Feedback Bubble (Examiner Reaction + Exact Technical Answer) */}
        {(reactionText || explanationText) && (
          <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Witty Reaction Line */}
            {reactionText && (
              <div
                className={`p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-sans flex items-start gap-3 shadow-2xs ${
                  emotion === 'happy'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/70 border-rose-200 text-rose-950'
                }`}
              >
                {emotion === 'happy' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold">{reactionText}</div>
                </div>
              </div>
            )}

            {/* Exact Technical Answer Card */}
            {explanationText && (
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-[#E4E4E7] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#2563EB]">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>EXACT TECHNICAL ANSWER &amp; CONCEPT</span>
                </div>
                <p className="text-xs sm:text-sm text-[#09090B] font-sans leading-relaxed">
                  {explanationText}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Input Dock */}
      <div className="w-full space-y-2 pb-4">
        {/* Guest Lockout Banner if locked */}
        {isGuestLocked ? (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-amber-950 font-sans">
                  2 Free Practice Rounds Completed
                </div>
                <div className="text-xs text-amber-800 font-sans">
                  Sign in with your SETGOI student account to unlock unlimited viva practice.
                </div>
              </div>
            </div>
            <Link
              href="/sign-in?redirect_url=/viva"
              className="px-4 py-2 rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 text-xs font-semibold font-sans transition-all inline-flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
            >
              <span>Sign in with SETGOI Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          /* Active Input Bar */
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-2 sm:p-2.5 shadow-xs flex items-center gap-2 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            {/* Tactile Mic Button */}
            <button
              onClick={toggleListening}
              disabled={isEvaluating}
              className={`p-3 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md ring-4 ring-rose-100'
                  : 'bg-zinc-100 text-[#09090B] hover:bg-zinc-200 border border-[#E4E4E7]'
              }`}
              title={isListening ? 'Stop listening' : `Speak answer (${language === 'hi' ? 'Hindi/Hinglish' : 'English'})`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#2563EB]" />}
            </button>

            {/* Answer Text Input */}
            <input
              type="text"
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isEvaluating) {
                  handleSubmitAnswer();
                }
              }}
              disabled={isEvaluating}
              placeholder={
                isListening
                  ? language === 'hi' ? 'Bolte rahiye, sun raha hu...' : 'Listening to your speech...'
                  : language === 'hi'
                  ? 'Apna jawab yaha likho ya mic daba ke bolo...'
                  : 'Type your answer or click mic to speak (Press Enter)...'
              }
              className="flex-1 bg-transparent border-0 px-2 text-xs sm:text-sm text-[#09090B] placeholder:text-[#52525B]/60 focus:outline-hidden font-sans"
            />

            {/* Skip / I don't know button */}
            <button
              onClick={handleSkipQuestion}
              disabled={isEvaluating}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-mono text-[#52525B] hover:text-[#09090B] hover:bg-zinc-100 transition-colors shrink-0 cursor-pointer"
              title="Give up on this question and see the real answer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
              <span>I don&apos;t know</span>
            </button>

            {/* Stop Voice button if speaking */}
            {isSpeaking && (
              <button
                onClick={stopVoice}
                className="p-2 rounded-xl bg-zinc-100 text-[#52525B] hover:text-[#09090B] text-xs font-mono shrink-0 cursor-pointer"
                title="Stop speech"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}

            {/* Submit Button */}
            <button
              onClick={() => handleSubmitAnswer()}
              disabled={isEvaluating || !studentAnswer.trim()}
              className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-sans text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                studentAnswer.trim() && !isEvaluating
                  ? 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-xs'
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <span className="hidden sm:inline">Answer</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Subtle Bottom Helper Notes */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#52525B] px-2">
          <span>
            Mode: {language === 'hi' ? 'हिंदी / Hinglish' : 'Indian English'} • {subject}
          </span>
          <span className="flex items-center gap-1">
            <Link href="/tools" className="hover:text-[#2563EB] underline transition-colors">
              Tools Hub
            </Link>
            <span>•</span>
            <Link href="/notes" className="hover:text-[#2563EB] underline transition-colors">
              Theory Notes
            </Link>
          </span>
        </div>
      </div>

      {/* Centered Clerk Sign-In Modal when guest limit reached */}
      {showSignInModal && !isSignedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-5 text-center relative animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 mx-auto flex items-center justify-center text-[#2563EB] shadow-2xs">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-mono text-[10px] font-bold">
                SETGOI ACADEMIC GATE
              </span>
              <h3 className="text-xl font-bold font-display text-[#09090B]">
                Sign In to Continue Viva Studio
              </h3>
              <p className="text-xs sm:text-sm text-[#52525B] font-sans leading-relaxed">
                You have completed your 2 free practice rounds. Sign in with your SETGOI student or faculty account to unlock unlimited viva sessions, custom question banks, and live feedback.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E4E4E7] text-left text-xs font-mono text-[#52525B] space-y-1.5">
              <div className="flex items-center gap-2 text-[#09090B] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unlimited Rapid-Fire Viva Voce</span>
              </div>
              <div className="flex items-center gap-2 text-[#09090B] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Full Speech Synthesis in English &amp; Hinglish</span>
              </div>
              <div className="flex items-center gap-2 text-[#09090B] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Free for SETGOI Durgapur Students</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/sign-in?redirect_url=/viva"
                className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-sans text-xs font-semibold transition-all inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Sign in with SETGOI Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setShowSignInModal(false)}
                className="w-full py-2 text-xs font-mono text-[#52525B] hover:text-[#09090B] transition-colors cursor-pointer"
              >
                Close and review current explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
