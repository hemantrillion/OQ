'use client';

import React, { useState } from 'react';
import { Language, UserRole } from '@/lib/booking-types';
import { MAP_BUSINESSES, MapBusiness } from '@/lib/booking-data';
import { t } from '@/lib/translations';
import {
  MapPin,
  Search,
  Star,
  Clock,
  Scissors,
  Stethoscope,
  UtensilsCrossed,
  Wrench,
  CheckCircle2,
  Calendar,
  X,
  Compass,
  ArrowRight,
  UserCheck,
  Building2,
  Globe2,
} from 'lucide-react';

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
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedBusiness, setSelectedBusiness] = useState<MapBusiness | null>(
    MAP_BUSINESSES[0]
  );
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState('11:00 AM');
  const [selectedServiceName, setSelectedServiceName] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const filteredBusinesses = MAP_BUSINESSES.filter((b) => {
    const matchesSector =
      selectedSector === 'ALL' || b.sector === selectedSector;
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case 'BARBER_SALON':
        return <Scissors className="w-4 h-4 text-amber-600" />;
      case 'CLINIC_DOCTOR':
        return <Stethoscope className="w-4 h-4 text-blue-600" />;
      case 'RESTAURANT_CAFE':
        return <UtensilsCrossed className="w-4 h-4 text-emerald-600" />;
      case 'REPAIR_SERVICE':
        return <Wrench className="w-4 h-4 text-purple-600" />;
      default:
        return <Building2 className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleOpenBooking = (biz: MapBusiness) => {
    setSelectedBusiness(biz);
    setSelectedServiceName(biz.popularServices[0].name);
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Bar for Customer Portal */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            BMS
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              {t(language, 'appName')}
            </h1>
            <span className="text-[11px] text-slate-500 font-medium">
              {t(language, 'customerMapTitle')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Globe2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Switch to Owner View */}
          <button
            onClick={onSwitchToOwner}
            className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-600" />
            <span>{t(language, 'switchToOwner')}</span>
          </button>
        </div>
      </header>

      {/* Main Map & Discovery View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Interactive Map Canvas (7 Cols on Desktop) */}
        <div className="lg:w-7/12 h-[350px] lg:h-auto bg-slate-200 relative overflow-hidden flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
          {/* Simulated Map Background Grid & Vector Roads */}
          <div className="absolute inset-0 bg-[#e5e9ec]">
            {/* Grid Pattern */}
            <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapGrid)" />
              {/* Simulated Roads & Metro Lines */}
              <path d="M 0 100 Q 250 150 500 80 T 1000 200" fill="none" stroke="#ffffff" strokeWidth="8" />
              <path d="M 120 0 L 220 600" fill="none" stroke="#ffffff" strokeWidth="6" />
              <path d="M 450 0 L 400 600" fill="none" stroke="#ffffff" strokeWidth="6" />
              <path d="M 0 320 Q 350 250 800 360" fill="none" stroke="#fed7aa" strokeWidth="5" />
            </svg>

            {/* Simulated River / Park Landmark */}
            <div className="absolute top-10 left-10 px-3 py-1 bg-emerald-100/80 border border-emerald-300 rounded-full text-[10px] text-emerald-800 font-semibold flex items-center gap-1 pointer-events-none">
              <Compass className="w-3 h-3" />
              <span>City Central District • Active Radius: 5 km</span>
            </div>
          </div>

          {/* Interactive Map Pins */}
          <div className="absolute inset-0 p-8 pointer-events-none">
            {filteredBusinesses.map((biz, idx) => {
              const isSelected = selectedBusiness?.id === biz.id;
              // Deterministic screen positioning
              const positions = [
                { top: '35%', left: '30%' },
                { top: '25%', left: '60%' },
                { top: '65%', left: '68%' },
                { top: '70%', left: '22%' },
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
                    className={`px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 font-sans text-xs transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/30 font-semibold'
                        : 'bg-white text-slate-800 border border-slate-300 hover:border-slate-400 font-medium'
                    }`}
                  >
                    {getSectorIcon(biz.sector)}
                    <span className="truncate max-w-[130px]">{biz.name.split(' ')[0]}</span>
                    <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      ★ {biz.rating}
                    </span>
                  </div>
                  {/* Pin Pointer Triangle */}
                  <div className={`w-2.5 h-2.5 rotate-45 mx-auto -mt-1 shadow-sm ${isSelected ? 'bg-blue-600' : 'bg-white border-r border-b border-slate-300'}`} />
                </div>
              );
            })}
          </div>

          {/* Map Overlay Search Input */}
          <div className="relative z-10 p-4 max-w-md w-full">
            <div className="relative bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-slate-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(language, 'searchPlaceholder')}
                className="w-full pl-9 pr-4 py-2.5 text-xs text-slate-900 bg-transparent focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Sector Filter Chips at Bottom of Map */}
          <div className="relative z-10 p-4 flex gap-2 overflow-x-auto pb-3">
            {[
              { id: 'ALL', label: t(language, 'filterAll') },
              { id: 'BARBER_SALON', label: t(language, 'sectorBarber') },
              { id: 'CLINIC_DOCTOR', label: t(language, 'sectorClinic') },
              { id: 'RESTAURANT_CAFE', label: t(language, 'sectorRestaurant') },
              { id: 'REPAIR_SERVICE', label: t(language, 'sectorRepair') },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedSector(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm transition-all ${
                  selectedSector === f.id
                    ? 'bg-blue-600 text-white ring-2 ring-blue-500/20'
                    : 'bg-white/95 backdrop-blur text-slate-700 hover:bg-white border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Business Directory & Selected Provider Details (5 Cols) */}
        <div className="lg:w-5/12 bg-white flex flex-col overflow-y-auto">
          {/* Header Summary */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              {filteredBusinesses.length} {language === 'hi' ? 'सेवाएं उपलब्ध' : 'Services Found'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Real-time Slot Availability
            </span>
          </div>

          {/* List of Businesses */}
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {filteredBusinesses.map((biz) => {
              const isSelected = selectedBusiness?.id === biz.id;

              return (
                <div
                  key={biz.id}
                  onClick={() => setSelectedBusiness(biz)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/40 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          {language === 'hi' ? biz.hindiName : biz.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {biz.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{biz.address}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 justify-end text-xs font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{biz.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({biz.reviewsCount})</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                        {biz.distance}
                      </span>
                    </div>
                  </div>

                  {/* Next slot badge & Action */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      {biz.nextAvailableSlot}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBooking(biz);
                      }}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <span>{t(language, 'bookNow')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && selectedBusiness && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {t(language, 'bookNow')}
                </h3>
                <span className="text-xs text-slate-500">
                  {selectedBusiness.name}
                </span>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {t(language, 'bookingSuccess')}
                </h4>
                <p className="text-xs text-slate-500">
                  Reserved for {selectedSlotTime} • {selectedServiceName}
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmReservation} className="space-y-4">
                {/* Select Service */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t(language, 'selectService')}
                  </label>
                  <div className="space-y-1.5">
                    {selectedBusiness.popularServices.map((srv, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedServiceName(srv.name)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          selectedServiceName === srv.name
                            ? 'border-blue-600 bg-blue-50/70 font-medium text-slate-900'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>{srv.name}</span>
                        <span className="font-bold text-slate-900">₹{srv.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select Slot */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t(language, 'selectSlot')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['11:00 AM', '02:00 PM', '04:30 PM'].map((slotTime) => (
                      <button
                        key={slotTime}
                        type="button"
                        onClick={() => setSelectedSlotTime(slotTime)}
                        className={`py-2 px-2 text-xs font-medium rounded-md border text-center transition-all ${
                          selectedSlotTime === slotTime
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {slotTime}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500">
                  Demo Mode: Instant reservation simulation without requiring card entry.
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t(language, 'confirmBooking')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
