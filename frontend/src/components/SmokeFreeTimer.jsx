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

  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const target = quitDateString ? new Date(quitDateString) : new Date('2026-10-14T08:00:00+01:00');

    // Format target date with Benin / local timezone
    try {
      const options = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Porto-Novo'
      };
      setFormattedDate(target.toLocaleDateString('fr-FR', options));
    } catch (e) {
      setFormattedDate(target.toLocaleString('fr-FR'));
    }

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
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-7 bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/40 border border-emerald-500/20 shadow-xl">
      {/* Background glow */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top status indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
              {timeLeft.isPast ? 'Temps sans cigarette' : 'Départ de votre arrêt'}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Début : {formattedDate || '14 oct. 2026, 08:00 (WAT Bénin)'}</span>
          </div>
        </div>

        {/* 4 Counter Boxes - Ultra mobile responsive */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-3 max-w-xl mx-auto">
          {/* Days */}
          <div className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
            <span className="text-xl sm:text-4xl font-black text-white font-mono tracking-tight leading-none">
              {timeLeft.days}
            </span>
            <span className="text-[9px] sm:text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              {timeLeft.days <= 1 ? 'Jour' : 'Jours'}
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
            <span className="text-xl sm:text-4xl font-black text-white font-mono tracking-tight leading-none">
              {pad(timeLeft.hours)}
            </span>
            <span className="text-[9px] sm:text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Heures
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
            <span className="text-xl sm:text-4xl font-black text-white font-mono tracking-tight leading-none">
              {pad(timeLeft.minutes)}
            </span>
            <span className="text-[9px] sm:text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Min
            </span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-950/50 border border-emerald-500/40 shadow-inner">
            <span className="text-xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight leading-none">
              {pad(timeLeft.seconds)}
            </span>
            <span className="text-[9px] sm:text-[11px] font-semibold text-emerald-400/90 mt-1 uppercase tracking-wider">
              Sec
            </span>
          </div>
        </div>

        <p className="text-center text-[11px] sm:text-xs text-slate-300 flex items-center justify-center gap-1.5 pt-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Chaque minute sans tabac régénère votre souffle.</span>
        </p>
      </div>
    </div>
  );
}
