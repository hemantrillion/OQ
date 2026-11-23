'use client';

import React from 'react';
import { Language } from '@/lib/booking-types';
import { t } from '@/lib/translations';

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
    <div className="min-h-screen flex flex-col justify-between p-6 select-none bg-[#090d16] text-white">
      {/* Top Header - Fixed height flex container with enlarged language button */}
      <header className="h-24 max-w-[520px] w-full mx-auto flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            {t(currentLanguage, 'appName')}
          </span>
          <span className="text-xs text-slate-400 font-medium tracking-wide mt-1">
            {currentLanguage === 'hi' ? 'चरण 1 / 3 • भाषा चयन' : 'Step 1 of 3 • Language Selection'}
          </span>
        </div>

        {/* Enlarged, highly visible language switcher */}
        <button
          type="button"
          onClick={() => onSelectLanguage(currentLanguage === 'en' ? 'hi' : 'en')}
          className="w-14 h-14 rounded-full border border-white/15 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white font-bold text-lg flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-md"
          title={currentLanguage === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
        >
          {currentLanguage === 'en' ? 'अ' : 'A'}
        </button>
      </header>

      {/* Main Centered Flex Container */}
      <main className="flex-1 flex items-center justify-center w-full py-4">
        <div className="w-full max-w-[520px] h-[480px] display-canvas rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Card Header with Fixed Height */}
          <div className="h-16 flex flex-col justify-center text-center shrink-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t(currentLanguage, 'chooseLanguage')}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {t(currentLanguage, 'chooseLanguageSub')}
            </p>
          </div>

          {/* Clean Language Options - Pure Language Names, No Descriptions, No Dots */}
          <div className="flex flex-col gap-4 py-2 flex-1 justify-center">
            <button
              type="button"
              onClick={() => onSelectLanguage('en')}
              className={`w-full h-16 px-6 rounded-2xl border flex items-center justify-center text-lg sm:text-xl font-bold transition-all cursor-pointer ${
                currentLanguage === 'en'
                  ? 'border-sky-400 bg-sky-500/15 text-white shadow-lg'
                  : 'border-white/10 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              English
            </button>

            <button
              type="button"
              onClick={() => onSelectLanguage('hi')}
              className={`w-full h-16 px-6 rounded-2xl border flex items-center justify-center text-lg sm:text-xl font-bold transition-all cursor-pointer ${
                currentLanguage === 'hi'
                  ? 'border-sky-400 bg-sky-500/15 text-white shadow-lg'
                  : 'border-white/10 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Bottom Action Button */}
          <div className="shrink-0 pt-2">
            <button
              type="button"
              onClick={onProceed}
              className="w-full h-14 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base tracking-wide transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center cursor-pointer"
            >
              {t(currentLanguage, 'continueBtn')}
            </button>
          </div>
        </div>
      </main>

      {/* Footer with Fixed Height */}
      <footer className="h-12 max-w-[520px] w-full mx-auto flex items-center justify-center text-xs text-slate-500 shrink-0">
        OQ Platform • Real-time Operations & Booking Architecture
      </footer>
    </div>
  );
};
