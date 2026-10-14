'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Flame, 
  Filter, 
  Clock,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { api } from '@/lib/api';
import { TRIGGERS_CONFIG } from '@/lib/constants';
import confetti from 'canvas-confetti';

export default function JournalPage() {
  const [cravings, setCravings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Quick form state (< 30 seconds logging)
  const [newTrigger, setNewTrigger] = useState('stress');
  const [newEmotion, setNewEmotion] = useState('');
  const [newIntensityBefore, setNewIntensityBefore] = useState(7);
  const [newIntensityAfter, setNewIntensityAfter] = useState(3);
  const [newOutcome, setNewOutcome] = useState('resisted');
  const [newNotes, setNewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCravings = async () => {
    try {
      const data = await api.getCravings();
      setCravings(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCravings();
  }, []);

  const handleCreateCraving = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createCraving({
        trigger: newTrigger,
        emotion: newEmotion,
        intensity_before: newIntensityBefore,
        intensity_after: newIntensityAfter,
        outcome: newOutcome,
        notes: newNotes,
        strategies_used: ['journal_direct'],
      });

      if (newOutcome === 'resisted') {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }

      setShowAddModal(false);
      setNewEmotion('');
      setNewNotes('');
      loadCravings();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCraving = async (id) => {
    if (confirm('Voulez-vous supprimer cette entrée du journal ?')) {
      await api.deleteCraving(id);
      setCravings(cravings.filter(c => c.id !== id));
    }
  };

  const filteredCravings = selectedFilter === 'all'
    ? cravings
    : cravings.filter(c => c.trigger === selectedFilter);

  // Statistics
  const totalCravings = cravings.length;
  const resistedCount = cravings.filter(c => c.outcome === 'resisted').length;
  const resistedRate = totalCravings > 0 ? Math.round((resistedCount / totalCravings) * 100) : 100;
  const avgDrop = totalCravings > 0
    ? (cravings.reduce((acc, c) => acc + (c.intensity_before - (c.intensity_after ?? c.intensity_before)), 0) / totalCravings).toFixed(1)
    : '0';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Journal des Envies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Historique & Cartographie des vagues
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enregistrez une envie en moins de 30 secondes pour comprendre vos déclencheurs sans jugement.
          </p>
        </div>

        {/* Action Buttons: Full width on mobile */}
        <div className="w-full sm:w-auto flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2.5">
          <Link
            href="/sos"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 active:scale-95 transition-all text-center"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>SOS Minuteur 10 min</span>
          </Link>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Noter une envie (&lt;30s)</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards: Mobile Responsive 3-col or 2-col */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center sm:text-left">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Envies
          </span>
          <div className="mt-1 text-2xl sm:text-3xl font-black text-white font-mono">
            {totalCravings}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
            Traces observées
          </p>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center sm:text-left">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Succès
          </span>
          <div className="mt-1 text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {resistedRate}%
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
            {resistedCount} surmontées
          </p>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center sm:text-left">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Baisse
          </span>
          <div className="mt-1 text-2xl sm:text-3xl font-black text-blue-400 font-mono">
            -{avgDrop}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
            Points en moins
          </p>
        </div>
      </div>

      {/* Filter Tabs by Trigger (Horizontal Scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Filtre :</span>
        </span>
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            selectedFilter === 'all'
              ? 'bg-emerald-500 text-slate-950 font-extrabold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Tous ({totalCravings})
        </button>
        {Object.entries(TRIGGERS_CONFIG).map(([key, config]) => {
          const count = cravings.filter(c => c.trigger === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedFilter === key
                  ? 'bg-emerald-500 text-slate-950 font-extrabold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* List of Cravings */}
      {filteredCravings.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-900/60 border border-dashed border-slate-800 space-y-4">
          <div className="text-4xl">🌊</div>
          <h3 className="text-base font-bold text-white">
            Aucune envie enregistrée pour ce filtre
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Dès que vous ressentez une tentation ou traversez une vague, enregistrez-la pour visualiser votre progression.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Enregistrer ma première envie</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCravings.map((craving) => {
            const triggerInfo = TRIGGERS_CONFIG[craving.trigger] || TRIGGERS_CONFIG.autre;
            // Format date with Benin Timezone Africa/Porto-Novo
            const dateStr = new Date(craving.occurred_at).toLocaleDateString('fr-FR', {
              timeZone: 'Africa/Porto-Novo',
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={craving.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="space-y-1.5 flex-1 w-full">
                  <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${triggerInfo.color}`}>
                        {triggerInfo.label}
                      </span>

                      {craving.outcome === 'resisted' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          Surmontée
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                          Faux pas analysé
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{dateStr} (WAT)</span>
                    </span>
                  </div>

                  {craving.emotion && (
                    <p className="text-xs text-slate-300">
                      <strong>Émotion :</strong> {craving.emotion}
                    </p>
                  )}

                  {craving.notes && (
                    <p className="text-xs text-slate-400 italic">
                      « {craving.notes} »
                    </p>
                  )}
                </div>

                {/* Intensities badge & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t border-slate-800/60 sm:border-t-0">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                    <span className="text-rose-400 font-bold">
                      {craving.intensity_before}/10
                    </span>
                    <span className="text-slate-600">→</span>
                    <span className="text-emerald-400 font-bold">
                      {craving.intensity_after ?? craving.intensity_before}/10
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteCraving(craving.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK LOG BOTTOM-SHEET / MODAL (< 30s) */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle for mobile */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto sm:hidden -mt-1 mb-2" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Noter une envie en &lt; 30 secondes
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Zéro texte obligatoire · Rapide et sans jugement
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCraving} className="space-y-4">
              {/* Trigger */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Déclencheur
                </label>
                <select
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {Object.entries(TRIGGERS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Intensity Before */}
              <div className="space-y-1 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Intensité ressentie au pic :</span>
                  <span className="font-mono font-bold text-rose-400">{newIntensityBefore}/10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={newIntensityBefore}
                  onChange={(e) => setNewIntensityBefore(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Intensity After */}
              <div className="space-y-1 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Intensité après quelques minutes :</span>
                  <span className="font-mono font-bold text-emerald-400">{newIntensityAfter}/10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={newIntensityAfter}
                  onChange={(e) => setNewIntensityAfter(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Outcome */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Résultat
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewOutcome('resisted')}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                      newOutcome === 'resisted'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400'
                    }`}
                  >
                    ✅ Traversée
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewOutcome('smoked')}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                      newOutcome === 'smoked'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400'
                    }`}
                  >
                    ⚠️ Cigarette fumée
                  </button>
                </div>
              </div>

              {/* Optional Emotion */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">
                  Émotion dominante (facultatif)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Stress, Solitude, Frustration..."
                  value={newEmotion}
                  onChange={(e) => setNewEmotion(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Optional Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">
                  Note libre ou ce qui a aidé (facultatif)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex : Boire de l'eau et marcher 5 min a suffi..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
                >
                  {submitting ? 'Enregistrement...' : 'Enregistrer l’envie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
