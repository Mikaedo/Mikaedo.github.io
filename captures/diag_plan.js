/* Verifie que la bascule 3D des sections s'applique bien, et que la
   page ne deborde pas lateralement. */
const CDP = require('chrome-remote-interface');

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
  await new Promise((r) => setTimeout(r, 1600));

  for (const y of [600, 1400, 2400]) {
    await Runtime.evaluate({
      expression: `(async () => {
        for (let p = window.scrollY; p <= ${y}; p += 200) {
          window.scrollTo(0, p);
          await new Promise(r => setTimeout(r, 50));
        }
        window.scrollTo(0, ${y});
        await new Promise(r => setTimeout(r, 500));
      })()`,
      awaitPromise: true
    });

    const r = await Runtime.evaluate({
      expression: `(() => {
        const faces = [...document.querySelectorAll('.plan__face')];
        const t = faces.map(f => {
          const m = getComputedStyle(f).transform;
          return m === 'none' ? 'aucune' : m.slice(0, 46);
        });
        return JSON.stringify({
          y: window.scrollY,
          debordement: document.documentElement.scrollWidth >
                       document.documentElement.clientWidth,
          largeurDoc: document.documentElement.scrollWidth,
          faces: t
        });
      })()`,
      returnByValue: true
    });
    console.log(r.result.value);
  }

  await c.close();
})();
