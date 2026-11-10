const fs = require('fs');
const { PNG } = require('pngjs');
const src = PNG.sync.read(fs.readFileSync('.workbuddy/render/pages-mine-mine.png'));
function crop(x, y, w, h, scale, out) {
  const dst = new PNG({ width: w * scale, height: h * scale });
  for (let j = 0; j < h * scale; j++) for (let i = 0; i < w * scale; i++) {
    const si = ((y + Math.floor(j / scale)) * src.width + (x + Math.floor(i / scale))) * 4;
    const di = (j * w * scale + i) * 4;
    dst.data[di] = src.data[si]; dst.data[di+1] = src.data[si+1]; dst.data[di+2] = src.data[si+2]; dst.data[di+3] = src.data[si+3];
  }
  fs.writeFileSync(out, PNG.sync.write(dst));
}
crop(40, 880, 360, 90, 3, '.workbuddy/render/_crop1.png');
crop(40, 1470, 360, 80, 3, '.workbuddy/render/_crop2.png');
console.log('ok');
