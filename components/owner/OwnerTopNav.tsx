'use client';

import React, { useState } from 'react';
import { Language, BusinessProfile, Appointment } from '@/lib/booking-types';
import { t } from '@/lib/translations';
import { OfflineCancellationModal } from './OfflineCancellationModal';

interface Props {
  language: Language;
  business: BusinessProfile;
  appointments: Appointment[];
  isOnline: boolean;
  onToggleOnline: (nextState: boolean) => void;
  onCancelBookingsAndGoOffline: (cancelledIds: string[], emailBody: string) => void;
  onToggleLanguage: () => void;
  onSwitchToCustomer: () => void;
  onLogout: () => void;
}

export const OwnerTopNav: React.FC<Props> = ({
  language,
  business,
  appointments,
  isOnline,
  onToggleOnline,
  onCancelBookingsAndGoOffline,
  onToggleLanguage,
  onSwitchToCustomer,
  onLogout,
}) => {
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);

  const activeCount = appointments.filter((a) => a.status === 'UPCOMING').length;

  const handleStatusClick = () => {
    if (isOnline) {
      if (activeCount > 0) {
        // Active bookings exist: Initiate range & cancellation workflow!
        setOfflineModalOpen(true);
      } else {
        onToggleOnline(false);
      }
    } else {
      onToggleOnline(true);
    }
  };

  return (
    <>
      <header className="h-24 px-6 lg:px-16 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-40 select-none">
        {/* Large Prominent Software Name & Owner Identification */}
        <div className="space-y-0.5">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
            {t(language, 'appName')}
          </div>
          <div className="text-sm text-slate-400 font-medium tracking-wide">
            {business.ownerName}
          </div>
        </div>

        {/* Right Controls with Fixed Dimensions (Zero Jumps on Language Change) */}
        <div className="flex items-center gap-4">
          {/* Online / Offline Status Button (Fixed Width 160px) */}
          <button
            onClick={handleStatusClick}
            className={`w-40 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all border text-center ${
              isOnline
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
            }`}
          >
            {isOnline ? t(language, 'statusOnline') : t(language, 'statusOffline')}
          </button>

          {/* Minimalist Language Switcher: अ / A (Fixed Dimensions 48px x 48px) */}
          <button
            onClick={onToggleLanguage}
            title={language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
            className="w-12 h-12 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-base flex items-center justify-center transition-all shrink-0"
          >
            {language === 'en' ? 'अ' : 'A'}
          </button>

          {/* Customer Portal (ग्राहक द्वार) (Fixed Width 160px) */}
          <button
            onClick={onSwitchToCustomer}
            className="w-40 py-2.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold tracking-wide transition-all text-center hidden sm:inline-block"
          >
            {t(language, 'customerPortal')}
          </button>

          {/* Log Out Button (Fixed Width 120px) */}
          <button
            onClick={onLogout}
            className="w-32 py-2.5 rounded-full border border-rose-500/30 hover:bg-rose-500/15 text-rose-400 text-xs font-bold tracking-wide transition-all text-center"
          >
            {t(language, 'logout')}
          </button>
        </div>
      </header>

      {/* Offline Range & Cancellation Notice Modal */}
      <OfflineCancellationModal
        language={language}
        appointments={appointments}
        isOpen={offlineModalOpen}
        onClose={() => setOfflineModalOpen(false)}
        onConfirmOffline={(ids, emailBody) => {
          onCancelBookingsAndGoOffline(ids, emailBody);
        }}
      />
    </>
  );
};
