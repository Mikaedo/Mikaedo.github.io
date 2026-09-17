import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trouverProjet, projets } from '../data/projets';
import Galerie from '../components/Galerie';
import Focale from '../components/Focale';
import './Projet.css';

/**
 * La page d'un projet : le problème posé, la réponse, les captures.
 */
export default function Projet() {
  const { id } = useParams();
  const projet = trouverProjet(id);

  /* On arrive en haut de la page, non au milieu de la précédente. */
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!projet) {
    return (
      <div className="contenu projet__absent">
        <h1>Ce projet n'existe pas</h1>
        <p>Il a peut-être changé d'adresse.</p>
        <Link className="bouton bouton--plein" to="/">Revenir à l'accueil</Link>
      </div>
    );
  }

  const rang = projets.findIndex((p) => p.id === projet.id);
  const suivant = projets[(rang + 1) % projets.length];

  return (
    <article className="projet">

      <header className="projet__entete">
        <div className="contenu">
          <Link to="/#projets" className="projet__retour">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor"
                    strokeWidth="1.6" strokeLinecap="round"
                    strokeLinejoin="round" />
            </svg>
            Tous les projets
          </Link>

          <motion.div
            initial={{ opacity: 0.001, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="projet__cadre">{projet.cadre}</p>
            <h1 className="projet__nom">{projet.nom}</h1>
            <p className="projet__soustitre">{projet.soustitre}</p>

            <div className="projet__meta">
              <span><strong>Période</strong>{projet.periode}</span>
              <span><strong>Rôle</strong>{projet.role}</span>
              <span>
                <strong>Code</strong>
                {projet.lien ? (
                  <a href={projet.lien} target="_blank" rel="noreferrer">
                    Voir sur GitHub
                  </a>
                ) : 'Privé'}
              </span>
            </div>

            <div className="etiquettes projet__piles">
              {projet.piles.map((t) => (
                <span key={t} className="etiquette">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      {projet.accroche && (
        <div className="contenu">
          <motion.figure
            className="projet__accroche"
            initial={{ opacity: 0.001, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <Focale
              src={projet.accroche}
              alt={`${projet.nom} en fonctionnement`}
            />
          </motion.figure>
        </div>
      )}

      <section className="section">
        <div className="contenu projet__texte">
          <h2 className="projet__titre2">Le problème</h2>
          <p className="projet__paragraphe">{projet.probleme}</p>
        </div>
      </section>

      <section className="section">
        <div className="contenu">
          <h2 className="projet__titre2">Ce que j'ai fait</h2>
          <div className="projet__points">
            {projet.reponse.map((r, i) => (
              <motion.div
                key={r.titre}
                className="point"
                initial={{ opacity: 0.001, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05, margin: '200px 0px' }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
              >
                <span className="point__rang">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="point__titre">{r.titre}</h3>
                  <p className="point__texte">{r.texte}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {projet.ecrans?.length > 0 && (
        <section className="section">
          <div className="contenu">
            <h2 className="projet__titre2">Le système en images</h2>
            <p className="chapeau projet__chapeau">
              Cliquez sur une capture pour l'agrandir.
            </p>
            <Galerie ecrans={projet.ecrans} note={projet.note} />
          </div>
        </section>
      )}

      <nav className="projet__suite">
        <div className="contenu">
          <Link to={`/projet/${suivant.id}`} className="projet__suivant">
            <span className="projet__suivant-etiquette">Projet suivant</span>
            <span className="projet__suivant-nom">{suivant.nom}</span>
            <span className="projet__suivant-soustitre">{suivant.soustitre}</span>
          </Link>
        </div>
      </nav>

    </article>
  );
}
