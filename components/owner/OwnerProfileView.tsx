'use client';

import React from 'react';
import { Language, BusinessProfile } from '@/lib/booking-types';
import { t } from '@/lib/translations';
import { OwnerBlueprintView } from './OwnerBlueprintView';

interface Props {
  language: Language;
  business: BusinessProfile;
  onSwitchToCustomer: () => void;
  onRevisitOnboarding?: () => void;
}

export const OwnerProfileView: React.FC<Props> = ({
  language,
  business,
  onSwitchToCustomer,
  onRevisitOnboarding,
}) => {
  return (
    <div className="flex-1 flex flex-col p-6 lg:p-12 gap-12 max-w-7xl mx-auto w-full select-none">
      {/* 1. OPERATOR IDENTITY SECTION */}
      <section className="display-card rounded-3xl p-8 lg:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {business.ownerName}
            </h2>
            <p className="text-base text-slate-400 mt-1">
              {business.sector.replace('_', ' ')} • {business.businessType}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onSwitchToCustomer}
              className="w-40 py-2.5 rounded-full border border-sky-400/40 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-bold tracking-wide transition-all text-center"
            >
              {t(language, 'customerPortal')}
            </button>

            {onRevisitOnboarding && (
              <button
                onClick={onRevisitOnboarding}
                className="w-48 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold tracking-wide transition-all text-center"
              >
                {language === 'hi' ? 'ऑनबोर्डिंग प्रवाह देखें' : 'View Onboarding Flow'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              {language === 'hi' ? 'सम्पर्क पहचान' : 'Contact Identifier'}
            </span>
            <div className="text-base text-white font-mono">{business.phone}</div>
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              {language === 'hi' ? 'सिंक ईमेल' : 'Sync Email'}
            </span>
            <div className="text-base text-white font-mono">{business.email}</div>
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              {language === 'hi' ? 'सक्रिय केंद्र' : 'Operational Scope'}
            </span>
            <div className="text-base text-white">
              {business.locations.length}{' '}
              {language === 'hi' ? 'केंद्र कॉन्फ़िगर किए गए' : 'Stations Configured'}
            </div>
          </div>
        </div>
      </section>

      {/* 2. OPERATING STATIONS & CATALOGUE */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="display-card rounded-3xl p-8 space-y-4">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {language === 'hi' ? 'पंजीकृत कार्य केंद्र' : 'Registered Operating Stations'}
          </h3>
          <div className="space-y-3">
            {business.locations.map((loc) => (
              <div key={loc.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <div className="font-bold text-white text-base">
                  {loc.name}{' '}
                  {loc.isPrimary && (
                    <span className="text-xs text-sky-400 font-normal">
                      • {language === 'hi' ? 'मुख्य' : 'Primary'}
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-400">{loc.address}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="display-card rounded-3xl p-8 space-y-4">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {language === 'hi' ? 'सक्रिय सेवा शुल्क सूची' : 'Active Tariff Catalogue'}
          </h3>
          <div className="space-y-3">
            {business.services.map((srv) => (
              <div key={srv.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-base">
                    {language === 'hi' && srv.hindiName ? srv.hindiName : srv.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {srv.durationMinutes} {language === 'hi' ? 'मिनट' : 'minutes'}
                  </div>
                </div>
                <div className="text-lg font-mono font-bold text-white">₹{srv.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DATA & SCHEMA ARCHITECTURE (INSIDE PROFILE AS DIRECTED!) */}
      <section className="display-canvas rounded-3xl p-8 lg:p-10 border border-white/10">
        <OwnerBlueprintView language={language} />
      </section>
    </div>
  );
};
