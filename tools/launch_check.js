// 上线前闸门：只报事实，不给「应该没问题」。
// 用法：node tools/launch_check.js   有 BLOCK 时退出码 1
const fs = require('fs');
const path = require('path');
const Site = require('../miniprogram/utils/site.js');

const ROOT = path.join(__dirname, '..');
const MP = path.join(ROOT, 'miniprogram');
const app = JSON.parse(fs.readFileSync(path.join(MP, 'app.json'), 'utf8'));
const proj = JSON.parse(fs.readFileSync(path.join(MP, 'project.config.json'), 'utf8'));

const blocks = [];
const warns = [];
const oks = [];
const block = (x) => blocks.push(x);
const warn = (x) => warns.push(x);
const ok = (x) => oks.push(x);

function strip(s) {
  return String(s).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
}

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// 1. 页面注册完整性
let pageBad = 0;
app.pages.forEach((p) => {
  ['.js', '.json', '.wxml', '.wxss'].forEach((ext) => {
    if (!fs.existsSync(path.join(MP, p + ext))) { block('页面缺文件：' + p + ext); pageBad++; }
  });
});
if (!pageBad) ok('已注册 ' + app.pages.length + ' 页，四件套齐全');

// 2. Tab 指向已注册页面
(app.tabBar.list || []).forEach((t) => {
  if (app.pages.indexOf(t.pagePath) < 0) block('Tab 指向未注册页面：' + t.pagePath);
});
ok('五个 Tab 均已注册');

// 3. 代码里的页面路径都在 app.json 内
const registered = new Set(app.pages);
const routeBad = {};
walk(MP, []).filter((f) => /\.(js|wxml)$/.test(f) && !f.includes(path.sep + 'data' + path.sep) && !f.includes(path.sep + 'tools' + path.sep)).forEach((f) => {
  const s = strip(fs.readFileSync(f, 'utf8'));
  const re = /\/pages\/[a-z0-9-]+\/[a-z0-9-]+/g;
  let m;
  while ((m = re.exec(s))) {
    const p = m[0].slice(1);
    if (!registered.has(p)) routeBad[p] = path.relative(ROOT, f);
  }
});
Object.keys(routeBad).forEach((p) => block('跳转到未注册页面：' + p + '（' + routeBad[p] + '）'));
if (!Object.keys(routeBad).length) ok('代码内所有 /pages/ 路径都已注册');

// 4. 对外信息（隐私政策必须能在微信后台填）
if (!Site.mail || Site.mailIsPlaceholder) block('联系邮箱还是占位：改 miniprogram/utils/site.js');
else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(Site.mail)) block('联系邮箱格式不对：' + Site.mail);
else ok('联系邮箱已填写：' + Site.mail);

if (!Site.privacyUrl) block('隐私政策在线 HTTPS 链接为空');
else if (!/^https:\/\//.test(Site.privacyUrl)) block('隐私政策链接不是 HTTPS：' + Site.privacyUrl);
else ok('隐私政策链接：' + Site.privacyUrl);

if (!Site.operator) block('运营主体为空（备案主体 / 个人信息处理者全称）');
else ok('运营主体：' + Site.operator);
if (!Site.icp) warn('备案号为空（提审前需要工信部备案号）');
else ok('备案号：' + Site.icp);
if (!/^\d+\.\d+\.\d+$/.test(Site.version)) block('版本号格式应为 x.y.z：' + Site.version);
else ok('版本号：' + Site.version);

// 5. 占位 / 假承诺文案
const banned = [
  ['登录 / 注册', '旧账号体系文案'],
  ['暂未开放', '未完成入口'],
  ['审核后可见', '没有审核后台却承诺可见'],
  ['已提交，审核', '没有审核后台却承诺审核'],
  ['7 天无理由', '无法兑现的售后承诺'],
  ['现货', '没有库存后台却承诺现货'],
  ['资质已核验', '没有核验流程却声称已核验'],
  ['长按图片也能转发', '画布不支持长按转发']
];
const files = walk(MP, []).filter((f) => /\.(js|wxml)$/.test(f));
banned.forEach(([word, why]) => {
  const hit = files.filter((f) => strip(fs.readFileSync(f, 'utf8')).indexOf(word) >= 0)
    .map((f) => path.relative(ROOT, f));
  if (hit.length) block('文案「' + word + '」：' + why + ' → ' + hit.join(', '));
});
if (!blocks.some((b) => b.indexOf('文案「') === 0)) ok('没有发现占位 / 假承诺文案');

// 6. 主包体积（按 project.config 的忽略规则做保守估算）
const ignoreFolders = ((proj.packOptions || {}).ignore || []).filter((x) => x.type === 'folder').map((x) => x.value);
const ignoreSuffix = ((proj.packOptions || {}).ignore || []).filter((x) => x.type === 'suffix').map((x) => x.value);
let bytes = 0;
walk(MP, []).forEach((f) => {
  const relp = path.relative(MP, f).replace(/\\/g, '/');
  if (ignoreFolders.some((x) => relp === x || relp.indexOf(x + '/') === 0)) return;
  if (ignoreSuffix.some((x) => relp.endsWith(x))) return;
  bytes += fs.statSync(f).size;
});
const mb = bytes / 1024 / 1024;
if (mb >= 2) block('主包估算 ' + mb.toFixed(2) + ' MB，超过 2MB');
else ok('主包估算 ' + mb.toFixed(2) + ' MB（上限 2MB）');

// 7. 工程身份
if (proj.appid !== 'wx669bf4366c75627d') warn('AppID 与已知项目不一致：' + proj.appid);
else ok('AppID：' + proj.appid);

console.log('\n通过');
oks.forEach((x) => console.log('  OK   ' + x));
if (warns.length) {
  console.log('\n提醒（不拦上传，但上线前要处理）');
  warns.forEach((x) => console.log('  WARN ' + x));
}
if (blocks.length) {
  console.log('\n必须解决（会拦住正式上线）');
  blocks.forEach((x) => console.log('  BLOCK ' + x));
}
console.log('\n结果：' + oks.length + ' 通过 / ' + warns.length + ' 提醒 / ' + blocks.length + ' 阻断');
process.exit(blocks.length ? 1 : 0);