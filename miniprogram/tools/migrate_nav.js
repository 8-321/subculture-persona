/**
 * 一次性迁移脚本：把散落各页的 UI.go / UI.tab / wx.navigateTo / wx.switchTab
 * 统一收敛到 utils/nav.js（带转场标记 + 音效 + 震动 + 页面栈守卫）。
 * 用完即删，不参与打包。
 */
const fs = require('fs');
const path = require('path');

const PAGES = path.join(__dirname, '..', 'pages');
const HERO = ['shop-detail', 'post-detail', 'test-detail'];

function pick(url) {
  if (HERO.some((k) => url.indexOf('pages/' + k + '/') >= 0)) return 'Nav.hero';
  return 'Nav.push';
}

function convert(src) {
  let s = src;

  // UI.go('/pages/x/y?a=1') → Nav.push(...) / Nav.hero(...)
  s = s.replace(/UI\.go\((\s*)('[^']*')/g, (m, sp, url) => pick(url) + '(' + sp + url);
  // UI.go('/pages/x/y' + expr)
  s = s.replace(/UI\.go\(/g, 'Nav.push(');
  s = s.replace(/UI\.tab\(/g, 'Nav.tab(');

  // wx.navigateTo({ url: 'X' }) / wx.navigateTo({ url: X })
  s = s.replace(/wx\.navigateTo\(\{\s*url:\s*('[^']*')\s*\}\)/g, (m, url) => pick(url) + '(' + url + ')');

  // wx.switchTab({ url: 'X' })
  s = s.replace(/wx\.switchTab\(\{\s*url:\s*('[^']*')\s*\}\)/g, (m, url) => 'Nav.tab(' + url + ')');

  // wx.navigateBack({ delta: 1 })
  s = s.replace(/wx\.navigateBack\(\{\s*delta:\s*\d+\s*\}\)/g, 'Nav.back()');

  return s;
}

function addRequire(src, file) {
  if (src.indexOf("utils/nav.js") >= 0) return src;
  const depth = path.relative(path.join(__dirname, '..'), file).split(path.sep).length - 2;
  const up = new Array(depth + 1).join('../') || './';
  const line = "const Nav = require('" + up + "utils/nav.js');\n";
  // 插在最后一个 require 之后
  const lines = src.split('\n');
  let last = -1;
  lines.forEach((l, i) => { if (/^\s*const\s+\w+\s*=\s*require\(/.test(l)) last = i; });
  if (last < 0) return line + src;
  lines.splice(last + 1, 0, line.replace(/\n$/, ''));
  return lines.join('\n');
}

let changed = 0;
fs.readdirSync(PAGES).forEach((dir) => {
  const f = path.join(PAGES, dir, dir + '.js');
  if (!fs.existsSync(f)) return;
  let src = fs.readFileSync(f, 'utf8');
  if (!/(UI\.go\(|UI\.tab\(|wx\.navigateTo|wx\.switchTab|wx\.navigateBack)/.test(src)) return;
  const next = addRequire(convert(src), f);
  if (next !== src) {
    fs.writeFileSync(f, next, 'utf8');
    changed += 1;
    console.log('  ' + dir + '.js');
  }
});
console.log('迁移 ' + changed + ' 个页面');
