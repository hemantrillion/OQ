'use client';

import React, { useState } from 'react';
import { Invoice, PaymentMethod, PaymentStatus, OrderItem } from '@/lib/types';
import {
  Receipt,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  Printer,
  X,
} from 'lucide-react';

interface InvoicesBillingViewProps {
  invoices: Invoice[];
  onUpdateInvoiceStatus: (invoiceId: string, status: PaymentStatus, method?: PaymentMethod) => Promise<void>;
  orderItems: OrderItem[];
}

export const InvoicesBillingView: React.FC<InvoicesBillingViewProps> = ({
  invoices,
  onUpdateInvoiceStatus,
  orderItems,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [receiptInvoice, setReceiptInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    if (filterStatus === 'ALL') return true;
    return inv.payment_status === filterStatus;
  });

  const totalCollected = invoices
    .filter((inv) => inv.payment_status === 'PAID')
    .reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

  const totalPending = invoices
    .filter((inv) => inv.payment_status === 'PENDING')
    .reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

  return (
    <div className="flex-1 flex flex-col p-5 lg:p-6 gap-6 bg-[#f1f5f9] overflow-y-auto font-sans">
      {/* Metric Cards matching NEW PROJECT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase font-mono">Total Bills Emitted</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {invoices.length} Records
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700 uppercase font-mono">Settled Revenue (PAID)</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
              ${totalCollected.toFixed(2)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-700 uppercase font-mono">Outstanding Due (PENDING)</span>
            <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
              ${totalPending.toFixed(2)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-2">Filter Status:</span>
          {(['ALL', 'PENDING', 'PAID'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-[#0b57d0] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline font-mono">
          Go Gin Endpoint: <code className="text-blue-700 font-bold">/invoices/:invoice_id</code>
        </span>
      </div>

      {/* Invoices Data Table matching NEW PROJECT ObservatoryUsersDatabaseView */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs text-xs font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Order Session</th>
                <th className="py-3 px-4">Dining Table</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Settlement Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.map((inv) => {
                const isPaid = inv.payment_status === 'PAID';

                return (
                  <tr key={inv.invoice_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      #{inv.invoice_id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {inv.order_id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-900 font-bold font-mono">
                        Table {inv.table_number || '1'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono text-sm">
                      ${(inv.total_amount || 72.5).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {inv.payment_method === 'CARD' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                            <CreditCard className="w-3 h-3" /> Card
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                            <Banknote className="w-3 h-3" /> Cash
                          </span>
                        )}

                        <select
                          value={inv.payment_method || 'CARD'}
                          onChange={(e) =>
                            onUpdateInvoiceStatus(
                              inv.invoice_id,
                              inv.payment_status,
                              e.target.value as PaymentMethod
                            )
                          }
                          className="bg-slate-50 border border-slate-200 text-[10px] text-slate-600 rounded px-1.5 py-0.5 focus:outline-none"
                        >
                          <option value="CARD">Card</option>
                          <option value="CASH">Cash</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() =>
                          onUpdateInvoiceStatus(
                            inv.invoice_id,
                            isPaid ? 'PENDING' : 'PAID',
                            inv.payment_method
                          )
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle settlement status"
                      >
                        {isPaid ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Settled (PAID)
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" /> Pending (DUE)
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setReceiptInvoice(inv)}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-700 inline-flex items-center gap-1.5 transition-colors font-semibold"
                      >
                        <Printer className="w-3 h-3 text-slate-500" />
                        <span>Print Receipt</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {receiptInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 shadow-xl relative text-slate-800 text-xs">
            <button
              onClick={() => setReceiptInvoice(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Receipt Header */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <div className="text-slate-900 font-bold text-base tracking-wider uppercase font-mono">
                RESTAURANT OBSERVATORY
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                FINE DINING & HOSPITALITY SUITE
              </p>
              <div className="text-[10px] text-slate-400 mt-2 font-mono">
                INVOICE #{receiptInvoice.invoice_id} • TABLE {receiptInvoice.table_number || 1}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                DATE: {new Date(receiptInvoice.created_at).toLocaleString()}
              </div>
            </div>

            {/* Line Items */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-2">
              <div className="flex justify-between text-slate-400 text-[10px] uppercase font-semibold">
                <span>Description</span>
                <span>Amount</span>
              </div>
              {orderItems
                .filter((item) => item.order_id === receiptInvoice.order_id)
                .map((item) => (
                  <div key={item.order_item_id} className="flex justify-between text-slate-800">
                    <span>
                      {item.food_name || 'Chef Dish'} [{item.quantity}]
                    </span>
                    <span className="font-bold font-mono">
                      ${item.unit_price.toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>

            {/* Total Block */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-1 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>${((receiptInvoice.total_amount || 72.5) * 0.85).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Taxes & Service (15%):</span>
                <span>${((receiptInvoice.total_amount || 72.5) * 0.15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
                <span>Total Settlement:</span>
                <span className="text-blue-700">${(receiptInvoice.total_amount || 72.5).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Method:</span>
                <span className="font-semibold text-slate-800">{receiptInvoice.payment_method}</span>
              </div>
              <div className="flex justify-between text-[11px] text-emerald-700">
                <span>Status:</span>
                <span className="font-bold">{receiptInvoice.payment_status}</span>
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-lg bg-[#0b57d0] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Guest Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
