/* Capture ce qui est visible a une position de defilement donnee.
   Sert a voir les effets lies au defilement, que la capture pleine
   hauteur fige au repos. */
const CDP = require('chrome-remote-interface');
const fs = require('fs');

const [cible, sortie, largeur] = process.argv.slice(2);

(async () => {
  const c = await CDP();
  const { Page, Runtime, Emulation } = c;
  await Page.enable();
  await Runtime.enable();

  const l = Number(largeur) || 1440;
  await Emulation.setDeviceMetricsOverride({
    width: l, height: 900, deviceScaleFactor: 1, mobile: l < 700
  });

  await Page.navigate({ url: 'http://localhost:4380/' });
  await Page.loadEventFired();
  await new Promise((r) => setTimeout(r, 1800));

  /* Descendre par paliers : un saut direct ne declenche pas les
     observateurs de defilement, et les effets restent au repos. */
  await Runtime.evaluate({
    expression: `(async () => {
      const but = ${cible};
      for (let y = 0; y <= but; y += 220) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 55));
      }
      window.scrollTo(0, but);
      await new Promise(r => setTimeout(r, 700));
    })()`,
    awaitPromise: true
  });

  const img = await Page.captureScreenshot({ format: 'png' });
  fs.writeFileSync(`../${sortie}`, Buffer.from(img.data, 'base64'));
  console.log(`capture : ${sortie} a y=${cible}`);

  await c.close();
})();
