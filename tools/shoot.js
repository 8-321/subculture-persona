/**
 * 小程序截图：连上开发者工具自动化端口，逐页截真实模拟器画面
 * 用法：node tools/shoot.js
 */
const path = require('path');
const fs = require('fs');
const automator = require('miniprogram-automator');

const OUT = path.join(__dirname, '..', '.workbuddy', 'shots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const STEPS = [
  { name: '01-home', url: '/pages/home/home', wait: 2600 },
  { name: '02-tests', url: '/pages/tests/tests', wait: 1400 },
  { name: '03-shop', url: '/pages/shop/shop', wait: 1400 },
  { name: '04-filter', url: '/pages/filter/filter', wait: 1500, nav: true },
  { name: '05-community', url: '/pages/community/community', wait: 1600 },
  { name: '06-question', url: '/pages/question/question?id=main', wait: 1400, nav: false },
  { name: '07-mine', url: '/pages/mine/mine', wait: 1400 }
];

(async () => {
  let mp;
  try {
    mp = await automator.connect({ wsEndpoint: 'ws://127.0.0.1:9420' });
    console.log('已连接开发者工具');
  } catch (e) {
    console.error('连接失败：' + e.message);
    process.exit(2);
  }

  for (const s of STEPS) {
    try {
      const page = s.nav
        ? await mp.navigateTo(s.url)
        : await mp.reLaunch(s.url);
      await page.waitFor(s.wait);
      const file = path.join(OUT, s.name + '.png');
      await mp.screenshot({ path: file });
      const size = fs.existsSync(file) ? fs.statSync(file).size : 0;
      console.log('  ok ' + s.name + '.png  ' + (size / 1024).toFixed(1) + ' KB  ← ' + s.url);
      if (s.nav) await mp.navigateBack();
    } catch (e) {
      console.log('  FAIL ' + s.name + ' → ' + e.message);
    }
  }

  try { await mp.disconnect(); } catch (e) { /* noop */ }
  console.log('完成，输出目录：' + OUT);
  process.exit(0);
})();
