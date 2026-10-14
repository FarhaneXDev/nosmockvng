# 🚭 Nosmokvng · Cap Sans Tabac

> **Application moderne, bienveillante et scientifique d'accompagnement à l'arrêt du tabac.**  
> Conçue sur mesure selon le cahier des charges MVP (*Plan d’arrêt du tabac & spécification produit*).

---

## 💡 Principes & Philosophie

- **« Une envie est une vague, pas un ordre »** : Le but est de traverser la vague sans fumer, une envie à la fois.
- **Protocole des 10 minutes (P0)** : Accessible partout via le bouton flottant **« J’ai envie de fumer »** (*Nommer, Différer, Respirer en cohérence cardiaque, Bouger, Occuper mains/bouche, Réévaluer*).
- **Zéro culpabilisation** : Une cigarette fumée n'annule jamais vos progrès ni vos jours acquis. Un parcours spécifique de débriefing bienveillant et d'apprentissage immédiat permet de reprendre immédiatement le plan.
- **Journal ultra-rapide** : Enregistrez une envie en moins de 30 secondes sans texte obligatoire.

---

## 🛠️ Stack Technique

- **Frontend** : Next.js 15 (App Router), **JavaScript pur vanilla** (aucun TypeScript), Tailwind CSS, Lucide Icons, Canvas Confetti. Gestionnaire de paquets : **`pnpm`**.
- **Backend** : Python 3.13 + Django 6 + Django REST Framework + django-cors-headers + Whitenoise + Gunicorn.
- **Base de données** : SQLite (développement local) / PostgreSQL (production via `dj-database-url`).

---

## 📂 Structure du Projet

```text
nosmokvng/
├── backend/                  # API REST Django
│   ├── api/                  # Modèles, vues, sérialiseurs, tests, seed_data
│   ├── core/                 # Configuration Django, CORS, Whitenoise
│   ├── requirements.txt      # Dépendances Python
│   ├── render.yaml           # Configuration déploiement Render
│   ├── build.sh              # Script de build Render (migrate + collectstatic + seed)
│   ├── Procfile              # Déclaration du worker Gunicorn
│   └── manage.py
├── frontend/                 # Application Next.js (Vanilla JS + pnpm)
│   ├── src/
│   │   ├── app/              # Routes Next.js App Router (JS/JSX)
│   │   │   ├── page.jsx      # Tableau de bord principal
│   │   │   ├── sos/          # Parcours guidé 10 minutes anti-envie
│   │   │   ├── journal/      # Journal des envies & statistiques
│   │   │   ├── parcours/     # Programme guidé des 30 jours
│   │   │   ├── strategies/   # Bibliothèque interactive (respiration, PAUSE, etc.)
│   │   │   ├── checkin/      # Suivi quotidien (Intention matin / Bilan soir)
│   │   │   ├── faux-pas/     # Débriefing sans honte & relance immédiate
│   │   │   ├── urgence/      # Lignes d'écoute (Tabac Info Service, 3114, contact proche)
│   │   │   ├── parametres/   # Configuration, export CSV/JSON, suppression données
│   │   │   └── onboarding/   # Wizard de configuration initiale
│   │   ├── components/       # Composants réutilisables
│   │   └── lib/              # Client API, constantes, déclencheurs
│   ├── package.json
│   ├── vercel.json           # Configuration déploiement Vercel (pnpm)
│   └── tailwind.config.js
└── README.md
```

---

## 🚀 Démarrage en Local

### 1. Backend (Django)

```bash
cd backend

# Activer l'environnement virtuel existant
source venv/bin/activate

# Lancer les migrations et charger les données initiales
python manage.py migrate
python manage.py seed_data

# Lancer le serveur Django (sur le port 8000)
python manage.py runserver
```

L'API sera accessible sur `http://127.0.0.1:8000/api/` :
- `GET /api/stats/` : Statistiques en temps réel (durée sans fumée, cigarettes évitées, économies, paliers de santé OMS).
- `GET/POST /api/cravings/` : Journal des envies.
- `GET/PUT /api/checkins/today/` : Check-in du jour.
- `GET /api/strategies/` : Bibliothèque des 8 stratégies du MVP.
- `GET /api/journey/` : Parcours des 30 jours.

### 2. Frontend (Next.js avec `pnpm`)

Ouvrez un second terminal :

```bash
cd frontend

# Installer les dépendances (si ce n'est pas déjà fait)
pnpm install

# Lancer le serveur de développement Next.js (sur le port 3000)
pnpm run dev
```

Ouvrez votre navigateur sur **`http://localhost:3000`**.

---

## 🧪 Tests

### Tests du Backend Django
```bash
cd backend
./venv/bin/python manage.py test api
```
*(Valide le chargement des données, les calculs d'économies, l'enregistrement rapide des envies et les faux pas)*

### Build de Production Frontend
```bash
cd frontend
pnpm run build
```
*(Compile les 13 routes statiques avec succès en quelques secondes)*

---

## 🚢 Déploiement

### Étape 1 : Mettre sur GitHub

```bash
cd /Users/blvck/Desktop/Projects/nosmokvng
git init
git add .
git commit -m "feat: initial commit Nosmokvng - Cap Sans Tabac MVP"

# Créez votre dépôt sur GitHub puis liez-le :
git remote add origin https://github.com/<votre-pseudo>/nosmokvng.git
git branch -M main
git push -u origin main
```

### Étape 2 : Déployer le Backend sur [Render](https://render.com)

1. Connectez-vous sur [Render](https://dashboard.render.com).
2. Cliquez sur **New +** → **Web Service**.
3. Liez votre dépôt GitHub `nosmokvng`.
4. Configurez :
   - **Root Directory** : `backend`
   - **Environment** : `Python 3`
   - **Build Command** : `./build.sh`
   - **Start Command** : `gunicorn core.wsgi:application`
5. Dans les variables d'environnement (**Environment Variables**) :
   - `PYTHON_VERSION` = `3.13.0`
   - `DEBUG` = `False`
   - `SECRET_KEY` = *(générez une clé aléatoire)*
   - `ALLOWED_HOSTS` = `.onrender.com,localhost`
   - `CORS_ALLOW_ALL` = `True`
6. Cliquez sur **Create Web Service**. Votre backend sera en ligne sous une URL du type `https://nosmokvng-backend.onrender.com`.

### Étape 3 : Déployer le Frontend sur [Vercel](https://vercel.com)

1. Connectez-vous sur [Vercel](https://vercel.com).
2. Cliquez sur **Add New...** → **Project** et importez le dépôt `nosmokvng`.
3. Dans **Root Directory**, cliquez sur **Edit** et sélectionnez le dossier `frontend`.
4. Vercel détectera automatiquement Next.js et `pnpm`.
5. Dans **Environment Variables**, ajoutez :
   - `NEXT_PUBLIC_API_URL` = `https://nosmokvng-backend.onrender.com/api` *(remplacez par l'URL Render de l'étape 2)*.
6. Cliquez sur **Deploy**. En moins de 2 minutes, votre application web est en ligne et accessible depuis n'importe quel smartphone ou ordinateur !
