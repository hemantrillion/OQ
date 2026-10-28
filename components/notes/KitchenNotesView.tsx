'use client';

import React, { useState } from 'react';
import { Note } from '@/lib/types';
import {
  ClipboardList,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface KitchenNotesViewProps {
  notes: Note[];
  onAddNote: (note: Partial<Note>) => Promise<void>;
  onUpdateNote: (noteId: string, note: Partial<Note>) => Promise<void>;
}

export const KitchenNotesView: React.FC<KitchenNotesViewProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<any>('NORMAL');

  const filteredNotes = notes.filter((n) => {
    if (filterPriority === 'ALL') return true;
    return (n.priority || 'NORMAL') === filterPriority;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !text) return;

    await onAddNote({
      title,
      text,
      priority,
    });

    setIsAddOpen(false);
    setTitle('');
    setText('');
  };

  const getPriorityStyle = (pri?: string) => {
    switch (pri) {
      case 'ALLERGY_ALERT':
        return {
          bg: 'bg-rose-50/60 border-rose-200',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
        };
      case 'URGENT':
        return {
          bg: 'bg-amber-50/60 border-amber-200',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
        };
      case 'NORMAL':
      default:
        return {
          bg: 'bg-white border-slate-200/90',
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col p-5 lg:p-6 gap-6 bg-[#f1f5f9] overflow-y-auto font-sans">
      {/* Top Banner matching NEW PROJECT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <span>Kitchen Directives & Allergy Notices Board</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational notes routed between dining room staff and kitchen brigade (Go Gin: <code className="text-blue-700 font-mono">/notes</code>)
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-3.5 py-1.5 rounded-lg bg-[#0b57d0] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Kitchen Note</span>
        </button>
      </div>

      {/* Priority Filters */}
      <div className="flex items-center gap-2">
        {(['ALL', 'ALLERGY_ALERT', 'URGENT', 'NORMAL'] as const).map((pri) => (
          <button
            key={pri}
            onClick={() => setFilterPriority(pri)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterPriority === pri
                ? 'bg-[#0b57d0] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {pri === 'ALL' ? 'All Directives' : pri.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredNotes.map((note) => {
          const style = getPriorityStyle(note.priority);

          return (
            <div
              key={note.note_id}
              className={`rounded-xl p-5 border flex flex-col justify-between shadow-2xs hover:shadow-md transition-all ${style.bg}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${style.badge}`}>
                    {note.priority?.replace('_', ' ') || 'NORMAL'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-1">
                  {note.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {note.text}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Ref: #{note.note_id.slice(-4)}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active on Display
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Note Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Dispatch Kitchen Directive (Go POST /notes)</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Directive Header / Table Reference:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 2: Gluten Sensitivity Notice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Priority Flag:
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="NORMAL">Standard Notice</option>
                  <option value="ALLERGY_ALERT">Critical Allergy Alert</option>
                  <option value="URGENT">Urgent Rush Directive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Directive Body / Preparation Instructions:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed cooking or plating instructions..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0b57d0] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  Publish Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
