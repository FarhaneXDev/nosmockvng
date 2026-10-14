'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Sun, 
  Moon, 
  Sparkles, 
  ShieldAlert, 
  Smile, 
  Save, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { api } from '@/lib/api';
import confetti from 'canvas-confetti';

const MOODS = [
  { val: 1, emoji: '😔', label: 'Difficile' },
  { val: 2, emoji: '😐', label: 'Tendu' },
  { val: 3, emoji: '🙂', label: 'Stable' },
  { val: 4, emoji: '😊', label: 'Bien' },
  { val: 5, emoji: '🚀', label: 'Fort' },
];

export default function CheckinPage() {
  const [activeTab, setActiveTab] = useState('morning'); // 'morning' or 'evening'
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [morningIntention, setMorningIntention] = useState('');
  const [morningRisk, setMorningRisk] = useState('');
  const [morningStrategy, setMorningStrategy] = useState('');

  const [eveningCigarettes, setEveningCigarettes] = useState(0);
  const [eveningCravings, setEveningCravings] = useState(0);
  const [moodRating, setMoodRating] = useState(4);
  const [eveningLearning, setEveningLearning] = useState('');
  const [eveningAdjustment, setEveningAdjustment] = useState('');

  useEffect(() => {
    // Automatically switch to evening if after 18:00
    const hour = new Date().getHours();
    if (hour >= 18) {
      setActiveTab('evening');
    }

    async function loadToday() {
      try {
        const data = await api.getTodayCheckIn();
        if (data) {
          setMorningIntention(data.morning_intention || '');
          setMorningRisk(data.morning_risk || '');
          setMorningStrategy(data.morning_strategy || '');
          setEveningCigarettes(data.evening_cigarettes_smoked ?? 0);
          setEveningCravings(data.evening_cravings_managed ?? 0);
          setMoodRating(data.mood_rating ?? 4);
          setEveningLearning(data.evening_learning || '');
          setEveningAdjustment(data.evening_adjustment || '');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadToday();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.updateTodayCheckIn({
        morning_intention: morningIntention,
        morning_risk: morningRisk,
        morning_strategy: morningStrategy,
        evening_cigarettes_smoked: eveningCigarettes,
        evening_cravings_managed: eveningCravings,
        mood_rating: moodRating,
        evening_learning: eveningLearning,
        evening_adjustment: eveningAdjustment,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);

      if (activeTab === 'evening' && eveningCigarettes === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Date with Benin Timezone Africa/Porto-Novo
  const todayStr = new Date().toLocaleDateString('fr-FR', {
    timeZone: 'Africa/Porto-Novo',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Suivi Quotidien</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white capitalize">
          {todayStr}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Un point d’ancrage rapide le matin pour anticiper, un débriefing bienveillant le soir pour consolider.
        </p>

        {/* Tab Toggle: Touch-friendly full width */}
        <div className="flex items-center justify-center p-1 rounded-2xl bg-slate-900 border border-slate-800 max-w-sm mx-auto mt-4">
          <button
            onClick={() => setActiveTab('morning')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'morning'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Matin (Intention)</span>
          </button>
          <button
            onClick={() => setActiveTab('evening')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'evening'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Soir (Bilan)</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="p-4 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        {activeTab === 'morning' ? (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <span>Mon Bouclier du Matin</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Quelques secondes pour calibrer votre état d'esprit avant les premières tentations.
              </p>
            </div>

            {/* Morning Intention */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Mon intention pour aujourd’hui
              </label>
              <input
                type="text"
                placeholder="Ex : Aujourd’hui, je choisis mon souffle et je ne négocie pas avec l’envie..."
                value={morningIntention}
                onChange={(e) => setMorningIntention(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Morning Risk */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                2. Le principal risque identifié aujourd’hui
              </label>
              <input
                type="text"
                placeholder="Ex : La pause de 10h au travail, la sortie en terrasse..."
                value={morningRisk}
                onChange={(e) => setMorningRisk(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Morning Strategy */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                3. Ma stratégie choisie en parade
              </label>
              <input
                type="text"
                placeholder="Ex : Garder un stylo en main, boire de l'eau fraîche, marcher 5 min..."
                value={morningStrategy}
                onChange={(e) => setMorningStrategy(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-400" />
                <span>Mon Bilan du Soir</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Célébrer les victoires, ajuster sans honte ni culpabilité.
              </p>
            </div>

            {/* Cigarettes smoked */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Cigarettes fumées (Objectif : 0)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={eveningCigarettes}
                    onChange={(e) => setEveningCigarettes(parseInt(e.target.value) || 0)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                  {eveningCigarettes === 0 ? (
                    <span className="text-xs font-bold text-emerald-400 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 whitespace-nowrap">
                      🎉 0 cig
                    </span>
                  ) : (
                    <Link
                      href="/faux-pas"
                      className="text-xs text-amber-400 underline whitespace-nowrap font-semibold"
                    >
                      Analyser
                    </Link>
                  )}
                </div>
              </div>

              {/* Cravings Managed */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Envies surmontées aujourd'hui
                </label>
                <input
                  type="number"
                  min="0"
                  value={eveningCravings}
                  onChange={(e) => setEveningCravings(parseInt(e.target.value) || 0)}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Mood Rating: Responsive 5-grid */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Mon humeur générale aujourd'hui :
              </label>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {MOODS.map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setMoodRating(item.val)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                      moodRating === item.val
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-lg sm:text-xl">{item.emoji}</span>
                    <span className="text-[10px] sm:text-xs font-bold mt-1 leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Evening Learning */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Une chose apprise aujourd'hui
              </label>
              <textarea
                rows={2}
                placeholder="Ex : J'ai remarqué qu'à 16h mon envie était juste un besoin de boire de l'eau..."
                value={eveningLearning}
                onChange={(e) => setEveningLearning(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Evening Adjustment */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Un ajustement pour demain
              </label>
              <textarea
                rows={2}
                placeholder="Ex : Préparer une bouteille d'eau fraîche avant de partir au travail..."
                value={eveningAdjustment}
                onChange={(e) => setEveningAdjustment(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Enregistré avec succès !</span>
            </span>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer mon check-in</span>
          </button>
        </div>
      </form>
    </div>
  );
}
