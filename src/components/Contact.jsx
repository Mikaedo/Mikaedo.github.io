import { useState } from 'react';
import { motion } from 'framer-motion';
import { profil } from '../data/profil';
import './Contact.css';

/**
 * Le formulaire de contact.
 *
 * Il n'y a pas de serveur derrière ce portfolio : le formulaire
 * compose un courriel et ouvre le logiciel de messagerie du visiteur.
 * C'est franc, cela marche partout, et rien ne transite par un tiers.
 *
 * Le courriel reste affiché à côté, pour qui préfère écrire lui-même.
 */
export default function Contact() {
  const [champs, setChamps] = useState({ nom: '', courriel: '', message: '' });
  const [envoye, setEnvoye] = useState(false);
  const [erreurs, setErreurs] = useState({});

  const changer = (e) => {
    const { name, value } = e.target;
    setChamps((c) => ({ ...c, [name]: value }));
    if (erreurs[name]) setErreurs((v) => ({ ...v, [name]: null }));
  };

  const verifier = () => {
    const trouvees = {};
    if (!champs.nom.trim()) {
      trouvees.nom = 'Indiquez votre nom.';
    }
    if (!champs.courriel.trim()) {
      trouvees.courriel = 'Indiquez une adresse pour la réponse.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champs.courriel)) {
      trouvees.courriel = "Cette adresse ne semble pas valide.";
    }
    if (!champs.message.trim()) {
      trouvees.message = 'Le message est vide.';
    }
    return trouvees;
  };

  const envoyer = (e) => {
    e.preventDefault();
    const trouvees = verifier();
    if (Object.keys(trouvees).length) {
      setErreurs(trouvees);
      return;
    }

    const sujet = `Portfolio : message de ${champs.nom}`;
    const corps =
      `${champs.message}\n\n${champs.nom}\n${champs.courriel}`;

    window.location.href =
      `mailto:${profil.courriel}` +
      `?subject=${encodeURIComponent(sujet)}` +
      `&body=${encodeURIComponent(corps)}`;

    setEnvoye(true);
  };

  return (
    <section className="section contact" id="contact">
      <div className="contenu">
        <div className="contact__grille">

          <motion.div
            className="contact__propos"
            initial={{ opacity: 0.001, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05, margin: '200px 0px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="surtitre">Contact</p>
            <h2 className="titre-section">Parlons-en</h2>
            <p className="chapeau">{profil.recherche}</p>

            <div className="contact__directs">
              <a className="contact__direct" href={`mailto:${profil.courriel}`}>
                <span className="contact__etiquette">Courriel</span>
                <span className="contact__valeur">{profil.courriel}</span>
              </a>
              <a className="contact__direct" href={profil.github}
                 target="_blank" rel="noreferrer">
                <span className="contact__etiquette">GitHub</span>
                <span className="contact__valeur">Mikaedo</span>
              </a>
              <div className="contact__direct">
                <span className="contact__etiquette">Où je suis</span>
                <span className="contact__valeur">{profil.ville}</span>
              </div>
            </div>
          </motion.div>

          <motion.form
            className="formulaire"
            onSubmit={envoyer}
            noValidate
            initial={{ opacity: 0.001, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05, margin: '200px 0px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="formulaire__champ">
              <label htmlFor="nom">Votre nom</label>
              <input
                id="nom" name="nom" type="text"
                value={champs.nom} onChange={changer}
                aria-invalid={!!erreurs.nom}
                placeholder="Prénom et nom"
              />
              {erreurs.nom && <p className="formulaire__erreur">{erreurs.nom}</p>}
            </div>

            <div className="formulaire__champ">
              <label htmlFor="courriel">Votre adresse</label>
              <input
                id="courriel" name="courriel" type="email"
                value={champs.courriel} onChange={changer}
                aria-invalid={!!erreurs.courriel}
                placeholder="vous@exemple.com"
              />
              {erreurs.courriel && (
                <p className="formulaire__erreur">{erreurs.courriel}</p>
              )}
            </div>

            <div className="formulaire__champ">
              <label htmlFor="message">Votre message</label>
              <textarea
                id="message" name="message" rows="5"
                value={champs.message} onChange={changer}
                aria-invalid={!!erreurs.message}
                placeholder="Ce sur quoi vous travaillez, ce que vous cherchez."
              />
              {erreurs.message && (
                <p className="formulaire__erreur">{erreurs.message}</p>
              )}
            </div>

            <button type="submit" className="bouton bouton--plein">
              Envoyer le message
            </button>

            {envoye && (
              <p className="formulaire__confirme">
                Votre logiciel de messagerie s'ouvre avec le message prêt.
                S'il ne s'ouvre pas, écrivez directement à{' '}
                <a href={`mailto:${profil.courriel}`}>{profil.courriel}</a>.
              </p>
            )}
          </motion.form>

        </div>
      </div>
    </section>
  );
}
