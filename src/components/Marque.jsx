/**
 * Les marques des technologies et des domaines, dessinées au trait.
 *
 * Elles prennent la couleur du texte qui les entoure : un logo importé
 * dans ses couleurs d'origine ferait tache sur une page brune, et
 * changerait de lisibilité entre le thème clair et le sombre.
 */

const FORMES = {
  /* --- Domaines ------------------------------------------------- */
  mobile: (
    <>
      <rect x="6.5" y="2" width="11" height="20" rx="2.2" fill="none"
            stroke="currentColor" strokeWidth="1.6" />
      <line x1="10" y1="5" x2="14" y2="5" stroke="currentColor"
            strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="18.6" r="1" fill="currentColor" />
    </>
  ),
  serveur: (
    <>
      <rect x="2.5" y="3.5" width="19" height="6.4" rx="1.6" fill="none"
            stroke="currentColor" strokeWidth="1.6" />
      <rect x="2.5" y="14.1" width="19" height="6.4" rx="1.6" fill="none"
            stroke="currentColor" strokeWidth="1.6" />
      <circle cx="6.4" cy="6.7" r="1" fill="currentColor" />
      <circle cx="6.4" cy="17.3" r="1" fill="currentColor" />
    </>
  ),
  base: (
    <>
      <ellipse cx="12" cy="5.6" rx="7.6" ry="2.9" fill="none"
               stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.4 5.6v12.8c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9V5.6"
            fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.4 12c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9"
            fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  ia: (
    <>
      <path d="M12 2.4 3.4 7.2v9.6L12 21.6l8.6-4.8V7.2z" fill="none"
            stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="8.2" r="1.7" fill="currentColor" />
      <circle cx="8" cy="14.6" r="1.4" fill="currentColor" />
      <circle cx="16" cy="14.6" r="1.4" fill="currentColor" />
      <path d="M12 9.9 8 13.2M12 9.9l4 3.3M9.4 15.2h5.2" stroke="currentColor"
            strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  web: (
    <>
      <rect x="2.5" y="4" width="19" height="14.5" rx="2" fill="none"
            stroke="currentColor" strokeWidth="1.6" />
      <line x1="2.5" y1="8.4" x2="21.5" y2="8.4" stroke="currentColor"
            strokeWidth="1.6" />
      <circle cx="5.6" cy="6.2" r=".85" fill="currentColor" />
      <circle cx="8.2" cy="6.2" r=".85" fill="currentColor" />
      <path d="M8 20.6h8" stroke="currentColor" strokeWidth="1.6"
            strokeLinecap="round" />
    </>
  ),
  deploiement: (
    <>
      <path d="M12 2.6c3.3 2.3 5 5.5 5 9.4 0 2.4-.6 4.4-1.7 6H8.7C7.6 16.4 7 14.4 7 12c0-3.9 1.7-7.1 5-9.4z"
            fill="none" stroke="currentColor" strokeWidth="1.6"
            strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.1" fill="none" stroke="currentColor"
              strokeWidth="1.6" />
      <path d="M9.6 19.4l-1.4 2.4M14.4 19.4l1.4 2.4" stroke="currentColor"
            strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),

  /* --- Technologies --------------------------------------------- */
  flutter: (
    <path d="M14.3 1.4 3.2 12.5l3.4 3.4L21.1 1.4zM14.2 12.6l-5.7 5.7 5.7 5.4h6.9l-5.7-5.4 5.7-5.7z"
          fill="currentColor" />
  ),
  python: (
    <>
      <path d="M11.9 1.5c-5.4 0-5.1 2.3-5.1 2.3v2.4h5.2v.7H4.7s-3.5.4-3.5 5.1c0 4.7 3 4.5 3 4.5h1.8v-2.5s-.1-3 2.9-3h5.2s2.9.1 2.9-2.8V4.4S17.4 1.5 11.9 1.5zM9.1 3.1c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z"
            fill="currentColor" />
      <path d="M12.1 22.5c5.4 0 5.1-2.3 5.1-2.3v-2.4H12v-.7h7.3s3.5-.4 3.5-5.1c0-4.7-3-4.5-3-4.5h-1.8v2.5s.1 3-2.9 3H9.9s-2.9-.1-2.9 2.8v4.8s-.4 1.9 5.1 1.9zm2.8-1.6c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z"
            fill="currentColor" />
    </>
  ),
  java: (
    <>
      <path d="M9.1 17.7s-.9.5.6.7c1.8.2 2.8.2 4.8-.2 0 0 .5.3 1.3.6-4.5 1.9-10.2-.1-6.7-1.1zM8.5 15.2s-1 .7.5.9c2 .2 3.5.2 6.2-.3 0 0 .4.4 1 .6-5.4 1.6-11.5.1-7.7-1.2z"
            fill="currentColor" />
      <path d="M13.1 10.9c1.1 1.3-.3 2.4-.3 2.4s2.8-1.4 1.5-3.2c-1.2-1.7-2.1-2.5 2.8-5.4 0 0-7.8 2-4 6.2z"
            fill="currentColor" />
      <path d="M19.2 19.6s.7.6-.7 1c-2.8.8-11.4 1.1-13.9 0-.9-.4.8-.9 1.3-1 .5-.1.8-.1.8-.1-1-.7-6.3 1.4-2.7 2 9.8 1.6 17.9-.7 15.2-1.9z"
            fill="currentColor" />
      <path d="M9.6 12.6s-4.5 1.1-1.6 1.5c1.2.2 3.7.1 6-.1 1.9-.2 3.8-.5 3.8-.5s-.7.3-1.1.6c-4.6 1.2-13.4.6-10.9-.6 2.1-1 3.8-.9 3.8-.9zM17.7 16.1c4.7-2.4 2.5-4.8 1-4.4-.4.1-.5.2-.5.2s.1-.2.4-.3c3.2-1.1 5.6 3.2-1 4.8 0 0 .1-.1.1-.3z"
            fill="currentColor" />
      <path d="M14.4 1c0 0 2.6 2.6-2.5 6.6-4 3.2-.9 5 0 7.2-2.3-2.1-4-4-2.9-5.8C10.6 6.4 15.4 5.1 14.4 1z"
            fill="currentColor" />
      <path d="M10.1 21.5c4.5.3 11.3-.2 11.5-2.3 0 0-.3.8-3.7 1.4-3.8.7-8.5.6-11.3.2 0 0 .6.5 3.5.7z"
            fill="currentColor" />
    </>
  ),
  angular: (
    <path d="M12 1.2 2.1 4.6l1.5 12.8L12 22.1l8.4-4.7 1.5-12.8zm0 2.2 6.7 14.9h-2.5l-1.4-3.4H9.2l-1.4 3.4H5.3zm1.9 9.4L12 8l-1.9 4.8z"
          fill="currentColor" />
  ),
  react: (
    <>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="9.6" ry="3.7" fill="none"
               stroke="currentColor" strokeWidth="1.1" />
      <ellipse cx="12" cy="12" rx="9.6" ry="3.7" fill="none"
               stroke="currentColor" strokeWidth="1.1"
               transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.6" ry="3.7" fill="none"
               stroke="currentColor" strokeWidth="1.1"
               transform="rotate(120 12 12)" />
    </>
  ),
  postgresql: (
    <>
      <path d="M17.2 2.4c-1.3 0-2.5.3-3.4.7-.9-.3-1.9-.4-2.9-.4-3.7 0-6 1.7-6.7 4.6-.6 2.6-.3 6.2.7 9 .5 1.4 1.1 2.5 1.8 3.1.4.3.9.5 1.4.4.4-.1.7-.4 1-.9.3.5.6.9 1 1.2.7.5 1.5.8 2.4.8.9 0 1.7-.3 2.4-.8.5-.4.9-1 1.2-1.7.2.4.4.7.7.9.4.3.9.4 1.4.2.4-.2.7-.6.9-1.2.4-1.1.8-3 1-4.9.2-2 .2-4-.1-5.4-.3-1.9-.9-3.3-1.9-4.2-.8-.9-1.9-1.4-2.9-1.4z"
            fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.8 8.6c-.2 1.6.1 3 .8 3.9M14 8.2c.6 1.2.8 2.7.5 4M11.6 19.4c0-1.4.2-3.4.6-4.6"
            fill="none" stroke="currentColor" strokeWidth="1.2"
            strokeLinecap="round" />
    </>
  ),
  docker: (
    <>
      <path d="M5.9 8.4h2.3v2.2H5.9zm2.8 0H11v2.2H8.7zm2.8 0h2.3v2.2h-2.3zm2.8 0h2.3v2.2h-2.3zM8.7 5.9H11v2.2H8.7zm2.8 0h2.3v2.2h-2.3zm2.8 0h2.3v2.2h-2.3z"
            fill="currentColor" />
      <path d="M22.9 10.8c-.4-.3-1.3-.4-2-.3-.1-.8-.5-1.5-1.3-2.1l-.4-.3-.3.4c-.5.8-.7 1.9-.4 2.8.1.4.4.8.7 1-.4.2-1.1.5-2 .5H1.7c-.2 1.5.1 3.4 1.2 4.8 1.1 1.4 2.8 2.1 5 2.1 4.8 0 8.4-2.2 10.1-6.2 .6 0 2 0 2.7-1.4.1-.1.4-.6.5-1z"
            fill="currentColor" />
    </>
  ),
  git: (
    <path d="M23.4 11 13 .6c-.6-.6-1.6-.6-2.2 0L8.6 2.8l2.8 2.8c.6-.2 1.4-.1 1.9.5.6.6.7 1.4.5 2l2.7 2.7c.7-.2 1.5-.1 2 .5.8.8.8 2 0 2.8-.8.8-2 .8-2.8 0-.6-.6-.8-1.5-.4-2.2l-2.5-2.5v6.6c.2.1.4.2.5.4.8.8.8 2 0 2.8-.8.8-2 .8-2.8 0-.8-.8-.8-2 0-2.8.2-.2.5-.4.7-.5V8.9c-.3-.1-.5-.3-.7-.5-.6-.6-.8-1.5-.4-2.2L7.4 3.5.6 10.4c-.6.6-.6 1.6 0 2.2l10.4 10.4c.6.6 1.6.6 2.2 0l10.2-10.2c.6-.6.6-1.6 0-2.2z"
          fill="currentColor" />
  ),
  yolo: (
    <>
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="2.4" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2.6" />
      <rect x="6.6" y="7.6" width="7.4" height="6" rx="1" fill="none"
            stroke="currentColor" strokeWidth="1.5" />
      <rect x="12.4" y="12" width="5.4" height="4.6" rx="1" fill="none"
            stroke="currentColor" strokeWidth="1.5" />
    </>
  )
};

export default function Marque({ nom, taille = 20, className = '' }) {
  const forme = FORMES[nom];
  if (!forme) return null;

  return (
    <svg
      className={`marque ${className}`}
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {forme}
    </svg>
  );
}

export const MARQUES_CONNUES = Object.keys(FORMES);
