'use client';

import React, { useState } from 'react';
import { Language, Appointment } from '@/lib/booking-types';
import { t } from '@/lib/translations';

interface Props {
  language: Language;
  appointments: Appointment[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmOffline: (cancelledIds: string[], emailBody: string) => void;
}

export const OfflineCancellationModal: React.FC<Props> = ({
  language,
  appointments,
  isOpen,
  onClose,
  onConfirmOffline,
}) => {
  const [step, setStep] = useState<'RANGE' | 'CONFIRM' | 'EMAIL'>('RANGE');
  const [fromDateTime, setFromDateTime] = useState('2026-10-30T09:00');
  const [toDateTime, setToDateTime] = useState('2026-10-30T21:00');
  const [emailSubject, setEmailSubject] = useState(t(language, 'emailSubjectDefault'));
  const [emailBody, setEmailBody] = useState(t(language, 'emailBodyDefault'));

  if (!isOpen) return null;

  const affectedAppointments = appointments.filter((a) => a.status === 'UPCOMING');

  const handleRangeNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (affectedAppointments.length > 0) {
      setStep('CONFIRM');
    } else {
      // No active bookings, can go offline directly
      onConfirmOffline([], '');
      onClose();
    }
  };

  const handleConfirmYes = () => {
    setStep('EMAIL');
  };

  const handleDispatchEmailAndGoOffline = (e: React.FormEvent) => {
    e.preventDefault();
    const ids = affectedAppointments.map((a) => a.id);
    onConfirmOffline(ids, emailBody);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 select-none">
      <div className="display-canvas max-w-2xl w-full rounded-3xl p-8 lg:p-10 space-y-6 border border-white/10 shadow-2xl">
        {/* Step 1: Ask From When to When */}
        {step === 'RANGE' && (
          <form onSubmit={handleRangeNext} className="space-y-6">
            <div className="pb-4 border-b border-white/10">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {t(language, 'offlineRangeTitle')}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {t(language, 'offlineRangeSub')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {t(language, 'fromDateLabel')}
                </label>
                <input
                  type="datetime-local"
                  value={fromDateTime}
                  onChange={(e) => setFromDateTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {t(language, 'toDateLabel')}
                </label>
                <input
                  type="datetime-local"
                  value={toDateTime}
                  onChange={(e) => setToDateTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full border border-white/10 text-slate-300 text-sm font-semibold hover:bg-white/5 transition-all"
              >
                {t(language, 'cancelAbortBtn')}
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-md"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Intent Confirmation */}
        {step === 'CONFIRM' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-rose-500/20">
              <h3 className="text-2xl font-bold text-rose-400 tracking-tight">
                {t(language, 'confirmCancelQuery')}
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {t(language, 'confirmCancelWarning')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Affected Client Bookings ({affectedAppointments.length})
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {affectedAppointments.map((a) => (
                  <div key={a.id} className="text-sm text-white flex items-center justify-between py-1 border-b border-white/5">
                    <div>
                      <span className="font-bold">{a.customerName}</span> ({a.time})
                      <div className="text-xs text-slate-400">{a.customerEmail || a.customerPhone}</div>
                    </div>
                    <span className="text-xs font-mono text-sky-400">{a.serviceName}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full border border-white/10 text-slate-300 text-sm font-semibold hover:bg-white/5 transition-all"
              >
                {t(language, 'cancelAbortBtn')}
              </button>
              <button
                onClick={handleConfirmYes}
                className="px-8 py-3 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm tracking-wide transition-all shadow-lg"
              >
                Yes, Proceed to Compose Notice
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Owner Types Cancellation Email Directly */}
        {step === 'EMAIL' && (
          <form onSubmit={handleDispatchEmailAndGoOffline} className="space-y-5">
            <div className="pb-4 border-b border-white/10">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {t(language, 'cancellationEmailTitle')}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {t(language, 'cancellationEmailSub')}
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {t(language, 'emailSubjectLabel')}
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {t(language, 'emailBodyLabel')} (Type Your Cancellation Message)
              </label>
              <textarea
                rows={6}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 font-normal leading-relaxed resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full border border-white/10 text-slate-300 text-sm font-semibold hover:bg-white/5 transition-all"
              >
                {t(language, 'cancelAbortBtn')}
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm tracking-wide transition-all shadow-lg"
              >
                {t(language, 'dispatchCancelBtn')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
