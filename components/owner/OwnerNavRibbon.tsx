'use client';

import React from 'react';
import { Language } from '@/lib/booking-types';
import { t } from '@/lib/translations';
import {
  LayoutDashboard,
  Banknote,
  CalendarCheck,
  Database,
  User,
} from 'lucide-react';

export type OwnerTab =
  | 'OVERVIEW'
  | 'EARNINGS'
  | 'APPOINTMENTS'
  | 'BLUEPRINT'
  | 'PROFILE';

interface Props {
  language: Language;
  activeTab: OwnerTab;
  onSelectTab: (tab: OwnerTab) => void;
  badgeCounts: {
    upcomingAppointments: number;
    totalSlots: number;
  };
}

export const OwnerNavRibbon: React.FC<Props> = ({
  language,
  activeTab,
  onSelectTab,
  badgeCounts,
}) => {
  const tabs = [
    {
      id: 'OVERVIEW' as OwnerTab,
      label: t(language, 'navHome'),
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'EARNINGS' as OwnerTab,
      label: t(language, 'navEarnings'),
      icon: <Banknote className="w-4 h-4" />,
    },
    {
      id: 'APPOINTMENTS' as OwnerTab,
      label: t(language, 'navAppointments'),
      icon: <CalendarCheck className="w-4 h-4" />,
      badge: badgeCounts.upcomingAppointments,
    },
    {
      id: 'BLUEPRINT' as OwnerTab,
      label: t(language, 'navBlueprint'),
      icon: <Database className="w-4 h-4" />,
    },
    {
      id: 'PROFILE' as OwnerTab,
      label: t(language, 'navProfile'),
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-4 md:px-6 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
              isActive
                ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
