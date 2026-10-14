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
  Banknote,
  Coins
} from 'lucide-react';
import { api } from '@/lib/api';
import { TRIGGERS_CONFIG } from '@/lib/constants';
import confetti from 'canvas-confetti';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // State with Benin defaults
  const [cigarettesPerDay, setCigarettesPerDay] = useState(15);
  const [packPrice, setPackPrice] = useState(1200);
  const [currency, setCurrency] = useState('FCFA');
  const [smokingYears, setSmokingYears] = useState(3.0);
  const [firstDelay, setFirstDelay] = useState(45);
  const [quitDate, setQuitDate] = useState('2026-10-14T08:00');
  const [selectedTriggers, setSelectedTriggers] = useState(['stress', 'nervosite', 'solitude', 'reveil', 'travail', 'main_bouche']);
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
        currency: currency,
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

  const dailyCost = ((cigarettesPerDay / 20) * packPrice);
  const monthlyCost = Math.round(dailyCost * 30.5);

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn py-4 sm:py-6 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Configuration Personnalisée</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Bienvenue dans Nosmokvng
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Personnalisez votre plan en 3 étapes. Vous pourrez modifier ces paramètres à tout moment.
        </p>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3 pt-3">
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

      <div className="p-5 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        {/* STEP 1: Profil Tabagique & Monnaie */}
        {step === 1 && (
          <div className="space-y-5 sm:space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Étape 1 sur 3</span>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">Vos habitudes de départ</h2>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Prix moyen du paquet ({currency})
                  </label>
                  <input
                    type="number"
                    step="50"
                    min="0"
                    value={packPrice}
                    onChange={(e) => setPackPrice(parseFloat(e.target.value) || 0)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Années de tabagisme
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={smokingYears}
                    onChange={(e) => setSmokingYears(parseFloat(e.target.value) || 0)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Live Savings Calculation Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <Banknote className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Économie mensuelle estimée :</span>
                </div>
                <div className="font-mono font-black text-emerald-400 text-sm sm:text-base">
                  ~{monthlyCost.toLocaleString('fr-FR')} {currency} / mois
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-xs text-slate-500 hover:text-slate-300 py-2"
              >
                Passer et utiliser les valeurs par défaut
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
              >
                <span>Étape suivante : Date d'arrêt</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Date d'arrêt & Déclencheurs */}
        {step === 2 && (
          <div className="space-y-5 sm:space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Étape 2 sur 3</span>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">Votre date de liberté & Vos déclencheurs</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Date et heure de début de l'arrêt (Heure Bénin WAT)
                </label>
                <input
                  type="datetime-local"
                  value={quitDate}
                  onChange={(e) => setQuitDate(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Sélectionnez vos déclencheurs récurrents :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(TRIGGERS_CONFIG).map(([k, v]) => {
                    const isSelected = selectedTriggers.includes(k);
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => toggleTrigger(k)}
                        className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="leading-tight">{v.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
              >
                <span>Étape suivante : Personne de confiance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Soutien & Validation */}
        {step === 3 && (
          <div className="space-y-5 sm:space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Étape 3 sur 3</span>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">Votre bouclier de soutien</h2>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Avoir une personne fiable que vous pouvez appeler sans vous faire juger double vos chances de traverser les vagues du soir et les moments de doute.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Prénom ou surnom d'un proche
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Kévin, Ma sœur..."
                    value={trustedName}
                    onChange={(e) => setTrustedName(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Numéro de téléphone (optionnel)
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex : +229 97 00 00 00"
                    value={trustedPhone}
                    onChange={(e) => setTrustedPhone(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1 leading-relaxed">
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Engagement de confidentialité totale</span>
                </p>
                <p>
                  Vos informations restent strictement privées sur votre espace sécurisé. Zéro revente, zéro traçage tiers.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              <button
                type="button"
                onClick={handleFinish}
                disabled={submitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
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
