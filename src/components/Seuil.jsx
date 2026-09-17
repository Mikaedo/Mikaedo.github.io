import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Seuil.css';

/**
 * Le passage d'une section à la suivante.
 *
 * Un simple trait sépare deux blocs sans rien dire du passage. Ici le
 * seuil se dessine à mesure qu'on l'atteint : le trait s'ouvre depuis
 * le centre, et le fond bascule vers la teinte de la section suivante.
 *
 * Le mouvement est lié à la position du seuil dans la fenêtre plutôt
 * qu'à un déclenchement unique : il se fait donc dans les deux sens,
 * et suit la main du lecteur au lieu de se jouer une fois pour toutes.
 *
 * @param {'creux'|'plein'} vers  la teinte de la section qui suit
 */
export default function Seuil({ vers = 'creux' }) {
  const ancre = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ancre,
    /* Du moment où le seuil entre par le bas à celui où il atteint le
       tiers haut : l'animation se joue pendant qu'on le regarde. */
    offset: ['start end', 'start 0.35']
  });

  const largeur = useTransform(scrollYProgress, [0, 1], ['8%', '100%']);
  const opacite = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0.5, 1]);
  const monte = useTransform(scrollYProgress, [0, 1], [14, 0]);

  return (
    <div className={`seuil seuil--${vers}`} ref={ancre} aria-hidden="true">
      <motion.span
        className="seuil__trait"
        style={{ width: largeur, opacity: opacite, y: monte }}
      />
      <motion.span className="seuil__pastille" style={{ opacity: opacite }} />
    </div>
  );
}
