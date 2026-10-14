'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HeartHandshake, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Clock
} from 'lucide-react';
import { api } from '@/lib/api';

export default function FauxPasPage() {
  const router = useRouter();
  const [relapses, setRelapses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [context, setContext] = useState('');
  const [feeling, setFeeling] = useState('');
  const [whatHappenedBefore, setWhatHappenedBefore] = useState('');
  const [helpfulActionNextTime, setHelpfulActionNextTime] = useState('');
  const [nextActionImmediate, setNextActionImmediate] = useState("Reprendre immédiatement le plan, boire un grand verre d'eau et ranger tout résidu.");
  const [cigarettesCount, setCigarettesCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadRelapses() {
      try {
        const data = await api.getRelapses();
        if (data) setRelapses(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadRelapses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createRelapse({
        context,
        feeling,
        what_happened_before: whatHappenedBefore,
        helpful_action_next_time: helpfulActionNextTime,
        next_action_immediate: nextActionImmediate,
        cigarettes_count: cigarettesCount,
      });

      setIsSaved(true);
      const updated = await api.getRelapses();
      setRelapses(updated || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Compassionate Header */}
      <div className="p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4 text-amber-400" />
          <span>Espace Sans Culpabilité</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Une cigarette fumée n'annule jamais vos progrès
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Un faux pas n'est pas un échec, c'est une information précieuse. Vos jours précédents sans fumée restent acquis dans votre corps et votre cerveau. On éteint, on se débarrasse du reste et on reprend le plan à la seconde même.
        </p>

        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-amber-200/90 font-medium flex items-start gap-2 leading-relaxed">
          <span>🛡️</span>
          <span>
            <strong>Évitez le piège :</strong> « Puisque j'ai craqué, autant finir le paquet et recommencer lundi. » La réponse efficace est immédiate et bienveillante : retour direct au plan sans aucune punition.
          </span>
        </div>
      </div>

      {/* Debrief Form */}
      {!isSaved ? (
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-emerald-400" />
              <span>Comprendre l'événement pour vous protéger la prochaine fois</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Répondez en toute honnêteté, sans jugement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cigarettes count */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Combien de cigarette(s) ?
              </label>
              <input
                type="number"
                min="1"
                value={cigarettesCount}
                onChange={(e) => setCigarettesCount(parseInt(e.target.value) || 1)}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Context & Where */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Où étiez-vous ? Qui était présent ?
              </label>
              <input
                type="text"
                placeholder="Ex : Soirée en terrasse avec des collègues..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                required
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Feeling */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              2. Que ressentiez-vous à ce moment précis ?
            </label>
            <input
              type="text"
              placeholder="Ex : Solitude soudaine, sentiment d'injustice, fatigue intense..."
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              required
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* What happened before */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              3. Qu'est-ce qui s'est passé juste avant ?
            </label>
            <textarea
              rows={2}
              placeholder="Ex : Une dispute par message, une surcharge de travail imprévue..."
              value={whatHappenedBefore}
              onChange={(e) => setWhatHappenedBefore(e.target.value)}
              required
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Helpful modification next time */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              4. Quelle modification concrète pour la prochaine fois ?
            </label>
            <textarea
              rows={2}
              placeholder="Ex : Prévenir un ami fiable, quitter la table, lancer le minuteur 10 min..."
              value={helpfulActionNextTime}
              onChange={(e) => setHelpfulActionNextTime(e.target.value)}
              required
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Next immediate action */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              5. Ma prochaine action immédiate
            </label>
            <input
              type="text"
              value={nextActionImmediate}
              onChange={(e) => setNextActionImmediate(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider l'apprentissage & Reprendre la route</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
            🌱
          </div>
          <h2 className="text-xl font-black text-white">
            Apprentissage enregistré. Vous êtes de nouveau sur les rails !
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Vous avez transformé un risque en bouclier pour l'avenir. Buvez un grand verre d'eau, respirez profondément et continuez votre chemin.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <button
              onClick={() => router.push('/')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs"
            >
              Retourner au tableau de bord
            </button>
            <button
              onClick={() => setIsSaved(false)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Voir mes débriefings passés
            </button>
          </div>
        </div>
      )}

      {/* Historical Relapses */}
      {relapses.length > 0 && (
        <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/60 border border-slate-800 space-y-3.5">
          <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
            Historique des apprentissages ({relapses.length})
          </h3>
          <div className="space-y-3">
            {relapses.map((r, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="font-bold text-amber-300">{r.context}</span>
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(r.occurred_at).toLocaleDateString('fr-FR', {
                        timeZone: 'Africa/Porto-Novo',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </span>
                </div>
                <p className="text-slate-300">
                  <strong>Émotion :</strong> {r.feeling}
                </p>
                <p className="text-emerald-400 font-semibold">
                  <strong>Solution identifiée :</strong> {r.helpful_action_next_time}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
