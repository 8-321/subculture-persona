const fs = require('fs');
const f = '04-测试体系/题库_爆款版.csv';
if (fs.existsSync(f)) {
  let s = fs.readFileSync(f, 'utf8');
  const n = (s.match(/——/g) || []).length;
  s = s.replace(/——(?=([",\r\n]))/g, '？');
  fs.writeFileSync(f, s, 'utf8');
  console.log('csv dash:', n, '->', (s.match(/——/g) || []).length);
}
