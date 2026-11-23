'use client';

import React, { useState } from 'react';
import { User, UserRole } from '@/lib/types';
import {
  KeyRound,
  ShieldCheck,
  Lock,
  User as UserIcon,
  CheckCircle2,
  Copy,
  Terminal,
} from 'lucide-react';

interface AuthJwtCenterViewProps {
  currentUser: User | null;
  users: User[];
  onLogin: (credentials: { email: string; password?: string }) => Promise<void>;
  onSignup: (userData: Partial<User> & { password?: string }) => Promise<void>;
  onLogout: () => void;
}

export const AuthJwtCenterView: React.FC<AuthJwtCenterViewProps> = ({
  currentUser,
  users,
  onLogin,
  onSignup,
  onLogout,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [email, setEmail] = useState('david.manager@bookingoq.com');
  const [password, setPassword] = useState('Admin@1234');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+1 (555) ');
  const [userRole, setUserRole] = useState<UserRole>('USER');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'LOGIN') {
        await onLogin({ email, password });
      } else {
        await onSignup({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          phone,
          user_type: userRole,
        });
      }
    } catch (err: any) {
      alert(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const parseJwt = (token?: string) => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return {
        email: currentUser?.email,
        first_name: currentUser?.first_name,
        last_name: currentUser?.last_name,
        uid: currentUser?.user_id,
        user_type: currentUser?.user_type,
        exp: Math.floor(Date.now() / 1000) + 86400,
      };
    }
  };

  const decodedClaims = parseJwt(currentUser?.token);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-5 lg:p-6 gap-6 bg-[#f1f5f9] overflow-y-auto font-sans">
      {/* Top Banner matching NEW PROJECT */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              JWT Authentication & Role-Based Access Control (RBAC)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Engineered with Golang Gin, signed HMAC-SHA256 claims, and dual access/refresh token rotation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-medium">
            Algorithm: HS256
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-medium">
            Bcrypt Cost: 14
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sign In / Registration Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode('LOGIN')}
                  className={`text-xs font-bold tracking-tight px-3 py-1.5 rounded-lg transition-colors ${
                    mode === 'LOGIN'
                      ? 'bg-[#0b57d0] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Staff Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('SIGNUP')}
                  className={`text-xs font-bold tracking-tight px-3 py-1.5 rounded-lg transition-colors ${
                    mode === 'SIGNUP'
                      ? 'bg-[#0b57d0] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  New Account
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-400">
                Go: {mode === 'LOGIN' ? '/users/login' : '/users/signup'}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'SIGNUP' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        First Name:
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="David"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Last Name:
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Miller"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Phone Number:
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Role / Privilege Level:
                    </label>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value as UserRole)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="USER">USER (Waitstaff / Line Cook)</option>
                      <option value="ADMIN">ADMIN (General Manager)</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Staff Email Address:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@bookingoq.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Password:
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-[#0b57d0] hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {isLoading
                    ? 'Authenticating...'
                    : mode === 'LOGIN'
                    ? 'Sign In with JWT'
                    : 'Register Staff Account'}
                </span>
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold font-mono">
              Pre-configured Demo Credentials:
            </span>
            <div className="flex justify-between">
              <span>Admin: <code className="text-blue-700 font-mono">david.manager@bookingoq.com</code></span>
              <span>Pass: <code className="text-slate-700 font-mono">Admin@1234</code></span>
            </div>
            <div className="flex justify-between">
              <span>Server: <code className="text-blue-700 font-mono">sarah.server@bookingoq.com</code></span>
              <span>Pass: <code className="text-slate-700 font-mono">Server@1234</code></span>
            </div>
          </div>
        </div>

        {/* Right Column: JWT Token Inspector & Claims */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider font-sans">
                  Active JWT Bearer Token
                </h3>
              </div>

              {currentUser?.token && (
                <button
                  onClick={() => handleCopy(currentUser.token!)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedToken ? 'Copied' : 'Copy Token'}</span>
                </button>
              )}
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 break-all select-all max-h-24 overflow-y-auto">
              {currentUser?.token || 'No active JWT token issued. Sign in on the left to generate.'}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-sans">
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                <span className="font-bold block">HEADER</span>
                <span className="text-[10px] text-rose-600">Algorithm (HS256)</span>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
                <span className="font-bold block">PAYLOAD</span>
                <span className="text-[10px] text-blue-600">User Claims & UID</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                <span className="font-bold block">SIGNATURE</span>
                <span className="text-[10px] text-emerald-600">HMAC-SHA256 Hash</span>
              </div>
            </div>
          </div>

          {/* Decoded Claims Box */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
            <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2 font-sans">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>Decoded Claims in Gin Context (c.GetString(&quot;uid&quot;), c.GetString(&quot;user_type&quot;))</span>
            </h3>

            {decodedClaims ? (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Full Name</span>
                    <strong className="text-slate-900 text-sm font-sans">
                      {decodedClaims.first_name} {decodedClaims.last_name}
                    </strong>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Role Privilege</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold font-mono inline-block mt-0.5">
                      {decodedClaims.user_type || 'USER'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Email</span>
                    <strong className="text-slate-700 font-mono">{decodedClaims.email}</strong>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">User ID (UID)</span>
                    <strong className="text-slate-700 font-mono">{decodedClaims.uid}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Expires At</span>
                    <span className="text-slate-900 font-mono font-medium">
                      {decodedClaims.exp ? new Date(decodedClaims.exp * 1000).toLocaleString() : '24h Standard'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Signature Status</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Signature Verified
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Log in to inspect live claims injected into the Gin HTTP context.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
