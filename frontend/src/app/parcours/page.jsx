'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Clock,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { api } from '@/lib/api';
import { DEFAULT_JOURNEY_DAYS } from '@/lib/constants';
import confetti from 'canvas-confetti';

export default function ParcoursPage() {
  const [days, setDays] = useState(DEFAULT_JOURNEY_DAYS);
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [activeDay, setActiveDay] = useState(DEFAULT_JOURNEY_DAYS[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadJourney() {
      try {
        const data = await api.getJourney();
        if (data && data.length > 0) {
          setDays(data);
          const firstUncompleted = data.find(d => !d.completed) || data[0];
          setActiveDay(firstUncompleted);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadJourney();
  }, []);

  const handleToggleDay = async (dayNumber) => {
    try {
      const res = await api.toggleJourneyDay(dayNumber);
      const isCompletedNow = res?.completed ?? !days.find(d => d.day_number === dayNumber)?.completed;

      setDays(days.map(d => d.day_number === dayNumber ? { ...d, completed: isCompletedNow } : d));

      if (activeDay && activeDay.day_number === dayNumber) {
        setActiveDay({ ...activeDay, completed: isCompletedNow });
      }

      if (isCompletedNow) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const phases = [
    { id: 'all', title: 'Vue Globale (30 Jours)' },
    { id: 'Phase 1', title: 'Phase 1 : J1-3 (Sécurité)' },
    { id: 'Phase 2', title: 'Phase 2 : J4-7 (Rituels)' },
    { id: 'Phase 3', title: 'Phase 3 : J8-14 (Émotions)' },
    { id: 'Phase 4', title: 'Phase 4 : J15-21 (Risques)' },
    { id: 'Phase 5', title: 'Phase 5 : J22-30 (Liberté)' },
  ];

  const filteredDays = selectedPhase === 'all'
    ? days
    : days.filter(d => d.phase_title?.includes(selectedPhase));

  const completedCount = days.filter(d => d.completed).length;
  const progressPercent = Math.round((completedCount / (days.length || 30)) * 100);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Top Banner: Mobile Stacking */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950/40 border border-blue-500/20 shadow-2xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Programme Guidé 30 Jours</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Votre feuille de route vers l'indépendance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Un programme progressif basé sur les sciences comportementales. Chaque jour a son action concrète et son bouclier mental.
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full md:w-64 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shrink-0 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-400">Progression</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {completedCount} / {days.length || 30} jours
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 block text-right font-mono">
            {progressPercent}% accompli
          </span>
        </div>
      </div>

      {/* Featured Active Day Card */}
      {activeDay && (
        <div className="p-5 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden sm:block">
            <Award className="w-40 h-40 text-emerald-400" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 font-mono">
                Jour {activeDay.day_number}
              </span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {activeDay.phase_title}
              </span>
            </div>

            <button
              onClick={() => handleToggleDay(activeDay.day_number)}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeDay.completed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95'
              }`}
            >
              {activeDay.completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Jour validé (annuler)</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  <span>Marquer ce jour comme complété</span>
                </>
              )}
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {activeDay.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {activeDay.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Action concrète du jour
              </span>
              <p className="text-xs sm:text-sm text-slate-200">
                {activeDay.action_today}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                Mantra de protection
              </span>
              <p className="text-xs sm:text-sm text-slate-200 italic">
                « {activeDay.mantra} »
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Phase Filter Tabs (Horizontal Scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {phases.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPhase(p.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedPhase === p.id
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Grid of All 30 Days */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredDays.map((d) => {
          const isSelected = activeDay?.day_number === d.day_number;

          return (
            <div
              key={d.day_number}
              onClick={() => setActiveDay(d)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg'
                  : d.completed
                  ? 'bg-slate-900/60 border-emerald-500/30'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                  d.completed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  Jour {d.day_number}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleDay(d.day_number);
                  }}
                  className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
                  title={d.completed ? 'Décocher' : 'Valider'}
                >
                  {d.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
                  )}
                </button>
              </div>

              <h4 className="font-bold text-sm text-white mt-2.5 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                {d.title}
              </h4>

              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {d.summary}
              </p>

              <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="line-clamp-1">{d.phase_title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
