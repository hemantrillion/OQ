'use client';

import React, { useState } from 'react';
import { Language, UserRole } from '@/lib/booking-types';
import { t } from '@/lib/translations';
import { GoogleAuthButton, GoogleUser } from '@/components/auth/GoogleAuthButton';
import { StartingScreen } from '@/components/onboarding/StartingScreen';

interface Props {
  language: Language;
  userRole: UserRole;
  onVerified: (contact: { phone?: string; email?: string; name?: string; avatarUrl?: string }) => void;
  onToggleLanguage: () => void;
}

export const VerificationView: React.FC<Props> = ({
  language,
  onVerified,
  onToggleLanguage,
}) => {
  const [phone, setPhone] = useState('+91 98234 11223');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [pendingContact, setPendingContact] = useState<{
    phone?: string;
    email?: string;
    name?: string;
    avatarUrl?: string;
  } | null>(null);

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOtpError(null);
    setOtpSent(true);
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // No OTP was dispatched (no SMS backend configured), so phone login is not possible without valid OTP
    setOtpError(
      language === 'hi'
        ? 'पासकोड सेवा वर्तमान में उपलब्ध नहीं है। वैध ओटीपी के बिना मोबाइल लॉगिन संभव नहीं है।'
        : 'Passcode delivery service is unavailable. Mobile login is not possible without a valid OTP.'
    );
  };

  const handleGoogleSuccess = (user: GoogleUser) => {
    setPendingContact({ email: user.email, name: user.name, avatarUrl: user.avatarUrl });
    setIsStarting(true);
  };

  if (isStarting) {
    return (
      <StartingScreen
        title={language === 'hi' ? 'आरंभ हो रहा है' : 'Starting'}
        subtitle={
          language === 'hi'
            ? 'आपका बुकिंग एवं कतार प्रबंधन वातावरण तैयार किया जा रहा है...'
            : "We will send you an email when it's done."
        }
        durationMs={2200}
        onComplete={() => {
          onVerified(pendingContact || {});
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 select-none bg-[#090d16] text-white">
      {/* Top Header - Fixed height flex container with enlarged language button */}
      <header className="h-24 max-w-[520px] w-full mx-auto flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            {t(language, 'appName')}
          </span>
          <span className="text-xs text-slate-400 font-medium tracking-wide mt-1">
            {language === 'hi' ? 'चरण 3 / 3 • पहचान सत्यापन' : 'Step 3 of 3 • Identity Verification'}
          </span>
        </div>

        {/* Enlarged, highly visible language switcher */}
        <button
          type="button"
          onClick={onToggleLanguage}
          className="w-14 h-14 rounded-full border border-white/15 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white font-bold text-lg flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-md"
          title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
        >
          {language === 'en' ? 'अ' : 'A'}
        </button>
      </header>

      {/* Main Centered Flex Container */}
      <main className="flex-1 flex items-center justify-center w-full py-4">
        <div className="w-full max-w-[520px] min-h-[480px] display-canvas rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Card Header with Fixed Height */}
          <div className="h-16 flex flex-col justify-center text-center shrink-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t(language, 'verificationTitle')}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'hi'
                ? 'गूगल खाते से साइन इन करें या मोबाइल नंबर से सत्यापित करें।'
                : 'Sign in with Google or verify via mobile passcode.'}
            </p>
          </div>

          {/* Verification Methods */}
          <div className="flex flex-col gap-3 py-1 flex-1 justify-center">
            {/* Google Sign-In */}
            <GoogleAuthButton
              language={language}
              onSuccess={handleGoogleSuccess}
            />

            {/* Subtle Divider */}
            <div className="relative flex items-center justify-center my-1.5">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0f172a] px-3 py-0.5 text-[11px] font-semibold text-slate-400 uppercase tracking-widest absolute rounded-full border border-white/5">
                {language === 'hi' ? 'अथवा' : 'or'}
              </span>
            </div>

            {/* Mobile / OTP Form */}
            {!otpSent ? (
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                  {t(language, 'phoneLabel')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98234 11223"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-between text-xs">
                  <span className="text-sky-300 font-semibold truncate">
                    {language === 'hi' ? `पासकोड भेजा: ${phone}` : `Code requested for ${phone}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpError(null);
                    }}
                    className="text-sky-400 underline font-bold shrink-0 ml-2 cursor-pointer"
                  >
                    {language === 'hi' ? 'बदलें' : 'Change'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    {t(language, 'otpLabel')}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value);
                      if (otpError) setOtpError(null);
                    }}
                    placeholder="• • • • • •"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-lg tracking-widest text-center focus:outline-none focus:border-sky-400 font-mono font-bold"
                  />
                </div>

                {otpError && (
                  <div className="p-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
                    {otpError}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Button */}
          <div className="shrink-0 pt-2">
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full h-14 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base tracking-wide transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center cursor-pointer"
              >
                {t(language, 'sendOtpBtn')}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleVerify}
                className="w-full h-14 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base tracking-wide transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center cursor-pointer"
              >
                {t(language, 'verifyBtn')}
              </button>
            )}
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
