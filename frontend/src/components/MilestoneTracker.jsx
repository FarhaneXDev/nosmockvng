'use client';

import { CheckCircle2, Lock, HeartPulse } from 'lucide-react';

export default function MilestoneTracker({ milestones = [] }) {
  if (!milestones || milestones.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Récupération biologique & Bienfaits de l'arrêt
          </h3>
          <p className="text-xs text-slate-400">
            Repères physiologiques validés par les autorités de santé publique (OMS)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map((m, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition-all ${
              m.unlocked
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {m.unlocked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-white">
                  {m.title}
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-400">
                {m.progress}%
              </span>
            </div>

            <div className="mt-2 font-bold text-sm text-slate-200">
              {m.label}
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {m.desc}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  m.unlocked ? 'bg-emerald-400' : 'bg-slate-600'
                }`}
                style={{ width: `${m.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
