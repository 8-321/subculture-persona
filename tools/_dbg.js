const { chromium } = require('playwright-core');
const fs = require('fs');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const u = 'file:///' + encodeURI('E:/亚文化小程序开发/miniprogram/images/tab/home.png');
const html = `<html><body style="margin:0;background:#fff">
<div style="display:flex;gap:20px;padding:20px">
  <img style="width:19px;height:19px;background-image:url('${u}');background-size:contain;background-repeat:no-repeat">
  <mpimg style="display:inline-block;width:19px;height:19px;background-image:url('${u}');background-size:contain;background-repeat:no-repeat"></mpimg>
  <img src="${u}" style="width:19px;height:19px;object-fit:contain">
</div></body></html>`;
fs.writeFileSync('.workbuddy/render/_t2.html', html, 'utf8');
(async () => {
  const b = await chromium.launch({ executablePath: EDGE, headless: true });
  const p = await b.newPage({ viewport: { width: 200, height: 60 }, deviceScaleFactor: 4 });
  await p.goto('file:///' + encodeURI('E:/亚文化小程序开发/.workbuddy/render/_t2.html'));
  await p.waitForTimeout(200);
  await p.screenshot({ path: '.workbuddy/render/_t2.png' });
  await b.close();
})();
