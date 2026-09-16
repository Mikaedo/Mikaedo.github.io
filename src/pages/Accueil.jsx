import { motion } from 'framer-motion';
import Ouverture from '../components/Ouverture';
import CarteProjet from '../components/CarteProjet';
import Methode from '../components/Methode';
import Competences from '../components/Competences';
import Parcours from '../components/Parcours';
import Contact from '../components/Contact';
import { projets } from '../data/projets';
import './Accueil.css';

/** La page d'accueil : tout le portfolio, section après section. */
export default function Accueil() {
  return (
    <>
      <Ouverture />

      <section className="section" id="projets">
        <div className="contenu">
          <p className="surtitre">Projets</p>
          <h2 className="titre-section">Ce que j'ai construit</h2>
          <p className="chapeau">
            Trois systèmes complets, du téléphone de l'agent jusqu'à la base
            de données. Chaque fiche s'ouvre sur le détail : le problème posé,
            la réponse apportée, et ce qu'elle ne résout pas.
          </p>

          <div className="grille-projets">
            {projets.map((p, i) => (
              <CarteProjet key={p.id} projet={p} rang={i} />
            ))}
          </div>
        </div>
      </section>

      <Methode />
      <Competences />
      <Parcours />
      <Contact />
    </>
  );
}
