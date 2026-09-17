import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './Chiffres.css';

/**
 * Les chiffres qui disent l'essentiel, sans phrase.
 *
 * Chacun est vérifiable : les trois systèmes ont leur page, les huit
 * rôles figurent sur la capture d'administration, les 126 tests sont
 * ceux du mémoire. Un chiffre qu'on ne peut pas montrer n'a rien à
 * faire ici.
 */
const CHIFFRES = [
  {
    valeur: 3,
    suffixe: '',
    quoi: 'systèmes livrés',
    precision: 'du téléphone à la base de données'
  },
  {
    valeur: 8,
    suffixe: '',
    quoi: 'rôles cloisonnés',
    precision: 'chacun avec ses interdits'
  },
  {
    valeur: 126,
    suffixe: '',
    quoi: 'tests passés',
    precision: 'sur 126, pile Docker complète'
  },
  {
    valeur: 16.5,
    suffixe: '',
    quoi: 'de moyenne au mémoire',
    precision: 'mention très bien'
  },
  {
    valeur: 2,
    suffixe: '',
    quoi: 'licences menées de front',
    precision: 'MIAGE et génie logiciel'
  }
];

/** Un compteur qui monte jusqu'à sa valeur quand il entre à l'écran. */
function Compteur({ valeur, suffixe }) {
  const [affiche, setAffiche] = useState(0);
  const cible = useRef(null);
  const lance = useRef(false);

  useEffect(() => {
    const sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sobre || !('IntersectionObserver' in window)) {
      setAffiche(valeur);
      return undefined;
    }

    const vigie = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (!e.isIntersecting || lance.current) return;
        lance.current = true;

        const debut = performance.now();
        const duree = 1100;
        const pas = (t) => {
          const p = Math.min((t - debut) / duree, 1);
          /* Décélération : le chiffre arrive, il ne freine pas sec. */
          const e2 = 1 - Math.pow(1 - p, 3);
          setAffiche(valeur * e2);
          if (p < 1) requestAnimationFrame(pas);
        };
        requestAnimationFrame(pas);
      });
    }, { threshold: 0.2 });

    if (cible.current) vigie.observe(cible.current);
    return () => vigie.disconnect();
  }, [valeur]);

  /* Une décimale seulement quand la valeur en porte une. */
  const entier = Number.isInteger(valeur);
  const texte = entier
    ? Math.round(affiche).toString()
    : affiche.toFixed(1).replace('.', ',');

  return <span ref={cible}>{texte}{suffixe}</span>;
}

export default function Chiffres() {
  return (
    <section className="section chiffres-section" id="chiffres">
      <div className="contenu">
        <p className="surtitre">En bref</p>
        <h2 className="titre-section">Ce que ça représente</h2>
        <p className="chapeau">
          Cinq chiffres, tous vérifiables sur les pages qui suivent.
        </p>

        <div className="chiffres">
          {CHIFFRES.map((c, i) => (
            <motion.div
              key={c.quoi}
              className="chiffre"
              initial={{ opacity: 0.001, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05, margin: '200px 0px' }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <span className="chiffre__valeur">
                <Compteur valeur={c.valeur} suffixe={c.suffixe} />
              </span>
              <span className="chiffre__quoi">{c.quoi}</span>
              <span className="chiffre__precision">{c.precision}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
