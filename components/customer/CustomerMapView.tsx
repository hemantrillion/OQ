'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/booking-types';
import { MAP_BUSINESSES, MapBusiness } from '@/lib/booking-data';
import { t } from '@/lib/translations';

interface Props {
  language: Language;
  onSwitchToOwner: () => void;
  onToggleLanguage: () => void;
}

export const CustomerMapView: React.FC<Props> = ({
  language,
  onSwitchToOwner,
  onToggleLanguage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<MapBusiness | null>(
    MAP_BUSINESSES[0]
  );
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedWindow, setSelectedWindow] = useState('11:00 AM');
  const [selectedService, setSelectedService] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const filtered = MAP_BUSINESSES.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenBooking = (biz: MapBusiness) => {
    setSelectedBusiness(biz);
    setSelectedService(biz.popularServices[0].name);
    setBookingModalOpen(true);
    setBookingConfirmed(false);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingModalOpen(false);
      setBookingConfirmed(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      {/* Top Utility Bar */}
      <header className="h-20 px-6 lg:px-12 flex items-center justify-between border-b border-white/5 bg-black/20 sticky top-0 z-30 backdrop-blur-md">
        <div>
          <div className="text-xl font-bold tracking-tight text-white">
            Deslot
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {t(language, 'customerMapTitle')}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onToggleLanguage}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center justify-center transition-all"
          >
            {language === 'en' ? 'अ' : 'A'}
          </button>

          <button
            onClick={onSwitchToOwner}
            className="px-5 py-2 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold tracking-wide transition-all"
          >
            {t(language, 'switchToOwner')}
          </button>
        </div>
      </header>

      {/* Main Split: Real-Looking Map Canvas + Business Directory */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Real-Looking Satellite / Dark Vector Map Canvas */}
        <div className="lg:w-7/12 h-[400px] lg:h-auto bg-[#0f172a] relative overflow-hidden flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5">
          {/* Authentic Map Graphic Layer */}
          <div className="absolute inset-0 bg-[#0d1424]">
            <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cityGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <rect width="60" height="60" fill="none" stroke="#1e293b" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cityGrid)" />

              {/* Expressways and Arterial Roads */}
              <path d="M 0 120 Q 250 80 500 160 T 1000 100" fill="none" stroke="#334155" strokeWidth="10" />
              <path d="M 0 120 Q 250 80 500 160 T 1000 100" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 6" />
              <path d="M 180 0 L 280 800" fill="none" stroke="#334155" strokeWidth="8" />
              <path d="M 520 0 L 460 800" fill="none" stroke="#334155" strokeWidth="8" />
              <path d="M 0 420 Q 400 300 900 480" fill="none" stroke="#1e293b" strokeWidth="14" />

              {/* River Blue Corridor */}
              <path d="M 0 280 Q 300 350 600 200 T 1200 320" fill="none" stroke="#0284c7" strokeWidth="24" opacity="0.3" />
            </svg>
          </div>

          {/* Interactive Map Pins */}
          <div className="absolute inset-0 p-8 pointer-events-none">
            {filtered.map((biz, idx) => {
              const isSelected = selectedBusiness?.id === biz.id;
              const positions = [
                { top: '35%', left: '32%' },
                { top: '25%', left: '65%' },
                { top: '65%', left: '70%' },
                { top: '70%', left: '25%' },
              ];
              const pos = positions[idx % positions.length];

              return (
                <div
                  key={biz.id}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedBusiness(biz)}
                >
                  <div
                    className={`px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold tracking-wide transition-all ${
                      isSelected
                        ? 'bg-sky-500 text-slate-950 ring-4 ring-sky-400/30'
                        : 'bg-slate-900 text-white border border-white/20 hover:border-white/40'
                    }`}
                  >
                    <span>{biz.name}</span>
                    <span className="opacity-80">★ {biz.rating}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search Box on Map */}
          <div className="relative z-10 p-6 max-w-md w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(language, 'searchPlaceholder')}
              className="w-full px-5 py-3 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 shadow-xl placeholder:text-slate-400"
            />
          </div>

          <div className="relative z-10 p-6 text-xs text-slate-400 tracking-wider">
            City Central Area • Live Provider Coordinates
          </div>
        </div>

        {/* Directory Panel */}
        <div className="lg:w-5/12 bg-black/20 flex flex-col overflow-y-auto divide-y divide-white/5">
          {filtered.map((biz) => {
            const isSelected = selectedBusiness?.id === biz.id;

            return (
              <div
                key={biz.id}
                onClick={() => setSelectedBusiness(biz)}
                className={`p-6 lg:p-8 cursor-pointer transition-colors ${
                  isSelected ? 'bg-white/5 border-l-4 border-sky-400' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {language === 'hi' ? biz.hindiName : biz.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">{biz.address}</p>
                    <div className="text-xs text-slate-400 mt-2">
                      {biz.distance} • {biz.category} • ★ {biz.rating} ({biz.reviewsCount} reviews)
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenBooking(biz);
                    }}
                    className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wide shrink-0 transition-all shadow-md"
                  >
                    {t(language, 'bookNow')}
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
                  <span className="text-emerald-400 font-semibold">
                    {biz.nextAvailableSlot}
                  </span>
                  <span>From ₹{biz.priceStarting}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && selectedBusiness && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="display-canvas max-w-md w-full rounded-3xl p-8 space-y-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {t(language, 'bookNow')}
                </h3>
                <span className="text-sm text-slate-400">
                  {selectedBusiness.name}
                </span>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="py-8 text-center space-y-3">
                <h4 className="text-2xl font-bold text-emerald-400">
                  {t(language, 'bookingSuccess')}
                </h4>
                <p className="text-sm text-slate-300">
                  Window: {selectedWindow} • {selectedService}
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmReservation} className="space-y-5 text-sm">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                    {t(language, 'selectService')}
                  </label>
                  <div className="space-y-2">
                    {selectedBusiness.popularServices.map((srv, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedService(srv.name)}
                        className={`p-3.5 rounded-xl border text-sm cursor-pointer flex items-center justify-between transition-all ${
                          selectedService === srv.name
                            ? 'border-sky-400 bg-sky-500/15 text-white font-semibold'
                            : 'border-white/10 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <span>{srv.name}</span>
                        <span className="font-mono font-bold text-white">₹{srv.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                    {t(language, 'selectSlot')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['11:00 AM', '02:00 PM', '04:30 PM'].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setSelectedWindow(w)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          selectedWindow === w
                            ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide transition-all mt-4"
                >
                  {t(language, 'confirmBooking')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
