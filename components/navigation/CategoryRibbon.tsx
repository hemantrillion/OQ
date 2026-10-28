'use client';

import React from 'react';
import {
  LayoutGrid,
  ShoppingBag,
  UtensilsCrossed,
  Receipt,
  ClipboardList,
  KeyRound,
  Database,
  Terminal,
} from 'lucide-react';

export type ActiveTab =
  | 'FLOOR_TABLES'
  | 'POS_ORDERS'
  | 'MENU_CATALOG'
  | 'INVOICES_BILLS'
  | 'KITCHEN_NOTES'
  | 'AUTH_JWT'
  | 'DATABASE_SCHEMA'
  | 'API_TESTER';

interface CategoryRibbonProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  badgeCounts: {
    tables: number;
    orders: number;
    foods: number;
    invoices: number;
    notes: number;
  };
}

export const CategoryRibbon: React.FC<CategoryRibbonProps> = ({
  activeTab,
  onSelectTab,
  badgeCounts,
}) => {
  const tabs: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    isPrimary?: boolean;
  }[] = [
    {
      id: 'FLOOR_TABLES',
      label: 'Tables & Floor',
      icon: <LayoutGrid className="w-4 h-4" />,
      badge: badgeCounts.tables,
    },
    {
      id: 'POS_ORDERS',
      label: 'Live POS Orders',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: badgeCounts.orders,
    },
    {
      id: 'MENU_CATALOG',
      label: 'Menu & Food Catalog',
      icon: <UtensilsCrossed className="w-4 h-4" />,
      badge: badgeCounts.foods,
    },
    {
      id: 'INVOICES_BILLS',
      label: 'Invoices & Billing',
      icon: <Receipt className="w-4 h-4" />,
      badge: badgeCounts.invoices,
    },
    {
      id: 'KITCHEN_NOTES',
      label: 'Kitchen Notes',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: badgeCounts.notes,
    },
    {
      id: 'AUTH_JWT',
      label: 'JWT Authentication',
      icon: <KeyRound className="w-4 h-4" />,
    },
    {
      id: 'DATABASE_SCHEMA',
      label: 'Database & Schema Explorer',
      icon: <Database className="w-4 h-4" />,
      isPrimary: true,
      badge: 'BSON',
    },
    {
      id: 'API_TESTER',
      label: 'Go API Console',
      icon: <Terminal className="w-4 h-4" />,
      badge: 'Gin :8080',
    },
  ];

  return (
    <nav className="w-full bg-white border-b border-slate-200 px-4 lg:px-6 select-none overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative px-3.5 py-2 rounded-lg font-sans text-xs font-semibold tracking-tight transition-all flex items-center gap-2 group ${
                isActive
                  ? tab.isPrimary
                    ? 'bg-blue-50 text-[#0b57d0] border border-blue-200 shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-900 border border-slate-300/80 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <span className={isActive ? 'text-[#0b57d0]' : 'text-slate-400 group-hover:text-slate-600'}>
                {tab.icon}
              </span>

              <span>{tab.label}</span>

              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-[#0b57d0] text-white font-bold'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}

              {/* Bottom active line */}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#0b57d0] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
