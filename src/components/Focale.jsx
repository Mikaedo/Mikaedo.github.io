import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Focale.css';

/**
 * Une image qu'on traverse en descendant.
 *
 * L'image est plus grande que son cadre et se recule à mesure qu'on
 * défile : le cadre ne bouge pas, le contenu glisse à l'intérieur, et
 * l'œil lit le mouvement comme une caméra qui avance dans l'image.
 *
 * Le décalage vertical est plus lent que le défilement de la page.
 * Sans lui, l'image suivrait le cadre au pixel près et le zoom seul
 * paraîtrait plaqué.
 *
 * L'échelle ne descend jamais sous 1 : au repos l'image doit remplir
 * son cadre, sinon un liseré de fond apparaîtrait sur les bords.
 *
 * @param {string} src       l'image
 * @param {string} alt       son texte de remplacement
 * @param {number} ampleur   1 pour l'effet normal, moins pour l'atténuer
 */
export default function Focale({ src, alt = '', ampleur = 1, ...reste }) {
  const cadre = useRef(null);

  const { scrollYProgress } = useScroll({
    target: cadre,
    offset: ['start end', 'end start']
  });

  const echelle = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1 + 0.18 * ampleur, 1 + 0.04 * ampleur, 1 + 0.16 * ampleur]
  );

  /* Le glissement reste sous la marge que le zoom dégage, sans quoi
     un bord de l'image quitterait le cadre. */
  const glisse = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-4 * ampleur}%`, `${4 * ampleur}%`]
  );

  return (
    <div className="focale" ref={cadre}>
      <motion.img
        className="focale__image"
        src={src}
        alt={alt}
        style={{ scale: echelle, y: glisse }}
        {...reste}
      />
    </div>
  );
}
