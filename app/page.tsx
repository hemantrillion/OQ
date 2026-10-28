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

// Onboarding Views
import { LanguageSelectView } from '@/components/onboarding/LanguageSelectView';
import { RoleSelectView } from '@/components/onboarding/RoleSelectView';
import { VerificationView } from '@/components/onboarding/VerificationView';
import { BusinessProfileView } from '@/components/onboarding/BusinessProfileView';

// Customer Portal View
import { CustomerMapView } from '@/components/customer/CustomerMapView';

// Owner Portal Views
import { OwnerTopNav } from '@/components/owner/OwnerTopNav';
import { OwnerNavRibbon, OwnerTab } from '@/components/owner/OwnerNavRibbon';
import { OwnerHomeView } from '@/components/owner/OwnerHomeView';
import { OwnerEarningsView } from '@/components/owner/OwnerEarningsView';
import { OwnerAppointmentsView } from '@/components/owner/OwnerAppointmentsView';
import { OwnerBlueprintView } from '@/components/owner/OwnerBlueprintView';
import { OwnerProfileView } from '@/components/owner/OwnerProfileView';

// Full-Page AI Chat View
import { FullPageAiChatView } from '@/components/ai/FullPageAiChatView';

type OnboardingStep = 'LANGUAGE' | 'ROLE' | 'VERIFY' | 'PROFILE' | 'COMPLETED';

export default function Home() {
  // Onboarding & Global State
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('LANGUAGE');
  const [language, setLanguage] = useState<Language>('en');
  const [currentRole, setCurrentRole] = useState<UserRole>('OWNER');
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('OVERVIEW');
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Core Business Data
  const [business, setBusiness] = useState<BusinessProfile>(INITIAL_BUSINESS);
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Toggle Language between English and Hindi
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  // Online / Offline Toggle with Smart Business Lock
  const handleToggleOnline = (nextState: boolean): boolean => {
    const upcomingCount = appointments.filter((a) => a.status === 'UPCOMING').length;
    if (!nextState && isOnline && upcomingCount > 0) {
      // Cannot go offline if active bookings exist!
      return false;
    }
    setIsOnline(nextState);
    return true;
  };

  // Onboarding Handlers
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

  // Slot Management
  const handleAddSlot = (newSlotData: Partial<Slot>) => {
    const newSlot: Slot = {
      id: `slt_${Date.now()}`,
      locationId: newSlotData.locationId || business.locations[0].id,
      locationName: newSlotData.locationName || business.locations[0].name,
      date: newSlotData.date || '2026-10-29',
      startTime: newSlotData.startTime || '02:00 PM',
      endTime: newSlotData.endTime || '02:45 PM',
      capacity: newSlotData.capacity || 1,
      bookedCount: 0,
      status: 'OPEN',
      assignedStaff: newSlotData.assignedStaff || business.ownerName,
    };
    setSlots((prev) => [...prev, newSlot]);
  };

  // Appointment Status Management
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
      />
    );
  }

  // 1. ONBOARDING: Step 4 - Business Profile (Owner Only)
  if (onboardingStep === 'PROFILE') {
    return (
      <BusinessProfileView
        language={language}
        onProfileCompleted={handleProfileProceed}
        onBack={() => setOnboardingStep('VERIFY')}
      />
    );
  }

  // 2. ACTIVE WORKSPACE: FULL-PAGE AI CHAT (When Orb is clicked)
  if (aiChatOpen) {
    return (
      <FullPageAiChatView
        language={language}
        onClose={() => setAiChatOpen(false)}
        onToggleLanguage={handleToggleLanguage}
      />
    );
  }

  // 3. ACTIVE WORKSPACE: CUSTOMER MAP VIEW
  if (currentRole === 'CUSTOMER') {
    return (
      <CustomerMapView
        language={language}
        onSwitchToOwner={() => setCurrentRole('OWNER')}
        onToggleLanguage={handleToggleLanguage}
      />
    );
  }

  // 4. ACTIVE WORKSPACE: OWNER PORTAL
  const upcomingAppointmentsCount = appointments.filter(
    (a) => a.status === 'UPCOMING'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header */}
      <OwnerTopNav
        language={language}
        business={business}
        appointments={appointments}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        onToggleLanguage={handleToggleLanguage}
        onSwitchToCustomer={() => setCurrentRole('CUSTOMER')}
      />

      {/* Navigation Ribbon Tabs */}
      <OwnerNavRibbon
        language={language}
        activeTab={ownerTab}
        onSelectTab={setOwnerTab}
        badgeCounts={{
          upcomingAppointments: upcomingAppointmentsCount,
          totalSlots: slots.length,
        }}
      />

      {/* Main View Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {ownerTab === 'OVERVIEW' && (
          <OwnerHomeView
            language={language}
            business={business}
            slots={slots}
            appointments={appointments}
            onOpenAiChat={() => setAiChatOpen(true)}
            onAddSlot={handleAddSlot}
          />
        )}

        {ownerTab === 'EARNINGS' && (
          <OwnerEarningsView language={language} />
        )}

        {ownerTab === 'APPOINTMENTS' && (
          <OwnerAppointmentsView
            language={language}
            appointments={appointments}
            onUpdateStatus={handleUpdateAppointmentStatus}
          />
        )}

        {ownerTab === 'BLUEPRINT' && (
          <OwnerBlueprintView language={language} />
        )}

        {ownerTab === 'PROFILE' && (
          <OwnerProfileView
            language={language}
            business={business}
            onSwitchToCustomer={() => setCurrentRole('CUSTOMER')}
          />
        )}
      </main>
    </div>
  );
}
