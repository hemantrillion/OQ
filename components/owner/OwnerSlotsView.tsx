'use client';

import React, { useState } from 'react';
import { Language, BusinessProfile, Slot } from '@/lib/booking-types';
import { t, localizeText } from '@/lib/translations';

interface Props {
  language: Language;
  business: BusinessProfile;
  slots: Slot[];
  onBackToFrontpage: () => void;
  onAddSlot: (newSlot: Partial<Slot>) => void;
}

export const OwnerSlotsView: React.FC<Props> = ({
  language,
  business,
  slots,
  onBackToFrontpage,
  onAddSlot,
}) => {
  const [selectedJob, setSelectedJob] = useState<string>('ALL');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New slot form state
  const [newJob, setNewJob] = useState(business.services[0]?.name || 'Signature Haircut');
  const [newStationId, setNewStationId] = useState(business.locations[0]?.id || 'loc_main');
  const [newDate, setNewDate] = useState('2026-10-30');
  const [newStartTime, setNewStartTime] = useState('11:00 AM');
  const [newEndTime, setNewEndTime] = useState('12:00 PM');
  const [newCapacity, setNewCapacity] = useState(2);
  const [newStaff, setNewStaff] = useState(business.ownerName);

  // Collect unique job profiles from slots and services
  const jobProfiles = Array.from(
    new Set([
      ...business.services.map((s) => s.name),
      ...slots.map((s) => s.jobProfile || 'General Service'),
    ])
  );

  const filteredSlots = slots.filter((slot) => {
    const matchesJob = selectedJob === 'ALL' || slot.jobProfile === selectedJob;
    const matchesStation = selectedStation === 'ALL' || slot.locationId === selectedStation;
    return matchesJob && matchesStation;
  });

  const handleCreateSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = business.locations.find((l) => l.id === newStationId);
    onAddSlot({
      jobProfile: newJob,
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
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-12 gap-8 max-w-7xl mx-auto w-full select-none">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <button
            onClick={onBackToFrontpage}
            className="text-xs uppercase tracking-widest text-sky-400 font-bold hover:underline mb-2 block"
          >
            ← {t(language, 'backToFrontpage')}
          </button>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {t(language, 'slotsPageTitle')}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t(language, 'slotsPageSub')}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-sky-500/20 shrink-0"
        >
          {t(language, 'createSlotBtn')}
        </button>
      </div>

      {/* Segregation Filter Controls: Job Profile & Station */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Filter by Service / Job Profile
          </label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
          >
            <option value="ALL" className="bg-slate-900 text-white">
              {t(language, 'filterAllJobs')}
            </option>
            {jobProfiles.map((job) => (
              <option key={job} value={job} className="bg-slate-900 text-white">
                {localizeText(job, language)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Filter by Operating Station
          </label>
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
          >
            <option value="ALL" className="bg-slate-900 text-white">
              {t(language, 'filterAllStations')}
            </option>
            {business.locations.map((loc) => (
              <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Segregated Slots Grid */}
      <div className="space-y-4">
        {filteredSlots.length === 0 ? (
          <div className="display-card rounded-3xl p-16 text-center text-slate-400 text-base">
            No operating slots match the selected job or station criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSlots.map((slot) => {
              const remaining = Math.max(0, slot.capacity - slot.bookedCount);
              const isFull = remaining === 0;

              return (
                <div
                  key={slot.id}
                  className="display-card rounded-3xl p-6 lg:p-8 flex flex-col justify-between gap-5 transition-all"
                >
                  <div className="space-y-3">
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/20">
                      {localizeText(slot.jobProfile || 'Standard Service', language)}
                    </div>

                    <div className="text-2xl font-bold text-white tracking-wide font-mono">
                      {slot.startTime} – {slot.endTime}
                    </div>

                    <div className="text-sm text-slate-300 font-medium">
                      {slot.locationName}
                    </div>

                    <div className="text-xs text-slate-400">
                      {slot.date} • Attendant: {slot.assignedStaff}
                    </div>
                  </div>

                  {/* Capacity Capping & Status Display */}
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300 font-medium">
                        Cap: {slot.capacity} appointments
                      </span>
                      <span className={`font-bold ${isFull ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isFull ? t(language, 'slotFull') : `${remaining} ${t(language, 'seatsLeft')}`}
                      </span>
                    </div>

                    {/* Progress Fill Bar */}
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, (slot.bookedCount / slot.capacity) * 100)}%` }}
                        className={`h-full rounded-full transition-all ${
                          isFull ? 'bg-rose-500' : 'bg-sky-400'
                        }`}
                      />
                    </div>

                    <div className="text-[11px] text-slate-400 text-right">
                      {slot.bookedCount} / {slot.capacity} {t(language, 'seatsBooked')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create Segregated Slot */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="display-canvas max-w-lg w-full rounded-3xl p-8 space-y-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-2xl font-bold text-white">
                {t(language, 'createSlotBtn')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSlotSubmit} className="space-y-5 text-sm">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  {t(language, 'jobLabel')}
                </label>
                <select
                  value={newJob}
                  onChange={(e) => setNewJob(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                >
                  {jobProfiles.map((job) => (
                    <option key={job} value={job} className="bg-slate-900 text-white">
                      {localizeText(job, language)}
                    </option>
                  ))}
                </select>
              </div>

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
                  Date
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
                    placeholder="e.g. 12:00 PM"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  {t(language, 'capacityCapLabel')} (Cap Appointments Count)
                </label>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide transition-all mt-4"
              >
                Publish Segregated Slot
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
