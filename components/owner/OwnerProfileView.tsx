'use client';

import React from 'react';
import { Language, BusinessProfile } from '@/lib/booking-types';
import { t } from '@/lib/translations';
import {
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Layers,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';

interface Props {
  language: Language;
  business: BusinessProfile;
  onSwitchToCustomer: () => void;
}

export const OwnerProfileView: React.FC<Props> = ({
  language,
  business,
  onSwitchToCustomer,
}) => {
  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-6 max-w-5xl mx-auto w-full overflow-y-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {business.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {business.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {business.ownerName} • {business.sector.replace('_', ' ')}
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchToCustomer}
          className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
        >
          <User className="w-3.5 h-3.5 text-slate-600" />
          <span>{t(language, 'switchToCustomer')}</span>
        </button>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact & Structure Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Enterprise & Contact Information
          </h3>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Structure
              </span>
              <span className="font-semibold text-slate-900">{business.businessType}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Work Email
              </span>
              <span className="font-mono text-slate-900">{business.email}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
              </span>
              <span className="font-mono text-slate-900">{business.phone}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verification Status
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                Verified Business
              </span>
            </div>
          </div>
        </div>

        {/* Operating Stations & Locations */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Configured Operating Locations ({business.locations.length})
          </h3>

          <div className="space-y-2.5">
            {business.locations.map((loc, idx) => (
              <div
                key={loc.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start gap-2.5 text-xs"
              >
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">
                    {loc.name} {loc.isPrimary && <span className="text-[10px] text-blue-600 font-normal">(Primary Station)</span>}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{loc.address}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Catalogue */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Registered Service Catalogue ({business.services.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {business.services.map((srv) => (
            <div
              key={srv.id}
              className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-2xs space-y-1.5 text-xs"
            >
              <div className="font-bold text-slate-900 leading-snug">
                {language === 'hi' && srv.hindiName ? srv.hindiName : srv.name}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500">{srv.durationMinutes} mins</span>
                <span className="font-bold text-slate-900 font-mono text-sm">₹{srv.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
