import {
  BusinessProfile,
  Slot,
  Appointment,
  EarningTransaction,
  SchemaTable,
  RelationshipLink,
  ChatMessage,
} from './booking-types';

export const INITIAL_BUSINESS: BusinessProfile = {
  id: 'biz_001',
  name: '',
  ownerName: '',
  email: '',
  phone: '',
  avatarUrl: '',
  sector: 'BARBER_SALON',
  businessType: 'INDIVIDUAL',
  description: '',
  isOnline: true,
  locations: [],
  services: [],
};

export const INITIAL_SLOTS: Slot[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_TRANSACTIONS: EarningTransaction[] = [];

export interface MapBusiness {
  id: string;
  name: string;
  hindiName: string;
  sector: string;
  category: string;
  rating: number;
  reviewsCount: number;
  distance: string;
  address: string;
  nextAvailableSlot: string;
  priceStarting: number;
  lat: number;
  lng: number;
  popularServices: Array<{ name: string; price: number }>;
}

export const MAP_BUSINESSES: MapBusiness[] = [
  {
    id: 'map_biz_1',
    name: 'Modern Cuts Grooming Studio',
    hindiName: 'मॉडर्न कट्स ग्रूमिंग स्टूडियो',
    sector: 'BARBER_SALON',
    category: 'Hair & Grooming',
    rating: 4.9,
    reviewsCount: 142,
    distance: '0.4 km',
    address: 'Shop 14, Galaxy Arcade, MG Road, Pune',
    nextAvailableSlot: 'Tomorrow, 10:00 AM',
    priceStarting: 150,
    lat: 18.5204,
    lng: 73.8567,
    popularServices: [
      { name: 'Signature Haircut & Styling', price: 250 },
      { name: 'Beard Trim & Royal Shave', price: 150 },
      { name: 'Herbal Scalp Massage', price: 350 },
    ],
  },
  {
    id: 'map_biz_2',
    name: 'Dr. Ananya Sharma Dental Care',
    hindiName: 'डॉ. अनन्या शर्मा डेंटल केयर',
    sector: 'CLINIC_DOCTOR',
    category: 'Dentistry & Orthodontics',
    rating: 4.8,
    reviewsCount: 89,
    distance: '1.2 km',
    address: 'Suite 201, Prime Medipark, FC Road, Pune',
    nextAvailableSlot: 'Tomorrow, 02:30 PM',
    priceStarting: 500,
    lat: 18.524,
    lng: 73.841,
    popularServices: [
      { name: 'Routine Dental Consultation', price: 500 },
      { name: 'Ultrasonic Teeth Cleaning', price: 1200 },
      { name: 'Root Canal Examination', price: 800 },
    ],
  },
  {
    id: 'map_biz_3',
    name: 'The Rustic Olive Bistro',
    hindiName: 'द रस्टिक ऑलिव बिस्त्रो',
    sector: 'RESTAURANT_CAFE',
    category: 'Dine-in Reservations',
    rating: 4.7,
    reviewsCount: 230,
    distance: '1.8 km',
    address: 'Lane 7, Koregaon Park North, Pune',
    nextAvailableSlot: 'Tomorrow, 07:30 PM (Table for 2)',
    priceStarting: 400,
    lat: 18.5362,
    lng: 73.894,
    popularServices: [
      { name: 'Chef Table for 2', price: 1800 },
      { name: 'Wood-fired Pizza Table', price: 650 },
      { name: 'Evening Coffee & Dessert', price: 400 },
    ],
  },
  {
    id: 'map_biz_4',
    name: 'QuickFix Electronics Lab',
    hindiName: 'क्विकफिक्स इलेक्ट्रॉनिक्स लैब',
    sector: 'REPAIR_SERVICE',
    category: 'Device Diagnostics',
    rating: 4.6,
    reviewsCount: 65,
    distance: '2.5 km',
    address: 'Shop 8, Tech Plaza, JM Road, Pune',
    nextAvailableSlot: 'Tomorrow, 03:00 PM',
    priceStarting: 300,
    lat: 18.528,
    lng: 73.847,
    popularServices: [
      { name: 'Hardware Diagnostic Check', price: 300 },
      { name: 'Battery Health Inspection', price: 200 },
      { name: 'Laptop Deep Clean & Thermal', price: 800 },
    ],
  },
];

export const SCHEMA_TABLES: SchemaTable[] = [
  {
    id: 'tbl_businesses',
    name: 'businesses',
    hindiName: 'व्यवसाय (Businesses)',
    description: 'Core enterprise profile, ownership type, and active status flag.',
    hindiDescription: 'व्यवसाय की बुनियादी जानकारी, स्वामित्व प्रकार और ऑनलाइन स्थिति।',
    recordCount: 1,
    position: { x: 40, y: 50 },
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Primary Identifier' },
      { name: 'name', type: 'VARCHAR(120)', description: 'Commercial Trade Name' },
      { name: 'owner_name', type: 'VARCHAR(100)', description: 'Managing Operator' },
      { name: 'sector', type: 'ENUM', description: 'Industry Sector' },
      { name: 'is_online', type: 'BOOLEAN', description: 'Real-time Operation Flag' },
    ],
  },
  {
    id: 'tbl_locations',
    name: 'locations',
    hindiName: 'कार्य स्थल (Locations)',
    description: 'Operating stations, chairs, clinic rooms, or service points.',
    hindiDescription: 'शाखाएं, कुर्सियां, क्लिनिक कमरे या सेवा स्थल।',
    recordCount: 2,
    position: { x: 380, y: 50 },
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Location Identifier' },
      { name: 'business_id', type: 'UUID', isForeign: true, refTable: 'businesses', description: 'Parent Business Reference' },
      { name: 'name', type: 'VARCHAR(100)', description: 'Station Name' },
      { name: 'address', type: 'TEXT', description: 'Civic Address' },
    ],
  },
  {
    id: 'tbl_slots',
    name: 'slots',
    hindiName: 'समय स्लॉट (Slots)',
    description: 'Calendar time blocks with job profile and capacity caps.',
    hindiDescription: 'कार्य प्रकार, स्थान और सीट सीमा के साथ समय के स्लॉट।',
    recordCount: 5,
    position: { x: 720, y: 50 },
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Slot Identifier' },
      { name: 'location_id', type: 'UUID', isForeign: true, refTable: 'locations', description: 'Assigned Station' },
      { name: 'job_profile', type: 'VARCHAR(100)', description: 'Designated Service Profile' },
      { name: 'date', type: 'DATE', description: 'Calendar Date' },
      { name: 'start_time', type: 'TIME', description: 'Commencement Time' },
      { name: 'end_time', type: 'TIME', description: 'Conclusion Time' },
      { name: 'capacity', type: 'INT', description: 'Concurrent Appointment Cap' },
    ],
  },
  {
    id: 'tbl_appointments',
    name: 'appointments',
    hindiName: 'बुकिंग्स (Appointments)',
    description: 'Client reservations linking customers to slots and services.',
    hindiDescription: 'ग्राहकों द्वारा बुक की गई पुष्टि की गई अपॉइंटमेंट्स।',
    recordCount: 4,
    position: { x: 380, y: 350 },
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Booking Reference' },
      { name: 'slot_id', type: 'UUID', isForeign: true, refTable: 'slots', description: 'Booked Slot Reference' },
      { name: 'customer_name', type: 'VARCHAR(100)', description: 'Client Full Name' },
      { name: 'customer_phone', type: 'VARCHAR(20)', description: 'Phone Number' },
      { name: 'status', type: 'ENUM', description: 'UPCOMING | COMPLETED | CANCELLED' },
    ],
  },
  {
    id: 'tbl_earnings',
    name: 'earnings',
    hindiName: 'वित्तीय ब्योरा (Earnings)',
    description: 'Financial ledger of reconciled receipts with payment method audit.',
    hindiDescription: 'भुगतान माध्यम और निपटान के साथ वित्तीय रिकॉर्ड।',
    recordCount: 4,
    position: { x: 720, y: 350 },
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Ledger Identifier' },
      { name: 'appointment_id', type: 'UUID', isForeign: true, refTable: 'appointments', description: 'Settled Appointment' },
      { name: 'amount', type: 'DECIMAL(10,2)', description: 'Settled Value in INR' },
      { name: 'payment_method', type: 'ENUM', description: 'CASH | ONLINE_UPI | CARD' },
    ],
  },
];

export const INITIAL_AI_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'AI',
    text: 'Greetings. OQ operations engine is active. State your operational directive or inquiry.',
    hindiText: 'नमस्ते। OQ संचालन इंजन सक्रिय है। अपना परिचालन निर्देश या प्रश्न बताएं।',
    timestamp: 'Active',
  },
];
