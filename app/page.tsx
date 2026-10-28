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

// Views
import { OwnerTopNav } from '@/components/owner/OwnerTopNav';
import { OwnerNavRibbon, OwnerTab } from '@/components/owner/OwnerNavRibbon';
import { OwnerHomeView } from '@/components/owner/OwnerHomeView';
import { OwnerAppointmentsView } from '@/components/owner/OwnerAppointmentsView';
import { OwnerEarningsView } from '@/components/owner/OwnerEarningsView';
import { OwnerProfileView } from '@/components/owner/OwnerProfileView';
import { CustomerMapView } from '@/components/customer/CustomerMapView';
import { FullPageAiChatView } from '@/components/ai/FullPageAiChatView';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentRole, setCurrentRole] = useState<UserRole>('OWNER');
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('SCHEDULE');
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Business and Operating State
  const [business] = useState<BusinessProfile>(INITIAL_BUSINESS);
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Language toggle (अ / A)
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  // Online / Offline toggle with smart booking lock
  const handleToggleOnline = (nextState: boolean): boolean => {
    const upcomingCount = appointments.filter((a) => a.status === 'UPCOMING').length;
    if (!nextState && isOnline && upcomingCount > 0) {
      return false;
    }
    setIsOnline(nextState);
    return true;
  };

  // Add new operating slot
  const handleAddSlot = (newSlotData: Partial<Slot>) => {
    const newSlot: Slot = {
      id: `slt_${Date.now()}`,
      locationId: newSlotData.locationId || business.locations[0].id,
      locationName: newSlotData.locationName || business.locations[0].name,
      date: newSlotData.date || '2026-10-30',
      startTime: newSlotData.startTime || '11:00 AM',
      endTime: newSlotData.endTime || '11:45 AM',
      capacity: newSlotData.capacity || 1,
      bookedCount: 0,
      status: 'OPEN',
      assignedStaff: newSlotData.assignedStaff || business.ownerName,
    };
    setSlots((prev) => [newSlot, ...prev]);
  };

  // Update appointment status
  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  // Full-Page AI View (Living Water Orb Interaction)
  if (aiChatOpen) {
    return (
      <FullPageAiChatView
        language={language}
        onClose={() => setAiChatOpen(false)}
        onToggleLanguage={handleToggleLanguage}
      />
    );
  }

  // Client Discovery Map View
  if (currentRole === 'CUSTOMER') {
    return (
      <CustomerMapView
        language={language}
        onSwitchToOwner={() => setCurrentRole('OWNER')}
        onToggleLanguage={handleToggleLanguage}
      />
    );
  }

  // Operator Workspace: Deslot
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
        onToggleLanguage={handleToggleLanguage}
        onSwitchToCustomer={() => setCurrentRole('CUSTOMER')}
      />

      {/* Navigation Ribbon */}
      <OwnerNavRibbon
        language={language}
        activeTab={ownerTab}
        onSelectTab={setOwnerTab}
        badgeCounts={{
          upcomingAppointments: upcomingCount,
        }}
      />

      {/* Main Single Continuous Surface */}
      <main className="flex-1 flex flex-col">
        {ownerTab === 'SCHEDULE' && (
          <OwnerHomeView
            language={language}
            business={business}
            slots={slots}
            appointments={appointments}
            onOpenAiChat={() => setAiChatOpen(true)}
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
