const fs = require('fs');
const p = 'tools/preview/render.js';
let s = fs.readFileSync(p, 'utf8');
const a = `const RPX = WIDTH / 750;`;
const b = `const RPX = WIDTH / 750;
const FS = Math.max(0.8, Math.min(2, Number(process.env.PREVIEW_FS) || 1));`;
if (!s.includes(a)) throw new Error('anchor RPX missing');
if (s.includes('const FS =')) throw new Error('FS already patched');
s = s.replace(a, b);
const c = `const toPx = (css) => toPx0(mapImg(css));`;
const d = `const scaleFont = (css) => (FS === 1 ? css : css.replace(/font-size:\\s*([\\d.]+)px/g, (m, n) => {
  const v = parseFloat(n) * FS;
  return 'font-size:' + (Number.isInteger(v) ? v : v.toFixed(2)) + 'px';
}));
const toPx = (css) => scaleFont(toPx0(mapImg(css)));`;
if (!s.includes(c)) throw new Error('anchor toPx missing');
s = s.replace(c, d);
fs.writeFileSync(p, s, 'utf8');
console.log('render.js font scale patched');
