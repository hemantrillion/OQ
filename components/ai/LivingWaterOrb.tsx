'use client';

import React, { useEffect, useRef } from 'react';

interface Props {
  size?: number;
  onClick?: () => void;
}

export const LivingWaterOrb: React.FC<Props> = ({ size = 96, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const render = () => {
      step += 0.035;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const baseRadius = w * 0.38;

      ctx.clearRect(0, 0, w, h);

      // Create outer ambient water glow
      const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.4, cx, cy, baseRadius * 1.3);
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
      glowGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.16)');
      glowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Fluid water drop morphing shape
      ctx.beginPath();
      const points = 36;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        // Superimposed sine waves for organic fluid liquid tension
        const wave1 = Math.sin(angle * 3 + step) * (baseRadius * 0.08);
        const wave2 = Math.cos(angle * 5 - step * 1.3) * (baseRadius * 0.06);
        const wave3 = Math.sin(angle * 2 + step * 0.7) * (baseRadius * 0.05);
        const r = baseRadius + wave1 + wave2 + wave3;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();

      // Liquid gradient with deep sapphire & luminous cyan
      const fluidGrad = ctx.createLinearGradient(0, 0, w, h);
      fluidGrad.addColorStop(0, '#38bdf8');
      fluidGrad.addColorStop(0.35, '#2563eb');
      fluidGrad.addColorStop(0.7, '#4f46e5');
      fluidGrad.addColorStop(1, '#06b6d4');
      ctx.fillStyle = fluidGrad;
      ctx.fill();

      // Inner liquid specular reflection (water caustic)
      ctx.save();
      ctx.clip();
      ctx.beginPath();
      ctx.arc(cx - baseRadius * 0.3, cy - baseRadius * 0.35, baseRadius * 0.45, 0, Math.PI * 2);
      const highlight = ctx.createRadialGradient(
        cx - baseRadius * 0.3,
        cy - baseRadius * 0.35,
        2,
        cx - baseRadius * 0.3,
        cy - baseRadius * 0.35,
        baseRadius * 0.5
      );
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      highlight.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = highlight;
      ctx.fill();
      ctx.restore();

      // Secondary soft inner ripple
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const wave = Math.sin(angle * 4 - step * 1.1) * (baseRadius * 0.04);
        const r = baseRadius * 0.7 + wave;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer inline-flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        style={{ width: size, height: size }}
      />
    </div>
  );
};
