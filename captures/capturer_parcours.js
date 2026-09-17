/* Capture la page d'accueil du portfolio en pleine hauteur.
   Sert a verifier le rendu du personnage du parcours. */
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
  await new Promise((r) => setTimeout(r, 2500));

  /* Descendre jusqu'au parcours pour que les animations se declenchent. */
  await Runtime.evaluate({
    expression: `document.getElementById('parcours').scrollIntoView()`
  });
  await new Promise((r) => setTimeout(r, 2000));

  const boite = await Runtime.evaluate({
    expression: `(() => {
      const s = document.getElementById('parcours');
      const r = s.getBoundingClientRect();
      return JSON.stringify({
        x: 0, y: r.top + window.scrollY,
        w: 1440, h: Math.min(r.height, 1400)
      });
    })()`,
    returnByValue: true
  });
  const b = JSON.parse(boite.result.value);

  const img = await Page.captureScreenshot({
    format: 'png',
    clip: { x: b.x, y: b.y, width: b.w, height: b.h, scale: 1 },
    captureBeyondViewport: true
  });
  fs.writeFileSync('../b_parc.png', Buffer.from(img.data, 'base64'));
  console.log('capture : b_parc.png', b.w + 'x' + Math.round(b.h));

  await c.close();
})();
