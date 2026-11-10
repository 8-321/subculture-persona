const fs = require('fs');
const p = 'tools/preview/render.js';
let s = fs.readFileSync(p, 'utf8');
s = s.replace("  if (RUN.dark) appObj.globalData.theme = 'dark';", "  if (RUN.dark) appObj.globalData.theme = 'dark';\n  if (RUN.reduce !== false) appObj.globalData.reduceMotion = true;");
s = s.replace("RUN = { query: opts.query || {}, dark: !!opts.dark, pagePath: pagePath, seed: !!opts.seed };", "RUN = { query: opts.query || {}, dark: !!opts.dark, pagePath: pagePath, seed: !!opts.seed, reduce: opts.reduce !== false };");
fs.writeFileSync(p, s, 'utf8');
console.log(s.includes('RUN.reduce') ? 'ok' : 'FAIL');
