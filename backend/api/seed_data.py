from datetime import datetime
from django.utils import timezone
from .models import Strategy, JourneyDay, Reminder, UserProfile

STRATEGIES_DATA = [
    {
        "slug": "protocole-10-minutes",
        "title": "Le Protocole des 10 minutes",
        "category": "respiration",
        "trigger_tags": ["stress", "nervosite", "emotion_brusque", "reveil", "travail", "autre"],
        "short_description": "Différer l'envie, respirer lentement, occuper les mains et réévaluer.",
        "instructions": "1. Nommer l'envie : « C'est une vague, elle est désagréable mais elle va passer. »\n2. Différer : Lancer le minuteur de 10 minutes sans prendre de décision d'achat ou d'allumage.\n3. Respirer doucement par le nez, expirer lentement par la bouche pendant 2 minutes.\n4. Bouger : Se lever, faire quelques pas ou monter des marches.\n5. Occuper les mains et la bouche : Verre d'eau, chewing-gum sans sucre ou stylo en main.\n6. Réévaluer l'intensité après 10 minutes.",
        "duration_seconds": 600,
        "evidence_note": "Une envie dure en moyenne entre 3 et 7 minutes si l'on ne la nourrit pas cognitivement.",
        "safety_note": "Arrêter si la respiration forcée crée un étourdissement ; respirer naturellement.",
        "icon_name": "Timer"
    },
    {
        "slug": "coherence-cardiaque",
        "title": "Respiration apaisante (Cohérence)",
        "category": "respiration",
        "trigger_tags": ["stress", "nervosite", "emotion_brusque"],
        "short_description": "Inspirer 5 secondes, expirer 5 secondes pour réguler le système nerveux autonome.",
        "instructions": "Asseyez-vous le dos droit, les pieds bien à plat sur le sol.\nInspirez calmement par le nez pendant 5 secondes en gonflant le ventre.\nExpirez doucement par la bouche entrouverte pendant 5 secondes.\nRépétez ce cycle pendant 3 minutes.",
        "duration_seconds": 180,
        "evidence_note": "Fait chuter le cortisol (hormone de stress) et active le système parasympathique.",
        "safety_note": "Ne forcez pas vos poumons, adoptez un rythme fluide.",
        "icon_name": "Wind"
    },
    {
        "slug": "protocole-pause",
        "title": "Protocole PAUSE (Solitude & Émotion)",
        "category": "emotion",
        "trigger_tags": ["solitude", "emotion_brusque", "stress"],
        "short_description": "P - Poser, A - Accueillir, U - Utiliser le souffle, S - Sortir, E - Entrer en contact.",
        "instructions": "P — Poser la cigarette et tout achat en attente.\nA — Accueillir et nommer l'émotion (« Je me sens seul(e), blessé(e), anxieux(se) ») sans juger.\nU — Utiliser une respiration lente et ancrer solidement les pieds au sol.\nS — Sortir de la pièce quelques minutes, boire un grand verre d'eau ou marcher.\nE — Entrer en contact avec une personne bienveillante ou accomplir une action préparée, puis décider de la suite une fois l'intensité retombée.",
        "duration_seconds": 300,
        "evidence_note": "La cigarette n'a jamais résolu un conflit ni comblé un vide émotionnel ; elle n'ajoute que de la dépendance.",
        "safety_note": "En cas de détresse sévère, utilisez la page de soutien ou contactez un proche.",
        "icon_name": "HeartHandshake"
    },
    {
        "slug": "rituel-reveil",
        "title": "Rituel nouveau du Réveil",
        "category": "mouvement",
        "trigger_tags": ["reveil"],
        "short_description": "Casser l'automatisme du saut du lit en modifiant l'ordre des actions matinales.",
        "instructions": "1. Ne restez pas à ruminer dans le lit ni à l'endroit habituel de fumage.\n2. Buvez immédiatement un grand verre d'eau tempérée.\n3. Lavez-vous le visage à l'eau fraîche ou prenez une douche stimulante.\n4. Faites 5 minutes d'étirements doux ou de marche.\n5. Prenez votre petit-déjeuner dans un endroit différent de d'habitude.",
        "duration_seconds": 300,
        "evidence_note": "La première cigarette matinale est conditionnée par l'environnement visuel et spatial.",
        "safety_note": "",
        "icon_name": "Sunrise"
    },
    {
        "slug": "pause-travail-active",
        "title": "Pause active & décliner avec assurance",
        "category": "anticipation",
        "trigger_tags": ["travail", "social"],
        "short_description": "Faire une vraie pause sans tabac et savoir répondre sans se justifier.",
        "instructions": "1. Levez-vous de votre bureau et marchez vers une zone aérée ou extérieure sans fumeurs.\n2. Buvez un thé ou de l'eau fraîche.\n3. Ayez un objet dans les mains (stylo, balle anti-stress).\n4. Si un collègue propose une cigarette, dites simplement : « J'ai arrêté, je fais une pause autrement ! » Pas besoin d'expliquer toute votre démarche.",
        "duration_seconds": 300,
        "evidence_note": "C'est la pause et la coupure de travail que le cerveau recherche, pas la nicotine.",
        "safety_note": "",
        "icon_name": "Briefcase"
    },
    {
        "slug": "rituel-avant-repas",
        "title": "Rituel avant et après le repas",
        "category": "main_bouche",
        "trigger_tags": ["repas"],
        "short_description": "Occuper les mains avant d'avoir trop faim et se brosser les dents immédiatement après.",
        "instructions": "1. Ne vous laissez pas devenir affamé(e) et irritable : préparez une collation saine si le repas tarde.\n2. Occupez vos mains en cuisinant ou en buvant un grand verre d'eau.\n3. Dès la dernière bouchée terminée, quittez la table !\n4. Brossez-vous les dents directement avec un dentifrice mentholé frais, ou marchez 10 minutes.",
        "duration_seconds": 300,
        "evidence_note": "Le goût de menthe fraîche modifie la perception gustative et coupe l'envie de fumer d'après-repas.",
        "safety_note": "",
        "icon_name": "Utensils"
    },
    {
        "slug": "ancrage-sensoriel-54321",
        "title": "Technique d'ancrage 5-4-3-2-1",
        "category": "ancrage",
        "trigger_tags": ["stress", "nervosite", "emotion_brusque", "solitude"],
        "short_description": "Revenir instantanément dans le moment présent en mobilisant vos 5 sens.",
        "instructions": "Regardez autour de vous et nommez dans votre tête :\n- 5 choses que vous pouvez VOIR\n- 4 choses que vous pouvez TOUCHER (votre vêtement, la table, vos semelles)\n- 3 choses que vous pouvez ENTENDRE (un bruit lointain, votre souffle)\n- 2 choses que vous pouvez SENTIR (odeur de café, air frais)\n- 1 goût que vous pouvez RESSENTIR sur votre langue.",
        "duration_seconds": 180,
        "evidence_note": "Surcharge la mémoire de travail et interrompt la boucle obsessionnelle de l'envie.",
        "safety_note": "",
        "icon_name": "Eye"
    },
    {
        "slug": "boite-a-outils-main-bouche",
        "title": "Alternatives geste main-bouche",
        "category": "main_bouche",
        "trigger_tags": ["main_bouche", "travail", "solitude"],
        "short_description": "Des objets discrets pour satisfaire le besoin tactile et moteur sans tabac.",
        "instructions": "Pour la bouche : Chewing-gum sans sucre à la menthe forte, bonbon sans sucre, verre d'eau avec une paille réutilisable propre, bâtonnet de cannelle ou crudité croquante.\nPour les mains : Petit galet lisse, balle souple anti-stress, élastique textile au poignet, stylo à tourner, pliage de papier ou dessin de 3 minutes.",
        "duration_seconds": 120,
        "evidence_note": "Le geste main-bouche répété 15 fois par cigarette (soit ~225 fois par jour) est une boucle motrice inconsciente.",
        "safety_note": "Ne jamais inhaler ni mâcher de produit non alimentaire.",
        "icon_name": "Smile"
    }
]

