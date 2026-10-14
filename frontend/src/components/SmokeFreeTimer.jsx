'use client';

import { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

export default function SmokeFreeTimer({ quitDateString }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: true,
  });

  useEffect(() => {
    const target = quitDateString ? new Date(quitDateString) : new Date('2026-10-14T08:00:00');

    const update = () => {
      const now = new Date();
      const diffMs = now.getTime() - target.getTime();
      const isPast = diffMs >= 0;
      const totalSeconds = Math.floor(Math.abs(diffMs) / 1000);

      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds, isPast });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [quitDateString]);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-850 to-emerald-950/40 border border-emerald-500/20 shadow-2xl">
      {/* Decorative background glow */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              {timeLeft.isPast ? 'Temps de liberté conquis' : 'Compte à rebours avant le grand départ'}
            </span>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Départ : {new Date(quitDateString || '2026-10-14T08:00:00').toLocaleDateString('fr-FR', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Counter Display */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto">
          {/* Days */}
          <div className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-inner">
            <span className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
              {timeLeft.days}
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
              {timeLeft.days <= 1 ? 'Jour' : 'Jours'}
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-inner">
            <span className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
              {pad(timeLeft.hours)}
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
              Heures
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-inner">
            <span className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
              {pad(timeLeft.minutes)}
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
              Minutes
            </span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 shadow-inner">
            <span className="text-3xl sm:text-5xl font-black text-emerald-400 font-mono tracking-tight">
              {pad(timeLeft.seconds)}
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-emerald-400/80 mt-1 uppercase tracking-wider">
              Secondes
            </span>
          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-slate-300 mt-6 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Chaque seconde sans fumée permet à votre organisme de se réparer.</span>
        </p>
      </div>
    </div>
  );
}
