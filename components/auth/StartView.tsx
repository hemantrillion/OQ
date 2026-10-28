'use client';

import React, { useState } from 'react';
import { Language, UserRole } from '@/lib/booking-types';
import { t } from '@/lib/translations';

interface Props {
  language: Language;
  onEnterApp: (role: UserRole) => void;
  onToggleLanguage: () => void;
}

export const StartView: React.FC<Props> = ({
  language,
  onEnterApp,
  onToggleLanguage,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('OWNER');
  const [phoneOrEmail, setPhoneOrEmail] = useState('+91 98234 11223');
  const [otp, setOtp] = useState('123456');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpSent) {
      setIsOtpSent(true);
    } else {
      onEnterApp(selectedRole);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 lg:p-16 select-none bg-[#090d16] text-white">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <div>
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            {t(language, 'appName')}
          </div>
          <div className="text-sm text-slate-400 font-medium">
            {language === 'hi' ? 'बुकिंग एवं संसाधन प्रबंधन' : 'Universal Booking Operations'}
          </div>
        </div>

        <button
          onClick={onToggleLanguage}
          className="w-12 h-12 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-base flex items-center justify-center transition-all"
        >
          {language === 'en' ? 'अ' : 'A'}
        </button>
      </header>

      {/* Center Auth Card (NO ICONS IN BOXES, PURE TYPOGRAPHY) */}
      <main className="max-w-md w-full mx-auto my-12">
        <div className="display-canvas rounded-3xl p-8 lg:p-10 space-y-8 border border-white/10 shadow-2xl">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {language === 'hi' ? 'प्रवेश करें' : 'Sign In'}
            </h1>
            <p className="text-sm text-slate-400">
              {language === 'hi'
                ? 'अपनी भूमिका चुनें और आगे बढ़ें'
                : 'Select your operational role to continue'}
            </p>
          </div>

          {/* Role Selector: Customer vs Operator (No icons, fixed size) */}
          <div className="grid grid-cols-2 p-1.5 rounded-full bg-white/5 border border-white/10">
            <button
              type="button"
              onClick={() => setSelectedRole('OWNER')}
              className={`py-3 rounded-full text-xs font-bold tracking-wide transition-all ${
                selectedRole === 'OWNER'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t(language, 'operatorTitle')}
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('CUSTOMER')}
              className={`py-3 rounded-full text-xs font-bold tracking-wide transition-all ${
                selectedRole === 'CUSTOMER'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t(language, 'customerPortal')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {language === 'hi' ? 'मोबाइल नंबर या ईमेल' : 'Mobile Number or Email'}
              </label>
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                required
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>

            {isOtpSent && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {language === 'hi' ? '6-अंकीय ओटीपी (डेमो: 123456)' : '6-Digit Passcode (Demo: 123456)'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-lg tracking-widest text-center focus:outline-none focus:border-sky-400 font-mono font-bold"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-sky-500/20 mt-2"
            >
              {!isOtpSent
                ? language === 'hi'
                  ? 'ओटीपी कोड प्राप्त करें'
                  : 'Request Passcode'
                : language === 'hi'
                ? 'सत्यापित करें और प्रवेश करें'
                : 'Verify & Enter Workspace'}
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-500 max-w-5xl mx-auto w-full">
        Deslot Platform • Real-time Operations & Booking Architecture
      </footer>
    </div>
  );
};
