import { motion } from 'framer-motion';
import { competences } from '../data/profil';
import Marque from './Marque';
import Technos3D from './Technos3D';
import './Competences.css';

/**
 * Ce que je sais faire, groupé par ce à quoi cela sert et non par
 * mode : un recruteur cherche « sait-il faire du mobile hors ligne »,
 * pas « connaît-il la bibliothèque X ».
 */
export default function Competences() {
  return (
    <section className="section" id="competences">
      <div className="contenu">
        <p className="surtitre">Savoir-faire</p>
        <h2 className="titre-section">Ce que je sais faire</h2>
        <p className="chapeau">
          Chaque ligne a été mise en œuvre sur un projet livré, non
          seulement étudiée.
        </p>

        <Technos3D />

        <div className="competences">
          {competences.map((groupe, i) => (
            <motion.div
              key={groupe.domaine}
              className="competence"
              initial={{ opacity: 0.001, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05, margin: '200px 0px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <h3 className="competence__titre">
                <Marque nom={groupe.icone} />
                {groupe.domaine}
              </h3>
              <ul className="competence__liste">
                {groupe.lignes.map((l) => (
                  <li key={l.quoi}>
                    <span className="competence__quoi">{l.quoi}</span>
                    {l.precision && (
                      <span className="competence__precision">
                        {l.precision}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
