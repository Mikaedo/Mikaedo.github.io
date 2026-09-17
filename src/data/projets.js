/**
 * Les projets du portfolio.
 *
 * Tout ce qui est affiche vient d'ici : les composants ne portent
 * aucun texte en dur. Ajouter un projet, c'est ajouter une entree.
 *
 * Les captures du SI-ENV ont ete prises sur l'application reelle,
 * branchee sur un jeu de donnees invente pour l'occasion : ni les
 * chantiers ni les signalements affiches ne sont ceux de l'AGEROUTE.
 */

import webConnexion    from '../assets/images/web-connexion.jpg';
import webTableau      from '../assets/images/web-tableau.jpg';
import webSignalements from '../assets/images/web-signalements.jpg';
import webPlaintes     from '../assets/images/web-plaintes.jpg';
import webSatellite    from '../assets/images/web-satellite.jpg';
import webRapports     from '../assets/images/web-rapports.jpg';
import webControle     from '../assets/images/web-controle.jpg';
import webAdmin        from '../assets/images/web-admin.jpg';

import miniTableau      from '../assets/images/web-tableau-mini.jpg';
import miniSatellite    from '../assets/images/web-satellite-mini.jpg';
import miniAdmin        from '../assets/images/web-admin-mini.jpg';

import weciteTableau   from '../assets/images/wecite-tableau.jpg';
import weciteResidents from '../assets/images/wecite-residents.jpg';
import weciteIncidents from '../assets/images/wecite-incidents.jpg';
import weciteFinances  from '../assets/images/wecite-finances.jpg';
import weciteCarte     from '../assets/images/wecite-carte.jpg';
import weciteReglement from '../assets/images/wecite-reglement.jpg';
import weciteConnexion from '../assets/images/wecite-connexion.jpg';
import miniWecite      from '../assets/images/wecite-tableau-mini.jpg';

import biblioTableau   from '../assets/images/biblio-admin-tableau.jpg';
import biblioUsagers   from '../assets/images/biblio-admin-utilisateurs.jpg';
import biblioMotsPasse from '../assets/images/biblio-admin-motsdepasse.jpg';
import biblioJournaux  from '../assets/images/biblio-admin-journaux.jpg';
import biblioConnexion from '../assets/images/biblio-connexion.jpg';
import miniBiblio      from '../assets/images/biblio-admin-tableau-mini.jpg';

import agentListe      from '../assets/images/agent-liste.jpg';
import agentCarte      from '../assets/images/agent-carte.jpg';
import agentDetail     from '../assets/images/agent-detail.jpg';
import citoyenAccueil  from '../assets/images/citoyen-accueil.jpg';
import citoyenDepot    from '../assets/images/citoyen-depot.jpg';

