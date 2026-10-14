'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PhoneCall, 
  HeartHandshake, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink,
  User,
  HeartPulse,
  ArrowRight
} from 'lucide-react';
import { api } from '@/lib/api';
import { SUPPORT_SERVICES } from '@/lib/constants';

export default function UrgencePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getProfile();
        if (data) setProfile(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
          <PhoneCall className="w-4 h-4 text-rose-400" />
          <span>Écoute & Soutien</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Vous n'êtes pas seul(e) face au sevrage
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Le sevrage tabagique peut déclencher des vagues émotionnelles intenses, des doutes ou un sentiment de solitude. Demander de l'aide ou parler quelques minutes est un acte de courage, jamais de faiblesse.
        </p>
      </div>

      {/* Trusted Contact Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Mon Bouclier Humain
            </span>
            <h2 className="text-lg font-black text-white">
              Contacter mon proche de confiance
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          {profile?.trusted_contact_name ? (
            <span>
              Votre contact enregistré : <strong>{profile.trusted_contact_name}</strong>
              {profile.trusted_contact_phone && ` (${profile.trusted_contact_phone})`}
            </span>
          ) : (
            "Vous n'avez pas encore configuré de personne de confiance dans vos paramètres."
          )}
        </p>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-slate-200">
            💬 Message simple prêt à copier ou envoyer :
          </p>
          <p className="italic text-emerald-300">
            « J'ai arrêté de fumer. Là, je ressens une forte envie et de la nervosité. Peux-tu m'aider à tenir quelques minutes en me parlant de tout et de rien ? »
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {profile?.trusted_contact_phone && (
            <a
              href={`tel:${profile.trusted_contact_phone}`}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Appeler {profile.trusted_contact_name || 'mon contact'}</span>
            </a>
          )}
          <Link
            href="/parametres"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
          >
            <span>Modifier mon contact dans les paramètres</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Official Free Helpline Services */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-1">
          Lignes d'assistance professionnelles gratuites
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SUPPORT_SERVICES.map((srv, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                  {srv.badge}
                </span>
                <h4 className="text-base font-black text-white">{srv.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`tel:${srv.number.replace(/\s+/g, '')}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold text-xs border border-emerald-500/30"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{srv.number}</span>
                </a>

                {srv.url && (
                  <a
                    href={srv.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent Medical Disclaimer & SAMU */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-rose-400 font-bold">
          <HeartPulse className="w-4 h-4" />
          <span>Quand contacter les urgences médicales ?</span>
        </div>
        <p className="leading-relaxed">
          Cette application est un compagnon bienveillant d'auto-sevrage comportemental, elle ne remplace pas un médecin. En cas de <strong>douleur thoracique</strong>, de <strong>difficulté respiratoire aiguë</strong>, de malaise important ou de détresse psychologique extrême, contactez immédiatement le <strong>SAMU (15)</strong> ou le <strong>Numéro d'urgence européen (112)</strong>.
        </p>
      </div>
    </div>
  );
}
