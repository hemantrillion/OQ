'use client';

import React, { useState } from 'react';
import { Language, EarningTransaction } from '@/lib/booking-types';
import { INITIAL_TRANSACTIONS } from '@/lib/booking-data';
import { t } from '@/lib/translations';

interface Props {
  language: Language;
}

export const OwnerEarningsView: React.FC<Props> = ({ language }) => {
  const [filterMethod, setFilterMethod] = useState<'ALL' | 'CASH' | 'ONLINE_UPI'>('ALL');
  const [transactions] = useState<EarningTransaction[]>(INITIAL_TRANSACTIONS);

  const filtered = transactions.filter(
    (tx) => filterMethod === 'ALL' || tx.method === filterMethod
  );

  const totalToday = transactions
    .filter((tx) => tx.date === 'Today')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWeek = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalMonth = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const totalCash = transactions
    .filter((tx) => tx.method === 'CASH')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOnline = transactions
    .filter((tx) => tx.method === 'ONLINE_UPI')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-12 gap-10 max-w-7xl mx-auto w-full">
      {/* 1. Header Banner */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {t(language, 'earningsTitle')}
          </h2>
        </div>

        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-full border border-white/10">
          <button
            onClick={() => setFilterMethod('ALL')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              filterMethod === 'ALL'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Registers
          </button>
          <button
            onClick={() => setFilterMethod('ONLINE_UPI')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              filterMethod === 'ONLINE_UPI'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            UPI & Digital
          </button>
          <button
            onClick={() => setFilterMethod('CASH')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              filterMethod === 'CASH'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cash
          </button>
        </div>
      </section>

      {/* 2. Primary Metrics Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="display-card rounded-3xl p-8 space-y-2">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            {t(language, 'totalToday')}
          </div>
          <div className="text-4xl font-extrabold text-white font-mono">
            ₹{totalToday.toLocaleString('en-IN')}
          </div>
          <div className="text-sm text-emerald-400 font-medium">
            Settled today
          </div>
        </div>

        <div className="display-card rounded-3xl p-8 space-y-2">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            {t(language, 'totalWeek')}
          </div>
          <div className="text-4xl font-extrabold text-white font-mono">
            ₹{totalWeek.toLocaleString('en-IN')}
          </div>
          <div className="text-sm text-slate-400">
            Current operational cycle
          </div>
        </div>

        <div className="display-card rounded-3xl p-8 space-y-2">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            {t(language, 'totalMonth')}
          </div>
          <div className="text-4xl font-extrabold text-white font-mono">
            ₹{totalMonth.toLocaleString('en-IN')}
          </div>
          <div className="text-sm text-slate-400">
            Cumulative monthly receipts
          </div>
        </div>
      </section>

      {/* 3. Method Split */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="display-card rounded-3xl p-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              {t(language, 'cashTotal')}
            </div>
            <div className="text-2xl font-bold text-white font-mono mt-1">₹{totalCash}</div>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
            Direct Register
          </span>
        </div>

        <div className="display-card rounded-3xl p-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              {t(language, 'onlineTotal')}
            </div>
            <div className="text-2xl font-bold text-white font-mono mt-1">₹{totalOnline}</div>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold">
            Direct UPI
          </span>
        </div>
      </section>

      {/* 4. Ledger Table */}
      <section className="display-canvas rounded-3xl p-8 border border-white/10 overflow-hidden">
        <h3 className="text-xl font-bold text-white pb-6 border-b border-white/10">
          {t(language, 'transactionLedger')}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-4 px-4">Client</th>
                <th className="py-4 px-4">Service</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Method</th>
                <th className="py-4 px-4">Settled Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                    {language === 'hi' ? 'कोई लेन-देन दर्ज नहीं है।' : 'No transactions recorded yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-bold text-white">{tx.customerName}</td>
                    <td className="py-4 px-4 text-slate-300">{tx.serviceName}</td>
                    <td className="py-4 px-4 font-mono font-bold text-white text-base">₹{tx.amount}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
                        {tx.method === 'ONLINE_UPI' ? 'UPI' : 'Cash'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-xs">{tx.date}, {tx.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
