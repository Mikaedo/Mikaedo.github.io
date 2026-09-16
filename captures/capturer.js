/**
 * Pilote le tableau de bord servi en local et capture ses ecrans.
 *
 * Le site tourne sur le port 8200, branche sur l'API de demonstration
 * du port 8100 : ce qui s'affiche est donc entierement invente, aucune
 * donnee de l'AGEROUTE n'apparait.
 *
 * On passe l'ecran de connexion en posant directement le jeton dans le
 * stockage local, puis on visite chaque page et on enregistre.
 */
const CDP = require('chrome-remote-interface');
const fs = require('fs');

const BASE = 'http://127.0.0.1:8200';
const SORTIE = 'D:/portfolio-react/captures/web';

/* Chaque page se visite avec le role qui y a droit : l'administrateur
   ne voit que l'administration, le specialiste voit le pilotage. */
/* Les codes de role sont ceux que le garde de route attend, releves
   dans core/guards.ts : SPEC_ENV et non le nom complet. */
const ROLES = {
  admin: { id: 5, nom: 'Administrateur', email: 'admin@exemple.ci',
           role: 'ADMIN', premiere_connexion: false },
  spec:  { id: 3, nom: 'Yao Bernard', email: 'spec.env@exemple.ci',
           role: 'SPEC_ENV', premiere_connexion: false },
  par:   { id: 4, nom: 'Diallo Fanta', email: 'spec.par@exemple.ci',
           role: 'SPEC_PAR', premiere_connexion: false },
  ande:  { id: 6, nom: 'Agence de tutelle', email: 'ande@exemple.ci',
           role: 'ANDE', premiere_connexion: false },
};

const PAGES = [
  { route: '/login',        nom: 'web-connexion',    sansJeton: true },
  { route: '/dashboard',    nom: 'web-tableau',      qui: 'spec',  attente: 4200 },
  { route: '/signalements', nom: 'web-signalements', qui: 'spec',  attente: 3400 },
  { route: '/plaintes',     nom: 'web-plaintes',     qui: 'par',   attente: 3000 },
  { route: '/satellite',    nom: 'web-satellite',    qui: 'spec',  attente: 3600 },
  { route: '/rapports',     nom: 'web-rapports',     qui: 'spec',  attente: 3000 },
  { route: '/controle',     nom: 'web-controle',     qui: 'ande',  attente: 3200 },
  { route: '/admin',        nom: 'web-admin',        qui: 'admin', attente: 3000 },
];

const JETON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
            + 'eyJzdWIiOiJkZW1vQGV4ZW1wbGUuY2kiLCJyb2xlIjoiQURNSU4ifQ.'
            + 'demonstration-locale-sans-valeur';

function patienter(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  fs.mkdirSync(SORTIE, { recursive: true });
  const client = await CDP();
  const { Page, Runtime, Emulation, Network } = client;
  await Page.enable();
  await Runtime.enable();
  await Network.enable();

  await Emulation.setDeviceMetricsOverride({
    width: 1600, height: 1000, deviceScaleFactor: 2, mobile: false
  });

  for (const p of PAGES) {
    /* On annonce a l'API le role de la page a venir, pour qu'elle
       reponde comme si ce metier etait connecte. */
    const role = ROLES[p.qui || 'spec'].role;
    await Runtime.evaluate({
      expression: `fetch('http://127.0.0.1:8100/_role?r=${role}')`,
      awaitPromise: false
    });
    await patienter(250);

    await Page.navigate({ url: BASE + '/' });
    await Page.loadEventFired();

    if (!p.sansJeton) {
      /* Le jeton est pose avant la navigation : l'application le lit
         au demarrage et se croit connectee. */
      /* Les cles sont celles du service d'authentification du
         tableau de bord : sienv_token et sienv_user. */
      /* Le stockage attend du JSON : on passe la chaine telle quelle,
         sans la re-encoder, sinon elle arrive entre guillemets et le
         tableau de bord n'y retrouve pas son objet. */
      const qui = JSON.stringify(ROLES[p.qui || 'spec']);
      await Runtime.evaluate({ expression:
        "try {" +
        "  localStorage.setItem('sienv_token', " + JSON.stringify(JETON) + ");" +
        "  localStorage.setItem('sienv_user', " + JSON.stringify(qui) + ");" +
        "} catch (e) {}"
      });
    }

    await Page.navigate({ url: BASE + p.route });
    await Page.loadEventFired();
    await patienter(p.attente || 2500);

    const { data } = await Page.captureScreenshot({ format: 'png' });
    fs.writeFileSync(`${SORTIE}/${p.nom}.png`, Buffer.from(data, 'base64'));

    const url = await Runtime.evaluate({ expression: 'location.pathname' });
    console.log(`${p.nom.padEnd(18)} -> ${url.result.value}`);
  }

  await client.close();
  console.log('captures ecrites dans ' + SORTIE);
})().catch(e => { console.error('echec :', e.message); process.exit(1); });
