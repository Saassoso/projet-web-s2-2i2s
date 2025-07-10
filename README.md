# Football API Server - Master 2I2S

## 📋 Description du projet

Le **Football API Server** est une API RESTful développée en **Node.js** avec **Express.js**, permettant d'accéder à des données en temps réel sur le football, telles que les matchs en direct, les classements, et les informations sur les équipes. Il inclut également des prédictions de matchs alimentées par **Gemini AI**, ainsi que des notifications en temps réel pour les équipes suivies par les utilisateurs. Le système offre une gestion complète des utilisateurs avec authentification et gestion des préférences.

### Fonctionnalités principales :

* **🔐 Authentification** : Authentification des utilisateurs via JWT avec expiration
* **⚽ Football Data** : Accès aux matchs en direct, standings, recherche d'équipes
* **🤖 AI Predictions** : Prédictions de matchs générées par l'IA Gemini
* **🔔 Notifications** : Notifications en temps réel pour les équipes auxquelles les utilisateurs sont abonnés
* **📊 Préférences Utilisateur** : Gestion des abonnements d'équipes et des préférences

---

## 🏗️ Architecture du projet

L'architecture du projet repose sur une séparation claire entre le **front-end** et le **back-end**. Le **back-end** est construit à l'aide de **Node.js** et **Express.js** pour gérer les API RESTful. Les données sont stockées dans une **base de données MongoDB**, et l'authentification est gérée via **JWT** avec des mots de passe hachés grâce à **bcrypt**. Le **front-end** consommera ces API via des requêtes HTTP.

### Technologies et frameworks utilisés :

* **Back-end** :

  * **Node.js** (environnement d'exécution JavaScript)
  * **Express.js** (framework minimal pour la gestion des routes et des middlewares)
  * **MongoDB avec Mongoose** (base de données NoSQL et ORM)
  * **JWT + bcrypt** (authentification et gestion des mots de passe)
  * **Football-Data.org API** (pour récupérer les données en temps réel des matchs et des classements)
  * **Gemini AI** (pour les prédictions de matchs)

* **Front-end** :

  * React (ou autre framework front-end) pour la gestion dynamique de l'interface utilisateur

### Séparation des préoccupations :

* **Back-end** : Gestion des données, authentification, logique métier, communication avec la base de données et les API externes.
* **Front-end** : Interaction avec les utilisateurs, affichage des données footballistiques, gestion des notifications et des préférences.

---

## 💻 Organisation du code source

### Structure des dossiers :

```
/football-api-server
├── backend/
│   ├── controllers/          # Logique des contrôleurs de l'API
│   ├── models/               # Schémas MongoDB avec Mongoose
│   ├── routes/               # Définition des routes API
│   ├── services/             # Services externes (API Football, Gemini AI)
│   ├── middleware/           # Middleware (authentification, validation)
│   ├── config/               # Configuration (CORS, variables d'environnement)
│   └── index.js              # Entrée principale du serveur
├── frontend/                 # Frontend React (ou autre)
│   ├── components/           # Composants réutilisables
│   ├── pages/                # Pages principales
│   ├── utils/                # Utilitaires (ex. gestion des notifications)
│   └── App.js                # Point d'entrée React
├── .gitignore                # Fichiers et répertoires ignorés
├── docker-compose.yml        # Définition des services Docker
├── README.md                 # Documentation du projet
└── package.json              # Dépendances du projet
```

### Tests :

Le projet utilise **Jest** pour les tests unitaires et d'intégration. Les tests sont répartis entre le backend (API, modèles, services) et le frontend (tests de composants React).

---

## 🔐 Sécurité

Le projet met en œuvre plusieurs **meilleures pratiques de sécurité** :

* **Hachage des mots de passe avec bcrypt** : Utilisation de bcrypt pour hacher les mots de passe avant de les stocker en base de données.
* **Authentification via JWT** : Le token JWT contient un délai d'expiration et est utilisé pour vérifier l'identité de l'utilisateur.
* **Protection CORS** : Configuration CORS pour limiter les requêtes à partir de domaines spécifiques.
* **Validation des entrées** : Vérification des entrées utilisateur pour éviter les attaques par injection SQL et XSS.
* **Variables d'environnement** : Les clés API et les informations sensibles sont stockées dans des variables d'environnement sécurisées.

---

## 🌐 Compatibilité multiplateforme

L'API et l'interface utilisateur sont conçues pour être **compatibles avec tous les navigateurs modernes** (Chrome, Firefox, Safari, Edge). Le front-end utilise des techniques de **responsive design** pour s'adapter aux appareils mobiles, tablettes et ordinateurs de bureau.

### Tests de compatibilité :

* **Navigateurs** : Testé sur Chrome, Firefox, Safari, et Edge
* **Appareils** : Optimisé pour des écrans de toutes tailles, y compris les téléphones mobiles et tablettes

---

## 📚 Documentation

La documentation complète du code source est fournie dans le dossier `/backend`, avec des commentaires dans le code et des instructions dans le fichier `README.md`. Ce dernier fournit des informations sur la configuration du serveur, les routes API, ainsi que les étapes nécessaires pour déployer l'application et effectuer des mises à jour futures.

### Guides inclus :

* **Configuration de l'environnement** (variables d'environnement, clés API)
* **Déploiement** : Instructions pour déployer l'API et le front-end
* **Tests** : Comment exécuter les tests et ajouter de nouveaux tests

---

## 🐳 Conteneurisation (Bonus)

Le projet est conteneurisé avec **Docker**. Vous pouvez facilement lancer tous les services (backend, frontend, MongoDB) avec Docker Compose.

### Commandes Docker :

* **Lancer tous les services** :

  ```bash
  docker-compose up --build
  ```
* **Arrêter et supprimer les conteneurs** :

  ```bash
  docker-compose down
  ```

---

## 🎥 Démo Vidéo

Une démonstration vidéo de l'application peut être trouvée ici :
[Vidéo de la démo](khdma dlpakistani)  (lien vers Google Drive, YouTube ou une autre plateforme)

---

## 🚀 Conclusion

Ce projet est une API complète de football avec des fonctionnalités avancées comme des prédictions alimentées par IA, des notifications en temps réel, et une gestion des utilisateurs sécurisée. Son architecture modulaire permet une maintenance facile et son conteneurisation avec Docker facilite le déploiement et la mise à jour.
