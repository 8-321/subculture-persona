const fs = require('fs');
const p = 'package.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
j.version = '1.1.1';
j.scripts.audit = 'node tools/preview/audit_all.js';
j.scripts.shot = 'node tools/preview/render.js';
fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
console.log('version', j.version, 'scripts', Object.keys(j.scripts).join(','));
