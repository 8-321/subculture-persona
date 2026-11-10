// 由站内唯一法务文本生成可直接托管的静态页面（HTTPS 链接给微信后台用）
// 用法：node tools/build_legal_site.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const L = require('../miniprogram/data/legal.js');
const Site = require('../miniprogram/utils/site.js');

const OUT = path.join(__dirname, '..', '05-需求V3', 'legal-site');
const ORDER = ['privacy', 'terms', 'minor'];

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shell(title, body, active) {
  const nav = ORDER.map((k) =>
    '<a class="' + (k === active ? 'on' : '') + '" href="' + k + '.html">' + esc(L.TITLE[k]) + '</a>'
  ).join('');
  return '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n' +
    '<meta charset="UTF-8" />\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />\n' +
    '<meta name="color-scheme" content="light" />\n' +
    '<title>' + esc(title) + ' · ' + esc(Site.brand) + '</title>\n' +
    '<style>\n' + CSS + '</style>\n</head>\n<body>\n' +
    '<main class="wrap">\n' +
    '<header class="brand"><div class="mark">' + esc(Site.brand) + '</div>' +
    '<div class="sub">亚文化人格测试与文化档案</div></header>\n' +
    '<nav class="tabs">' + nav + '</nav>\n' +
    body +
    '<footer class="foot">' +
    '<div>' + esc(Site.brand) + ' · 版本 ' + esc(Site.version) + ' · 更新于 ' + esc(L.UPDATED) + '</div>' +
    (Site.operator ? '<div>运营主体：' + esc(Site.operator) + '</div>' : '') +
    (Site.icp ? '<div>备案号：' + esc(Site.icp) + '</div>' : '') +
    '<div>本页与小程序内文本同源生成，如有差异以小程序内最新版本为准。</div>' +
    '</footer>\n</main>\n</body>\n</html>\n';
}

const CSS = [
  ':root{--bg:#F5F5F6;--card:#fff;--ink:#141418;--text:#111114;--sub:#6E6E76;--line:rgba(17,17,20,.12);}',
  '*{box-sizing:border-box}',
  'body{margin:0;background:var(--bg);color:var(--text);font-family:"PingFang SC","Microsoft YaHei","Source Han Sans SC",sans-serif;line-height:1.8;}',
  '.wrap{max-width:760px;margin:0 auto;padding:34px 24px 64px;}',
  '.brand{padding:18px 0 26px;border-bottom:1rpx solid var(--line);}',
  '.mark{font-family:"Songti SC","STSong","Noto Serif SC",serif;font-size:30px;font-weight:700;letter-spacing:6px;}',
  '.sub{font-size:12px;color:var(--sub);letter-spacing:2px;margin-top:8px;}',
  '.tabs{display:flex;gap:26px;padding:18px 0;border-bottom:1px solid var(--line);font-size:13px;}',
  '.tabs a{color:var(--sub);text-decoration:none;padding-bottom:6px;}',
  '.tabs a.on{color:var(--ink);font-weight:700;border-bottom:2px solid var(--ink);}',
  '.doc{padding-top:26px;}',
  '.kicker{font-size:12px;color:var(--sub);letter-spacing:3px;}',
  'h1{font-family:"Songti SC","STSong","Noto Serif SC",serif;font-size:30px;line-height:1.25;margin:10px 0 6px;letter-spacing:2px;}',
  '.meta{font-size:12px;color:var(--sub);margin-bottom:28px;}',
  'section{padding:18px 0;border-top:1px solid var(--line);}',
  'section:first-of-type{border-top:none;}',
  'h2{font-family:"Songti SC","STSong","Noto Serif SC",serif;font-size:18px;margin:0 0 10px;letter-spacing:1px;}',
  'p{font-size:14px;color:#2E2E34;margin:8px 0;}',
  '.contact{margin-top:30px;padding:22px 0;border-top:2px solid var(--ink);border-bottom:1px solid var(--line);}',
  '.contact .k{font-size:11px;color:var(--sub);letter-spacing:4px;}',
  '.contact .v{font-size:15px;font-weight:700;margin-top:8px;word-break:break-all;}',
  '.contact a{color:var(--ink);}',
  '.foot{margin-top:34px;padding-top:18px;border-top:1px solid var(--line);font-size:11px;color:var(--sub);line-height:1.9;}',
  '.index a{display:block;padding:18px 0;border-top:1px solid var(--line);color:var(--ink);text-decoration:none;}',
  '.index a:first-child{border-top:none;}',
  '.index .t{font-family:"Songti SC","STSong","Noto Serif SC",serif;font-size:19px;font-weight:700;}',
  '.index .d{font-size:12px;color:var(--sub);margin-top:4px;}',
  '@media (min-width:720px){.wrap{padding-left:36px;padding-right:36px;}}'
].join('\n');

function contactBlock() {
  const rows = [];
  if (Site.operator) rows.push('<div class="v">运营主体：' + esc(Site.operator) + '</div>');
  if (Site.mail) rows.push('<div class="v">邮箱：' + esc(Site.mail) + '</div>');
  if (Site.privacyUrl) rows.push('<div class="v">在线地址：<a href="' + esc(Site.privacyUrl) + '">' + esc(Site.privacyUrl) + '</a></div>');
  return '<div class="contact"><div class="k">联系我们</div>' + (rows.join('') || '<div class="v">联系方式待配置</div>') + '</div>';
}

function docPage(type) {
  const sections = L.MAP[type].map((s) =>
    '<section><h2>' + esc(s.h) + '</h2>' + s.ps.map((p) => '<p>' + esc(p) + '</p>').join('') + '</section>'
  ).join('');
  const body = '<article class="doc"><div class="kicker">' + esc(L.KICKER[type]) + '</div>' +
    '<h1>' + esc(L.TITLE[type]) + '</h1>' +
    '<div class="meta">更新日期：' + esc(L.UPDATED) + ' · 适用版本：' + esc(Site.version) + '</div>' +
    sections + contactBlock() + '</article>';
  return shell(L.TITLE[type], body, type);
}

function indexPage() {
  const links = ORDER.map((k) =>
    '<a href="' + k + '.html"><div class="t">' + esc(L.TITLE[k]) + '</div><div class="d">' + esc(L.KICKER[k]) + '</div></a>'
  ).join('');
  return shell('法律与隐私', '<article class="doc index"><div class="kicker">公开文件</div><h1>法律与隐私</h1>' +
    '<div class="meta">' + esc(L.UPDATED) + ' · 与小程序内文本同源</div>' + links + '</article>', '');
}

fs.mkdirSync(OUT, { recursive: true });
const files = [];
files.push(['index.html', indexPage()]);
ORDER.forEach((k) => files.push([k + '.html', docPage(k)]));
files.forEach(([name, html]) => {
  const full = path.join(OUT, name);
  fs.writeFileSync(full, html, 'utf8');
  const buf = fs.readFileSync(full);
  console.log(name + '  ' + buf.length + ' bytes  sha256 ' + crypto.createHash('sha256').update(buf).digest('hex').slice(0, 16));
});
console.log('输出目录：' + OUT);
if (Site.mailIsPlaceholder) console.log('提醒：邮箱仍是占位，发布前改 miniprogram/utils/site.js 并重跑。');
if (!Site.privacyUrl) console.log('提醒：privacyUrl 为空；托管后把真实 HTTPS 地址填回 site.js。');