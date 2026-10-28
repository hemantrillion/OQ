import { Language } from './booking-types';

export const DICTIONARY = {
  en: {
    appName: 'Deslot',
    statusOnline: 'Taking Bookings',
    statusOffline: 'Closed for Bookings',
    toggleGoOffline: 'Pause Operations',
    toggleGoOnline: 'Open Operations',
    offlineBlockedTitle: 'Active Bookings in Progress',
    offlineBlockedDesc:
      'You have upcoming confirmed appointments in this current time window. Please fulfill or reschedule them before pausing operations.',

    // Navigation
    navSchedule: 'Schedule & Slots',
    navAppointments: 'Reservations',
    navEarnings: 'Revenue',
    navProfile: 'Identity & Architecture',
    switchToCustomer: 'Client Discovery',
    switchToOwner: 'Operator Desk',

    // Home / Display Workspace
    heroTitle: 'Universal Booking Operations',
    heroSubtitle: 'Manage capacity, dynamic branches, and live bookings seamlessly.',
    aiTriggerPrompt: 'Speak or write instructions to manage capacity, rates, and slots.',
    createSlotTitle: 'Publish New Slot',
    dateLabel: 'Date',
    timeSlotLabel: 'Operating Window',
    stationLabel: 'Assigned Station',
    capacityLabel: 'Concurrent Capacity',
    publishBtn: 'Publish Slot',
    noSlotsMsg: 'No operating slots published for this filter. Create one to begin accepting clients.',

    // Appointments
    appointmentsTitle: 'Client Reservations',
    tabUpcoming: 'Upcoming',
    tabHistory: 'Completed',
    noAppointments: 'No client appointments in this section.',
    markComplete: 'Complete Service',
    cancelBooking: 'Cancel',

    // Earnings
    earningsTitle: 'Financial Performance',
    totalToday: 'Today',
    totalWeek: 'This Week',
    totalMonth: 'This Month',
    cashTotal: 'Cash Settlements',
    onlineTotal: 'Direct UPI & Digital',
    transactionLedger: 'Settlement Register',

    // Profile & Data Architecture
    profileTitle: 'Operator Profile',
    dataArchitectureTitle: 'Data Architecture & Schema',
    dataArchitectureSub: 'Relational blueprint of tables, keys, and joins configured for this business.',
    subviewTable: 'Table Specifications',
    subviewRelationship: '2D Relational Map',

    // Customer
    customerMapTitle: 'Available Booking Points',
    searchPlaceholder: 'Search locations, specialties, or services...',
    bookNow: 'Reserve Slot',
    confirmBooking: 'Confirm Reservation',
    selectSlot: 'Select Window',
    selectService: 'Select Service',
    bookingSuccess: 'Reservation Confirmed',

    // AI Full-Page
    aiChatTitle: 'Operations Intelligence',
    aiChatSubtitle: 'Direct conversational control over slots, rates, and configuration.',
    typeMessagePlaceholder: 'Speak or type any directive (e.g., "Add 3 afternoon slots for Dr. Sharma")...',
  },

  hi: {
    appName: 'Deslot',
    statusOnline: 'बुकिंग चालू है',
    statusOffline: 'बुकिंग बंद है',
    toggleGoOffline: 'सेवा रोकें',
    toggleGoOnline: 'सेवा चालू करें',
    offlineBlockedTitle: 'सक्रिय बुकिंग्स मौजूद हैं',
    offlineBlockedDesc:
      'इस समय में आपकी पुष्टि की गई बुकिंग्स पहले से मौजूद हैं। सेवा रोकने से पहले कृपया उन्हें पूरा करें या नया समय दें।',

    // Navigation
    navSchedule: 'समय एवं स्लॉट',
    navAppointments: 'बुकिंग सूची',
    navEarnings: 'आय विवरण',
    navProfile: 'प्रोफाइल एवं संरचना',
    switchToCustomer: 'ग्राहक खोज',
    switchToOwner: 'संचालक डेस्क',

    // Home / Display Workspace
    heroTitle: 'बुकिंग एवं संसाधन प्रबंधन',
    heroSubtitle: 'क्षमता, स्थान और ग्राहकों की बुकिंग का सुव्यवस्थित संचालन।',
    aiTriggerPrompt: 'स्लॉट, सेवाएं और समय निर्धारित करने के लिए बोलें या लिखें।',
    createSlotTitle: 'नया समय स्लॉट जोड़ें',
    dateLabel: 'तारीख',
    timeSlotLabel: 'समय अंतराल',
    stationLabel: 'स्थान / कुर्सी',
    capacityLabel: 'सीट क्षमता',
    publishBtn: 'स्लॉट प्रकाशित करें',
    noSlotsMsg: 'इस चयन के लिए कोई स्लॉट उपलब्ध नहीं है। नया स्लॉट जोड़ें।',

    // Appointments
    appointmentsTitle: 'ग्राहकों की बुकिंग',
    tabUpcoming: 'आने वाली',
    tabHistory: 'पूरी हो चुकी',
    noAppointments: 'इस श्रेणी में कोई बुकिंग नहीं है।',
    markComplete: 'सेवा पूर्ण दर्ज करें',
    cancelBooking: 'रद्द करें',

    // Earnings
    earningsTitle: 'आय एवं वित्तीय विवरण',
    totalToday: 'आज की आय',
    totalWeek: 'इस सप्ताह',
    totalMonth: 'इस महीने',
    cashTotal: 'नकद भुगतान',
    onlineTotal: 'यूपीआई एवं डिजिटल भुगतान',
    transactionLedger: 'लेनदेन पंजी',

    // Profile & Data Architecture
    profileTitle: 'संचालक विवरण',
    dataArchitectureTitle: 'डेटा संरचना एवं रिलेशनल स्कीमा',
    dataArchitectureSub: 'इस व्यवसाय के लिए कॉन्फ़िगर की गई तालिकाओं, प्राथमिक एवं विदेशी कुंजियों का ब्लूप्रिंट।',
    subviewTable: 'तालिका विवरण',
    subviewRelationship: '2D रिलेशनल मानचित्र',

    // Customer
    customerMapTitle: 'उपलब्ध सेवा केंद्र',
    searchPlaceholder: 'स्थान या सेवा खोजें...',
    bookNow: 'समय बुक करें',
    confirmBooking: 'बुकिंग की पुष्टि करें',
    selectSlot: 'समय चुनें',
    selectService: 'सेवा चुनें',
    bookingSuccess: 'बुकिंग सफलतापूर्वक दर्ज की गई',

    // AI Full-Page
    aiChatTitle: 'संचालन सहायक',
    aiChatSubtitle: 'स्लॉट, दर और कॉन्फ़िगरेशन के लिए प्रत्यक्ष संवाद।',
    typeMessagePlaceholder: 'कोई निर्देश बोलें या लिखें (उदा. "कल दोपहर 3 बजे के 2 नए स्लॉट बनाएं")...',
  },
};

export function t(lang: Language, key: keyof typeof DICTIONARY['en']): string {
  return DICTIONARY[lang][key] || DICTIONARY['en'][key] || String(key);
}
