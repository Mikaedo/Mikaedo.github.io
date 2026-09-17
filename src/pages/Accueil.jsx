import { motion } from 'framer-motion';
import Ouverture from '../components/Ouverture';
import CarteProjet from '../components/CarteProjet';
import Competences from '../components/Competences';
import Parcours from '../components/Parcours';
import Contact from '../components/Contact';
import Seuil from '../components/Seuil';
import { projets } from '../data/projets';
import './Accueil.css';

/**
 * La page d'accueil : tout le portfolio, section après section.
 *
 * Un seuil animé marque chaque passage, et les sections alternent
 * entre les deux fonds. La page se lit alors comme une suite de
 * moments et non comme des blocs empilés derrière un trait.
 */
export default function Accueil() {
  return (
    <>
      <Ouverture />

      <Seuil vers="creux" />

      <section className="section section--creux" id="projets">
        <div className="contenu">
          <motion.div
            initial={{ opacity: 0.001, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05, margin: '200px 0px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="surtitre">Projets</p>
            <h2 className="titre-section">Ce que j'ai construit</h2>
            <p className="chapeau">
              Trois systèmes complets, du téléphone de l'agent jusqu'à la base
              de données. Chaque fiche s'ouvre sur le détail.
            </p>
          </motion.div>

          <div className="grille-projets">
            {projets.map((p, i) => (
              <CarteProjet key={p.id} projet={p} rang={i} />
            ))}
          </div>
        </div>
      </section>

      <Seuil vers="plein" />
      <Competences />

      <Seuil vers="creux" />
      <Parcours />

      <Seuil vers="plein" />
      <Contact />
    </>
  );
}
