/* Capture la page d'accueil entiere, section par section.
   Sert au controle visuel apres chaque serie de corrections. */
const CDP = require('chrome-remote-interface');
const fs = require('fs');

(async () => {
  const c = await CDP();
  const { Page, Runtime, Emulation } = c;
  await Page.enable();
  await Runtime.enable();

  await Emulation.setDeviceMetricsOverride({
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false
  });

  await Page.navigate({ url: 'http://localhost:4380/' });
  await Page.loadEventFired();
  await new Promise((r) => setTimeout(r, 2000));

  /* Parcourir la page pour declencher les apparitions au defilement,
     sinon les sections basses restent a leur etat de repos. */
  await Runtime.evaluate({
    expression: `(async () => {
      const pas = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += pas) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 180));
      }
      window.scrollTo(0, 0);
    })()`,
    awaitPromise: true
  });
  await new Promise((r) => setTimeout(r, 1500));

  const h = await Runtime.evaluate({
    expression: 'document.body.scrollHeight', returnByValue: true
  });
  const hauteur = h.result.value;

  const img = await Page.captureScreenshot({
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: hauteur, scale: 1 },
    captureBeyondViewport: true
  });
  fs.writeFileSync('../b1.png', Buffer.from(img.data, 'base64'));
  console.log('capture : b1.png 1440x' + hauteur);

  await c.close();
})();
