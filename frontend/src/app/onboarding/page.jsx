'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Flame, 
  Calendar, 
  ShieldCheck,
  Banknote
} from 'lucide-react';
import { api } from '@/lib/api';
import { TRIGGERS_CONFIG, DEFAULT_USER_PROFILE } from '@/lib/constants';
import confetti from 'canvas-confetti';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // State
  const [cigarettesPerDay, setCigarettesPerDay] = useState(15);
  const [packPrice, setPackPrice] = useState(12.00);
  const [smokingYears, setSmokingYears] = useState(3.0);
  const [firstDelay, setFirstDelay] = useState(45);
  const [quitDate, setQuitDate] = useState('2026-10-14T08:00');
  const [selectedTriggers, setSelectedTriggers] = useState(['stress', 'solitude', 'reveil', 'travail', 'main_bouche']);
  const [trustedName, setTrustedName] = useState('');
  const [trustedPhone, setTrustedPhone] = useState('');

  const toggleTrigger = (key) => {
    if (selectedTriggers.includes(key)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== key));
    } else {
      setSelectedTriggers([...selectedTriggers, key]);
    }
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await api.updateProfile({
        cigarettes_per_day: cigarettesPerDay,
        pack_price: packPrice,
        smoking_duration_years: smokingYears,
        first_cigarette_delay_minutes: firstDelay,
        quit_start_at: quitDate,
        triggers: selectedTriggers,
        trusted_contact_name: trustedName,
        trusted_contact_phone: trustedPhone,
        privacy_consent: true,
      });

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 }
      });

      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (e) {
      console.error(e);
      router.push('/');
    } finally {
      setSubmitting(false);
    }
  };

  const dailyCost = ((cigarettesPerDay / 20) * packPrice).toFixed(2);
  const monthlyCost = (dailyCost * 30.5).toFixed(0);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn py-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Configuration Personnalisée</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Bienvenue dans Nosmokvng
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Personnalisez vos déclencheurs en 3 étapes courtes. Vous pourrez ajuster ces paramètres à tout moment.
        </p>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3 pt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === s ? 'w-10 bg-emerald-500' : step > s ? 'w-6 bg-emerald-700' : 'w-6 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        {/* STEP 1: Profil Tabagique */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Étape 1 sur 3</span>
              <h2 className="text-lg font-bold text-white">Vos habitudes de départ</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Consommation habituelle (cigarettes par jour)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={cigarettesPerDay}
                    onChange={(e) => setCigarettesPerDay(parseInt(e.target.value))}
                    className="flex-1 accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <span className="text-2xl font-black font-mono text-emerald-400 min-w-[3rem] text-right">
                    {cigarettesPerDay}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Prix moyen du paquet (€)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={packPrice}
                    onChange={(e) => setPackPrice(parseFloat(e.target.value) || 0)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Années de tabagisme
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={smokingYears}
                    onChange={(e) => setSmokingYears(parseFloat(e.target.value) || 0)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono font-bold"
                  />
                </div>
              </div>

              {/* Live Savings Calculation Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <Banknote className="w-5 h-5 text-emerald-400" />
                  <span>Économie estimée sans tabac :</span>
                </div>
                <div className="font-mono font-black text-emerald-400 text-sm">
                  ~{monthlyCost} € / mois
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                Passer et utiliser les valeurs par défaut
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs"
              >
                <span>Étape suivante : Date d'arrêt</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Date d'arrêt & Déclencheurs */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Étape 2 sur 3</span>
              <h2 className="text-lg font-bold text-white">Votre date de liberté & Vos déclencheurs</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Date et heure de début de l'arrêt complet
                </label>
                <input
                  type="datetime-local"
                  value={quitDate}
                  onChange={(e) => setQuitDate(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Sélectionnez vos déclencheurs récurrents :
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.entries(TRIGGERS_CONFIG).map(([k, v]) => {
                    const isSelected = selectedTriggers.includes(k);
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => toggleTrigger(k)}
                        className={`p-3 rounded-xl text-left border text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{v.label}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs"
              >
                <span>Étape suivante : Personne de confiance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Soutien & Validation */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Étape 3 sur 3</span>
              <h2 className="text-lg font-bold text-white">Votre bouclier de soutien</h2>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Avoir une personne fiable que vous pouvez appeler sans vous faire juger double vos chances de traverser les vagues du soir et des coups durs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Prénom ou surnom d'un proche
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Sarah, Mon ami..."
                    value={trustedName}
                    onChange={(e) => setTrustedName(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Numéro de téléphone (optionnel)
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex : 06 12 34 56 78"
                    value={trustedPhone}
                    onChange={(e) => setTrustedPhone(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Engagement de confidentialité totale</span>
                </p>
                <p>
                  Vos informations restent strictement sur votre appareil et votre base privée. Zéro revente, zéro traçage tiers.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              <button
                type="button"
                onClick={handleFinish}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'Initialisation...' : 'Valider & Démarrer mon arrêt'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
