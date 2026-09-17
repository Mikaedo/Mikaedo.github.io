import { useEffect, useRef, useState } from 'react';
import corps from '../assets/images/bitmoji-corps.webp';
import tete from '../assets/images/bitmoji-tete.webp';
import './Bitmoji.css';

/**
 * Le personnage qui raconte le parcours.
 *
 * Il est découpé en deux : le buste et la tête. La tête suit le
 * curseur, elle se tourne vers lui comme quelqu'un à qui l'on parle ;
 * le buste respire et accompagne le mouvement d'un léger report de
 * poids. Un personnage d'un seul tenant ne pourrait que glisser en
 * bloc, ce qui paraît mécanique.
 *
 * Le suivi se calcule dans une boucle d'animation plutôt qu'en CSS :
 * il doit répondre au curseur sans retard, et une transition à chaque
 * mouvement de souris saccaderait.
 *
 * Le regard est borné : au-delà d'une amplitude faible le personnage
 * louche au lieu de regarder, parce que la tête est une image plate
 * et non un volume.
 *
 * @param {number} avancement  0 à la première étape, 1 à la dernière
 * @param {number} etape       l'index de l'étape racontée
 * @param {number} sens        1 si l'on avance, -1 si l'on recule
 */
export default function Bitmoji({ avancement = 0, etape = 0, sens = 1 }) {
  const support = useRef(null);
  const refTete = useRef(null);
  const refCorps = useRef(null);
  const [parle, setParle] = useState(false);

  /* Tout ce que la boucle lit vit dans une référence : le réécrire
     dans l'état relancerait un rendu à chaque image. */
  const vivant = useRef({
    viseX: 0, viseY: 0,      /* là où regarde le personnage, en -1..1 */
    x: 0, y: 0,              /* là où il regarde vraiment, lissé */
    salut: 0,                /* l'élan donné au changement d'étape */
    avancement: 0
  });

  useEffect(() => { vivant.current.avancement = avancement; }, [avancement]);

  /* Au changement d'étape, le personnage se redresse et reprend :
     c'est lui qui vient de parler. */
  useEffect(() => {
    vivant.current.salut = sens;
    setParle(true);
    const minuteur = setTimeout(() => setParle(false), 620);
    return () => clearTimeout(minuteur);
  }, [etape, sens]);

  useEffect(() => {
    const sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Le curseur, ramené en coordonnées relatives au personnage. */
    const suivre = (ev) => {
      const cadre = support.current;
      if (!cadre) return;
      const b = cadre.getBoundingClientRect();
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height * 0.22;   /* à hauteur du visage */
      const etat = vivant.current;
      /* Divisé par une distance généreuse : le regard se porte au
         loin, il ne colle pas au curseur. */
      etat.viseX = Math.max(-1, Math.min(1, (ev.clientX - cx) / 420));
      etat.viseY = Math.max(-1, Math.min(1, (ev.clientY - cy) / 380));
    };

    const oublier = () => {
      const etat = vivant.current;
      etat.viseX = 0;
      etat.viseY = 0;
    };

    window.addEventListener('pointermove', suivre, { passive: true });
    window.addEventListener('pointerleave', oublier);

    let image;
    let temps = 0;

    function animer() {
      image = requestAnimationFrame(animer);
      const etat = vivant.current;
      if (!sobre) temps += 0.016;

      /* Le regard rejoint sa cible sans à-coup. */
      etat.x += (etat.viseX - etat.x) * 0.085;
      etat.y += (etat.viseY - etat.y) * 0.085;
      etat.salut *= 0.91;

      const souffle = sobre ? 0 : Math.sin(temps * 0.9) * 0.006;
      const flotte = sobre ? 0 : Math.sin(temps * 0.9) * 2;

      if (refCorps.current) {
        /* Le buste reporte son poids du côté où la tête se tourne :
           sans cela le personnage a le torse figé et la tête mobile,
           ce qui se lit comme une marionnette. */
        refCorps.current.style.transform =
          `translate3d(${etat.x * 4}px, ${flotte}px, 0) ` +
          `rotate(${etat.x * 0.9}deg) ` +
          `scaleY(${1 + souffle}) scaleX(${1 - souffle * 0.5})`;
      }

      if (refTete.current) {
        const balance = sobre ? 0 : Math.sin(temps * 0.55) * 1.1;
        const rotation = etat.x * 7 + balance + etat.salut * 5;
        const penche = etat.x * 14;             /* le volume, en Y */
        const leve = -etat.y * 7;                /* le menton, en X */
        const monte = flotte * 1.2 - etat.salut * 4;

        refTete.current.style.transform =
          `translate3d(${etat.x * 6}px, ${monte}px, 0) ` +
          `rotate(${rotation}deg) ` +
          `perspective(320px) rotateY(${penche}deg) rotateX(${leve}deg)`;
      }
    }
    animer();

    return () => {
      cancelAnimationFrame(image);
      window.removeEventListener('pointermove', suivre);
      window.removeEventListener('pointerleave', oublier);
    };
  }, []);

  return (
    <div
      className={`bitmoji ${parle ? 'bitmoji--parle' : ''}`}
      ref={support}
    >
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
