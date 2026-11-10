const fs = require('fs');
const path = require('path');
const dir = '.workbuddy/render';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const bad = [];
for (const f of files) {
  const h = fs.readFileSync(path.join(dir, f), 'utf8');
  const m = h.match(/<body>([\s\S]*)<\/body>/);
  if (!m) continue;
  const txt = m[1].replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  for (const tok of ['undefined', 'NaN', '\\n', 'null', '{{', '}}']) {
    if (txt.indexOf(tok) >= 0) {
      const i = txt.indexOf(tok);
      bad.push(f + ' [' + tok + '] … ' + txt.slice(Math.max(0, i - 40), i + 40));
    }
  }
}
console.log(bad.length ? bad.join('\n') : 'clean');
