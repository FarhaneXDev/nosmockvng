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

export const DEFAULT_MILESTONES = [
  {
    title: "20 minutes",
    label: "Pression artérielle & pulsation",
    desc: "La pression sanguine et le rythme cardiaque redeviennent normaux.",
    progress: 100,
    unlocked: true,
  },
  {
    title: "8 heures",
    label: "Oxygénation du sang",
    desc: "Le monoxyde de carbone dans le sang diminue de moitié ; l'oxygénation cellulaire se normalise.",
    progress: 100,
    unlocked: true,
  },
  {
    title: "24 heures",
    label: "Élimination des résidus",
    desc: "Les poumons commencent à évacuer le mucus et les résidus de fumée.",
    progress: 100,
    unlocked: true,
  },
  {
    title: "48 heures",
    label: "Goût et odorat",
    desc: "La nicotine est presque entièrement éliminée du corps ; les terminaisons nerveuses du goût se réveillent.",
    progress: 60,
    unlocked: false,
  },
  {
    title: "72 heures",
    label: "Respiration décuplée",
    desc: "Les bronches se relâchent, respirer devient plus facile et le tonus énergétique augmente.",
    progress: 30,
    unlocked: false,
  },
  {
    title: "2 semaines",
    label: "Circulation et endurance",
    desc: "La circulation sanguine globale s'améliore, l'effort physique devient plus aisé.",
    progress: 10,
    unlocked: false,
  },
  {
    title: "1 mois",
    label: "Capacité pulmonaire",
    desc: "La toux et la fatigue diminuent, les cils bronchiques repoussent et protègent contre les infections.",
    progress: 5,
    unlocked: false,
  },
];

