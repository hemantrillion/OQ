'use client';

import React from 'react';
import { Language, UserRole } from '@/lib/booking-types';
import { t } from '@/lib/translations';
import { User, Store, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface Props {
  language: Language;
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const RoleSelectView: React.FC<Props> = ({
  language,
  selectedRole,
  onSelectRole,
  onProceed,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <span className="text-[11px] font-mono text-slate-400">Step 2 of 4</span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            {t(language, 'selectRoleTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            {t(language, 'selectRoleSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Card */}
          <div
            onClick={() => onSelectRole('CUSTOMER')}
            className={`p-5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
              selectedRole === 'CUSTOMER'
                ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">
                {t(language, 'roleCustomer')}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t(language, 'roleCustomerDesc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Booking Map & Slots</span>
              {selectedRole === 'CUSTOMER' && (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
          </div>

          {/* Owner Card */}
          <div
            onClick={() => onSelectRole('OWNER')}
            className={`p-5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
              selectedRole === 'OWNER'
                ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">
                {t(language, 'roleOwner')}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t(language, 'roleOwnerDesc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Slots, Earnings & AI</span>
              {selectedRole === 'OWNER' && (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            {language === 'hi'
              ? 'आप बाद में किसी भी समय ग्राहक और मालिक मोड के बीच अदल-बदल कर सकते हैं।'
              : 'You can switch between Customer and Owner views at any time from your header.'}
          </span>
        </div>

        <button
          onClick={onProceed}
          className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <span>{t(language, 'continueBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
