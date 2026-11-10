/**
 * 批量审计：一次启动浏览器，按真实参数扫全部页面
 * 用法：node tools/preview/audit_all.js [页面路径…]
 */
const fs = require('fs');
const path = require('path');
const R = require('./render.js');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = R.OUT;

const MATRIX = [
  { p: 'pages/home/home' },
  { p: 'pages/tests/tests' },
  { p: 'pages/community/community' },
  { p: 'pages/shop/shop' },
  { p: 'pages/filter/filter' },
  { p: 'pages/mine/mine', seed: true },
  { p: 'pages/test-detail/test-detail', q: { id: 'main' } },
  { p: 'pages/question/question', q: { id: 'main' } },
  { p: 'pages/generating/generating', q: { id: 'main' } },
  { p: 'pages/result/result', q: { rid: 'r_demo' }, seed: true },
  { p: 'pages/type/type', q: { code: 'PUNK' } },
  { p: 'pages/card/card', q: { rid: 'r_demo' }, seed: true },
  { p: 'pages/cooperation/cooperation' },
  { p: 'pages/search/search', q: { kw: '哥特' } },
  { p: 'pages/category/category' },
  { p: 'pages/shop-detail/shop-detail', q: { id: 'p1' } },
  { p: 'pages/shop-home/shop-home', q: { name: '铁器时代' } },
  { p: 'pages/post-detail/post-detail', q: { id: 'w1', type: 'post' } },
  { p: 'pages/post-detail/post-detail', q: { id: 'a1', type: 'article' }, out: 'post-detail-article' },
  { p: 'pages/post-publish/post-publish' },
  { p: 'pages/drafts/drafts', seed: true },
  { p: 'pages/merchant-apply/merchant-apply' },
  { p: 'pages/followed-shops/followed-shops', seed: true },
  { p: 'pages/favorites/favorites', seed: true },
  { p: 'pages/history/history', seed: true },
  { p: 'pages/reports/reports', seed: true },
  { p: 'pages/my-report/my-report', q: { rid: 'r_demo' }, seed: true },
  { p: 'pages/settings/settings' },
  { p: 'pages/register/register' },
  { p: 'pages/interests/interests' },
  { p: 'pages/legal/legal' },
  { p: 'pages/index/index' }
];

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const jobs = only.length ? MATRIX.filter((m) => only.some((o) => m.p.indexOf(o) >= 0)) : MATRIX;

(async () => {
  const { chromium } = require('playwright-core');
  const browser = await chromium.launch({ executablePath: R.EDGE, headless: true });
  const W = R.WIDTH || 375;
  const suffix = W === 375 ? '' : '-' + W;
  const page = await browser.newPage({ viewport: { width: W, height: 812 }, deviceScaleFactor: 2 });
  const rows = [];
  for (const j of jobs) {
    const name = (j.out || j.p.replace(/\//g, '-')) + suffix;
    let html;
    try { html = R.build(j.p, { query: j.q || {}, seed: j.seed }); } catch (e) { rows.push({ page: j.p, error: e.message }); console.log('SKIP ' + j.p + ' ' + e.message); continue; }
    const htmlPath = path.join(OUT, name + '.html');
    fs.writeFileSync(htmlPath, html, 'utf8');
    try {
      await page.goto('file:///' + encodeURI(htmlPath.replace(/\\/g, '/')), { waitUntil: 'load' });
      await page.addStyleTag({ content: '*,*::before,*::after{animation:none !important;transition:none !important}.m-rv{opacity:1 !important}' });
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(OUT, name + '.png') });
      const res = await page.evaluate(R.AUDIT_JS);
      const bad = res.clip.filter((c) => !c.nowrap && !c.clamped);
      rows.push({ page: name, pageHeight: res.pageH, badClip: bad, squeeze: res.squeeze, spill: res.spill, ellipsis: res.clip.filter((c) => c.nowrap), orphan: res.orphan, outOfScreen: res.outOfScreen, emptyImages: res.emptyImages });
      console.log(name.padEnd(32) + ' 超框 ' + bad.length + ' | 挤字 ' + res.squeeze.length + ' | 溢出 ' + res.spill.length + ' | 省略 ' + res.clip.filter((c) => c.nowrap).length + ' | 孤字 ' + res.orphan.length + ' | 空图 ' + res.emptyImages.length + ' | 高 ' + res.pageH);
    } catch (e) {
      rows.push({ page: name, error: e.message });
      console.log('ERR ' + name + ' ' + e.message);
    }
  }
  fs.writeFileSync(path.join(OUT, 'audit-all' + suffix + '.json'), JSON.stringify(rows, null, 2), 'utf8');
  const sum = (k) => rows.reduce((a, r) => a + ((r[k] || []).length), 0);
  console.log('\n宽度 ' + W + '｜合计：裁剪 ' + sum('badClip') + '｜挤字 ' + sum('squeeze') + '｜溢出父框 ' + sum('spill') + '｜孤字 ' + sum('orphan') + '｜空图 ' + sum('emptyImages') + '｜页面 ' + rows.length);
  await browser.close();
})();