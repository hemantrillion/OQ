'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Mail, Phone, User, Stethoscope, TestTube2, ArrowRight } from 'lucide-react';

interface SlotOption {
  time: string;
  status: 'AVAILABLE' | 'BOOKED';
}

interface ServiceItem {
  name: string;
  type: 'CLINICAL' | 'LAB_TEST';
  duration: number;
  price: number;
  description: string;
}

const CLINIC_SERVICES: ServiceItem[] = [
  {
    name: 'ENT General Consultation',
    type: 'CLINICAL',
    duration: 15,
    price: 500,
    description: 'Comprehensive examination of ear, nose, throat, and vocal cords by an ENT specialist doctor.',
  },
  {
    name: 'Ear Microsuction / Wax Cleaning',
    type: 'CLINICAL',
    duration: 20,
    price: 700,
    description: 'Gentle, microscope-guided suction cleaning for ear canal blockage and impacted wax.',
  },
  {
    name: 'Diagnostic Nasal Endoscopy',
    type: 'CLINICAL',
    duration: 25,
    price: 1200,
    description: 'High-definition fiberoptic endoscopy for chronic sinusitis, nasal polyps, and breathing obstruction.',
  },
  {
    name: 'Hearing Test / Audiometry',
    type: 'CLINICAL',
    duration: 30,
    price: 800,
    description: 'Pure-tone audiometry inside sound-treated booth for precise hearing threshold assessment.',
  },
  {
    name: 'Complete Blood Count (CBC)',
    type: 'LAB_TEST',
    duration: 0,
    price: 350,
    description: '24-parameter automated hemogram evaluating hemoglobin, RBC, platelets, and infection markers.',
  },
  {
    name: 'Thyroid Profile (T3, T4, TSH)',
    type: 'LAB_TEST',
    duration: 0,
    price: 600,
    description: 'Complete chemiluminescent immunoassay assessing endocrine and thyroid gland function.',
  },
  {
    name: 'HbA1c & Fasting Blood Sugar',
    type: 'LAB_TEST',
    duration: 0,
    price: 450,
    description: '3-month glycation index and plasma glucose profiling for diabetes management.',
  },
  {
    name: 'Allergy Blood Panel',
    type: 'LAB_TEST',
    duration: 0,
    price: 1500,
    description: 'Specific IgE screening against common environmental allergens, pollen, dust, and molds.',
  },
];

