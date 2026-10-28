'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/booking-types';
import { SCHEMA_TABLES } from '@/lib/booking-data';
import { t } from '@/lib/translations';

interface Props {
  language: Language;
}

export const OwnerBlueprintView: React.FC<Props> = ({ language }) => {
  const [activeSubView, setActiveSubView] = useState<'TABLES' | 'RELATIONSHIPS'>('TABLES');
  const [expandedTableId, setExpandedTableId] = useState<string | null>('tbl_businesses');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const toggleTable = (id: string) => {
    setExpandedTableId(expandedTableId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Blueprint Subview Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {t(language, 'dataArchitectureTitle')}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {t(language, 'dataArchitectureSub')}
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-full border border-white/10">
          <button
            onClick={() => setActiveSubView('TABLES')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeSubView === 'TABLES'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t(language, 'subviewTable')}
          </button>
          <button
            onClick={() => setActiveSubView('RELATIONSHIPS')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeSubView === 'RELATIONSHIPS'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t(language, 'subviewRelationship')}
          </button>
        </div>
      </div>

      {/* SUBVIEW 1: TABLES ONE BELOW ANOTHER (EXPANDABLE) */}
      {activeSubView === 'TABLES' && (
        <div className="space-y-4">
          {SCHEMA_TABLES.map((table) => {
            const isExpanded = expandedTableId === table.id;

            return (
              <div
                key={table.id}
                className="display-card rounded-2xl overflow-hidden transition-all"
              >
                <div
                  onClick={() => toggleTable(table.id)}
                  className="p-6 cursor-pointer flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold font-mono text-white">
                        {table.name}
                      </span>
                      <span className="text-sm text-slate-400 font-sans">
                        ({table.hindiName})
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mt-1">
                      {language === 'hi' ? table.hindiDescription : table.description}
                    </p>
                  </div>

                  <div className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 shrink-0">
                    {table.fields.length} columns • {isExpanded ? 'Hide' : 'Expand'}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-white/10 p-6 bg-black/20 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-xs uppercase tracking-wider text-slate-400 border-b border-white/10 pb-2">
                        <tr>
                          <th className="py-3 px-3">Column</th>
                          <th className="py-3 px-3">Type</th>
                          <th className="py-3 px-3">Key</th>
                          <th className="py-3 px-3">Relation</th>
                          <th className="py-3 px-3">Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300 font-mono text-xs">
                        {table.fields.map((f) => (
                          <tr key={f.name}>
                            <td className="py-3 px-3 font-bold text-white">{f.name}</td>
                            <td className="py-3 px-3 text-sky-400">{f.type}</td>
                            <td className="py-3 px-3">
                              {f.isPrimary && (
                                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                                  PRIMARY
                                </span>
                              )}
                              {f.isForeign && (
                                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                                  FOREIGN
                                </span>
                              )}
                              {!f.isPrimary && !f.isForeign && '—'}
                            </td>
                            <td className="py-3 px-3 text-slate-400 font-sans">
                              {f.refTable ? `→ ${f.refTable}.id` : '—'}
                            </td>
                            <td className="py-3 px-3 text-slate-300 font-sans text-xs">
                              {f.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SUBVIEW 2: OPEN 2D SCROLLABLE MAP WITH ARROWS */}
      {activeSubView === 'RELATIONSHIPS' && (
        <div className="display-card rounded-3xl overflow-hidden border border-white/10">
          <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>2D Relational Topology & Key Traversal</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white font-mono"
              >
                –
              </button>
              <span className="font-mono text-white">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white font-mono"
              >
                +
              </button>
            </div>
          </div>

          <div className="h-[600px] overflow-auto relative p-8 select-none bg-black/40">
            {/* SVG Connecting Vectors */}
            <svg
              className="absolute inset-0 w-[1300px] h-[850px] pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker
                  id="relArrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
                </marker>
              </defs>

              {/* businesses -> locations */}
              <path
                d="M 280 120 C 330 120, 340 120, 380 120"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                markerEnd="url(#relArrow)"
              />
              {/* businesses -> services */}
              <path
                d="M 160 210 C 160 260, 160 300, 160 350"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                markerEnd="url(#relArrow)"
              />
              {/* locations -> slots */}
              <path
                d="M 620 120 C 670 120, 680 120, 720 120"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                markerEnd="url(#relArrow)"
              />
              {/* slots -> appointments */}
              <path
                d="M 720 180 C 600 240, 550 300, 500 350"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                markerEnd="url(#relArrow)"
              />
              {/* services -> appointments */}
              <path
                d="M 280 420 C 330 420, 340 420, 380 420"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                markerEnd="url(#relArrow)"
              />
              {/* appointments -> earnings */}
              <path
                d="M 620 420 C 670 420, 680 420, 720 420"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                markerEnd="url(#relArrow)"
              />
            </svg>

            {/* Table Nodes */}
            <div
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
              className="relative w-[1100px] h-[750px]"
            >
              {SCHEMA_TABLES.map((table) => (
                <div
                  key={table.id}
                  style={{ left: `${table.position.x}px`, top: `${table.position.y}px` }}
                  className="absolute w-[250px] display-canvas rounded-2xl overflow-hidden border border-white/15 shadow-xl text-xs"
                >
                  <div className="bg-white/10 px-4 py-3 font-mono font-bold text-white flex items-center justify-between border-b border-white/10">
                    <span>{table.name}</span>
                    <span className="text-[10px] text-sky-400 font-sans">{table.hindiName.split(' ')[0]}</span>
                  </div>

                  <div className="p-3 space-y-1.5 font-mono text-[11px]">
                    {table.fields.slice(0, 5).map((f) => (
                      <div key={f.name} className="flex items-center justify-between py-0.5">
                        <span className={f.isPrimary ? 'text-amber-300 font-bold' : f.isForeign ? 'text-sky-300' : 'text-slate-300'}>
                          {f.name} {f.isPrimary ? '(PK)' : f.isForeign ? '(FK)' : ''}
                        </span>
                        <span className="text-slate-500">{f.type.split('(')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
