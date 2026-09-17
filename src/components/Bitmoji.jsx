import { useEffect, useRef } from 'react';
import corps from '../assets/images/bitmoji-corps.webp';
import tete from '../assets/images/bitmoji-tete.webp';
import './Bitmoji.css';

/**
 * Le personnage qui accompagne le parcours.
 *
 * Il est découpé en deux : le buste et la tête. La tête bouge seule,
 * elle suit la lecture et s'incline à mesure qu'on descend dans la
 * chronologie ; le buste respire. Un personnage d'un seul tenant ne
 * pourrait que glisser en bloc, ce qui paraît mécanique.
 *
 * Le mouvement se calcule dans une boucle d'animation plutôt que par
 * des transitions CSS : il doit répondre au défilement sans retard, et
 * une transition sur chaque image de défilement saccaderait.
 *
 * @param {number} avancement  0 en haut du parcours, 1 en bas
 */
export default function Bitmoji({ avancement = 0 }) {
  const support = useRef(null);
  const refTete = useRef(null);
  const refCorps = useRef(null);
  const vivant = useRef({ avancement: 0, lisse: 0 });

  useEffect(() => {
    vivant.current.avancement = avancement;
  }, [avancement]);

  useEffect(() => {
    const sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sobre) return undefined;

    let image;
    let temps = 0;

    function animer() {
      image = requestAnimationFrame(animer);
      temps += 0.016;

      const etat = vivant.current;
      /* L'avancement arrive par à-coups au défilement : on le lisse
         pour que le personnage suive d'un mouvement continu. */
      etat.lisse += (etat.avancement - etat.lisse) * 0.08;
      const a = etat.lisse;

      /* Le buste respire : une dilatation lente, à peine perceptible,
         qui suffit à ne plus le voir comme une image fixe. */
      const souffle = Math.sin(temps * 0.9) * 0.006;
      if (refCorps.current) {
        refCorps.current.style.transform =
          `translateY(${Math.sin(temps * 0.9) * 2}px) ` +
          `scaleY(${1 + souffle}) scaleX(${1 - souffle * 0.5})`;
      }

      if (refTete.current) {
        /* La tête suit la lecture : elle se tourne vers le bas du
           parcours et s'incline, comme quelqu'un qui lit une liste. */
        const rotation = -3 + a * 7 + Math.sin(temps * 0.55) * 1.8;
        const penche = a * 5;
        const monte = Math.sin(temps * 0.9) * 2.4 - a * 1.5;

        refTete.current.style.transform =
          `translateY(${monte}px) rotate(${rotation}deg) ` +
          `perspective(300px) rotateY(${penche}deg)`;
      }
    }
    animer();
    return () => cancelAnimationFrame(image);
  }, []);

  return (
    <div className="bitmoji" ref={support}>
      {/* Le cadre porte le rapport du buste ; la place de la tête est
          réservée au-dessus par le retrait du parent. */}
      <div className="bitmoji__cadre">
        <img
          className="bitmoji__corps"
          ref={refCorps}
          src={corps}
          alt=""
          aria-hidden="true"
        />
        <img
          className="bitmoji__tete"
          ref={refTete}
          src={tete}
          alt="N'Guessan Diby Konanbouo Georges"
        />
      </div>
    </div>
  );
}
