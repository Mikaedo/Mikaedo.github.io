import { HashRouter, Route, Routes } from 'react-router-dom';
import Barre from './components/Barre';
import Pied from './components/Pied';
import Accueil from './pages/Accueil';
import Projet from './pages/Projet';
import './styles/global.css';

/**
 * L'ossature du site.
 *
 * Le routeur travaille sur le fragment de l'adresse, non sur le
 * chemin : un hébergement de fichiers statiques comme GitHub Pages ne
 * sait pas renvoyer index.html pour une adresse inconnue, et une page
 * de projet ouverte directement répondrait une erreur 404.
 */
export default function App() {
  return (
    <HashRouter>
      <Barre />
      <main>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/projet/:id" element={<Projet />} />
          <Route path="*" element={<Accueil />} />
        </Routes>
      </main>
      <Pied />
    </HashRouter>
  );
}
