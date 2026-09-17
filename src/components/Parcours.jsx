import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { parcours } from '../data/profil';
import Avatar3D from './Avatar3D';
import './Parcours.css';

/**
 * Le parcours, du plus récent au plus ancien.
 *
 * Le personnage descend le long de la chronologie à mesure qu'on lit :
 * il marque l'étape en cours, et l'année s'affiche à côté de lui. Sa
 * position se calcule sur la part de la section déjà parcourue, ce qui
 * reste juste quelle que soit la hauteur des étapes.
 */
export default function Parcours() {
  const section = useRef(null);
  const [avancement, setAvancement] = useState(0);
  const [etape, setEtape] = useState(0);

  useEffect(() => {
    const sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sobre) return undefined;

    let demande = null;

    const surDefilement = () => {
      if (demande) return;
      demande = requestAnimationFrame(() => {
        demande = null;
        const cadre = section.current;
        if (!cadre) return;

        const boite = cadre.getBoundingClientRect();
        const hauteurVue = window.innerHeight;

        /* Part de la section déjà passée devant le regard : 0 quand
           elle entre par le bas, 1 quand elle sort par le haut. */
        const part = (hauteurVue * 0.55 - boite.top) / boite.height;
        const borne = Math.max(0, Math.min(1, part));
        setAvancement(borne);
        setEtape(Math.min(parcours.length - 1,
                          Math.floor(borne * parcours.length)));
      });
    };

    surDefilement();
    window.addEventListener('scroll', surDefilement, { passive: true });
    window.addEventListener('resize', surDefilement);
    return () => {
      if (demande) cancelAnimationFrame(demande);
      window.removeEventListener('scroll', surDefilement);
      window.removeEventListener('resize', surDefilement);
    };
  }, []);

  const anneeCourante = parcours[etape]?.annee ?? parcours[0].annee;

  return (
    <section className="section parcours-section" id="parcours" ref={section}>
      <div className="contenu">
        <p className="surtitre">Parcours</p>
        <h2 className="titre-section">D'où je viens</h2>
        <p className="chapeau">
          Deux licences menées de front, un stage, des compétitions.
          Le fil descend de la plus récente à la première.
        </p>

        <div className="parcours-grille">

          {/* Le personnage, qui accompagne la lecture. */}
          <div className="parcours__guide">
            <div
              className="parcours__personnage"
              style={{ '--avancement': avancement }}
            >
              <Avatar3D avancement={avancement} />
              <div className="parcours__annee">{anneeCourante}</div>
            </div>
          </div>

          <div className="parcours">
            {parcours.map((e, i) => (
              <motion.article
                key={`${e.titre}-${i}`}
                className={`etape etape--${e.genre} ${i === etape ? 'etape--lue' : ''}`}
                initial={{ opacity: 0.001, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.05, margin: '200px 0px' }}
                transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.06 }}
              >
                <div className="etape__quand">
                  <span className="etape__point" aria-hidden="true" />
                  {e.periode}
                </div>

                <div className="etape__corps">
                  <h3 className="etape__titre">
                    {e.titre}
                    {e.distinction && (
                      <span className="etape__mention">{e.distinction}</span>
                    )}
                  </h3>
                  <p className="etape__lieu">{e.lieu}</p>
                  <p className="etape__texte">{e.texte}</p>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
