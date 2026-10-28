'use client';

import React, { useState } from 'react';
import { Language, Appointment, AppointmentStatus } from '@/lib/booking-types';
import { t } from '@/lib/translations';
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Filter,
} from 'lucide-react';

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
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {t(language, 'appointmentsTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(language, 'appointmentsSub')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'UPCOMING'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t(language, 'tabUpcoming')} ({appointments.filter((a) => a.status === 'UPCOMING').length})
          </button>

          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'HISTORY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t(language, 'tabHistory')} ({appointments.filter((a) => a.status !== 'UPCOMING').length})
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-xs text-slate-400 text-xs">
            {t(language, 'noAppointments')}
          </div>
        ) : (
          filtered.map((apt) => (
            <div
              key={apt.id}
              className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900">
                    {apt.customerName}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {apt.customerPhone}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      apt.paymentStatus === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {apt.paymentStatus} ({apt.paymentMethod === 'ONLINE_UPI' ? 'UPI' : 'Cash'})
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-medium">
                  {language === 'hi' && apt.serviceHindiName ? apt.serviceHindiName : apt.serviceName} • <span className="font-bold text-slate-900 font-mono">₹{apt.price}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-0.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    {apt.date} at {apt.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {apt.locationName}
                  </span>
                  {apt.notes && (
                    <span className="flex items-center gap-1 italic text-slate-400 text-[11px]">
                      <FileText className="w-3 h-3" />
                      &quot;{apt.notes}&quot;
                    </span>
                  )}
                </div>
              </div>

              {/* Right Action Buttons */}
              {apt.status === 'UPCOMING' && (
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => onUpdateStatus(apt.id, 'COMPLETED')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t(language, 'markComplete')}</span>
                  </button>

                  <button
                    onClick={() => onUpdateStatus(apt.id, 'CANCELLED')}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors"
                  >
                    <span>{t(language, 'cancelBooking')}</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
