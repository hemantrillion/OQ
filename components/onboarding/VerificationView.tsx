'use client';

import React, { useState } from 'react';
import { Language, UserRole } from '@/lib/booking-types';
import { t } from '@/lib/translations';

interface Props {
  language: Language;
  userRole: UserRole;
  onVerified: (contact: { phone?: string; email?: string }) => void;
  onBack: () => void;
  onQuickEnterRajesh?: () => void;
}

export const VerificationView: React.FC<Props> = ({
  language,
  userRole,
  onVerified,
  onBack,
  onQuickEnterRajesh,
}) => {
  const [authMethod, setAuthMethod] = useState<'PHONE' | 'EMAIL'>('PHONE');
  const [phone, setPhone] = useState('+91 98234 11223');
  const [email, setEmail] = useState('rajesh@oq.in');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('123456');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    onVerified({
      phone: authMethod === 'PHONE' ? phone : undefined,
      email: authMethod === 'EMAIL' ? email : undefined,
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 lg:p-16 select-none bg-[#090d16] text-white">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-4xl mx-auto w-full">
        <div>
          <div className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-none">
            {t(language, 'appName')}
          </div>
          <div className="text-sm md:text-base text-slate-400 font-medium tracking-wide mt-2">
            {language === 'hi' ? 'चरण 3 / 4 • पहचान सत्यापन' : 'Step 3 of 4 • Identity Verification'}
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

      {/* Main Verification Card */}
      <main className="max-w-xl w-full mx-auto my-10">
        <div className="display-canvas rounded-3xl p-8 lg:p-12 space-y-8 border border-white/10 shadow-2xl">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {t(language, 'verificationTitle')}
            </h1>
            <p className="text-sm md:text-base text-slate-400">
              {authMethod === 'PHONE'
                ? t(language, 'verificationSubMobile')
                : t(language, 'verificationSubPc')}
            </p>
          </div>

          {/* Switcher: Mobile Phone vs PC Email */}
          <div className="grid grid-cols-2 p-1.5 rounded-full bg-white/5 border border-white/10">
            <button
              type="button"
              onClick={() => setAuthMethod('PHONE')}
              className={`py-3 rounded-full text-xs md:text-sm font-bold tracking-wide transition-all ${
                authMethod === 'PHONE'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'मोबाइल फोन' : 'Mobile Phone'}
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('EMAIL')}
              className={`py-3 rounded-full text-xs md:text-sm font-bold tracking-wide transition-all ${
                authMethod === 'EMAIL'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'hi' ? 'पीसी / ईमेल लिंक' : 'PC / Email Link'}
            </button>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {authMethod === 'PHONE'
                    ? t(language, 'phoneLabel')
                    : t(language, 'emailLabel')}
                </label>
                <input
                  type={authMethod === 'PHONE' ? 'tel' : 'email'}
                  value={authMethod === 'PHONE' ? phone : email}
                  onChange={(e) =>
                    authMethod === 'PHONE' ? setPhone(e.target.value) : setEmail(e.target.value)
                  }
                  required
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base md:text-lg tracking-wide transition-all shadow-lg shadow-sky-500/20"
              >
                {t(language, 'sendOtpBtn')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-xs md:text-sm text-emerald-300 font-semibold">
                  {language === 'hi'
                    ? `ओटीपी भेजा गया: ${authMethod === 'PHONE' ? phone : email}`
                    : `Passcode dispatched to ${authMethod === 'PHONE' ? phone : email}`}
                </span>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-sky-400 underline font-bold"
                >
                  {language === 'hi' ? 'बदलें' : 'Change'}
                </button>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {t(language, 'otpLabel')}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xl tracking-widest text-center focus:outline-none focus:border-sky-400 font-mono font-bold"
                />
                <p className="text-xs text-slate-400 mt-2 text-center">
                  {t(language, 'otpHint')}
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base md:text-lg tracking-wide transition-all shadow-lg shadow-sky-500/20"
              >
                {t(language, 'verifyBtn')}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs md:text-sm text-slate-500 max-w-4xl mx-auto w-full">
        OQ Platform • Real-time Operations & Booking Architecture
      </footer>
    </div>
  );
};
