import * as icones from 'simple-icons';
import './Outil.css';

/**
 * Une technologie, avec son logo officiel.
 *
 * Le tracé vient du catalogue Simple Icons : c'est la vraie marque,
 * dans sa vraie couleur. Le tracé tient en quelques centaines
 * d'octets, donc on le rend directement en SVG plutôt que de charger
 * une image, ce qui économise une requête par logo.
 *
 * Une méthode ou un format n'a pas de marque déposée : l'étiquette
 * reste alors du texte seul, et c'est très bien ainsi.
 *
 * @param {string} nom     le nom affiché
 * @param {string} marque  la clé du pictogramme, ou rien
 */
export default function Outil({ nom, marque }) {
  const icone = marque ? icones[marque] : null;

  return (
    <li
      className={`outil ${icone ? 'outil--marque' : ''}`}
      /* La couleur de la marque, posée sur l'étiquette entière : le
         logo la porte en permanence, et le survol la reprend pour le
         cadre et le fond. */
      style={icone ? { '--teinte': `#${icone.hex}` } : undefined}
    >
      {icone && (
        <svg
          className="outil__logo"
          viewBox="0 0 24 24"
          width="15"
          height="15"
          aria-hidden="true"
        >
          <path d={icone.path} fill="currentColor" />
        </svg>
      )}
      {nom}
    </li>
  );
}
