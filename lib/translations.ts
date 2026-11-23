import { Language } from './booking-types';

export const DICTIONARY = {
  en: {
    appName: 'OQ',
    operatorTitle: 'Operator',
    ownerLabel: 'Operator',
    customerPortal: 'Customer Portal',
    switchToOwner: 'Operator Desk',
    logout: 'Log Out',
    statusOnline: 'Taking Bookings',
    statusOffline: 'Operations Paused',
    toggleGoOffline: 'Go Offline',
    toggleGoOnline: 'Go Online',

    // Onboarding Steps
    chooseLanguage: 'Choose Language',
    chooseLanguageSub: 'Select your preferred language to experience the OQ platform.',
    continueBtn: 'Continue',
    selectRoleTitle: 'Select Operational Role',
    selectRoleSub: 'Choose how you intend to use the OQ platform.',
    verificationTitle: 'Identity Verification',
    verificationSubMobile: 'Provide your mobile number to receive a secure session passcode.',
    verificationSubPc: 'Provide your email address to receive a secure session passcode.',
    phoneLabel: 'Mobile Phone Number',
    emailLabel: 'Work Email Address',
    sendOtpBtn: 'Request Passcode',
    otpLabel: '6-Digit Passcode',
    otpHint: 'Demo verification passcode: 123456',
    verifyBtn: 'Verify & Continue',
    profileSetupTitle: 'Business Profile Details',
    profileSetupSub: 'Baseline structural metadata for your OQ workspace.',
    entityTypeLabel: 'Business Structure',
    businessNameLabel: 'Enterprise Name',
    businessNamePlaceholder: 'e.g. Modern Cuts Grooming Studio',
    ownerNameLabel: 'Operator Full Name',
    ownerNamePlaceholder: 'e.g. Alex Morgan',
    sectorLabel: 'Sector / Profession',
    sectorBarber: 'Barber, Salon & Grooming',
    sectorClinic: 'Medical Clinic & Doctor Practice',
    sectorRestaurant: 'Dining, Bistro & Cafe',
    sectorRepair: 'Device Diagnostics & Repair',
    sectorGeneral: 'General Professional Services',
    primaryLocationLabel: 'Main Operating Station Address',
    primaryLocationPlaceholder: 'e.g. Shop 14, Galaxy Arcade, MG Road, Pune',
    finishSetupBtn: 'Finish Setup & Enter Workspace',

    // Offline Cancellation Flow
    offlineRangeTitle: 'Specify Inactive Duration',
    offlineRangeSub: 'Select the operational window during which you will pause bookings.',
    fromDateLabel: 'From Date & Time',
    toDateLabel: 'To Date & Time',
    confirmCancelQuery: 'Do you really intend to cancel confirmed reservations?',
    confirmCancelWarning: 'Active customer bookings detected in this window. Proceeding will trigger immediate cancellation emails.',
    cancellationEmailTitle: 'Draft Client Cancellation Email',
    cancellationEmailSub: 'Compose the cancellation message that will be dispatched to all affected clients.',
    emailSubjectLabel: 'Subject Line',
    emailSubjectDefault: 'Important: Cancellation of your upcoming appointment at OQ',
    emailBodyLabel: 'Message to Clients',
    emailBodyDefault: 'Dear client,\n\nWe regret to inform you that our operations will be temporarily paused during your booked time slot due to unforeseen schedule adjustments. Your appointment has been cancelled and any fees will be refunded immediately.\n\nWarm regards,\nOperations Team (OQ)',
    dispatchCancelBtn: 'Send Email Notice & Pause Operations',
    cancelAbortBtn: 'Return',

    // Navigation Tabs
    navFrontpage: 'Frontpage',
    navAppointments: 'Reservations',
    navEarnings: 'Revenue',
    navDiscover: 'Operator',
    navOperator: 'Operator',
    navProfile: 'Profile',
    navBusinessProfile: 'Profile',
    portalMode: 'Portal Mode',
    bookingPortal: 'Booking Portal',

    // Frontpage
    frontHeroTitle: 'Universal Booking Operations',
    frontHeroSub: 'Seamless capacity scheduling, multiple business branches, and unified appointment control.',
    aiPromptHint: 'Tap the flowing water orb to speak or command AI operations directly.',
    actionMySlots: 'My Slots',
    actionMySlotsSub: 'Inspect active capacity, bookings, and remaining seats per station.',
    actionCreateSlot: 'Create Slot',
    actionCreateSlotSub: 'Publish new operating windows with customized client seat caps.',
    actionNewBusiness: 'New Venture',
    actionNewBusinessSub: 'Configure a new enterprise sector, shop, or clinic location.',

    // Dedicated Slots Page
    slotsPageTitle: 'Capacity & Slot Management',
    slotsPageSub: 'Segregate operating windows by service trade, station, and custom seat limits.',
    filterAllJobs: 'All Job Profiles',
    filterAllStations: 'All Stations',
    createSlotBtn: 'Publish New Slot',
    jobLabel: 'Service / Job Profile',
    stationLabel: 'Operating Station',
    capacityCapLabel: 'Maximum Seat Cap',
    windowLabel: 'Timing Window',
    seatsLeft: 'seats remaining',
    seatsBooked: 'booked',
    slotFull: 'Fully Booked',
    backToFrontpage: 'Back to Frontpage',

    // New Venture Modal
    newVentureTitle: 'Configure New Venture',
    newVentureSub: 'Launch another profession or enterprise branch under your OQ account.',
    ventureNameLabel: 'Enterprise Name',
    ventureSectorLabel: 'Trade / Sector',
    ventureLocationLabel: 'Location Address',
    saveVentureBtn: 'Register Venture',

    // Appointments
    appointmentsTitle: 'Client Reservations',
    tabUpcoming: 'Upcoming',
    tabHistory: 'Completed History',
    noAppointments: 'No client appointments found in this section.',
    markComplete: 'Complete Service',
    cancelBooking: 'Cancel',

    // Earnings
    earningsTitle: 'Financial Performance',
    totalToday: 'Today',
    totalWeek: 'This Week',
    totalMonth: 'This Month',
    cashTotal: 'Cash Register',
    onlineTotal: 'Direct UPI & Digital',
    transactionLedger: 'Settlement Register',

    // Operator / Profile
    operatorDetailsTitle: 'Operator Profile',
    dataArchitectureTitle: 'Data Architecture & Schema',
    dataArchitectureSub: 'Relational specification of tables, primary/foreign keys, and joins.',
    subviewTable: 'Table Specifications',
    subviewRelationship: '2D Relational Map',

    // Customer Portal (ग्राहक द्वार)
    customerMapTitle: 'Customer Portal',
    searchPlaceholder: 'Search locations, specialties, or services...',
    bookNow: 'Reserve Slot',
    confirmBooking: 'Confirm Reservation',
    selectSlot: 'Select Window',
    selectService: 'Select Service',
    bookingSuccess: 'Reservation Confirmed',

    // Customer Dashboard Navigation Tabs
    navCustDiscover: 'Discover',
    navCustBook: 'Book',
    navCustReservations: 'Reservations',
    navCustSpendings: 'Spendings',
    navCustProfile: 'Profile',

    // AI Full-Page
    aiChatTitle: 'OQ AI Assistant',
    typeMessagePlaceholder: 'Type a message or command...',
  },

  hi: {
    appName: 'OQ',
    operatorTitle: 'चालक',
    ownerLabel: 'संचालक',
    customerPortal: 'ग्राहक द्वार',
    switchToOwner: 'संचालक डेस्क',
    logout: 'बाहर निकलें',
    statusOnline: 'बुकिंग चालू है',
    statusOffline: 'सेवा बंद है',
    toggleGoOffline: 'सेवा रोकें',
    toggleGoOnline: 'सेवा चालू करें',

    // Onboarding Steps
    chooseLanguage: 'भाषा चुनें',
    chooseLanguageSub: 'OQ प्लेटफॉर्म को अनुभव करने के लिए अपनी पसंदीदा भाषा चुनें।',
    continueBtn: 'आगे बढ़ें',
    selectRoleTitle: 'अपनी भूमिका चुनें',
    selectRoleSub: 'निर्धारित करें कि आप OQ प्लेटफॉर्म का उपयोग कैसे करना चाहते हैं।',
    verificationTitle: 'पहचान सत्यापन',
    verificationSubMobile: 'सत्र पासकोड प्राप्त करने के लिए अपना मोबाइल नंबर दर्ज करें।',
    verificationSubPc: 'सत्र पासकोड प्राप्त करने के लिए अपना ईमेल पता दर्ज करें।',
    phoneLabel: 'मोबाइल फोन नंबर',
    emailLabel: 'कार्य ईमेल पता',
    sendOtpBtn: 'पासकोड प्राप्त करें',
    otpLabel: '6-अंकीय पासकोड (ओटीपी)',
    otpHint: 'डेमो सत्यापन कोड: 123456',
    verifyBtn: 'सत्यापित करें और आगे बढ़ें',
    profileSetupTitle: 'व्यवसाय विवरण',
    profileSetupSub: 'आपके OQ कार्यस्थल के लिए बुनियादी संरचनात्मक विवरण।',
    entityTypeLabel: 'व्यवसाय का प्रकार',
    businessNameLabel: 'उद्यम का नाम',
    businessNamePlaceholder: 'उदा. मॉडर्न कट्स ग्रूमिंग स्टूडियो',
    ownerNameLabel: 'संचालक का पूरा नाम',
    ownerNamePlaceholder: 'उदा. संचालक',
    sectorLabel: 'कार्य क्षेत्र / उद्योग',
    sectorBarber: 'नाई, सैलून एवं ग्रूमिंग',
    sectorClinic: 'चिकित्सालय एवं डॉक्टर क्लिनिक',
    sectorRestaurant: 'रेस्टोरेंट, भोजनालय एवं कैफे',
    sectorRepair: 'मरम्मत एवं उपकरण सेवा',
    sectorGeneral: 'सामान्य व्यावसायिक सेवाएं',
    primaryLocationLabel: 'मुख्य केंद्र का पता',
    primaryLocationPlaceholder: 'उदा. दुकान 14, गैलेक्सी आर्केड, एमजी रोड, पुणे',
    finishSetupBtn: 'सेटअप पूर्ण करें और कार्यस्थल में प्रवेश करें',

    // Offline Cancellation Flow
    offlineRangeTitle: 'सेवा स्थगन समय चुनें',
    offlineRangeSub: 'उस समय अवधि का चयन करें जिसके दौरान आप बुकिंग स्वीकार नहीं करेंगे।',
    fromDateLabel: 'प्रारंभ तिथि एवं समय',
    toDateLabel: 'समाप्ति तिथि एवं समय',
    confirmCancelQuery: 'क्या आप सच में इन बुकिंग्स को रद्द करना चाहते हैं?',
    confirmCancelWarning: 'इस समय अंतराल में ग्राहकों की सक्रिय बुकिंग मौजूद है। आगे बढ़ने पर ग्राहकों को तुरंत रद्दीकरण ईमेल भेजा जाएगा।',
    cancellationEmailTitle: 'रद्दीकरण ईमेल का प्रारूप',
    cancellationEmailSub: 'वह संदेश लिखें जो प्रभावित सभी ग्राहकों को ईमेल द्वारा भेजा जाएगा।',
    emailSubjectLabel: 'विषय',
    emailSubjectDefault: 'महत्वपूर्ण सूचना: OQ पर आपकी आगामी बुकिंग का रद्दीकरण',
    emailBodyLabel: 'ग्राहकों के लिए संदेश',
    emailBodyDefault: 'प्रिय ग्राहक,\n\nअपरिहार्य कारणों से हमारे संचालन में अस्थायी रुकावट के कारण आपकी बुक की गई अपॉइंटमेंट रद्द कर दी गई है। किसी भी अग्रिम भुगतान का तुरंत रिफंड कर दिया जाएगा।\n\nसस्नेह,\nसंचालन दल (OQ)',
    dispatchCancelBtn: 'ईमेल सूचना भेजें एवं सेवा रोकें',
    cancelAbortBtn: 'वापस',

    // Navigation Tabs
    navFrontpage: 'मुखपृष्ठ',
    navAppointments: 'बुकिंग सूची',
    navEarnings: 'आय विवरण',
    navDiscover: 'ऑपरेटर',
    navOperator: 'ऑपरेटर',
    navProfile: 'प्रोफ़ाइल',
    navBusinessProfile: 'प्रोफ़ाइल',
    portalMode: 'पोर्टल मोड',
    bookingPortal: 'बुकिंग पोर्टल',

    // Frontpage
    frontHeroTitle: 'बुकिंग एवं संसाधन प्रबंधन',
    frontHeroSub: 'समय अंतराल, शाखाओं और ग्राहक बुकिंग का आधुनिक संचालन।',
    aiPromptHint: 'एआई को आवाज़ या लिखकर निर्देश देने के लिए तरल जल चक्र को टैप करें।',
    actionMySlots: 'मेरे स्लॉट',
    actionMySlotsSub: 'सक्रिय क्षमता, बुकिंग और बची हुई सीटों की स्थिति जांचें।',
    actionCreateSlot: 'नया स्लॉट बनाएं',
    actionCreateSlotSub: 'सीट सीमा के साथ नए ऑपरेटिंग समय स्लॉट प्रकाशित करें।',
    actionNewBusiness: 'नया रोज़गार',
    actionNewBusinessSub: 'अपने खाते के तहत नया व्यवसाय या कार्य क्षेत्र कॉन्फ़िगर करें।',

    // Dedicated Slots Page
    slotsPageTitle: 'समय एवं क्षमता प्रबंधन',
    slotsPageSub: 'कार्य प्रकार, स्थान और सीट सीमा के अनुसार स्लॉट प्रबंधित करें।',
    filterAllJobs: 'सभी कार्य प्रकार',
    filterAllStations: 'सभी कार्य स्थल',
    createSlotBtn: 'नया स्लॉट जोड़ें',
    jobLabel: 'कार्य / सेवा का प्रकार',
    stationLabel: 'स्थान / कुर्सी',
    capacityCapLabel: 'अधिकतम सीट सीमा (Cap)',
    windowLabel: 'समय अंतराल',
    seatsLeft: 'सीटें शेष',
    seatsBooked: 'बुक',
    slotFull: 'पूर्ण रूप से बुक',
    backToFrontpage: 'मुखपृष्ठ पर वापस',

    // New Venture Modal
    newVentureTitle: 'नया रोज़गार जोड़ें',
    newVentureSub: 'अपने OQ खाते में नई शाखा या कार्य क्षेत्र शुरू करें।',
    ventureNameLabel: 'व्यवसाय का नाम',
    ventureSectorLabel: 'क्षेत्र / व्यवसाय',
    ventureLocationLabel: 'कार्य स्थल का पता',
    saveVentureBtn: 'नया रोज़गार पंजीकृत करें',

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
    cashTotal: 'नकद रजिस्टर',
    onlineTotal: 'यूपीआई एवं डिजिटल',
    transactionLedger: 'लेनदेन पंजी',

    // Operator / Profile
    operatorDetailsTitle: 'चालक प्रोफाइल',
    dataArchitectureTitle: 'डेटा संरचना एवं रिलेशनल स्कीमा',
    dataArchitectureSub: 'व्यवसाय की तालिकाओं, प्राथमिक एवं विदेशी कुंजियों का ब्लूप्रिंट।',
    subviewTable: 'तालिका विवरण',
    subviewRelationship: '2D रिलेशनल मानचित्र',

    // Customer Portal (ग्राहक द्वार)
    customerMapTitle: 'ग्राहक द्वार',
    searchPlaceholder: 'स्थान या सेवा खोजें...',
    bookNow: 'समय बुक करें',
    confirmBooking: 'बुकिंग की पुष्टि करें',
    selectSlot: 'समय चुनें',
    selectService: 'सेवा चुनें',
    bookingSuccess: 'बुकिंग सफलतापूर्वक दर्ज की गई',

    // Customer Dashboard Navigation Tabs
    navCustDiscover: 'खोजें',
    navCustBook: 'बुक करें',
    navCustReservations: 'आरक्षण',
    navCustSpendings: 'खर्च',
    navCustProfile: 'प्रोफ़ाइल',

    // AI Full-Page
    aiChatTitle: 'OQ एआई सहायक',
    typeMessagePlaceholder: 'संदेश या निर्देश लिखें...',
  },
};

