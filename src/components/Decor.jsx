import { useEffect, useRef } from 'react';
import './Decor.css';

/**
 * Le décor d'une section, dessiné derrière son contenu.
 *
 * Chaque section a son lieu : une salle machine pour les projets, une
 * trame de constellation pour le savoir-faire, une bibliothèque en
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
 * @param {'machine'|'trame'|'biblio'} genre  le décor à peindre
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
      d.globalAlpha = 0.3;

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
      d.globalAlpha = 0.4;
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
          d.globalAlpha = j === 2 ? 0.75 : 0.42;
          d.fillRect(x - large / 2 + 5, y - haut + 7 + j * 9, large - 10, 2);
        }
        d.globalAlpha = 0.4;
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
          d.globalAlpha = (1 - dist / portee) * 0.38;
          d.strokeStyle = trait;
          d.beginPath();
          d.moveTo(a.x, a.y);
          d.lineTo(b.x, b.y);
          d.stroke();
        }
      }

      for (let i = 0; i < sommets.length; i += 1) {
        const s = sommets[i];
        d.globalAlpha = i % 6 === 0 ? 0.8 : 0.5;
        d.fillStyle = i % 6 === 0 ? accent : trait;
        d.beginPath();
        d.arc(s.x, s.y, i % 6 === 0 ? 2.4 : 1.5, 0, Math.PI * 2);
        d.fill();
      }
      d.globalAlpha = 1;
    }

    /* --- La bibliothèque : le lieu du récit ----------------------- */
    /* Les rayonnages sont peints en volume : chaque tranche a une
       face avant et une joue de côté, dont la largeur dépend de la
       distance au point de fuite. C'est cette joue qui donne
       l'épaisseur ; sans elle on ne verrait que des barres. */
    function biblio() {
      const trait = lire('--trait-fort', '#C9B8A6');
      const encre = lire('--encre-tenue', '#8A7563');
      const accent = lire('--accent', '#A6703F');
      d.clearRect(0, 0, l, h);

      /* Le point de fuite est à gauche, là où se tient le personnage :
         les rayonnages convergent derrière lui. Il est placé à
         mi-hauteur des meubles, pour que les joues des plus hauts
         descendent et celles des plus bas remontent, comme dans une
         vraie salle vue à hauteur d'homme. */
      const fx = l * 0.2;
      const fy = h * 0.4;

      /* Une graine fixe : le rangement des livres doit être le même
         d'un rendu à l'autre, sinon il change à chaque
         redimensionnement. */
      let graine = 7;
      const hasard = () => {
        graine = (graine * 1103515245 + 12345) % 2147483648;
        return graine / 2147483648;
      };

      /* Un meuble, dessiné en perspective à un point de fuite. */
      const meuble = (x0, large, haut, bas, profond, teinte) => {
        /* Les arêtes fuient vers le point de fuite : plus un point
           est loin de lui, plus sa joue est large. */
        const vers = (x, y, t) => [x + (fx - x) * t, y + (fy - y) * t];

        const x1 = x0 + large;
        /* Seule l'arête droite fuit : c'est la joue qu'on voit, les
           meubles étant tous à droite du point de fuite. */
        const [bx, by] = vers(x1, haut, profond);
        const [cx, cy] = vers(x1, bas, profond);

        /* La joue, plus sombre : c'est elle qui creuse le meuble. */
        d.globalAlpha = 0.14;
        d.fillStyle = teinte;
        d.beginPath();
        d.moveTo(x1, haut);
        d.lineTo(bx, by);
        d.lineTo(cx, cy);
        d.lineTo(x1, bas);
        d.closePath();
        d.fill();

        /* La face avant, en creux. */
        d.globalAlpha = 0.07;
        d.fillRect(x0, haut, large, bas - haut);

        /* Les montants. */
        d.globalAlpha = 0.34;
        d.strokeStyle = teinte;
        d.lineWidth = 1.2;
        d.strokeRect(x0, haut, large, bas - haut);
        d.beginPath();
        d.moveTo(x1, haut); d.lineTo(bx, by);
        d.moveTo(x1, bas); d.lineTo(cx, cy);
        d.moveTo(bx, by); d.lineTo(cx, cy);
        d.stroke();

        /* Les étagères, et les livres posés dessus. La boucle va
           jusqu'au dernier compartiment inclus : s'arrêter avant
           laissait le bas du meuble vide, ce qui se voyait comme un
           trou. */
        const etages = 5;
        for (let e = 1; e <= etages; e += 1) {
          const y = haut + ((bas - haut) * e) / etages;
          const [ex, ey] = vers(x1, y, profond);

          /* La tablette du bas est déjà tracée par le cadre. */
          if (e < etages) {
            d.globalAlpha = 0.3;
            d.beginPath();
            d.moveTo(x0, y);
            d.lineTo(x1, y);
            d.lineTo(ex, ey);
            d.stroke();
          }

          /* Une rangée de livres : des tranches de largeurs et de
             hauteurs inégales, sinon la rangée fait grille. */
          let px = x0 + 3;
          const plafond = haut + ((bas - haut) * (e - 1)) / etages;
          while (px < x1 - 5) {
            const ep = 3 + hasard() * 7;
            if (px + ep > x1 - 3) break;
            const creux = (y - plafond) * (0.45 + hasard() * 0.42);
            const marque = hasard() > 0.86;

            d.globalAlpha = marque ? 0.4 : 0.12 + hasard() * 0.16;
            d.fillStyle = marque ? accent : teinte;
            d.fillRect(px, y - creux, ep, creux);

            px += ep + 0.8;
          }
        }
        d.globalAlpha = 1;
      };

      /* Trois meubles, du plus proche au plus lointain : les plus
         éloignés sont plus petits, plus hauts sur l'image et plus
         pâles. Ils s'arrêtent au-dessus de la chronologie, qui
         occupe le bas de la section. */
      d.globalAlpha = 1;
      meuble(l * 0.34, l * 0.2, h * 0.06, h * 0.68, 0.3, encre);
      meuble(l * 0.57, l * 0.17, h * 0.12, h * 0.63, 0.26, trait);
      meuble(l * 0.76, l * 0.15, h * 0.17, h * 0.58, 0.22, trait);

      /* Le sol, qui rattache les meubles au personnage. */
      d.globalAlpha = 0.16;
      d.strokeStyle = trait;
      d.lineWidth = 1;
      for (let i = 0; i <= 14; i += 1) {
        d.beginPath();
        d.moveTo(fx, fy);
        d.lineTo(l * (i / 14) * 1.6 - l * 0.3, h);
        d.stroke();
      }

      /* Une retombée de lumière sur la place du personnage : c'est
         elle qui fait du décor une scène et non un plan. */
      const halo = d.createRadialGradient(
        l * 0.17, 0, 0, l * 0.17, 0, h * 1.05
      );
      halo.addColorStop(0, accent);
      halo.addColorStop(1, 'transparent');
      d.globalAlpha = 0.13;
      d.fillStyle = halo;
      d.fillRect(0, 0, l, h);
      d.globalAlpha = 1;
    }

    const peindre = { machine, trame, biblio }[genre] || trame;

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
