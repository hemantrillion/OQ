'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Camera,
  Check,
  Shield,
  User,
  Building,
  Briefcase,
  Phone,
  Globe,
  Save,
  Lock,
  LogOut,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { INITIAL_BUSINESS } from '@/lib/booking-data';

export default function AccountManagementPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(INITIAL_BUSINESS.ownerName);
  const [email, setEmail] = useState(INITIAL_BUSINESS.email);
  const [avatarUrl, setAvatarUrl] = useState<string>(INITIAL_BUSINESS.avatarUrl || '');
  const [businessName, setBusinessName] = useState(INITIAL_BUSINESS.name);
  const [phone, setPhone] = useState(INITIAL_BUSINESS.phone);
  const [city, setCity] = useState(INITIAL_BUSINESS.locations[0]?.city || 'Pune');
  const [address, setAddress] = useState(INITIAL_BUSINESS.locations[0]?.address || 'Shop 14, Galaxy Arcade, MG Road');
  const [authProvider, setAuthProvider] = useState<'google' | 'passcode'>('google');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    document.title = 'OQ';
    // Gatekeeping: Without signing in through Google or phone, redirect away from account page
    try {
      const isAuth = sessionStorage.getItem('oq_authenticated') === 'true';
      if (!isAuth) {
        setIsAuthenticated(false);
        router.replace('/oq/?step=verify');
        return;
      }
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
      router.replace('/oq/?step=verify');
      return;
    }

    // Read persisted profile from local storage if available
    try {
      const stored = localStorage.getItem('oq_active_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.ownerName) setName(parsed.ownerName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.avatarUrl) {
          const loaded = parsed.avatarUrl.startsWith('/avatars/')
            ? `/oq${parsed.avatarUrl}`
            : parsed.avatarUrl;
          setAvatarUrl(loaded);
        }
        if (parsed.name) setBusinessName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.authProvider) setAuthProvider(parsed.authProvider);
      }
    } catch {
      // ignore
    }
  }, [router]);

  if (isAuthenticated === false || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSavedSuccess(false);

    try {
      const updated = {
        ownerName: name,
        email,
        avatarUrl,
        name: businessName,
        phone,
        city,
        address,
        authProvider,
      };
      localStorage.setItem('oq_active_profile', JSON.stringify(updated));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save account details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('oq_active_profile');
    router.push('/oq/');
  };

  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('')
    : 'OQ';

  return (
    <div className="min-h-screen bg-[#090d16] text-white font-sans antialiased flex flex-col select-none">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0d131f]/90 backdrop-blur-md border-b border-white/10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/oq/')}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Back to Operations Desk"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-bold text-white tracking-tight">Manage your Account</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.push('/oq/')}
              className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Go to Operations Desk
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="px-3.5 py-2 rounded-full border border-rose-500/30 hover:bg-rose-500/15 text-rose-400 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl w-full mx-auto px-4 py-8 flex-1 space-y-6">
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center gap-3 animate-in fade-in duration-200 shadow-md">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Account details and profile photo saved successfully!</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Profile Card */}
        <section className="bg-[#0e1422] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
            {/* Avatar with Upload Badge */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 border-2 border-white/20 overflow-hidden shadow-xl flex items-center justify-center text-white text-2xl font-black">
                {avatarUrl ? (
                  <img
                    src={avatarUrl.startsWith('/avatars/') ? `/oq${avatarUrl}` : avatarUrl}
                    alt={name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 cursor-pointer"
                title="Change Profile Picture"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">{name || 'User Profile'}</h2>
              <p className="text-sm text-slate-400 font-mono">{email}</p>
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-400/30">
                  Business Operator
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Account
                </span>
                {authProvider === 'google' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/15 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google Authentication
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:border-sky-400 font-sans"
                  placeholder="e.g. Operator"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-sky-400" />
                  <span>Business / Venture Name</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:border-sky-400 font-sans"
                  placeholder="e.g. Modern Cuts Grooming Studio"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:border-sky-400 font-mono"
                  placeholder="e.g. +91 98234 11223"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>Operating City</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:border-sky-400 font-sans"
                  placeholder="e.g. Pune"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>Primary Operating Station Address</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:border-sky-400 font-sans"
                  placeholder="e.g. Shop 14, Galaxy Arcade, MG Road"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => router.push('/oq/')}
                className="px-5 py-2.5 rounded-full border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Security & Authentication Info */}
        <section className="bg-[#0e1422] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
            <Shield className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">Security & Active Authentication</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your Booking OQ account is cryptographically bound to your verified Google Identity and HMAC-SHA256 session signature tokens.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Authentication Provider</span>
              <p className="font-semibold text-sky-300">Google OAuth 2.0 (GIS)</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Session Security Status</span>
              <p className="font-semibold text-emerald-400">Encrypted • Active Session</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-6 border-t border-white/5 max-w-4xl mx-auto w-full">
        Booking OQ Platform • Universal Queue & Operational Resource Architecture
      </footer>
    </div>
  );
}
