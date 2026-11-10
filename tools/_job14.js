module.exports = [
  { file: 'tools/preview/render.js', old: `const WIDTH = Math.max(300, Math.min(430, Number(val('w', '375')) || 375));`, new: `const W_RAW = val('w', '') || (argv.find((a) => a.indexOf('--w=') === 0) || '').split('=')[1] || '375';
const WIDTH = Math.max(300, Math.min(430, Number(W_RAW) || 375));` },
  { file: 'tools/preview/audit_all.js', old: `  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
  const rows = [];
  for (const j of jobs) {
    const name = j.out || j.p.replace(/\\//g, '-');`, new: `  const W = R.WIDTH || 375;
  const suffix = W === 375 ? '' : '-' + W;
  const page = await browser.newPage({ viewport: { width: W, height: 812 }, deviceScaleFactor: 2 });
  const rows = [];
  for (const j of jobs) {
    const name = (j.out || j.p.replace(/\\//g, '-')) + suffix;` },
  { file: 'tools/preview/audit_all.js', old: `  fs.writeFileSync(path.join(OUT, 'audit-all.json'), JSON.stringify(rows, null, 2), 'utf8');`, new: `  fs.writeFileSync(path.join(OUT, 'audit-all' + suffix + '.json'), JSON.stringify(rows, null, 2), 'utf8');` },
  { file: 'tools/preview/audit_all.js', old: `  console.log('\\n合计：裁剪 ' + sum('badClip')`, new: `  console.log('\\n宽度 ' + W + '｜合计：裁剪 ' + sum('badClip')` }
];
