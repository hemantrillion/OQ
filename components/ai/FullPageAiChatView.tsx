'use client';

import React, { useState } from 'react';
import { Language, ChatMessage } from '@/lib/booking-types';
import { INITIAL_AI_CHAT_MESSAGES, SAMPLE_AI_PROMPTS } from '@/lib/booking-data';
import { t } from '@/lib/translations';
import {
  ArrowLeft,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Globe2,
  ShieldCheck,
  Bot,
  User,
  CheckCircle2,
  Code2,
} from 'lucide-react';

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

  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'USER',
      text: content,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulate AI response interpreting configuration/query
    setTimeout(() => {
      let replyTextEn = `Command parsed: Synthesizing declarative configuration update for "${content}". The deterministic database migration engine will apply changes without exposing live client records.`;
      let replyTextHi = `निर्देश समझा गया: "${content}" के लिए कॉन्फ़िगरेशन फ़ाइल तैयार की जा रही है। डेटाबेस टूल इसे सुरक्षित रूप से लागू करेगा।`;

      if (content.toLowerCase().includes('slot')) {
        replyTextEn = `Slot configuration generated: 3 new slots created for target location. Configuration file validated and committed to schedule table.`;
        replyTextHi = `स्लॉट कॉन्फ़िगरेशन तैयार: चयनित स्थान के लिए 3 नए समय स्लॉट सफलतापूर्वक जोड़े गए।`;
      } else if (content.toLowerCase().includes('earning') || content.toLowerCase().includes('कमाई')) {
        replyTextEn = `Financial query executed: Total online UPI settlements = ₹13,600 across 28 transactions. All rows computed safely via metadata dimensions.`;
        replyTextHi = `वित्तीय विवरण: इस महीने यूपीआई के माध्यम से कुल ₹13,600 की कमाई 28 लेनदेनों में दर्ज की गई है।`;
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'AI',
        text: replyTextEn,
        hindiText: replyTextHi,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 700);
  };

  const toggleVoiceMode = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col overflow-hidden">
      {/* Full-Page Conversational Top Navigation Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t(language, 'backToDashboard')}</span>
          </button>

          <div className="h-5 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                {t(language, 'aiChatTitle')}
              </h1>
              <span className="text-[11px] text-slate-500 font-medium">
                {t(language, 'aiChatSubtitle')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Security Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict Schema Isolation</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Globe2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Voice Mode Visualizer Banner (if active) */}
      {isVoiceActive && (
        <div className="bg-blue-600 text-white py-2.5 px-4 flex items-center justify-center gap-3 text-xs font-medium shadow-inner animate-fadeIn">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-3 bg-white rounded-full animate-pulse" />
            <span className="w-1.5 h-5 bg-white rounded-full animate-pulse delay-75" />
            <span className="w-1.5 h-4 bg-white rounded-full animate-pulse delay-150" />
            <span className="w-1.5 h-6 bg-white rounded-full animate-pulse delay-100" />
            <span className="w-1.5 h-3 bg-white rounded-full animate-pulse" />
          </div>
          <span>{t(language, 'voiceModeActive')}</span>
          <button
            onClick={() => setIsVoiceActive(false)}
            className="px-2 py-0.5 rounded bg-blue-700 hover:bg-blue-800 text-[11px] underline"
          >
            Turn off
          </button>
        </div>
      )}

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'USER';
          const isSystem = msg.sender === 'SYSTEM';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="px-3.5 py-1.5 rounded-full bg-slate-200/80 text-slate-700 text-xs font-mono flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{language === 'hi' && msg.hindiText ? msg.hindiText : msg.text}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-blue-600 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs md:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                <div>
                  {isUser
                    ? msg.text
                    : language === 'hi' && msg.hindiText
                    ? msg.hindiText
                    : msg.text}
                </div>
                <div
                  className={`text-[10px] mt-1.5 ${
                    isUser ? 'text-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-2">
        <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
          {t(language, 'samplePromptsTitle')}
        </span>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SAMPLE_AI_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt.query)}
              className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-xs text-slate-700 whitespace-nowrap shadow-2xs transition-colors"
            >
              {language === 'hi' ? prompt.labelHi : prompt.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Input Dock at Bottom */}
      <div className="p-4 md:p-6 bg-white border-t border-slate-200 shrink-0">
        <div className="max-w-4xl mx-auto w-full flex items-center gap-2">
          {/* Voice Mic Toggle Button */}
          <button
            onClick={toggleVoiceMode}
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all ${
              isVoiceActive
                ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Toggle Voice Mode"
          >
            {isVoiceActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t(language, 'typeMessagePlaceholder')}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-full text-xs md:text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
