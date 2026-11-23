'use client';

import React, { useState, useEffect } from 'react';
import {
  Language,
  UserRole,
  BusinessProfile,
  Slot,
  Appointment,
  AppointmentStatus,
} from '@/lib/booking-types';
import {
  INITIAL_BUSINESS,
  INITIAL_SLOTS,
  INITIAL_APPOINTMENTS,
} from '@/lib/booking-data';

// Onboarding Views (The pages that come in between taking details!)
import { LanguageSelectView } from '@/components/onboarding/LanguageSelectView';
import { RoleSelectView } from '@/components/onboarding/RoleSelectView';
import { VerificationView } from '@/components/onboarding/VerificationView';

// Active Views
import { OwnerTopNav } from '@/components/owner/OwnerTopNav';
import { OwnerNavRibbon, OwnerTab } from '@/components/owner/OwnerNavRibbon';
import { OwnerHomeView } from '@/components/owner/OwnerHomeView';
import { OwnerSlotsView } from '@/components/owner/OwnerSlotsView';
import { OwnerAppointmentsView } from '@/components/owner/OwnerAppointmentsView';
import { OwnerEarningsView } from '@/components/owner/OwnerEarningsView';
import { OwnerDiscoverView } from '@/components/owner/OwnerDiscoverView';
import { OwnerBusinessProfileView } from '@/components/owner/OwnerBusinessProfileView';
import { CustomerMapView } from '@/components/customer/CustomerMapView';
import { FullPageAiChatView } from '@/components/ai/FullPageAiChatView';

export type OnboardingStep = 'LANGUAGE' | 'ROLE' | 'VERIFY' | 'COMPLETED';

