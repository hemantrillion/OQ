'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  state: any;
  dbml?: string | null;
  merchantName?: string;
}

export const LiveSchemaDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  state = {},
  dbml,
  merchantName,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'dbml'>('visual');

  if (!isOpen) return null;

  const isRestaurant = (state.business_type || '').toLowerCase().includes('restaurant');
  const items: any[] = Array.isArray(state.services) ? state.services : [];

  const bName = state.business_name || null;
  const bType = state.business_type || null;
  const stationsCount = state.stations_count || null;
  const openTime = state.open_time || null;
  const closeTime = state.close_time || null;
  const bufferMin = state.buffer_minutes ?? 0;

  return (
    <aside className="w-full md:w-[420px] lg:w-[460px] h-full bg-[#0a0d16] border-l border-white/10 flex flex-col shrink-0 z-40 animate-in slide-in-from-right duration-150">
      {/* Header */}
      <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between bg-black/30">
        <div>
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Live Schema Inspector</h3>
          <p className="text-[11px] text-slate-500 font-mono">
            {isRestaurant ? 'Model: Table Reservations + Product Inventory' : 'Model: Service Appointments + Queue'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                activeTab === 'visual' ? 'bg-white/15 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Schema
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dbml')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                activeTab === 'dbml' ? 'bg-white/15 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              DBML
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
        {activeTab === 'visual' ? (
          <>
            {/* Table 1: Entity */}
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-slate-200">Table: businesses</span>
                <span className="text-[10px]">
                  {bName ? <span className="text-emerald-400 font-sans">✓ synced</span> : <span className="text-slate-600 font-sans">empty</span>}
                </span>
              </div>

              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-slate-500">id</span>
                  <span>uuid [PK]</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-slate-500">name</span>
                  <span className={bName ? 'text-white font-semibold' : 'text-slate-600 italic'}>{bName || '— (not set)'}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-slate-500">type</span>
                  <span className={bType ? 'text-slate-200' : 'text-slate-600 italic'}>{bType || '— (not set)'}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">owner</span>
                  <span>{merchantName || 'Authenticated Owner'}</span>
                </div>
              </div>
            </div>

            {/* Table 2: Capacity / Stations / Tables */}
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-slate-200">
                  {isRestaurant ? 'Table: tables (Dining Seating)' : 'Table: stations (Chairs / Desks)'}
                </span>
                <span className="text-[10px]">
                  {stationsCount ? <span className="text-emerald-400 font-sans">✓ synced</span> : <span className="text-slate-600 font-sans">empty</span>}
                </span>
              </div>

              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-slate-500">{isRestaurant ? 'table_count' : 'station_count'}</span>
                  <span className={stationsCount ? 'text-white font-semibold' : 'text-slate-600 italic'}>
                    {stationsCount ? `${stationsCount} ${isRestaurant ? 'Dining Tables' : 'Operational Desks'}` : '— (not set)'}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">allocation_mode</span>
                  <span className="text-slate-400">
                    {isRestaurant ? 'Point-in-Time Table Hold' : 'Mutex Lock Slot Allocation'}
                  </span>
                </div>
              </div>
            </div>

            {/* Table 3: Products / Services Catalog */}
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-slate-200">
                  {isRestaurant ? 'Table: products (Menu Inventory)' : 'Table: services (Tariff Catalog)'}
                </span>
                <span className="text-[10px]">
                  {items.length > 0 ? (
                    <span className="text-emerald-400 font-sans">✓ {items.length} item(s)</span>
                  ) : (
                    <span className="text-slate-600 font-sans">empty</span>
                  )}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="py-2 text-slate-600 italic text-center">
                  — No catalog items added yet —
                </div>
              ) : (
                <div className="space-y-1.5 divide-y divide-white/5">
                  {items.map((item, idx) => {
                    const isProd = isRestaurant || item.type === 'product' || !item.duration_minutes;
                    return (
                      <div key={idx} className="pt-1.5 first:pt-0 flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{item.name}</div>
                          <div className="text-[10px] text-slate-500 font-sans">
                            {isProd ? 'Product / Menu Item' : `${item.duration_minutes || 30} mins service`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={item.price ? 'text-emerald-400 font-semibold' : 'text-amber-400 italic'}>
                            {item.price ? `₹${item.price}` : 'Price not set'}
                          </div>
                          {!isProd && item.buffer_minutes ? (
                            <div className="text-[10px] text-slate-500">+{item.buffer_minutes}m buffer</div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Table 4: Operating Schedule */}
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-slate-200">
                  {isRestaurant ? 'Table: business_hours (Seating Windows)' : 'Table: slots (Daily Schedule)'}
                </span>
                <span className="text-[10px]">
                  {openTime && closeTime ? (
                    <span className="text-emerald-400 font-sans">✓ synced</span>
                  ) : (
                    <span className="text-slate-600 font-sans">empty</span>
                  )}
                </span>
              </div>

              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-slate-500">open_time</span>
                  <span className={openTime ? 'text-white' : 'text-slate-600 italic'}>{openTime || '—'}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-slate-500">close_time</span>
                  <span className={closeTime ? 'text-white' : 'text-slate-600 italic'}>{closeTime || '—'}</span>
                </div>
                {!isRestaurant && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">buffer_window</span>
                    <span>{bufferMin} mins</span>
                  </div>
                )}
              </div>
            </div>

            {/* Relational Architecture */}
            <div className="p-3 rounded-lg border border-white/5 bg-black/40 text-[11px] text-slate-400 font-mono space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-sans">
                Foreign Key Architecture
              </div>
              {isRestaurant ? (
                <>
                  <div>businesses (1) ──&gt; (N) tables</div>
                  <div>businesses (1) ──&gt; (N) products</div>
                  <div>tables (1) ──&gt; (N) reservations (party_size, start_time)</div>
                  <div>reservations (1) ──&gt; (N) order_items (products)</div>
                </>
              ) : (
                <>
                  <div>businesses (1) ──&gt; (N) stations</div>
                  <div>businesses (1) ──&gt; (N) services</div>
                  <div>stations (1) ──&gt; (N) slots (start_time, end_time)</div>
                  <div>slots (1) ──&gt; (1) bookings (customer_name)</div>
                  <div>businesses (1) ──&gt; (N) queue_tokens (M/M/c)</div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-black/60 border border-white/10 p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto">
            <pre className="whitespace-pre-wrap leading-relaxed">
              {dbml || '// No DBML generated yet. Define your business parameters to compile.'}
            </pre>
          </div>
        )}
      </div>
    </aside>
  );
};
