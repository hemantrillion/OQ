'use client';

import React, { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import {
  ShieldCheck,
  Database,
  Clock,
  User as UserIcon,
  LogOut,
  Search,
  Activity,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';

interface TopNavbarProps {
  currentUser: User | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  backendOnline: boolean;
  activeTablesCount: number;
  openOrdersCount: number;
  shiftRevenue: number;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentUser,
  onOpenAuthModal,
  onLogout,
  backendOnline,
  activeTablesCount,
  openOrdersCount,
  shiftRevenue,
  searchQuery = '',
  onSearchChange,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 w-full bg-white border-b border-slate-200 sticky top-0 z-40 select-none px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left: Brand Logo & Title matching NEW PROJECT */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-[#0b57d0] text-white font-bold flex items-center justify-center text-sm shadow-xs font-mono">
          OQ
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm tracking-tight text-slate-900 font-sans uppercase">
              BOOKING OQ OBSERVATORY
            </h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono font-medium">
              v1.0.0
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans">
            Golang Gin Engine • MongoDB Cluster • JWT Auth Architecture
          </p>
        </div>
      </div>

      {/* Center: Global Search Bar matching NEW PROJECT Gmail style */}
      <div className="hidden md:flex flex-1 max-w-xl mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders, tables, food items, staff..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-100/80 border border-slate-200/80 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
          />
        </div>
      </div>

      {/* Right: Engine Telemetry & Active Staff Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Backend Health Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              backendOnline ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-amber-500 ring-2 ring-amber-100'
            }`}
          />
          <span className="text-slate-600 font-sans">
            Go Engine: <strong className={backendOnline ? 'text-emerald-700' : 'text-amber-700'}>{backendOnline ? 'Active (:8080)' : 'Standalone Sync'}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-slate-400" />
            {currentTime || '16:00:00'}
          </span>
        </div>

        {/* Shift Metrics Counter */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-sans">
          <span className="text-slate-500">Active Tables: <strong className="text-slate-900 font-mono">{activeTablesCount}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Open Orders: <strong className="text-slate-900 font-mono">{openOrdersCount}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Sales: <strong className="text-emerald-600 font-mono font-bold">${shiftRevenue.toLocaleString()}</strong></span>
        </div>

        {/* Staff Profile / Sign In */}
        {currentUser ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center font-sans">
                {currentUser.avatar || currentUser.first_name[0]}
              </div>
              <div className="text-left font-sans pr-1">
                <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                  {currentUser.first_name} {currentUser.last_name}
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
                    {currentUser.user_type}
                  </span>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> JWT Valid
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="px-4 py-2 rounded-full bg-[#0b57d0] hover:bg-blue-700 text-white font-sans font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Staff Sign In (JWT)</span>
          </button>
        )}
      </div>
    </header>
  );
};
