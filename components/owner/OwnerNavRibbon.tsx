'use client';

import React from 'react';
import { Language } from '@/lib/booking-types';
import { t } from '@/lib/translations';

export type OwnerTab = 'FRONTPAGE' | 'APPOINTMENTS' | 'EARNINGS' | 'OPERATOR';

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
    { id: 'FRONTPAGE', label: t(language, 'navFrontpage') },
    {
      id: 'APPOINTMENTS',
      label: t(language, 'navAppointments'),
      badge: badgeCounts.upcomingAppointments,
    },
    { id: 'EARNINGS', label: t(language, 'navEarnings') },
    { id: 'OPERATOR', label: t(language, 'navOperator') },
  ];

  return (
    <nav className="px-6 lg:px-16 flex items-center gap-6 bg-transparent overflow-x-auto scrollbar-none select-none py-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`min-w-[140px] py-3 text-sm font-bold tracking-wide whitespace-nowrap transition-all flex items-center justify-center gap-2 rounded-full ${
              isActive
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-500 text-slate-950">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
