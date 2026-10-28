'use client';

import React, { useState } from 'react';
import { Language, BusinessProfile, Appointment } from '@/lib/booking-types';
import { t } from '@/lib/translations';
import {
  Globe2,
  User,
  Power,
  AlertTriangle,
  Building2,
  X,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  language: Language;
  business: BusinessProfile;
  appointments: Appointment[];
  isOnline: boolean;
  onToggleOnline: (nextState: boolean) => boolean; // returns false if blocked
  onToggleLanguage: () => void;
  onSwitchToCustomer: () => void;
}

export const OwnerTopNav: React.FC<Props> = ({
  language,
  business,
  appointments,
  isOnline,
  onToggleOnline,
  onToggleLanguage,
  onSwitchToCustomer,
}) => {
  const [blockedModalOpen, setBlockedModalOpen] = useState(false);

  const activeBookingsCount = appointments.filter(
    (a) => a.status === 'UPCOMING'
  ).length;

  const handleToggleClick = () => {
    if (isOnline && activeBookingsCount > 0) {
      // Rule: Cannot go offline if active upcoming bookings exist!
      setBlockedModalOpen(true);
      return;
    }
    onToggleOnline(!isOnline);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left: Brand & Business Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            BMS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                {business.name}
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-medium hidden sm:inline-block">
                {business.sector.replace('_', ' ')}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {business.ownerName} • {business.locations[0]?.city || 'Primary Office'}
            </span>
          </div>
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center gap-3">
          {/* Online / Offline Status Toggle Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleClick}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-xs border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span>{isOnline ? t(language, 'statusOnline') : t(language, 'statusOffline')}</span>
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Globe2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Switch to Customer View */}
          <button
            onClick={onSwitchToCustomer}
            className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <User className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">{t(language, 'switchToCustomer')}</span>
          </button>
        </div>
      </header>

      {/* Offline Blocked Warning Modal (Smart Business Lock) */}
      {blockedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-base">
                  {t(language, 'offlineBlockedTitle')}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {t(language, 'offlineBlockedDesc')}
                </p>
              </div>
              <button
                onClick={() => setBlockedModalOpen(false)}
                className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900">
              <div className="font-semibold mb-1">
                {activeBookingsCount} Active Booking(s) in Progress:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                {appointments
                  .filter((a) => a.status === 'UPCOMING')
                  .slice(0, 2)
                  .map((a) => (
                    <li key={a.id}>
                      {a.customerName} ({a.time}) — {a.serviceName}
                    </li>
                  ))}
              </ul>
            </div>

            <button
              onClick={() => setBlockedModalOpen(false)}
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm transition-all"
            >
              Understand & Return to Active Bookings
            </button>
          </div>
        </div>
      )}
    </>
  );
};