JOURNEY_DATA = [
    # Semaine 1 : Jours 1 à 3 (Sécurité environnement)
    {
        "day_number": 1,
        "phase_title": "Phase 1 : Sécuriser l'espace (Jours 1 à 3)",
        "title": "Le premier jour sans tabac",
        "summary": "Aujourd'hui, l'objectif est unique : traverser les envies une par une. Ne pensez pas à toute votre vie, pensez aux 10 prochaines minutes.",
        "action_today": "Retirez tous les briquets, cendriers et paquets. Placez une bouteille d'eau et des chewing-gums à portée de main.",
        "mantra": "Aujourd'hui, je ne négocie pas avec l'envie. J'attends 10 minutes, je respire et je choisis à nouveau."
    },
    {
        "day_number": 2,
        "phase_title": "Phase 1 : Sécuriser l'espace (Jours 1 à 3)",
        "title": "Le pic des premières 48 heures",
        "summary": "Le taux de nicotine chute, le corps réclame sa dose habituelle. C'est normal de ressentir de l'agitation ou de la fatigue. C'est le signe que votre corps commence sa libération.",
        "action_today": "Réduisez les exigences secondaires au travail et à la maison. Buvez beaucoup d'eau pour aider l'élimination.",
        "mantra": "Une envie est une vague, pas un ordre. Je surfe sur la vague."
    },
    {
        "day_number": 3,
        "phase_title": "Phase 1 : Sécuriser l'espace (Jours 1 à 3)",
        "title": "La fin du sevrage physique aigu",
        "summary": "À 72 heures, le corps a éliminé la quasi-totalité de la nicotine résiduelle. Les envies qui subsistent sont principalement psychologiques et comportementales.",
        "action_today": "Faites une marche de 15 minutes en plein air et remarquez déjà la sensation de votre souffle.",
        "mantra": "Mon corps est déjà en train de se nettoyer. Chaque heure compte."
    },
    # Semaine 1 : Jours 4 à 7 (Rituels et déclencheurs)
    {
        "day_number": 4,
        "phase_title": "Phase 2 : Rituels & Repas (Jours 4 à 7)",
        "title": "Identifier les déclencheurs automatiques",
        "summary": "Vous commencez à repérer les moments réflexes : café du matin, fin du repas, trajet en voiture.",
        "action_today": "Notez dans votre journal votre déclencheur le plus fort et choisissez une action de remplacement précise.",
        "mantra": "Je change de rituel, pas seulement d'habitude."
    },
    {
        "day_number": 5,
        "phase_title": "Phase 2 : Rituels & Repas (Jours 4 à 7)",
        "title": "Repenser les pauses sans cigarette",
        "summary": "La pause au travail n'a pas besoin de disparaître : elle doit juste être réinventée.",
        "action_today": "Prenez une pause de 5 minutes avec un collègue non-fumeur ou faites le tour du pâté de maisons.",
        "mantra": "J'ai le droit de faire une pause pour moi, sans fumée."
    },
    {
        "day_number": 6,
        "phase_title": "Phase 2 : Rituels & Repas (Jours 4 à 7)",
        "title": "Le week-end approche : anticiper la solitude et les loisirs",
        "summary": "Les moments de temps libre ou de solitude peuvent réactiver la tentation de fumer par ennui.",
        "action_today": "Planifiez dès ce soir au moins une activité manuelle ou une sortie pour votre fin de semaine.",
        "mantra": "La solitude s'apprivoise avec de la douceur, pas avec de la cendre."
    },
    {
        "day_number": 7,
        "phase_title": "Phase 2 : Rituels & Repas (Jours 4 à 7)",
        "title": "Victoire : 1 semaine complète !",
        "summary": "Vous venez de franchir votre ancien record historique de 4 à 5 jours ! Votre goût et votre odorat s'affinent.",
        "action_today": "Consultez le montant économisé dans le tableau de bord et offrez-vous une récompense saine.",
        "mantra": "J'ai franchi mon ancien palier. Je trace un nouveau chemin."
    },
    # Semaine 2 : Jours 8 à 14 (Émotions & Vie sociale)
    {
        "day_number": 8,
        "phase_title": "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
        "title": "Accueillir l'irritabilité sans fumer",
        "summary": "Des sautes d'humeur peuvent survenir. Elles ne sont pas qui vous êtes, elles ne sont qu'un passage temporaire.",
        "action_today": "Pratiquez la cohérence cardiaque pendant 3 minutes dès que vous sentez la tension monter.",
        "mantra": "Je traverse mes émotions, je ne les enfouis plus sous la fumée."
    },
    {
        "day_number": 9,
        "phase_title": "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
        "title": "Gérer les conversations difficiles",
        "summary": "En cas de dispute ou de tension relationnelle, appliquez le protocole PAUSE avant d'agir impulsivement.",
        "action_today": "Écrivez sur un papier ce que vous ressentez avant d'envoyer un message que vous pourriez regretter.",
        "mantra": "P - Poser, A - Accueillir, U - Utiliser le souffle, S - Sortir, E - Échanger posément."
    },
    {
        "day_number": 10,
        "phase_title": "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
        "title": "Retrouver une énergie stable",
        "summary": "Le sommeil commence à se réguler. Les réveils sont plus légers et l'haleine est fraîche.",
        "action_today": "Buvez une infusion relaxante avant de dormir et déposez votre téléphone loin du lit.",
        "mantra": "Mon sommeil est plus réparateur sans le poison de la nicotine."
    },
    {
        "day_number": 11,
        "phase_title": "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
        "title": "La tentation du « juste une »",
        "summary": "Attention au piège classique du cerveau : « J'ai prouvé que je pouvais tenir, juste une pour voir ».",
        "action_today": "Rappelez-vous : une bouffée réactive immédiatement les récepteurs nicotiniques dormants. Zéro négociation.",
        "mantra": "Je ne négocie pas avec mon ancien piège."
    },
    {
        "day_number": 12,
        "phase_title": "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
        "title": "Affirmer son statut de non-fumeur",
        "summary": "Vous n'êtes plus « un fumeur qui se prive », vous êtes une personne libre qui prend soin d'elle.",
        "action_today": "Dites mentalement : « Je suis non-fumeur » et souriez en y pensant.",
        "mantra": "Je respire librement, je suis non-fumeur."
    },
    {
        "day_number": 13,
        "phase_title": "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
        "title": "Occuper ses mains dans les moments creux",
        "summary": "Le geste automatique main-bouche tente parfois de resurgir devant la télévision ou l'ordinateur.",
        "action_today": "Gardez votre galet ou votre balle anti-stress sur votre bureau ou près du canapé.",
        "mantra": "Mes mains sont libres et créatives."
    },
    {
        "day_number": 14,
        "phase_title": "Phase 3 : Émotions & Vie Sociale (Semaine 2)",
        "title": "Bilan de mi-parcours : 2 semaines !",
        "summary": "Deux semaines sans tabac ! Vos bronches se décongestionnent, votre circulation sanguine s'améliore significativement.",
        "action_today": "Faites le bilan hebdomadaire dans l'application et célébrez ce cap majeur.",
        "mantra": "Deux semaines de liberté conquises. Je continue avec confiance."
    },
    # Semaine 3 : Jours 15 à 21 (Mise à l'épreuve des risques)
    {
        "day_number": 15,
        "phase_title": "Phase 4 : Maîtrise des Risques (Semaine 3)",
        "title": "Tester les situations à risque avec un bouclier",
        "summary": "Soirée entre amis, café en terrasse : préparez votre stratégie avant de vous y rendre.",
        "action_today": "Décidez à l'avance de votre boisson de remplacement et de l'objet que vous aurez dans la main.",
        "mantra": "Je prépare mon plan avant d'entrer dans l'arène."
    },
    {
        "day_number": 16,
        "phase_title": "Phase 4 : Maîtrise des Risques (Semaine 3)",
        "title": "L'illusion de la récompense tabagique",
        "summary": "Après une grosse journée, vous méritez une récompense. Mais le tabac n'a jamais été un cadeau : c'était un emprunt toxique.",
        "action_today": "Offrez-vous un repas savoureux, un bon film ou un massage relaxant.",
        "mantra": "Ma récompense, c'est ma santé et ma sérénité."
    },
    {
        "day_number": 17,
        "phase_title": "Phase 4 : Maîtrise des Risques (Semaine 3)",
        "title": "La liberté financière",
        "summary": "À 15 cigarettes par jour, vous avez déjà économisé plus de 15 000 FCFA en un peu plus de deux semaines !",
        "action_today": "Vérifiez votre compteur d'économies et projetez ce que vous ferez de ces économies sur un an (~320 000 FCFA).",
        "mantra": "Mon argent sert mes projets de vie, pas l'industrie du tabac."
    },
    {
        "day_number": 18,
        "phase_title": "Phase 4 : Maîtrise des Risques (Semaine 3)",
        "title": "Gérer la baisse de vigilance",
        "summary": "Quand la fierté des premiers jours s'estompe, la routine peut amener des doutes sournois.",
        "action_today": "Relisez vos raisons initiales d'arrêt notées lors de votre onboarding.",
        "mantra": "Je reste vigilant et bienveillant envers moi-même."
    },
    {
        "day_number": 19,
        "phase_title": "Phase 4 : Maîtrise des Risques (Semaine 3)",
        "title": "Le souffle retrouvé à l'effort",
        "summary": "Montez des escaliers ou accélérez le pas en marchant. Sentez la différence dans votre cage thoracique.",
        "action_today": "Prenez 5 grandes inspirations complètes et ressentez l'air propre dans vos poumons.",
        "mantra": "L'oxygène pur nourrit chacune de mes cellules."
    },
    {
        "day_number": 20,
        "phase_title": "Phase 4 : Maîtrise des Risques (Semaine 3)",
        "title": "Que faire si un faux pas arrive ?",
        "summary": "Rappelez-vous : une cigarette fumée n'annule pas vos 20 jours de progrès. Ce qui compte, c'est de revenir immédiatement.",
        "action_today": "Prenez connaissance de la page « Faux pas » pour savoir que vous ne serez jamais jugé(e).",
        "mantra": "Si je trébuche, je me relève à la seconde suivante. Pas de culpabilité, juste de l'apprentissage."
    },
    {
        "day_number": 21,
        "phase_title": "Phase 4 : Maîtrise des Risques (Semaine 3)",
        "title": "Trois semaines : Le cap de l'ancrage d'habitude",
        "summary": "En sciences comportementales, 21 jours constituent le seuil clé de désactivation d'un automatisme moteur.",
        "action_today": "Félicitez-vous chaleureusement : vous avez transformé vos circuits neuronaux !",
        "mantra": "Mon cerveau a créé de nouveaux chemins neuronaux sans tabac."
    },
    # Semaine 4 : Jours 22 à 30 (Consolidation & Liberté durable)
    {
        "day_number": 22,
        "phase_title": "Phase 5 : Liberté Durable (Semaine 4)",
        "title": "Prendre du recul sur ses déclencheurs",
        "summary": "Analysez vos envies enregistrées dans le journal : quelles émotions reviennent le plus ?",
        "action_today": "Identifiez votre déclencheur récurrent et renforcez votre stratégie préférée.",
        "mantra": "Je comprends mon fonctionnement sans jugement."
    },
    {
        "day_number": 23,
        "phase_title": "Phase 5 : Liberté Durable (Semaine 4)",
        "title": "Démystifier le stress et le tabac",
        "summary": "Rappelez-vous : fumer ne calmait pas le stress quotidien, cela ne calmait que le manque de nicotine provoqué par la cigarette précédente.",
        "action_today": "Dans une situation stressante, prenez 3 respirations lentes et observez la détente naturelle.",
        "mantra": "Le tabac créait le problème qu'il prétendait résoudre."
    },
    {
        "day_number": 24,
        "phase_title": "Phase 5 : Liberté Durable (Semaine 4)",
        "title": "Nettoyer définitivement son environnement",
        "summary": "Lavez vos vestes d'hiver, nettoyez votre voiture ou aérez votre intérieur pour effacer toute trace d'odeur de tabac froid.",
        "action_today": "Faites le grand ménage des odeurs de tabac résiduelles.",
        "mantra": "Mon espace de vie respire la propreté et la fraîcheur."
    },
    {
        "day_number": 25,
        "phase_title": "Phase 5 : Liberté Durable (Semaine 4)",
        "title": "Savoir dire non sans hésiter",
        "summary": "Quand quelqu'un vous offre une cigarette : « Non merci, je ne fume pas. » C'est une affirmation de votre liberté.",
        "action_today": "Entraînez-vous à prononcer cette phrase à voix haute avec un grand sourire.",
        "mantra": "Non merci, je ne fume pas."
    },
    {
        "day_number": 26,
        "phase_title": "Phase 5 : Liberté Durable (Semaine 4)",
        "title": "Retrouver sa voix intérieure",
        "summary": "Vous n'avez plus besoin d'une béquille chimique pour faire face aux défis de la journée.",
        "action_today": "Prenez 5 minutes de silence pour apprécier votre solidité intérieure.",
        "mantra": "Je suis capable de traverser toutes les tempêtes par moi-même."
    },
    {
        "day_number": 27,
        "phase_title": "Phase 5 : Liberté Durable (Semaine 4)",
        "title": "Protéger sa victoire dans le temps",
        "summary": "Les anciens fumeurs qui rechutent le font souvent après plusieurs mois, par excès de confiance (« Juste une taf »).",
        "action_today": "Formulez votre engagement : je protège ma liberté chèrement acquise.",
        "mantra": "Ma liberté est trop précieuse pour être troquée contre une bouffée toxique."
    },
    {
        "day_number": 28,
        "phase_title": "Phase 5 : Liberté Durable (Semaine 4)",
        "title": "La fin de la dépendance psychologique",
        "summary": "Les envies ne durent plus que quelques secondes et s'espacent de plus en plus.",
        "action_today": "Comparez votre état actuel avec votre premier jour : mesurez le chemin parcouru.",
        "mantra": "Chaque jour sans tabac est une victoire irréversible."
    },
    {
        "day_number": 29,
        "phase_title": "Phase 5 : Liberté Durable (Semaine 4)",
        "title": "Préparer l'après-30 jours",
        "summary": "Le programme de 30 jours touche à sa fin, mais votre accompagnement continue !",
        "action_today": "Définissez vos objectifs pour les 6 prochains mois et configurez vos rappels d'entretien.",
        "mantra": "Je construis une vie entière de santé, un jour à la fois."
    },
    {
        "day_number": 30,
        "phase_title": "Phase 5 : Liberté Durable (Semaine 4)",
        "title": "1 Mois de Liberté Totale !",
        "summary": "Félicitations exceptionnelles ! Vous venez d'accomplir 30 jours consécutifs sans tabac. Votre système cardiovasculaire a déjà entamé une guérison majeure.",
        "action_today": "Générez votre bilan complet dans les paramètres, exportez vos réussites et fêtez dignement cette renaissance.",
        "mantra": "J'ai gagné ma liberté. Je suis définitivement non-fumeur."
    }
]

