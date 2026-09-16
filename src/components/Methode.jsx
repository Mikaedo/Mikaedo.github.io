import { motion } from 'framer-motion';
import './Methode.css';

/**
 * Le schéma de la contrainte qui traverse mes projets.
 *
 * Ce n'est pas une décoration : c'est la réponse à la question qu'un
 * recruteur se pose en lisant « application hors ligne », à savoir
 * comment les données remontent sans perte ni doublon.
 */
const ETAPES = [
  {
    nom: 'Terrain',
    detail: ['photo + position', 'modèle embarqué'],
    accent: false
  },
  {
    nom: 'File locale',
    detail: ['SQLite', 'rien ne se perd'],
    accent: true
  },
  {
    nom: 'Serveur',
    detail: ['FastAPI, JWT', 'conteneurisé'],
    accent: false
  },
  {
    nom: 'Base',
    detail: ['PostGIS', 'données spatiales'],
    accent: false
  }
];

export default function Methode() {
  return (
    <section className="section" id="methode">
      <div className="contenu">
        <p className="surtitre">Méthode</p>
        <h2 className="titre-section">Concevoir pour un réseau absent</h2>
        <p className="chapeau">
          C'est la contrainte qui revient dans mes trois projets. Le réseau
          n'est pas une donnée acquise : l'application doit rester utilisable
          quand il disparaît, et rattraper son retard toute seule au retour.
        </p>

        <div className="methode">
          <div className="methode__chaine">
            {ETAPES.map((e, i) => (
              <motion.div
                key={e.nom}
                className="methode__bloc-et-lien"
                initial={{ opacity: 0.001, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05, margin: '200px 0px' }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
              >
                <div className={`methode__bloc ${e.accent ? 'methode__bloc--accent' : ''}`}>
                  <h3>{e.nom}</h3>
                  {e.detail.map((d) => <span key={d}>{d}</span>)}
                </div>

                {i < ETAPES.length - 1 && (
                  <div className={`methode__lien ${i === 1 ? 'methode__lien--differe' : ''}`}>
                    {i === 1 && (
                      <span className="methode__quand">au retour du réseau</span>
                    )}
                    <svg viewBox="0 0 48 12" aria-hidden="true">
                      <line x1="0" y1="6" x2="38" y2="6"
                            strokeWidth="1.5"
                            strokeDasharray={i === 1 ? '5 4' : '0'} />
                      <path d="M38 2.5L44 6l-6 3.5" fill="none"
                            strokeWidth="1.5" strokeLinecap="round"
                            strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="methode__notes">
            <p>
              L'agent ne sait pas s'il a du réseau, et il n'a pas à le savoir :
              il saisit, l'application se charge du reste.
            </p>
            <p>
              Chaque saisie porte un identifiant unique, de sorte qu'un envoi
              rejoué ne crée jamais de doublon.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
