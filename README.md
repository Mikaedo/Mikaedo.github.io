# Portfolio — N'Guessan Diby Konanbouo Georges

Portfolio personnel : trois systèmes livrés, présentés avec leurs
captures, le problème posé et ce qu'ils ne résolvent pas.

## Lancer le site

```bash
npm install
npm run dev        # développement, rechargement à chaud
npm run build      # construction dans dist/
npm run preview    # servir la construction
```

## Où se trouve quoi

```
src/
  data/           tout le contenu du site
    profil.js       qui je suis, savoir-faire, parcours
    projets.js      les trois projets, leurs captures et leur récit
  components/     les briques de l'interface
    Barre           la navigation du haut
    Ouverture       le portrait et la présentation
    CarteProjet     une fiche dans la grille de l'accueil
    Galerie         les captures et leur visionneuse
    Methode         le schéma de la chaîne hors ligne
    Competences     les six domaines de savoir-faire
    Parcours        la chronologie
    Contact         le formulaire
    Pied            le bas de page
    Marque          les icônes, dessinées au trait
    Frappe          le texte qui s'écrit lettre à lettre
  pages/
    Accueil         la page unique, section après section
    Projet          le détail d'un projet
  styles/
    tokens.css      couleurs, polices, espacements
    global.css      remise à zéro et briques communes
  hooks/
    useTheme        la bascule clair / sombre
```

**Ajouter ou modifier un projet** : tout se passe dans
`src/data/projets.js`. Aucun texte n'est écrit en dur dans les
composants.

## Les captures

Celles du SI-ENV ont été prises sur l'application réelle, branchée sur
un jeu de données inventé : ni les chantiers ni les signalements
affichés ne sont ceux de l'AGEROUTE.

Le dossier `captures/` contient de quoi les refaire :

```bash
python captures/api_demo.py       # l'API de démonstration, port 8100
python captures/servir.py 8200    # le tableau de bord construit
node captures/capturer.js         # pilote Chrome et enregistre
```

Chrome doit tourner avec `--remote-debugging-port=9222`.

## Publier

Le routeur travaille sur le fragment de l'adresse (`/#/projet/si-env`),
ce qui permet d'héberger le site sur n'importe quel serveur de fichiers
statiques, GitHub Pages compris, sans configuration de réécriture.

```bash
npm run build     # le résultat est dans dist/
```
