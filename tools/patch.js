const fs = require('fs');
const path = require('path');
const jobs = require(path.resolve(process.argv[2]));
let n = 0;
for (const j of jobs) {
  const p = j.file;
  let s = fs.readFileSync(p, 'utf8');
  if (!s.includes(j.old)) { console.error('NOT FOUND in ' + p + ':\n' + j.old.slice(0, 120)); process.exit(1); }
  const c = s.split(j.old).length - 1;
  if (j.once !== false && c !== 1) { console.error('AMBIGUOUS (' + c + ') in ' + p + ':\n' + j.old.slice(0, 120)); process.exit(1); }
  s = s.replace(j.old, j.new);
  fs.writeFileSync(p, s, 'utf8');
  n++;
  console.log('patched ' + p);
}
console.log(n + ' file(s)');