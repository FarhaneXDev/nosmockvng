export const DEFAULT_USER_PROFILE = {
  cigarettes_per_day: 15,
  smoking_duration_years: 3.0,
  first_cigarette_delay_minutes: 45,
  pack_price: 700,
  currency: 'FCFA',
  cigarettes_per_pack: 20,
  quit_start_at: "2026-10-14T08:00:00",
  triggers: ["stress", "nervosite", "emotion_brusque", "solitude", "reveil", "travail", "repas", "main_bouche"],
  trusted_contact_name: "Proche de confiance",
  trusted_contact_phone: "",
  privacy_consent: true,
};

export const TRIGGERS_CONFIG = {
  stress: {
    label: "Stress & Pression",
    color: "from-rose-500/20 to-red-600/20 text-rose-300 border-rose-500/30",
    icon: "Flame",
    quickAction: "S'éloigner immédiatement de la source de stress, expirer longuement et marcher 5 minutes.",
  },
  nervosite: {
    label: "Nervosité & Agitation",
    color: "from-amber-500/20 to-orange-600/20 text-amber-300 border-amber-500/30",
    icon: "Activity",
    quickAction: "Secouer les bras, respirer en cohérence cardiaque et boire un grand verre d'eau fraîche.",
  },
  emotion_brusque: {
    label: "Émotion vive / Tristesse",
    color: "from-purple-500/20 to-indigo-600/20 text-purple-300 border-purple-500/30",
    icon: "HeartCrack",
    quickAction: "Différer toute décision de 10 min, écrire ce que l'on ressent sans l'envoyer, appeler une personne sûre.",
  },
  solitude: {
    label: "Solitude & Isolement",
    color: "from-blue-500/20 to-cyan-600/20 text-blue-300 border-blue-500/30",
    icon: "User",
    quickAction: "Envoyer un SMS simple à un proche, sortir faire le tour du quartier ou démarrer une activité manuelle préparée.",
  },
  reveil: {
    label: "Au réveil",
    color: "from-yellow-500/20 to-amber-600/20 text-yellow-300 border-yellow-500/30",
    icon: "Sunrise",
    quickAction: "Sortir du lit sans ruminer, boire un grand verre d'eau, se doucher et petit-déjeuner ailleurs.",
  },
  travail: {
    label: "Pause ou Travail",
    color: "from-emerald-500/20 to-teal-600/20 text-emerald-300 border-emerald-500/30",
    icon: "Briefcase",
    quickAction: "Pause debout, étirement, verre d'eau fraîche. Dire : « J'ai arrêté, je fais une pause autrement. »",
  },
  repas: {
    label: "Avant ou après repas",
    color: "from-orange-500/20 to-red-600/20 text-orange-300 border-orange-500/30",
    icon: "Utensils",
    quickAction: "Ne pas attendre affamé. Quitter la table dès la fin et se brosser les dents avec un dentifrice mentholé très frais.",
  },
  main_bouche: {
    label: "Geste main-bouche",
    color: "from-teal-500/20 to-cyan-600/20 text-teal-300 border-teal-500/30",
    icon: "Sparkles",
    quickAction: "Chewing-gum mentholé sans sucre, cure-dent propre, galet anti-stress ou stylo à manipuler.",
  },
  social: {
    label: "Soirée & Amis",
    color: "from-pink-500/20 to-rose-600/20 text-pink-300 border-pink-500/30",
    icon: "Users",
    quickAction: "Garder un verre d'eau fraîche ou un jus en main. S'éloigner du groupe fumeurs quelques minutes.",
  },
  autre: {
    label: "Autre déclencheur",
    color: "from-slate-500/20 to-gray-600/20 text-slate-300 border-slate-500/30",
    icon: "HelpCircle",
    quickAction: "Lancer le minuteur de 10 minutes et pratiquer 3 respirations complètes.",
  },
};

export const SUPPORT_SERVICES = [
  {
    name: "Ligne Verte Santé Bénin",
    number: "136",
    description: "Numéro vert gratuit du Ministère de la Santé du Bénin pour information, conseils sanitaires et orientation.",
    badge: "Bénin · Appel gratuit",
    url: "https://sante.gouv.bj",
  },
  {
    name: "SAMU Bénin / Urgences Nationales",
    number: "112",
    altNumber: "+229 95 36 11 04",
    description: "Service d'assistance médicale d'urgence et secours en cas de détresse ou de malaise sévère.",
    badge: "24h/24 · Urgences Bénin",
    url: null,
  },
  {
    name: "Tabac Info Écoute",
    number: "+33 1 44 93 51 00",
    altNumber: "39 89",
    description: "Accompagnement et conseils de spécialistes et tabacologues certifiés.",
    badge: "Spécialistes Sevrage",
    url: "https://www.tabac-info-service.fr",
  },
];

export const MANTRAS = [
  "Une envie est une vague, pas un ordre.",
  "Je ne dois pas gagner toute ma vie sans tabac aujourd'hui : juste les 10 prochaines minutes.",
  "Une cigarette fumée n'annule jamais mes progrès.",
  "Mon corps se régénère à chaque respiration pure.",
  "Demain, je ne négocie pas avec l'envie. J'attends 10 minutes, je bouge, je respire et je choisis à nouveau.",
  "La liberté a bien meilleur goût que la fumée.",
  "Je suis plus fort que quelques secondes d'illusion chimique.",
];

export const CURRENCIES = [
  { code: 'FCFA', symbol: 'FCFA', label: 'Franc CFA (Bénin / UEMOA)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'USD', symbol: '$', label: 'Dollar US ($)' },
  { code: 'CAD', symbol: '$', label: 'Dollar Canadien ($)' },
];
