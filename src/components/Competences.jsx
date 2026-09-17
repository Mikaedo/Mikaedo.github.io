import { motion } from 'framer-motion';
import { competences } from '../data/profil';
import Marque from './Marque';
import Outil from './Outil';
import Technos3D from './Technos3D';
import './Competences.css';

/**
 * Ce que je sais faire, groupé par ce à quoi cela sert et non par
 * mode : un recruteur cherche « sait-il faire du mobile hors ligne »,
 * pas « connaît-il la bibliothèque X ».
 *
 * Chaque domaine tient en une phrase et quelques outils, logo
 * compris. Détailler chaque bibliothèque donnait un inventaire de
 * vingt-quatre lignes, où l'essentiel se noyait.
 */
export default function Competences() {
  return (
    <section className="section" id="competences">
      <div className="contenu">
        <p className="surtitre">Savoir-faire</p>
        <h2 className="titre-section">Ce que je sais faire</h2>
        <p className="chapeau">
          Chaque ligne a été mise en œuvre sur un projet livré.
        </p>

        <Technos3D />

        <div className="competences">
          {competences.map((groupe, i) => (
            <motion.div
              key={groupe.domaine}
              className="competence"
              initial={{ opacity: 0.001, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05, margin: '200px 0px' }}
              transition={{
                duration: 0.5,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <h3 className="competence__titre">
                <Marque nom={groupe.icone} />
                {groupe.domaine}
              </h3>

              <p className="competence__resume">{groupe.resume}</p>

              <ul className="competence__outils">
                {groupe.outils.map((o) => (
                  <Outil key={o.nom} nom={o.nom} marque={o.marque} />
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
