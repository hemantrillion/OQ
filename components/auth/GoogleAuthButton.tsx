'use client';

import React, { useState, useEffect } from 'react';
import { Language } from '@/lib/booking-types';

export interface GoogleUser {
  email: string;
  name: string;
  avatarUrl?: string;
  sub?: string;
}

interface GoogleAuthButtonProps {
  language?: Language;
  onSuccess: (user: GoogleUser) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '91590995732-ghg264vgf0g8cn0orng3f94s3om89j99.apps.googleusercontent.com';

function parseJwtPayload(token: string) {
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
  } catch {
    return null;
  }
}

export function GoogleAuthButton({
  language = 'en',
  onSuccess,
  onError,
  className = '',
  disabled = false,
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Background Google Identity Services (GIS) loader for automatic browser detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGsiCredential = (response: any) => {
      if (!response?.credential) return;
      const payload = parseJwtPayload(response.credential);
      if (payload && payload.email) {
        setIsLoading(false);
        onSuccess({
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
          avatarUrl: payload.picture || '/oq/avatars/hemant_kumar.jpg',
          sub: payload.sub || 'google_' + payload.email.replace(/[^a-zA-Z0-9]/g, '_'),
        });
      }
    };

    const initGsi = () => {
      const google = (window as any).google;
      if (!google?.accounts?.id) return;

      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGsiCredential,
          auto_select: true, // Automatically logs in if 1 Google account is active in the browser
          cancel_on_tap_outside: false,
          itp_support: true,
        });

        google.accounts.id.prompt();
      } catch (e) {
        // GSI initialization notice
      }
    };

    const scriptId = 'google-gsi-client-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.head.appendChild(script);
    } else {
      initGsi();
    }
  }, [onSuccess]);

  // Handle direct Google OAuth 2.0 flow using the browser's active Google account
  const handleDirectGoogleLogin = () => {
    setIsLoading(true);
    setLocalError(null);

    const clientId = GOOGLE_CLIENT_ID;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
    const redirectUri = `${origin}/api/auth/google/callback`;
    const statePayload = { target: `${origin}/?step=completed`, app: 'oq' };
    const state = btoa(JSON.stringify(statePayload));

    // Without prompt=select_account, Google directly uses the browser's signed-in Google account.
    // If not signed in to Google in this browser, Google displays its official sign-in screen.
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${encodeURIComponent(
      state
    )}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=select_account`;

    window.location.href = oauthUrl;
  };

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        onClick={handleDirectGoogleLogin}
        disabled={disabled || isLoading}
        className={`w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 border border-slate-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-[0.99] ${className}`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2.5 text-slate-600 font-medium text-xs">
            <svg
              className="animate-spin w-4 h-4 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>
              {language === 'hi'
                ? 'गूगल से कनेक्ट हो रहा है...'
                : 'Connecting to Google...'}
            </span>
          </div>
        ) : (
          <>
            {/* Official Google 4-Color G SVG Logo */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            <span>
              {language === 'hi'
                ? 'गूगल के साथ जारी रखें'
                : 'Continue with Google'}
            </span>
          </>
        )}
      </button>

      {localError && (
        <p className="text-xs text-rose-400 font-medium text-center">
          {localError}
        </p>
      )}
    </div>
  );
}
