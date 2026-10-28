export type UserRole = 'ADMIN' | 'USER';

export interface User {
  _id?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_type: UserRole;
  token?: string;
  refresh_token?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  _id?: string;
  menu_id: string;
  name: string;
  category: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Food {
  _id?: string;
  food_id: string;
  name: string;
  price: number;
  food_image: string;
  menu_id: string;
  created_at: string;
  updated_at: string;
  category?: string;
  description?: string;
  spicy_level?: number;
}

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'ORDERING' | 'RESERVED';

export interface Table {
  _id?: string;
  table_id: string;
  table_number: number;
  number_of_guests: number;
  created_at: string;
  updated_at: string;
  status?: TableStatus;
  current_order_id?: string;
  section?: 'MAIN_DINING' | 'TATAMI_ROOM' | 'OMAKASE_BAR' | 'PATIO_TERRACE';
}

export interface Order {
  _id?: string;
  order_id: string;
  order_date: string;
  table_id: string;
  created_at: string;
  updated_at: string;
  status?: 'PENDING' | 'IN_KITCHEN' | 'SERVED' | 'COMPLETED';
}

export type PortionSize = 'S' | 'M' | 'L';

export interface OrderItem {
  _id?: string;
  order_item_id: string;
  order_id: string;
  food_id: string;
  quantity: PortionSize;
  unit_price: number;
  created_at: string;
  updated_at: string;
  food_name?: string;
}

export interface OrderItemPack {
  table_id: string;
  order_items: {
    food_id: string;
    quantity: PortionSize;
    unit_price: number;
  }[];
}

export type PaymentMethod = 'CASH' | 'CARD';
export type PaymentStatus = 'PENDING' | 'PAID';

export interface Invoice {
  _id?: string;
  invoice_id: string;
  order_id: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_due_date: string;
  created_at: string;
  updated_at: string;
  total_amount?: number;
  table_number?: number;
}

export interface Note {
  _id?: string;
  note_id: string;
  title: string;
  text: string;
  created_at: string;
  updated_at: string;
  priority?: 'NORMAL' | 'URGENT' | 'ALLERGY_ALERT';
}

export interface DecodedJWT {
  email: string;
  first_name: string;
  last_name: string;
  uid: string;
  user_type: UserRole;
  exp: number;
  iat?: number;
}
