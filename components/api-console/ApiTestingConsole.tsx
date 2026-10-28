'use client';

import React, { useState } from 'react';
import { API_BASE_URL, getAuthToken } from '@/lib/api-client';
import {
  Terminal,
  Play,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface EndpointConfig {
  name: string;
  method: 'GET' | 'POST' | 'PATCH';
  path: string;
  category: 'AUTH' | 'FOOD' | 'MENU' | 'TABLE' | 'ORDER' | 'INVOICE' | 'NOTES';
  requiresAuth: boolean;
  defaultBody?: any;
  description: string;
}

const ENDPOINTS: EndpointConfig[] = [
  // Health
  { name: 'System Root & Info', method: 'GET', path: '/', category: 'AUTH', requiresAuth: false, description: 'Root engine status and service version' },
  { name: 'Health Check', method: 'GET', path: '/api/health', category: 'AUTH', requiresAuth: false, description: 'Liveness probe and process PID' },

  // Auth & Users
  { name: 'User Login', method: 'POST', path: '/users/login', category: 'AUTH', requiresAuth: false, defaultBody: { email: 'admin@bistro.com', password: 'Admin@1234' }, description: 'Verify bcrypt password and emit dual JWT tokens' },
  { name: 'User Signup', method: 'POST', path: '/users/signup', category: 'AUTH', requiresAuth: false, defaultBody: { first_name: 'Alexander', last_name: 'Wright', email: 'alex@bistro.com', password: 'Password@123', phone: '+1 555-0199', user_type: 'USER' }, description: 'Register new employee with salted password hash' },
  { name: 'List Users (Paginated)', method: 'GET', path: '/users?page=1&recordPerPage=10', category: 'AUTH', requiresAuth: true, description: 'Aggregated user accounts with pagination' },

  // Foods
  { name: 'List All Foods', method: 'GET', path: '/foods?page=1&recordPerPage=10', category: 'FOOD', requiresAuth: true, description: 'Aggregate food catalogue with $slice pagination' },
  { name: 'Create Food Item', method: 'POST', path: '/foods', category: 'FOOD', requiresAuth: true, defaultBody: { name: 'Pan-Seared Chilean Sea Bass', price: 42.0, food_image: 'icon-fish', menu_id: 'mnu_mains_001' }, description: 'Insert new culinary item bound to menu category' },

  // Menus
  { name: 'List All Menus', method: 'GET', path: '/menus', category: 'MENU', requiresAuth: true, description: 'Fetch high-level dining menu categorizations' },
  { name: 'Create Menu Category', method: 'POST', path: '/menus', category: 'MENU', requiresAuth: true, defaultBody: { name: 'Late Night Tasting Menu', category: 'Supper' }, description: 'Create seasonal or time-bound menu grouping' },

  // Tables
  { name: 'List All Tables', method: 'GET', path: '/tables', category: 'TABLE', requiresAuth: true, description: 'Query all tables and seating capacities' },
  { name: 'Create Floor Table', method: 'POST', path: '/tables', category: 'TABLE', requiresAuth: true, defaultBody: { table_number: 9, number_of_guests: 6 }, description: 'Add a new table to dining room floor plan' },

  // Orders & Items
  { name: 'List All Orders', method: 'GET', path: '/orders', category: 'ORDER', requiresAuth: true, description: 'Fetch active dining party orders' },
  { name: 'Batch Order Items (OrderItemPack)', method: 'POST', path: '/orderItems', category: 'ORDER', requiresAuth: true, defaultBody: { table_id: 'tbl_001', order_items: [{ food_id: 'fod_ribeye_01', quantity: 'M', unit_price: 48.5 }] }, description: 'Atomic order creation with table creation helper' },
  { name: 'Items By Order ($lookup Join)', method: 'GET', path: '/orderItems-order/ord_live_801', category: 'ORDER', requiresAuth: true, description: 'Multi-table joined order breakdown with payment due' },

  // Invoices
  { name: 'List All Invoices', method: 'GET', path: '/invoices', category: 'INVOICE', requiresAuth: true, description: 'Retrieve financial settlement records' },
  { name: 'Create Bill Invoice', method: 'POST', path: '/invoices', category: 'INVOICE', requiresAuth: true, defaultBody: { order_id: 'ord_live_801', payment_method: 'CARD', payment_status: 'PENDING' }, description: 'Generate invoice and due date timestamp' },

  // Notes
  { name: 'List Kitchen Notes', method: 'GET', path: '/notes', category: 'NOTES', requiresAuth: true, description: 'Fetch chef allergy & table special notes' },
  { name: 'Create Kitchen Note', method: 'POST', path: '/notes', category: 'NOTES', requiresAuth: true, defaultBody: { title: 'VIP Table 8 Wine Selection', text: 'Guest prefers 2018 Napa Valley Cabernet Sauvignon decanted 20 minutes prior.' }, description: 'Post kitchen directive' },
];

export const ApiTestingConsole: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointConfig>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState<string>(
    selectedEndpoint.defaultBody ? JSON.stringify(selectedEndpoint.defaultBody, null, 2) : ''
  );
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSelectEndpoint = (ep: EndpointConfig) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.defaultBody ? JSON.stringify(ep.defaultBody, null, 2) : '');
    setResponseOutput(null);
    setResponseStatus(null);
  };

  const handleRunRequest = async () => {
    setIsExecuting(true);
    const start = performance.now();
    const token = getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['token'] = token;
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers,
      };

      if (selectedEndpoint.method !== 'GET' && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(`${API_BASE_URL}${selectedEndpoint.path}`, options);
      const elapsed = Math.round(performance.now() - start);
      setResponseTime(elapsed);
      setResponseStatus(res.status);

      const json = await res.json();
      setResponseOutput(JSON.stringify(json, null, 2));
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      setResponseTime(elapsed);
      setResponseStatus(500);
      setResponseOutput(
        JSON.stringify(
          {
            error: err.message || 'Failed to reach Golang Gin API',
            targetUrl: `${API_BASE_URL}${selectedEndpoint.path}`,
            note: 'Verify backend/restaurant-backend.exe is running on port :8080',
          },
          null,
          2
        )
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'GET':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'POST':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PATCH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 gap-6 bg-slate-50 overflow-y-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">
              Interactive Golang Gin API Testing Console
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Directly dispatches live HTTP requests to <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded border border-blue-100">{API_BASE_URL}</code> with automated JWT Bearer injection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Registered Routes:</span>
          <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono font-medium text-xs">
            18 Endpoints
          </span>
        </div>
      </div>

      {/* Main Grid: Endpoint List (5 Cols) + Request/Response Console (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left: Endpoint List */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg shadow-sm p-4 overflow-hidden flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3 px-1">
            Gin Endpoint Catalog
          </span>

          <div className="space-y-1.5 overflow-y-auto max-h-[580px] pr-1">
            {ENDPOINTS.map((ep, idx) => {
              const isSelected =
                selectedEndpoint.name === ep.name && selectedEndpoint.path === ep.path;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-2.5 rounded-md border text-xs transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 text-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded border uppercase shrink-0 ${getMethodBadge(
                        ep.method
                      )}`}
                    >
                      {ep.method}
                    </span>
                    <div className="truncate">
                      <span className="text-slate-900 font-medium block group-hover:text-blue-600 transition-colors truncate">
                        {ep.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 truncate block">
                        {ep.path}
                      </span>
                    </div>
                  </div>

                  {ep.requiresAuth && (
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0 ml-2"
                      title="Requires JWT Token"
                    >
                      JWT
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Request & Response Console */}
        <div className="lg:col-span-7 space-y-4">
          {/* Request Header Bar */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold font-mono px-2 py-0.5 rounded border uppercase ${getMethodBadge(
                    selectedEndpoint.method
                  )}`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-sm font-semibold text-slate-900">
                  {selectedEndpoint.path}
                </span>
              </div>

              <button
                onClick={handleRunRequest}
                disabled={isExecuting}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isExecuting ? 'Executing...' : 'Dispatch Request'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-3">
              {selectedEndpoint.description}
            </p>

            {/* Injected Headers Notice */}
            <div className="mt-3 p-2.5 rounded-md bg-slate-50 border border-slate-200 font-mono text-xs text-slate-600 flex items-center justify-between">
              <span>Headers Injected:</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                token: {getAuthToken() ? 'Active Bearer (LocalStorage)' : 'None'}
              </span>
            </div>

            {/* Request Body Editor (if not GET) */}
            {selectedEndpoint.method !== 'GET' && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  JSON Request Payload Body:
                </label>
                <textarea
                  rows={5}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Response Inspector Box */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-semibold uppercase tracking-wider">HTTP Response:</span>
                {responseStatus !== null && (
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-semibold ${
                      responseStatus >= 200 && responseStatus < 300
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    STATUS {responseStatus}
                  </span>
                )}
              </div>

              {responseTime !== null && (
                <span className="text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" /> {responseTime} ms
                </span>
              )}
            </div>

            <div className="mt-3">
              {responseOutput ? (
                <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-100 overflow-x-auto max-h-72 leading-relaxed">
                  {responseOutput}
                </pre>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
                  <Terminal className="w-6 h-6 mb-2 opacity-40 text-slate-400" />
                  <span>Click &quot;Dispatch Request&quot; above to execute endpoint query.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