REMINDERS_DATA = [
    {
        "time_str": "08:00",
        "title": "Intention du matin",
        "message": "Bonjour ! Prenez 30 secondes pour poser votre intention et votre bouclier du jour.",
        "context": "morning",
        "enabled": True
    },
    {
        "time_str": "10:30",
        "title": "Pause active du travail",
        "message": "C'est l'heure de s'étirer, de boire un verre d'eau fraîche et de respirer un bon coup.",
        "context": "work_break",
        "enabled": True
    },
    {
        "time_str": "12:45",
        "title": "Après le repas",
        "message": "Repas fini ? Pensez au brossage de dents mentholé ou aux 5 minutes de marche !",
        "context": "dinner",
        "enabled": True
    },
    {
        "time_str": "19:00",
        "title": "Sas de décompression du soir",
        "message": "La journée de travail se termine. Utilisez le protocole PAUSE si une émotion surgit.",
        "context": "dinner",
        "enabled": True
    },
    {
        "time_str": "21:30",
        "title": "Bilan de la journée",
        "message": "Félicitations pour les envies traversées aujourd'hui. Notez votre apprentissage du jour.",
        "context": "custom",
        "enabled": True
    }
]


def seed_all():
    """Charge toutes les données initiales du cahier des charges MVP."""
    # 1. Stratégies
    for s_data in STRATEGIES_DATA:
        Strategy.objects.update_or_create(
            slug=s_data["slug"],
            defaults=s_data
        )
    
    # 2. Programme 30 jours
    for j_data in JOURNEY_DATA:
        JourneyDay.objects.update_or_create(
            day_number=j_data["day_number"],
            defaults=j_data
        )

    # 3. Rappels
    if Reminder.objects.count() == 0:
        for r_data in REMINDERS_DATA:
            Reminder.objects.create(**r_data)

    # 4. Profil utilisateur par défaut (adapté pour le Bénin : 14 octobre 2026 08:00 WAT, 15 cig/jour, 3 ans, 700 FCFA/paquet / 3 pour 100 FCFA)
    default_quit_date = datetime(2026, 10, 14, 8, 0, 0, tzinfo=timezone.get_current_timezone())
    UserProfile.objects.update_or_create(
        id=1,
        defaults={
            "cigarettes_per_day": 15,
            "smoking_duration_years": 3.0,
            "first_cigarette_delay_minutes": 45,
            "pack_price": 700.00,
            "currency": "FCFA",
            "cigarettes_per_pack": 20,
            "quit_start_at": default_quit_date,
            "triggers": ["stress", "nervosite", "emotion_brusque", "solitude", "reveil", "travail", "repas", "main_bouche"],
            "trusted_contact_name": "Ami de confiance",
            "trusted_contact_phone": "",
            "privacy_consent": True
        }
    )
