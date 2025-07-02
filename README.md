# Pokedex App

Une application Pokedex avec gestion des utilisateurs, connexion/inscription, ajout et suppression des favoris.

---

## Fonctionnalités

- Consultation du Pokedex complet
- Connexion / Inscription des utilisateurs
- Ajout et suppression de Pokémon favoris
- Animations fluides avec GSAP
- Gestion des appels API avec React Query
- Navigation avec React Router
- UI moderne et responsive avec Chakra UI
- Mock des API avec MSW pour le développement et les tests
- Tests unitaires avec Vitest

---

## Tech Stack

- React (TypeScript)
- Chakra UI
- React Router
- React Query
- GSAP (animations)
- MSW (Mock Service Worker)
- Vitest (tests)
- Vite (build tool)

---

## Architecture du projet

/src
/api # appels API (auth, user, pokemons...)
/assets # images, icônes, fonts
/auth # logique et context d’authentification
/components # composants réutilisables (LoginModal, PokemonCard...)
/mocks # mocks MSW
/pages # pages React Router (Login, Register, Favorites...)
/styles # thèmes Chakra UI, styles globaux
/types # types TypeScript

---

## Installation

1. Cloner le repo :

```bash
git clone https://github.com/ton-username/pokedex-app.git
cd pokedex-app
```

2. Installer les dépendances :

```bash
npm install
```

3. Copier le fichier d’environnement et adapter si besoin :

```bash
npm run dev
# ou
npm run build
npm run preview
```
