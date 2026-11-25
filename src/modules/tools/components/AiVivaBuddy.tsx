'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Sparkles, 
  RefreshCw, 
  HelpCircle, 
  Zap, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  BookOpen,
  Sliders,
  RotateCcw,
  Square
} from 'lucide-react';
import { VivaBuddyCharacter, VivaEmotion } from '@/components/VivaBuddyCharacter';
import { VivaResponse } from '@/app/api/viva/route';

export type VivaSubject = 'DSA' | 'COA' | 'OS' | 'Analog & Digital' | 'DBMS';
export type VivaDifficulty = 'Quick Viva' | 'External Examiner';

interface SubjectMeta {
  code: string;
  name: string;
  semester: string;
  iconName: string;
  starterQuestions: {
    'Quick Viva': string[];
    'External Examiner': string[];
  };
}

const SUBJECT_REGISTRY: Record<VivaSubject, SubjectMeta> = {
  DSA: {
    code: 'PCC-CS301',
    name: 'Data Structures & Algorithms',
    semester: 'Sem 3',
    iconName: 'DSA',
    starterQuestions: {
      'Quick Viva': [
        'What is the difference between an Array and a Singly Linked List in terms of memory cache locality?',
        'What is the average and worst-case time complexity of QuickSort?',
        'How does a Hash Table resolve collisions using Open Addressing vs Separate Chaining?',
        'What is the minimum number of queues needed to implement a Stack?',
      ],
      'External Examiner': [
        'In an AVL Tree, why does a double rotation (RL or LR) take exactly O(1) time despite rebalancing?',
        'Explain why Dijkstra’s greedy algorithm fails on negative weight cycles while Bellman-Ford succeeds.',
        'Prove why comparison-based sorting algorithms cannot beat O(n log n) in the worst case.',
        'How does B-Tree node split factor guarantee logarithmic disk I/O operations in high-concurrency databases?',
      ],
    },
  },
  COA: {
    code: 'PCC-CS302',
    name: 'Computer Organisation',
    semester: 'Sem 3',
    iconName: 'COA',
    starterQuestions: {
      'Quick Viva': [
        'What is the fundamental difference between Von Neumann and Harvard memory architecture?',
        'What is a pipeline hazard, and what are the three major types?',
        'What is the difference between Spatial Locality and Temporal Locality in cache memory?',
        'What is the difference between Direct Mapped Cache and Fully Associative Cache?',
      ],
      'External Examiner': [
        'Explain how Tomasulo’s algorithm dynamically schedules instructions using reservation stations to resolve WAR and WAW hazards.',
        'During a Virtual Memory Translation Lookaside Buffer (TLB) miss, trace the exact hardware-software handshake for a 2-level page table.',
        'How does Booth’s Multiplication Algorithm handle negative multiplicands in 2’s complement representation without sign-extension overflow?',
        'Explain cache coherence snooping protocols: how does MESI transition a cache line from Shared to Modified during a bus write?',
      ],
    },
  },
  OS: {
    code: 'PCC-CS502',
    name: 'Operating Systems',
    semester: 'Sem 5',
    iconName: 'OS',
    starterQuestions: {
      'Quick Viva': [
        'What are the 4 Coffman conditions required for a system deadlock to happen?',
        'What is the difference between a Process and a Thread in terms of address space?',
        'Why does Belady’s Anomaly occur in FIFO page replacement policy?',
        'What is the difference between Preemptive and Non-Preemptive CPU scheduling?',
      ],
      'External Examiner': [
        'Explain how the Banker’s Algorithm evaluates safe states before granting an allocation matrix request.',
        'Why do Linux kernels use Completely Fair Scheduler (CFS) with red-black trees instead of multilevel feedback queues for O(1) scheduling?',
        'How does a spinlock differ from a sleeping mutex under SMP (Symmetric Multi-Processing), and why is spinning dangerous on a single-core CPU?',
        'Explain how the Copy-On-Write (COW) optimization avoids memory duplication during the fork() system call until an exec() or memory write.',
      ],
    },
  },
  'Analog & Digital': {
    code: 'ESC301',
    name: 'Analog & Digital Electronics',
    semester: 'Sem 3',
    iconName: 'ADE',
    starterQuestions: {
      'Quick Viva': [
        'What is the primary difference between Combinational and Sequential digital circuits?',
        'What is the Barkhausen criterion for an analog electronic oscillator?',
        'Why do CMOS logic gates consume negligible static power compared to TTL gates?',
        'Explain the race-around condition in a basic J-K flip-flop and how a Master-Slave setup prevents it.',
      ],
      'External Examiner': [
        'Define setup time (t_setup) and hold time (t_hold) of a D flip-flop, and explain what happens when metastability occurs on clock jitter.',
        'Why does a Common Emitter (CE) amplifier introduce a 180-degree phase shift between base input and collector output voltage?',
        'Design a 2-input XOR gate using only the minimum number of 2-input NAND gates, and state the gate propagation delay.',
        'How does negative feedback in an operational amplifier (Op-Amp) widen closed-loop bandwidth while reducing voltage gain?',
      ],
    },
  },
  DBMS: {
    code: 'PCC-CS601',
    name: 'Database Management Systems',
    semester: 'Sem 6',
    iconName: 'DBMS',
    starterQuestions: {
      'Quick Viva': [
        'What do the four letters in ACID transaction properties stand for?',
        'What is the difference between 2NF and 3NF in database normalization?',
        'What is the difference between a Primary Key, Candidate Key, and Foreign Key?',
        'Why do relational databases prefer B+ Trees over Hash indexes for index storage?',
      ],
      'External Examiner': [
        'Explain the Two-Phase Locking (2PL) protocol: how does Strict 2PL prevent cascading aborts during transaction rollbacks?',
        'What is the exact distinction between Read Committed and Repeatable Read isolation levels regarding Phantom Reads?',
        'Explain Write-Ahead Logging (WAL) and the ARIES recovery algorithm phases (Analysis, Redo, Undo) following an unexpected database server crash.',
        'How does a clustered index dictate physical record sequence on disk, and why can a table have only one clustered index?',
      ],
    },
  },
};

