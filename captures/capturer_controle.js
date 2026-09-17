/* Capture la page d'accueil en large et en etroit.
   Sert au controle visuel apres chaque serie de corrections. */
const CDP = require('chrome-remote-interface');
const fs = require('fs');

const VUES = [
  { nom: 'large', l: 1440, h: 900, mobile: false },
  { nom: 'mobile', l: 390, h: 844, mobile: true }
];

(async () => {
  for (const v of VUES) {
    const c = await CDP();
    const { Page, Runtime, Emulation } = c;
    await Page.enable();
    await Runtime.enable();

    await Emulation.setDeviceMetricsOverride({
      width: v.l, height: v.h, deviceScaleFactor: 1, mobile: v.mobile
    });

    await Page.navigate({ url: 'http://localhost:4380/' });
    await Page.loadEventFired();
    await new Promise((r) => setTimeout(r, 2000));

    /* Parcourir la page pour declencher les apparitions au
       defilement, sinon les sections basses restent au repos. */
    await Runtime.evaluate({
      expression: `(async () => {
        const pas = window.innerHeight * 0.6;
        for (let y = 0; y < document.body.scrollHeight; y += pas) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 160));
        }
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 400));
      })()`,
      awaitPromise: true
    });
    await new Promise((r) => setTimeout(r, 1200));

    const h = await Runtime.evaluate({
      expression: 'document.body.scrollHeight', returnByValue: true
    });

    const img = await Page.captureScreenshot({
      format: 'png',
      clip: { x: 0, y: 0, width: v.l, height: h.result.value, scale: 1 },
      captureBeyondViewport: true
    });
    fs.writeFileSync(`../c_${v.nom}.png`, Buffer.from(img.data, 'base64'));
    console.log(`capture : c_${v.nom}.png ${v.l}x${h.result.value}`);

    await c.close();
  }
})();
