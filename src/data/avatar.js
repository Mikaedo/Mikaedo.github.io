/**
 * Les mesures du visage, relevées sur la photo.
 *
 * Elles ne sont pas inventées : MediaPipe a posé 478 repères sur le
 * portrait, d'où sont tirés les rapports ci-dessous. Les couleurs ont
 * été prélevées au même endroit, en prenant la teinte dominante plutôt
 * que la moyenne, qui mélangeait les zones voisines.
 *
 * C'est ce qui fait la ressemblance de l'avatar : un personnage
 * générique aurait des proportions arbitraires, celui-ci a les vôtres.
 */

export const visage = {
  /* Rapports mesurés, tous rapportés à la largeur ou à la hauteur du
     visage : ils restent justes quelle que soit la taille du rendu. */
  proportions: {
    largeurSurHauteur: 0.811,  // visage plutôt allongé
    ecartYeux: 0.24,           // écartement des pupilles
    largeurOeil: 0.201,
    largeurBouche: 0.417,
    hauteurYeux: 0.289,        // 0 au sommet du front, 1 au menton
    hauteurNez: 0.599,
    hauteurBouche: 0.767
  },

  couleurs: {
    peau: '#966252',
    peauClaire: '#B3866F',     // le front, plus éclairé
    peauOmbre: '#6E4436',
    cheveux: '#1E1D22',        // noirs, coupe courte
    levres: '#C56964',
    chemise: '#F4F3FA',        // blanche
    pull: '#E8DACB',           // beige
    pullMotif: '#6B4A38',      // les chevrons bruns du pull
    cravate: '#784F46',        // brune
    lunettes: '#2A2622',       // monture ronde, sombre
    blancOeil: '#F5F0EC',
    iris: '#3A2418'
  },

  /* Les traits qui vous identifient, relevés à l'œil sur le portrait. */
  traits: {
    lunettes: true,
    formeLunettes: 'rondes',
    barbe: true,
    barbeCourte: true,
    coupe: 'courte'
  }
};
