import { useEffect, useRef, useState } from 'react';

/**
 * Écrit une suite de phrases lettre à lettre, puis les efface.
 *
 * Le texte complet reste accessible aux lecteurs d'écran : ce qui
 * s'anime n'est qu'un rendu visuel, la phrase entière est annoncée.
 *
 * @param {string[]} phrases  ce qui défile, l'une après l'autre
 * @param {number}   vitesse  millisecondes par lettre ajoutée
 * @param {number}   pause    temps de lecture avant l'effacement
 */
export default function Frappe({ phrases, vitesse = 55, pause = 1900 }) {
  const [visible, setVisible] = useState('');
  const [rang, setRang] = useState(0);
  const [efface, setEfface] = useState(false);
  const minuteur = useRef(null);

  const sobre = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (sobre || !phrases?.length) return undefined;

    const phrase = phrases[rang % phrases.length];

    if (!efface && visible === phrase) {
      /* La phrase est écrite : on laisse le temps de la lire. */
      minuteur.current = setTimeout(() => setEfface(true), pause);
    } else if (efface && visible === '') {
      /* Effacée : on passe à la suivante. */
      setEfface(false);
      setRang((r) => r + 1);
    } else {
      const suivant = efface
        ? phrase.slice(0, visible.length - 1)
        : phrase.slice(0, visible.length + 1);
      minuteur.current = setTimeout(
        () => setVisible(suivant),
        efface ? vitesse / 2.4 : vitesse
      );
    }

    return () => clearTimeout(minuteur.current);
  }, [visible, rang, efface, phrases, vitesse, pause, sobre]);

  if (sobre) {
    return <span>{phrases?.[0] ?? ''}</span>;
  }

  return (
    <span>
      <span className="invisible">{phrases?.join(', ')}</span>
      <span aria-hidden="true">
        {visible}
        <span className="frappe__curseur" />
      </span>
    </span>
  );
}