export default function PatientBookingPage() {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CLINICAL' | 'LAB_TEST'>('ALL');
  const [selectedService, setSelectedService] = useState<ServiceItem>(CLINIC_SERVICES[0]);
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Patient inputs
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Load slots for the selected date
  useEffect(() => {
    async function fetchSlots() {
      setIsLoadingSlots(true);
      try {
        const res = await fetch(`/api/slots?date=${bookingDate}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.slots)) {
          setSlots(data.slots);
          const firstAvailable = data.slots.find((s: any) => s.status === 'AVAILABLE');
          if (firstAvailable) {
            setSelectedTime(firstAvailable.time);
          }
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
      } finally {
        setIsLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [bookingDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!patientEmail.trim() && !patientPhone.trim()) {
      setErrorMessage('Please provide an email or phone number for appointment confirmation.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: patientName,
          customer_phone: patientPhone,
          customer_email: patientEmail,
          service_name: selectedService.name,
          booking_date: bookingDate,
          start_time: selectedTime,
          price: selectedService.price,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingResult(data.booking || data);
      } else {
        setErrorMessage(data.error || 'Failed to complete booking.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred while booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredServices = CLINIC_SERVICES.filter(
    (s) => selectedCategory === 'ALL' || s.type === selectedCategory
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              OQ
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">Apex ENT Specialist Clinic &amp; Blood Lab</h1>
              <p className="text-xs text-slate-500">Outpatient Doctor Consultations &amp; Diagnostic Pathology</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Open Today: 08:00 AM – 08:00 PM
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {bookingResult ? (
          /* Confirmation Card */
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-8 max-w-xl mx-auto text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Appointment Confirmed!</h2>
              <p className="text-sm text-slate-600 mt-1">
                Your reservation has been secured in our scheduling engine.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-left space-y-2.5 text-sm">
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Booking Reference:</span>
                <span className="font-mono font-bold text-slate-900">{bookingResult.id || bookingResult.booking_id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-slate-900">{bookingResult.customer_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Service / Test:</span>
                <span className="font-semibold text-slate-900">{bookingResult.service_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500">Date &amp; Time:</span>
                <span className="font-semibold text-slate-900">{bookingResult.booking_date} at {bookingResult.start_time}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Status:</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                  {bookingResult.status || 'CONFIRMED'}
                </span>
              </div>
            </div>

            {bookingResult.email_notification_sent && (
              <div className="p-3 bg-sky-50 text-sky-800 text-xs rounded-lg border border-sky-200 flex items-center gap-2 text-left">
                <Mail className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Confirmation email dispatched instantly via Resend API to your inbox.</span>
              </div>
            )}

            <button
              onClick={() => {
                setBookingResult(null);
                setPatientName('');
              }}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition"
            >
              Book Another Appointment
            </button>
          </div>
        ) : (
          /* Booking Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Service & Slot Selection (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Category Switcher */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">1. Select Service or Lab Test</h2>
                  <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('ALL')}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        selectedCategory === 'ALL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      All (8)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('CLINICAL')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                        selectedCategory === 'CLINICAL' ? 'bg-white shadow-sm text-sky-700' : 'text-slate-600'
                      }`}
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      ENT Consultations
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('LAB_TEST')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                        selectedCategory === 'LAB_TEST' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-600'
                      }`}
                    >
                      <TestTube2 className="w-3.5 h-3.5" />
                      Blood Tests
                    </button>
                  </div>
                </div>

                {/* Offerings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {filteredServices.map((svc) => {
                    const isSelected = selectedService.name === svc.name;
                    return (
                      <div
                        key={svc.name}
                        onClick={() => setSelectedService(svc)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition relative ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              svc.type === 'CLINICAL'
                                ? 'bg-sky-100 text-sky-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {svc.type === 'CLINICAL' ? 'Doctor Visit' : 'Diagnostic Lab'}
                          </span>
                          <span className="text-sm font-bold text-slate-900 font-mono">₹{svc.price}</span>
                        </div>
                        <h3 className="font-semibold text-slate-900 text-sm mt-2">{svc.name}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{svc.description}</p>
                        {svc.duration > 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{svc.duration} mins</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date & Slot Picker */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">2. Choose Arrival Date &amp; Time</h2>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  />
                </div>

                {isLoadingSlots ? (
                  <div className="py-8 text-center text-xs text-slate-400">Loading live chamber availability...</div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">Available time slots for {selectedService.name}:</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                      {slots.map((s) => {
                        const isAvailable = s.status === 'AVAILABLE';
                        const isChosen = selectedTime === s.time;
                        return (
                          <button
                            key={s.time}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => setSelectedTime(s.time)}
                            className={`py-2 px-1 text-xs rounded-lg font-mono font-semibold transition ${
                              isChosen
                                ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-300'
                                : isAvailable
                                ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-transparent'
                            }`}
                          >
                            {s.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Patient Info & Summary (1 col) */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <h2 className="text-base font-bold text-slate-900">3. Patient Information</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hemant Kumar"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (for instant ticket)</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Selected Item:</span>
                      <span className="font-semibold text-slate-800">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date &amp; Time:</span>
                      <span className="font-semibold text-slate-800">{bookingDate} @ {selectedTime}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                      <span className="font-bold text-slate-900">Total Fee:</span>
                      <span className="font-bold text-sky-700 font-mono">₹{selectedService.price}</span>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Map Location Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <h3 className="text-xs font-bold text-slate-900">Clinic Location &amp; Directions</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ground Floor, Health Plaza, Near Metro Pillar 142, Main Ring Road, Delhi NCR
                </p>

                {/* OpenStreetMap Embed */}
                <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
                  <iframe
                    title="Clinic OpenStreetMap Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src="https://www.openstreetmap.org/export/embed.html?bbox=77.2000%2C28.6000%2C77.2300%2C28.6300&layer=mapnik&marker=28.6139%2C77.2090"
                    className="border-0 w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
