import { Language } from './booking-types';

export const DICTIONARY = {
  en: {
    // Brand & App
    appName: 'Booking Management System',
    appSubtitle: 'Universal Resource & Appointment Platform',

    // Language Selector
    chooseLanguage: 'Choose Your Language',
    chooseLanguageSub: 'अपनी भाषा का चयन करें (Select your preferred language)',
    english: 'English',
    hindi: 'हिंदी (Hindi)',
    continueBtn: 'Continue',

    // Role Selection
    selectRoleTitle: 'How will you use this platform?',
    selectRoleSub: 'Select your account role to proceed with setup',
    roleCustomer: 'Customer / Client',
    roleCustomerDesc: 'Discover nearby services on the map and book appointments instantly.',
    roleOwner: 'Business Owner / Provider',
    roleOwnerDesc: 'Manage your time slots, multiple locations, staff, earnings, and appointments.',

    // Verification
    verificationTitle: 'Verify Your Identity',
    verificationSubMobile: 'Enter your phone number to receive a one-time verification code.',
    verificationSubPc: 'Enter your work email address to sync your account across desktop and laptop devices.',
    phoneLabel: 'Mobile Phone Number',
    emailLabel: 'Email Address',
    phonePlaceholder: '+91 98765 43210',
    emailPlaceholder: 'owner@business.com',
    sendOtpBtn: 'Send One-Time Passcode (OTP)',
    otpLabel: 'Enter 6-Digit OTP',
    otpPlaceholder: '123456',
    verifyBtn: 'Verify & Proceed',
    otpHint: 'Demo Mode: Any 6 digits (e.g. 123456) will verify immediately.',
    deviceNoticeMobile: 'Mobile optimization active: Fast touch verification enabled.',
    deviceNoticePc: 'Desktop workspace: Email account linking ensures cross-device sync.',

    // Business Profiling
    profileSetupTitle: 'Tell Us About Your Business',
    profileSetupSub: 'This unalterable profile helps our configuration engine tailor your system.',
    entityTypeLabel: 'Business Structure',
    typeIndividual: 'Individual / Solo Practitioner (e.g. 1-chair barber, private clinic)',
    typeCompany: 'Registered Company / Multi-person Organization',
    businessNameLabel: 'Business / Shop / Clinic Name',
    businessNamePlaceholder: 'e.g. Modern Cuts Grooming or City Health Clinic',
    ownerNameLabel: 'Owner / Practitioner Full Name',
    ownerNamePlaceholder: 'e.g. Rajesh Kumar or Dr. Ananya Sharma',
    sectorLabel: 'Profession / Business Sector',
    sectorBarber: 'Barber, Salon & Grooming',
    sectorClinic: 'Medical Clinic & Doctor Practice',
    sectorRestaurant: 'Dining, Bistro & Cafe Reservations',
    sectorRepair: 'Technical Service & Repair Shop',
    sectorGeneral: 'Other Professional Services',
    primaryLocationLabel: 'Primary Operating Location',
    primaryLocationPlaceholder: 'e.g. Shop 4, Market Complex, MG Road, Pune',
    finishSetupBtn: 'Complete Setup & Open Workspace',

    // Owner Navigation
    navHome: 'Overview',
    navEarnings: 'Earnings',
    navAppointments: 'Appointments',
    navBlueprint: 'Data & Schema',
    navProfile: 'Profile',
    switchToCustomer: 'Customer View',
    switchToOwner: 'Owner Dashboard',

    // Online / Offline Switch
    statusOnline: 'Online & Taking Bookings',
    statusOffline: 'Currently Offline',
    toggleGoOffline: 'Go Offline',
    toggleGoOnline: 'Go Online',
    offlineBlockedTitle: 'Cannot Go Offline Now',
    offlineBlockedDesc:
      'You have 2 confirmed customer appointments booked in your active slot. You cannot go offline until active bookings are completed or rescheduled.',

    // Home / Overview Tab
    todayBookings: "Today's Bookings",
    occupancyRate: 'Slot Occupancy',
    activeLocations: 'Active Locations',
    estimatedRevenue: "Today's Revenue",
    slotManagerTitle: 'Time Slots & Multi-Location Schedule',
    slotManagerSub: 'Create slots and assign them to specific chairs, rooms, or branch locations.',
    addSlotBtn: 'Create New Slot',
    locationSelector: 'Filter by Location',
    allLocations: 'All Locations',
    slotOpen: 'Open',
    slotBooked: 'Booked',
    slotLocked: 'Locked',
    bookSlotDirect: 'Book for Walk-In',

    // Big AI Orb
    aiOrbTitle: 'AI Business Assistant',
    aiOrbHint: 'Tap to open full-page voice & text command center',

    // Earnings Tab
    earningsTitle: 'Revenue & Earnings Overview',
    earningsSub: 'Track cash, online UPI payments, and daily transaction volume.',
    totalToday: 'Total Today',
    totalWeek: 'This Week',
    totalMonth: 'This Month',
    paymentBreakdown: 'Payment Method Breakdown',
    cashTotal: 'Cash in Hand',
    onlineTotal: 'Online / UPI Settlements',
    transactionLedger: 'Recent Transactions',
    colCustomer: 'Customer',
    colService: 'Service',
    colAmount: 'Amount',
    colMethod: 'Method',
    colTime: 'Time',
    colStatus: 'Status',

    // Appointments Tab
    appointmentsTitle: 'Bookings & Schedule',
    appointmentsSub: 'Manage upcoming reservations and review completed service history.',
    tabUpcoming: 'Upcoming (Active)',
    tabHistory: 'Completed History',
    noAppointments: 'No appointments in this category.',
    markComplete: 'Mark Completed',
    cancelBooking: 'Cancel',

    // Blueprint / Schema Tab
    blueprintTitle: 'Data Structure & Schema Architecture',
    blueprintSub:
      'Inspect your relational database design. Toggle between the stacked Table View and the interactive 2D Relationship Map.',
    subviewTable: 'Table View',
    subviewRelationship: 'Key & Relationship View (2D Map)',
    tableCount: 'Tables Configured',
    foreignKeysCount: 'Relational Joins',
    primaryKey: 'PK',
    foreignKey: 'FK',
    references: 'references',

    // Customer View
    customerMapTitle: 'Find & Book Nearby Services',
    customerMapSub: 'Explore certified businesses with available slots today.',
    searchPlaceholder: 'Search by barber, doctor, cafe, or location...',
    filterAll: 'All Sectors',
    bookNow: 'Book Appointment',
    confirmBooking: 'Confirm Reservation',
    selectSlot: 'Select Time Slot',
    selectService: 'Select Service',
    bookingSuccess: 'Reservation Confirmed Successfully!',

    // AI Full-Page Chat
    aiChatTitle: 'Intelligent Configuration & Operation Engine',
    aiChatSubtitle: 'Conversational assistant with zero direct database exposure.',
    backToDashboard: 'Back to Dashboard',
    voiceModeActive: 'Voice Mode Active — Listening...',
    clickToSpeak: 'Hold or tap mic to speak',
    typeMessagePlaceholder: 'Type a command or question (e.g. "Add 3 afternoon slots at downtown branch")...',
    send: 'Send',
    samplePromptsTitle: 'Common Prompts & Directives',
  },

  hi: {
    // Brand & App
    appName: 'बुकिंग प्रबंधन प्रणाली',
    appSubtitle: 'व्यापार एवं अपॉइंटमेंट प्रबंधन प्लेटफॉर्म',

    // Language Selector
    chooseLanguage: 'अपनी भाषा चुनें',
    chooseLanguageSub: 'Select your preferred language (अपनी पसंदीदा भाषा चुनें)',
    english: 'English (अंग्रेज़ी)',
    hindi: 'हिंदी',
    continueBtn: 'आगे बढ़ें',

    // Role Selection
    selectRoleTitle: 'आप इस प्लेटफॉर्म का उपयोग कैसे करेंगे?',
    selectRoleSub: 'शुरुआत करने के लिए अपनी भूमिका का चयन करें',
    roleCustomer: 'ग्राहक (Customer)',
    roleCustomerDesc: 'नक्शे पर नज़दीकी दुकानों और डॉक्टरों को देखें और तुरंत स्लॉट बुक करें।',
    roleOwner: 'व्यवसायी / दुकान मालिक (Owner)',
    roleOwnerDesc: 'अपने समय के स्लॉट, कई स्थान, कमाई, और ग्राहकों की बुकिंग संभालें।',

    // Verification
    verificationTitle: 'अपनी पहचान सत्यापित करें',
    verificationSubMobile: 'वन-टाइम पासकोड (OTP) प्राप्त करने के लिए अपना मोबाइल नंबर दर्ज करें।',
    verificationSubPc: 'कंप्यूटर और लैपटॉप पर सिंक रखने के लिए अपना कार्य ईमेल दर्ज करें।',
    phoneLabel: 'मोबाइल फोन नंबर',
    emailLabel: 'ईमेल पता',
    phonePlaceholder: '+91 98765 43210',
    emailPlaceholder: 'owner@business.com',
    sendOtpBtn: 'ओटीपी (OTP) भेजें',
    otpLabel: '6-अंकीय ओटीपी दर्ज करें',
    otpPlaceholder: '123456',
    verifyBtn: 'सत्यापित करें और आगे बढ़ें',
    otpHint: 'डेमो मोड: कोई भी 6 अंक (जैसे 123456) तुरंत सत्यापित हो जाएंगे।',
    deviceNoticeMobile: 'मोबाइल मोड: त्वरित टच सत्यापन सक्रिय है।',
    deviceNoticePc: 'डेस्कटॉप मोड: ईमेल खाता जोड़ने से कंप्यूटर पर तुरंत डेटा सिंक होता है।',

    // Business Profiling
    profileSetupTitle: 'अपने व्यवसाय की जानकारी दें',
    profileSetupSub: 'यह स्थायी जानकारी हमारे कॉन्फ़िगरेशन इंजन को आपकी प्रणाली तैयार करने में मदद करती है।',
    entityTypeLabel: 'व्यवसाय का प्रकार',
    typeIndividual: 'व्यक्तिगत / एकल व्यवसायी (उदा. 1-कुर्सी नाई, निजी डॉक्टर)',
    typeCompany: 'पंजीकृत कंपनी / बहु-व्यक्ति संगठन',
    businessNameLabel: 'दुकान / क्लिनिक / प्रतिष्ठान का नाम',
    businessNamePlaceholder: 'उदा. मॉडर्न कट्स सैलून या सिटी हेल्थ क्लिनिक',
    ownerNameLabel: 'मालिक / विशेषज्ञ का पूरा नाम',
    ownerNamePlaceholder: 'उदा. राजेश कुमार या डॉ. अनन्या शर्मा',
    sectorLabel: 'पेशा / कार्य क्षेत्र',
    sectorBarber: 'नाई, सैलून एवं ग्रूमिंग',
    sectorClinic: 'चिकित्सा क्लिनिक एवं डॉक्टर परामर्श',
    sectorRestaurant: 'रेस्तरां, कैफे एवं डाइनिंग',
    sectorRepair: 'तकनीकी सर्विस एवं रिपेयर शॉप',
    sectorGeneral: 'अन्य पेशेवर सेवाएं',
    primaryLocationLabel: 'मुख्य कार्य स्थल का पता',
    primaryLocationPlaceholder: 'उदा. दुकान नं 4, मार्केट कॉम्प्लेक्स, मुख्य बाजार',
    finishSetupBtn: 'सेटअप पूरा करें और वर्कस्पेस खोलें',

    // Owner Navigation
    navHome: 'होम / स्थिति',
    navEarnings: 'कमाई',
    navAppointments: 'अपॉइंटमेंट्स',
    navBlueprint: 'डेटा और संरचना',
    navProfile: 'प्रोफाइल',
    switchToCustomer: 'ग्राहक दृश्य पर जाएं',
    switchToOwner: 'मालिक डैशबोर्ड',

    // Online / Offline Switch
    statusOnline: 'ऑनलाइन (बुकिंग चालू है)',
    statusOffline: 'ऑफलाइन (दुकान बंद है)',
    toggleGoOffline: 'दुकान बंद करें (Offline)',
    toggleGoOnline: 'दुकान खोलें (Online)',
    offlineBlockedTitle: 'अभी ऑफलाइन नहीं जा सकते',
    offlineBlockedDesc:
      'वर्तमान स्लॉट में 2 ग्राहकों की बुकिंग पहले से मौजूद है। उन्हें सेवा देने या पुनर्निर्धारित करने से पहले ऑफलाइन नहीं हुआ जा सकता।',

    // Home / Overview Tab
    todayBookings: 'आज की कुल बुकिंग',
    occupancyRate: 'स्लॉट भराव दर',
    activeLocations: 'सक्रिय स्थान',
    estimatedRevenue: 'आज की अनुमानित कमाई',
    slotManagerTitle: 'समय स्लॉट एवं स्थान प्रबंधन',
    slotManagerSub: 'नए स्लॉट बनाएं और उन्हें विशिष्ट कुर्सी, कमरे या शाखा को सौंपें।',
    addSlotBtn: 'नया स्लॉट जोड़ें',
    locationSelector: 'स्थान अनुसार देखें',
    allLocations: 'सभी स्थान',
    slotOpen: 'उपलब्ध',
    slotBooked: 'बुक किया गया',
    slotLocked: 'सुरक्षित / लॉक',
    bookSlotDirect: 'सीधे ग्राहक जोड़ें',

    // Big AI Orb
    aiOrbTitle: 'एआई व्यवसाय सहायक',
    aiOrbHint: 'पूर्ण-पृष्ठ आवाज़ और चैट खोलने के लिए टैप करें',

    // Earnings Tab
    earningsTitle: 'कमाई एवं वित्तीय विवरण',
    earningsSub: 'नकद, ऑनलाइन यूपीआई और दैनिक लेनदेन का पूरा ब्योरा।',
    totalToday: 'आज की कमाई',
    totalWeek: 'इस सप्ताह की कमाई',
    totalMonth: 'इस महीने की कमाई',
    paymentBreakdown: 'भुगतान माध्यम',
    cashTotal: 'नकद (Cash)',
    onlineTotal: 'ऑनलाइन / यूपीआई (UPI)',
    transactionLedger: 'हाल के लेनदेन',
    colCustomer: 'ग्राहक',
    colService: 'सेवा',
    colAmount: 'राशि',
    colMethod: 'माध्यम',
    colTime: 'समय',
    colStatus: 'स्थिति',

    // Appointments Tab
    appointmentsTitle: 'बुकिंग एवं समय सारणी',
    appointmentsSub: 'आने वाली बुकिंग्स देखें और पूरी हो चुकी सेवाओं का इतिहास जांचें।',
    tabUpcoming: 'आने वाली (सक्रिय)',
    tabHistory: 'पिछला इतिहास',
    noAppointments: 'इस श्रेणी में कोई बुकिंग नहीं है।',
    markComplete: 'सेवा पूरी हुई',
    cancelBooking: 'रद्द करें',

    // Blueprint / Schema Tab
    blueprintTitle: 'डेटा संरचना एवं स्कीमा आर्किटेक्चर',
    blueprintSub:
      'अपने रिलेशनल डेटाबेस डिज़ाइन को समझें। तालिका दृश्य और 2D संबंध मानचित्र के बीच बदलें।',
    subviewTable: 'तालिका दृश्य (Cards)',
    subviewRelationship: 'की और संबंध दृश्य (2D Map)',
    tableCount: 'कुल तालिकाएं',
    foreignKeysCount: 'रिलेशनल संबंध (Joins)',
    primaryKey: 'पीके (PK)',
    foreignKey: 'एफके (FK)',
    references: 'संदर्भित करता है',

    // Customer View
    customerMapTitle: 'नज़दीकी सेवाएं खोजें और बुक करें',
    customerMapSub: 'आज उपलब्ध स्लॉट्स के साथ सत्यापित व्यवसायों को देखें।',
    searchPlaceholder: 'नाई, डॉक्टर, कैफे या स्थान खोजें...',
    filterAll: 'सभी क्षेत्र',
    bookNow: 'अपॉइंटमेंट बुक करें',
    confirmBooking: 'बुकिंग की पुष्टि करें',
    selectSlot: 'समय स्लॉट चुनें',
    selectService: 'सेवा चुनें',
    bookingSuccess: 'बुकिंग सफलतापूर्वक दर्ज की गई!',

    // AI Full-Page Chat
    aiChatTitle: 'इंटेलिजेंट कॉन्फ़िगरेशन एवं ऑपरेशन इंजन',
    aiChatSubtitle: 'डेटाबेस से पूरी तरह सुरक्षित, केवल कॉन्फ़िगरेशन लेखक।',
    backToDashboard: 'डैशबोर्ड पर वापस जाएं',
    voiceModeActive: 'आवाज़ मोड सक्रिय — सुन रहा है...',
    clickToSpeak: 'बोलने के लिए माइक दबाएं',
    typeMessagePlaceholder: 'कोई आदेश या सवाल लिखें (उदा. "कल के लिए 4 नए स्लॉट बनाएं")...',
    send: 'भेजें',
    samplePromptsTitle: 'अक्सर पूछे जाने वाले निर्देश',
  },
};

export function t(lang: Language, key: keyof typeof DICTIONARY['en']): string {
  return DICTIONARY[lang][key] || DICTIONARY['en'][key] || String(key);
}
