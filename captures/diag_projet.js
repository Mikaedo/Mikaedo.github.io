/* Verifie une page projet : plus de section des limites, la galerie
   se redresse bien, et rien ne reste illisible. */
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

  /* Le routeur travaille sur le fragment : c'est ce qui permet a
     GitHub Pages de servir les pages profondes sans configuration. */
  await Page.navigate({ url: 'http://localhost:4380/#/projet/si-env' });
  await Page.loadEventFired();
  await new Promise((r) => setTimeout(r, 2200));

  await Runtime.evaluate({
    expression: `(async () => {
      const pas = window.innerHeight * 0.5;
      for (let y = 0; y < document.body.scrollHeight; y += pas) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 150));
      }
      await new Promise(r => setTimeout(r, 900));
    })()`,
    awaitPromise: true
  });

  const r = await Runtime.evaluate({
    expression: `(() => {
      const titres = [...document.querySelectorAll('h2')]
        .map(t => t.textContent.trim());
      const pales = [];
      document.querySelectorAll('.galerie__vignette, .point')
        .forEach(el => {
          const o = parseFloat(getComputedStyle(el).opacity);
          if (o < 0.9) pales.push(o.toFixed(2));
        });
      return JSON.stringify({
        titres,
        limitesPresentes: titres.some(t => t.includes('ne résout pas')),
        vignettes: document.querySelectorAll('.galerie__vignette').length,
        pales,
        debordement: document.documentElement.scrollWidth >
                     document.documentElement.clientWidth
      }, null, 1);
    })()`,
    returnByValue: true
  });
  console.log(r.result.value);

  await c.close();
})();
