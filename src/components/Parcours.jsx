import { motion } from 'framer-motion';
import { parcours } from '../data/profil';
import './Parcours.css';

/**
 * Le parcours, du plus récent au plus ancien.
 *
 * L'ordre porte du sens ici, contrairement à une liste de compétences :
 * on lit une progression, d'où le fil vertical qui relie les étapes.
 */
export default function Parcours() {
  return (
    <section className="section" id="parcours">
      <div className="contenu">
        <p className="surtitre">Parcours</p>
        <h2 className="titre-section">D'où je viens</h2>

        <div className="parcours">
          {parcours.map((etape, i) => (
            <motion.article
              key={etape.titre}
              className="etape"
              initial={{ opacity: 0.001, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.05, margin: '200px 0px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <div className="etape__quand">
                <span className="etape__point" aria-hidden="true" />
                {etape.periode}
              </div>

              <div className="etape__corps">
                <h3 className="etape__titre">
                  {etape.titre}
                  {etape.distinction && (
                    <span className="etape__mention">{etape.distinction}</span>
                  )}
                </h3>
                <p className="etape__lieu">{etape.lieu}</p>
                <p className="etape__texte">{etape.texte}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
