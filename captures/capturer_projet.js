/* Capture une page projet en pleine hauteur.
   Le routeur travaille sur le fragment : c'est ce qui permet a
   GitHub Pages de servir les pages profondes sans configuration. */
const CDP = require('chrome-remote-interface');
const fs = require('fs');

const [id = 'si-env'] = process.argv.slice(2);

(async () => {
  const c = await CDP();
  const { Page, Runtime, Emulation } = c;
  await Page.enable();
  await Runtime.enable();
  await Emulation.setDeviceMetricsOverride({
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false
  });

  /* Un rechargement force : un simple changement de fragment ne
     recharge pas le document, et l'evenement de chargement ne se
     redeclencherait jamais. */
  await Page.navigate({ url: `http://localhost:4380/#/projet/${id}` });
  await Page.reload({ ignoreCache: true });
  await new Promise((r) => setTimeout(r, 3000));

  /* Le defilement est pilote depuis ici, un palier par appel : une
     promesse attendue dans la page ne se resolvait pas, la page
     projet se replacant elle-meme a l'arrivee. */
  const mesure = await Runtime.evaluate({
    expression: 'document.body.scrollHeight', returnByValue: true
  });
  for (let y = 0; y < mesure.result.value; y += 500) {
    await Runtime.evaluate({ expression: `window.scrollTo(0, ${y})` });
    await new Promise((r) => setTimeout(r, 120));
  }
  await new Promise((r) => setTimeout(r, 800));

  const etat = await Runtime.evaluate({
    expression: `JSON.stringify({
      titres: [...document.querySelectorAll('h2')].map(t => t.textContent.trim()),
      vignettes: document.querySelectorAll('.galerie__vignette').length,
      debordement: document.documentElement.scrollWidth >
                   document.documentElement.clientWidth,
      hauteur: document.body.scrollHeight
    })`,
    returnByValue: true
  });
  console.log(etat.result.value);

  const h = JSON.parse(etat.result.value).hauteur;
  const img = await Page.captureScreenshot({
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: Math.min(h, 7000), scale: 1 },
    captureBeyondViewport: true
  });
  fs.writeFileSync(`../pr_${id}.png`, Buffer.from(img.data, 'base64'));
  console.log(`capture : pr_${id}.png`);

  await c.close();
})();