export const DEFAULT_STRATEGIES = [
  {
    id: 1,
    slug: "protocole-10-minutes",
    title: "Le Protocole des 10 minutes",
    category: "respiration",
    category_display: "Respiration & Apaisement",
    trigger_tags: ["stress", "nervosite", "emotion_brusque", "reveil", "travail", "autre"],
    short_description: "Différer l'envie, respirer lentement, occuper les mains et réévaluer.",
    instructions: "1. Nommer l'envie : « C'est une vague, elle est désagréable mais elle va passer. »\n2. Différer : Lancer le minuteur de 10 minutes sans prendre de décision d'achat ou d'allumage.\n3. Respirer doucement par le nez, expirer lentement par la bouche pendant 2 minutes.\n4. Bouger : Se lever, faire quelques pas ou monter des marches.\n5. Occuper les mains et la bouche : Verre d'eau, chewing-gum sans sucre ou stylo en main.\n6. Réévaluer l'intensité après 10 minutes.",
    evidence_note: "Une envie dure en moyenne entre 3 et 7 minutes si l'on ne la nourrit pas cognitivement.",
    safety_note: "Arrêter si la respiration forcée crée un étourdissement ; respirer naturellement.",
    icon_name: "Timer"
  },
  {
    id: 2,
    slug: "coherence-cardiaque",
    title: "Respiration apaisante (Cohérence 5-5)",
    category: "respiration",
    category_display: "Respiration & Apaisement",
    trigger_tags: ["stress", "nervosite", "emotion_brusque"],
    short_description: "Inspirer 5 secondes, expirer 5 secondes pour réguler le système nerveux autonome.",
    instructions: "Asseyez-vous le dos droit, les pieds bien à plat sur le sol.\nInspirez calmement par le nez pendant 5 secondes en gonflant le ventre.\nExpirez doucement par la bouche entrouverte pendant 5 secondes.\nRépétez ce cycle pendant 3 minutes.",
    evidence_note: "Fait chuter le cortisol (hormone de stress) et active le système parasympathique.",
    safety_note: "Ne forcez pas vos poumons, adoptez un rythme fluide.",
    icon_name: "Wind"
  },
  {
    id: 3,
    slug: "protocole-pause",
    title: "Protocole PAUSE (Solitude & Émotion)",
    category: "emotion",
    category_display: "Gestion Émotionnelle",
    trigger_tags: ["solitude", "emotion_brusque", "stress"],
    short_description: "P - Poser, A - Accueillir, U - Utiliser le souffle, S - Sortir, E - Entrer en contact.",
    instructions: "P — Poser la cigarette et tout achat en attente.\nA — Accueillir et nommer l'émotion (« Je me sens seul(e), blessé(e), anxieux(se) ») sans juger.\nU — Utiliser une respiration lente et ancrer solidement les pieds au sol.\nS — Sortir de la pièce quelques minutes, boire un grand verre d'eau ou marcher.\nE — Entrer en contact avec une personne bienveillante ou accomplir une action préparée.",
    evidence_note: "La cigarette n'a jamais résolu un conflit ; elle n'ajoute que de la dépendance.",
    safety_note: "En cas de détresse sévère, utilisez la page d'urgence ou contactez un proche.",
    icon_name: "HeartHandshake"
  },
  {
    id: 4,
    slug: "rituel-reveil",
    title: "Rituel nouveau du Réveil",
    category: "mouvement",
    category_display: "Changement de Contexte",
    trigger_tags: ["reveil"],
    short_description: "Casser l'automatisme du saut du lit en modifiant l'ordre des actions matinales.",
    instructions: "1. Ne restez pas à ruminer dans le lit ni à l'endroit habituel de fumage.\n2. Buvez immédiatement un grand verre d'eau tempérée.\n3. Lavez-vous le visage à l'eau fraîche ou prenez une douche stimulante.\n4. Faites 5 minutes d'étirements doux ou de marche.\n5. Prenez votre petit-déjeuner dans un endroit différent.",
    evidence_note: "La première cigarette matinale est conditionnée par l'environnement spatial.",
    safety_note: "",
    icon_name: "Sunrise"
  },
  {
    id: 5,
    slug: "pause-travail-active",
    title: "Pause active & décliner avec assurance",
    category: "anticipation",
    category_display: "Vie Sociale & Travail",
    trigger_tags: ["travail", "social"],
    short_description: "Faire une vraie pause sans tabac et savoir répondre sans se justifier.",
    instructions: "1. Levez-vous de votre bureau et marchez vers une zone aérée sans fumeurs.\n2. Buvez un thé ou de l'eau fraîche.\n3. Ayez un objet dans les mains (stylo, balle anti-stress).\n4. Si un collègue propose une cigarette, dites simplement : « J'ai arrêté, je fais une pause autrement ! »",
    evidence_note: "C'est la pause et la coupure de travail que le cerveau recherche, pas la nicotine.",
    safety_note: "",
    icon_name: "Briefcase"
  },
  {
    id: 6,
    slug: "rituel-avant-repas",
    title: "Rituel avant et après le repas",
    category: "main_bouche",
    category_display: "Substitution Motrice",
    trigger_tags: ["repas"],
    short_description: "Occuper les mains avant d'avoir trop faim et se brosser les dents immédiatement après.",
    instructions: "1. Ne vous laissez pas devenir affamé(e) et irritable : préparez une collation saine.\n2. Occupez vos mains en cuisinant ou en buvant de l'eau.\n3. Dès la dernière bouchée terminée, quittez la table !\n4. Brossez-vous les dents directement avec un dentifrice mentholé très frais.",
    evidence_note: "Le goût de menthe fraîche coupe net l'envie de fumer d'après-repas.",
    safety_note: "",
    icon_name: "Utensils"
  },
  {
    id: 7,
    slug: "ancrage-sensoriel-54321",
    title: "Technique d'ancrage 5-4-3-2-1",
    category: "ancrage",
    category_display: "Technique Cognitive",
    trigger_tags: ["stress", "nervosite", "emotion_brusque", "solitude"],
    short_description: "Revenir instantanément dans le moment présent en mobilisant vos 5 sens.",
    instructions: "Nommez dans votre tête :\n- 5 choses que vous pouvez VOIR\n- 4 choses que vous pouvez TOUCHER\n- 3 sons que vous pouvez ENTENDRE\n- 2 odeurs que vous pouvez SENTIR\n- 1 goût que vous pouvez RESSENTIR sur votre langue.",
    evidence_note: "Surcharge la mémoire de travail et interrompt la boucle obsessionnelle de l'envie.",
    safety_note: "",
    icon_name: "Eye"
  },
  {
    id: 8,
    slug: "boite-a-outils-main-bouche",
    title: "Alternatives geste main-bouche",
    category: "main_bouche",
    category_display: "Substitution Motrice",
    trigger_tags: ["main_bouche", "travail", "solitude"],
    short_description: "Des objets discrets pour satisfaire le besoin tactile et moteur sans tabac.",
    instructions: "Pour la bouche : Chewing-gum sans sucre menthe forte, grand verre d'eau avec paille propre.\nPour les mains : Petit galet lisse, balle souple anti-stress, élastique au poignet, stylo à tourner.",
    evidence_note: "Le geste main-bouche répété 15 fois par cigarette (~225 fois par jour) est une boucle motrice.",
    safety_note: "Ne jamais inhaler ni mâcher de produit non alimentaire.",
    icon_name: "Smile"
  }
];

