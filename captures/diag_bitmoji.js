/* Verifie que le personnage du parcours est bien rendu et visible. */
const CDP = require('chrome-remote-interface');

(async () => {
  const c = await CDP();
  const { Page, Runtime, Log } = c;
  await Page.enable();
  await Runtime.enable();
  await Log.enable();

  const soucis = [];
  Log.entryAdded(({ entry }) =>
    soucis.push(entry.level + ' : ' + entry.text.slice(0, 160)));

  await Page.navigate({ url: 'http://localhost:4380/' });
  await Page.loadEventFired();
  await new Promise((r) => setTimeout(r, 2500));

  const r = await Runtime.evaluate({
    expression: `(() => {
      const b = document.querySelector('.bitmoji');
      if (!b) return JSON.stringify({ present: false });
      const bb = b.getBoundingClientRect();
      const imgs = [...b.querySelectorAll('img')].map(i => ({
        classe: i.className,
        source: i.currentSrc.split('/').pop(),
        charge: i.complete && i.naturalWidth > 0,
        taille: i.naturalWidth + 'x' + i.naturalHeight,
        boite: Math.round(i.getBoundingClientRect().width) + 'x' +
               Math.round(i.getBoundingClientRect().height)
      }));
      return JSON.stringify({
        present: true,
        boite: Math.round(bb.width) + 'x' + Math.round(bb.height),
        images: imgs
      }, null, 2);
    })()`,
    returnByValue: true
  });

  console.log(r.result.value);
  if (soucis.length) console.log('\nsoucis :\n' + soucis.slice(0, 8).join('\n'));
  await c.close();
})();
