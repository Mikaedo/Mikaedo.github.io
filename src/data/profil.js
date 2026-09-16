/**
 * Qui je suis, ce que je sais faire, par où je suis passé.
 *
 * Les composants lisent ces données : aucun texte de présentation
 * n'est écrit en dur dans le rendu.
 */

import portrait from '../assets/images/portrait.jpg';

export const profil = {
  prenom: "N'Guessan Diby",
  nom: 'Konanbouo Georges Mikaël',
  metier: 'Ingénieur logiciel',
  specialite: "Systèmes d'information métier",
  ville: 'Abidjan, Côte d\'Ivoire',
  portrait,
  courriel: 'bediabate@ageroute.ci',
  github: 'https://github.com/Mikaedo',

  /* La phrase qui s'écrit lettre à lettre sous le nom. */
  rotations: [
    'applications mobiles hors connexion',
    'serveurs FastAPI et Spring Boot',
    "modèles de vision embarqués",
    'bases de données spatiales',
    'déploiement conteneurisé'
  ],

  presentation:
    "Je construis des applications qui tiennent sur le terrain africain : " +
    "un chantier sans réseau, un agent qui saisit sous le soleil, un " +
    "serveur qu'on doit pouvoir déplacer d'un hébergeur à l'autre sans " +
    "toucher au code. Mes trois derniers systèmes partagent la même " +
    "contrainte et la même réponse : enregistrer en local d'abord, " +
    "synchroniser ensuite, tout conteneuriser.",

  recherche:
    "Je cherche des projets où le terrain impose ses contraintes : " +
    "connexion incertaine, matériel modeste, utilisateurs qui n'ont pas le " +
    "temps d'apprendre un outil compliqué."
};

export const competences = [
  {
    domaine: 'Applications mobiles',
    icone: 'mobile',
    lignes: [
      { quoi: 'Flutter', precision: 'BLoC, Riverpod' },
      { quoi: 'Fonctionnement hors connexion', precision: 'SQLite, file de synchronisation' },
      { quoi: 'Géolocalisation et cartographie', precision: 'flutter_map, Leaflet' },
      { quoi: 'Inférence embarquée', precision: 'ONNX Runtime' }
    ]
  },
  {
    domaine: 'Serveurs et API',
    icone: 'serveur',
    lignes: [
      { quoi: 'FastAPI', precision: 'Python, Pydantic, SQLAlchemy' },
      { quoi: 'Spring Boot', precision: 'Java 21, Maven' },
      { quoi: 'Authentification JWT', precision: 'habilitations par rôle' },
      { quoi: 'Temps réel', precision: 'WebSocket STOMP' }
    ]
  },
  {
    domaine: 'Données',
    icone: 'base',
    lignes: [
      { quoi: 'PostgreSQL, PostGIS', precision: 'données spatiales' },
      { quoi: 'Modélisation MERISE', precision: 'MCD, MLD, 3NF' },
      { quoi: 'Modélisation UML', precision: 'statique et dynamique' }
    ]
  },
  {
    domaine: 'Intelligence artificielle',
    icone: 'ia',
    lignes: [
      { quoi: "Détection d'objets", precision: 'YOLOv8n' },
      { quoi: "Classification d'images", precision: 'MobileNetV2' },
      { quoi: 'Apprentissage par transfert', precision: 'export ONNX' },
      { quoi: 'Télédétection', precision: 'Earth Engine, Sentinel' }
    ]
  },
  {
    domaine: 'Interfaces web',
    icone: 'web',
    lignes: [
      { quoi: 'Angular 21', precision: 'TypeScript' },
      { quoi: 'React 19', precision: 'Vite, Tailwind' },
      { quoi: 'Visualisation', precision: 'ApexCharts, Recharts' }
    ]
  },
  {
    domaine: 'Mise en production',
    icone: 'deploiement',
    lignes: [
      { quoi: 'Docker', precision: 'Docker Compose' },
      { quoi: 'Intégration continue', precision: 'GitHub Actions' },
      { quoi: 'Hébergement', precision: 'Render, Supabase, Cloudflare' }
    ]
  }
];

export const parcours = [
  {
    periode: '2026',
    titre: 'Licence MIAGE',
    distinction: 'Mention très bien · 16,5',
    lieu: 'Université Polytechnique de Bingerville',
    texte:
      "Méthodes Informatiques Appliquées à la Gestion des Entreprises. " +
      "Mémoire : conception et réalisation du SI-ENV, soutenu devant un " +
      "jury présidé par le Dr Keupondjo Armel."
  },
  {
    periode: 'Mai – août 2026',
    titre: 'Stage — conception du SI-ENV',
    distinction: null,
    lieu: 'AGEROUTE · Cellule de Coordination du PTUA',
    texte:
      "Affecté au Service Études et Développement d'Applications, puis à la " +
      "Cellule Informatique et Logistique du projet. Conception complète du " +
      "système, du modèle de données au déploiement conteneurisé."
  },
  {
    periode: 'Janvier – mai 2026',
    titre: 'Projet Bibliothèque UPB',
    distinction: null,
    lieu: 'Université Polytechnique de Bingerville',
    texte:
      "Application de gestion du fonds documentaire, en équipe. Mise en " +
      "place des conventions de commit et du flux Git."
  }
];
