'use client';

import React, { useState } from 'react';
import { Language, UserRole } from '@/lib/booking-types';
import { t } from '@/lib/translations';
import {
  Smartphone,
  Laptop,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  language: Language;
  userRole: UserRole;
  onVerified: (contact: { phone?: string; email?: string }) => void;
  onBack: () => void;
}

export const VerificationView: React.FC<Props> = ({
  language,
  userRole,
  onVerified,
  onBack,
}) => {
  const [authMethod, setAuthMethod] = useState<'PHONE' | 'EMAIL'>('PHONE');
  const [phone, setPhone] = useState('+91 98234 11223');
  const [email, setEmail] = useState('owner@moderncuts.in');
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <span className="text-[11px] font-mono text-slate-400">Step 3 of 4</span>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            {t(language, 'verificationTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            {authMethod === 'PHONE'
              ? t(language, 'verificationSubMobile')
              : t(language, 'verificationSubPc')}
          </p>
        </div>

        {/* Method Toggle: Mobile Phone vs PC Email */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setAuthMethod('PHONE')}
            className={`py-2 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'PHONE'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>Mobile OTP</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMethod('EMAIL')}
            className={`py-2 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'EMAIL'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-blue-600" />
            <span>PC / Email Link</span>
          </button>
        </div>

        {/* Device Consideration Notice */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          {authMethod === 'PHONE' ? (
            <div className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t(language, 'deviceNoticeMobile')}</span>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <Laptop className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{t(language, 'deviceNoticePc')}</span>
            </div>
          )}
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {authMethod === 'PHONE' ? (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t(language, 'phoneLabel')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t(language, 'phonePlaceholder')}
                  required
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t(language, 'emailLabel')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t(language, 'emailPlaceholder')}
                  required
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>{t(language, 'sendOtpBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                OTP sent to {authMethod === 'PHONE' ? phone : email}
              </span>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-emerald-700 underline text-[11px] font-semibold"
              >
                Change
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                {t(language, 'otpLabel')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder={t(language, 'otpPlaceholder')}
                  required
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-mono tracking-widest text-slate-900 focus:outline-none focus:border-blue-600 text-center text-lg font-bold"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 text-center">
                {t(language, 'otpHint')}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>{t(language, 'verifyBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
