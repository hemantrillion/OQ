'use client';

import React, { useState } from 'react';
import { Language, BusinessProfile } from '@/lib/booking-types';
import { t } from '@/lib/translations';
import { LivingWaterOrb } from '@/components/ai/LivingWaterOrb';

interface Props {
  language: Language;
  business: BusinessProfile;
  onNavigateToSlots: () => void;
  onOpenCreateSlot: () => void;
  onOpenAiChat: () => void;
  onConfigureNewBusiness: (venture: { name: string; sector: string; address: string }) => void;
}

export const OwnerHomeView: React.FC<Props> = ({
  language,
  business,
  onNavigateToSlots,
  onOpenCreateSlot,
  onOpenAiChat,
  onConfigureNewBusiness,
}) => {
  const [isVentureModalOpen, setIsVentureModalOpen] = useState(false);
  const [ventureName, setVentureName] = useState('');
  const [ventureSector, setVentureSector] = useState('Dental Clinic');
  const [ventureAddress, setVentureAddress] = useState('');

  const handleVentureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ventureName.trim()) return;
    onConfigureNewBusiness({
      name: ventureName,
      sector: ventureSector,
      address: ventureAddress,
    });
    setIsVentureModalOpen(false);
    setVentureName('');
    setVentureAddress('');
  };

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-16 gap-12 max-w-7xl mx-auto w-full select-none">
      {/* 1. ATMOSPHERIC HERO DISPLAY WITH LIVING WATER ORB */}
      <section className="relative rounded-3xl overflow-hidden p-8 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl border border-white/10">
        {/* Real Ambient Photographic Background Texture with Dark Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter contrast-125"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1600&auto=format&fit=crop")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090d16] via-[#090d16]/90 to-transparent" />

        <div className="relative z-10 space-y-4 max-w-2xl text-center md:text-left">
          <div className="text-xs uppercase tracking-widest text-sky-400 font-bold">
            {language === 'hi' ? 'संचालक केंद्र' : 'Operator Hub'}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t(language, 'frontHeroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
            {t(language, 'frontHeroSub')}
          </p>
          <p className="text-sm text-sky-300/90 font-medium pt-2">
            {t(language, 'aiPromptHint')}
          </p>
        </div>

        {/* THE SOLE LIVING WATER ORB (AI ASSISTANT) */}
        <div className="relative z-10 flex flex-col items-center gap-3 shrink-0">
          <LivingWaterOrb size={140} onClick={onOpenAiChat} />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            {language === 'hi' ? 'संवाद शुरू करें' : 'AI Assistant'}
          </span>
        </div>
      </section>

      {/* 2. DYNAMIC STAGGERED / DIAGONAL ACTION SUITE */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight pb-2">
          {language === 'hi' ? 'त्वरित संचालन' : 'Operational Actions'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Action 1: My Slots (Tilted / Offset Elevation) */}
          <div
            onClick={onNavigateToSlots}
            className="display-card rounded-3xl p-8 cursor-pointer hover:border-sky-400 transition-all transform hover:-translate-y-1.5 shadow-xl flex flex-col justify-between h-72 border border-white/10 group relative overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop")',
              }}
            />
            <div className="relative z-10 space-y-2">
              <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">
                01 • {language === 'hi' ? 'अवलोकन' : 'Inspection'}
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
                {t(language, 'actionMySlots')}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed pt-1">
                {t(language, 'actionMySlotsSub')}
              </p>
            </div>
            <div className="relative z-10 text-xs uppercase tracking-wider text-sky-400 font-bold group-hover:underline">
              {language === 'hi' ? 'स्लॉट तालिका खोलें →' : 'Enter Slots Desk →'}
            </div>
          </div>

          {/* Action 2: Create Slot (Shifted Staggered Elevation) */}
          <div
            onClick={onOpenCreateSlot}
            className="display-card rounded-3xl p-8 cursor-pointer hover:border-sky-400 transition-all transform md:translate-y-4 hover:translate-y-2 shadow-xl flex flex-col justify-between h-72 border border-white/10 group relative overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop")',
              }}
            />
            <div className="relative z-10 space-y-2">
              <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">
                02 • {language === 'hi' ? 'प्रकाशन' : 'Publishing'}
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
                {t(language, 'actionCreateSlot')}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed pt-1">
                {t(language, 'actionCreateSlotSub')}
              </p>
            </div>
            <div className="relative z-10 text-xs uppercase tracking-wider text-sky-400 font-bold group-hover:underline">
              {language === 'hi' ? 'नया स्लॉट प्रकाशित करें →' : 'Publish Operating Window →'}
            </div>
          </div>

          {/* Action 3: New Venture / Naya Rozgar (Shifted Staggered Elevation) */}
          <div
            onClick={() => setIsVentureModalOpen(true)}
            className="display-card rounded-3xl p-8 cursor-pointer hover:border-sky-400 transition-all transform md:translate-y-8 hover:translate-y-6 shadow-xl flex flex-col justify-between h-72 border border-white/10 group relative overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=600&auto=format&fit=crop")',
              }}
            />
            <div className="relative z-10 space-y-2">
              <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">
                03 • {language === 'hi' ? 'विस्तार' : 'Expansion'}
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
                {t(language, 'actionNewBusiness')}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed pt-1">
                {t(language, 'actionNewBusinessSub')}
              </p>
            </div>
            <div className="relative z-10 text-xs uppercase tracking-wider text-sky-400 font-bold group-hover:underline">
              {language === 'hi' ? 'नया रोज़गार जोड़ें →' : 'Configure New Venture →'}
            </div>
          </div>
        </div>
      </section>

      {/* NEW VENTURE (NAYA ROZGAR) MODAL */}
      {isVentureModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 select-none">
          <div className="display-canvas max-w-lg w-full rounded-3xl p-8 space-y-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-2xl font-bold text-white">
                {t(language, 'newVentureTitle')}
              </h3>
              <button
                onClick={() => setIsVentureModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVentureSubmit} className="space-y-5 text-sm">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  {t(language, 'ventureNameLabel')}
                </label>
                <input
                  type="text"
                  value={ventureName}
                  onChange={(e) => setVentureName(e.target.value)}
                  placeholder="e.g. City Dental Care or Apex Technical Repair"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  {t(language, 'ventureSectorLabel')}
                </label>
                <select
                  value={ventureSector}
                  onChange={(e) => setVentureSector(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                >
                  <option value="Medical Clinic" className="bg-slate-900 text-white">Medical Clinic & Doctor Practice</option>
                  <option value="Salon & Grooming" className="bg-slate-900 text-white">Salon & Executive Grooming</option>
                  <option value="Dining & Bistro" className="bg-slate-900 text-white">Restaurant, Dining & Cafe</option>
                  <option value="Electronics Repair" className="bg-slate-900 text-white">Technical Repair & Device Lab</option>
                  <option value="Professional Services" className="bg-slate-900 text-white">General Professional Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                  {t(language, 'ventureLocationLabel')}
                </label>
                <input
                  type="text"
                  value={ventureAddress}
                  onChange={(e) => setVentureAddress(e.target.value)}
                  placeholder="Civic address or suite number"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide transition-all mt-4"
              >
                {t(language, 'saveVentureBtn')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
