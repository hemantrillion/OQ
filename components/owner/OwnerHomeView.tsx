'use client';

import React, { useState } from 'react';
import {
  Language,
  BusinessProfile,
  Slot,
  Appointment,
} from '@/lib/booking-types';
import { t } from '@/lib/translations';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  X,
  MessageSquare,
  Mic,
} from 'lucide-react';

interface Props {
  language: Language;
  business: BusinessProfile;
  slots: Slot[];
  appointments: Appointment[];
  onOpenAiChat: () => void;
  onAddSlot: (newSlot: Partial<Slot>) => void;
}

export const OwnerHomeView: React.FC<Props> = ({
  language,
  business,
  slots,
  appointments,
  onOpenAiChat,
  onAddSlot,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('ALL');
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);

  // New slot form state
  const [newStartTime, setNewStartTime] = useState('02:00 PM');
  const [newEndTime, setNewEndTime] = useState('02:45 PM');
  const [newLocationId, setNewLocationId] = useState(business.locations[0]?.id || 'loc_main');
  const [newCapacity, setNewCapacity] = useState(1);
  const [newStaff, setNewStaff] = useState('Rajesh Sharma');

  const filteredSlots = slots.filter(
    (s) => selectedLocationId === 'ALL' || s.locationId === selectedLocationId
  );

  const todayBookingsCount = appointments.filter(
    (a) => a.date === '2026-10-29'
  ).length;

  const totalSlotsCount = slots.length;
  const bookedSlotsCount = slots.filter((s) => s.status === 'BOOKED').length;
  const occupancyPercentage = Math.round((bookedSlotsCount / (totalSlotsCount || 1)) * 100);

  const handleCreateSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = business.locations.find((l) => l.id === newLocationId);
    onAddSlot({
      locationId: newLocationId,
      locationName: loc?.name || 'Main Studio',
      date: '2026-10-29',
      startTime: newStartTime,
      endTime: newEndTime,
      capacity: Number(newCapacity),
      bookedCount: 0,
      status: 'OPEN',
      assignedStaff: newStaff,
    });
    setIsAddSlotOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'BOOKED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'LOCKED':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* 1. THE BIG LIVE ORB HERO CARD */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Subtle ambient lighting */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-spin" />
            <span>AI BUSINESS OPERATIONS ENGINE</span>
          </div>

          <h2 className="text-xl md:text-3xl font-bold tracking-tight text-white">
            {t(language, 'aiOrbTitle')}
          </h2>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {language === 'hi'
              ? 'आवाज़ या लिखकर अपने स्लॉट्स, सेवाएं और कमाई नियंत्रित करें। एआई सीधे डेटाबेस को छुए बिना आपकी व्यवस्था संचालित करता है।'
              : 'Execute schedule changes, generate new slots, and review analytics using natural voice or text. Isolated configuration execution with zero raw database exposure.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md">
              <Mic className="w-3 h-3 text-emerald-400" />
              Voice Mode Ready
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md">
              <MessageSquare className="w-3 h-3 text-blue-400" />
              Hindi & English Supported
            </span>
          </div>
        </div>

        {/* THE BIG LIVE ORB ICON */}
        <div className="relative z-10 shrink-0 flex flex-col items-center">
          <div
            onClick={onOpenAiChat}
            className="group relative cursor-pointer flex items-center justify-center p-3"
            title="Click to launch full-page AI interface"
          >
            {/* Outer Pulsing Wave Rings */}
            <div className="absolute w-28 h-28 rounded-full bg-blue-400/20 animate-ping opacity-60" />
            <div className="absolute w-24 h-24 rounded-full bg-indigo-500/30 animate-pulse" />

            {/* The Core Orb Sphere */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-300 shadow-xl flex items-center justify-center transform transition-transform group-hover:scale-105 group-active:scale-95 border-2 border-white/50">
              <Sparkles className="w-9 h-9 text-white drop-shadow-md" />
            </div>
          </div>

          <button
            onClick={onOpenAiChat}
            className="mt-2 text-xs font-semibold text-blue-300 group-hover:text-white flex items-center gap-1 underline underline-offset-4"
          >
            <span>{t(language, 'aiOrbHint')}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. OPERATIONAL METRIC TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Bookings */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t(language, 'todayBookings')}</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {todayBookingsCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>2 confirmed upcoming</span>
          </div>
        </div>

        {/* Slot Occupancy */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t(language, 'occupancyRate')}</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {occupancyPercentage}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {bookedSlotsCount} of {totalSlotsCount} slots active
          </div>
        </div>

        {/* Estimated Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t(language, 'estimatedRevenue')}</span>
            <span className="font-bold text-xs text-blue-600 font-mono">INR</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            ₹1,250
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Today&apos;s confirmed total
          </div>
        </div>

        {/* Operating Stations / Locations */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t(language, 'activeLocations')}</span>
            <MapPin className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {business.locations.length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
            {business.locations[0]?.name.split(' ')[0]} + more
          </div>
        </div>
      </div>

      {/* 3. TIME SLOTS & MULTI-LOCATION MANAGER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 md:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {t(language, 'slotManagerTitle')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t(language, 'slotManagerSub')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Location Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="pl-3 pr-8 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
              >
                <option value="ALL">{t(language, 'allLocations')}</option>
                {business.locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Slot Button */}
            <button
              onClick={() => setIsAddSlotOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t(language, 'addSlotBtn')}</span>
            </button>
          </div>
        </div>

        {/* Slot Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSlots.map((slot) => (
            <div
              key={slot.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      {slot.startTime} – {slot.endTime}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[200px]">
                      {slot.locationName}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${getStatusBadge(
                    slot.status
                  )}`}
                >
                  {slot.status}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Booked: {slot.bookedCount}/{slot.capacity}
                  </span>
                </span>

                <span className="text-[11px] font-medium text-slate-600">
                  {slot.assignedStaff || 'Assigned Staff'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create Slot */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {t(language, 'addSlotBtn')}
              </h3>
              <button
                onClick={() => setIsAddSlotOpen(false)}
                className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSlotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Operating Location
                </label>
                <select
                  value={newLocationId}
                  onChange={(e) => setNewLocationId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  {business.locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    placeholder="e.g. 02:00 PM"
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    placeholder="e.g. 02:45 PM"
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Capacity (Seats/Clients)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Staff
                  </label>
                  <input
                    type="text"
                    value={newStaff}
                    onChange={(e) => setNewStaff(e.target.value)}
                    placeholder="Practitioner name"
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Time Slot</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
