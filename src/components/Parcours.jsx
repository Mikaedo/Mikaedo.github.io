import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { parcours } from '../data/profil';
import Bitmoji from './Bitmoji';
import './Parcours.css';

/**
 * Le parcours, raconté par le personnage lui-même.
 *
 * Une liste d'étapes se lit comme un CV : on la parcourt des yeux et
 * on n'en retient rien. Ici une seule étape est présente à la fois,
 * et le personnage la raconte. On avance quand on veut, par la
 * chronologie, les flèches du clavier ou le défilement.
 *
 * L'étape courante est un état, pas une position de défilement : elle
 * ne bouge donc pas tant que le lecteur n'a pas décidé d'avancer, et
 * il peut revenir en arrière, ce qu'un parcours lié au défilement
 * interdit.
 */
export default function Parcours() {
  const section = useRef(null);
  const [etape, setEtape] = useState(0);
  const [sens, setSens] = useState(1);

  const aller = useCallback((vers) => {
    setEtape((actuel) => {
      const borne = Math.max(0, Math.min(parcours.length - 1, vers));
      if (borne !== actuel) setSens(borne > actuel ? 1 : -1);
      return borne;
    });
  }, []);

  /* Les flèches parcourent la chronologie quand la section est lue. */
  useEffect(() => {
    const auClavier = (e) => {
      const cadre = section.current;
      if (!cadre) return;
      const boite = cadre.getBoundingClientRect();
      const visible = boite.top < window.innerHeight * 0.6 && boite.bottom > 0;
      if (!visible) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        aller(etape + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        aller(etape - 1);
      }
    };
    window.addEventListener('keydown', auClavier);
    return () => window.removeEventListener('keydown', auClavier);
  }, [etape, aller]);

  const e = parcours[etape];
  const avancement = parcours.length > 1
    ? etape / (parcours.length - 1)
    : 0;

  return (
    <section
      className="section section--creux parcours-section"
      id="parcours"
      ref={section}
    >
      <div className="contenu">
        <p className="surtitre">Parcours</p>
        <h2 className="titre-section">Laissez-moi vous raconter</h2>

        <div className="recit">

          {/* Le conteur, et ce qu'il dit. */}
          <div className="recit__scene">
            <div className="recit__personnage">
              <Bitmoji avancement={avancement} etape={etape} sens={sens} />
            </div>

            <div className="recit__bulle-zone">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={etape}
                  className="recit__bulle"
                  initial={{ opacity: 0, y: sens * 22, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: sens * -18, scale: 0.98 }}
                  transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="recit__quand">{e.periode}</p>
                  <h3 className="recit__titre">{e.titre}</h3>
                  <p className="recit__lieu">{e.lieu}</p>
                  <p className="recit__texte">{e.texte}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* La chronologie, qui sert aussi de commande. */}
          <div
            className="fil"
            role="tablist"
            aria-label="Étapes du parcours"
          >
            <div className="fil__rail" aria-hidden="true">
              <motion.div
                className="fil__parcouru"
                animate={{ scaleX: avancement }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {parcours.map((p, i) => (
              <button
                key={`${p.titre}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === etape}
                className={`fil__jalon ${i === etape ? 'fil__jalon--ici' : ''} ${
                  i < etape ? 'fil__jalon--passe' : ''
                }`}
                onClick={() => aller(i)}
              >
                <span className="fil__point" aria-hidden="true" />
                <span className="fil__annee">{p.annee}</span>
                <span className="invisible">{p.titre}</span>
              </button>
            ))}
          </div>

          <div className="recit__commandes">
            <button
              type="button"
              className="bouton"
              onClick={() => aller(etape - 1)}
              disabled={etape === 0}
            >
              Précédent
            </button>
            <p className="recit__compte">
              <span>{etape + 1}</span> sur {parcours.length}
            </p>
            <button
              type="button"
              className="bouton bouton--plein"
              onClick={() => aller(etape + 1)}
              disabled={etape === parcours.length - 1}
            >
              Suivant
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
