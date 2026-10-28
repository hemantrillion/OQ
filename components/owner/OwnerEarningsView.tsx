'use client';

import React, { useState } from 'react';
import { Language, EarningTransaction } from '@/lib/booking-types';
import { INITIAL_TRANSACTIONS } from '@/lib/booking-data';
import { t } from '@/lib/translations';
import {
  DollarSign,
  CreditCard,
  Banknote,
  Calendar,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
} from 'lucide-react';

interface Props {
  language: Language;
}

export const OwnerEarningsView: React.FC<Props> = ({ language }) => {
  const [filterMethod, setFilterMethod] = useState<'ALL' | 'CASH' | 'ONLINE_UPI'>('ALL');
  const [transactions, setTransactions] = useState<EarningTransaction[]>(INITIAL_TRANSACTIONS);

  const filteredTx = transactions.filter(
    (tx) => filterMethod === 'ALL' || tx.method === filterMethod
  );

  const totalCash = transactions
    .filter((tx) => tx.method === 'CASH')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOnline = transactions
    .filter((tx) => tx.method === 'ONLINE_UPI')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {t(language, 'earningsTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(language, 'earningsSub')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Live Settlement Status:</span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active UPI QR & Cash Desk
          </span>
        </div>
      </div>

      {/* Metric Tiles: Today, Week, Month */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t(language, 'totalToday')}</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            ₹1,250
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18% from yesterday</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t(language, 'totalWeek')}</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            ₹24,800
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            42 customer reservations settled
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t(language, 'totalMonth')}</span>
            <CreditCard className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            ₹89,500
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Monthly gross booking revenue
          </div>
        </div>
      </div>

      {/* Payment Method Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">{t(language, 'cashTotal')}</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">₹{totalCash}</div>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
            Manual Register
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">{t(language, 'onlineTotal')}</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">₹{totalOnline}</div>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
            Direct UPI QR
          </span>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-sm">
            {t(language, 'transactionLedger')}
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMethod('ALL')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filterMethod === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMethod('ONLINE_UPI')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filterMethod === 'ONLINE_UPI'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Online / UPI
            </button>
            <button
              onClick={() => setFilterMethod('CASH')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filterMethod === 'CASH'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cash
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t(language, 'colCustomer')}</th>
                <th className="py-3 px-4">{t(language, 'colService')}</th>
                <th className="py-3 px-4">{t(language, 'colAmount')}</th>
                <th className="py-3 px-4">{t(language, 'colMethod')}</th>
                <th className="py-3 px-4">{t(language, 'colTime')}</th>
                <th className="py-3 px-4">{t(language, 'colStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {tx.customerName}
                  </td>
                  <td className="py-3 px-4">{tx.serviceName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    ₹{tx.amount}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        tx.method === 'ONLINE_UPI'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {tx.method === 'ONLINE_UPI' ? 'UPI Online' : 'Cash'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {tx.date}, {tx.time}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
