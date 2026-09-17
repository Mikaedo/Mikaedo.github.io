import { useEffect, useRef } from 'react';
import './Decor.css';

/**
 * Le décor d'une section, dessiné derrière son contenu.
 *
 * Chaque section a son lieu : une salle machine pour les projets, une
 * trame de constellation pour le savoir-faire, une pièce en
 * perspective pour le parcours. Le décor situe ce qu'on lit au lieu
 * de le poser sur un fond uni.
 *
 * Tout est peint sur une toile plutôt qu'assemblé en éléments : une
 * centaine de traits en HTML alourdirait la page pour un rendu qui ne
 * réagit à rien. La toile se redessine seulement quand la taille
 * change, sauf pour la dérive lente de la trame.
 *
 * Le décor ne porte aucune information : il est masqué aux lecteurs
 * d'écran, et la section reste entière sans lui.
 *
 * @param {'machine'|'trame'|'piece'} genre  le décor à peindre
 */
export default function Decor({ genre = 'trame' }) {
  const toile = useRef(null);

  useEffect(() => {
    const c = toile.current;
    if (!c) return undefined;
    const d = c.getContext('2d');
    if (!d) return undefined;

    const sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Les couleurs viennent des jetons du thème : le décor suit donc
       le mode clair comme le mode sombre, sans être redéfini ici. */
    const lire = (nom, repli) => {
      const v = getComputedStyle(c).getPropertyValue(nom).trim();
      return v || repli;
    };

    let l = 0;
    let h = 0;
    let image;

    const mesurer = () => {
      const r = c.getBoundingClientRect();
      const p = Math.min(window.devicePixelRatio || 1, 2);
      l = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      c.width = l * p;
      c.height = h * p;
      d.setTransform(p, 0, 0, p, 0, 0);
    };

    /* --- La salle machine : des baies et des liaisons ------------- */
    function machine() {
      const trait = lire('--trait-fort', '#C9B8A6');
      const accent = lire('--accent', '#A6703F');

      d.clearRect(0, 0, l, h);
      d.lineWidth = 1;

      /* Une grille en perspective, qui fuit vers un point haut :
         elle donne le sol de la salle sans rien dessiner d'explicite. */
      const fuiteX = l * 0.5;
      const fuiteY = h * 0.18;
      d.strokeStyle = trait;
      d.globalAlpha = 0.16;

      for (let i = -8; i <= 8; i += 1) {
        d.beginPath();
        d.moveTo(fuiteX, fuiteY);
        d.lineTo(fuiteX + i * l * 0.16, h);
        d.stroke();
      }
      /* Les traverses se resserrent vers le fond : c'est ce
         resserrement qui fait lire la profondeur. */
      for (let i = 1; i <= 11; i += 1) {
        const t = (i / 11) ** 2.1;
        const y = fuiteY + (h - fuiteY) * t;
        d.beginPath();
        d.moveTo(0, y);
        d.lineTo(l, y);
        d.stroke();
      }

      /* Quelques baies, posées sur la grille. */
      d.globalAlpha = 0.22;
      const baies = 7;
      for (let i = 0; i < baies; i += 1) {
        const t = 0.22 + (i / baies) * 0.72;
        const y = fuiteY + (h - fuiteY) * t ** 2.1;
        const large = 26 + t * 70;
        const haut = 34 + t * 96;
        const x = fuiteX + (i % 2 ? 1 : -1) * (0.1 + t * 0.44) * l;

        d.strokeStyle = trait;
        d.strokeRect(x - large / 2, y - haut, large, haut);

        /* Les diodes : trois par baie, la dernière à l'accent. */
        for (let j = 0; j < 3; j += 1) {
          d.fillStyle = j === 2 ? accent : trait;
          d.globalAlpha = j === 2 ? 0.5 : 0.24;
          d.fillRect(x - large / 2 + 5, y - haut + 7 + j * 9, large - 10, 2);
        }
        d.globalAlpha = 0.22;
      }
      d.globalAlpha = 1;
    }

    /* --- La trame : un réseau de points reliés -------------------- */
    /* Les sommets dérivent lentement ; les liaisons se refont à
       chaque image, ce qui suffit à animer sans rien stocker. */
    const sommets = [];
    function semer() {
      sommets.length = 0;
      const nb = Math.round(Math.min(46, (l * h) / 26000));
      for (let i = 0; i < nb; i += 1) {
        sommets.push({
          x: Math.random() * l,
          y: Math.random() * h,
          dx: (Math.random() - 0.5) * 0.14,
          dy: (Math.random() - 0.5) * 0.14
        });
      }
    }

    function trame() {
      const trait = lire('--trait-fort', '#C9B8A6');
      const accent = lire('--accent', '#A6703F');
      d.clearRect(0, 0, l, h);

      if (!sobre) {
        for (const s of sommets) {
          s.x += s.dx;
          s.y += s.dy;
          if (s.x < 0 || s.x > l) s.dx *= -1;
          if (s.y < 0 || s.y > h) s.dy *= -1;
        }
      }

      /* Une liaison n'apparaît qu'entre points proches, et pâlit avec
         la distance : le réseau se dessine tout seul. */
      const portee = Math.min(l, h) * 0.26;
      d.lineWidth = 1;
      for (let i = 0; i < sommets.length; i += 1) {
        for (let j = i + 1; j < sommets.length; j += 1) {
          const a = sommets[i];
          const b = sommets[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > portee) continue;
          d.globalAlpha = (1 - dist / portee) * 0.2;
          d.strokeStyle = trait;
          d.beginPath();
          d.moveTo(a.x, a.y);
          d.lineTo(b.x, b.y);
          d.stroke();
        }
      }

      for (let i = 0; i < sommets.length; i += 1) {
        const s = sommets[i];
        d.globalAlpha = i % 6 === 0 ? 0.55 : 0.3;
        d.fillStyle = i % 6 === 0 ? accent : trait;
        d.beginPath();
        d.arc(s.x, s.y, i % 6 === 0 ? 2.4 : 1.5, 0, Math.PI * 2);
        d.fill();
      }
      d.globalAlpha = 1;
    }

    /* --- La pièce : un lieu où se tenir --------------------------- */
    function piece() {
      const trait = lire('--trait-fort', '#C9B8A6');
      const accent = lire('--accent', '#A6703F');
      d.clearRect(0, 0, l, h);
      d.lineWidth = 1;

      /* Le point de fuite est décalé vers la gauche, là où se tient
         le personnage : les lignes du sol convergent derrière lui. */
      const fx = l * 0.19;
      const fy = h * 0.42;
      const sol = h * 0.78;

      d.strokeStyle = trait;

      /* La ligne d'horizon, et le sol qui s'en éloigne. */
      d.globalAlpha = 0.2;
      d.beginPath();
      d.moveTo(0, sol);
      d.lineTo(l, sol);
      d.stroke();

      d.globalAlpha = 0.13;
      for (let i = -10; i <= 22; i += 1) {
        d.beginPath();
        d.moveTo(fx, fy);
        d.lineTo(fx + i * l * 0.1, h);
        d.stroke();
      }

      /* Le mur du fond : de grands panneaux, comme des fenêtres. */
      d.globalAlpha = 0.17;
      for (let i = 0; i < 5; i += 1) {
        const x = l * (0.36 + i * 0.13);
        d.strokeRect(x, h * 0.16, l * 0.09, h * 0.42);
      }

      /* Une retombée de lumière au-dessus du personnage : c'est elle
         qui fait du décor une scène et non un quadrillage. */
      const halo = d.createRadialGradient(
        fx, h * 0.1, 0, fx, h * 0.1, h * 0.85
      );
      halo.addColorStop(0, accent);
      halo.addColorStop(1, 'transparent');
      d.globalAlpha = 0.1;
      d.fillStyle = halo;
      d.fillRect(0, 0, l, h);
      d.globalAlpha = 1;
    }

    const peindre = { machine, trame, piece }[genre] || trame;

    /* Seule la trame dérive : les deux autres décors sont fixes, et
       les redessiner à chaque image coûterait sans rien changer. */
    const animer = () => {
      image = requestAnimationFrame(animer);
      trame();
    };

    const redimensionner = () => {
      mesurer();
      if (genre === 'trame') semer();
      peindre();
    };

    redimensionner();
    window.addEventListener('resize', redimensionner);

    if (genre === 'trame' && !sobre) animer();

    return () => {
      if (image) cancelAnimationFrame(image);
      window.removeEventListener('resize', redimensionner);
    };
  }, [genre]);

  return (
    <canvas
      className={`decor decor--${genre}`}
      ref={toile}
      aria-hidden="true"
    />
  );
}
