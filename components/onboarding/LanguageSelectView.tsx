'use client';

import React from 'react';
import { Language } from '@/lib/booking-types';
import { t } from '@/lib/translations';
import { Globe2, ArrowRight, Check } from 'lucide-react';

interface Props {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onProceed: () => void;
}

export const LanguageSelectView: React.FC<Props> = ({
  currentLanguage,
  onSelectLanguage,
  onProceed,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Globe2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            {t(currentLanguage, 'chooseLanguage')}
          </h1>
          <p className="text-xs text-slate-500">
            {t(currentLanguage, 'chooseLanguageSub')}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onSelectLanguage('en')}
            className={`w-full p-4 rounded-lg border text-left flex items-center justify-between transition-all ${
              currentLanguage === 'en'
                ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            }`}
          >
            <div>
              <div className="font-semibold text-slate-900 text-sm">English</div>
              <div className="text-xs text-slate-500 mt-0.5">Use English across all interfaces</div>
            </div>
            {currentLanguage === 'en' && (
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
            )}
          </button>

          <button
            onClick={() => onSelectLanguage('hi')}
            className={`w-full p-4 rounded-lg border text-left flex items-center justify-between transition-all ${
              currentLanguage === 'hi'
                ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            }`}
          >
            <div>
              <div className="font-semibold text-slate-900 text-sm">हिंदी (Hindi)</div>
              <div className="text-xs text-slate-500 mt-0.5">पूरे सिस्टम को सरल हिंदी में उपयोग करें</div>
            </div>
            {currentLanguage === 'hi' && (
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
            )}
          </button>
        </div>

        <button
          onClick={onProceed}
          className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <span>{t(currentLanguage, 'continueBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-center text-slate-400">
          You can toggle language anytime from the top bar • आप ऊपर दिए गए बटन से कभी भी भाषा बदल सकते हैं
        </p>
      </div>
    </div>
  );
};