export const DEFAULT_JOURNEY_DAYS = [
  {
    day_number: 1,
    phase_title: "Phase 1 : Sécuriser l'espace (Jours 1 à 3)",
    title: "Le premier jour sans tabac",
    summary: "Aujourd'hui, l'objectif est unique : traverser les envies une par une. Ne pensez pas à toute votre vie, pensez aux 10 prochaines minutes.",
    action_today: "Retirez tous les briquets, cendriers et paquets. Placez une bouteille d'eau et des chewing-gums à portée de main.",
    mantra: "Aujourd'hui, je ne négocie pas avec l'envie. J'attends 10 minutes, je respire et je choisis à nouveau.",
    completed: false
  },
  {
    day_number: 2,
    phase_title: "Phase 1 : Sécuriser l'espace (Jours 1 à 3)",
    title: "Le pic des premières 48 heures",
    summary: "Le taux de nicotine chute, le corps réclame sa dose habituelle. C'est normal de ressentir de l'agitation ou de la fatigue. C'est le signe que votre corps commence sa libération.",
    action_today: "Réduisez les exigences secondaires au travail et à la maison. Buvez beaucoup d'eau pour aider l'élimination.",
    mantra: "Une envie est une vague, pas un ordre. Je surfe sur la vague.",
    completed: false
  },
  {
    day_number: 3,
    phase_title: "Phase 1 : Sécuriser l'espace (Jours 1 à 3)",
    title: "La fin du sevrage physique aigu",
    summary: "À 72 heures, le corps a éliminé la quasi-totalité de la nicotine résiduelle. Les envies qui subsistent sont principalement psychologiques et comportementales.",
    action_today: "Faites une marche de 15 minutes en plein air et remarquez déjà la sensation de votre souffle.",
    mantra: "Mon corps est déjà en train de se nettoyer. Chaque heure compte.",
    completed: false
  },
  {
    day_number: 4,
    phase_title: "Phase 2 : Rituels & Repas (Jours 4 à 7)",
    title: "Identifier les déclencheurs automatiques",
    summary: "Vous commencez à repérer les moments réflexes : café du matin, fin du repas, trajet en voiture.",
    action_today: "Notez dans votre journal votre déclencheur le plus fort et choisissez une action de remplacement précise.",
    mantra: "Je change de rituel, pas seulement d'habitude.",
    completed: false
  },
  {
    day_number: 5,
    phase_title: "Phase 2 : Rituels & Repas (Jours 4 à 7)",
    title: "Repenser les pauses sans cigarette",
    summary: "La pause au travail n'a pas besoin de disparaître : elle doit juste être réinventée.",
    action_today: "Prenez une pause de 5 minutes avec un collègue non-fumeur ou faites le tour du pâté de maisons.",
    mantra: "J'ai le droit de faire une pause pour moi, sans fumée.",
    completed: false
  },
  {
    day_number: 6,
    phase_title: "Phase 2 : Rituels & Repas (Jours 4 à 7)",
    title: "Anticiper la solitude et les loisirs du week-end",
    summary: "Les moments de temps libre ou de solitude peuvent réactiver la tentation de fumer par ennui.",
    action_today: "Planifiez dès ce soir au moins une activité manuelle ou une sortie pour votre fin de semaine.",
    mantra: "La solitude s'apprivoise avec de la douceur, pas avec de la cendre.",
    completed: false
  },
  {
    day_number: 7,
    phase_title: "Phase 2 : Rituels & Repas (Jours 4 à 7)",
    title: "Victoire : 1 semaine complète !",
    summary: "Vous venez de franchir 7 jours complets ! Votre goût et votre odorat s'affinent considérablement.",
    action_today: "Consultez le montant économisé dans le tableau de bord et offrez-vous une récompense saine.",
    mantra: "J'ai franchi mon ancien palier. Je trace un nouveau chemin.",
    completed: false
  },
  {
    day_number: 8,
    phase_title: "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
    title: "Accueillir l'irritabilité sans fumer",
    summary: "Des sautes d'humeur peuvent survenir. Elles ne sont pas qui vous êtes, elles ne sont qu'un passage temporaire.",
    action_today: "Pratiquez la cohérence cardiaque pendant 3 minutes dès que vous sentez la tension monter.",
    mantra: "Je traverse mes émotions, je ne les enfouis plus sous la fumée.",
    completed: false
  },
  {
    day_number: 9,
    phase_title: "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
    title: "Gérer les conversations difficiles",
    summary: "En cas de dispute ou de tension relationnelle, appliquez le protocole PAUSE avant d'agir impulsivement.",
    action_today: "Écrivez sur un papier ce que vous ressentez avant d'envoyer un message que vous pourriez regretter.",
    mantra: "P - Poser, A - Accueillir, U - Utiliser le souffle, S - Sortir, E - Échanger posément.",
    completed: false
  },
  {
    day_number: 10,
    phase_title: "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
    title: "Retrouver une énergie stable",
    summary: "Le sommeil commence à se réguler. Les réveils sont plus légers et l'haleine est fraîche.",
    action_today: "Buvez une infusion relaxante avant de dormir et déposez votre téléphone loin du lit.",
    mantra: "Mon sommeil est plus réparateur sans le poison de la nicotine.",
    completed: false
  },
  {
    day_number: 11,
    phase_title: "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
    title: "La tentation du « juste une »",
    summary: "Attention au piège classique du cerveau : « J'ai prouvé que je pouvais tenir, juste une pour voir ».",
    action_today: "Rappelez-vous : une bouffée réactive immédiatement les récepteurs nicotiniques dormants. Zéro négociation.",
    mantra: "Je ne négocie pas avec mon ancien piège.",
    completed: false
  },
  {
    day_number: 12,
    phase_title: "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
    title: "Affirmer son statut de non-fumeur",
    summary: "Vous n'êtes plus « un fumeur qui se prive », vous êtes une personne libre qui prend soin d'elle.",
    action_today: "Dites mentalement : « Je suis non-fumeur » et souriez en y pensant.",
    mantra: "Je respire librement, je suis non-fumeur.",
    completed: false
  },
  {
    day_number: 13,
    phase_title: "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
    title: "Occuper ses mains dans les moments creux",
    summary: "Le geste automatique main-bouche tente parfois de resurgir devant la télévision ou l'ordinateur.",
    action_today: "Gardez votre galet ou votre balle anti-stress sur votre bureau ou près du canapé.",
    mantra: "Mes mains sont libres et créatives.",
    completed: false
  },
  {
    day_number: 14,
    phase_title: "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
    title: "Bilan de mi-parcours : 2 semaines !",
    summary: "Deux semaines sans tabac ! Vos bronches se décongestionnent, votre circulation sanguine s'améliore significativement.",
    action_today: "Faites le bilan hebdomadaire dans l'application et célébrez ce cap majeur.",
    mantra: "Deux semaines de liberté conquises. Je continue avec confiance.",
    completed: false
  },
  {
    day_number: 15,
    phase_title: "Phase 4 : Maîtrise des Risques (Semaine 3)",
    title: "Tester les situations à risque avec un bouclier",
    summary: "Soirée entre amis, café en terrasse : préparez votre stratégie avant de vous y rendre.",
    action_today: "Décidez à l'avance de votre boisson de remplacement et de l'objet que vous aurez dans la main.",
    mantra: "Je prépare mon plan avant d'entrer dans l'arène.",
    completed: false
  },
  {
    day_number: 16,
    phase_title: "Phase 4 : Maîtrise des Risques (Semaine 3)",
    title: "L'illusion de la récompense tabagique",
    summary: "Après une grosse journée, vous méritez une récompense. Mais le tabac n'a jamais été un cadeau : c'était un emprunt toxique.",
    action_today: "Offrez-vous un repas savoureux, un bon film ou un massage relaxant.",
    mantra: "Ma récompense, c'est ma santé et ma sérénité.",
    completed: false
  },
  {
    day_number: 17,
    phase_title: "Phase 4 : Maîtrise des Risques (Semaine 3)",
    title: "La liberté financière",
    summary: "À 15 cigarettes par jour, vous avez déjà économisé plusieurs dizaines de milliers de FCFA !",
    action_today: "Vérifiez votre compteur d'économies et projetez ce que vous ferez de ces économies sur un an.",
    mantra: "Mon argent sert mes projets de vie, pas l'industrie du tabac.",
    completed: false
  },
  {
    day_number: 18,
    phase_title: "Phase 4 : Maîtrise des Risques (Semaine 3)",
    title: "Gérer la baisse de vigilance",
    summary: "Quand la fierté des premiers jours s'estompe, la routine peut amener des doutes sournois.",
    action_today: "Relisez vos raisons initiales d'arrêt notées lors de votre onboarding.",
    mantra: "Je reste vigilant et bienveillant envers moi-même.",
    completed: false
  },
  {
    day_number: 19,
    phase_title: "Phase 4 : Maîtrise des Risques (Semaine 3)",
    title: "Le souffle retrouvé à l'effort",
    summary: "Montez des escaliers ou accélérez le pas en marchant. Sentez la différence dans votre cage thoracique.",
    action_today: "Prenez 5 grandes inspirations complètes et ressentez l'air propre dans vos poumons.",
    mantra: "L'oxygène pur nourrit chacune de mes cellules.",
    completed: false
  },
  {
    day_number: 20,
    phase_title: "Phase 4 : Maîtrise des Risques (Semaine 3)",
    title: "Que faire si un faux pas arrive ?",
    summary: "Rappelez-vous : une cigarette fumée n'annule pas vos 20 jours de progrès. Ce qui compte, c'est de revenir immédiatement.",
    action_today: "Prenez connaissance de la page « Faux pas » pour savoir que vous ne serez jamais jugé(e).",
    mantra: "Si je trébuche, je me relève à la seconde suivante. Pas de culpabilité, juste de l'apprentissage.",
    completed: false
  },
  {
    day_number: 21,
    phase_title: "Phase 4 : Maîtrise des Risques (Semaine 3)",
    title: "Trois semaines : Le cap de l'ancrage d'habitude",
    summary: "En sciences comportementales, 21 jours constituent le seuil clé de désactivation d'un automatisme moteur.",
    action_today: "Félicitez-vous chaleureusement : vous avez transformé vos circuits neuronaux !",
    mantra: "Mon cerveau a créé de nouveaux chemins neuronaux sans tabac.",
    completed: false
  },
  {
    day_number: 22,
    phase_title: "Phase 5 : Liberté Durable (Semaine 4)",
    title: "Prendre du recul sur ses déclencheurs",
    summary: "Analysez vos envies enregistrées dans le journal : quelles émotions reviennent le plus ?",
    action_today: "Identifiez votre déclencheur récurrent et renforcez votre stratégie préférée.",
    mantra: "Je comprends mon fonctionnement sans jugement.",
    completed: false
  },
  {
    day_number: 23,
    phase_title: "Phase 5 : Liberté Durable (Semaine 4)",
    title: "Démystifier le stress et le tabac",
    summary: "Rappelez-vous : fumer ne calmait pas le stress quotidien, cela ne calmait que le manque de nicotine provoqué par la cigarette précédente.",
    action_today: "Dans une situation stressante, prenez 3 respirations lentes et observez la détente naturelle.",
    mantra: "Le tabac créait le problème qu'il prétendait résoudre.",
    completed: false
  },
  {
    day_number: 24,
    phase_title: "Phase 5 : Liberté Durable (Semaine 4)",
    title: "Nettoyer définitivement son environnement",
    summary: "Lavez vos vestes d'hiver, nettoyez votre espace ou aérez votre intérieur pour effacer toute trace d'odeur résiduelle.",
    action_today: "Faites le grand ménage des odeurs de tabac résiduelles.",
    mantra: "Mon espace de vie respire la propreté et la fraîcheur.",
    completed: false
  },
  {
    day_number: 25,
    phase_title: "Phase 5 : Liberté Durable (Semaine 4)",
    title: "Savoir dire non sans hésiter",
    summary: "Quand quelqu'un vous offre une cigarette : « Non merci, je ne fume pas. » C'est une affirmation de votre liberté.",
    action_today: "Entraînez-vous à prononcer cette phrase à voix haute avec un grand sourire.",
    mantra: "Non merci, je ne fume pas.",
    completed: false
  },
  {
    day_number: 26,
    phase_title: "Phase 5 : Liberté Durable (Semaine 4)",
    title: "Retrouver sa voix intérieure",
    summary: "Vous n'avez plus besoin d'une béquille chimique pour faire face aux défis de la journée.",
    action_today: "Prenez 5 minutes de silence pour apprécier votre solidité intérieure.",
    mantra: "Je suis capable de traverser toutes les tempêtes par moi-même.",
    completed: false
  },
  {
    day_number: 27,
    phase_title: "Phase 5 : Liberté Durable (Semaine 4)",
    title: "Protéger sa victoire dans le temps",
    summary: "Les anciens fumeurs qui rechutent le font souvent après plusieurs mois, par excès de confiance (« Juste une taf »).",
    action_today: "Formulez votre engagement : je protège ma liberté chèrement acquise.",
    mantra: "Ma liberté est trop précieuse pour être troquée contre une bouffée toxique.",
    completed: false
  },
  {
    day_number: 28,
    phase_title: "Phase 5 : Liberté Durable (Semaine 4)",
    title: "La fin de la dépendance psychologique",
    summary: "Les envies ne durent plus que quelques secondes et s'espacent de plus en plus.",
    action_today: "Comparez votre état actuel avec votre premier jour : mesurez le chemin parcouru.",
    mantra: "Chaque jour sans tabac est une victoire irréversible.",
    completed: false
  },
  {
    day_number: 29,
    phase_title: "Phase 5 : Liberté Durable (Semaine 4)",
    title: "Préparer l'après-30 jours",
    summary: "Le programme de 30 jours touche à sa fin, mais votre accompagnement continue !",
    action_today: "Définissez vos objectifs pour les prochains mois et configurez vos rappels d'entretien.",
    mantra: "Je construis une vie entière de santé, un jour à la fois.",
    completed: false
  },
  {
    day_number: 30,
    phase_title: "Phase 5 : Liberté Durable (Semaine 4)",
    title: "1 Mois de Liberté Totale !",
    summary: "Félicitations exceptionnelles ! Vous venez d'accomplir 30 jours consécutifs sans tabac. Votre système cardiovasculaire a entamé une guérison majeure.",
    action_today: "Générez votre bilan complet dans les paramètres, exportez vos réussites et fêtez dignement cette renaissance.",
    mantra: "J'ai gagné ma liberté. Je suis définitivement non-fumeur.",
    completed: false
  }
];