export function t(lang: Language, key: keyof typeof DICTIONARY['en']): string {
  return DICTIONARY[lang][key] || DICTIONARY['en'][key] || String(key);
}

// Dynamic bilingual transliteration / text converter
export function localizeText(text: string, lang: Language): string {
  if (lang === 'en') return text;
  const translationMap: Record<string, string> = {
    'Modern Cuts Grooming Studio': 'मॉडर्न कट्स ग्रूमिंग स्टूडियो',
    'Main Studio (Downtown Chair 1 & 2)': 'मुख्य स्टूडियो (कुर्सी 1 और 2)',
    'East Wing Studio (Chair 3)': 'ईस्ट विंग स्टूडियो (कुर्सी 3)',
    'Haircut': 'हेयरकट',
    'Beard Trim': 'दाढ़ी ट्रिम',
    'Consultation': 'परामर्श',
    'Therapy': 'थेरेपी',
    'Signature Haircut & Styling': 'हेयरकट एवं स्टाइलिंग',
    'Beard Trim & Royal Hot Towel Shave': 'दाढ़ी ट्रिम एवं शेव',
    'Herbal Scalp Massage & Wash': 'हर्बल सिर मालिश एवं वॉश',
    'Complete Executive Grooming Combo': 'संपूर्ण ग्रूमिंग पैकेज',
    'Dentistry': 'दंत चिकित्सा',
    'Dine-in': 'डाइन-इन',
    'Electronics': 'इलेक्ट्रॉनिक्स रिपेयर',
  };
  return translationMap[text] || text;
}
