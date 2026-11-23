'use client';

import React, { useState } from 'react';
import { Language, BusinessProfile, Appointment } from '@/lib/booking-types';
import { t } from '@/lib/translations';
import { OfflineCancellationModal } from './OfflineCancellationModal';
import { AccountFlyoutPanel } from '@/components/auth/AccountFlyoutPanel';

interface Props {
  language: Language;
  business: BusinessProfile;
  appointments: Appointment[];
  isOnline: boolean;
  onToggleOnline: (nextState: boolean) => void;
  onCancelBookingsAndGoOffline: (cancelledIds: string[], emailBody: string) => void;
  onToggleLanguage: () => void;
  onSwitchToCustomer?: () => void;
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
  onLogout,
}) => {
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const initials = business.ownerName
    ? business.ownerName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('')
    : 'OQ';

  const safeAvatarUrl = business.avatarUrl?.startsWith('/avatars/')
    ? `/oq${business.avatarUrl}`
    : business.avatarUrl;

  const handleStatusClick = () => {
    if (isOnline) {
      const upcomingCount = appointments.filter((a) => a.status === 'UPCOMING').length;
      if (upcomingCount === 0) {
        // No active reservations, go offline directly without cancellation dialog
        onToggleOnline(false);
      } else {
        // Active reservations exist, open offline modal
        setOfflineModalOpen(true);
      }
    } else {
      // Turn back online immediately
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
            {business.ownerName || 'Operator'}
          </div>
        </div>

        {/* Right Controls with Fixed Dimensions (Zero Jumps on Language Change) */}
        <div className="flex items-center gap-4">
          {/* Sliding Toggle Button: Online (ON) / Offline (OFF) */}
          <button
            type="button"
            onClick={handleStatusClick}
            className={`h-11 px-3.5 rounded-full text-xs font-bold tracking-wide transition-all border flex items-center gap-3 cursor-pointer select-none ${
              isOnline
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={isOnline ? (language === 'hi' ? 'ऑफलाइन' : 'Offline') : (language === 'hi' ? 'ऑनलाइन' : 'Online')}
          >
            {/* Sliding Track & Thumb */}
            <div
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex items-center p-0.5 ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 transform ${
                  isOnline ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="font-bold whitespace-nowrap min-w-[55px] text-left">
              {isOnline ? (language === 'hi' ? 'ऑनलाइन' : 'Online') : (language === 'hi' ? 'ऑफलाइन' : 'Offline')}
            </span>
          </button>

          {/* Minimalist Language Switcher: अ / A (Fixed Dimensions 48px x 48px) */}
          <button
            onClick={onToggleLanguage}
            title={language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
            className="w-12 h-12 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-base flex items-center justify-center transition-all shrink-0 cursor-pointer"
          >
            {language === 'en' ? 'अ' : 'A'}
          </button>

          {/* Profile Circle Avatar Button (InfraTrace style with Flyout) */}
          <div className="relative">
            <button
              type="button"
              data-panel-trigger="account-flyout"
              onClick={() => setIsAccountMenuOpen((prev) => !prev)}
              title={business.ownerName || 'Operator'}
              aria-label="Account Menu"
              className={`w-11 h-11 rounded-full p-0.5 transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                isAccountMenuOpen
                  ? 'ring-2 ring-sky-400 scale-105 shadow-lg'
                  : 'hover:ring-2 hover:ring-white/40 hover:scale-105'
              }`}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden border border-white/20">
                {safeAvatarUrl ? (
                  <img
                    src={safeAvatarUrl}
                    alt={business.ownerName || 'Operator'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
            </button>

            {/* Account Flyout Panel (Containing Logout Option) */}
            <AccountFlyoutPanel
              isOpen={isAccountMenuOpen}
              onClose={() => setIsAccountMenuOpen(false)}
              name={business.ownerName || 'Operator'}
              email={business.email || 'operator@bookingoq.com'}
              avatarUrl={safeAvatarUrl}
              language={language}
              onLogout={onLogout}
              onNavigateAccount={() => {
                window.location.href = '/oq/account/';
              }}
            />
          </div>
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
