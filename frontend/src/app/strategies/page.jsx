'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Wind, 
  Footprints, 
  HeartHandshake, 
  Sunrise, 
  Briefcase, 
  Utensils, 
  Smile, 
  Eye, 
  Flame,
  CheckCircle2,
  ArrowRight,
  Filter
} from 'lucide-react';
import BreathingBubble from '@/components/BreathingBubble';
import { api } from '@/lib/api';
import { TRIGGERS_CONFIG } from '@/lib/constants';

const ICON_MAP = {
  Timer: Flame,
  Wind: Wind,
  HeartHandshake: HeartHandshake,
  Sunrise: Sunrise,
  Briefcase: Briefcase,
  Utensils: Utensils,
  Eye: Eye,
  Smile: Smile,
};

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState([]);
  const [selectedTag, setSelectedTag] = useState('all');
  const [activeStrategy, setActiveStrategy] = useState(null);
  const [interactiveMode, setInteractiveMode] = useState(null); // 'breathing', 'pause', 'anchoring'

  // Step state for PAUSE protocol
  const [pauseStep, setPauseStep] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getStrategies();
        if (data && data.length > 0) {
          setStrategies(data);
          setActiveStrategy(data[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const filteredStrategies = selectedTag === 'all'
    ? strategies
    : strategies.filter(s => s.trigger_tags?.includes(selectedTag));

  const pauseSteps = [
    { letter: 'P', title: 'Poser', desc: 'Poser la cigarette et tout achat en attente. Ne rien acheter, ne rien allumer.' },
    { letter: 'A', title: 'Accueillir', desc: 'Nommer ce qui se passe : « Je me sens blessé(e), anxieux(se), seul(e) ou en colère ». Sans vous juger.' },
    { letter: 'U', title: 'Utiliser le souffle', desc: 'Prendre 5 inspirations profondes par le nez, relâcher les épaules, ancrer les pieds au sol.' },
    { letter: 'S', title: 'Sortir', desc: 'Sortir de la pièce ou de la discussion. Boire un verre d’eau fraîche ou marcher 5 minutes.' },
    { letter: 'E', title: 'Entrer en contact', desc: 'Contacter une personne fiable ou faire une activité préparée avant de prendre la moindre décision.' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bibliothèque de Stratégies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Boîte à outils de remplacement
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Des réponses concrètes et validées pour chaque déclencheur du sevrage tabagique.
          </p>
        </div>

        <Link
          href="/sos"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"
        >
          <Flame className="w-4 h-4 fill-white" />
          <span>SOS d'urgence (10 min)</span>
        </Link>
      </div>

      {/* Interactive Quick Launchers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setInteractiveMode(interactiveMode === 'breathing' ? null : 'breathing')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            interactiveMode === 'breathing'
              ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
            <Wind className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white">Exercice de Respiration</h3>
          <p className="text-xs text-slate-400 mt-1">Cohérence cardiaque 5-5 et respiration carrée animée.</p>
        </button>

        <button
          onClick={() => setInteractiveMode(interactiveMode === 'pause' ? null : 'pause')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            interactiveMode === 'pause'
              ? 'bg-purple-500/20 border-purple-500 text-white shadow-lg shadow-purple-500/20'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-3">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white">Protocole « PAUSE »</h3>
          <p className="text-xs text-slate-400 mt-1">Spécial solitude, disputes ou émotions vives.</p>
        </button>

        <button
          onClick={() => setInteractiveMode(interactiveMode === 'anchoring' ? null : 'anchoring')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            interactiveMode === 'anchoring'
              ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-3">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white">Ancrage Sensoriel 5-4-3-2-1</h3>
          <p className="text-xs text-slate-400 mt-1">Surcharger la mémoire de travail pour stopper l'envie.</p>
        </button>
      </div>

      {/* Interactive Mode Display */}
      {interactiveMode === 'breathing' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wind className="w-5 h-5 text-emerald-400" />
              <span>Guide respiratoire interactif</span>
            </h3>
            <button
              onClick={() => setInteractiveMode(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Fermer ✕
            </button>
          </div>
          <BreathingBubble targetCycles={6} />
        </div>
      )}

      {interactiveMode === 'pause' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-purple-500/40 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Protocole spécial relationnel & solitude
              </span>
              <h3 className="text-lg font-bold text-white">
                Les 5 étapes du réflexe « P.A.U.S.E. »
              </h3>
            </div>
            <button
              onClick={() => setInteractiveMode(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Fermer ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {pauseSteps.map((step, idx) => (
              <div
                key={step.letter}
                onClick={() => setPauseStep(idx)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  pauseStep === idx
                    ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl font-black text-purple-400 font-mono">
                  {step.letter}
                </span>
                <h4 className="font-bold text-sm text-slate-200 mt-2">{step.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300">
            ⚠️ <strong>Règle d'or :</strong> Pendant une dispute ou une vague de solitude, ne pas envoyer de message impulsif, ne pas relire en boucle une conversation, et attendre 15 minutes avant toute décision.
          </div>
        </div>
      )}

      {interactiveMode === 'anchoring' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Technique cognitive
              </span>
              <h3 className="text-lg font-bold text-white">
                Ancrage Sensoriel 5-4-3-2-1
              </h3>
            </div>
            <button
              onClick={() => setInteractiveMode(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Fermer ✕
            </button>
          </div>

          <div className="space-y-3">
            {[
              { num: 5, label: 'VOIR', desc: 'Identifiez 5 objets précis autour de vous (ex: l’ombre sur le mur, un stylo, une plante...).' },
              { num: 4, label: 'TOUCHER', desc: 'Ressentez 4 sensations tactiles (le contact du tissu sur votre peau, vos pieds au sol, la fraîcheur de l’air).' },
              { num: 3, label: 'ENTENDRE', desc: 'Écoutez 3 sons réels (la ventilation, une voiture au loin, votre respiration).' },
              { num: 2, label: 'SENTIR', desc: 'Repérez 2 odeurs dans la pièce (café, air ambiant, savon sur vos mains).' },
              { num: 1, label: 'GOÛTER', desc: 'Prenez conscience du goût dans votre bouche (fraîcheur de l’eau ou du dentifrice).' },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0">
                  {step.num}
                </span>
                <div>
                  <span className="text-xs font-bold text-cyan-300">{step.label}</span>
                  <p className="text-xs text-slate-300 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter by Trigger */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 px-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Déclencheur :</span>
        </span>
        <button
          onClick={() => setSelectedTag('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            selectedTag === 'all'
              ? 'bg-emerald-500 text-slate-950 font-extrabold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Toutes ({strategies.length})
        </button>
        {Object.entries(TRIGGERS_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedTag(key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedTag === key
                ? 'bg-emerald-500 text-slate-950 font-extrabold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Strategies Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStrategies.map((strat) => {
          const Icon = ICON_MAP[strat.icon_name] || Sparkles;

          return (
            <div
              key={strat.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800">
                    {strat.category_display || strat.category}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white">
                  {strat.title}
                </h3>

                <p className="text-xs text-emerald-400 font-semibold">
                  {strat.short_description}
                </p>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {strat.instructions}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                {strat.evidence_note && (
                  <p className="text-[11px] text-slate-400">
                    💡 <em>{strat.evidence_note}</em>
                  </p>
                )}
                {strat.safety_note && (
                  <p className="text-[11px] text-rose-300/80">
                    ⚠️ {strat.safety_note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
