const fs = require('fs');
const { PNG } = require('pngjs');
const p = PNG.sync.read(fs.readFileSync('miniprogram/images/tab/home.png'));
const px = (x, y) => { const i = (y * p.width + x) * 4; return [p.data[i], p.data[i+1], p.data[i+2], p.data[i+3]]; };
console.log('size', p.width, p.height);
for (const [x, y] of [[0,0],[1,1],[2,2],[40,1],[40,2],[5,40],[80,80],[40,40]]) console.log(x,y,px(x,y));
