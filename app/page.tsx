'use client';

import React, { useState } from 'react';
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
import { BusinessProfileView } from '@/components/onboarding/BusinessProfileView';

// Active Views
import { OwnerTopNav } from '@/components/owner/OwnerTopNav';
import { OwnerNavRibbon, OwnerTab } from '@/components/owner/OwnerNavRibbon';
import { OwnerHomeView } from '@/components/owner/OwnerHomeView';
import { OwnerSlotsView } from '@/components/owner/OwnerSlotsView';
import { OwnerAppointmentsView } from '@/components/owner/OwnerAppointmentsView';
import { OwnerEarningsView } from '@/components/owner/OwnerEarningsView';
import { OwnerProfileView } from '@/components/owner/OwnerProfileView';
import { CustomerMapView } from '@/components/customer/CustomerMapView';
import { FullPageAiChatView } from '@/components/ai/FullPageAiChatView';

export type OnboardingStep = 'LANGUAGE' | 'ROLE' | 'VERIFY' | 'PROFILE' | 'COMPLETED';

export default function Home() {
  // Onboarding sequence state (starts at LANGUAGE so the user experiences the detail-taking flow)
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('LANGUAGE');

  const [language, setLanguage] = useState<Language>('en');
  const [currentRole, setCurrentRole] = useState<UserRole>('OWNER');
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('FRONTPAGE');
  const [isSlotsPageOpen, setIsSlotsPageOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Business and Operating State (Default is Rajesh Sharma with his details)
  const [business, setBusiness] = useState<BusinessProfile>(INITIAL_BUSINESS);
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Language toggle (अ / A)
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  // Quick bypass straight to Rajesh Sharma workspace
  const handleQuickEnterRajesh = () => {
    setBusiness(INITIAL_BUSINESS);
    setSlots(INITIAL_SLOTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setCurrentRole('OWNER');
    setOnboardingStep('COMPLETED');
    setOwnerTab('FRONTPAGE');
    setIsSlotsPageOpen(false);
  };

  // Onboarding Step Transitions
  const handleLanguageProceed = () => {
    setOnboardingStep('ROLE');
  };

  const handleRoleProceed = () => {
    setOnboardingStep('VERIFY');
  };

  const handleVerificationProceed = (contact: { phone?: string; email?: string }) => {
    if (contact.email) {
      setBusiness((prev) => ({ ...prev, email: contact.email! }));
    }
    if (contact.phone) {
      setBusiness((prev) => ({ ...prev, phone: contact.phone! }));
    }

    if (currentRole === 'CUSTOMER') {
      setOnboardingStep('COMPLETED');
    } else {
      setOnboardingStep('PROFILE');
    }
  };

  const handleProfileProceed = (newProfile: Partial<BusinessProfile>) => {
    setBusiness((prev) => ({
      ...prev,
      ...newProfile,
    }));
    setOnboardingStep('COMPLETED');
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
      locationId: newSlotData.locationId || business.locations[0].id,
      locationName: newSlotData.locationName || business.locations[0].name,
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

  // 1. ONBOARDING: Step 1 - Choose Language
  if (onboardingStep === 'LANGUAGE') {
    return (
      <LanguageSelectView
        currentLanguage={language}
        onSelectLanguage={setLanguage}
        onProceed={handleLanguageProceed}
        onQuickEnterRajesh={handleQuickEnterRajesh}
      />
    );
  }

  // 1. ONBOARDING: Step 2 - Select Role
  if (onboardingStep === 'ROLE') {
    return (
      <RoleSelectView
        language={language}
        selectedRole={currentRole}
        onSelectRole={setCurrentRole}
        onProceed={handleRoleProceed}
        onBack={() => setOnboardingStep('LANGUAGE')}
        onQuickEnterRajesh={handleQuickEnterRajesh}
      />
    );
  }

  // 1. ONBOARDING: Step 3 - Identity Verification (OTP)
  if (onboardingStep === 'VERIFY') {
    return (
      <VerificationView
        language={language}
        userRole={currentRole}
        onVerified={handleVerificationProceed}
        onBack={() => setOnboardingStep('ROLE')}
        onQuickEnterRajesh={handleQuickEnterRajesh}
      />
    );
  }

  // 1. ONBOARDING: Step 4 - Business Profile (Details Taking Step)
  if (onboardingStep === 'PROFILE') {
    return (
      <BusinessProfileView
        language={language}
        onProfileCompleted={handleProfileProceed}
        onBack={() => setOnboardingStep('VERIFY')}
        onQuickEnterRajesh={handleQuickEnterRajesh}
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
      />
    );
  }

  // 4. ACTIVE WORKSPACE: OPERATOR DESK (Deslot)
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
        onLogout={() => setOnboardingStep('LANGUAGE')}
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
          <OwnerProfileView
            language={language}
            business={business}
            onSwitchToCustomer={() => setCurrentRole('CUSTOMER')}
            onRevisitOnboarding={() => setOnboardingStep('LANGUAGE')}
          />
        )}
      </main>
    </div>
  );
}
