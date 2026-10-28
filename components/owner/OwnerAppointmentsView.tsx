'use client';

import React, { useState } from 'react';
import { Language, Appointment, AppointmentStatus } from '@/lib/booking-types';
import { t } from '@/lib/translations';

interface Props {
  language: Language;
  appointments: Appointment[];
  onUpdateStatus: (id: string, newStatus: AppointmentStatus) => void;
}

export const OwnerAppointmentsView: React.FC<Props> = ({
  language,
  appointments,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'HISTORY'>('UPCOMING');

  const filtered = appointments.filter((a) =>
    activeTab === 'UPCOMING'
      ? a.status === 'UPCOMING'
      : a.status === 'COMPLETED' || a.status === 'CANCELLED'
  );

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-12 gap-8 max-w-7xl mx-auto w-full">
      {/* Top Banner & Tab Controls */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {t(language, 'appointmentsTitle')}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Confirmed client appointments and session logs
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-full border border-white/10">
          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'UPCOMING'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t(language, 'tabUpcoming')} ({appointments.filter((a) => a.status === 'UPCOMING').length})
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'HISTORY'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t(language, 'tabHistory')} ({appointments.filter((a) => a.status !== 'UPCOMING').length})
          </button>
        </div>
      </section>

      {/* Appointments List */}
      <section className="space-y-4">
        {filtered.length === 0 ? (
          <div className="display-card rounded-3xl p-16 text-center text-slate-400 text-base">
            {t(language, 'noAppointments')}
          </div>
        ) : (
          filtered.map((apt) => (
            <div
              key={apt.id}
              className="display-card rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xl font-bold text-white">
                    {apt.customerName}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {apt.customerPhone}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      apt.paymentStatus === 'PAID'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {apt.paymentStatus} ({apt.paymentMethod === 'ONLINE_UPI' ? 'UPI' : 'Cash'})
                  </span>
                </div>

                <div className="text-base text-slate-200 font-medium">
                  {language === 'hi' && apt.serviceHindiName ? apt.serviceHindiName : apt.serviceName} • <span className="font-bold text-white font-mono">₹{apt.price}</span>
                </div>

                <div className="text-sm text-slate-400 pt-1">
                  {apt.date} at {apt.time} • {apt.locationName}
                </div>

                {apt.notes && (
                  <div className="text-xs text-slate-400 italic pt-1">
                    &quot;{apt.notes}&quot;
                  </div>
                )}
              </div>

              {apt.status === 'UPCOMING' && (
                <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                  <button
                    onClick={() => onUpdateStatus(apt.id, 'COMPLETED')}
                    className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition-all"
                  >
                    {t(language, 'markComplete')}
                  </button>

                  <button
                    onClick={() => onUpdateStatus(apt.id, 'CANCELLED')}
                    className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-medium transition-all"
                  >
                    {t(language, 'cancelBooking')}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};
