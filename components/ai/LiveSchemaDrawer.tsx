'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Download, Play, FileCode } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  state: any;
  dbml?: string | null;
  merchantName?: string;
  activeTab?: 'visual' | 'dbml';
  onTabChange?: (tab: 'visual' | 'dbml') => void;
}

export const LiveSchemaDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  state = {},
  dbml,
  merchantName,
  activeTab: controlledTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'visual' | 'dbml'>('visual');
  const [copied, setCopied] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrateSuccess, setMigrateSuccess] = useState(false);

  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const setTab = (tab: 'visual' | 'dbml') => {
    if (onTabChange) onTabChange(tab);
    setInternalTab(tab);
  };

  if (!isOpen) return null;

  const isClinic = (state.business_type || '').toLowerCase().includes('clinic') ||
    (state.business_type || '').toLowerCase().includes('ent') ||
    (state.business_type || '').toLowerCase().includes('blood') ||
    (state.business_type || '').toLowerCase().includes('lab');
  const isRestaurant = (state.business_type || '').toLowerCase().includes('restaurant');
  const items: any[] = Array.isArray(state.services) ? state.services : [];

  const bName = state.business_name || null;
  const bType = state.business_type || null;
  const stationsCount = state.stations_count || null;
  const openTime = state.open_time || null;
  const closeTime = state.close_time || null;
  const bufferMin = state.buffer_minutes ?? 0;

  const handleCopy = () => {
    if (!dbml) return;
    navigator.clipboard.writeText(dbml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!dbml) return;
    const blob = new Blob([dbml], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(bName || 'clinic_schema').toLowerCase().replace(/[^a-z0-9]/g, '_')}.dbml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApplyToDb = async () => {
    setMigrating(true);
    try {
      const res = await fetch('/api/schema/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: bName || 'Apex ENT Specialist Clinic & Blood Lab',
          business_type: bType || 'ent_clinic_and_lab',
          stations: state.stations,
          services: state.services,
          open_time: openTime || '08:00',
          close_time: closeTime || '20:00',
        }),
      });
      if (res.ok) {
        setMigrateSuccess(true);
        setTimeout(() => setMigrateSuccess(false), 3000);
      }
    } catch {
    } finally {
      setMigrating(false);
    }
  };

  return (
    <aside className="w-full md:w-[460px] lg:w-[500px] h-full bg-[#0a0d16] border-l border-white/10 flex flex-col shrink-0 z-40 animate-in slide-in-from-right duration-150 shadow-2xl">
      {/* Header */}
      <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div>
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-sky-400" />
            Live Schema &amp; DBML Inspector
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            {isClinic
              ? 'Model: ENT Specialist Chambers & Pathology Lab'
              : isRestaurant
              ? 'Model: Dining Tables & Product Catalog'
              : 'Model: Timed Service Appointments & Queue'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setTab('visual')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'visual' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Schema
            </button>
            <button
              type="button"
              onClick={() => setTab('dbml')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'dbml' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>DBML</span>
              {dbml && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
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
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-slate-200">Table: businesses</span>
                <span className="text-[10px]">
                  {bName ? <span className="text-emerald-400 font-sans font-bold">✓ Synced</span> : <span className="text-slate-600 font-sans">empty</span>}
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
                  <span className="text-slate-500">business_type</span>
                  <span className="text-sky-300">{bType || 'ent_clinic_and_lab'}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">hours</span>
                  <span className={openTime ? 'text-slate-200' : 'text-slate-600'}>
                    {openTime && closeTime ? `${openTime} - ${closeTime}` : '08:00 - 20:00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Table 2: Chambers / Stations */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-slate-200">
                  {isClinic ? 'Table: stations (Chambers & Lab Draw)' : isRestaurant ? 'Table: tables (Dining Seating)' : 'Table: stations'}
                </span>
                <span className="text-[10px]">
                  {stationsCount ? <span className="text-emerald-400 font-sans font-bold">✓ {stationsCount} units</span> : <span className="text-slate-600 font-sans">empty</span>}
                </span>
              </div>

              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-slate-500">id</span>
                  <span>uuid [PK]</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-slate-500">business_id</span>
                  <span>uuid [FK -&gt; businesses.id]</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-white/5">
                  <span className="text-slate-500">name</span>
                  <span>varchar(50) [not null]</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">station_type</span>
                  <span>{isClinic ? 'CHAMBER | LAB_DESK' : 'CHAIR | TABLE'}</span>
                </div>
              </div>
            </div>

            {/* Table 3: Catalog Items */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-slate-200">
                  {isClinic ? 'Table: catalog_items (Services & Tests)' : isRestaurant ? 'Table: products (Food Menu)' : 'Table: services'}
                </span>
                <span className="text-[10px]">
                  {items.length > 0 ? (
                    <span className="text-emerald-400 font-sans font-bold">✓ {items.length} items</span>
                  ) : (
                    <span className="text-slate-600 font-sans">empty</span>
                  )}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="py-2 text-slate-500 italic text-center">
                  — No catalog items added yet —
                </div>
              ) : (
                <div className="space-y-1.5 divide-y divide-white/5">
                  {items.map((item, idx) => {
                    const isProd = isRestaurant || item.type === 'product' || item.type === 'DIAGNOSTIC_TEST' || item.duration_minutes === 0;
                    return (
                      <div key={idx} className="pt-1.5 first:pt-0 flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-sans">
                            {isProd ? 'Diagnostic Blood Test / Panel' : `${item.duration_minutes || 15} mins doctor consultation`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={item.price ? 'text-emerald-400 font-semibold' : 'text-amber-400 italic'}>
                            {item.price ? `₹${item.price}` : 'Price not set'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Relational Architecture */}
            <div className="p-3.5 rounded-xl border border-white/5 bg-black/40 text-[11px] text-slate-400 font-mono space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-sans">
                Foreign Key Relational Graph
              </div>
              <div>businesses (1) ──&gt; (N) stations [cascade delete]</div>
              <div>businesses (1) ──&gt; (N) catalog_items [cascade delete]</div>
              <div>businesses (1) ──&gt; (N) bookings [cascade delete]</div>
              <div>stations (1) ──&gt; (N) bookings [set null on delete]</div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            {/* Action Bar for DBML */}
            <div className="flex items-center justify-between gap-2 p-2 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[11px] text-slate-400 font-sans">
                DBML v2.6 Blueprint Specification
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-sans flex items-center gap-1 transition-all cursor-pointer"
                  title="Copy DBML to Clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-sans flex items-center gap-1 transition-all cursor-pointer"
                  title="Download .dbml file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* DBML Code Display */}
            <div className="rounded-xl bg-black/70 border border-white/10 p-3.5 font-mono text-[11px] text-emerald-400 overflow-x-auto shadow-inner">
              <pre className="whitespace-pre-wrap leading-relaxed select-text">
                {dbml || `// Database Markup Language (DBML) v2.6 Blueprint
// Auto-generated by Booking OQ AI Engine (ENT Clinic & Diagnostic Blood Lab Architecture)

Project booking_oq {
  database_type: 'PostgreSQL / SQLite'
  Note: 'Specialist ENT Clinic Consultation & Diagnostic Pathology Lab Scheduling Engine'
}

Table businesses {
  id uuid [pk]
  name varchar(100) [not null, note: '${bName || 'Apex ENT Specialist Clinic & Blood Lab'}']
  business_type varchar(50) [default: 'ent_clinic_and_lab']
  open_time time [not null, default: '${openTime || '08:00'}']
  close_time time [not null, default: '${closeTime || '20:00'}']
  created_at timestamp [default: \`now()\`]
}

Table stations {
  id uuid [pk]
  business_id uuid [not null]
  name varchar(50) [not null, note: 'Consultation Chamber 1, Chamber 2, or Blood Draw Station']
  station_type varchar(50) [default: 'CHAMBER', note: 'CHAMBER | PHLEBOTOMY_DESK | LAB']
  is_active boolean [default: true]

  indexes {
    (business_id, is_active) [name: 'idx_active_chambers']
  }
}

Table catalog_items {
  id uuid [pk]
  business_id uuid [not null]
  name varchar(100) [not null]
  item_type varchar(50) [not null, default: 'CLINICAL_SERVICE', note: 'CLINICAL_SERVICE | DIAGNOSTIC_TEST']
  duration_minutes int [default: 15, note: 'Duration for clinical exams; 0 for lab test catalog']
  price decimal(10,2) [not null, default: 0.00]
  is_available boolean [default: true]

  indexes {
    (business_id, item_type) [name: 'idx_clinic_catalog']
  }
}

Table bookings {
  id uuid [pk]
  business_id uuid [not null]
  station_id uuid [null]
  customer_name varchar(100) [not null]
  customer_phone varchar(20)
  service_name varchar(100) [not null]
  booking_date date [not null]
  start_time time [not null]
  end_time time [not null]
  status varchar(20) [default: 'CONFIRMED', note: 'CONFIRMED | CANCELLED | COMPLETED']
  created_at timestamp [default: \`now()\`]

  indexes {
    (business_id, booking_date) [name: 'idx_bookings_schedule']
    status [name: 'idx_bookings_status']
  }
}

Ref: stations.business_id > businesses.id [delete: cascade]
Ref: catalog_items.business_id > businesses.id [delete: cascade]
Ref: bookings.business_id > businesses.id [delete: cascade]
Ref: bookings.station_id > stations.id [delete: set null]`}
              </pre>
            </div>

            {/* Quick Build / Apply Button */}
            <button
              type="button"
              onClick={handleApplyToDb}
              disabled={migrating}
              className={`w-full py-2.5 rounded-xl font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                migrateSuccess
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20 shadow-lg'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20 shadow-lg'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>
                {migrating ? 'Applying to Database...' : migrateSuccess ? '✓ Tables Created in Database!' : 'Auto-Build SQLite Database from DBML'}
              </span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
