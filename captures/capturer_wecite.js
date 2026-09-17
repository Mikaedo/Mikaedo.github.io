/**
 * Pilote le tableau de bord WeCite et capture ses ecrans.
 *
 * Le site tourne sur le port 8300, branche sur l'API de demonstration
 * du port 8085 : residents, incidents et cotisations sont inventes.
 */
const CDP = require('chrome-remote-interface');
const fs = require('fs');

const BASE = 'http://127.0.0.1:8300';
const SORTIE = 'D:/portfolio-react/captures/wecite';

/* Le frontend decode le jeton pour lire sa date d'expiration : une
   chaine quelconque le fait echouer, il lui faut une charge valide. */
const JETON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGVtcGxlLmNpIiwicm9sZXMiOlsiQURNSU4iXSwiY2l0ZUlkIjoxLCJpYXQiOjE3ODk2MzM5MzksImV4cCI6MTgyMTE2OTkzOX0.demonstration-locale-sans-valeur';

const PAGES = [
  { route: '/login',            nom: 'wecite-connexion', sansJeton: true, attente: 2600 },
  { route: '/admin',            nom: 'wecite-tableau',   attente: 4000 },
  { route: '/admin/residents',  nom: 'wecite-residents', attente: 3200 },
  { route: '/admin/incidents',  nom: 'wecite-incidents', attente: 3200 },
  { route: '/admin/finances',   nom: 'wecite-finances',  attente: 3400 },
  { route: '/admin/carte',      nom: 'wecite-carte',     attente: 4200 },
  { route: '/admin/reglement',  nom: 'wecite-reglement', attente: 2800 },
];

function patienter(ms) { return new Promise((r) => setTimeout(r, ms)); }

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
    await Page.navigate({ url: BASE + '/' });
    await Page.loadEventFired();

    if (!p.sansJeton) {
      await Runtime.evaluate({ expression:
        "try { localStorage.setItem('token', " + JSON.stringify(JETON) + "); }"
        + " catch (e) {}"
      });
    }

    await Page.navigate({ url: BASE + p.route });
    await Page.loadEventFired();
    await patienter(p.attente || 3000);

    const { data } = await Page.captureScreenshot({ format: 'png' });
    fs.writeFileSync(`${SORTIE}/${p.nom}.png`, Buffer.from(data, 'base64'));

    const ou = await Runtime.evaluate({ expression: 'location.pathname' });
    console.log(`${p.nom.padEnd(20)} -> ${ou.result.value}`);
  }

  await client.close();
  console.log('captures ecrites dans ' + SORTIE);
})().catch((e) => { console.error('echec :', e.message); process.exit(1); });