export default function Home() {
  // Authentication gatekeeping state: locked until signed in via Google or Phone
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Onboarding sequence state (starts at LANGUAGE)
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('LANGUAGE');

  const [language, setLanguage] = useState<Language>('en');
  const [currentRole, setCurrentRole] = useState<UserRole>('OWNER');
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('FRONTPAGE');
  const [isSlotsPageOpen, setIsSlotsPageOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Business and Operating State
  const [business, setBusiness] = useState<BusinessProfile>(INITIAL_BUSINESS);
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Browser History & Native Back/Forward Navigation with Strict Auth Gatekeeping
  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.title = 'OQ';

    // Check existing authenticated session in storage
    const sessionAuth = sessionStorage.getItem('oq_authenticated') === 'true';
    setIsAuthenticated(sessionAuth);

    // Read persisted profile from local storage if available
    try {
      const stored = localStorage.getItem('oq_active_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        let loadedAvatar = parsed.avatarUrl;
        if (loadedAvatar && loadedAvatar.startsWith('/avatars/')) {
          loadedAvatar = `/oq${loadedAvatar}`;
        }
        setBusiness((prev) => ({
          ...prev,
          ownerName: parsed.ownerName || prev.ownerName,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          avatarUrl: loadedAvatar || prev.avatarUrl,
          name: parsed.name || prev.name,
        }));
      }
    } catch {
      // ignore
    }

    // Initial sync from URL search parameters (?step=role, ?step=verify)
    const params = new URLSearchParams(window.location.search);
    const googleAuthSuccess = params.get('google_auth') === 'success';
    const googleEmail = params.get('email');
    const googleName = params.get('name');
    const googleAvatar = params.get('avatarUrl');

    // Handle return from official Google OAuth flow
    if (googleAuthSuccess && googleEmail) {
      const newProfile = {
        email: googleEmail,
        ownerName: googleName || googleEmail.split('@')[0],
        avatarUrl: googleAvatar || '',
        phone: '',
        name: '',
      };
      try {
        sessionStorage.setItem('oq_authenticated', 'true');
        localStorage.setItem('oq_active_profile', JSON.stringify(newProfile));
      } catch {}
      setBusiness((prev) => ({
        ...prev,
        ...newProfile,
      }));
      setIsAuthenticated(true);
      setOnboardingStep('COMPLETED');
      window.history.replaceState({ step: 'COMPLETED' }, '', window.location.pathname + '?step=completed');
      return;
    }

    const stepParam = params.get('step')?.toUpperCase();

    if (sessionAuth && stepParam === 'COMPLETED') {
      setOnboardingStep('COMPLETED');
    } else if (stepParam === 'ROLE') {
      setOnboardingStep('ROLE');
    } else if (stepParam === 'VERIFY') {
      setOnboardingStep('VERIFY');
    } else {
      // Unauthenticated users are strictly locked to the onboarding flow
      setOnboardingStep('LANGUAGE');
      if (!window.history.state?.step) {
        window.history.replaceState({ step: 'LANGUAGE' }, '', window.location.pathname);
      }
    }

    // Popstate listener: Native browser Back & Forward button handling
    const handlePopState = (event: PopStateEvent) => {
      const isAuthed = sessionStorage.getItem('oq_authenticated') === 'true';
      const targetStep = event.state?.step;

      if (targetStep === 'COMPLETED' && !isAuthed) {
        setOnboardingStep('VERIFY');
        return;
      }

      if (targetStep && ['LANGUAGE', 'ROLE', 'VERIFY', 'COMPLETED'].includes(targetStep)) {
        setOnboardingStep(targetStep as OnboardingStep);
      } else {
        const p = new URLSearchParams(window.location.search);
        const s = p.get('step')?.toUpperCase();
        if (s === 'COMPLETED' && !isAuthed) setOnboardingStep('VERIFY');
        else if (s === 'ROLE') setOnboardingStep('ROLE');
        else if (s === 'VERIFY') setOnboardingStep('VERIFY');
        else if (s === 'COMPLETED') setOnboardingStep('COMPLETED');
        else setOnboardingStep('LANGUAGE');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize real bookings from SQLite database every 4 seconds
  useEffect(() => {
    async function syncBookings() {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings) && data.bookings.length > 0) {
          const mapped: Appointment[] = data.bookings.map((b: any) => ({
            id: b.id,
            customerName: b.customer_name || 'Patient',
            customerPhone: b.customer_phone || '',
            customerEmail: b.customer_email || '',
            serviceName: b.service_name,
            serviceHindiName: b.service_name,
            price: 500,
            slotId: b.station_id || 'st_1',
            date: b.booking_date,
            time: b.start_time,
            locationId: 'loc_main',
            locationName: 'Apex ENT & Blood Lab',
            status: b.status === 'CONFIRMED' ? 'UPCOMING' : (b.status as any),
            paymentStatus: 'PAID',
            createdAt: b.created_at || new Date().toISOString(),
          }));
          setAppointments(mapped);
        }
      } catch (err) {
        console.error('Failed to sync live bookings:', err);
      }
    }

    syncBookings();
    const interval = setInterval(syncBookings, 4000);
    return () => clearInterval(interval);
  }, []);

  const navigateToStep = (nextStep: OnboardingStep) => {
    setOnboardingStep(nextStep);
    if (typeof window !== 'undefined') {
      const url =
        nextStep === 'COMPLETED' || nextStep === 'LANGUAGE'
          ? window.location.pathname
          : `${window.location.pathname}?step=${nextStep.toLowerCase()}`;
      window.history.pushState({ step: nextStep }, '', url);
    }
  };

  // Language toggle (अ / A)
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  // Onboarding Step Transitions (uses browser history)
  const handleLanguageProceed = () => {
    navigateToStep('ROLE');
  };

  const handleRoleProceed = () => {
    navigateToStep('VERIFY');
  };

  const handleVerificationProceed = (contact: { phone?: string; email?: string; name?: string; avatarUrl?: string }) => {
    let resolvedAvatar = contact.avatarUrl || business.avatarUrl;
    if (resolvedAvatar && resolvedAvatar.startsWith('/avatars/')) {
      resolvedAvatar = `/oq${resolvedAvatar}`;
    }

    setBusiness((prev) => {
      const updated = {
        ...prev,
        email: contact.email || prev.email,
        phone: contact.phone || prev.phone,
        ownerName: contact.name || prev.ownerName,
        avatarUrl: resolvedAvatar || prev.avatarUrl,
      };
      try {
        localStorage.setItem(
          'oq_active_profile',
          JSON.stringify({
            ownerName: updated.ownerName,
            email: updated.email,
            phone: updated.phone,
            avatarUrl: updated.avatarUrl,
            name: updated.name,
            authProvider: 'google',
          })
        );
      } catch {
        // ignore
      }
      return updated;
    });

    // Authenticated: Grant access and unlock workspace
    try {
      sessionStorage.setItem('oq_authenticated', 'true');
    } catch {
      // ignore
    }
    setIsAuthenticated(true);
    navigateToStep('COMPLETED');
  };

  // Online / Offline toggle direct
  const handleToggleOnline = (nextState: boolean) => {
    setIsOnline(nextState);
  };

  // Offline cancellation notice execution
  const handleCancelBookingsAndGoOffline = (cancelledIds: string[], emailBody: string) => {
    setAppointments((prev) =>
      prev.map((a) => (cancelledIds.includes(a.id) ? { ...a, status: 'CANCELLED' } : a))
    );
    setIsOnline(false);
  };

  // Add new operating slot
  const handleAddSlot = (newSlotData: Partial<Slot>) => {
    const newSlot: Slot = {
      id: `slt_${Date.now()}`,
      locationId: newSlotData.locationId || business.locations[0]?.id || 'loc_main',
      locationName: newSlotData.locationName || business.locations[0]?.name || 'Main Station',
      jobProfile: newSlotData.jobProfile || 'Standard Service',
      date: newSlotData.date || '2026-10-30',
      startTime: newSlotData.startTime || '11:00 AM',
      endTime: newSlotData.endTime || '11:45 AM',
      capacity: newSlotData.capacity || 2,
      bookedCount: 0,
      status: 'OPEN',
      assignedStaff: newSlotData.assignedStaff || business.ownerName,
    };
    setSlots((prev) => [newSlot, ...prev]);
  };

  // Configure New Venture (Naya Rozgar)
  const handleConfigureNewBusiness = (venture: { name: string; sector: string; address: string }) => {
    const newLoc = {
      id: `loc_${Date.now()}`,
      name: `${venture.name} (Station 1)`,
      address: venture.address || 'Central Plaza',
      city: 'Pune',
      lat: 18.5204,
      lng: 73.8567,
      isPrimary: false,
    };

    setBusiness((prev) => ({
      ...prev,
      locations: [...prev.locations, newLoc],
    }));
  };

  // Update appointment status
  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('oq_authenticated');
      localStorage.removeItem('oq_active_profile');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    navigateToStep('LANGUAGE');
  };

  // STRICT AUTHENTICATION GATEKEEPING:
  // Without sign in through Google or phone number, no one must be able to view any page inside in any way possible.
  if (!isAuthenticated || onboardingStep !== 'COMPLETED') {
    if (onboardingStep === 'ROLE') {
      return (
        <RoleSelectView
          language={language}
          selectedRole={currentRole}
          onSelectRole={setCurrentRole}
          onProceed={handleRoleProceed}
          onToggleLanguage={handleToggleLanguage}
        />
      );
    }

    if (onboardingStep === 'VERIFY') {
      return (
        <VerificationView
          language={language}
          userRole={currentRole}
          onVerified={handleVerificationProceed}
          onToggleLanguage={handleToggleLanguage}
        />
      );
    }

    return (
      <LanguageSelectView
        currentLanguage={language}
        onSelectLanguage={setLanguage}
        onProceed={handleLanguageProceed}
      />
    );
  }

  // 2. ACTIVE WORKSPACE: FULL-PAGE AI CHAT (Living Water Orb Interaction)
  if (aiChatOpen) {
    return (
      <FullPageAiChatView
        language={language}
        onClose={() => setAiChatOpen(false)}
        onToggleLanguage={handleToggleLanguage}
      />
    );
  }

  // 3. ACTIVE WORKSPACE: CUSTOMER PORTAL VIEW (ग्राहक द्वार)
  if (currentRole === 'CUSTOMER') {
    return (
      <CustomerMapView
        language={language}
        onSwitchToOwner={() => setCurrentRole('OWNER')}
        onToggleLanguage={handleToggleLanguage}
        userName={business.ownerName}
        userEmail={business.email}
        avatarUrl={business.avatarUrl}
        onLogout={handleLogout}
      />
    );
  }

  // 4. ACTIVE WORKSPACE: OPERATOR DESK (OQ)
  const upcomingCount = appointments.filter((a) => a.status === 'UPCOMING').length;

  return (
    <div className="min-h-screen flex flex-col select-none">
      {/* Top Header */}
      <OwnerTopNav
        language={language}
        business={business}
        appointments={appointments}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        onCancelBookingsAndGoOffline={handleCancelBookingsAndGoOffline}
        onToggleLanguage={handleToggleLanguage}
        onSwitchToCustomer={() => setCurrentRole('CUSTOMER')}
        onLogout={handleLogout}
      />

      {/* Navigation Ribbon (No dividing horizontal lines) */}
      <OwnerNavRibbon
        language={language}
        activeTab={ownerTab}
        onSelectTab={(tab) => {
          setOwnerTab(tab);
          setIsSlotsPageOpen(false);
        }}
        badgeCounts={{
          upcomingAppointments: upcomingCount,
        }}
      />

      {/* Main Single Continuous Surface */}
      <main className="flex-1 flex flex-col">
        {ownerTab === 'FRONTPAGE' && !isSlotsPageOpen && (
          <OwnerHomeView
            language={language}
            business={business}
            onNavigateToSlots={() => setIsSlotsPageOpen(true)}
            onOpenCreateSlot={() => setIsSlotsPageOpen(true)}
            onOpenAiChat={() => setAiChatOpen(true)}
            onConfigureNewBusiness={handleConfigureNewBusiness}
          />
        )}

        {/* Dedicated Slots Page (Accessible only from Frontpage) */}
        {ownerTab === 'FRONTPAGE' && isSlotsPageOpen && (
          <OwnerSlotsView
            language={language}
            business={business}
            slots={slots}
            onBackToFrontpage={() => setIsSlotsPageOpen(false)}
            onAddSlot={handleAddSlot}
          />
        )}

        {ownerTab === 'APPOINTMENTS' && (
          <OwnerAppointmentsView
            language={language}
            appointments={appointments}
            onUpdateStatus={handleUpdateAppointmentStatus}
          />
        )}

        {ownerTab === 'EARNINGS' && (
          <OwnerEarningsView language={language} />
        )}

        {ownerTab === 'OPERATOR' && (
          <OwnerDiscoverView language={language} />
        )}

        {(ownerTab === 'PROFILE' || (ownerTab as any) === 'BUSINESS_PROFILE') && (
          <OwnerBusinessProfileView
            language={language}
            business={business}
            onUpdateBusiness={(updated) => {
              setBusiness((prev) => ({ ...prev, ...updated }));
            }}
            onSwitchToCustomer={() => setCurrentRole('CUSTOMER')}
          />
        )}
      </main>
    </div>
  );
}

