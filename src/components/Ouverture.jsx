import { motion } from 'framer-motion';
import { profil } from '../data/profil';
import Frappe from './Frappe';
import './Ouverture.css';

/**
 * Le haut de la page : le portrait, le nom, ce que je fais.
 *
 * L'apparition part d'un décalage léger et non de l'invisible : la
 * page doit être lisible dès la première image, y compris sur une
 * capture ou pour qui arrive avec les animations coupées.
 */
export default function Ouverture() {
  const monte = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <section className="ouverture" id="haut">
      <div className="contenu ouverture__grille">

        <div className="ouverture__propos">
          <motion.p
            className="surtitre"
            {...monte}
            transition={{ duration: 0.5 }}
          >
            {profil.ville}
          </motion.p>

          <motion.h1
            className="ouverture__nom"
            {...monte}
            transition={{ duration: 0.55, delay: 0.06 }}
          >
            {profil.prenom}
            <br />
            {/* Le nom d'usage seul : les prénoms au complet tiennent
                sur trois lignes et noient la lecture. */}
            Konanbouo Georges
          </motion.h1>

          <motion.p
            className="ouverture__metier"
            {...monte}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            {profil.metier} <span>·</span> {profil.specialite}
          </motion.p>

          <motion.p
            className="ouverture__rotation"
            {...monte}
            transition={{ duration: 0.55, delay: 0.18 }}
          >
            Je travaille sur des <Frappe phrases={profil.rotations} />
          </motion.p>

          <motion.p
            className="ouverture__texte"
            {...monte}
            transition={{ duration: 0.55, delay: 0.24 }}
          >
            {profil.presentation}
          </motion.p>

          <motion.div
            className="ouverture__actions"
            {...monte}
            transition={{ duration: 0.55, delay: 0.3 }}
          >
            <a className="bouton bouton--plein" href="#projets">
              Voir les projets
            </a>
            <a className="bouton" href={profil.github}
               target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="bouton" href="#contact">
              Me contacter
            </a>
          </motion.div>
        </div>

        <motion.div
          className="ouverture__portrait"
          initial={{ opacity: 0.001, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="portrait">
            <img
              src={profil.portrait}
              alt={`${profil.prenom} ${profil.nom}`}
              width="900"
              height="1200"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
