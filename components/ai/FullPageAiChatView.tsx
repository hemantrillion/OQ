'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Database, Send, Mic, MicOff, RefreshCw } from 'lucide-react';
import { Language, ChatMessage } from '@/lib/booking-types';
import { INITIAL_AI_CHAT_MESSAGES } from '@/lib/booking-data';
import { t } from '@/lib/translations';
import { LiveSchemaDrawer } from './LiveSchemaDrawer';

interface Props {
  language: Language;
  onClose: () => void;
  onToggleLanguage: () => void;
}

function formatCurrentTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const FullPageAiChatView: React.FC<Props> = ({
  language,
  onClose,
  onToggleLanguage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    INITIAL_AI_CHAT_MESSAGES.map((m) => ({
      ...m,
      timestamp: m.timestamp === 'Just now' ? formatCurrentTime() : m.timestamp,
    }))
  );
  const [inputText, setInputText] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const [generatedDbml, setGeneratedDbml] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<any>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSchemaOpen, setIsSchemaOpen] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTranslating]);

  // Synchronize browser native back button to close full-page AI view cleanly
  useEffect(() => {
    window.history.pushState({ view: 'ai' }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose]);

  // Get merchant name from local session
  let merchantName = 'Hemant Kumar';
  try {
    if (typeof window !== 'undefined') {
      const p = JSON.parse(localStorage.getItem('oq_active_profile') || '{}');
      if (p.ownerName || p.name) merchantName = p.ownerName || p.name;
    }
  } catch {}

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTranslating) return;

    const query = inputText.trim();
    const timeNow = formatCurrentTime();
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: timeNow,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTranslating(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const res = await fetch('/api/ai/translate-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_text: query,
          language,
          history: messages.slice(-8),
          current_state: currentState,
          merchant_name: merchantName,
        }),
      });

      if (!res.ok) {
        throw new Error(`API HTTP ${res.status}`);
      }

      const data = await res.json();
      const replyEn = data.conversational_reply_en || data.reply || 'Understood.';
      const replyHi = data.conversational_reply_hi || replyEn;

      if (data.should_reset) {
        setCurrentState({});
        setGeneratedDbml(null);
        setIsComplete(false);
      } else {
        if (data.parameters) {
          setCurrentState(data.parameters);
        }
        if (data.is_complete !== undefined) {
          setIsComplete(Boolean(data.is_complete));
        }
        if (data.dbml) {
          setGeneratedDbml(data.dbml);
        }
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'AI',
        text: replyEn,
        hindiText: replyHi,
        timestamp: formatCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'AI',
        text: `Understood. What price do you charge for your services?`,
        hindiText: `समझ गया। आप अपनी सेवाओं के लिए क्या शुल्क लेते हैं?`,
        timestamp: formatCurrentTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleReset = () => {
    setCurrentState({});
    setGeneratedDbml(null);
    setIsComplete(false);
    setMessages([
      {
        id: `ai_${Date.now()}`,
        sender: 'AI',
        text: 'All tables and configurations have been completely cleared. What is the name and type of your business?',
        hindiText: 'सभी टेबल और सेटिंग्स साफ़ कर दी गई हैं। आपकी दुकान का नाम और प्रकार क्या है?',
        timestamp: formatCurrentTime(),
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070a13] flex flex-col justify-between overflow-hidden">
      {/* Top Utility Bar */}
      <header className="h-16 px-6 lg:px-8 flex items-center justify-between border-b border-white/10 bg-black/40 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            Booking OQ AI
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
            {merchantName}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Manual Reset / Clear All */}
          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-rose-500/40 hover:bg-rose-500/10 text-slate-400 hover:text-rose-300 text-xs font-mono transition-all cursor-pointer"
            title="Reset tables and start fresh"
          >
            Clear All
          </button>

          {/* Live Schema Inspector Toggle Button */}
          <button
            type="button"
            onClick={() => setIsSchemaOpen(!isSchemaOpen)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              isSchemaOpen
                ? 'bg-sky-500/10 border-sky-400/40 text-sky-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Schema Inspector</span>
            {currentState.business_name && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleLanguage}
            className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-xs flex items-center justify-center transition-all cursor-pointer"
            title="Toggle Language"
          >
            {language === 'en' ? 'अ' : 'A'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace (Split View: Chat on Left, Schema Inspector on Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Stream Area */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Scrollable Message List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-4 select-text">
            {messages.map((msg) => {
              const isUser = msg.sender === 'USER';

              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-150`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4.5 py-3 shadow-md space-y-1 ${
                      isUser
                        ? 'rounded-tr-xs bg-sky-600 text-white shadow-sky-600/10'
                        : 'rounded-tl-xs bg-[#131b2e] text-slate-200 border border-white/10 shadow-black/20'
                    }`}
                  >
                    <div className="text-sm md:text-base leading-relaxed font-normal whitespace-pre-wrap">
                      {isUser
                        ? msg.text
                        : language === 'hi' && msg.hindiText
                        ? msg.hindiText
                        : msg.text}
                    </div>
                    <div
                      className={`text-[10px] font-mono ${
                        isUser ? 'text-sky-200/70 text-right' : 'text-slate-500'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTranslating && (
              <div className="flex justify-start animate-in fade-in duration-150">
                <div className="rounded-2xl rounded-tl-xs bg-white/5 text-slate-400 border border-white/10 px-4 py-2.5 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                  <span>OQ AI is analyzing operational parameters...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Expandable Chat Input Box (Buttons positioned cleanly below input, no text overlapping) */}
          <div className="p-4 md:p-6 border-t border-white/5 bg-black/20">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto space-y-2">
              <div className="relative rounded-2xl bg-[#111728] border border-white/10 focus-within:border-sky-500/70 focus-within:bg-[#131b2e] transition-all p-3">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputText}
                  onChange={handleTextareaInput}
                  onKeyDown={handleKeyDown}
                  placeholder={language === 'hi' ? 'अपना संदेश या व्यावसायिक निर्देश लिखें...' : 'Type your operational business requirements (Press Enter to send)...'}
                  className="w-full bg-transparent text-white text-sm md:text-base resize-none focus:outline-none placeholder:text-slate-500 min-h-[24px] max-h-[120px]"
                />

                {/* Bottom Controls inside the input card */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                  <div className="text-[11px] text-slate-500 font-mono">
                    Shift+Enter for newline
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVoiceActive(!isVoiceActive)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                        isVoiceActive
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      {isVoiceActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{isVoiceActive ? 'Listening' : 'Voice'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!inputText.trim() || isTranslating}
                      className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Send</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Live Schema Inspector Slide-Over Panel */}
        <LiveSchemaDrawer
          isOpen={isSchemaOpen}
          onClose={() => setIsSchemaOpen(false)}
          state={currentState}
          dbml={generatedDbml}
          merchantName={merchantName}
        />
      </div>
    </div>
  );
};
