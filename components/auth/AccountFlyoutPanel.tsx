'use client';

import React, { useEffect, useRef } from 'react';
import { X, LogOut } from 'lucide-react';
import { Language } from '@/lib/booking-types';

interface AccountFlyoutPanelProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  email: string;
  avatarUrl?: string;
  language?: Language;
  onLogout: () => void;
  onNavigateAccount?: () => void;
}

export function AccountFlyoutPanel({
  isOpen,
  onClose,
  name,
  email,
  avatarUrl,
  language = 'en',
  onLogout,
  onNavigateAccount,
}: AccountFlyoutPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        const isTrigger = (event.target as HTMLElement)?.closest?.('[data-panel-trigger="account-flyout"]');
        if (isTrigger) return;
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Extract initials for fallback avatar (e.g. "Operator" -> "OP")
  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('')
    : 'OQ';

  const safeAvatarUrl = avatarUrl?.startsWith('/avatars/')
    ? `/oq${avatarUrl}`
    : avatarUrl;

  const handleSignOut = () => {
    onClose();
    onLogout();
  };

  const handleManageAccountClick = () => {
    onClose();
    if (onNavigateAccount) {
      onNavigateAccount();
    } else {
      window.location.href = '/oq/account/';
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-16 right-4 z-50 w-[340px] bg-[#0d131f] text-white rounded-[28px] shadow-2xl border border-white/10 p-4 space-y-3 font-sans select-none animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Top Header with Close (X) button */}
      <div className="flex items-center justify-between px-2 pt-0.5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {language === 'hi' ? 'खाता' : 'Account'}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Close"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Single Account Card (Matching InfraTrace) */}
      <div className="bg-white/5 rounded-2xl overflow-hidden divide-y divide-white/10 border border-white/10 shadow-2xs">
        {/* Active Profile Card */}
        <div className="p-4 flex items-center gap-3.5">
          {/* Circular Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center shadow-xs overflow-hidden border border-white/20 shrink-0">
            {safeAvatarUrl ? (
              <img
                src={safeAvatarUrl}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-base font-bold text-white">{initials}</span>
            )}
          </div>

          {/* Name & Email */}
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-semibold text-white tracking-tight leading-tight truncate">
              {name}
            </span>
            <span className="text-xs text-slate-400 font-normal truncate max-w-[220px] mt-0.5">
              {email}
            </span>
          </div>
        </div>

        {/* Action: Single Sign out button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 text-slate-200 text-sm font-medium transition-colors text-left cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-300 shrink-0">
            <LogOut className="w-4 h-4" />
          </div>
          <span>{language === 'hi' ? 'इस खाते से बाहर निकलें' : 'Sign out of this account'}</span>
        </button>
      </div>

      {/* Manage your Account button (Matching InfraTrace) */}
      <button
        type="button"
        onClick={handleManageAccountClick}
        className="w-full py-2.5 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
      >
        <span className="truncate">
          {language === 'hi' ? 'अपना खाता प्रबंधित करें' : 'Manage your Account'}
        </span>
      </button>

      {/* Footer Links (Matching InfraTrace) */}
      <div className="pt-1 pb-0.5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <a href="#" className="hover:underline hover:text-slate-400 transition-colors">
          {language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
        </a>
        <span>•</span>
        <a href="#" className="hover:underline hover:text-slate-400 transition-colors">
          {language === 'hi' ? 'सेवा की शर्तें' : 'Terms of Service'}
        </a>
      </div>
    </div>
  );
}
