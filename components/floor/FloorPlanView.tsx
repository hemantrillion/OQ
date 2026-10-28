'use client';

import React, { useState } from 'react';
import { Table, TableStatus } from '@/lib/types';
import {
  Users,
  Plus,
  ShoppingBag,
  Receipt,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

interface FloorPlanViewProps {
  tables: Table[];
  onSelectTableForOrder: (table: Table) => void;
  onUpdateTableStatus: (tableId: string, status: TableStatus) => void;
  onAddTable: (newTable: { table_number: number; number_of_guests: number; section: any }) => void;
  onNavigateToInvoice: (orderId: string) => void;
}

export const FloorPlanView: React.FC<FloorPlanViewProps> = ({
  tables,
  onSelectTableForOrder,
  onUpdateTableStatus,
  onAddTable,
  onNavigateToInvoice,
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [newTableNum, setNewTableNum] = useState<number>(tables.length + 1);
  const [newTableSeats, setNewTableSeats] = useState<number>(4);
  const [newTableSection, setNewTableSection] = useState<any>('MAIN_DINING');

  const filteredTables = selectedSection === 'ALL'
    ? tables
    : tables.filter((t) => t.section === selectedSection);

  const stats = {
    total: tables.length,
    available: tables.filter((t) => (t.status || 'AVAILABLE') === 'AVAILABLE').length,
    occupied: tables.filter((t) => t.status === 'OCCUPIED').length,
    ordering: tables.filter((t) => t.status === 'ORDERING').length,
    reserved: tables.filter((t) => t.status === 'RESERVED').length,
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTable({
      table_number: Number(newTableNum),
      number_of_guests: Number(newTableSeats),
      section: newTableSection,
    });
    setIsAddingTable(false);
    setNewTableNum(tables.length + 2);
  };

  const getStatusColor = (status?: TableStatus) => {
    switch (status) {
      case 'OCCUPIED':
        return {
          bg: 'bg-rose-50/50',
          border: 'border-rose-200',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'ORDERING':
        return {
          bg: 'bg-amber-50/50',
          border: 'border-amber-200',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'RESERVED':
        return {
          bg: 'bg-blue-50/50',
          border: 'border-blue-200',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
        };
      case 'AVAILABLE':
      default:
        return {
          bg: 'bg-emerald-50/40',
          border: 'border-emerald-200',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col p-5 lg:p-6 gap-6 bg-[#f1f5f9] overflow-y-auto font-sans">
      {/* Top Controls & Sections Bar matching NEW PROJECT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        {/* Section Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-1 font-mono">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Section:</span>
          </span>

          {[
            { id: 'ALL', label: 'All Floor' },
            { id: 'MAIN_DINING', label: 'Main Dining Hall' },
            { id: 'TATAMI_ROOM', label: 'Private Dining VIP' },
            { id: 'OMAKASE_BAR', label: 'Chef Counter Bar' },
            { id: 'PATIO_TERRACE', label: 'Patio & Terrace' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSection === sec.id
                  ? 'bg-[#0b57d0] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Status Count Pills & Add Table Button */}
        <div className="flex items-center gap-3 flex-wrap justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs font-sans">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {stats.available} Available
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {stats.ordering} Active Order
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {stats.occupied} Seated
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {stats.reserved} Reserved
            </span>
          </div>

          <button
            onClick={() => setIsAddingTable(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#0b57d0] hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Table</span>
          </button>
        </div>
      </div>

      {/* Interactive Tables Floor Plan Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTables.map((tbl) => {
          const colors = getStatusColor(tbl.status);
          const isOccupied = tbl.status === 'OCCUPIED' || tbl.status === 'ORDERING';

          return (
            <div
              key={tbl.table_id}
              className={`bg-white rounded-xl p-5 border transition-all duration-200 flex flex-col justify-between min-h-[200px] shadow-2xs hover:shadow-md hover:border-blue-400 group ${colors.border}`}
            >
              {/* Header: Table Title & Status Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                      Table {tbl.table_number.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      #{tbl.table_id.slice(-4)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {tbl.section?.replace('_', ' ') || 'MAIN DINING'}
                  </span>
                </div>

                <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border ${colors.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  <span>{tbl.status || 'AVAILABLE'}</span>
                </div>
              </div>

              {/* Table Body Specs */}
              <div className="my-3 py-2 px-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Capacity:</span>
                  <strong className="text-slate-900 font-semibold">{tbl.number_of_guests} Guests</strong>
                </div>

                {tbl.current_order_id && (
                  <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Order Active</span>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onSelectTableForOrder(tbl)}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isOccupied ? 'Manage Order' : 'Take Order'}</span>
                </button>

                {tbl.current_order_id && (
                  <button
                    onClick={() => onNavigateToInvoice(tbl.current_order_id!)}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-600 transition-colors"
                    title="View & Settle Bill"
                  >
                    <Receipt className="w-4 h-4" />
                  </button>
                )}

                {/* Status Switcher Quick Menu */}
                <select
                  value={tbl.status || 'AVAILABLE'}
                  onChange={(e) => onUpdateTableStatus(tbl.table_id, e.target.value as TableStatus)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1 font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="ORDERING">Ordering</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="RESERVED">Reserved</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Table Modal */}
      {isAddingTable && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Configure New Dining Table</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Table Number:
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newTableNum}
                  onChange={(e) => setNewTableNum(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Guest Seating Capacity:
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={newTableSeats}
                  onChange={(e) => setNewTableSeats(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Dining Room Section:
                </label>
                <select
                  value={newTableSection}
                  onChange={(e) => setNewTableSection(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="MAIN_DINING">Main Dining Hall</option>
                  <option value="TATAMI_ROOM">Private Dining VIP</option>
                  <option value="OMAKASE_BAR">Chef Counter Bar</option>
                  <option value="PATIO_TERRACE">Patio & Terrace</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingTable(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0b57d0] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  Save Table (POST /tables)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