export const projets = [
  {
    id: 'si-env',
    nom: 'SI-ENV',
    soustitre: 'Suivi environnemental des chantiers du PTUA',
    resume:
      "Un agent photographie une nuisance sur un chantier, sans réseau. " +
      "Le téléphone reconnaît le déchet, propose un niveau de criticité, " +
      "et transmet dès que la connexion revient.",
    cadre: 'AGEROUTE · Cellule de Coordination du PTUA',
    periode: 'Juillet – septembre 2026',
    role: 'Conception et développement',
    couverture: miniSatellite,
    accroche: webSatellite,
    lien: 'https://github.com/Mikaedo/si-env-ptua',
    prive: false,
    piles: ['Flutter', 'FastAPI', 'PostgreSQL / PostGIS', 'YOLOv8n',
            'MobileNetV2', 'Angular 21', 'Docker', 'Google Earth Engine'],

    probleme:
      "Le suivi environnemental du Projet de Transport Urbain d'Abidjan " +
      "reposait sur des tableurs et des carnets. Un constat relevé le matin " +
      "sur un chantier de Yopougon arrivait au siège des jours plus tard, " +
      "sans photo localisée, sans trace de qui l'avait vu. La Banque " +
      "Africaine de Développement exige pourtant un suivi documenté.",

    reponse: [
      {
        titre: "Le terrain d'abord, le réseau ensuite",
        texte:
          "L'application mobile écrit chaque saisie dans une base SQLite " +
          "locale avant toute tentative d'envoi. L'agent ne sait pas s'il a " +
          "du réseau et n'a pas à le savoir : il saisit, l'application " +
          "rattrape son retard quand la connexion revient. Chaque saisie " +
          "porte un identifiant unique, si bien qu'un envoi rejoué ne crée " +
          "jamais de doublon."
      },
      {
        titre: "Un modèle de vision embarqué dans le téléphone",
        texte:
          "Un YOLOv8n exporté en ONNX tourne sur l'appareil, sur une entrée " +
          "de 320 × 320 pixels. Il reconnaît six catégories de déchets et " +
          "propose une criticité que l'agent garde ou corrige : le " +
          "diagnostic automatique est une aide au classement, jamais une " +
          "décision."
      },
      {
        titre: "Huit rôles, et ce que chacun n'a pas le droit de faire",
        texte:
          "L'agence de tutelle et le bailleur accèdent au tableau de bord en " +
          "consultation seule. Ce n'est pas un détail technique : celui qui " +
          "contrôle ne doit pas pouvoir modifier ce qu'il examine. Le " +
          "serveur refuse toute écriture émise avec leur jeton, et l'écran " +
          "leur retire jusqu'aux boutons."
      },
      {
        titre: "La donnée satellitaire pour compléter le terrain",
        texte:
          "Google Earth Engine calcule des indices de végétation, de teneur " +
          "en eau et de dioxyde d'azote sur les six chantiers, avant et " +
          "après travaux. Un indice dégradé signale un chantier mal maîtrisé " +
          "comme il peut signaler une saison sèche : l'outil oriente la " +
          "visite, il ne conclut pas."
      }
    ],

    ecrans: [
      { image: webTableau,      legende: "Tableau de bord : carte des signalements sur les tracés du PTUA, indicateurs de suivi, répartition par nuisance." },
      { image: webSignalements, legende: "Liste des signalements, filtrable par statut, criticité et chantier." },
      { image: webSatellite,    legende: "Analyse satellitaire : NO₂, végétation, teneur en eau, risque pluie et relief, avec leurs seuils de vigilance." },
      { image: webAdmin,        legende: "Administration : création des accès et gestion des huit rôles." },
      { image: webControle,     legende: "Écran de l'organisme de contrôle, dépourvu de toute commande de modification." },
      { image: webPlaintes,     legende: "Mécanisme de gestion des plaintes, alimenté par l'application citoyenne." },
      { image: webRapports,     legende: "Génération des rapports réglementaires au format attendu par le bailleur." },
      { image: webConnexion,    legende: "Écran de connexion du tableau de bord." },
      { image: agentListe,      legende: "Application agent : liste des signalements, transmis et en attente.", mobile: true },
      { image: agentCarte,      legende: "Application agent : carte des chantiers et position relevée.", mobile: true },
      { image: agentDetail,     legende: "Application agent : détail d'un signalement, criticité proposée par le modèle.", mobile: true },
      { image: citoyenAccueil,  legende: "Application citoyenne : accueil et demande de position.", mobile: true },
      { image: citoyenDepot,    legende: "Application citoyenne : dépôt d'une doléance.", mobile: true }
    ],

    note: "Les données affichées sur ces captures sont inventées."
  },

  {
    id: 'wecite',
    nom: 'WeCité',
    soustitre: 'Gestion de cités résidentielles',
    resume:
      "Trois interfaces pour trois métiers : le résident déclare un " +
      "incident, le gardien filtre les entrées, l'administrateur encaisse " +
      "les cotisations.",
    cadre: 'Projet personnel · Côte d\'Ivoire',
    periode: 'Juin – août 2026',
    role: 'Architecture et développement',
    couverture: miniWecite,
    accroche: weciteTableau,
    lien: null,
    prive: true,
    piles: ['Spring Boot 3.5', 'Java 21', 'React 19', 'Flutter', 'Riverpod',
            'PostgreSQL', 'WebSocket STOMP', 'Firebase FCM', 'GeniusPay CI'],

    probleme:
      "La gestion d'une cité résidentielle tient souvent dans un cahier et " +
      "un groupe de discussion : qui a payé sa cotisation, qui est entré " +
      "hier soir, quel incident reste sans réponse. Rien ne se retrouve, " +
      "et le trésorier passe ses soirées à recouper.",

    reponse: [
      {
        titre: "Un socle, trois métiers",
        texte:
          "Le résident, le gardien et l'administrateur ne partagent ni les " +
          "mêmes écrans ni les mêmes droits, mais le même serveur et le " +
          "même modèle de données. Le résident déclare depuis son " +
          "téléphone, le gardien enregistre les visites, l'administrateur " +
          "pilote depuis le web."
      },
      {
        titre: "Tout le monde n'a pas de smartphone",
        texte:
          "Les notifications partent par SMS via Africa's Talking en plus " +
          "des notifications téléphone et du courriel. Une cotisation dont " +
          "le rappel n'arrive pas est une cotisation impayée : le canal " +
          "compte autant que le message."
      },
      {
        titre: "Les paiements et les reçus",
        texte:
          "Les cotisations passent par GeniusPay CI. Une analyse de reçus " +
          "par IA allège la saisie côté administration, pour les paiements " +
          "faits hors de la plateforme."
      },
      {
        titre: "Le temps réel là où il sert",
        texte:
          "Une entrée enregistrée par le gardien apparaît aussitôt sur " +
          "l'écran de l'administrateur, par WebSocket. Un incident déclaré " +
          "remonte de la même façon : personne n'a à rafraîchir sa page."
      }
    ],

    ecrans: [
      { image: weciteTableau,   legende: "Vue d'ensemble : trésorerie, taux de recouvrement, incidents à suivre et courbe des encaissements." },
      { image: weciteResidents, legende: "Annuaire des résidents, avec leur villa et leur rôle." },
      { image: weciteIncidents, legende: "Suivi des incidents déclarés, par priorité et par statut." },
      { image: weciteFinances,  legende: "Cotisations : qui a payé, qui est en retard, par quel moyen." },
      { image: weciteCarte,     legende: "Cartographie de la cité et localisation des résidents." },
      { image: weciteReglement, legende: "Règlement intérieur, consultable par tous les résidents." },
      { image: weciteConnexion, legende: "Écran de connexion de l'espace d'administration." }
    ],
    note: "Les données affichées sur ces captures sont inventées."
  },

  {
    id: 'bibliotheque-upb',
    nom: 'Bibliothèque UPB',
    soustitre: 'Gestion du fonds documentaire universitaire',
    resume:
      "Catalogue, emprunts, retours et relances pour la bibliothèque de " +
      "l'université, avec une seule base de code Flutter pour le mobile " +
      "et le web.",
    cadre: 'Université Polytechnique de Bingerville · en équipe',
    periode: 'Janvier – mai 2026',
    role: 'Développement et conventions d\'équipe',
    couverture: miniBiblio,
    accroche: biblioTableau,
    lien: 'https://github.com/Mikaedo/bibliotheque-upb-public',
    prive: false,
    piles: ['Spring Boot', 'Flutter mobile + web', 'PostgreSQL', 'JWT', 'Maven'],

    probleme:
      "Le suivi des emprunts se faisait sur registre papier. Retrouver qui " +
      "détenait un ouvrage demandait de remonter les pages, et les " +
      "relances se faisaient de mémoire.",

    reponse: [
      {
        titre: "Une base de code, deux cibles",
        texte:
          "Flutter compile la même application pour le téléphone et pour le " +
          "navigateur. L'étudiant consulte le catalogue depuis son mobile, " +
          "le bibliothécaire gère les emprunts depuis son poste, sans " +
          "qu'il ait fallu écrire deux applications."
      },
      {
        titre: "Des conventions, et un guide pour les tenir",
        texte:
          "C'est le premier projet où j'ai imposé un format de commit et un " +
          "flux Git à l'équipe. Les deux documents figurent encore dans le " +
          "dépôt. Sur un travail à plusieurs mains, cette discipline coûte " +
          "moins cher qu'un historique illisible."
      }
    ],

    ecrans: [
      { image: biblioTableau,   legende: "Tableau de bord : répartition du fonds par catalogue, usagers par rôle, alertes de retard." },
      { image: biblioUsagers,   legende: "Gestion des comptes : étudiants, bibliothécaires et administrateurs." },
      { image: biblioMotsPasse, legende: "Demandes de réinitialisation de mot de passe, validées par un administrateur." },
      { image: biblioJournaux,  legende: "Journal d'audit : chaque opération laisse une trace horodatée." },
      { image: biblioConnexion, legende: "Écran de connexion, compilé par Flutter pour le navigateur." }
    ],
    note: "Les données affichées sur ces captures sont inventées."
  }
];

export const trouverProjet = (id) => projets.find((p) => p.id === id);
