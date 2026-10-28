'use client';

import React, { useState } from 'react';
import { Language, SchemaTable, RelationshipLink } from '@/lib/booking-types';
import { SCHEMA_TABLES, SCHEMA_RELATIONSHIPS } from '@/lib/booking-data';
import { t } from '@/lib/translations';
import {
  Database,
  GitFork,
  ChevronDown,
  ChevronRight,
  Key,
  Link as LinkIcon,
  Layers,
  ArrowRight,
  Shield,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

interface Props {
  language: Language;
}

export const OwnerBlueprintView: React.FC<Props> = ({ language }) => {
  const [activeSubView, setActiveSubView] = useState<'TABLES' | 'RELATIONSHIPS'>('TABLES');
  const [expandedTableId, setExpandedTableId] = useState<string | null>('tbl_businesses');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const toggleTableExpand = (tableId: string) => {
    setExpandedTableId(expandedTableId === tableId ? null : tableId);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-6 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Top Banner with Dual-View Switcher */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              {t(language, 'blueprintTitle')}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(language, 'blueprintSub')}
          </p>
        </div>

        {/* View Switcher: Stacked Tables vs 2D Key Map */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveSubView('TABLES')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubView === 'TABLES'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{t(language, 'subviewTable')}</span>
          </button>

          <button
            onClick={() => setActiveSubView('RELATIONSHIPS')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubView === 'RELATIONSHIPS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t(language, 'subviewRelationship')}</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: TABLE VIEW (ONE BELOW OTHER, EXPANDABLE) */}
      {activeSubView === 'TABLES' && (
        <div className="space-y-3.5">
          {SCHEMA_TABLES.map((table) => {
            const isExpanded = expandedTableId === table.id;

            return (
              <div
                key={table.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Table Header Bar */}
                <div
                  onClick={() => toggleTableExpand(table.id)}
                  className="p-4 md:p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-mono font-bold text-xs">
                      SQL
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {table.name}
                        </span>
                        <span className="text-xs text-slate-500 font-sans">
                          ({table.hindiName})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {language === 'hi' ? table.hindiDescription : table.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 hidden sm:inline-block">
                      {table.fields.length} Fields
                    </span>
                    <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-500">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Fields List */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50/40 p-4 md:p-5 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Field Name</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Key Type</th>
                          <th className="py-2.5 px-3">Relational Joins</th>
                          <th className="py-2.5 px-3">Purpose & Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-700 font-mono text-[11px]">
                        {table.fields.map((field) => (
                          <tr key={field.name} className="hover:bg-white transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-900">
                              {field.name}
                            </td>
                            <td className="py-2.5 px-3 text-blue-700">{field.type}</td>
                            <td className="py-2.5 px-3">
                              {field.isPrimary && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-300 font-bold text-[10px]">
                                  <Key className="w-2.5 h-2.5" />
                                  PK
                                </span>
                              )}
                              {field.isForeign && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-300 font-bold text-[10px]">
                                  <LinkIcon className="w-2.5 h-2.5" />
                                  FK
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 font-sans">
                              {field.refTable ? (
                                <span className="text-indigo-600 font-medium">
                                  → {field.refTable}.id
                                </span>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-sans text-slate-600">
                              {field.description}
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

      {/* SUB-VIEW 2: KEY & RELATIONSHIP VIEW (2D OPEN SCROLLABLE CANVAS WITH CONNECTING ARROWS) */}
      {activeSubView === 'RELATIONSHIPS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Canvas Controls Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">
                Interactive 2D Relational Diagram
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">
                Pan & scroll to examine foreign key join vectors
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] text-slate-500 px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs ml-1"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2D Drag/Scroll Canvas */}
          <div className="h-[620px] overflow-auto bg-[#f8fafc] relative p-8 select-none">
            {/* Background Dots Pattern */}
            <svg
              className="absolute inset-0 w-[1400px] h-[900px] opacity-40 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="#94a3b8" />
                </pattern>
                {/* Arrowhead Marker */}
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#2563eb" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotGrid)" />

              {/* Connecting Relational Lines & Arrows */}
              {/* businesses (40,50) -> locations (380,50) */}
              <path
                d="M 280 120 C 330 120, 340 120, 380 120"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                markerEnd="url(#arrow)"
                strokeDasharray="4 2"
              />

              {/* businesses (40,50) -> services (40,350) */}
              <path
                d="M 160 210 C 160 260, 160 300, 160 350"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                markerEnd="url(#arrow)"
                strokeDasharray="4 2"
              />

              {/* locations (380,50) -> slots (720,50) */}
              <path
                d="M 620 120 C 670 120, 680 120, 720 120"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                markerEnd="url(#arrow)"
                strokeDasharray="4 2"
              />

              {/* slots (720,50) -> appointments (380,350) */}
              <path
                d="M 720 180 C 600 240, 550 300, 500 350"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />

              {/* services (40,350) -> appointments (380,350) */}
              <path
                d="M 280 420 C 330 420, 340 420, 380 420"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />

              {/* appointments (380,350) -> earnings (720,350) */}
              <path
                d="M 620 420 C 670 420, 680 420, 720 420"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
            </svg>

            {/* Rendered Table Node Cards on the 2D plane */}
            <div
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
              className="relative w-[1100px] h-[750px] transition-transform duration-100"
            >
              {SCHEMA_TABLES.map((table) => (
                <div
                  key={table.id}
                  style={{ left: `${table.position.x}px`, top: `${table.position.y}px` }}
                  className="absolute w-[240px] bg-white border border-slate-300 rounded-lg shadow-md overflow-hidden text-xs"
                >
                  {/* Node Header */}
                  <div className="bg-slate-900 text-white px-3 py-2 font-mono font-bold flex items-center justify-between">
                    <span>{table.name}</span>
                    <span className="text-[10px] text-blue-300 font-sans">
                      {table.hindiName.split(' ')[0]}
                    </span>
                  </div>

                  {/* Node Fields List */}
                  <div className="divide-y divide-slate-100 p-2 space-y-1">
                    {table.fields.slice(0, 5).map((f) => (
                      <div
                        key={f.name}
                        className="flex items-center justify-between font-mono text-[11px] py-0.5"
                      >
                        <div className="flex items-center gap-1 truncate">
                          {f.isPrimary && (
                            <span className="text-[9px] px-1 bg-amber-100 text-amber-800 font-bold rounded">
                              PK
                            </span>
                          )}
                          {f.isForeign && (
                            <span className="text-[9px] px-1 bg-indigo-100 text-indigo-800 font-bold rounded">
                              FK
                            </span>
                          )}
                          <span className="text-slate-800 truncate">{f.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate">
                          {f.type.split('(')[0]}
                        </span>
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
