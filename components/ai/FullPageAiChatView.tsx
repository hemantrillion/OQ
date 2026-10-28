'use client';

import React, { useState, useEffect } from 'react';
import { Language, ChatMessage } from '@/lib/booking-types';
import { INITIAL_AI_CHAT_MESSAGES } from '@/lib/booking-data';
import { t } from '@/lib/translations';

interface Props {
  language: Language;
  onClose: () => void;
  onToggleLanguage: () => void;
}

export const FullPageAiChatView: React.FC<Props> = ({
  language,
  onClose,
  onToggleLanguage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_AI_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

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

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText.trim();
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      let replyEn = `Command registered: Generating configuration schema updates for "${query}". The deterministic database migration engine will validate and apply changes.`;
      let replyHi = `आदेश दर्ज किया गया: "${query}" के लिए कॉन्फ़िगरेशन अपडेट तैयार किया गया। डेटाबेस इंजन इसे सुरक्षित रूप से लागू करेगा।`;

      if (query.toLowerCase().includes('slot') || query.includes('स्लॉट')) {
        replyEn = `Slot configuration generated: Target operating windows have been published to the schedule.`;
        replyHi = `स्लॉट प्रकाशित: चयनित समय अंतराल को अनुसूची में जोड़ दिया गया है।`;
      } else if (query.toLowerCase().includes('earning') || query.includes('कमाई') || query.includes('आय')) {
        replyEn = `Total reconciled revenue: ₹89,500 across 42 settled transactions this month.`;
        replyHi = `कुल प्राप्त आय: इस महीने 42 लेनदेनों में कुल ₹89,500 प्राप्त हुए।`;
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'AI',
        text: replyEn,
        hindiText: replyHi,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16] flex flex-col justify-between overflow-hidden">
      {/* Minimalist Top Utility Bar */}
      <header className="h-20 px-6 lg:px-12 flex items-center justify-between border-b border-white/5 bg-black/20 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            ← {language === 'hi' ? 'वापस' : 'Return'}
          </button>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-base font-bold text-white tracking-tight">
            Deslot AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onToggleLanguage}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center justify-center transition-all"
          >
            {language === 'en' ? 'अ' : 'A'}
          </button>
        </div>
      </header>

      {/* UNBOXED CONVERSATION STREAM (NO CHAT BUBBLES, NO ICONS, PURE TYPOGRAPHY) */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-20 max-w-4xl mx-auto w-full space-y-8 select-text">
        {messages.map((msg) => {
          const isUser = msg.sender === 'USER';

          return (
            <div
              key={msg.id}
              className={`space-y-1 transition-all ${
                isUser ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`text-lg md:text-2xl font-medium leading-relaxed ${
                  isUser ? 'text-sky-400' : 'text-slate-100 font-normal'
                }`}
              >
                {isUser
                  ? msg.text
                  : language === 'hi' && msg.hindiText
                  ? msg.hindiText
                  : msg.text}
              </div>
              <div className="text-xs text-slate-500 font-mono tracking-wider">
                {msg.timestamp}
              </div>
            </div>
          );
        })}
      </div>

      {/* MINIMALIST FLOATING COMMAND INPUT */}
      <div className="p-6 md:p-12 max-w-4xl mx-auto w-full shrink-0">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t(language, 'typeMessagePlaceholder')}
            className="w-full px-8 py-5 pr-32 rounded-full bg-white/5 border border-white/10 text-white text-base md:text-lg focus:outline-none focus:border-sky-400 focus:bg-white/10 transition-all placeholder:text-slate-500"
          />

          <div className="absolute right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                isVoiceActive
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {isVoiceActive ? 'Listening' : 'Voice'}
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wide transition-all"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
