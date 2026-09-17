import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Plan.css';

/**
 * Un plan qui bascule dans l'espace au défilement.
 *
 * La section arrive inclinée vers l'arrière, se redresse en montant
 * vers le lecteur, puis repart en s'éloignant. Le mouvement est lié à
 * la position du bloc dans la fenêtre : il suit la main, et se joue
 * dans les deux sens.
 *
 * La perspective vit sur un parent et non sur le bloc lui-même : un
 * « perspective » posé sur l'élément qui tourne s'applique après la
 * rotation, et l'effet de profondeur disparaît.
 *
 * Le contenu reste lisible à tout moment : l'opacité ne descend
 * jamais sous un seuil où le texte deviendrait illisible, et rien ne
 * part de l'invisible, sans quoi une capture ou un lecteur sans
 * JavaScript verrait une page vide.
 */
export default function Plan({ children, force = 1 }) {
  const ancre = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ancre,
    offset: ['start end', 'end start']
  });

  /* Inclinée en arrivant, droite au centre, inclinée en repartant. */
  const bascule = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [9 * force, 0, -6 * force]
  );

  /* Le zoom : le bloc avance vers le lecteur quand il le regarde. */
  const echelle = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.94, 1, 0.97]
  );

  const monte = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [42 * force, 0, -22 * force]
  );

  /* Le voile reste léger : une section encore à l'écran doit rester
     pleinement lisible. Il ne sert qu'à donner de la profondeur aux
     blocs qui entrent et sortent, pas à les effacer. */
  const voile = useTransform(
    scrollYProgress,
    [0, 0.22, 0.8, 1],
    [0.82, 1, 1, 0.92]
  );

  return (
    <div className="plan" ref={ancre}>
      <motion.div
        className="plan__face"
        style={{
          rotateX: bascule,
          scale: echelle,
          y: monte,
          opacity: voile
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
