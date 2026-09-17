/* Verifie qu'aucun bloc ne reste a demi transparent apres lecture de
   la page : une apparition qui ne se declenche pas laisse du texte
   illisible. */
const CDP = require('chrome-remote-interface');

const [largeur] = process.argv.slice(2);

(async () => {
  const c = await CDP();
  const { Page, Runtime, Emulation } = c;
  await Page.enable();
  await Runtime.enable();

  const l = Number(largeur) || 1440;
  await Emulation.setDeviceMetricsOverride({
    width: l, height: 844, deviceScaleFactor: 1, mobile: l < 700
  });

  await Page.navigate({ url: 'http://localhost:4380/' });
  await Page.loadEventFired();
  await new Promise((r) => setTimeout(r, 1800));

  await Runtime.evaluate({
    expression: `(async () => {
      const pas = window.innerHeight * 0.5;
      for (let y = 0; y < document.body.scrollHeight; y += pas) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 140));
      }
      await new Promise(r => setTimeout(r, 900));
    })()`,
    awaitPromise: true
  });

  const r = await Runtime.evaluate({
    expression: `(() => {
      const pales = [];
      document.querySelectorAll('.competence, .carte, .etape, .plan__face')
        .forEach(el => {
          const o = parseFloat(getComputedStyle(el).opacity);
          if (o < 0.9) {
            pales.push({
              classe: el.className.split(' ')[0],
              opacite: o.toFixed(2),
              texte: (el.textContent || '').trim().slice(0, 34)
            });
          }
        });
      return JSON.stringify({ largeur: window.innerWidth, pales }, null, 1);
    })()`,
    returnByValue: true
  });

  console.log(r.result.value);
  await c.close();
})();