export function AiVivaBuddy() {
  // Config state
  const [selectedSubject, setSelectedSubject] = useState<VivaSubject>('DSA');
  const [selectedDifficulty, setSelectedDifficulty] = useState<VivaDifficulty>('Quick Viva');
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

  // Speech Recognition state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Session scorecard
  const [sessionScore, setSessionScore] = useState({
    answered: 0,
    correct: 0,
    streak: 0,
  });

  // Pick random question from question bank for current subject
  const pickNewQuestion = useCallback((subject: VivaSubject, difficulty: VivaDifficulty) => {
    const questions = SUBJECT_REGISTRY[subject]?.starterQuestions[difficulty] || SUBJECT_REGISTRY.DSA.starterQuestions['Quick Viva'];
    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQ);
    setReactionText('');
    setExplanationText('');
    setEmotion('idle');
    setStudentAnswer('');
  }, []);

  // Initialize opening question
  useEffect(() => {
    pickNewQuestion(selectedSubject, selectedDifficulty);
  }, [selectedSubject, selectedDifficulty, pickNewQuestion]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = 'en-IN'; // Indian English for college viva accuracy

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
          console.warn('[Viva Buddy Voice] Speech Recognition Error:', err);
          setIsListening(false);
          setEmotion((prev) => (prev === 'listening' ? 'idle' : prev));
        };

        recog.onend = () => {
          setIsListening(false);
          setEmotion((prev) => (prev === 'listening' ? 'idle' : prev));
        };

        recognitionRef.current = recog;
      } else {
        setSpeechSupported(false);
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
    };
  }, []);

  // Synthesize Speech for Viva Buddy
  const speakVoice = useCallback((textToSpeak: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Cancel any lingering speech

    // Remove markdown symbols for clean speech
    const cleanText = textToSpeak.replace(/[*_#`~[\]]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => (v.lang.includes('en-IN') || v.lang.includes('en-US') || v.lang.includes('en-GB')) && !v.name.includes('Google')
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isVoiceEnabled]);

  // Stop speaking
  const stopVoice = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle Microphone
  const toggleListening = () => {
    if (!speechSupported) {
      alert('Speech Recognition is not supported by your current browser. You can type your answer in the box below!');
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
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Speech recognition restart issue:', err);
      }
    }
  };

  // Submit Answer to AI Viva Evaluator
  const handleSubmitAnswer = async (overrideAnswer?: string) => {
    const finalAnswer = (overrideAnswer !== undefined ? overrideAnswer : studentAnswer).trim();
    if (!finalAnswer) return;

    // Stop microphone if currently listening
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);
    setEmotion('thinking');

    try {
      const res = await fetch('/api/viva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          answer: finalAnswer,
          subject: selectedSubject,
          difficulty: selectedDifficulty,
        }),
      });

      const data: VivaResponse = await res.json();

      setReactionText(data.reaction);
      setExplanationText(data.explanation);
      setEmotion(data.emotion);
      setActiveProvider(data.provider);

      // Update scorecard
      const wasCorrect = data.isCorrect ?? (data.emotion === 'happy');
      setSessionScore((prev) => ({
        answered: prev.answered + 1,
        correct: prev.correct + (wasCorrect ? 1 : 0),
        streak: wasCorrect ? prev.streak + 1 : 0,
      }));

      // Speak reaction + next question if voice enabled
      if (isVoiceEnabled) {
        const speechContent = `${data.reaction}. ${data.explanation} Here is your next viva question: ${data.nextQuestion}`;
        speakVoice(speechContent);
      }

      // Transition to next question
      if (data.nextQuestion) {
        setCurrentQuestion(data.nextQuestion);
        setStudentAnswer('');
      }
    } catch (err) {
      console.error('Viva submission failed:', err);
      setReactionText('Network timeout on the viva console! Reviewing offline.');
      setExplanationText('Ensure your local server and API keys are configured properly.');
      setEmotion('shocked');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Surrender / Skip Question
  const handleSkipQuestion = () => {
    handleSubmitAnswer("I don't know the exact mechanism, please explain.");
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Controls Strip */}
      <div className="bg-white border border-[#E4E4E7] rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Row 1: Subject Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200/60 font-mono text-[11px] font-bold">
                B.TECH VIVA VOCE
              </span>
              <span className="font-mono text-xs text-[#52525B]">
                {SUBJECT_REGISTRY[selectedSubject].code} • {SUBJECT_REGISTRY[selectedSubject].semester}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#09090B] font-display">
              Expressive AI Viva Buddy
            </h2>
          </div>

          {/* Voice & Difficulty Switches */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Difficulty Toggle */}
            <div className="inline-flex items-center bg-zinc-100 p-1 rounded-lg border border-[#E4E4E7] text-xs font-mono font-medium">
              {(['Quick Viva', 'External Examiner'] as VivaDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-white text-[#09090B] shadow-2xs font-bold border border-zinc-200/80'
                      : 'text-[#52525B] hover:text-[#09090B]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Voice Toggle */}
            <button
              onClick={() => {
                if (isVoiceEnabled && isSpeaking) stopVoice();
                setIsVoiceEnabled(!isVoiceEnabled);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                isVoiceEnabled
                  ? 'bg-blue-50 text-[#2563EB] border-blue-200 hover:bg-blue-100'
                  : 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200'
              }`}
              title={isVoiceEnabled ? 'Voice output enabled (click to mute)' : 'Voice muted (click to enable)'}
            >
              {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#2563EB]" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isVoiceEnabled ? 'Voice ON' : 'Muted'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Subject Selector Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-[#F1F5F9]">
          <span className="text-xs font-mono text-zinc-400 shrink-0 mr-1 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            Subject:
          </span>
          {(Object.keys(SUBJECT_REGISTRY) as VivaSubject[]).map((sub) => {
            const isSelected = selectedSubject === sub;
            const meta = SUBJECT_REGISTRY[sub];
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                    : 'bg-zinc-50 text-[#52525B] border border-zinc-200/90 hover:bg-zinc-100 hover:text-[#09090B]'
                }`}
              >
                <span>{sub}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-blue-700 text-blue-100' : 'bg-zinc-200 text-zinc-600'}`}>
                  {meta.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center Stage: Elevated White Card with Character & Expressive Subtitle Bubble */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Subtle Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Status Indicators (Provider, Emotion Badge, Session Score) */}
        <div className="w-full flex items-center justify-between gap-2 mb-6 z-10 flex-wrap">
          {/* Active Provider Pill */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono text-[#52525B]">
              Engine:{' '}
              <strong className="text-[#09090B]">
                {activeProvider === 'groq'
                  ? '⚡ Groq (llama-3.3-70b)'
                  : activeProvider === 'gemini'
                  ? '✨ Gemini 2.5 Flash'
                  : 'Groq Primary + Gemini Fallback'}
              </strong>
            </span>
          </div>

          {/* Session Stats Tracker */}
          <div className="inline-flex items-center gap-3 bg-zinc-50 border border-zinc-200/80 px-3 py-1 rounded-full text-xs font-mono text-zinc-600">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              Score: <strong className="text-zinc-900">{sessionScore.correct}/{sessionScore.answered}</strong>
            </span>
            <span className="text-zinc-300">•</span>
            <span>
              Streak: <strong className="text-emerald-600">{sessionScore.streak} 🔥</strong>
            </span>
          </div>
        </div>

        {/* The Expressive Animated Character */}
        <div className="relative my-2 z-10">
          <VivaBuddyCharacter emotion={emotion} size={190} />

          {/* Audio Speaking Wave Badge */}
          {isSpeaking && (
            <div className="absolute -top-2 right-0 bg-blue-600 text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1.5 animate-pulse">
              <Volume2 className="w-3 h-3" />
              Speaking...
              <button 
                onClick={stopVoice}
                className="hover:bg-blue-700 rounded p-0.5 ml-0.5"
                title="Silence"
              >
                <Square className="w-2.5 h-2.5 fill-white" />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Emotional Subtitle Bubble */}
        <div className="w-full max-w-2xl mt-4 z-10 space-y-3">
          {/* Reaction Roast / Praise Banner (Appears after answer evaluation) */}
          {reactionText && (
            <div
              className={`p-3.5 rounded-xl border text-left transition-all animate-in fade-in slide-in-from-bottom-2 ${
                emotion === 'happy'
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/90 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg shrink-0 mt-0.5">
                  {emotion === 'happy' ? '🎉' : '😱'}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold tracking-tight">
                    {reactionText}
                  </p>
                  {explanationText && (
                    <p className="text-xs leading-relaxed opacity-90 font-sans">
                      {explanationText}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Current Viva Question Display */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left relative group">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Examiner's Question
              </span>
              <button
                onClick={() => pickNewQuestion(selectedSubject, selectedDifficulty)}
                className="text-[11px] font-mono text-zinc-400 hover:text-zinc-700 flex items-center gap-1 transition-colors cursor-pointer"
                title="Shuffle a new starter question"
              >
                <RefreshCw className="w-3 h-3" />
                New Question
              </button>
            </div>

            <p className="text-base sm:text-lg font-medium text-[#09090B] font-display leading-snug">
              {currentQuestion || 'Loading viva question...'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Input Bar: Tactile Mic Button + Text Fallback */}
      <div className="bg-white border border-[#E4E4E7] rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitAnswer();
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          {/* Big Tactile Hold/Click to Speak Mic Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`relative flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 cursor-pointer select-none ${
              isListening
                ? 'bg-rose-600 text-white shadow-lg ring-4 ring-rose-200 animate-pulse'
                : 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-98 shadow-xs'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 animate-bounce" />
                <span>Listening... (Click to Stop)</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-rose-400" />
                <span>Click to Speak (Mic)</span>
              </>
            )}
          </button>

          {/* Clean Text Input Fallback */}
          <div className="relative flex-1">
            <input
              type="text"
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              disabled={isEvaluating}
              placeholder={
                isListening
                  ? 'Transcribing your voice in real time...'
                  : 'Or type your viva answer here (e.g. O(1) time complexity because...)'
              }
              className="w-full px-4 py-3 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all font-sans"
            />
          </div>

          {/* Submit Answer Button */}
          <button
            type="submit"
            disabled={!studentAnswer.trim() || isEvaluating}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-mono font-bold transition-all shrink-0 cursor-pointer shadow-xs"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <span>Submit Answer</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Helper Actions Row */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSkipQuestion}
              disabled={isEvaluating}
              className="hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>I Don't Know / Skip Question</span>
            </button>
          </div>

          <div className="text-[11px] text-zinc-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-bold text-zinc-600">Enter</kbd> to submit
          </div>
        </div>
      </div>
    </div>
  );
}
