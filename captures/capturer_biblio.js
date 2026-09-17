/**
 * Capture l'application Bibliotheque UPB, compilee pour le web.
 *
 * Flutter dessine son interface sur un canevas : ni le stockage local
 * ni les selecteurs du DOM ne permettent de la piloter. On procede
 * donc comme un visiteur : on clique dans les champs et on tape au
 * clavier, aux coordonnees relevees sur la capture de l'ecran de
 * connexion.
 */
const CDP = require('chrome-remote-interface');
const fs = require('fs');

const BASE = 'http://127.0.0.1:8400';
const SORTIE = 'D:/portfolio-react/captures/biblio';
const L = 1500, H = 950;   // taille de la fenetre simulee

function patienter(ms) { return new Promise((r) => setTimeout(r, ms)); }

(async () => {
  fs.mkdirSync(SORTIE, { recursive: true });
  const client = await CDP();
  const { Page, Runtime, Emulation, Input } = client;
  await Page.enable();
  await Runtime.enable();
  await Emulation.setDeviceMetricsOverride({
    width: L, height: H, deviceScaleFactor: 2, mobile: false
  });

  async function cliquer(x, y) {
    for (const type of ['mousePressed', 'mouseReleased']) {
      await Input.dispatchMouseEvent({
        type, x, y, button: 'left', clickCount: 1
      });
    }
    await patienter(320);
  }

  async function taper(texte) {
    for (const ch of texte) {
      await Input.dispatchKeyEvent({ type: 'char', text: ch });
      await patienter(28);
    }
  }

  async function garder(nom, attente = 2600) {
    await patienter(attente);
    const { data } = await Page.captureScreenshot({ format: 'png' });
    fs.writeFileSync(`${SORTIE}/${nom}.png`, Buffer.from(data, 'base64'));
    console.log(nom + ' enregistre');
  }

  await Page.navigate({ url: BASE + '/' });
  await Page.loadEventFired();
  /* Flutter charge son moteur avant de dessiner : il faut l'attendre. */
  await patienter(9000);
  await garder('biblio-connexion', 500);

  /* Les coordonnees viennent de la capture precedente, ramenees a la
     taille de la fenetre : le champ identifiant, puis le mot de passe,
     puis le bouton. */
  await cliquer(L * 0.65, H * 0.435);
  await taper('LIB001');

  await cliquer(L * 0.65, H * 0.53);
  await taper('demo1234');

  await cliquer(L * 0.65, H * 0.645);
  await garder('biblio-admin-tableau', 7000);

  /* Les entrees du menu, a gauche : utilisateurs, mots de passe,
     journaux. Leurs hauteurs sont relevees sur la capture. */
  const MENU = [
    { y: 0.19, nom: 'biblio-admin-utilisateurs' },
    { y: 0.25, nom: 'biblio-admin-motsdepasse' },
    { y: 0.31, nom: 'biblio-admin-journaux' },
  ];
  for (const e of MENU) {
    await cliquer(L * 0.12, H * e.y);
    await garder(e.nom, 3400);
  }

  await client.close();
})().catch((e) => { console.error('echec :', e.message); process.exit(1); });
