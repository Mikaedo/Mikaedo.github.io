import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import './Barre.css';

/**
 * La barre du haut : le nom, les ancres, la bascule de thème.
 *
 * Elle prend un fond opaque dès que la page défile, sinon le texte des
 * sections passe derrière elle et devient illisible.
 */
export default function Barre() {
  const [defile, setDefile] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const { sombre, basculer } = useTheme();
  const emplacement = useLocation();

  useEffect(() => {
    const surDefilement = () => setDefile(window.scrollY > 12);
    surDefilement();
    window.addEventListener('scroll', surDefilement, { passive: true });
    return () => window.removeEventListener('scroll', surDefilement);
  }, []);

  /* Le menu du téléphone se referme quand on change de page. */
  useEffect(() => { setOuvert(false); }, [emplacement]);

  const surAccueil = emplacement.pathname === '/';

  /* Depuis une page de projet, les ancres renvoient à l'accueil. */
  const ancre = (id) => (surAccueil ? `#${id}` : `/#${id}`);

  const liens = [
    { id: 'projets',    texte: 'Projets' },
    { id: 'competences', texte: 'Savoir-faire' },
    { id: 'parcours',   texte: 'Parcours' },
    { id: 'contact',    texte: 'Contact' }
  ];

  return (
    <header className={`barre ${defile ? 'barre--posee' : ''}`}>
      <div className="barre__contenu">
        <Link to="/" className="barre__sceau">
          <span className="barre__initiale">N</span>
          <span className="barre__nom">N'Guessan Diby</span>
        </Link>

        <nav className={`barre__nav ${ouvert ? 'barre__nav--ouvert' : ''}`}>
          {liens.map((l) => (
            <a key={l.id} href={ancre(l.id)} className="barre__lien">
              {l.texte}
            </a>
          ))}
        </nav>

        <div className="barre__outils">
          <motion.button
            type="button"
            className="barre__bouton"
            onClick={basculer}
            aria-label={sombre ? 'Passer au thème clair' : 'Passer au thème sombre'}
            whileTap={{ scale: 0.92 }}
          >
            {sombre ? '☀' : '☾'}
          </motion.button>

          <button
            type="button"
            className="barre__hamburger"
            onClick={() => setOuvert((o) => !o)}
            aria-expanded={ouvert}
            aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
