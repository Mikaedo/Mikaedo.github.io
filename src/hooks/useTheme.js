import { useCallback, useEffect, useState } from 'react';

/**
 * Le thème clair ou sombre, et sa bascule.
 *
 * Le visiteur est dans l'un de trois états : il a choisi le clair, il
 * a choisi le sombre, ou il n'a rien choisi et son système décide.
 * Seul un choix explicite est enregistré, pour que le site suive son
 * système tant qu'il ne s'est pas prononcé.
 */
const CLE = 'portfolio-theme';

function lireChoix() {
  try {
    const garde = localStorage.getItem(CLE);
    return garde === 'dark' || garde === 'light' ? garde : null;
  } catch {
    // Navigation privée, stockage bloqué : on s'en passe.
    return null;
  }
}

function systemeEnSombre() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useTheme() {
  const [choix, setChoix] = useState(lireChoix);

  useEffect(() => {
    const racine = document.documentElement;
    if (choix) racine.setAttribute('data-theme', choix);
    else racine.removeAttribute('data-theme');
  }, [choix]);

  const basculer = useCallback(() => {
    setChoix((actuel) => {
      const voulu = actuel
        ? (actuel === 'dark' ? 'light' : 'dark')
        : (systemeEnSombre() ? 'light' : 'dark');
      try { localStorage.setItem(CLE, voulu); } catch { /* sans effet */ }
      return voulu;
    });
  }, []);

  /* Ce que le visiteur voit en ce moment, choix ou système confondus. */
  const sombre = choix ? choix === 'dark' : systemeEnSombre();

  return { sombre, basculer };
}
