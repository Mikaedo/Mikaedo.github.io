import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Focale from './Focale';
import './CarteProjet.css';

/**
 * La carte d'un projet dans la grille de l'accueil.
 *
 * Toute la carte mène à la page du projet : un clic n'importe où
 * ouvre le détail, plutôt qu'un petit lien à viser.
 *
 * Un projet sans capture montre à la place un motif construit sur ses
 * technologies, plutôt qu'un cadre vide.
 */
export default function CarteProjet({ projet, rang }) {
  return (
    <motion.article
      className="carte"
      initial={{ opacity: 0.001, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05, margin: '200px 0px' }}
      transition={{ duration: 0.5, delay: rang * 0.08 }}
    >
      <Link to={`/projet/${projet.id}`} className="carte__lien">

        <div className="carte__visuel">
          {projet.couverture ? (
            /* La capture se recule à mesure qu'on descend : on entre
               dans l'écran du projet au lieu de le survoler. */
            <Focale src={projet.couverture} alt="" loading="lazy" />
          ) : (
            /* Sans capture, on montre l'initiale du projet en grand :
               reprendre les technologies ferait double emploi avec les
               étiquettes qui figurent juste dessous. */
            <div className="carte__motif">
              <span className="carte__initiale">{projet.nom.charAt(0)}</span>
              <span className="carte__mention">Captures à venir</span>
            </div>
          )}

          {projet.prive && (
            <span className="carte__sceau">Code privé</span>
          )}
        </div>

        <div className="carte__texte">
          <p className="carte__cadre">{projet.cadre}</p>
          <h3 className="carte__nom">{projet.nom}</h3>
          <p className="carte__soustitre">{projet.soustitre}</p>
          <p className="carte__resume">{projet.resume}</p>

          <div className="etiquettes carte__piles">
            {projet.piles.slice(0, 4).map((t) => (
              <span key={t} className="etiquette">{t}</span>
            ))}
            {projet.piles.length > 4 && (
              <span className="etiquette etiquette--reste">
                +{projet.piles.length - 4}
              </span>
            )}
          </div>

          <span className="carte__appel">
            Voir le détail
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor"
                    strokeWidth="1.6" strokeLinecap="round"
                    strokeLinejoin="round" />
            </svg>
          </span>
        </div>

      </Link>
    </motion.article>
  );
}
