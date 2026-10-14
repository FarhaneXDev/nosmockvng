'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  HeartHandshake, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import SmokeFreeTimer from '@/components/SmokeFreeTimer';
import StatCard from '@/components/StatCard';
import MilestoneTracker from '@/components/MilestoneTracker';
import { api } from '@/lib/api';
import { MANTRAS, DEFAULT_USER_PROFILE } from '@/lib/constants';

export default function DashboardPage() {
  const [profile, setProfile] = useState(DEFAULT_USER_PROFILE);
  const [stats, setStats] = useState(null);
  const [todayCheckin, setTodayCheckin] = useState(null);
  const [journeyDays, setJourneyDays] = useState([]);
  const [recentCravings, setRecentCravings] = useState([]);
  const [mantraIndex, setMantraIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const day = new Date().getDate();
    setMantraIndex(day % MANTRAS.length);

    async function loadData() {
      try {
        const [profData, statsData, checkinData, journeyData, cravingsData] = await Promise.all([
          api.getProfile(),
          api.getStats(),
          api.getTodayCheckIn(),
          api.getJourney(),
          api.getCravings(),
        ]);

        if (profData) setProfile(profData);
        if (statsData) setStats(statsData);
        if (checkinData) setTodayCheckin(checkinData);
        if (journeyData && journeyData.length) setJourneyDays(journeyData);
        if (cravingsData) setRecentCravings(cravingsData.slice(0, 4));
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const currentJourneyDay = journeyDays.find(d => !d.completed) || journeyDays[0] || {
    day_number: 1,
    title: "Le premier jour sans tabac",
    phase_title: "Phase 1 : Sécuriser l'espace",
    action_today: "Retirez tous les briquets et préparez de l'eau.",
  };

  const currency = stats?.estimates?.currency || profile?.currency || 'FCFA';

  return (
    <div className="space-y-4 sm:space-y-7 animate-fadeIn">
      {/* Top Banner : Daily Mantra */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Mantra du jour
            </span>
            <p className="text-xs sm:text-sm font-semibold text-white leading-tight">
              « {MANTRAS[mantraIndex]} »
            </p>
          </div>
        </div>

        <Link
          href="/strategies"
          className="hidden md:flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 shrink-0"
        >
          <span>Stratégies</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Hero Timer */}
      <SmokeFreeTimer quitDateString={profile?.quit_start_at} />

      {/* Mobile-First Emergency SOS Banner */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-orange-950/50 border border-rose-500/30 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Bouclier Anti-Envie</span>
          </div>
          <h2 className="text-base sm:text-xl font-black text-white">
            Une envie soudaine de fumer ?
          </h2>
          <p className="text-xs text-slate-300">
            Traversez la vague en 10 minutes : nommez, respirez, bougez et occupez vos mains.
          </p>
        </div>

        <Link
          href="/sos"
          className="flex items-center justify-center gap-2.5 px-5 py-3.5 sm:px-7 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-black bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg shadow-rose-500/30 active:scale-95 transition-all text-center shrink-0"
        >
          <Flame className="w-5 h-5 fill-white shrink-0" />
          <span>LANCER LE MINUTEUR SOS (10 MIN)</span>
        </Link>
      </div>

      {/* Metrics Grid : 2x2 on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <StatCard
          title="Cigarettes évitées"
          value={stats?.estimates?.cigarettes_avoided ?? 0}
          unit="cigs"
          subtitle="Non fumées"
          icon="Shield"
          color="emerald"
        />
        <StatCard
          title="Argent préservé"
          value={stats?.estimates?.money_saved ?? 0}
          unit={currency}
          subtitle={`~${profile?.cigarettes_per_day || 15} cig/j`}
          icon="Banknote"
          color="amber"
        />
        <StatCard
          title="Envies surmontées"
          value={stats?.cravings?.resisted ?? 0}
          unit="vagues"
          subtitle="Traversées avec succès"
          icon="CheckCircle"
          color="blue"
        />
        <StatCard
          title="Paliers de santé"
          value={stats?.milestones?.filter(m => m.unlocked)?.length ?? 1}
          unit={`/ ${stats?.milestones?.length ?? 7}`}
          subtitle="Repères OMS"
          icon="Heart"
          color="purple"
        />
      </div>

      {/* Check-in du jour & Parcours 30j */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-6">
        {/* Daily Check-in Card */}
        <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Check-in du jour
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {todayCheckin?.morning_intention ? (
                <span>
                  <strong>Intention :</strong> « {todayCheckin.morning_intention} »
                </span>
              ) : (
                'Prenez 30 secondes pour poser votre intention du matin et identifier votre risque principal.'
              )}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {todayCheckin?.evening_cravings_managed
                ? `${todayCheckin.evening_cravings_managed} envie(s) gérée(s)`
                : 'Bilan soir disponible'}
            </span>
            <Link
              href="/checkin"
              className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700"
            >
              <span>{todayCheckin?.morning_intention ? 'Voir / Modifier' : 'Faire le check-in'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 30-Day Journey Progress Preview */}
        <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Parcours 30 jours
                  </h3>
                  <span className="text-[10px] text-blue-400 font-semibold block">
                    {currentJourneyDay.phase_title}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                Jour {currentJourneyDay.day_number}
              </span>
            </div>

            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                {currentJourneyDay.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed line-clamp-2">
                {currentJourneyDay.action_today}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {journeyDays.filter(d => d.completed).length}/30 validés
            </span>
            <Link
              href="/parcours"
              className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30"
            >
              <span>Voir le programme</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Health Milestones */}
      <MilestoneTracker milestones={stats?.milestones} />

      {/* 4 Quick Access Touch Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <Link
          href="/journal"
          className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 active:scale-95 transition-all"
        >
          <div className="text-xl sm:text-2xl mb-1">📖</div>
          <h4 className="text-xs sm:text-sm font-bold text-white">Journal</h4>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 line-clamp-1">Noter en &lt;30s</p>
        </Link>

        <Link
          href="/strategies"
          className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 active:scale-95 transition-all"
        >
          <div className="text-xl sm:text-2xl mb-1">🧘</div>
          <h4 className="text-xs sm:text-sm font-bold text-white">Stratégies</h4>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 line-clamp-1">Souffle & PAUSE</p>
        </Link>

        <Link
          href="/faux-pas"
          className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 active:scale-95 transition-all"
        >
          <div className="text-xl sm:text-2xl mb-1">🤝</div>
          <h4 className="text-xs sm:text-sm font-bold text-white">Faux pas</h4>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 line-clamp-1">Sans culpabilité</p>
        </Link>

        <Link
          href="/urgence"
          className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 active:scale-95 transition-all"
        >
          <div className="text-xl sm:text-2xl mb-1">📞</div>
          <h4 className="text-xs sm:text-sm font-bold text-white">Aide Bénin</h4>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 line-clamp-1">136, 112, SAMU</p>
        </Link>
      </div>
    </div>
  );
}
