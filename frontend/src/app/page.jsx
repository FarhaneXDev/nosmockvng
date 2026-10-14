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
    // Pick mantra based on day of month
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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner : Daily Mantra */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Mantra du jour
            </span>
            <p className="text-sm font-semibold text-white">
              « {MANTRAS[mantraIndex]} »
            </p>
          </div>
        </div>

        <Link
          href="/strategies"
          className="hidden sm:flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>Toutes les stratégies</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Hero Timer */}
      <SmokeFreeTimer quitDateString={profile?.quit_start_at} />

      {/* SOS Big Urgency Hero Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-950/50 via-slate-900 to-orange-950/40 border border-rose-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Bouclier Anti-Envie</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Une envie soudaine de fumer ?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Ne négociez pas avec l’envie. Lancez le protocole des 10 minutes : nommez la vague, respirez, occupez vos mains et laissez le pic redescendre naturellement.
          </p>
        </div>

        <Link
          href="/sos"
          className="shrink-0 flex items-center gap-3 px-6 sm:px-8 py-4 rounded-2xl text-base font-extrabold bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all text-center"
        >
          <Flame className="w-6 h-6 fill-white" />
          <span>LANCER LE MINUTEUR SOS (10 MIN)</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cigarettes évitées"
          value={stats?.estimates?.cigarettes_avoided ?? '0'}
          unit="cigs"
          subtitle="Basé sur 15 cigs/jour"
          icon="Shield"
          color="emerald"
        />
        <StatCard
          title="Argent économisé"
          value={stats?.estimates?.money_saved ?? '0.00'}
          unit="€"
          subtitle="Estimation cumulée"
          icon="Banknote"
          color="amber"
        />
        <StatCard
          title="Envies surmontées"
          value={stats?.cravings?.resisted ?? '0'}
          unit="vagues"
          subtitle="Traversées avec succès"
          icon="CheckCircle"
          color="blue"
        />
        <StatCard
          title="Santé pulmonaire"
          value={stats?.milestones?.filter(m => m.unlocked)?.length ?? '1'}
          unit={`/ ${stats?.milestones?.length ?? '7'}`}
          subtitle="Paliers physiologiques"
          icon="Heart"
          color="purple"
        />
      </div>

      {/* Two Column Layout : Check-in du jour & Parcours 30j */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Check-in Card */}
        <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Check-in du jour
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mb-4">
              {todayCheckin?.morning_intention ? (
                <span>
                  <strong>Intention posée :</strong> « {todayCheckin.morning_intention} »
                </span>
              ) : (
                'Prenez 30 secondes pour poser votre intention du matin et identifier votre risque principal.'
              )}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {todayCheckin?.evening_cravings_managed
                ? `${todayCheckin.evening_cravings_managed} envie(s) gérée(s) aujourd'hui`
                : 'Bilan du soir disponible'}
            </span>
            <Link
              href="/checkin"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors"
            >
              <span>{todayCheckin?.morning_intention ? 'Modifier le bilan' : 'Faire mon check-in'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 30-Day Journey Progress Preview */}
        <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Parcours 30 jours
                  </h3>
                  <span className="text-[11px] text-blue-400 font-semibold">
                    {currentJourneyDay.phase_title}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                Jour {currentJourneyDay.day_number}
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <h4 className="text-sm font-bold text-slate-200">
                {currentJourneyDay.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {currentJourneyDay.action_today}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {journeyDays.filter(d => d.completed).length} sur 30 jours validés
            </span>
            <Link
              href="/parcours"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 transition-colors"
            >
              <span>Voir le programme</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Health Milestones */}
      <MilestoneTracker milestones={stats?.milestones} />

      {/* Quick Access Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/journal"
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all group"
        >
          <div className="text-2xl mb-2">📖</div>
          <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
            Journal des envies
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Enregistrer une envie en moins de 30 secondes.
          </p>
        </Link>

        <Link
          href="/strategies"
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all group"
        >
          <div className="text-2xl mb-2">🧘</div>
          <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
            Stratégies & Souffle
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Cohérence cardiaque, protocole PAUSE, ancrage.
          </p>
        </Link>

        <Link
          href="/faux-pas"
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all group"
        >
          <div className="text-2xl mb-2">🤝</div>
          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
            Faux pas sans honte
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Une cigarette ne remet rien à zéro. Reprendre immédiatement.
          </p>
        </Link>

        <Link
          href="/urgence"
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition-all group"
        >
          <div className="text-2xl mb-2">📞</div>
          <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
            Lignes d'écoute
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Tabac Info Service (39 89), 3114 et proche fiable.
          </p>
        </Link>
      </div>
    </div>
  );
}
