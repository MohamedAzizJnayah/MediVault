# MediVault — Frontend (Angular 20)

[![Licence: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Angular](https://img.shields.io/badge/Angular-20.x-DD0031?logo=angular)](https://angular.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

## Description
MediVault est une application orientée santé qui permet de centraliser et gérer des dossiers médicaux, suivre les médicaments, planifier des rappels et interagir avec un assistant IA (chatbot).  
Ce dépôt contient le frontend développé avec Angular 20 (standalone components). Le backend attendu est : Spring Boot + Spring AI + Ollama + PostgreSQL.

---

## Table des matières
- [Fonctionnalités](#fonctionnalités)
- [Tech stack](#tech-stack)
- [Prérequis](#prérequis)
- [Installation rapide](#installation-rapide)
- [Configuration](#configuration)
- [Lancer le projet](#lancer-le-projet)
- [Routing (exemples)](#routing-exemples)
- [Endpoints API (exemples)](#endpoints-api-exemples)
- [Notes importantes / Bonnes pratiques](#notes-importantes--bonnes-pratiques)
- [Structure du projet](#structure-du-projet)
- [Checklist de tests manuels](#checklist-de-tests-manuels)
- [Contribution](#contribution)
- [Licence](#licence)
- [Dépannage rapide](#d%C3%A9pannage-rapide)

---

## Fonctionnalités

### Dossiers médicaux
- Upload de documents (PDF / JPG / PNG) via `multipart/form-data`
- Liste, suppression et visualisation des dossiers
- Visualisation en modal (PDF via iframe, image en preview)
- Tags optionnels pour organiser les documents

### Médicaments
- CRUD complet (ajout, modification, suppression, listing)
- Suivi du stock avec indicateur “low stock”
- Affichage des horaires de prise et infos principales

### Rappels
- Timeline quotidienne des prises
- Éditeur des horaires de prise

### Chatbot IA
- Widget flottant accessible depuis toutes les pages
- Envoi des messages vers le backend AI (via Spring AI)
- RAG (Retrieval-Augmented Generation) : le contexte provient des documents uploadés + données indexées depuis la base

---

## Tech stack
- Frontend : Angular 20 (standalone components), TypeScript
- Styles : TailwindCSS
- Forms : Reactive Forms
- Réseau : Angular HttpClient
- Backend (attendu) : Spring Boot + Spring AI + Ollama + PostgreSQL

---

## Prérequis
- Node.js (LTS recommandé) — https://nodejs.org/
- Angular CLI — `npm i -g @angular/cli` — https://angular.io/cli
- Un backend Spring Boot fonctionnel (par défaut attendu sur `http://localhost:8080`)

---

## Installation rapide

1. Cloner le dépôt
```bash
git clone https://github.com/MohamedAzizJnayah/MediVault.git
cd MediVault
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer l'environnement (voir section suivante)

4. Lancer en mode développement
```bash
ng serve
# ou, si votre CLI est local
npx ng serve
```

5. Ouvrir dans le navigateur
- http://localhost:4200

---

## Configuration

Les variables d'environnement se trouvent dans :
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Exemple minimal :
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

Conseils :
- Utiliser une URL absolue pour les fichiers (ex: `http://localhost:8080/medicalRecords/{id}/file`) afin d'éviter le routing Angular lors d'un open in new tab.
- Pour la production, vérifier que `apiUrl` pointe vers l'URL du backend déployé.

---

## Lancer le projet (autres commandes utiles)

- Build de production :
```bash
ng build --configuration production
```

- Lint :
```bash
npm run lint
# ou
npx eslint .
```

- Tests unitaires (si ajoutés) :
```bash
ng test
```

---

## Routing (exemples)
Routes principales utilisées :
- `/` : Home
- `/medical` : Dossiers médicaux
- `/medications` : Médicaments
- `/reminders` : Rappels

Exemple simplifié d'`app.routes.ts` :
```ts
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MedicalRecordPage } from './pages/medical-record.page/medical-record.page';
import { MedicationPage } from './pages/medication-page/medication-page';
import { RemindersPage } from './pages/reminders.page/reminders.page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'medical', component: MedicalRecordPage },
  { path: 'medications', component: MedicationPage },
  { path: 'reminders', component: RemindersPage },
  { path: '**', redirectTo: '' }
];
```

---

## Endpoints API (exemples)
Les routes peuvent varier selon l'implémentation du backend — adapter si besoin.

Dossiers médicaux
- GET /medicalRecords
- POST /medicalRecords (multipart/form-data) — upload
- GET /medicalRecords/{id}/file — preview / download
- DELETE /medicalRecords/{id}

Médicaments
- GET /medications
- POST /medications
- PUT /medications/{id}
- DELETE /medications/{id}

Chatbot
- POST /agent/chat
  - payload typique :
  ```json
  {
    "question": "Mon dernier résultat de prise de sang indique quoi ?",
    "context": ["medicalRecordId1", "medicalRecordId2"]
  }
  ```

Exemple cURL pour upload d'un fichier :
```bash
curl -X POST "http://localhost:8080/medicalRecords" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/chemin/vers/fichier.pdf" \
  -F "tags=rapport,priseDeSang"
```

---

## Notes importantes / Bonnes pratiques

- Toujours utiliser des URL backend absolues pour télécharger/ouvrir des fichiers afin d'éviter que Angular n'intercepte la route.
- Gérer correctement les erreurs HTTP côté frontend (401/403/500) : afficher un message utilisateur et logger si nécessaire.
- Pour les uploads volumineux, activer des limites côté backend et afficher une barre de progression côté frontend.
- Sécuriser les endpoints (authentification / autorisation) avant tout déploiement en production.
- Ne stockez jamais d'informations médicales sensibles sans chiffrement et conformité réglementaire (ex : RGPD).

---

## Structure du projet (aperçu)
src/app/
  core/
    services/              # services globaux (chat, auth, etc.)
  models/                  # interfaces (MedicalRecord, Medication...)
  services/                # services features (medical-record, medication...)
  directives/              # directives custom (AutoFocus, highlight...)
  pipes/                   # pipes custom (optionnel)
  components/              # UI réutilisable (navbar, modals, cards...)
  pages/                   # pages (medical, medications, reminders...)
  app.routes.ts            # routing

---

## Checklist de tests manuels
- [ ] Upload d’un document (PDF et image) + vérification qu’il apparaît dans la liste
- [ ] Visualisation du document en modal
- [ ] Suppression d’un record + mise à jour immédiate de la liste
- [ ] Ajout d’un médicament + vérification de l’affichage
- [ ] Modification d’un médicament + vérification que la liste se met à jour
- [ ] Suppression d’un médicament + mise à jour de la liste
- [ ] Vérification “low stock” (stock <= threshold)
- [ ] Navigation entre pages via navbar (/medical, /medications, /reminders)
- [ ] Chatbot : envoi d’une question + réception d’une réponse du backend

---

## Contribution
Merci de contribuer ! Processus recommandé :
1. Forker le projet
2. Créer une branche descriptive : `feature/ma-feature` ou `fix/ma-correction`
3. Faire des commits clairs et atomiques
4. Ouvrir une Pull Request en décrivant le changement et les étapes pour tester
5. Respecter le guide de style (TypeScript, ESLint, formats de commit)

Ajoutez des tests unitaires/integration quand c'est pertinent.

---

## Licence
Ce projet est distribué sous la licence MIT — voir le fichier [LICENSE](./LICENSE) pour le texte complet.

---

## Dépannage rapide
- Problème : Angular redirige quand on ouvre `/medicalRecords/{id}/file` dans un nouvel onglet  
  Solution : Utiliser l'URL absolue du backend, ex : `http://localhost:8080/medicalRecords/{id}/file`.

- Problème : CORS bloqué lors des appels API  
  Solution : Activer CORS sur le backend Spring Boot (ex : @CrossOrigin ou configuration globale) ou utiliser un proxy Angular en dev.

- Problème : Erreur 401/403  
  Solution : Vérifier les headers d'authentification (Bearer token), rafraîchir les tokens et vérifier la configuration du backend.

---

Si tu veux, je peux :
- Générer un fichier `LICENSE` MIT (avec ton nom + année) et l'ajouter au repo,
- Ajouter un exemple complet d'implémentation de service Angular pour l'upload / preview,
- Créer un fichier `ENV.example` ou `.env` avec variables recommandées.

Dis-moi ce que tu préfères que j'ajoute ensuite.