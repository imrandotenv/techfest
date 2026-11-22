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
  Award,
  GraduationCap,
  Flame,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Square,
  Copy,
  Check,
  BookOpen,
  FileText,
  X,
  Wrench,
  Zap,
  Loader2,
} from 'lucide-react';
import { VivaBuddyCharacter, VivaEmotion } from '@/components/VivaBuddyCharacter';
import { VivaResponse, ChatMessage } from '@/app/api/viva/route';
import { PageHeader } from '@/components/PageHeader';

export type VivaSubject = 'DSA' | 'COA' | 'OS' | 'Digital Electronics' | 'DBMS';
export type VivaLanguage = 'en' | 'hi';

export interface SubjectInfo {
  code: string;
  name: string;
  semester: string;
  starterQuestions: {
    en: string[];
    hi: string[];
  };
}

export const SUBJECT_CATALOG: Record<VivaSubject, SubjectInfo> = {
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

export interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reaction?: string;
  explanation?: string;
  nextQuestion?: string;
  isCorrect?: boolean | null;
  topicTag?: string;
  provider?: 'groq' | 'gemini' | 'simulation';
  intent?: 'answer' | 'hint' | 'example' | 'skip' | 'harder';
  timestamp: string;
}

export default function VivaStudioPage() {
  const { user, isLoaded, isSignedIn } = useUser();

  // Control bar state
  const [subject, setSubject] = useState<VivaSubject>('DSA');
  const [language, setLanguage] = useState<VivaLanguage>('en');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);

  // Active question being answered
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [emotion, setEmotion] = useState<VivaEmotion>('idle');
  const [activeTopicTag, setActiveTopicTag] = useState<string>('Stack Implementation via Queues');
  const [activeProvider, setActiveProvider] = useState<'groq' | 'gemini' | 'simulation' | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Chat stream messages
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Free attempts for guest users
  const [freeCount, setFreeCount] = useState<number>(0);
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Groq Whisper Recording & Transcribing state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Score stats
  const [scorecard, setScorecard] = useState({
    attempts: 0,
    correct: 0,
    streak: 0,
  });

  // Weak topics recorded when student answers incorrectly
  const [weakTopics, setWeakTopics] = useState<Array<{ topic: string; subject: string; question: string }>>([]);

  // Load free guest count from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sanakahub_viva_free_count');
      if (stored) {
        setFreeCount(parseInt(stored, 10) || 0);
      }
    }
  }, []);

  const isGuestLocked = !isSignedIn && freeCount >= FREE_GUEST_LIMIT;
  const remainingFree = Math.max(0, FREE_GUEST_LIMIT - freeCount);

  // Auto-scroll chat to bottom
  const scrollToBottom = useCallback(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isEvaluating, scrollToBottom]);

  const stopVoice = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsSpeaking(false);
    }
  }, []);

  const playBrowserSpeech = useCallback((text: string, lang: VivaLanguage) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    let chosenVoice: SpeechSynthesisVoice | undefined;

    if (lang === 'hi') {
      chosenVoice =
        voices.find((v) => v.name.includes('Swara') || v.name.includes('Madhur') || v.name.includes('Neerja')) ||
        voices.find((v) => v.lang === 'hi-IN' || v.name.includes('Hindi') || v.name.includes('हिन्दी')) ||
        voices.find((v) => v.lang.includes('en-IN'));
    } else {
      chosenVoice =
        voices.find((v) => v.name.includes('Neerja Online') || v.name.includes('Neerja') || v.name.includes('Prabhat')) ||
        voices.find((v) => v.lang === 'en-IN') ||
        voices.find((v) => v.name.includes('Natural') || v.name.includes('Google UK English Female') || v.name.includes('Google US English')) ||
        voices.find((v) => v.lang.startsWith('en'));
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // High-Quality Speech Player (Sarvam AI / Groq TTS with Neural Browser Fallback)
  const speakVoice = useCallback(
    async (textToSpeak: string) => {
      if (!isVoiceEnabled || typeof window === 'undefined') return;

      // Stop any active speech
      stopVoice();

      try {
        const ttsRes = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToSpeak, language }),
        });

        if (ttsRes.ok) {
          const ttsData = await ttsRes.json();
          const cleanText = ttsData.cleanText || textToSpeak;

          if (ttsData.audio) {
            const mime = ttsData.format === 'mp3' ? 'audio/mp3' : 'audio/wav';
            const audioUrl = `data:${mime};base64,${ttsData.audio}`;
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

          // Fallback to neural browser speech with cleanText
          playBrowserSpeech(cleanText, language);
          return;
        }
      } catch (e) {
        console.warn('[TTS] Cloud audio playback skipped, falling back to browser speech:', e);
      }

      playBrowserSpeech(textToSpeak, language);
    },
    [isVoiceEnabled, language, stopVoice, playBrowserSpeech]
  );

  // Pick Initial Question and reset chat for subject/language
  const initializeSubject = useCallback(
    (targetSubject: VivaSubject, targetLang: VivaLanguage) => {
      stopVoice();
      const list = SUBJECT_CATALOG[targetSubject]?.starterQuestions[targetLang] || SUBJECT_CATALOG.DSA.starterQuestions.en;
      const initialQ = list[Math.floor(Math.random() * list.length)];
      setCurrentQuestion(initialQ);
      setStudentAnswer('');
      setEmotion('idle');
      setActiveTopicTag(`${targetSubject} Core`);

      const welcomeMsg: MessageItem = {
        id: 'initial-' + Date.now(),
        role: 'assistant',
        content: targetLang === 'hi'
          ? `Namaste! Main hu Viva Buddy. ${SUBJECT_CATALOG[targetSubject].name} (${SUBJECT_CATALOG[targetSubject].code}) ka viva shuru karte hain. Pehla sawal ye raha:`
          : `Welcome to SETGOI Viva Voce for ${SUBJECT_CATALOG[targetSubject].name} (${SUBJECT_CATALOG[targetSubject].code}). Let us begin with your first question:`,
        nextQuestion: initialQ,
        topicTag: `${targetSubject} Intro`,
        isCorrect: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([welcomeMsg]);
    },
    [stopVoice]
  );

  useEffect(() => {
    initializeSubject(subject, language);
  }, [subject, language, initializeSubject]);

  // Submit Turn (Answer, Hint, Example, Skip, Harder)
  const handleSendTurn = useCallback(
    async (
      overrideText?: string,
      forcedIntent: 'answer' | 'hint' | 'example' | 'skip' | 'harder' = 'answer'
    ) => {
      if (isGuestLocked) {
        setShowSignInModal(true);
        return;
      }

      const textToSend = (overrideText !== undefined ? overrideText : studentAnswer).trim();
      if (!textToSend && forcedIntent === 'answer') return;

      if (isRecording && mediaRecorderRef.current) {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
        setIsRecording(false);
      }
      stopVoice();

      // Append user message to chat stream
      const userMsg: MessageItem = {
        id: 'usr-' + Date.now(),
        role: 'user',
        content: textToSend,
        intent: forcedIntent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setStudentAnswer('');
      setIsEvaluating(true);
      setEmotion('thinking');

      // Build recent conversation history for API
      const historyPayload: ChatMessage[] = nextMessages.slice(-8).map((m) => ({
        role: m.role,
        content: m.role === 'user' ? m.content : `${m.reaction || ''} ${m.explanation || ''} ${m.nextQuestion || ''}`.trim(),
      }));

      try {
        const res = await fetch('/api/viva', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: currentQuestion,
            answer: textToSend,
            subject,
            language,
            history: historyPayload,
            intent: forcedIntent,
          }),
        });

        const data: VivaResponse = await res.json();

        setEmotion(data.emotion);
        setActiveProvider(data.provider);
        if (data.topicTag) setActiveTopicTag(data.topicTag);

        // Track guest count only on real evaluated answers (not hints or examples)
        if (!isSignedIn && data.isCorrect !== null) {
          const nextCount = freeCount + 1;
          setFreeCount(nextCount);
          if (typeof window !== 'undefined') {
            localStorage.setItem('sanakahub_viva_free_count', nextCount.toString());
          }
          if (nextCount >= FREE_GUEST_LIMIT) {
            setTimeout(() => setShowSignInModal(true), 3500);
          }
        }

        // Update scorecard if answer was scored
        if (data.isCorrect !== null) {
          setScorecard((prev) => ({
            attempts: prev.attempts + 1,
            correct: prev.correct + (data.isCorrect ? 1 : 0),
            streak: data.isCorrect ? prev.streak + 1 : 0,
          }));

          if (!data.isCorrect) {
            setWeakTopics((prev) => [
              ...prev,
              {
                topic: data.topicTag || `${subject} Core`,
                subject,
                question: currentQuestion,
              },
            ]);
          }
        }

        // Add examiner response to chat
        const assistantMsg: MessageItem = {
          id: 'ast-' + Date.now(),
          role: 'assistant',
          content: data.explanation,
          reaction: data.reaction,
          explanation: data.explanation,
          nextQuestion: data.nextQuestion,
          isCorrect: data.isCorrect,
          topicTag: data.topicTag,
          provider: data.provider,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Update active question for next turn
        if (data.nextQuestion) {
          setCurrentQuestion(data.nextQuestion);
        }

        // Speak aloud if voice enabled
        if (isVoiceEnabled) {
          const voiceScript = `${data.reaction || ''} ${data.explanation || ''} ${
            data.nextQuestion ? (language === 'hi' ? 'Agla sawal suno: ' : 'Here is your next question: ') + data.nextQuestion : ''
          }`.trim();
          speakVoice(voiceScript);
        }
      } catch (err) {
        console.error('Viva submission failed:', err);
        const errorMsg: MessageItem = {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: 'Server error encountered. Let us proceed with the next question.',
          reaction: language === 'hi' ? 'Server connect nahi ho paya! Agla try karte hain.' : 'Network error! Let us keep going.',
          explanation: 'Check server connection or retry your answer.',
          nextQuestion: 'What is the time complexity of binary search on a sorted array?',
          isCorrect: null,
          topicTag: `${subject} Review`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setEmotion('shocked');
      } finally {
        setIsEvaluating(false);
      }
    },
    [
      isGuestLocked,
      studentAnswer,
      isRecording,
      stopVoice,
      messages,
      currentQuestion,
      subject,
      language,
      isSignedIn,
      freeCount,
      isVoiceEnabled,
      speakVoice,
    ]
  );

  // Stop MediaRecorder and clear volume analyser
  const stopRecording = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    setAudioVolume(0);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Error stopping media recorder:', err);
      }
    }
  }, []);

  // Start MediaRecorder & stream audio chunks to Groq Whisper
  const startRecording = useCallback(async () => {
    if (isGuestLocked) {
      setShowSignInModal(true);
      return;
    }
    stopVoice();
    setMicError(null);

    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setMicError('Audio recording is not supported on your browser or device.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Audio volume analyser for live pulse ring
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          const source = ctx.createMediaStreamSource(stream);
          source.connect(analyser);
          audioContextRef.current = ctx;
          audioAnalyserRef.current = analyser;

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const checkVolume = () => {
            if (!audioAnalyserRef.current) return;
            audioAnalyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const avg = sum / bufferLength;
            setAudioVolume(Math.min(100, Math.round((avg / 128) * 100)));
            animFrameRef.current = requestAnimationFrame(checkVolume);
          };
          checkVolume();
        }
      } catch {}

      let mimeType = 'audio/webm;codecs=opus';
      if (typeof MediaRecorder !== 'undefined') {
        if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          if (MediaRecorder.isTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
          } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          } else {
            mimeType = '';
          }
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        const chunks = audioChunksRef.current;
        if (chunks.length === 0) {
          setIsRecording(false);
          setEmotion('idle');
          return;
        }

        const audioBlob = new Blob(chunks, {
          type: recorder.mimeType || 'audio/webm',
        });

        if (audioBlob.size < 600) {
          setIsRecording(false);
          setEmotion('idle');
          return;
        }

        setIsRecording(false);
        setIsTranscribing(true);
        setEmotion('thinking');

        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'viva-recording.webm');
          formData.append('language', language);

          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            const transcribed = (data.text || '').trim();
            if (transcribed) {
              setStudentAnswer(transcribed);
              await handleSendTurn(transcribed, 'answer');
            } else {
              setMicError('Could not transcribe audio. Please try speaking again or type your answer.');
              setEmotion('idle');
            }
          } else {
            const errJson = await res.json().catch(() => ({}));
            setMicError(errJson.error || 'Whisper transcription failed. Please try typing your answer.');
            setEmotion('idle');
          }
        } catch (transcribeErr: any) {
          setMicError('Audio transcription failed. Please type your answer.');
          setEmotion('idle');
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);
      setEmotion('listening');

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('[Viva MediaRecorder] Permission or device error:', err);
      setMicError('Microphone permission denied or device busy. Please allow mic access or type your answer below.');
      setIsRecording(false);
      setEmotion('idle');
    }
  }, [isGuestLocked, stopVoice, language, handleSendTurn]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    return () => {
      stopRecording();
      stopVoice();
    };
  }, [stopRecording, stopVoice]);

  // Quick Action Handlers
  const handleAskHint = () => {
    handleSendTurn(
      language === 'hi' ? 'Bhai thoda hint do, main solve karne ki koshish karta hu.' : 'Could you give me a hint on this question?',
      'hint'
    );
  };

  const handleAskExample = () => {
    handleSendTurn(
      language === 'hi' ? 'Ek real-world example se explain karke samjha do please.' : 'Can you explain this concept with a concrete example?',
      'example'
    );
  };

  const handleAskHarder = () => {
    handleSendTurn(
      language === 'hi' ? 'Ye simple hai, ab is subject ka koi tough viva question pucho!' : 'I am ready for a harder viva question from this syllabus.',
      'harder'
    );
  };

  const handleSkipQuestion = () => {
    handleSendTurn(
      language === 'hi' ? 'Mujhe nahi pata bhai, please exact jawab samjha do.' : "I don't know the exact mechanism, please explain.",
      'skip'
    );
  };

  // Copy concept to clipboard
  const handleCopyConcept = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Calculate score %
  const accuracyPct = scorecard.attempts > 0 ? Math.round((scorecard.correct / scorecard.attempts) * 100) : 0;

  // Grade classification
  const getGradeInfo = (pct: number) => {
    if (pct >= 85) return { grade: 'A+', label: 'MAKAUT External Ready', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (pct >= 70) return { grade: 'A', label: 'Strong Engineering Foundation', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (pct >= 50) return { grade: 'B', label: 'Good Attempt • Needs Revision', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { grade: 'C', label: 'Core Concepts Need Revision', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const gradeInfo = getGradeInfo(accuracyPct);

  return (
    <div className="w-full space-y-5">
      {/* Top Header & Compact Controls Strip */}
      <div className="w-full space-y-4">
        {/* Unified Compact Page Header Strip */}
        <PageHeader
          badge="AI VIVA STUDIO"
          badgeCode="MAKAUT 2026"
          title="Conversational AI Viva Studio"
          subtitle="Interactive rapid-fire viva voce with expressive animated examiner, live speech recognition, and instant concept feedback."
          action={
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
                  <span>{remainingFree > 0 ? `${remainingFree} Free Left` : 'Sign In Required'}</span>
                </button>
              )}

              {/* Live Score Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4E4E7] text-xs font-mono text-[#09090B] shadow-2xs">
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

              {/* Finish & Report Button */}
              <button
                onClick={() => setShowReportModal(true)}
                className="sanaka-btn-primary px-3.5 py-1.5 text-xs font-sans font-semibold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Report Card</span>
              </button>
            </div>
          }
        />

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

      {/* Main Studio Grid: Left Examiner Desk + Right Conversational Chat Feed */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column: Examiner Desk (Sidebar on desktop, compact on mobile) */}
        <div className="md:col-span-4 lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs flex flex-col items-center text-center space-y-4">
            {/* Expressive Animated Character */}
            <div className="relative py-1">
              <VivaBuddyCharacter emotion={emotion} size={140} />
            </div>

            {/* Live Status Badge */}
            <div className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-[#E4E4E7] text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSpeaking
                    ? 'bg-blue-500 animate-pulse'
                    : isRecording
                    ? 'bg-rose-500 animate-ping'
                    : isTranscribing
                    ? 'bg-purple-500 animate-pulse'
                    : isEvaluating
                    ? 'bg-amber-500 animate-pulse'
                    : emotion === 'happy'
                    ? 'bg-emerald-500'
                    : emotion === 'shocked'
                    ? 'bg-rose-500'
                    : 'bg-blue-500'
                }`}
              />
              <span className="font-semibold text-[#09090B]">
                {isSpeaking
                  ? 'Speaking...'
                  : isRecording
                  ? `Recording (${recordingSeconds}s)...`
                  : isTranscribing
                  ? 'Whisper Transcribing...'
                  : isEvaluating
                  ? 'Evaluating...'
                  : emotion === 'happy'
                  ? 'Full Marks!'
                  : emotion === 'shocked'
                  ? 'Examiner Roast'
                  : 'Ready for Answer'}
              </span>

              {/* Stop Speaking button if active audio */}
              {isSpeaking && (
                <button
                  onClick={stopVoice}
                  className="ml-1 px-1.5 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                  title="Stop Examiner Voice"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                  <span>Stop</span>
                </button>
              )}
            </div>

            {/* Subject Details & Syllabus Code */}
            <div className="w-full pt-1 border-t border-[#E4E4E7] space-y-1 text-left">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#52525B]">
                <span>SUBJECT</span>
                <span className="font-bold text-[#2563EB]">{SUBJECT_CATALOG[subject].code}</span>
              </div>
              <div className="text-xs font-semibold text-[#09090B] truncate">
                {SUBJECT_CATALOG[subject].name}
              </div>
              <div className="text-[11px] font-mono text-[#52525B]">
                Active Topic: <span className="font-medium text-[#09090B]">{activeTopicTag}</span>
              </div>
            </div>

            {/* Performance Mini-Stats */}
            <div className="w-full grid grid-cols-2 gap-2 pt-1 border-t border-[#E4E4E7]">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-[#E4E4E7] text-left">
                <div className="text-[10px] font-mono text-[#52525B] uppercase">Accuracy</div>
                <div className="text-sm font-bold font-mono text-[#09090B]">{accuracyPct}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-[#E4E4E7] text-left">
                <div className="text-[10px] font-mono text-[#52525B] uppercase">Streak</div>
                <div className="text-sm font-bold font-mono text-orange-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  {scorecard.streak}
                </div>
              </div>
            </div>

            {/* Quick Session Reset */}
            <button
              onClick={() => initializeSubject(subject, language)}
              className="w-full py-2 px-3 rounded-xl border border-[#E4E4E7] hover:bg-zinc-50 text-xs font-mono text-[#52525B] hover:text-[#09090B] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Session</span>
            </button>
          </div>
        </div>

        {/* Right Column: Conversational Chat Feed & Sticky Input Dock */}
        <div className="md:col-span-8 lg:col-span-8 flex flex-col space-y-3">
          {/* Scrollable Chat Feed */}
          <div
            ref={chatScrollRef}
            className="w-full h-[480px] sm:h-[520px] overflow-y-auto bg-white border border-[#E4E4E7] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs"
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';

              if (isUser) {
                return (
                  <div key={msg.id} className="flex flex-col items-end space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#52525B] pr-1">
                      {msg.intent && msg.intent !== 'answer' && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[#2563EB] font-semibold border border-blue-200/50 uppercase">
                          {msg.intent}
                        </span>
                      )}
                      <span>You</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="bg-[#2563EB] text-white rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs sm:text-sm font-sans max-w-[85%] sm:max-w-[75%] shadow-xs leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex flex-col items-start space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#52525B] pl-1">
                    <span className="font-bold text-[#09090B]">Viva Examiner</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.provider && (
                      <span className="text-zinc-400">via {msg.provider}</span>
                    )}
                  </div>

                  <div className="bg-[#F8FAFC] border border-[#E4E4E7] rounded-2xl rounded-tl-xs p-4 sm:p-5 text-xs sm:text-sm font-sans max-w-[95%] sm:max-w-[92%] shadow-2xs space-y-3.5">
                    {/* Header Chips Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E4E4E7]">
                      <div className="flex items-center gap-1.5">
                        {msg.topicTag && (
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] font-mono text-[10px] font-bold border border-blue-200/60">
                            #{msg.topicTag}
                          </span>
                        )}

                        {msg.isCorrect === true && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Correct ✓</span>
                          </span>
                        )}

                        {msg.isCorrect === false && (
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-mono text-[10px] font-bold border border-rose-200 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>Needs Review</span>
                          </span>
                        )}

                        {msg.isCorrect === null && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3 text-amber-500" />
                            <span>Guidance</span>
                          </span>
                        )}
                      </div>

                      {/* Replay Voice Button */}
                      {(msg.reaction || msg.explanation) && (
                        <button
                          onClick={() => {
                            const replayScript = `${msg.reaction || ''} ${msg.explanation || ''} ${msg.nextQuestion || ''}`;
                            speakVoice(replayScript);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono text-[#52525B] hover:text-[#09090B] hover:bg-white border border-transparent hover:border-[#E4E4E7] transition-all cursor-pointer"
                          title="Replay Voice Audio"
                        >
                          <Volume2 className="w-3 h-3 text-[#2563EB]" />
                          <span>Replay</span>
                        </button>
                      )}
                    </div>

                    {/* Witty Reaction Line */}
                    {msg.reaction && (
                      <div
                        className={`p-3 rounded-xl border text-xs sm:text-sm font-medium ${
                          msg.isCorrect === true
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : msg.isCorrect === false
                            ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                            : 'bg-blue-50/80 border-blue-200 text-blue-950'
                        }`}
                      >
                        {msg.reaction}
                      </div>
                    )}

                    {/* Exact Technical Answer / Concept Box */}
                    {msg.explanation && (
                      <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E4E4E7] space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#2563EB]">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>EXACT TECHNICAL ANSWER &amp; CONCEPT</span>
                          </div>
                          <button
                            onClick={() => handleCopyConcept(msg.explanation || '', msg.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#52525B] hover:text-[#09090B] transition-colors cursor-pointer"
                            title="Copy concept"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600 font-semibold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-[#09090B] font-sans leading-relaxed">
                          {msg.explanation}
                        </p>
                      </div>
                    )}

                    {/* Next Question Highlight Box */}
                    {msg.nextQuestion && (
                      <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-200/60 space-y-1">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2563EB]">
                          Next Viva Question
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-[#09090B] font-display">
                          &ldquo;{msg.nextQuestion}&rdquo;
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isEvaluating && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F8FAFC] border border-[#E4E4E7] text-xs font-mono text-[#52525B] animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
                <span>Viva Examiner is evaluating your answer...</span>
              </div>
            )}
          </div>

          {/* Quick-Action Chips Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={handleAskHint}
              disabled={isEvaluating}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E4E4E7] hover:border-blue-300 text-xs font-mono text-[#09090B] hover:text-[#2563EB] transition-all flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>💡 Give a hint</span>
            </button>

            <button
              onClick={handleAskExample}
              disabled={isEvaluating}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E4E4E7] hover:border-blue-300 text-xs font-mono text-[#09090B] hover:text-[#2563EB] transition-all flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
            >
              <BookOpen className="w-3 h-3 text-blue-500" />
              <span>📝 Explain with example</span>
            </button>

            <button
              onClick={handleAskHarder}
              disabled={isEvaluating}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E4E4E7] hover:border-blue-300 text-xs font-mono text-[#09090B] hover:text-[#2563EB] transition-all flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
            >
              <Zap className="w-3 h-3 text-orange-500" />
              <span>🔥 Ask harder</span>
            </button>

            <button
              onClick={handleSkipQuestion}
              disabled={isEvaluating}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E4E4E7] hover:border-zinc-300 text-xs font-mono text-[#52525B] hover:text-[#09090B] transition-all flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
            >
              <HelpCircle className="w-3 h-3 text-zinc-400" />
              <span>⏭️ Next question</span>
            </button>
          </div>

          {/* Bottom Sticky Input Dock */}
          <div className="w-full space-y-2">
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
              <div className="space-y-2">
                {/* Inline Microphone Permission / Device Error */}
                {micError && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3.5 py-2 rounded-xl flex items-center justify-between gap-2 shadow-2xs animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{micError}</span>
                    </div>
                    <button
                      onClick={() => setMicError(null)}
                      className="text-amber-700 hover:text-amber-950 p-0.5 rounded hover:bg-amber-100 transition-colors cursor-pointer"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Transcribing with Whisper Micro-Status */}
                {isTranscribing && (
                  <div className="bg-blue-50/90 border border-blue-200 text-blue-800 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-2xs animate-in fade-in font-mono">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 shrink-0" />
                    <span>Transcribing with Groq Whisper (whisper-large-v3-turbo)...</span>
                  </div>
                )}

                {/* Main Input Dock */}
                <div className="bg-white border border-[#E4E4E7] rounded-2xl p-2 sm:p-2.5 shadow-xs flex items-center gap-2 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  {/* Upgraded Tactile Mic / Stop Button */}
                  <button
                    type="button"
                    onClick={toggleRecording}
                    disabled={isEvaluating || isTranscribing}
                    className={`p-3 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer relative ${
                      isRecording
                        ? 'bg-rose-600 text-white shadow-md ring-4 ring-rose-200'
                        : 'bg-zinc-100 text-[#09090B] hover:bg-zinc-200 border border-[#E4E4E7]'
                    }`}
                    style={{
                      transform: isRecording ? `scale(${1 + Math.min(0.12, audioVolume / 500)})` : undefined,
                    }}
                    title={
                      isRecording
                        ? 'Stop recording & transcribe with Whisper'
                        : `Speak answer with Groq Whisper (${language === 'hi' ? 'Hindi/Hinglish' : 'English'})`
                    }
                  >
                    {isRecording ? (
                      <Square className="w-4 h-4 fill-current animate-pulse" />
                    ) : (
                      <Mic className="w-4 h-4 text-[#2563EB]" />
                    )}
                  </button>

                  {/* Active Recording Capsule */}
                  {isRecording ? (
                    <div className="flex-1 flex items-center justify-between px-3 py-1.5 bg-rose-50/80 border border-rose-200 rounded-xl animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
                        <span className="text-xs font-mono font-bold text-rose-800">
                          0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                        </span>
                        <span className="text-xs text-rose-700 hidden sm:inline font-sans">
                          Listening in {language === 'hi' ? 'Hinglish / Hindi' : 'English'}...
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold font-mono flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Tap to Send</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Normal Answer Text Input */}
                      <input
                        type="text"
                        value={studentAnswer}
                        onChange={(e) => setStudentAnswer(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isEvaluating && !isTranscribing) {
                            handleSendTurn();
                          }
                        }}
                        disabled={isEvaluating || isTranscribing}
                        placeholder={
                          isTranscribing
                            ? 'Processing speech with Whisper...'
                            : language === 'hi'
                            ? 'Apna jawab yaha likho ya mic daba ke bolo...'
                            : 'Type your answer or click mic to speak (Press Enter)...'
                        }
                        className="flex-1 bg-transparent border-0 px-2 text-xs sm:text-sm text-[#09090B] placeholder:text-[#52525B]/60 focus:outline-hidden font-sans"
                      />

                      {/* Submit Button */}
                      <button
                        onClick={() => handleSendTurn()}
                        disabled={isEvaluating || isTranscribing || !studentAnswer.trim()}
                        className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-sans text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
                          studentAnswer.trim() && !isEvaluating && !isTranscribing
                            ? 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-xs'
                            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        }`}
                      >
                        <span className="hidden sm:inline">Answer</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Subtle Bottom Helper Notes */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#52525B] px-2">
              <span>
                Mode: {language === 'hi' ? 'हिंदी / Hinglish' : 'Indian English'} • {subject}
              </span>
              <span className="flex items-center gap-1.5">
                <Link href="/notes" className="hover:text-[#2563EB] underline transition-colors">
                  Theory Notes
                </Link>
                <span>•</span>
                <Link href="/tools" className="hover:text-[#2563EB] underline transition-colors">
                  Lab Practicals
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* End-of-Session Viva Report Card Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E4E4E7] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
            {/* Modal Close Button */}
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 text-[#52525B] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] shadow-2xs">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 font-mono text-[10px] font-bold">
                  SESSION ASSESSMENT
                </span>
                <h3 className="text-xl font-bold font-display text-[#09090B]">
                  SETGOI Viva Report Card
                </h3>
                <p className="text-xs text-[#52525B] font-mono">
                  {SUBJECT_CATALOG[subject].name} ({SUBJECT_CATALOG[subject].code})
                </p>
              </div>
            </div>

            {/* Scorecard Hero Banner */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E4E4E7] text-center">
              <div>
                <div className="text-[11px] font-mono text-[#52525B]">TOTAL TESTED</div>
                <div className="text-xl font-bold font-display text-[#09090B] mt-0.5">
                  {scorecard.attempts}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#52525B]">CORRECT</div>
                <div className="text-xl font-bold font-display text-emerald-600 mt-0.5">
                  {scorecard.correct}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#52525B]">ACCURACY</div>
                <div className="text-xl font-bold font-display text-[#2563EB] mt-0.5">
                  {accuracyPct}%
                </div>
              </div>
            </div>

            {/* Grade Rating Badge */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${gradeInfo.color}`}>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-xs font-bold font-sans">{gradeInfo.label}</div>
                  <div className="text-[11px] font-mono opacity-80">Based on MAKAUT External Viva Rubric</div>
                </div>
              </div>
              <div className="text-lg font-bold font-mono px-3 py-1 rounded-lg bg-white/80 border border-current">
                {gradeInfo.grade}
              </div>
            </div>

            {/* Weak Topics to Revise Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#09090B]">
                <span className="flex items-center gap-1.5 text-rose-600">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>WEAK TOPICS TO REVISE IN NOTES</span>
                </span>
                <span className="text-[11px] text-[#52525B] font-normal">
                  {weakTopics.length} topic{weakTopics.length !== 1 ? 's' : ''} detected
                </span>
              </div>

              {weakTopics.length > 0 ? (
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {weakTopics.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-[#E4E4E7] flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span className="font-semibold text-[#09090B] font-mono truncate">
                          {item.topic}
                        </span>
                      </div>
                      <Link
                        href="/notes"
                        className="text-[#2563EB] hover:text-blue-700 font-mono text-[11px] flex items-center gap-0.5 shrink-0 underline"
                      >
                        <span>Revise</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Flawless session! No incorrect answers were recorded.</span>
                </div>
              )}
            </div>

            {/* Navigation & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-[#E4E4E7]">
              <Link
                href="/notes"
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-sans text-xs font-semibold transition-all inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Revise in Notes Vault →</span>
              </Link>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  initializeSubject(subject, language);
                }}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-[#E4E4E7] hover:bg-zinc-100 text-xs font-mono text-[#09090B] transition-colors cursor-pointer"
              >
                Start New Viva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Centered Clerk Sign-In Modal when guest limit reached */}
      {showSignInModal && !isSignedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E4E4E7] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center relative animate-in zoom-in-95 duration-200">
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
                You have completed your 2 free practice rounds. Sign in with your SETGOI student account to unlock unlimited viva sessions, custom question banks, and live feedback.
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
