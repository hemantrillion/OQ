'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/booking-types';
import { MAP_BUSINESSES, MapBusiness } from '@/lib/booking-data';
import { t, localizeText } from '@/lib/translations';

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
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white select-none">
      {/* Top Utility Bar (Exact same header height, font size, and layout as Owner portal) */}
      <header className="h-24 px-6 lg:px-16 flex items-center justify-between border-b border-white/5 bg-black/20 sticky top-0 z-40 backdrop-blur-md">
        <div className="space-y-0.5">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
            {t(language, 'appName')}
          </div>
          <div className="text-sm text-slate-400 font-medium tracking-wide">
            {t(language, 'customerPortal')}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Minimalist Language Switcher: अ / A (Fixed Dimensions 48px x 48px) */}
          <button
            onClick={onToggleLanguage}
            title={language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
            className="w-12 h-12 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-base flex items-center justify-center transition-all shrink-0"
          >
            {language === 'en' ? 'अ' : 'A'}
          </button>

          {/* Switch to Operator Desk (Fixed Width 160px) */}
          <button
            onClick={onSwitchToOwner}
            className="w-40 py-2.5 rounded-full border border-sky-400/40 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-bold tracking-wide transition-all text-center"
          >
            {t(language, 'switchToOwner')}
          </button>
        </div>
      </header>

      {/* Main Split: Real-World Dark OpenStreetMap + Business Directory */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Real Interactive Map Iframe Embed for Pune City Center */}
        <div className="lg:w-7/12 h-[450px] lg:h-auto relative overflow-hidden flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0a0f1d]">
          {/* Authentic Real OpenStreetMap Embed with Dark Carto Filter */}
          <iframe
            title="Real City Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=73.8100%2C18.4900%2C73.9400%2C18.5700&amp;layer=mapnik"
            className="w-full h-full border-0 filter invert contrast-125 hue-rotate-180 opacity-80"
          />

          {/* Search Box Floating on Map */}
          <div className="absolute top-6 left-6 right-6 max-w-md z-10">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(language, 'searchPlaceholder')}
              className="w-full px-6 py-3.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-white/20 text-white text-sm focus:outline-none focus:border-sky-400 shadow-2xl placeholder:text-slate-400"
            />
          </div>

          <div className="absolute bottom-4 left-6 z-10 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-xs text-sky-300 font-semibold tracking-wider">
            Pune Central • Verified Real Map View
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
                className={`p-8 cursor-pointer transition-colors ${
                  isSelected ? 'bg-white/5 border-l-4 border-sky-400' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {language === 'hi' ? biz.hindiName : biz.name}
                    </h3>
                    <p className="text-sm text-slate-300 mt-1">{biz.address}</p>
                    <div className="text-xs text-slate-400 mt-2 font-medium">
                      {biz.distance} • {biz.category} • ★ {biz.rating} ({biz.reviewsCount} reviews)
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenBooking(biz);
                    }}
                    className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wide shrink-0 transition-all shadow-md"
                  >
                    {t(language, 'bookNow')}
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span className="text-emerald-400 font-bold">
                    {biz.nextAvailableSlot}
                  </span>
                  <span className="font-mono">From ₹{biz.priceStarting}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && selectedBusiness && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
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
