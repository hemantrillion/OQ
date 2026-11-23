export type Language = 'en' | 'hi';

export type UserRole = 'CUSTOMER' | 'OWNER';

export type BusinessType = 'INDIVIDUAL' | 'COMPANY';

export type BusinessSector =
  | 'BARBER_SALON'
  | 'CLINIC_DOCTOR'
  | 'RESTAURANT_CAFE'
  | 'REPAIR_SERVICE'
  | 'GENERAL';

export interface OperatingLocation {
  id: string;
  name: string;
  hindiName?: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  isPrimary?: boolean;
}

export type SlotStatus = 'OPEN' | 'BOOKED' | 'LOCKED';

export interface Slot {
  id: string;
  locationId: string;
  locationName: string;
  jobProfile?: string; // Job segregation (Haircut, Shave, Consultation, etc.)
  date: string; // YYYY-MM-DD
  startTime: string; // e.g., '10:00 AM'
  endTime: string; // e.g., '10:45 AM'
  capacity: number; // Cap on appointments
  bookedCount: number; // Current appointments count
  status: SlotStatus;
  assignedStaff?: string;
}

export type AppointmentStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PENDING';
export type PaymentMethod = 'CASH' | 'ONLINE_UPI' | 'CARD';

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceName: string;
  serviceHindiName?: string;
  price: number;
  slotId: string;
  date: string;
  time: string;
  locationId: string;
  locationName: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  hindiName: string;
  price: number;
  durationMinutes: number;
  category: string;
  description?: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  sector: BusinessSector;
  businessType: BusinessType;
  description: string;
  locations: OperatingLocation[];
  services: ServiceItem[];
  isOnline: boolean;
}

export interface EarningTransaction {
  id: string;
  appointmentId: string;
  customerName: string;
  serviceName: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  time: string;
  status: 'SETTLED' | 'PENDING';
}

export interface SchemaField {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  refTable?: string;
  description: string;
  hindiDescription?: string;
}

export interface SchemaTable {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  hindiDescription: string;
  recordCount: number;
  position: { x: number; y: number };
  fields: SchemaField[];
}

export interface RelationshipLink {
  id: string;
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
  type: '1:M' | 'M:1' | '1:1';
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI' | 'SYSTEM';
  text: string;
  hindiText?: string;
  timestamp: string;
}
