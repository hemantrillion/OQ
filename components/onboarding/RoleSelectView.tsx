'use client';

import React from 'react';
import { Language, UserRole } from '@/lib/booking-types';
import { t } from '@/lib/translations';

interface Props {
  language: Language;
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onProceed: () => void;
  onBack: () => void;
  onQuickEnterRajesh?: () => void;
}

export const RoleSelectView: React.FC<Props> = ({
  language,
  selectedRole,
  onSelectRole,
  onProceed,
  onBack,
  onQuickEnterRajesh,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 lg:p-16 select-none bg-[#090d16] text-white">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-4xl mx-auto w-full">
        <div>
          <div className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-none">
            {t(language, 'appName')}
          </div>
          <div className="text-sm md:text-base text-slate-400 font-medium tracking-wide mt-2">
            {language === 'hi' ? 'चरण 2 / 4 • भूमिका चयन' : 'Step 2 of 4 • Role Selection'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 text-xs md:text-sm font-bold transition-all"
          >
            {language === 'hi' ? 'पीछे' : 'Back'}
          </button>

          {onQuickEnterRajesh && (
            <button
              onClick={onQuickEnterRajesh}
              className="px-4 py-2.5 rounded-full border border-sky-400/30 hover:border-sky-400 bg-sky-500/10 text-sky-300 text-xs md:text-sm font-bold transition-all hidden sm:inline-block"
            >
              {language === 'hi' ? 'राजेश डेस्क' : 'Rajesh Desk'}
            </button>
          )}
        </div>
      </header>

      {/* Main Choice Card */}
      <main className="max-w-2xl w-full mx-auto my-10">
        <div className="display-canvas rounded-3xl p-8 lg:p-12 space-y-8 border border-white/10 shadow-2xl">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {t(language, 'selectRoleTitle')}
            </h1>
            <p className="text-sm md:text-base text-slate-400">
              {t(language, 'selectRoleSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Operator Card */}
            <div
              onClick={() => onSelectRole('OWNER')}
              className={`p-6 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                selectedRole === 'OWNER'
                  ? 'border-sky-400 bg-sky-500/15 shadow-xl'
                  : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-xl md:text-2xl">
                    {t(language, 'operatorTitle')}
                  </h3>
                  {selectedRole === 'OWNER' && (
                    <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-sky-500 text-slate-950">
                      {language === 'hi' ? 'सक्रिय' : 'Active'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  {language === 'hi'
                    ? 'स्लॉट बनाएं, क्षमता निर्धारित करें, अग्रिम बुकिंग प्रबंधित करें और आय विवरण ट्रैक करें।'
                    : 'Publish operational slots, set seat capacity, manage bookings, and track earnings.'}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {language === 'hi' ? 'स्लॉट • बुकिंग • आय • संचालन' : 'Slots • Bookings • Ledger • AI'}
              </div>
            </div>

            {/* Customer Card */}
            <div
              onClick={() => onSelectRole('CUSTOMER')}
              className={`p-6 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                selectedRole === 'CUSTOMER'
                  ? 'border-sky-400 bg-sky-500/15 shadow-xl'
                  : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-xl md:text-2xl">
                    {t(language, 'customerPortal')}
                  </h3>
                  {selectedRole === 'CUSTOMER' && (
                    <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-sky-500 text-slate-950">
                      {language === 'hi' ? 'सक्रिय' : 'Active'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  {language === 'hi'
                    ? 'नक्शे पर नज़दीकी केंद्र खोजें और सीधे अपने लिए समय स्लॉट बुक करें।'
                    : 'Explore operating stations on real city map and instantly reserve slots.'}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {language === 'hi' ? 'वास्तविक नक्शा • स्लॉट खोज' : 'City Map • Fast Booking'}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs md:text-sm text-slate-300 text-center">
            {language === 'hi'
              ? 'नोट: आप कार्यस्थल में प्रवेश करने के बाद भी किसी भी समय भूमिका बदल सकते हैं।'
              : 'Notice: You can toggle between Operator and Customer portal at any time.'}
          </div>

          <button
            onClick={onProceed}
            className="w-full py-4 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base md:text-lg tracking-wide transition-all shadow-lg shadow-sky-500/20"
          >
            {t(language, 'continueBtn')}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs md:text-sm text-slate-500 max-w-4xl mx-auto w-full">
        Deslot Platform • Real-time Operations & Booking Architecture
      </footer>
    </div>
  );
};
