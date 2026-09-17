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

/**
 * Ce que je sais faire, groupé par ce à quoi cela sert.
 *
 * Une phrase dit le domaine, puis viennent les outils, logo compris.
 * « marque » porte le nom du pictogramme dans le catalogue Simple
 * Icons, quand la marque y figure ; sans lui l'étiquette reste du
 * texte, ce qui convient aux méthodes et aux formats, qui n'ont pas
 * de logo.
 *
 * La liste est volontairement courte : citer chaque bibliothèque
 * traversée donnerait un inventaire, où l'essentiel se noie.
 */
export const competences = [
  {
    domaine: 'Applications mobiles',
    icone: 'mobile',
    resume:
      "Des applications qui fonctionnent sans réseau, enregistrent en " +
      "local et se synchronisent au retour de la connexion.",
    outils: [
      { nom: 'Flutter', marque: 'siFlutter' },
      { nom: 'SQLite', marque: 'siSqlite' },
      { nom: 'Leaflet', marque: 'siLeaflet' },
      { nom: 'ONNX', marque: 'siOnnx' }
    ]
  },
  {
    domaine: 'Serveurs et API',
    icone: 'serveur',
    resume:
      "Des interfaces de programmation documentées, avec des " +
      "habilitations par rôle et du temps réel quand il le faut.",
    outils: [
      { nom: 'FastAPI', marque: 'siFastapi' },
      { nom: 'Python', marque: 'siPython' },
      { nom: 'Spring Boot', marque: 'siSpring' },
      { nom: 'Java', marque: 'siOpenjdk' },
      { nom: 'JWT', marque: 'siJsonwebtokens' }
    ]
  },
  {
    domaine: 'Données',
    icone: 'base',
    resume:
      "Du modèle conceptuel à la base en production, y compris les " +
      "données spatiales.",
    outils: [
      { nom: 'PostgreSQL', marque: 'siPostgresql' },
      { nom: 'PostGIS' },
      { nom: 'MERISE' },
      { nom: 'UML' }
    ]
  },
  {
    domaine: 'Intelligence artificielle',
    icone: 'ia',
    resume:
      "Des modèles de vision entraînés puis embarqués sur le " +
      "téléphone, pour qu'ils tournent sans serveur.",
    outils: [
      { nom: 'YOLOv8' },
      { nom: 'MobileNetV2' },
      { nom: 'Python', marque: 'siPython' },
      { nom: 'ONNX', marque: 'siOnnx' }
    ]
  },
  {
    domaine: 'Interfaces web',
    icone: 'web',
    resume:
      "Des tableaux de bord qui montrent l'état du terrain d'un coup " +
      "d'œil, et restent lisibles sur un écran de bureau comme sur un " +
      "téléphone.",
    outils: [
      { nom: 'Angular', marque: 'siAngular' },
      { nom: 'React', marque: 'siReact' },
      { nom: 'TypeScript', marque: 'siTypescript' },
      { nom: 'Vite', marque: 'siVite' }
    ]
  },
  {
    domaine: 'Mise en production',
    icone: 'deploiement',
    resume:
      "Tout conteneurisé, pour déplacer un serveur d'un hébergeur à " +
      "l'autre sans toucher au code.",
    outils: [
      { nom: 'Docker', marque: 'siDocker' },
      { nom: 'GitHub Actions', marque: 'siGithubactions' },
      { nom: 'Supabase', marque: 'siSupabase' },
      { nom: 'Cloudflare', marque: 'siCloudflare' }
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
