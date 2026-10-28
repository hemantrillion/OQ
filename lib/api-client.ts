import { User, Menu, Food, Table, Order, OrderItem, Invoice, Note, OrderItemPack } from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('toriya_jwt_token');
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('toriya_jwt_token', token);
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('toriya_jwt_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T | null; error: string | null; status: number }> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('token', token);
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const status = res.status;
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      return { data: null, error: data?.error || `HTTP error ${status}`, status };
    }

    return { data, error: null, status };
  } catch (err: any) {
    return { data: null, error: err.message || 'Network request failed', status: 0 };
  }
}

export const ApiService = {
  // Health
  checkHealth: async () => {
    return request<{ status: string }>('/api/health');
  },

  // Auth
  signup: async (user: Partial<User> & { password?: string }) => {
    return request<any>('/users/signup', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  login: async (credentials: { email: string; password?: string }) => {
    const res = await request<User>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },

  getUsers: async (page = 1, recordPerPage = 10) => {
    return request<any>(`/users?page=${page}&recordPerPage=${recordPerPage}`);
  },

  getUser: async (userId: string) => {
    return request<User>(`/users/${userId}`);
  },

  // Foods
  getFoods: async (page = 1, recordPerPage = 20) => {
    return request<any>(`/foods?page=${page}&recordPerPage=${recordPerPage}`);
  },

  getFood: async (foodId: string) => {
    return request<Food>(`/foods/${foodId}`);
  },

  createFood: async (food: Partial<Food>) => {
    return request<any>('/foods', {
      method: 'POST',
      body: JSON.stringify(food),
    });
  },

  updateFood: async (foodId: string, food: Partial<Food>) => {
    return request<any>(`/foods/${foodId}`, {
      method: 'PATCH',
      body: JSON.stringify(food),
    });
  },

  // Menus
  getMenus: async () => {
    return request<Menu[]>('/menus');
  },

  getMenu: async (menuId: string) => {
    return request<Menu>(`/menus/${menuId}`);
  },

  createMenu: async (menu: Partial<Menu>) => {
    return request<any>('/menus', {
      method: 'POST',
      body: JSON.stringify(menu),
    });
  },

  updateMenu: async (menuId: string, menu: Partial<Menu>) => {
    return request<any>(`/menus/${menuId}`, {
      method: 'PATCH',
      body: JSON.stringify(menu),
    });
  },

  // Tables
  getTables: async () => {
    return request<Table[]>('/tables');
  },

  getTable: async (tableId: string) => {
    return request<Table>(`/tables/${tableId}`);
  },

  createTable: async (table: Partial<Table>) => {
    return request<any>('/tables', {
      method: 'POST',
      body: JSON.stringify(table),
    });
  },

  updateTable: async (tableId: string, table: Partial<Table>) => {
    return request<any>(`/tables/${tableId}`, {
      method: 'PATCH',
      body: JSON.stringify(table),
    });
  },

  // Orders
  getOrders: async () => {
    return request<Order[]>('/orders');
  },

  getOrder: async (orderId: string) => {
    return request<Order>(`/orders/${orderId}`);
  },

  createOrder: async (order: Partial<Order>) => {
    return request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },

  updateOrder: async (orderId: string, order: Partial<Order>) => {
    return request<any>(`/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(order),
    });
  },

  // Order Items
  getOrderItems: async () => {
    return request<OrderItem[]>('/orderItems');
  },

  getOrderItem: async (orderItemId: string) => {
    return request<OrderItem>(`/orderItems/${orderItemId}`);
  },

  getOrderItemsByOrder: async (orderId: string) => {
    return request<any[]>(`/orderItems-order/${orderId}`);
  },

  createOrderItemPack: async (pack: OrderItemPack) => {
    return request<any>('/orderItems', {
      method: 'POST',
      body: JSON.stringify(pack),
    });
  },

  updateOrderItem: async (orderItemId: string, item: Partial<OrderItem>) => {
    return request<any>(`/orderItems/${orderItemId}`, {
      method: 'PATCH',
      body: JSON.stringify(item),
    });
  },

  // Invoices
  getInvoices: async () => {
    return request<Invoice[]>('/invoices');
  },

  getInvoice: async (invoiceId: string) => {
    return request<any>(`/invoices/${invoiceId}`);
  },

  createInvoice: async (invoice: Partial<Invoice>) => {
    return request<any>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
  },

  updateInvoice: async (invoiceId: string, invoice: Partial<Invoice>) => {
    return request<any>(`/invoices/${invoiceId}`, {
      method: 'PATCH',
      body: JSON.stringify(invoice),
    });
  },

  // Notes
  getNotes: async () => {
    return request<Note[]>('/notes');
  },

  getNote: async (noteId: string) => {
    return request<Note>(`/notes/${noteId}`);
  },

  createNote: async (note: Partial<Note>) => {
    return request<any>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  },

  updateNote: async (noteId: string, note: Partial<Note>) => {
    return request<any>(`/notes/${noteId}`, {
      method: 'PATCH',
      body: JSON.stringify(note),
    });
  },
};
