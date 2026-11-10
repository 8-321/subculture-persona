const automator = require('miniprogram-automator');
const path = require('path');
const fs = require('fs');
(async () => {
  const t0 = Date.now();
  const mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
  console.log('connected in', Date.now() - t0, 'ms');
  const page = await mp.currentPage();
  console.log('current page:', page && page.path);
  const out = path.join('.workbuddy', 'probe-home.png');
  await mp.screenshot({ path: out });
  console.log('shot', out, fs.statSync(out).size);
  await mp.disconnect();
  process.exit(0);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
