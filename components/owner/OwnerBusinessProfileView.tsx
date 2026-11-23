'use client';

import React, { useState } from 'react';
import {
  Language,
  BusinessProfile,
  BusinessType,
  BusinessSector,
  OperatingLocation,
  ServiceItem,
} from '@/lib/booking-types';
import { t } from '@/lib/translations';

interface Props {
  language: Language;
  business: BusinessProfile;
  onUpdateBusiness: (updated: Partial<BusinessProfile>) => void;
  onSwitchToCustomer?: () => void;
}

export const OwnerBusinessProfileView: React.FC<Props> = ({
  language,
  business,
  onUpdateBusiness,
  onSwitchToCustomer,
}) => {
  // Local state for all fields
  const [name, setName] = useState(business.name);
  const [ownerName, setOwnerName] = useState(business.ownerName);
  const [email, setEmail] = useState(business.email);
  const [phone, setPhone] = useState(business.phone);
  const [sector, setSector] = useState<BusinessSector>(business.sector);
  const [businessType, setBusinessType] = useState<BusinessType>(business.businessType);
  const [description, setDescription] = useState(business.description);
  const [locations, setLocations] = useState<OperatingLocation[]>(business.locations);
  const [services, setServices] = useState<ServiceItem[]>(business.services);

  // New location inline state
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocCity, setNewLocCity] = useState('Pune');

  // New service inline state
  const [showAddService, setShowAddService] = useState(false);
  const [newSrvName, setNewSrvName] = useState('');
  const [newSrvHindiName, setNewSrvHindiName] = useState('');
  const [newSrvPrice, setNewSrvPrice] = useState(300);
  const [newSrvDuration, setNewSrvDuration] = useState(30);
  const [newSrvCategory, setNewSrvCategory] = useState('General');

  // Save feedback state
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Handle Save
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateBusiness({
      name,
      ownerName,
      email,
      phone,
      sector,
      businessType,
      description,
      locations,
      services,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3500);
  };

  // Add Location
  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim() || !newLocAddress.trim()) return;
    const newLocation: OperatingLocation = {
      id: `loc_${Date.now()}`,
      name: newLocName.trim(),
      address: newLocAddress.trim(),
      city: newLocCity.trim() || 'Pune',
      lat: 18.5204 + (Math.random() - 0.5) * 0.05,
      lng: 73.8567 + (Math.random() - 0.5) * 0.05,
      isPrimary: locations.length === 0,
    };
    const updated = [...locations, newLocation];
    setLocations(updated);
    onUpdateBusiness({ locations: updated });
    setNewLocName('');
    setNewLocAddress('');
    setShowAddLocation(false);
  };

  // Set Primary Location
  const handleSetPrimaryLocation = (locId: string) => {
    const updated = locations.map((loc) => ({
      ...loc,
      isPrimary: loc.id === locId,
    }));
    setLocations(updated);
    onUpdateBusiness({ locations: updated });
  };

  // Remove Location
  const handleRemoveLocation = (locId: string) => {
    if (locations.length <= 1) return; // Keep at least one station
    const updated = locations.filter((loc) => loc.id !== locId);
    if (!updated.some((l) => l.isPrimary) && updated.length > 0) {
      updated[0].isPrimary = true;
    }
    setLocations(updated);
    onUpdateBusiness({ locations: updated });
  };

  // Add Service
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrvName.trim()) return;
    const newService: ServiceItem = {
      id: `srv_${Date.now()}`,
      name: newSrvName.trim(),
      hindiName: newSrvHindiName.trim() || newSrvName.trim(),
      price: Number(newSrvPrice) || 200,
      durationMinutes: Number(newSrvDuration) || 30,
      category: newSrvCategory.trim() || 'Services',
    };
    const updated = [...services, newService];
    setServices(updated);
    onUpdateBusiness({ services: updated });
    setNewSrvName('');
    setNewSrvHindiName('');
    setShowAddService(false);
  };

  // Remove Service
  const handleRemoveService = (srvId: string) => {
    if (services.length <= 1) return;
    const updated = services.filter((s) => s.id !== srvId);
    setServices(updated);
    onUpdateBusiness({ services: updated });
  };

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-12 gap-8 max-w-7xl mx-auto w-full select-none text-white">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>{language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
              {businessType === 'INDIVIDUAL'
                ? language === 'hi'
                  ? 'व्यक्तिगत'
                  : 'Individual'
                : language === 'hi'
                ? 'कंपनी'
                : 'Enterprise'}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{language === 'hi' ? 'परिवर्तन सहेजें' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* PORTAL MODE TOGGLE: Toggle between Booking Portal & Customer Portal */}
      <section className="display-card rounded-3xl p-6 lg:p-7 border border-sky-400/30 bg-gradient-to-r from-sky-950/40 via-[#0d131f] to-slate-900/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {language === 'hi' ? 'पोर्टल मोड' : 'Portal Mode'}
          </h2>
        </div>

        {/* The Toggle Slider / Switch */}
        <div className="flex items-center p-1.5 bg-black/50 rounded-full border border-white/10 shrink-0 shadow-inner">
          {/* Option 1: Booking Portal (Currently Active) */}
          <button
            type="button"
            className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all bg-sky-500 text-slate-950 shadow-md flex items-center justify-center select-none"
          >
            <span>{language === 'hi' ? 'बुकिंग पोर्टल' : 'Booking Portal'}</span>
          </button>

          {/* Option 2: Customer Portal (Click to switch) */}
          <button
            type="button"
            onClick={onSwitchToCustomer}
            className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer select-none"
            title={language === 'hi' ? 'ग्राहक द्वार पर जाएं' : 'Switch to Customer Portal'}
          >
            <span>{language === 'hi' ? 'ग्राहक द्वार' : 'Customer Portal'}</span>
          </button>
        </div>
      </section>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {language === 'hi'
                ? 'व्यवसाय प्रोफ़ाइल विवरण सफलतापूर्वक अपडेट कर दिया गया है।'
                : 'Business profile successfully updated and synchronized across all OQ stations.'}
            </span>
          </div>
          <button
            onClick={() => setSavedSuccess(false)}
            className="text-emerald-400/60 hover:text-emerald-300 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core Identity & Parameters (2 cols span) */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. ENTERPRISE IDENTITY & SECTOR */}
          <section className="display-card rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {language === 'hi' ? '1. व्यवसाय पहचान एवं रूपरेखा' : '1. Enterprise Identity & Trade'}
              </h2>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                {language === 'hi' ? 'पहचान' : 'Identity'}
              </span>
            </div>

            {/* Entity Type Toggle */}
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
                </button>
              </div>
            </div>

            {/* Business Name & Owner Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {t(language, 'businessNameLabel')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t(language, 'businessNamePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {t(language, 'ownerNameLabel')}
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder={t(language, 'ownerNamePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 transition-all font-medium"
                />
              </div>
            </div>

            {/* Sector / Trade */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {t(language, 'sectorLabel')}
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as BusinessSector)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 transition-all"
              >
                <option value="BARBER_SALON" className="bg-slate-900 text-white">
                  {t(language, 'sectorBarber')}
                </option>
                <option value="CLINIC_DOCTOR" className="bg-slate-900 text-white">
                  {t(language, 'sectorClinic')}
                </option>
                <option value="RESTAURANT_CAFE" className="bg-slate-900 text-white">
                  {t(language, 'sectorRestaurant')}
                </option>
                <option value="REPAIR_SERVICE" className="bg-slate-900 text-white">
                  {t(language, 'sectorRepair')}
                </option>
                <option value="GENERAL" className="bg-slate-900 text-white">
                  {t(language, 'sectorGeneral')}
                </option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {language === 'hi' ? 'व्यवसाय विवरण / परिचय' : 'Enterprise Bio / Description'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 transition-all resize-none"
                placeholder={
                  language === 'hi'
                    ? 'ग्राहकों के लिए अपने व्यवसाय की मुख्य सेवाएं और विशेषताएं लिखें...'
                    : 'Describe your specialties, amenities, and service excellence...'
                }
              />
            </div>
          </section>

          {/* 2. OPERATING STATIONS & LOCATIONS */}
          <section className="display-card rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {language === 'hi' ? '2. कार्य केंद्र एवं शाखाएं' : '2. Operating Stations & Locations'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {locations.length}{' '}
                  {language === 'hi' ? 'सक्रिय ऑपरेटिंग स्टेशन' : 'active stations configured'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddLocation((prev) => !prev)}
                className="px-4 py-2 rounded-full border border-sky-400/40 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-bold tracking-wide transition-all"
              >
                {showAddLocation
                  ? language === 'hi'
                    ? 'रद्द करें'
                    : 'Cancel'
                  : language === 'hi'
                  ? '+ नया केंद्र जोड़ें'
                  : '+ Add Station'}
              </button>
            </div>

            {/* Add Location Form */}
            {showAddLocation && (
              <form
                onSubmit={handleAddLocation}
                className="p-5 rounded-2xl bg-white/5 border border-sky-400/30 space-y-4 animate-in fade-in duration-200"
              >
                <div className="text-sm font-bold text-white">
                  {language === 'hi' ? 'नया कार्य केंद्र कॉन्फ़िगर करें' : 'Configure New Operating Station'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      {language === 'hi' ? 'केंद्र का नाम' : 'Station Name'}
                    </label>
                    <input
                      type="text"
                      value={newLocName}
                      onChange={(e) => setNewLocName(e.target.value)}
                      placeholder="e.g. West Wing Station (Chair 4)"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      {language === 'hi' ? 'शहर' : 'City'}
                    </label>
                    <input
                      type="text"
                      value={newLocCity}
                      onChange={(e) => setNewLocCity(e.target.value)}
                      placeholder="Pune"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    {language === 'hi' ? 'सटीक पता' : 'Street Address'}
                  </label>
                  <input
                    type="text"
                    value={newLocAddress}
                    onChange={(e) => setNewLocAddress(e.target.value)}
                    placeholder="e.g. Floor 2, Metro Tower, Shivaji Nagar"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLocation(false)}
                    className="px-4 py-2 rounded-full border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 text-xs font-bold"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md"
                  >
                    {language === 'hi' ? 'केंद्र जोड़ें' : 'Add Station'}
                  </button>
                </div>
              </form>
            )}

            {/* Locations List */}
            <div className="space-y-3">
              {locations.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center text-slate-500 text-sm">
                  {language === 'hi' ? 'कोई केंद्र नहीं जोड़ा गया है।' : 'No stations configured yet.'}
                </div>
              ) : (
                locations.map((loc) => (
                  <div
                    key={loc.id}
                    className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-white/10"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white text-base">{loc.name}</span>
                        {loc.isPrimary ? (
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                            {language === 'hi' ? 'मुख्य केंद्र' : 'Primary Station'}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryLocation(loc.id)}
                            className="text-xs text-slate-400 hover:text-sky-300 underline"
                          >
                            {language === 'hi' ? 'मुख्य बनाएं' : 'Make Primary'}
                          </button>
                        )}
                      </div>
                      <div className="text-sm text-slate-400">
                        {loc.address}, {loc.city}
                      </div>
                    </div>

                    {!loc.isPrimary && locations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(loc.id)}
                        className="text-xs text-rose-400/70 hover:text-rose-400 font-bold self-start sm:self-center"
                      >
                        {language === 'hi' ? 'हटाएं' : 'Remove'}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 3. SERVICE & TARIFF CATALOGUE */}
          <section className="display-card rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {language === 'hi' ? '3. सेवा एवं शुल्क सूची (टैरिफ)' : '3. Tariff & Service Catalogue'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {services.length}{' '}
                  {language === 'hi' ? 'सक्रिय सेवाएं' : 'services offered to clients'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddService((prev) => !prev)}
                className="px-4 py-2 rounded-full border border-sky-400/40 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-bold tracking-wide transition-all"
              >
                {showAddService
                  ? language === 'hi'
                    ? 'रद्द करें'
                    : 'Cancel'
                  : language === 'hi'
                  ? '+ नई सेवा जोड़ें'
                  : '+ Add Service'}
              </button>
            </div>

            {/* Add Service Form */}
            {showAddService && (
              <form
                onSubmit={handleAddService}
                className="p-5 rounded-2xl bg-white/5 border border-sky-400/30 space-y-4 animate-in fade-in duration-200"
              >
                <div className="text-sm font-bold text-white">
                  {language === 'hi' ? 'नई सेवा पंजीकृत करें' : 'Register New Service Offering'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      {language === 'hi' ? 'सेवा का नाम (English)' : 'Service Name (English)'}
                    </label>
                    <input
                      type="text"
                      value={newSrvName}
                      onChange={(e) => setNewSrvName(e.target.value)}
                      placeholder="e.g. Executive Beard Sculpting"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      {language === 'hi' ? 'सेवा का नाम (हिंदी)' : 'Hindi Label'}
                    </label>
                    <input
                      type="text"
                      value={newSrvHindiName}
                      onChange={(e) => setNewSrvHindiName(e.target.value)}
                      placeholder="दाढ़ी ट्रिमिंग एवं सेट"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      {language === 'hi' ? 'शुल्क (₹)' : 'Tariff Price (₹)'}
                    </label>
                    <input
                      type="number"
                      value={newSrvPrice}
                      onChange={(e) => setNewSrvPrice(Number(e.target.value))}
                      min={0}
                      step={50}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      {language === 'hi' ? 'अवधि (मिनट)' : 'Duration (Mins)'}
                    </label>
                    <input
                      type="number"
                      value={newSrvDuration}
                      onChange={(e) => setNewSrvDuration(Number(e.target.value))}
                      min={10}
                      step={5}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      {language === 'hi' ? 'श्रेणी' : 'Category'}
                    </label>
                    <input
                      type="text"
                      value={newSrvCategory}
                      onChange={(e) => setNewSrvCategory(e.target.value)}
                      placeholder="Hair, Beard, Care"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddService(false)}
                    className="px-4 py-2 rounded-full border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 text-xs font-bold"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md"
                  >
                    {language === 'hi' ? 'सेवा जोड़ें' : 'Add Service'}
                  </button>
                </div>
              </form>
            )}

            {/* Services List */}
            {services.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center text-slate-500 text-sm">
                {language === 'hi' ? 'कोई सेवा नहीं जोड़ी गई है।' : 'No services configured yet.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between transition-all hover:border-white/10"
                  >
                    <div>
                      <div className="font-bold text-white text-base">
                        {language === 'hi' && srv.hindiName ? srv.hindiName : srv.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {srv.category} • {srv.durationMinutes}{' '}
                        {language === 'hi' ? 'मिनट' : 'minutes'}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-lg font-mono font-bold text-sky-400">₹{srv.price}</div>
                      {services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveService(srv.id)}
                          className="text-xs text-rose-400/60 hover:text-rose-400 font-bold ml-1"
                          title={language === 'hi' ? 'हटाएं' : 'Remove'}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Contact, Verification, & Public Preview */}
        <div className="space-y-8">
          {/* 4. CONTACT & SYNC CREDENTIALS */}
          <section className="display-card rounded-3xl p-8 space-y-6">
            <div className="pb-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {language === 'hi' ? 'संपर्क एवं प्रमाणीकरण' : 'Contact & Credentials'}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {language === 'hi' ? 'सम्पर्क फ़ोन नंबर' : 'Primary Phone'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {language === 'hi' ? 'सिंक ईमेल पता' : 'Sync Email'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>

              <div className="pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    {language === 'hi' ? 'संचालन स्थिति' : 'Live Status'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        business.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                      }`}
                    />
                    <span className="text-sm font-bold text-white">
                      {business.isOnline
                        ? language === 'hi'
                          ? 'बुकिंग्स खुली हैं (Taking Bookings)'
                          : 'Taking Bookings (Online)'
                        : language === 'hi'
                        ? 'संचालन रोका गया है'
                        : 'Operations Paused (Offline)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. LIVE PUBLIC CARD PREVIEW */}
          <section className="display-canvas rounded-3xl p-8 space-y-4 border border-white/10">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              {language === 'hi' ? 'ग्राहक पोर्टल में पूर्वावलोकन' : 'Customer Portal Preview'}
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-sky-400/30 space-y-3 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-extrabold text-white text-lg tracking-tight">
                    {name || (language === 'hi' ? 'व्यवसाय का नाम' : 'Business Name')}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {sector.replace('_', ' ')} {ownerName ? `• ${ownerName}` : ''}
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {language === 'hi' ? 'खुला है' : 'Open'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {description || (language === 'hi' ? 'विवरण दर्ज नहीं है।' : 'No description provided yet.')}
              </p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>{locations[0]?.address || (language === 'hi' ? 'पता दर्ज नहीं है' : 'Address not set')}</span>
                <span className="text-sky-300 font-bold">
                  {services.length} {language === 'hi' ? 'सेवाएं' : 'services'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              {language === 'hi'
                ? 'यह कार्ड ग्राहक द्वार के मानचित्र और खोज सूची में दिखेगा।'
                : 'This card renders in the Customer Portal city map & directory.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
