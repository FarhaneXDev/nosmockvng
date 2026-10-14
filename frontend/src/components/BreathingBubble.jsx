'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function BreathingBubble({ onComplete = null, targetCycles = 6 }) {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('coherence'); // 'coherence' (5-5) or 'box' (4-4-4-4)
  const [phaseIndex, setPhaseIndex] = useState(0); // index in current pattern
  const [secondsInPhase, setSecondsInPhase] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Patterns definition
  const patterns = {
    coherence: [
      { name: 'Inspirez par le nez', duration: 5, action: 'inhale', hint: 'Gonflez doucement le ventre' },
      { name: 'Expirez par la bouche', duration: 5, action: 'exhale', hint: 'Laissez retomber les épaules' },
    ],
    box: [
      { name: 'Inspirez', duration: 4, action: 'inhale', hint: 'Par le nez, calmement' },
      { name: 'Poumons pleins', duration: 4, action: 'hold-full', hint: 'Sans bloquer la gorge' },
      { name: 'Expirez', duration: 4, action: 'exhale', hint: 'Lentement par la bouche' },
      { name: 'Poumons vides', duration: 4, action: 'hold-empty', hint: 'Détendez le visage' },
    ],
  };

  const currentPattern = patterns[mode];
  const currentPhase = currentPattern[phaseIndex];

  useEffect(() => {
    let timer = null;
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsInPhase((prev) => {
          if (prev + 1 >= currentPhase.duration) {
            // Next phase
            const nextPhaseIndex = (phaseIndex + 1) % currentPattern.length;
            if (nextPhaseIndex === 0) {
              setCompletedCycles((c) => {
                const updated = c + 1;
                if (onComplete && updated >= targetCycles) {
                  onComplete();
                }
                return updated;
              });
            }
            setPhaseIndex(nextPhaseIndex);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, phaseIndex, currentPhase, currentPattern, onComplete, targetCycles]);

  const handleReset = () => {
    setIsRunning(false);
    setPhaseIndex(0);
    setSecondsInPhase(0);
    setCompletedCycles(0);
  };

  const remainingInPhase = currentPhase.duration - secondsInPhase;

  // Scale computation for animation
  let scale = 'scale-100';
  if (isRunning) {
    if (currentPhase.action === 'inhale') scale = 'scale-125 transition-transform duration-[5000ms] ease-out';
    else if (currentPhase.action === 'hold-full') scale = 'scale-125';
    else if (currentPhase.action === 'exhale') scale = 'scale-90 transition-transform duration-[5000ms] ease-in';
    else if (currentPhase.action === 'hold-empty') scale = 'scale-90';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl max-w-md mx-auto text-center">
      {/* Mode Selector */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 mb-6">
        <button
          onClick={() => { setMode('coherence'); handleReset(); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'coherence'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Cohérence (5s/5s)
        </button>
        <button
          onClick={() => { setMode('box'); handleReset(); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'box'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Respiration Carrée (4s)
        </button>
      </div>

      {/* Main Visual Circle */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center my-4">
        {/* Outer glowing pulsing halo */}
        <div 
          className={`absolute inset-0 rounded-full bg-emerald-500/10 blur-xl transition-all duration-1000 ${
            isRunning ? 'opacity-100' : 'opacity-40'
          }`} 
        />

        {/* Breathing Circle */}
        <div
          className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-emerald-500/50 flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-950/80 via-slate-900/90 to-teal-950/80 shadow-2xl relative z-10 ${scale}`}
        >
          <span className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono">
            {isRunning ? remainingInPhase : currentPhase.duration}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-200 mt-2 px-4 leading-tight">
            {isRunning ? currentPhase.name : 'Prêt(e) à respirer'}
          </span>
        </div>
      </div>

      {/* Prompt & Advice */}
      <p className="text-xs sm:text-sm text-slate-400 min-h-[2.5rem] mt-2 font-medium">
        {isRunning ? currentPhase.hint : 'Installez-vous confortablement, le dos droit et les pieds au sol.'}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
              : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/30 hover:scale-105'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Mettre en pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Démarrer l'exercice</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="Réinitialiser"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Progress count */}
      <span className="text-[11px] text-slate-500 mt-4">
        Cycles complétés : {completedCycles}
      </span>
    </div>
  );
}
