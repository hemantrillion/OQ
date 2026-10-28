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

// Views
import { StartView } from '@/components/auth/StartView';
import { OwnerTopNav } from '@/components/owner/OwnerTopNav';
import { OwnerNavRibbon, OwnerTab } from '@/components/owner/OwnerNavRibbon';
import { OwnerHomeView } from '@/components/owner/OwnerHomeView';
import { OwnerSlotsView } from '@/components/owner/OwnerSlotsView';
import { OwnerAppointmentsView } from '@/components/owner/OwnerAppointmentsView';
import { OwnerEarningsView } from '@/components/owner/OwnerEarningsView';
import { OwnerProfileView } from '@/components/owner/OwnerProfileView';
import { CustomerMapView } from '@/components/customer/CustomerMapView';
import { FullPageAiChatView } from '@/components/ai/FullPageAiChatView';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
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

  // Language toggle (अ / A)
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  // Online / Offline toggle direct
  const handleToggleOnline = (nextState: boolean) => {
    setIsOnline(nextState);
  };

  // Offline cancellation notice execution
  const handleCancelBookingsAndGoOffline = (cancelledIds: string[], emailBody: string) => {
    // Mark affected appointments cancelled
    setAppointments((prev) =>
      prev.map((a) => (cancelledIds.includes(a.id) ? { ...a, status: 'CANCELLED' } : a))
    );
    // Put operations offline
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

  // 1. Logged Out View (Start View)
  if (!isLoggedIn) {
    return (
      <StartView
        language={language}
        onEnterApp={(role) => {
          setCurrentRole(role);
          setIsLoggedIn(true);
        }}
        onToggleLanguage={handleToggleLanguage}
      />
    );
  }

  // 2. Full-Page AI View (Living Water Orb Interaction)
  if (aiChatOpen) {
    return (
      <FullPageAiChatView
        language={language}
        onClose={() => setAiChatOpen(false)}
        onToggleLanguage={handleToggleLanguage}
      />
    );
  }

  // 3. Customer Portal View (ग्राहक द्वार)
  if (currentRole === 'CUSTOMER') {
    return (
      <CustomerMapView
        language={language}
        onSwitchToOwner={() => setCurrentRole('OWNER')}
        onToggleLanguage={handleToggleLanguage}
      />
    );
  }

  // 4. Operator Workspace: Deslot
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
        onLogout={() => setIsLoggedIn(false)}
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
          />
        )}
      </main>
    </div>
  );
}
