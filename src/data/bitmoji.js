/**
 * L'avatar 3D du parcours.
 *
 * Deux sources possibles.
 *
 * 1. Un modèle Ready Player Me. Créez-le sur readyplayer.me, copiez le
 *    lien du fichier .glb, et collez-le ci-dessous. C'est le rendu
 *    stylisé, façon dessin animé.
 *
 * 2. À défaut, le maillage du visage relevé sur la photo : 478 sommets
 *    en volume, habillés du portrait. La ressemblance est exacte mais
 *    le rendu photographique.
 *
 * Le lien ressemble à :
 *   https://models.readyplayer.me/68xxxxxxxxxxxxxxxxxxxxxx.glb
 *
 * Deux paramètres valent la peine d'être ajoutés au bout du lien :
 *   ?quality=medium     allège le modèle
 *   &morphTargets=none  retire les expressions, inutiles ici
 */

export const bitmoji = {
  /* Collez ici le lien du modèle. Tant qu'il est vide, l'avatar
     retombe sur le maillage du visage. */
  modele: null,

  /* Le cadrage du modèle dans la vignette. Ready Player Me livre un
     personnage debout : on remonte la caméra sur le buste. */
  cadrage: {
    hauteurCamera: 1.42,   // à hauteur des yeux du modèle
    distance: 0.9,         // assez près pour voir le visage
    hauteurVisee: 1.4
  }
};
