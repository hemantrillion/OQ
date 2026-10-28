'use client';

import React, { useState } from 'react';
import {
  Language,
  BusinessProfile,
  BusinessType,
  BusinessSector,
} from '@/lib/booking-types';
import { t } from '@/lib/translations';
import {
  Store,
  User,
  MapPin,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Shield,
  Layers,
} from 'lucide-react';

interface Props {
  language: Language;
  onProfileCompleted: (profile: Partial<BusinessProfile>) => void;
  onBack: () => void;
}

export const BusinessProfileView: React.FC<Props> = ({
  language,
  onProfileCompleted,
  onBack,
}) => {
  const [businessType, setBusinessType] = useState<BusinessType>('INDIVIDUAL');
  const [name, setName] = useState('Modern Cuts Grooming Studio');
  const [ownerName, setOwnerName] = useState('Rajesh Sharma');
  const [sector, setSector] = useState<BusinessSector>('BARBER_SALON');
  const [primaryAddress, setPrimaryAddress] = useState(
    'Shop 14, Galaxy Arcade, MG Road, Pune'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileCompleted({
      name,
      ownerName,
      sector,
      businessType,
      locations: [
        {
          id: 'loc_main',
          name: `${name} (Main Station)`,
          address: primaryAddress,
          city: 'Pune',
          lat: 18.5204,
          lng: 73.8567,
          isPrimary: true,
        },
      ],
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <span className="text-[11px] font-mono text-slate-400">Step 4 of 4</span>
        </div>

        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            {t(language, 'profileSetupTitle')}
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {t(language, 'profileSetupSub')}
          </p>
        </div>

        {/* AI Privacy & Configuration Scope Pill */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {language === 'hi'
              ? 'गोपनीयता नीति: हमारा एआई इंजन केवल इस व्यावसायिक प्रोफ़ाइल को पढ़ता है ताकि आपकी डेटा संरचना तैयार कर सके। आपके ग्राहकों का निजी डेटा कभी एआई के साथ साझा नहीं होता।'
              : 'Data Boundary: The AI engine reads only this profile structure to write the schema config file. Private customer records and live transactions remain strictly isolated.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Business Structure */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              {t(language, 'entityTypeLabel')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBusinessType('INDIVIDUAL')}
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  businessType === 'INDIVIDUAL'
                    ? 'border-blue-600 bg-blue-50/70 text-slate-900 font-medium ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <div className="font-semibold text-slate-900">Individual / Solo</div>
                <div className="text-[11px] text-slate-500 mt-0.5">1-chair barber, single doctor, private tutor</div>
              </button>

              <button
                type="button"
                onClick={() => setBusinessType('COMPANY')}
                className={`p-3 rounded-lg border text-left text-xs transition-all ${
                  businessType === 'COMPANY'
                    ? 'border-blue-600 bg-blue-50/70 text-slate-900 font-medium ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <div className="font-semibold text-slate-900">Company / Enterprise</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Multi-staff salon, clinic center, restaurant</div>
              </button>
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              {t(language, 'businessNameLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t(language, 'businessNamePlaceholder')}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Owner / Practitioner Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              {t(language, 'ownerNameLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder={t(language, 'ownerNamePlaceholder')}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Sector / Profession */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              {t(language, 'sectorLabel')}
            </label>
            <div className="relative">
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as BusinessSector)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="BARBER_SALON">{t(language, 'sectorBarber')}</option>
                <option value="CLINIC_DOCTOR">{t(language, 'sectorClinic')}</option>
                <option value="RESTAURANT_CAFE">{t(language, 'sectorRestaurant')}</option>
                <option value="REPAIR_SERVICE">{t(language, 'sectorRepair')}</option>
                <option value="GENERAL">{t(language, 'sectorGeneral')}</option>
              </select>
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Primary Operating Location */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              {t(language, 'primaryLocationLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={primaryAddress}
                onChange={(e) => setPrimaryAddress(e.target.value)}
                placeholder={t(language, 'primaryLocationPlaceholder')}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all pt-3"
          >
            <span>{t(language, 'finishSetupBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
