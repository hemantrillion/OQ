'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/booking-types';
import { MAP_BUSINESSES, MapBusiness } from '@/lib/booking-data';
import { t } from '@/lib/translations';
import { AccountFlyoutPanel } from '@/components/auth/AccountFlyoutPanel';

export type CustomerTab = 'DISCOVER' | 'BOOK' | 'RESERVATIONS' | 'SPENDINGS' | 'PROFILE';

export interface CustomerBooking {
  id: string;
  businessId: string;
  businessName: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: 'ONLINE_UPI' | 'CASH';
  paymentStatus: 'PAID' | 'PENDING';
}

export interface CustomerSpending {
  id: string;
  businessName: string;
  serviceName: string;
  amount: number;
  method: 'ONLINE_UPI' | 'CASH';
  date: string;
  time: string;
}

interface Props {
  language: Language;
  onSwitchToOwner: () => void;
  onToggleLanguage: () => void;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  onLogout?: () => void;
}

export const CustomerMapView: React.FC<Props> = ({
  language,
  onSwitchToOwner,
  onToggleLanguage,
  userName = 'Customer Guest',
  userEmail = 'customer@bookingoq.com',
  avatarUrl,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<CustomerTab>('DISCOVER');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  // Search and selected business
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<MapBusiness>(MAP_BUSINESSES[0]);

  // Book tab form state
  const [bookBizId, setBookBizId] = useState(MAP_BUSINESSES[0]?.id || '');
  const [bookService, setBookService] = useState(MAP_BUSINESSES[0]?.popularServices[0]?.name || '');
  const [bookDate, setBookDate] = useState('2026-10-30');
  const [bookWindow, setBookWindow] = useState('11:00 AM');
  const [bookName, setBookName] = useState(userName || '');
  const [bookPhone, setBookPhone] = useState('');
  const [bookPaymentMethod, setBookPaymentMethod] = useState<'ONLINE_UPI' | 'CASH'>('ONLINE_UPI');
  const [bookSuccessMsg, setBookSuccessMsg] = useState(false);

  // Modal booking state for Discover tab
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [modalService, setModalService] = useState('');
  const [modalWindow, setModalWindow] = useState('11:00 AM');
  const [modalConfirmed, setModalConfirmed] = useState(false);

  // Customer Reservations & Spendings - Load live from SQLite
  const [reservations, setReservations] = useState<CustomerBooking[]>([]);
  const [spendings, setSpendings] = useState<CustomerSpending[]>([]);
  const [resFilter, setResFilter] = useState<'UPCOMING' | 'HISTORY'>('UPCOMING');

  // Load real reservations from SQLite so bookings are synchronized across sessions
  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bookings) && data.bookings.length > 0) {
          const mapped: CustomerBooking[] = data.bookings.map((b: any) => ({
            id: b.id,
            businessId: b.business_id,
            businessName: 'Apex ENT Specialist Clinic & Blood Lab',
            serviceName: b.service_name,
            price: 500,
            date: b.booking_date,
            time: b.start_time,
            status: b.status === 'CONFIRMED' ? 'UPCOMING' : (b.status as any),
            paymentMethod: 'ONLINE_UPI',
            paymentStatus: 'PAID',
          }));
          setReservations(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Customer Profile local fields
  const [profileName, setProfileName] = useState(userName || '');
  const [profileEmail, setProfileEmail] = useState(userEmail || '');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCity, setProfileCity] = useState('Pune');
  const [profileSaved, setProfileSaved] = useState(false);

  const safeAvatarUrl = avatarUrl?.startsWith('/avatars/')
    ? `/oq${avatarUrl}`
    : avatarUrl;

  const filteredBusinesses = MAP_BUSINESSES.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenBooking = (biz: MapBusiness) => {
    setSelectedBusiness(biz);
    setModalService(biz.popularServices[0]?.name || '');
    setBookingModalOpen(true);
    setModalConfirmed(false);
  };

  const handleModalConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness) return;
    const srv = selectedBusiness.popularServices.find((s) => s.name === modalService);
    const price = srv?.price || selectedBusiness.priceStarting;

    const newRes: CustomerBooking = {
      id: `cres_${Date.now()}`,
      businessId: selectedBusiness.id,
      businessName: selectedBusiness.name,
      serviceName: modalService || 'Standard Reservation',
      price,
      date: 'Tomorrow',
      time: modalWindow,
      status: 'UPCOMING',
      paymentMethod: 'ONLINE_UPI',
      paymentStatus: 'PAID',
    };

    setReservations((prev) => [newRes, ...prev]);
    setSpendings((prev) => [
      {
        id: `csp_${Date.now()}`,
        businessName: selectedBusiness.name,
        serviceName: modalService || 'Standard Reservation',
        amount: price,
        method: 'ONLINE_UPI',
        date: 'Today',
        time: modalWindow,
      },
      ...prev,
    ]);

    setModalConfirmed(true);
    setTimeout(() => {
      setBookingModalOpen(false);
      setModalConfirmed(false);
    }, 1800);
  };

  const handleDirectBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const biz = MAP_BUSINESSES.find((b) => b.id === bookBizId) || MAP_BUSINESSES[0];
    const srv = biz.popularServices.find((s) => s.name === bookService);
    const price = srv?.price || biz.priceStarting;

    const newRes: CustomerBooking = {
      id: `cres_${Date.now()}`,
      businessId: biz.id,
      businessName: biz.name,
      serviceName: bookService || 'Standard Reservation',
      price,
      date: bookDate,
      time: bookWindow,
      status: 'UPCOMING',
      paymentMethod: bookPaymentMethod,
      paymentStatus: bookPaymentMethod === 'ONLINE_UPI' ? 'PAID' : 'PENDING',
    };

    setReservations((prev) => [newRes, ...prev]);

    // Commit booking directly to SQLite /api/bookings so it reflects on Owner/Operator desk immediately!
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: bookName || userName || 'Customer',
        customer_phone: bookPhone || '',
        customer_email: userEmail || '',
        service_name: bookService || 'ENT General Consultation',
        booking_date: bookDate,
        start_time: bookWindow,
        price,
      }),
    }).catch((err) => console.error('Booking sync error:', err));

    if (bookPaymentMethod === 'ONLINE_UPI') {
      setSpendings((prev) => [
        {
          id: `csp_${Date.now()}`,
          businessName: biz.name,
          serviceName: bookService || 'Standard Reservation',
          amount: price,
          method: 'ONLINE_UPI',
          date: 'Today',
          time: bookWindow,
        },
        ...prev,
      ]);
    }

    setBookSuccessMsg(true);
    setTimeout(() => {
      setBookSuccessMsg(false);
      setActiveTab('RESERVATIONS');
    }, 1500);
  };

  const handleCancelReservation = (id: string) => {
    fetch('/api/bookings/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: id }),
    }).catch(() => {});

    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'CANCELLED' } : r))
    );
  };

  const tabs: Array<{ id: CustomerTab; label: string; badge?: number }> = [
    { id: 'DISCOVER', label: t(language, 'navCustDiscover') },
    { id: 'BOOK', label: t(language, 'navCustBook') },
    {
      id: 'RESERVATIONS',
      label: t(language, 'navCustReservations'),
      badge: reservations.filter((r) => r.status === 'UPCOMING').length,
    },
    { id: 'SPENDINGS', label: t(language, 'navCustSpendings') },
    { id: 'PROFILE', label: t(language, 'navCustProfile') },
  ];

  const filteredReservations = reservations.filter((r) =>
    resFilter === 'UPCOMING'
      ? r.status === 'UPCOMING'
      : r.status === 'COMPLETED' || r.status === 'CANCELLED'
  );

  const totalSpent = spendings.reduce((sum, s) => sum + s.amount, 0);
  const totalUpi = spendings.filter((s) => s.method === 'ONLINE_UPI').reduce((sum, s) => sum + s.amount, 0);
  const totalCash = spendings.filter((s) => s.method === 'CASH').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white select-none">
      {/* 1. TOP HEADER (Exact match with Operator Desk layout) */}
      <header className="h-24 px-6 lg:px-16 flex items-center justify-between border-b border-white/5 bg-black/20 sticky top-0 z-40 backdrop-blur-md">
        <div className="space-y-0.5">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
            {t(language, 'appName')}
          </div>
          <div className="text-sm text-slate-400 font-medium tracking-wide">
            {userName || t(language, 'customerPortal')}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher: अ / A */}
          <button
            onClick={onToggleLanguage}
            title={language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
            className="w-12 h-12 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-base flex items-center justify-center transition-all shrink-0 cursor-pointer"
          >
            {language === 'en' ? 'अ' : 'A'}
          </button>

          {/* Quick Switch to Operator / Booking Portal */}
          <button
            onClick={onSwitchToOwner}
            className="px-4 py-2 rounded-full border border-sky-400/40 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-bold tracking-wide transition-all text-center cursor-pointer"
          >
            {language === 'hi' ? 'बुकिंग पोर्टल' : 'Booking Portal'}
          </button>

          {/* Profile Circle Avatar Button & Flyout */}
          {onLogout && (
            <div className="relative">
              <button
                type="button"
                data-panel-trigger="account-flyout"
                onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                title={userName}
                aria-label="Account Menu"
                className={`w-11 h-11 rounded-full p-0.5 transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  isAccountMenuOpen
                    ? 'ring-2 ring-sky-400 scale-105 shadow-lg'
                    : 'hover:ring-2 hover:ring-white/40 hover:scale-105'
                }`}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden border border-white/20">
                  {safeAvatarUrl ? (
                    <img
                      src={safeAvatarUrl}
                      alt={userName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {userName
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((n) => n[0].toUpperCase())
                        .join('') || 'OQ'}
                    </span>
                  )}
                </div>
              </button>

              <AccountFlyoutPanel
                isOpen={isAccountMenuOpen}
                onClose={() => setIsAccountMenuOpen(false)}
                name={userName}
                email={userEmail}
                avatarUrl={safeAvatarUrl}
                language={language}
                onLogout={onLogout}
                onNavigateAccount={() => {
                  window.location.href = '/oq/account/';
                }}
              />
            </div>
          )}
        </div>
      </header>

      {/* 2. CUSTOMER NAVIGATION RIBBON (5 TABS: Discover, Book, Reservations, Spendings, Profile) */}
      <nav className="px-6 lg:px-16 flex items-center gap-4 bg-transparent overflow-x-auto scrollbar-none select-none py-2 border-b border-white/5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-w-[120px] py-3 text-sm font-bold tracking-wide whitespace-nowrap transition-all flex items-center justify-center gap-2 rounded-full cursor-pointer ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-500 text-slate-950">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. TAB 1: DISCOVER (Real Interactive City Map + Station Directory - Exactly Image 4) */}
      {activeTab === 'DISCOVER' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-[calc(100vh-140px)]">
          {/* Interactive OpenStreetMap Embed */}
          <div className="lg:w-7/12 h-[450px] lg:h-auto relative overflow-hidden flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0a0f1d]">
            <iframe
              title="Real City Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=73.8100%2C18.4900%2C73.9400%2C18.5700&amp;layer=mapnik"
              className="w-full h-full border-0 filter invert contrast-125 hue-rotate-180 opacity-80"
            />

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
            {filteredBusinesses.map((biz) => {
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
                      className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wide shrink-0 transition-all shadow-md cursor-pointer"
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
      )}

      {/* 4. TAB 2: BOOK (Direct Station & Slot Booking Interface) */}
      {activeTab === 'BOOK' && (
        <div className="flex-1 p-6 lg:p-12 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {language === 'hi' ? 'सेवा एवं समय स्लॉट बुक करें' : 'Reserve Service & Timing Window'}
            </h2>
          </div>

          {bookSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-sm">
              {language === 'hi' ? 'आरक्षण सफलतापूर्वक दर्ज कर लिया गया है!' : 'Reservation successfully confirmed!'}
            </div>
          )}

          <form onSubmit={handleDirectBookSubmit} className="display-card rounded-3xl p-8 space-y-6 border border-white/10">
            {/* Choose Station */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {language === 'hi' ? 'स्टेशन / व्यवसाय चुनें' : 'Select Station / Enterprise'}
              </label>
              <select
                value={bookBizId}
                onChange={(e) => {
                  setBookBizId(e.target.value);
                  const found = MAP_BUSINESSES.find((b) => b.id === e.target.value);
                  if (found) setBookService(found.popularServices[0]?.name || '');
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
              >
                {MAP_BUSINESSES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {language === 'hi' ? b.hindiName : b.name} ({b.address})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Service */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {language === 'hi' ? 'सेवा चुनें' : 'Select Service'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MAP_BUSINESSES.find((b) => b.id === bookBizId)?.popularServices.map((srv, idx) => (
                  <div
                    key={idx}
                    onClick={() => setBookService(srv.name)}
                    className={`p-4 rounded-2xl border text-sm cursor-pointer flex items-center justify-between transition-all ${
                      bookService === srv.name
                        ? 'border-sky-400 bg-sky-500/15 text-white font-bold shadow-md'
                        : 'border-white/10 hover:border-white/20 text-slate-300 bg-white/5'
                    }`}
                  >
                    <span>{srv.name}</span>
                    <span className="font-mono font-bold text-sky-400">₹{srv.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time Window */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {language === 'hi' ? 'तिथि' : 'Date'}
                </label>
                <input
                  type="date"
                  value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {language === 'hi' ? 'समय स्लॉट' : 'Timing Window'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setBookWindow(w)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        bookWindow === w
                          ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {language === 'hi' ? 'ग्राहक का नाम' : 'Customer Name'}
                </label>
                <input
                  type="text"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {language === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={bookPhone}
                  onChange={(e) => setBookPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                {language === 'hi' ? 'भुगतान का प्रकार' : 'Payment Method'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBookPaymentMethod('ONLINE_UPI')}
                  className={`p-3.5 rounded-2xl border text-sm font-semibold transition-all ${
                    bookPaymentMethod === 'ONLINE_UPI'
                      ? 'border-sky-400 bg-sky-500/15 text-white shadow-md'
                      : 'border-white/10 hover:border-white/20 text-slate-300 bg-white/5'
                  }`}
                >
                  Direct UPI / Online
                </button>
                <button
                  type="button"
                  onClick={() => setBookPaymentMethod('CASH')}
                  className={`p-3.5 rounded-2xl border text-sm font-semibold transition-all ${
                    bookPaymentMethod === 'CASH'
                      ? 'border-sky-400 bg-sky-500/15 text-white shadow-md'
                      : 'border-white/10 hover:border-white/20 text-slate-300 bg-white/5'
                  }`}
                >
                  Pay at Station (Cash)
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              {language === 'hi' ? 'आरक्षण की पुष्टि करें' : 'Confirm & Reserve Slot'}
            </button>
          </form>
        </div>
      )}

      {/* 5. TAB 3: RESERVATIONS (Customer's own bookings table - empty state if none) */}
      {activeTab === 'RESERVATIONS' && (
        <div className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                {language === 'hi' ? 'मेरे आरक्षण' : 'My Reservations'}
              </h2>
            </div>

            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-full border border-white/10">
              <button
                onClick={() => setResFilter('UPCOMING')}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  resFilter === 'UPCOMING'
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'hi' ? 'आगामी' : 'Upcoming'} ({reservations.filter((r) => r.status === 'UPCOMING').length})
              </button>
              <button
                onClick={() => setResFilter('HISTORY')}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  resFilter === 'HISTORY'
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'hi' ? 'इतिहास' : 'History'} ({reservations.filter((r) => r.status !== 'UPCOMING').length})
              </button>
            </div>
          </div>

          {filteredReservations.length === 0 ? (
            <div className="display-card rounded-3xl p-16 text-center text-slate-400 text-base border border-white/5">
              {language === 'hi'
                ? 'अभी तक कोई आरक्षण दर्ज नहीं है।'
                : 'No client reservations found in this section.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReservations.map((res) => (
                <div
                  key={res.id}
                  className="display-card rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all border border-white/10"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-white">{res.serviceName}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          res.status === 'UPCOMING'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {res.status}
                      </span>
                    </div>

                    <div className="text-sm text-slate-300 font-medium">
                      {res.businessName} • <span className="font-bold text-white font-mono">₹{res.price}</span>
                    </div>

                    <div className="text-xs text-slate-400">
                      {res.date} at {res.time} • Payment: {res.paymentMethod === 'ONLINE_UPI' ? 'UPI' : 'Cash'} ({res.paymentStatus})
                    </div>
                  </div>

                  {res.status === 'UPCOMING' && (
                    <button
                      onClick={() => handleCancelReservation(res.id)}
                      className="px-5 py-2 rounded-full border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all self-start md:self-center cursor-pointer"
                    >
                      {language === 'hi' ? 'रद्द करें' : 'Cancel Reservation'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 4: SPENDINGS (Customer's spending history & billing ledger) */}
      {activeTab === 'SPENDINGS' && (
        <div className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full space-y-10 animate-in fade-in duration-200">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {language === 'hi' ? 'खर्च एवं रसीदें' : 'Customer Spendings & Receipts'}
            </h2>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="display-card rounded-3xl p-8 space-y-2 border border-white/10">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {language === 'hi' ? 'कुल खर्च' : 'Total Spent'}
              </div>
              <div className="text-4xl font-extrabold text-white font-mono">
                ₹{totalSpent.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-emerald-400 font-medium">
                {spendings.length} {language === 'hi' ? 'भुगतान किए गए लेन-देन' : 'settled transactions'}
              </div>
            </div>

            <div className="display-card rounded-3xl p-8 space-y-2 border border-white/10">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                UPI & Digital
              </div>
              <div className="text-4xl font-extrabold text-white font-mono">
                ₹{totalUpi.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-slate-400">
                Direct online transfers
              </div>
            </div>

            <div className="display-card rounded-3xl p-8 space-y-2 border border-white/10">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Cash Settlements
              </div>
              <div className="text-4xl font-extrabold text-white font-mono">
                ₹{totalCash.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-slate-400">
                Paid at station counter
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <section className="display-canvas rounded-3xl p-8 border border-white/10 overflow-hidden">
            <h3 className="text-xl font-bold text-white pb-6 border-b border-white/10">
              {language === 'hi' ? 'भुगतान रसीद रजिस्टर' : 'Payment Receipts Ledger'}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="py-4 px-4">Station / Enterprise</th>
                    <th className="py-4 px-4">Service</th>
                    <th className="py-4 px-4">Amount</th>
                    <th className="py-4 px-4">Method</th>
                    <th className="py-4 px-4">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {spendings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                        {language === 'hi' ? 'कोई लेन-देन दर्ज नहीं है।' : 'No transactions recorded yet.'}
                      </td>
                    </tr>
                  ) : (
                    spendings.map((sp) => (
                      <tr key={sp.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-bold text-white">{sp.businessName}</td>
                        <td className="py-4 px-4 text-slate-300">{sp.serviceName}</td>
                        <td className="py-4 px-4 font-mono font-bold text-white text-base">₹{sp.amount}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
                            {sp.method === 'ONLINE_UPI' ? 'UPI' : 'Cash'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-xs">{sp.date}, {sp.time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* 7. TAB 5: PROFILE (Customer personal profile & Portal switch) */}
      {activeTab === 'PROFILE' && (
        <div className="flex-1 p-6 lg:p-12 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {language === 'hi' ? 'ग्राहक प्रोफ़ाइल' : 'Customer Profile'}
            </h2>

            <button
              type="button"
              onClick={() => {
                setProfileSaved(true);
                setTimeout(() => setProfileSaved(false), 3000);
              }}
              className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-md cursor-pointer"
            >
              {language === 'hi' ? 'सहेजें' : 'Save Changes'}
            </button>
          </div>

          {profileSaved && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-sm">
              {language === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक सहेज ली गई है।' : 'Profile details saved successfully.'}
            </div>
          )}

          {/* Portal Mode Toggle: clean switch without dot and without arrow */}
          <section className="display-card rounded-3xl p-6 lg:p-7 border border-sky-400/30 bg-gradient-to-r from-sky-950/40 via-[#0d131f] to-slate-900/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {language === 'hi' ? 'पोर्टल मोड' : 'Portal Mode'}
              </h2>
            </div>

            <div className="flex items-center p-1.5 bg-black/50 rounded-full border border-white/10 shrink-0 shadow-inner">
              <button
                type="button"
                onClick={onSwitchToOwner}
                className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer select-none"
              >
                <span>{language === 'hi' ? 'बुकिंग पोर्टल' : 'Booking Portal'}</span>
              </button>
              <button
                type="button"
                className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all bg-sky-500 text-slate-950 shadow-md flex items-center justify-center select-none"
              >
                <span>{language === 'hi' ? 'ग्राहक द्वार' : 'Customer Portal'}</span>
              </button>
            </div>
          </section>

          {/* Personal Information */}
          <div className="display-card rounded-3xl p-8 space-y-6 border border-white/10">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">
              {language === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {language === 'hi' ? 'फ़ोन नंबर' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  {language === 'hi' ? 'पसंदीदा शहर' : 'Preferred City'}
                </label>
                <input
                  type="text"
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal on Discover Tab */}
      {bookingModalOpen && selectedBusiness && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 select-none">
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
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {modalConfirmed ? (
              <div className="py-8 text-center space-y-3">
                <h4 className="text-2xl font-bold text-emerald-400">
                  {t(language, 'bookingSuccess')}
                </h4>
                <p className="text-sm text-slate-300">
                  Window: {modalWindow} • {modalService}
                </p>
              </div>
            ) : (
              <form onSubmit={handleModalConfirm} className="space-y-5 text-sm">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                    {t(language, 'selectService')}
                  </label>
                  <div className="space-y-2">
                    {selectedBusiness.popularServices.map((srv, idx) => (
                      <div
                        key={idx}
                        onClick={() => setModalService(srv.name)}
                        className={`p-3.5 rounded-xl border text-sm cursor-pointer flex items-center justify-between transition-all ${
                          modalService === srv.name
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
                        onClick={() => setModalWindow(w)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          modalWindow === w
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
                  className="w-full py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide transition-all mt-4 cursor-pointer"
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
