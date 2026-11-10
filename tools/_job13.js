module.exports = [
  { file: 'tools/preview/render.js', old: `const NAME = val('out', pagePath.replace(/\\//g, '-'));`, new: `const NAME = val('out', pagePath.replace(/\\//g, '-'));
const WIDTH = Math.max(300, Math.min(430, Number(val('w', '375')) || 375));
const RPX = WIDTH / 750;` },
  { file: 'tools/preview/render.js', old: `  const v = parseFloat(n) * 0.5;`, new: `  const v = parseFloat(n) * RPX;` },
  { file: 'tools/preview/render.js', old: `  'body{width:375px;overflow-x:hidden;}',`, new: `  'body{width:' + WIDTH + 'px;overflow-x:hidden;}',` },
  { file: 'tools/preview/render.js', old: `        return () => ({ statusBarHeight: 44, windowWidth: 375, windowHeight: 812, screenWidth: 375, screenHeight: 812, safeArea: { top: 44, bottom: 812, left: 0, right: 375 }, SDKVersion: '3.6.0', platform: 'devtools', system: 'iOS 17.0', brand: 'devtools', model: 'iPhone 15', pixelRatio: 3, language: 'zh_CN' });`, new: `        return () => ({ statusBarHeight: 44, windowWidth: WIDTH, windowHeight: 812, screenWidth: WIDTH, screenHeight: 812, safeArea: { top: 44, bottom: 812, left: 0, right: WIDTH }, SDKVersion: '3.6.0', platform: 'devtools', system: 'iOS 17.0', brand: 'devtools', model: 'iPhone 15', pixelRatio: 3, language: 'zh_CN' });` },
  { file: 'tools/preview/render.js', old: `      if (k === 'getMenuButtonBoundingClientRect') return () => ({ top: 48, bottom: 80, left: 281, right: 368, width: 87, height: 32 });`, new: `      if (k === 'getMenuButtonBoundingClientRect') return () => ({ top: 48, bottom: 80, left: WIDTH - 94, right: WIDTH - 7, width: 87, height: 32 });` },
  { file: 'tools/preview/render.js', old: `    if (!inRail && (pr.right > 375.5 || pr.left < -0.5)) {`, new: `    if (!inRail && (pr.right > WIDTH + 0.5 || pr.left < -0.5)) {` },
  { file: 'tools/preview/render.js', old: `    '<meta name="viewport" content="width=375,initial-scale=1">' +`, new: `    '<meta name="viewport" content="width=' + WIDTH + ',initial-scale=1">' +` },
  { file: 'tools/preview/render.js', old: `module.exports = { build, shot, AUDIT_JS, OUT, EDGE };`, new: `module.exports = { build, shot, AUDIT_JS, OUT, EDGE, WIDTH };` },
  { file: 'tools/preview/render.js', old: `  const { png, res, errors } = await shot(html, NAME, AUDIT, { width: 375, height: TALL ? 2400 : 812 }, TALL);`, new: `  const { png, res, errors } = await shot(html, NAME, AUDIT, { width: WIDTH, height: TALL ? 2400 : 812 }, TALL);` }
];
