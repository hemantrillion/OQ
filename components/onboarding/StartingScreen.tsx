'use client';

import React, { useEffect, useState } from 'react';

interface StartingScreenProps {
  onComplete?: () => void;
  title?: string;
  subtitle?: string;
  durationMs?: number;
}

export function StartingScreen({
  onComplete,
  title = 'Starting',
  subtitle = "We will send you an email when it's done.",
  durationMs = 2200,
}: StartingScreenProps) {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(Math.round((elapsed / durationMs) * 100), 100);
      setProgress(pct);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete?.();
        }, 180);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090d16] text-white font-sans select-none animate-in fade-in duration-300">
      {/* Centered Graphic with Dark Blue Theme */}
      <div className="flex flex-col items-center max-w-sm w-full px-6 text-center space-y-7">
        {/* Glowing Pulsing Spherical Orb with inner grid and concentric aura */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring (matching OQ blue neon aesthetic) */}
          <div className="absolute w-44 h-44 rounded-full bg-sky-500/20 blur-2xl animate-pulse pointer-events-none" />

          {/* Concentric outer glass ring */}
          <div className="relative w-32 h-32 rounded-full p-2 bg-gradient-to-tr from-sky-400/30 via-blue-600/30 to-indigo-500/30 shadow-2xl flex items-center justify-center">
            {/* Inner Spherical Ball */}
            <div
              className="w-full h-full rounded-full shadow-inner relative overflow-hidden flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #38bdf8 0%, #0284c7 40%, #1e40af 80%, #0f172a 100%)',
              }}
            >
              {/* Particle matrix dots */}
              <div
                className="absolute inset-0 opacity-40 mix-blend-overlay"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.85) 1.2px, transparent 1.2px)',
                  backgroundSize: '10px 10px',
                }}
              />

              {/* Shimmer light sweep */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            {subtitle}
          </p>
        </div>

        {/* Progress Bar with Blue Gradient */}
        <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(56,189,248,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
