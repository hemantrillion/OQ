'use client';

import React, { useState } from 'react';
import {
  Language,
  BusinessProfile,
  Slot,
  Appointment,
} from '@/lib/booking-types';
import { t } from '@/lib/translations';
import { LivingWaterOrb } from '@/components/ai/LivingWaterOrb';

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
  onOpenAiChat,
  onAddSlot,
}) => {
  const [selectedStationId, setSelectedStationId] = useState<string>('ALL');
  const [isPublishing, setIsPublishing] = useState(false);

  // New slot form state
  const [newDate, setNewDate] = useState('2026-10-30');
  const [newStartTime, setNewStartTime] = useState('11:00 AM');
  const [newEndTime, setNewEndTime] = useState('11:45 AM');
  const [newStationId, setNewStationId] = useState(business.locations[0]?.id || 'loc_main');
  const [newCapacity, setNewCapacity] = useState(1);
  const [newStaff, setNewStaff] = useState(business.ownerName);

  const filteredSlots = slots.filter(
    (s) => selectedStationId === 'ALL' || s.locationId === selectedStationId
  );

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = business.locations.find((l) => l.id === newStationId);
    onAddSlot({
      locationId: newStationId,
      locationName: loc?.name || 'Primary Station',
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      capacity: Number(newCapacity),
      bookedCount: 0,
      status: 'OPEN',
      assignedStaff: newStaff,
    });
    setIsPublishing(false);
  };

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-12 gap-10 max-w-7xl mx-auto w-full">
      {/* 1. ATMOSPHERIC DISPLAY HERO WITH LIVING WATER ORB */}
      <section className="display-canvas rounded-3xl p-8 lg:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl text-center md:text-left z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t(language, 'heroTitle')}
          </h1>
          <p className="text-base md:text-lg text-slate-300 font-normal leading-relaxed">
            {t(language, 'heroSubtitle')}
          </p>
          <p className="text-sm text-sky-400 font-medium">
            {t(language, 'aiTriggerPrompt')}
          </p>
        </div>

        {/* THE SOLE LIVING ICON ON THE PAGE: FLOWING WATER ORB */}
        <div className="z-10 flex flex-col items-center gap-3 shrink-0">
          <LivingWaterOrb size={120} onClick={onOpenAiChat} />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            {language === 'hi' ? 'संवाद शुरू करें' : 'Tap to Interact'}
          </span>
        </div>
      </section>

      {/* 2. STATION FILTER & ACTIONS */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {t(language, 'navSchedule')}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {business.locations.length} {language === 'hi' ? 'सक्रिय कार्य स्थल' : 'Configured Stations'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}
            className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium focus:outline-none focus:border-sky-400"
          >
            <option value="ALL" className="bg-slate-900 text-white">
              {language === 'hi' ? 'सभी स्थान' : 'All Operating Stations'}
            </option>
            {business.locations.map((loc) => (
              <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                {loc.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsPublishing(true)}
            className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-sky-500/20"
          >
            {t(language, 'createSlotTitle')}
          </button>
        </div>
      </section>

      {/* 3. OPERATING SLOTS GRID (NO FAKE BOOKED CLUTTER) */}
      <section className="space-y-4">
        {filteredSlots.length === 0 ? (
          <div className="display-card rounded-2xl p-12 text-center text-slate-400 text-base">
            {t(language, 'noSlotsMsg')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSlots.map((slot) => (
              <div
                key={slot.id}
                className="display-card rounded-2xl p-6 flex flex-col justify-between gap-4 transition-all"
              >
                <div className="space-y-2">
                  <div className="text-lg font-bold text-white tracking-wide">
                    {slot.startTime} – {slot.endTime}
                  </div>
                  <div className="text-sm text-slate-300 font-medium">
                    {slot.locationName}
                  </div>
                  <div className="text-xs text-slate-400">
                    {slot.date} • {slot.assignedStaff}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-sm text-slate-300 font-medium">
                    {language === 'hi' ? 'क्षमता' : 'Capacity'}: {slot.capacity} {slot.capacity > 1 ? 'seats' : 'client'}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      slot.status === 'OPEN'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : slot.status === 'BOOKED'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}
                  >
                    {slot.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PUBLISH SLOT MODAL */}
      {isPublishing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="display-canvas max-w-lg w-full rounded-3xl p-8 space-y-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-2xl font-bold text-white">
                {t(language, 'createSlotTitle')}
              </h3>
              <button
                onClick={() => setIsPublishing(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-5 text-sm">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  {t(language, 'stationLabel')}
                </label>
                <select
                  value={newStationId}
                  onChange={(e) => setNewStationId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                >
                  {business.locations.map((loc) => (
                    <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  {t(language, 'dateLabel')}
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                    Start Window
                  </label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    placeholder="e.g. 11:00 AM"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                    End Window
                  </label>
                  <input
                    type="text"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    placeholder="e.g. 11:45 AM"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                    {t(language, 'capacityLabel')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                    Staff / Attendant
                  </label>
                  <input
                    type="text"
                    value={newStaff}
                    onChange={(e) => setNewStaff(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide transition-all mt-4"
              >
                {t(language, 'publishBtn')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
