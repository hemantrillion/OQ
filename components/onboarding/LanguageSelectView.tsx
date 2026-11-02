'use client';

import React from 'react';
import { Language } from '@/lib/booking-types';
import { t } from '@/lib/translations';

interface Props {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onProceed: () => void;
  onQuickEnterRajesh?: () => void;
}

export const LanguageSelectView: React.FC<Props> = ({
  currentLanguage,
  onSelectLanguage,
  onProceed,
  onQuickEnterRajesh,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 lg:p-16 select-none bg-[#090d16] text-white">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-4xl mx-auto w-full">
        <div>
          <div className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-none">
            {t(currentLanguage, 'appName')}
          </div>
          <div className="text-sm md:text-base text-slate-400 font-medium tracking-wide mt-2">
            {currentLanguage === 'hi' ? 'चरण 1 / 4 • भाषा चयन' : 'Step 1 of 4 • Language Selection'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onQuickEnterRajesh && (
            <button
              onClick={onQuickEnterRajesh}
              className="px-5 py-3 rounded-full border border-sky-400/30 hover:border-sky-400 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs md:text-sm font-bold transition-all text-center"
            >
              {currentLanguage === 'hi' ? 'राजेश शर्मा डेस्क पर जाएं' : 'Jump to Rajesh Workspace'}
            </button>
          )}

          <button
            onClick={() => onSelectLanguage(currentLanguage === 'en' ? 'hi' : 'en')}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-base md:text-lg flex items-center justify-center transition-all shrink-0"
          >
            {currentLanguage === 'en' ? 'अ' : 'A'}
          </button>
        </div>
      </header>

      {/* Main Choice Card */}
      <main className="max-w-xl w-full mx-auto my-10">
        <div className="display-canvas rounded-3xl p-8 lg:p-12 space-y-8 border border-white/10 shadow-2xl">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {t(currentLanguage, 'chooseLanguage')}
            </h1>
            <p className="text-sm md:text-base text-slate-400">
              {t(currentLanguage, 'chooseLanguageSub')}
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <button
              type="button"
              onClick={() => onSelectLanguage('en')}
              className={`w-full p-6 rounded-2xl border text-left transition-all ${
                currentLanguage === 'en'
                  ? 'border-sky-400 bg-sky-500/15 shadow-lg'
                  : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl md:text-2xl font-bold text-white">English</span>
                {currentLanguage === 'en' && (
                  <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-sky-500 text-slate-950">
                    Selected
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-400 mt-2">
                Use refined, professional English across all OQ interfaces
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectLanguage('hi')}
              className={`w-full p-6 rounded-2xl border text-left transition-all ${
                currentLanguage === 'hi'
                  ? 'border-sky-400 bg-sky-500/15 shadow-lg'
                  : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl md:text-2xl font-bold text-white">हिंदी (Hindi)</span>
                {currentLanguage === 'hi' && (
                  <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-sky-500 text-slate-950">
                    चयनित
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-400 mt-2">
                सम्पूर्ण सिस्टम को सरल, स्वाभाविक एवं शुद्ध हिंदी में उपयोग करें
              </div>
            </button>
          </div>

          <button
            onClick={onProceed}
            className="w-full py-4 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base md:text-lg tracking-wide transition-all shadow-lg shadow-sky-500/20"
          >
            {t(currentLanguage, 'continueBtn')}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs md:text-sm text-slate-500 max-w-4xl mx-auto w-full">
        OQ Platform • Real-time Operations & Booking Architecture
      </footer>
    </div>
  );
};
