# StockFlow — Gestion de stock

Application de gestion de stock avec interface React et API Spring Boot.

## Prérequis

Installez une seule fois sur votre PC :

| Outil | Version minimale | Téléchargement |
|-------|------------------|----------------|
| Java JDK | 17 | https://adoptium.net |
| Maven | 3.8+ | https://maven.apache.org |
| Node.js | 18+ | https://nodejs.org |

Vérifiez l'installation :

```bash
java -version
mvn -version
node -version
npm -version
```

## Démarrage rapide (Windows)

### Option 1 — Navigateur web

Double-cliquez sur `start-web.bat` ou exécutez :

```bat
start-web.bat
```

Puis ouvrez http://localhost:5173 dans votre navigateur.

### Option 2 — Application de bureau (Electron)

Double-cliquez sur `start-desktop.bat`.

## Démarrage manuel

**Terminal 1 — Backend** (port 8080) :

```bash
cd stockflow-backend
mvn spring-boot:run
```

**Terminal 2 — Frontend** (port 5173) :

```bash
cd "Application de gestion de stock"
npm install
npm run dev
```

## Linux / macOS

```bash
chmod +x start-web.sh start-desktop.sh
./start-web.sh
```

## Structure du projet

```
projetLogiciel/
├── stockflow-backend/          # API Spring Boot (Java)
├── Application de gestion de stock/  # Interface React + Electron
├── start-web.bat               # Lance backend + frontend (Windows)
├── start-desktop.bat           # Lance l'app Electron (Windows)
└── start-web.sh                # Lance backend + frontend (Linux/macOS)
```

## Base de données

Le projet utilise **H2** (base embarquée). Aucune installation MySQL ou PostgreSQL n'est nécessaire.

Les données sont stockées localement dans `stockflow-backend/data/` (créé automatiquement au premier lancement). Ce dossier n'est pas versionné sur Git.

Des données de démonstration sont insérées automatiquement au premier démarrage.

## API

Base URL : `http://localhost:8080/api`

| Endpoint | Description |
|----------|-------------|
| GET/POST `/articles` | Articles en stock |
| GET/POST `/mouvements` | Entrées / sorties |
| GET/POST `/fournisseurs` | Fournisseurs |
| GET `/notifications` | Alertes |

## Dépannage

- **Port 8080 déjà utilisé** : fermez l'autre application ou changez `server.port` dans `stockflow-backend/src/main/resources/application.properties`.
- **Erreur Maven** : vérifiez que Java 17+ est bien installé (`java -version`).
- **Erreur npm** : exécutez `npm install` dans le dossier frontend avant `npm run dev`.
