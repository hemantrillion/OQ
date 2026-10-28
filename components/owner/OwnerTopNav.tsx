'use client';

import React, { useState } from 'react';
import { Language, BusinessProfile, Appointment } from '@/lib/booking-types';
import { t } from '@/lib/translations';

interface Props {
  language: Language;
  business: BusinessProfile;
  appointments: Appointment[];
  isOnline: boolean;
  onToggleOnline: (nextState: boolean) => boolean;
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
      setBlockedModalOpen(true);
      return;
    }
    onToggleOnline(!isOnline);
  };

  return (
    <>
      <header className="h-20 px-6 lg:px-12 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-40">
        {/* Brand & Owner Identification */}
        <div>
          <div className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Deslot
          </div>
          <div className="text-xs text-slate-400 font-medium tracking-wide">
            {business.ownerName}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Online / Offline Status Button */}
          <button
            onClick={handleToggleClick}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border ${
              isOnline
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
            }`}
          >
            {isOnline ? t(language, 'statusOnline') : t(language, 'statusOffline')}
          </button>

          {/* Minimalist Language Switcher: अ / A */}
          <button
            onClick={onToggleLanguage}
            title={language === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
            className="w-10 h-10 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center justify-center transition-all"
          >
            {language === 'en' ? 'अ' : 'A'}
          </button>

          {/* Client Discovery Toggle */}
          <button
            onClick={onSwitchToCustomer}
            className="px-4 py-2 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium tracking-wide transition-all hidden sm:inline-block"
          >
            {t(language, 'switchToCustomer')}
          </button>
        </div>
      </header>

      {/* Lock Notice Modal */}
      {blockedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="display-card max-w-md w-full rounded-2xl p-6 space-y-4 border border-rose-500/30">
            <h3 className="text-lg font-bold text-white">
              {t(language, 'offlineBlockedTitle')}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t(language, 'offlineBlockedDesc')}
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-rose-300">
                {activeBookingsCount} active reservation(s) confirmed:
              </div>
              {appointments
                .filter((a) => a.status === 'UPCOMING')
                .slice(0, 2)
                .map((a) => (
                  <div key={a.id}>
                    • {a.customerName} ({a.time}) — {a.serviceName}
                  </div>
                ))}
            </div>

            <button
              onClick={() => setBlockedModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-xs transition-all hover:bg-slate-100"
            >
              Acknowledge & Continue Operations
            </button>
          </div>
        </div>
      )}
    </>
  );
};
