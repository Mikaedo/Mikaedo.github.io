/**
 * Qui je suis, ce que je sais faire, par où je suis passé.
 *
 * Les composants lisent ces données : aucun texte de présentation
 * n'est écrit en dur dans le rendu.
 */

import portrait from '../assets/images/portrait-detoure.webp';

export const profil = {
  prenom: "N'Guessan Diby",
  nom: 'Konanbouo Georges Mikaël',
  metier: 'Ingénieur logiciel',
  specialite: "Systèmes d'information métier",
  ville: 'Abidjan / Bingerville, Côte d\'Ivoire',
  portrait,
  courriel: 'Mikaedoking@gmail.com',
  telephone: '01 43 84 44 24',
  github: 'https://github.com/Mikaedo',

  /* Le CV, converti du document Word d'origine. Il vit dans public/ :
     Vite y copie les fichiers tels quels, sans les renommer, pour que
     le nom du fichier telecharge reste lisible. */
  cv: 'CV-NGuessan-Diby-Georges-Mikael.pdf',

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
    annee: 2026,
    periode: '2026',
    titre: 'Licence MIAGE',
    lieu: 'Université Polytechnique de Bingerville',
    genre: 'diplome',
    texte:
      "Méthodes Informatiques Appliquées à la Gestion des Entreprises. " +
      "Mémoire : conception et réalisation du SI-ENV, soutenu devant un " +
      "jury présidé par le Dr Keupondjo Armel."
  },
  {
    annee: 2026,
    periode: 'Mai 2026 – aujourd\'hui',
    titre: 'Développeur · SI-ENV',
    lieu: 'AGEROUTE · Cellule de Coordination du PTUA',
    genre: 'travail',
    texte:
      "Conception de solutions logicielles et structuration des données " +
      "d'infrastructures. Affecté au Service Études et Développement " +
      "d'Applications, puis à la Cellule Informatique et Logistique du " +
      "projet : du modèle de données au déploiement conteneurisé."
  },
  {
    annee: 2026,
    periode: 'Février 2026',
    titre: 'Huawei ICT Competition',
    lieu: 'Côte d\'Ivoire',
    genre: 'concours',
    texte:
      "Qualifié pour la deuxième phase de la compétition, au niveau national."
  },
  {
    annee: 2026,
    periode: '2026',
    titre: 'CDCI Capital & Challenge Orange',
    lieu: 'Abidjan',
    genre: 'concours',
    texte:
      "Challenges d'innovation, et prototypage de la solution logicielle " +
      "« Ora »."
  },
  {
    annee: 2026,
    periode: 'Janvier – mai 2026',
    titre: 'Projet Bibliothèque UPB',
    lieu: 'Université Polytechnique de Bingerville',
    genre: 'projet',
    texte:
      "Application de gestion du fonds documentaire, en équipe. Mise en " +
      "place des conventions de commit et du flux Git."
  },
  {
    annee: 2025,
    periode: 'Juillet 2025',
    titre: 'Habihack · Google AI Hackathon',
    lieu: 'Abidjan',
    genre: 'concours',
    texte:
      "Architecture d'intelligence artificielle prédictive pour le suivi " +
      "de la qualité de l'eau."
  },
  {
    annee: 2024,
    periode: 'Août 2024',
    titre: 'Développeur (stagiaire)',
    lieu: 'SATI Group · Abidjan',
    genre: 'travail',
    texte:
      "Intégration d'une reconnaissance optique de caractères dans " +
      "Oracle APEX."
  },
  {
    annee: 2024,
    periode: '2024 – 2026',
    titre: 'Licence Génie Logiciel',
    lieu: 'ESETEC · École Supérieure de l\'Enseignement Technique',
    genre: 'diplome',
    texte:
      "Menée en parallèle de la licence MIAGE."
  },
  {
    annee: 2023,
    periode: '2022 – 2023',
    titre: 'Baccalauréat série D',
    lieu: 'Cours Secondaire Méthodiste, Plateau',
    genre: 'diplome',
    texte:
      "Série scientifique, à dominante mathématiques et sciences " +
      "de la vie."
  }
];
