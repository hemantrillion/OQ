'use client';

import React from 'react';
import { Language } from '@/lib/booking-types';
import { t } from '@/lib/translations';

export type OwnerTab = 'SCHEDULE' | 'APPOINTMENTS' | 'EARNINGS' | 'PROFILE';

interface Props {
  language: Language;
  activeTab: OwnerTab;
  onSelectTab: (tab: OwnerTab) => void;
  badgeCounts: {
    upcomingAppointments: number;
  };
}

export const OwnerNavRibbon: React.FC<Props> = ({
  language,
  activeTab,
  onSelectTab,
  badgeCounts,
}) => {
  const tabs: Array<{ id: OwnerTab; label: string; badge?: number }> = [
    { id: 'SCHEDULE', label: t(language, 'navSchedule') },
    {
      id: 'APPOINTMENTS',
      label: t(language, 'navAppointments'),
      badge: badgeCounts.upcomingAppointments,
    },
    { id: 'EARNINGS', label: t(language, 'navEarnings') },
    { id: 'PROFILE', label: t(language, 'navProfile') },
  ];

  return (
    <nav className="px-6 lg:px-12 flex items-center gap-8 border-b border-white/5 bg-black/10 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`py-4 border-b-2 text-sm font-semibold tracking-wide whitespace-nowrap transition-all flex items-center gap-2 ${
              isActive
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
