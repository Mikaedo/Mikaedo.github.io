const CDP = require('chrome-remote-interface');
(async () => {
  const c = await CDP();
  const { Page, Runtime, Network, Log } = c;
  await Page.enable(); await Runtime.enable(); await Network.enable(); await Log.enable();
  const erreurs = [];
  Log.entryAdded(({ entry }) => erreurs.push(entry.level + ': ' + entry.text.slice(0, 120)));
  Network.responseReceived(({ response }) => {
    if (response.url.includes('8085')) erreurs.push('API ' + response.status + ' ' + response.url.replace('http://127.0.0.1:8085',''));
  });
  await Page.navigate({ url: 'http://127.0.0.1:8300/' });
  await Page.loadEventFired();
  await Runtime.evaluate({ expression: "localStorage.setItem('token', '" + require('fs').readFileSync('jeton_wecite.txt','utf8').trim() + "')" });
  await Page.navigate({ url: 'http://127.0.0.1:8300/admin' });
  await Page.loadEventFired();
  await new Promise(r => setTimeout(r, 4000));
  const ou = await Runtime.evaluate({ expression: 'location.pathname' });
  console.log('arrive sur :', ou.result.value);
  console.log(erreurs.slice(0, 12).join('\n'));
  await c.close();
})();
