'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  User, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { CompanionMessage } from '../types';

export function AiStudyCompanion() {
  const [messages, setMessages] = useState<CompanionMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I am your **SanakaHub AI Study & Campus Companion**.

I can help you with:
- **MAKAUT Exam Schedules & CA/PCA dates**
- **Syllabus details & subject codes** (e.g. \`PCC-CS301\`, \`ESC301\`)
- **SGPA, YGPA, and MAKAUT percentage formulas**
- **SETGOI Campus shuttle timings & B.Tech laboratory operating schedules**
- **TechFest 2026 events & pass registrations**

What would you like to check today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    'When are CA1 & Theory exams scheduled?',
    'Raniganj to SETGOI bus timings',
    'How do I calculate MAKAUT YGPA and percentage?',
    'B.Tech laboratory and library operating hours',
    'TechFest 2026 hackathon details',
  ];

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Handle Send Message
  const handleSendMessage = async (promptText?: string) => {
    const textToSend = (promptText || inputPrompt).trim();
    if (!textToSend || isStreaming) return;

    setInputPrompt('');

    const userMessage: CompanionMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMsgId = `assistant-${Date.now()}`;
    const initialAssistantMsg: CompanionMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage, initialAssistantMsg]);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/ai/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server returned error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        accumulated += chunkText;

        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === assistantMsgId) {
              return { ...m, content: accumulated };
            }
            return m;
          })
        );
      }
    } catch (err: any) {
      console.error('Streaming error:', err);
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === assistantMsgId) {
            return {
              ...m,
              content:
                'I encountered a brief connection issue. Please verify your network or try asking again.',
            };
          }
          return m;
        })
      );
    } finally {
      setIsStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat session refreshed. How can I assist you with SETGOI campus queries or MAKAUT academic info?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              <Bot className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              AI Study & Campus Companion
            </h2>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Grounded in official MAKAUT 2026–27 curriculum, SETGOI bus routes, engineering lab facilities, and student utilities. Real-time streaming powered by <code className="font-mono text-zinc-700">@google/genai</code>.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
          Clear Conversation
        </button>
      </div>

      {/* Suggested Quick Question Chips */}
      <div>
        <p className="text-[11px] font-mono uppercase text-zinc-400 mb-2 font-semibold">
          Suggested Queries:
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isStreaming}
              className="px-2.5 py-1 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 text-xs transition-colors disabled:opacity-50 text-left"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Display Box */}
      <div className="border border-zinc-200 rounded-xl bg-white shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-zinc-50/30">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-2xs ${
                    isUser
                      ? 'bg-zinc-900 text-white rounded-tr-xs'
                      : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 pb-1.5 mb-1.5 border-b border-black/10 dark:border-white/10 text-[10px] opacity-70">
                    <span className="font-semibold">{isUser ? 'You' : 'SanakaHub AI'}</span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      {!isUser && msg.content && (
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="hover:opacity-100 transition-opacity"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3 text-zinc-400 hover:text-zinc-700" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Render content with basic markdown handling */}
                  <div className="leading-relaxed whitespace-pre-wrap break-words space-y-2">
                    {msg.content ? (
                      msg.content
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-zinc-400 italic">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-600" />
                        Generating response...
                      </span>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-zinc-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about MAKAUT syllabus, CA exam dates, bus timings, or campus rules..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={isStreaming}
              className="flex-1 px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isStreaming || !inputPrompt.trim()}
              className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 text-white disabled:text-zinc-400 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
