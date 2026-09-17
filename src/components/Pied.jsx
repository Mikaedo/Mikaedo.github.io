import { Link } from 'react-router-dom';
import { profil } from '../data/profil';
import { projets } from '../data/projets';
import './Pied.css';

/** Le bas de page : les liens utiles et la signature. */
export default function Pied() {
  const annee = new Date().getFullYear();

  return (
    <footer className="pied">
      <div className="contenu pied__grille">

        <div className="pied__identite">
          <span className="pied__sceau">N</span>
          <div>
            <p className="pied__nom">{profil.prenom} {profil.nom}</p>
            <p className="pied__metier">{profil.metier}, {profil.ville}</p>
          </div>
        </div>

        <nav className="pied__colonne">
          <h3>Projets</h3>
          {projets.map((p) => (
            <Link key={p.id} to={`/projet/${p.id}`}>{p.nom}</Link>
          ))}
        </nav>

        <nav className="pied__colonne">
          <h3>Le site</h3>
          <a href="/#chiffres">En bref</a>
          <a href="/#competences">Savoir-faire</a>
          <a href="/#parcours">Parcours</a>
          <a href="/#contact">Contact</a>
        </nav>

        <nav className="pied__colonne">
          <h3>Ailleurs</h3>
          <a href={profil.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`mailto:${profil.courriel}`}>Courriel</a>
        </nav>

      </div>

      <div className="contenu pied__signature">
        <span>© {annee} {profil.prenom} {profil.nom}</span>
        <span>Construit avec React et Vite</span>
      </div>
    </footer>
  );
}
