import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Galerie.css';

/**
 * Les captures d'un projet, et la visionneuse qui s'ouvre au clic.
 *
 * La visionneuse se ferme à l'échappement et au clic sur le fond ; les
 * flèches du clavier passent d'une image à l'autre. Le défilement de
 * la page est bloqué tant qu'elle est ouverte, sinon la page glisse
 * derrière l'image.
 */
export default function Galerie({ ecrans, note }) {
  const [ouvert, setOuvert] = useState(null);

  const fermer = useCallback(() => setOuvert(null), []);

  const aller = useCallback((pas) => {
    setOuvert((i) => {
      if (i === null) return null;
      return (i + pas + ecrans.length) % ecrans.length;
    });
  }, [ecrans.length]);

  useEffect(() => {
    if (ouvert === null) return undefined;

    const auClavier = (e) => {
      if (e.key === 'Escape') fermer();
      if (e.key === 'ArrowRight') aller(1);
      if (e.key === 'ArrowLeft') aller(-1);
    };

    /* La page ne doit pas défiler derrière la visionneuse. */
    const avant = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', auClavier);

    return () => {
      document.body.style.overflow = avant;
      window.removeEventListener('keydown', auClavier);
    };
  }, [ouvert, fermer, aller]);

  if (!ecrans?.length) return null;

  const courant = ouvert !== null ? ecrans[ouvert] : null;

  return (
    <>
      <div className="galerie">
        {ecrans.map((e, i) => (
          /* Les vignettes arrivent inclinées dans l'espace et se
             redressent : elles se présentent comme des écrans posés
             devant le lecteur, non comme des images dans une grille.
             L'inclinaison alterne d'un côté à l'autre, sinon la
             rangée entière penche du même bord. */
          <motion.button
            key={i}
            type="button"
            className={`galerie__vignette ${e.mobile ? 'galerie__vignette--mobile' : ''}`}
            onClick={() => setOuvert(i)}
            initial={{
              opacity: 0.001,
              y: 34,
              rotateX: 16,
              rotateY: i % 2 ? -13 : 13,
              scale: 0.93
            }}
            whileInView={{
              opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1
            }}
            whileHover={{ scale: 1.035, rotateX: -3 }}
            viewport={{ once: true, amount: 0.05, margin: '200px 0px' }}
            transition={{
              duration: 0.62,
              delay: Math.min(i, 6) * 0.07,
              ease: [0.22, 1, 0.36, 1]
            }}
            aria-label={`Agrandir : ${e.legende}`}
          >
            <img src={e.image} alt={e.legende} loading="lazy" />
            <span className="galerie__loupe" aria-hidden="true">
              <svg viewBox="0 0 20 20">
                <circle cx="8.5" cy="8.5" r="5.5" fill="none"
                        stroke="currentColor" strokeWidth="1.8" />
                <path d="M12.8 12.8L17 17" stroke="currentColor"
                      strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </motion.button>
        ))}
      </div>

      {note && <p className="galerie__note">{note}</p>}

      <AnimatePresence>
        {courant && (
          <motion.div
            className="visionneuse"
            initial={{ opacity: 0.001 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={fermer}
            role="dialog"
            aria-modal="true"
            aria-label={courant.legende}
          >
            <button
              type="button"
              className="visionneuse__fermer"
              onClick={fermer}
              aria-label="Fermer"
            >
              ×
            </button>

            {ecrans.length > 1 && (
              <>
                <button
                  type="button"
                  className="visionneuse__fleche visionneuse__fleche--gauche"
                  onClick={(e) => { e.stopPropagation(); aller(-1); }}
                  aria-label="Image précédente"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="visionneuse__fleche visionneuse__fleche--droite"
                  onClick={(e) => { e.stopPropagation(); aller(1); }}
                  aria-label="Image suivante"
                >
                  ›
                </button>
              </>
            )}

            <motion.figure
              className="visionneuse__cadre"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.22 }}
              key={ouvert}
            >
              <img src={courant.image} alt={courant.legende} />
              <figcaption>
                <span className="visionneuse__compte">
                  {ouvert + 1} / {ecrans.length}
                </span>
                {courant.legende}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
