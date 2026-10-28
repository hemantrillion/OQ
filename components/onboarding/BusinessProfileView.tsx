'use client';

import React, { useState } from 'react';
import {
  Language,
  BusinessProfile,
  BusinessType,
  BusinessSector,
} from '@/lib/booking-types';
import { t } from '@/lib/translations';

interface Props {
  language: Language;
  onProfileCompleted: (profile: Partial<BusinessProfile>) => void;
  onBack: () => void;
  onQuickEnterRajesh?: () => void;
}

export const BusinessProfileView: React.FC<Props> = ({
  language,
  onProfileCompleted,
  onBack,
  onQuickEnterRajesh,
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
    <div className="min-h-screen flex flex-col justify-between p-6 lg:p-16 select-none bg-[#090d16] text-white">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-4xl mx-auto w-full">
        <div>
          <div className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-none">
            {t(language, 'appName')}
          </div>
          <div className="text-sm md:text-base text-slate-400 font-medium tracking-wide mt-2">
            {language === 'hi' ? 'चरण 4 / 4 • व्यवसाय विवरण' : 'Step 4 of 4 • Business Profile Details'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 text-xs md:text-sm font-bold transition-all"
          >
            {language === 'hi' ? 'पीछे' : 'Back'}
          </button>

          {onQuickEnterRajesh && (
            <button
              onClick={onQuickEnterRajesh}
              className="px-4 py-2.5 rounded-full border border-sky-400/30 hover:border-sky-400 bg-sky-500/10 text-sky-300 text-xs md:text-sm font-bold transition-all hidden sm:inline-block"
            >
              {language === 'hi' ? 'राजेश डेस्क' : 'Rajesh Desk'}
            </button>
          )}
        </div>
      </header>

      {/* Main Details Card */}
      <main className="max-w-2xl w-full mx-auto my-10">
        <div className="display-canvas rounded-3xl p-8 lg:p-12 space-y-8 border border-white/10 shadow-2xl">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {t(language, 'profileSetupTitle')}
            </h1>
            <p className="text-sm md:text-base text-slate-400">
              {t(language, 'profileSetupSub')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Entity Type / Structure */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                {t(language, 'entityTypeLabel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBusinessType('INDIVIDUAL')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    businessType === 'INDIVIDUAL'
                      ? 'border-sky-400 bg-sky-500/15 shadow-md'
                      : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold text-white text-base">
                    {language === 'hi' ? 'व्यक्तिगत / एकल' : 'Individual / Solo'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {language === 'hi'
                      ? 'एकल पेशेवर, नाई, डॉक्टर, निजी सलाहकार'
                      : '1-chair barber, single doctor, private consultant'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBusinessType('COMPANY')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    businessType === 'COMPANY'
                      ? 'border-sky-400 bg-sky-500/15 shadow-md'
                      : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold text-white text-base">
                    {language === 'hi' ? 'कंपनी / संस्थान' : 'Company / Enterprise'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {language === 'hi'
                      ? 'मल्टी-स्टाफ सैलून, क्लिनिक सेंटर, रेस्टोरेंट'
                      : 'Multi-staff salon, clinic center, studio network'}
                  </div>
                </button>
              </div>
            </div>

            {/* Business / Venture Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {t(language, 'businessNameLabel')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t(language, 'businessNamePlaceholder')}
                required
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* Owner / Practitioner Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {t(language, 'ownerNameLabel')}
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder={t(language, 'ownerNamePlaceholder')}
                required
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* Sector / Trade */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {t(language, 'sectorLabel')}
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as BusinessSector)}
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:border-sky-400"
              >
                <option value="BARBER_SALON" className="bg-slate-900 text-white">{t(language, 'sectorBarber')}</option>
                <option value="CLINIC_DOCTOR" className="bg-slate-900 text-white">{t(language, 'sectorClinic')}</option>
                <option value="RESTAURANT_CAFE" className="bg-slate-900 text-white">{t(language, 'sectorRestaurant')}</option>
                <option value="REPAIR_SERVICE" className="bg-slate-900 text-white">{t(language, 'sectorRepair')}</option>
                <option value="GENERAL" className="bg-slate-900 text-white">{t(language, 'sectorGeneral')}</option>
              </select>
            </div>

            {/* Primary Station Civic Address */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {t(language, 'primaryLocationLabel')}
              </label>
              <input
                type="text"
                value={primaryAddress}
                onChange={(e) => setPrimaryAddress(e.target.value)}
                placeholder={t(language, 'primaryLocationPlaceholder')}
                required
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-base focus:outline-none focus:border-sky-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base md:text-lg tracking-wide transition-all shadow-lg shadow-sky-500/20 mt-4"
            >
              {t(language, 'finishSetupBtn')}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs md:text-sm text-slate-500 max-w-4xl mx-auto w-full">
        Deslot Platform • Real-time Operations & Booking Architecture
      </footer>
    </div>
  );
};
