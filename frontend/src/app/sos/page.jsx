'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Flame, 
  Wind, 
  Footprints, 
  Smile, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  HeartCrack
} from 'lucide-react';
import BreathingBubble from '@/components/BreathingBubble';
import { TRIGGERS_CONFIG } from '@/lib/constants';
import { api } from '@/lib/api';
import confetti from 'canvas-confetti';

const STEPS = [
  { num: 1, label: 'Nommer', desc: 'Identifier le déclencheur' },
  { num: 2, label: 'Différer', desc: 'Minuteur 10 min' },
  { num: 3, label: 'Respirer', desc: 'Calmer le système nerveux' },
  { num: 4, label: 'Bouger', desc: 'Rompre le réflexe corporel' },
  { num: 5, label: 'Occuper', desc: 'Bouche et mains' },
  { num: 6, label: 'Réévaluer', desc: 'Constater la baisse' },
];

export default function SosPage() {
  const router = useRouter();

  // Wizard Step: 1 = Nommer, 2 = Différer (Timer), 3 = Respirer, 4 = Bouger, 5 = Occuper mains/bouche, 6 = Réévaluer
  const [step, setStep] = useState(1);
  
  // State
  const [selectedTrigger, setSelectedTrigger] = useState('stress');
  const [intensityBefore, setIntensityBefore] = useState(7);
  const [intensityAfter, setIntensityAfter] = useState(3);
  const [chosenAction, setChosenAction] = useState('marcher');
  const [chosenMouthHand, setChosenMouthHand] = useState('eau_fraiche');
  
  // 10-Minute Timer
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 min = 600s
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleFinishAndSave = async (outcome = 'resisted') => {
    try {
      await api.createCraving({
        trigger: selectedTrigger,
        intensity_before: intensityBefore,
        intensity_after: intensityAfter,
        strategies_used: ['protocole-10-minutes', chosenAction, chosenMouthHand],
        outcome: outcome,
        duration_seconds: 600 - secondsRemaining,
      });
      setIsSaved(true);

      if (outcome === 'resisted') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header bar with mobile stepper */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Protocole Anti-Envie : 10 Minutes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Traversez cette vague sans fumer
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          « Une envie est une vague passagère. Elle monte, atteint un pic et retombe toujours. »
        </p>

        {/* Mobile Horizontal Stepper */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 pt-3 overflow-x-auto pb-1 scrollbar-none px-1">
          {STEPS.map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                step === s.num
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105'
                  : step > s.num
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{s.num}.</span>
              <span className="hidden xs:inline sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 sm:p-8 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* STEP 1: NOMMER */}
        {step === 1 && (
          <div className="space-y-5 sm:space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3 sm:pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Étape 1 sur 6</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                Nommer l'envie & Identifier le déclencheur
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Dites-vous : <em>« C'est une envie de fumer. Elle est désagréable, mais elle va s'éteindre. »</em>
              </p>
            </div>

            {/* Intensity slider before */}
            <div className="space-y-2 p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-slate-200">
                  Intensité ressentie en ce moment :
                </label>
                <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono">
                  {intensityBefore} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={intensityBefore}
                onChange={(e) => setIntensityBefore(parseInt(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>0 (Légère pensée)</span>
                <span>5 (Moyenne)</span>
                <span>10 (Pic extrême)</span>
              </div>
            </div>

            {/* Trigger Selector */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-200">
                Quel est le déclencheur principal ?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(TRIGGERS_CONFIG).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedTrigger(key)}
                    className={`p-3 rounded-2xl border text-left transition-all min-h-[50px] flex items-center ${
                      selectedTrigger === key
                        ? 'bg-rose-500/20 border-rose-500 text-white shadow-md shadow-rose-500/20 scale-[1.02]'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              💡 <strong>Action réflexe suggérée :</strong> {TRIGGERS_CONFIG[selectedTrigger]?.quickAction}
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>Passer au minuteur des 10 minutes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DIFFÉRER (TIMER) */}
        {step === 2 && (
          <div className="space-y-6 text-center animate-fadeIn">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Étape 2 sur 6</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                Différer : Donnez-vous 10 minutes
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg mx-auto">
                Règle d'or : ne pas acheter, ne pas demander, ne pas allumer de cigarette pendant ce délai. Vous déciderez après.
              </p>
            </div>

            {/* Big Timer */}
            <div className="py-4 sm:py-6 flex flex-col items-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-rose-500/40 flex flex-col items-center justify-center bg-slate-950 shadow-2xl relative">
                <span className="text-4xl sm:text-5xl font-black text-rose-400 font-mono tracking-tight">
                  {formatTimer(secondsRemaining)}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 mt-1 uppercase font-semibold">
                  Compte à rebours
                </span>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-5 py-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  {isTimerRunning ? 'Mettre en pause' : 'Reprendre'}
                </button>
                <button
                  onClick={() => setSecondsRemaining(600)}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Réinitialiser à 10 min"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setStep(1)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>

              <button
                onClick={() => setStep(3)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>Étape 3 : Respirer pour calmer le pic</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RESPIRER */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3 sm:pb-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Étape 3 sur 6</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                Respirer : Apaiser le système nerveux
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg mx-auto">
                La nicotine stimulait artificiellement la dopamine. La respiration lente active votre nerf vague et abaisse immédiatement le rythme cardiaque.
              </p>
            </div>

            <BreathingBubble targetCycles={4} />

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Minuteur</span>
              </button>

              <button
                onClick={() => setStep(4)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>Étape 4 : Bouger & Changer de lieu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: BOUGER */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3 sm:pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Étape 4 sur 6</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                Bouger : Rompre le réflexe physique
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Quittez immédiatement l'endroit où l'envie a surgi. Le cerveau associe les lieux au geste.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'marcher', title: 'Marcher 5 minutes', desc: 'Sortir faire le tour du quartier ou du couloir.', icon: '🚶' },
                { id: 'escalier', title: 'Monter des marches', desc: 'Faire monter le souffle pour libérer de vraies endorphines.', icon: '🪜' },
                { id: 'tache_rapide', title: 'Action manuelle courte', desc: 'Ranger un tiroir, faire la vaisselle, s\'étirer debout.', icon: '🧹' },
              ].map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setChosenAction(act.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    chosenAction === act.id
                      ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">{act.icon}</span>
                  <h4 className="font-bold text-sm text-white mt-2">{act.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{act.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setStep(3)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Respirer</span>
              </button>

              <button
                onClick={() => setStep(5)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>Étape 5 : Occuper bouche et mains</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: OCCUPER MAINS & BOUCHE */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3 sm:pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Étape 5 sur 6</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                Occuper la bouche et les mains
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Le cerveau réclame une habitude motrice. Donnez à vos mains et votre bouche un substitut sain.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'eau_fraiche', title: 'Grand verre d’eau fraîche', desc: 'Boire à petites gorgées lentes pour court-circuiter l’envie orale.', icon: '💧' },
                { id: 'chewing_gum', title: 'Chewing-gum mentholé', desc: 'Sans sucre, goût menthe fort pour renouveler la fraîcheur.', icon: '🍬' },
                { id: 'objet_mains', title: 'Objet tactile en main', desc: 'Stylo, balle souple anti-stress, galet lisse ou élastique au poignet.', icon: '🖊️' },
                { id: 'brossage', title: 'Brossage de dents', desc: 'Un goût mentholé coupe net toute envie de fumer résiduelle.', icon: '🪥' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setChosenMouthHand(item.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    chosenMouthHand === item.id
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <h4 className="font-bold text-sm text-white mt-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setStep(4)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Bouger</span>
              </button>

              <button
                onClick={() => setStep(6)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>Étape 6 : Réévaluer l’intensité</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: RÉÉVALUER */}
        {step === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3 sm:pb-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Étape 6 sur 6</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                Réévaluer : La vague est-elle passée ?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg mx-auto">
                Comparez l’intensité maintenant avec l’intensité de départ ({intensityBefore}/10).
              </p>
            </div>

            {/* Intensity slider after */}
            <div className="max-w-md mx-auto space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  Intensité résiduelle actuelle :
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  {intensityAfter} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={intensityAfter}
                onChange={(e) => setIntensityAfter(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>0 (Disparue)</span>
                <span>5 (Encore présente)</span>
                <span>10 (Pic)</span>
              </div>
            </div>

            {/* Victory or Needs Restart Card */}
            {isSaved ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                  🎉
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Envie enregistrée dans votre journal !
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Bravo, vous avez traversé cette vague avec succès. Chaque victoire renforce votre liberté.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <button
                    onClick={() => router.push('/')}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs"
                  >
                    Retour au tableau de bord
                  </button>
                  <button
                    onClick={() => router.push('/journal')}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                  >
                    Consulter mon journal
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="flex flex-col gap-3 justify-center">
                  <button
                    onClick={() => handleFinishAndSave('resisted')}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>J'AI TRAVERSÉ L'ENVIE SANS FUMER !</span>
                  </button>

                  <button
                    onClick={() => { setStep(2); setSecondsRemaining(600); }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 shrink-0" />
                    <span>L'envie persiste (Recommencer 10 min)</span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => router.push('/faux-pas')}
                    className="text-xs text-slate-400 hover:text-amber-400 underline underline-offset-4"
                  >
                    J'ai craqué sur une cigarette ? Débriefing bienveillant sans culpabilité
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
