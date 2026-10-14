'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Download, 
  Trash2, 
  Save, 
  Bell, 
  BellOff, 
  ShieldCheck, 
  User, 
  Calendar, 
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  FileJson
} from 'lucide-react';
import { api } from '@/lib/api';
import { DEFAULT_USER_PROFILE } from '@/lib/constants';

export default function ParametresPage() {
  const [profile, setProfile] = useState(DEFAULT_USER_PROFILE);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, remData] = await Promise.all([
          api.getProfile(),
          api.getReminders(),
        ]);
        if (profData) setProfile(profData);
        if (remData) setReminders(remData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile(profile);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleReminder = async (id, currentEnabled) => {
    try {
      await api.updateReminder(id, { enabled: !currentEnabled });
      setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !currentEnabled } : r));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetData = async () => {
    try {
      await api.resetData();
      alert('Toutes vos données de journalisation ont été supprimées avec succès.');
      setResetConfirm(false);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Paramètres & Données</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Configuration personnelle & Confidentialité
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Vous êtes propriétaire de vos données. Modifiez vos paramètres ou exportez l'intégralité de votre historique à tout moment.
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <span>Mon Profil Tabagique & Objectifs</span>
          </h2>
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Enregistré !</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Consommation quotidienne (cigarettes / jour)
            </label>
            <input
              type="number"
              min="1"
              value={profile.cigarettes_per_day}
              onChange={(e) => setProfile({ ...profile, cigarettes_per_day: parseInt(e.target.value) || 0 })}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Prix du paquet (€)
            </label>
            <input
              type="number"
              step="0.10"
              min="0"
              value={profile.pack_price}
              onChange={(e) => setProfile({ ...profile, pack_price: parseFloat(e.target.value) || 0 })}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Date et heure officielle d’arrêt
            </label>
            <input
              type="datetime-local"
              value={profile.quit_start_at ? profile.quit_start_at.substring(0, 16) : '2026-10-14T08:00'}
              onChange={(e) => setProfile({ ...profile, quit_start_at: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
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
              value={profile.smoking_duration_years}
              onChange={(e) => setProfile({ ...profile, smoking_duration_years: parseFloat(e.target.value) || 0 })}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Nom du proche de confiance
            </label>
            <input
              type="text"
              placeholder="Ex : Sarah, Mon frère..."
              value={profile.trusted_contact_name || ''}
              onChange={(e) => setProfile({ ...profile, trusted_contact_name: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Téléphone du proche (facultatif)
            </label>
            <input
              type="tel"
              placeholder="Ex : 06 12 34 56 78"
              value={profile.trusted_contact_phone || ''}
              onChange={(e) => setProfile({ ...profile, trusted_contact_phone: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer mes modifications</span>
          </button>
        </div>
      </form>

      {/* Reminders List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <span>Rappels Quotidiens</span>
          </h2>
          <span className="text-xs text-slate-400">
            Désactivables à tout moment
          </span>
        </div>

        <div className="space-y-3">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {rem.time_str}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {rem.title}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {rem.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggleReminder(rem.id, rem.enabled)}
                className={`p-2.5 rounded-xl border transition-all ${
                  rem.enabled
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
                title={rem.enabled ? 'Désactiver' : 'Activer'}
              >
                {rem.enabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Export & Privacy Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-400" />
            <span>Exportation & Sauvegarde des Données</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Téléchargez l'ensemble de votre parcours sous un format standard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={api.exportDataUrl('json')}
            target="_blank"
            download="nosmokvng_export.json"
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 text-left transition-all flex items-center gap-3 group"
          >
            <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400 group-hover:scale-105 transition-transform">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Exporter au format JSON complet
              </span>
              <span className="text-[11px] text-slate-400">
                Profil, envies, check-ins, faux pas
              </span>
            </div>
          </a>

          <a
            href={api.exportDataUrl('csv')}
            target="_blank"
            download="nosmokvng_cravings.csv"
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-left transition-all flex items-center gap-3 group"
          >
            <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Exporter le Journal en CSV
              </span>
              <span className="text-[11px] text-slate-400">
                Compatible Excel, Sheets et LibreOffice
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Danger Zone : Reset / Right to be Forgotten */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-950/20 border border-rose-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-base font-bold">Zone Sensible : Réinitialisation Complète</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Conformément aux principes de confidentialité (Section 17 du cahier des charges), vous pouvez purger immédiatement toutes vos traces d'envies, de bilans et d'historique. Cette action est irréversible.
        </p>

        {resetConfirm ? (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3">
            <p className="text-xs font-bold text-rose-300">
              Êtes-vous certain(e) de vouloir tout effacer ?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleResetData}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Oui, supprimer définitivement
              </button>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purger toutes les données de suivi</span>
          </button>
        )}
      </div>

      {/* Privacy Guarantee Statement */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Engagement de Confidentialité & Éthique</span>
        </div>
        <p className="leading-relaxed">
          • Aucune donnée émotionnelle ou personnelle n'est vendue ni utilisée à des fins publicitaires.<br />
          • Aucun jugement, aucune promesse de guérison magique.<br />
          • Vos calculs d'économies et de cigarettes évitées sont des estimations transparentes fondées sur vos propres paramètres.
        </p>
      </div>
    </div>
  );
}
