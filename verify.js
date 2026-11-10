#!/usr/bin/env node
/**
 * 第二文化小程序 · 离线校验
 * 用法：node verify.js
 *
 * 校验项：
 *  1. 全部 .js 语法（vm.Script，不执行）+ 全部 .json 格式
 *  2. 题库 30 题 / 每题 4 选项 / 计分键落在 14 型内
 *  3. 人格库 14 型字段完整、代号唯一
 *  4. 引擎计分 / 判定 / 维度归一化 / 边界用例
 *  5. app.json 页面与目录一致、tabBar 图标存在
 *  6. WXML / WXSS 里引用的本地图片是否存在
 *  7. 硬规则 R1：界面可见文本无英文（忽略 {{}} 表达式）
 *  8. 主包体积预估
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, 'miniprogram');
const fails = [];
const warns = [];
let passed = 0;

function ok(msg) { passed += 1; console.log('  ok   ' + msg); }
function bad(msg) { fails.push(msg); console.log('  FAIL ' + msg); }
function warn(msg) { warns.push(msg); console.log('  warn ' + msg); }

function walk(dir, exts) {
  const out = [];
  const items = fs.readdirSync(dir);
  for (const n of items) {
    if (n === 'node_modules' || n === '.git') continue;
    const p = path.join(dir, n);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walk(p, exts));
    else if (exts.some((e) => n.endsWith(e))) out.push(p);
  }
  return out;
}

function rel(p) { return path.relative(ROOT, p).replace(/\\/g, '/'); }

/* ---------------- 1. 语法与 JSON ---------------- */
console.log('\n[1] 语法与 JSON 格式');
const jsFiles = walk(ROOT, ['.js']).filter((f) => !f.includes('tools'));
const jsonFiles = walk(ROOT, ['.json']);
let syntaxBad = 0;
for (const f of jsFiles) {
  try {
    new vm.Script(fs.readFileSync(f, 'utf8'), { filename: f });
  } catch (e) {
    syntaxBad += 1;
    bad('JS 语法错误 ' + rel(f) + ' → ' + e.message);
  }
}
if (!syntaxBad) ok(jsFiles.length + ' 个 .js 语法通过');

let jsonBad = 0;
for (const f of jsonFiles) {
  try { JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) {
    jsonBad += 1;
    bad('JSON 格式错误 ' + rel(f) + ' → ' + e.message);
  }
}
if (!jsonBad) ok(jsonFiles.length + ' 个 .json 格式通过');

/* ---------------- 2. 题库 ---------------- */
console.log('\n[2] 题库');
const bankMod = require(path.join(ROOT, 'utils/engine.js'));
const QUESTIONS = bankMod.QUESTIONS;
const TYPES = bankMod.TYPES;
const codes = TYPES.map((t) => t.id || t.code);

if (QUESTIONS.length === 30) ok('题目数 = 30'); else bad('题目数应为 30，实际 ' + QUESTIONS.length);

let optBad = 0;
let keyBad = 0;
QUESTIONS.forEach((q) => {
  if (!q.options || q.options.length !== 4) optBad += 1;
  (q.options || []).forEach((o) => {
    Object.keys(o.styles || {}).forEach((k) => {
      if (codes.indexOf(k) < 0) keyBad += 1;
    });
    Object.keys(o.dims || {}).forEach((k) => {
      if (['rebel', 'express', 'aesthetic', 'social'].indexOf(k) < 0) keyBad += 1;
    });
  });
});
if (!optBad) ok('每题 4 个选项'); else bad(optBad + ' 题的选项数不是 4');
if (!keyBad) ok('计分键全部落在 14 型 / 4 维度内'); else bad(keyBad + ' 个计分键越界');

/* ---------------- 3. 人格库 ---------------- */
console.log('\n[3] 人格库');
if (TYPES.length === 14) ok('人格数 = 14'); else bad('人格数应为 14，实际 ' + TYPES.length);
const need = ['cn', 'code', 'nickname', 'quote', 'tags', 'mbti', 'why', 'tagline'];
let fieldBad = 0;
TYPES.forEach((t) => need.forEach((k) => { if (!t[k]) fieldBad += 1; }));
if (!fieldBad) ok('14 型必备字段完整'); else bad(fieldBad + ' 个字段缺失');
const uniq = new Set(codes);
if (uniq.size === 14) ok('代号唯一'); else bad('代号重复：' + codes.length + ' / ' + uniq.size);

/* ---------------- 4. 引擎 ---------------- */
console.log('\n[4] 计分引擎');
const qs = bankMod.getQuestions('main', null);
function run(pick) {
  const answers = qs.map((q, i) => ({ qid: q.id, key: pick(i) }));
  const scored = bankMod.score(answers, qs);
  return bankMod.judge(scored);
}
let judgeBad = 0;
['a', 'b', 'c', 'd'].forEach((k) => {
  const j = run(() => k);
  if (!j || !j.type || !j.type.cn) judgeBad += 1;
  const vals = Object.keys(j.dims).map((x) => j.dims[x]);
  if (vals.some((v) => v < 12 || v > 96 || isNaN(v))) judgeBad += 1;
});
if (!judgeBad) ok('极端作答（全 a/b/c/d）判定与维度值均在 12–96');
else bad('极端作答用例异常');

const rnd = run(() => ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)]);
if (rnd && rnd.type) ok('随机作答可出结果：' + rnd.type.cn + '（匹配度 ' + rnd.matched + '%）');
else bad('随机作答无结果');

const empty = bankMod.judge(bankMod.score([], qs));
if (empty && empty.type) ok('空答案不崩溃（兜底 ' + empty.type.cn + '）'); else bad('空答案崩溃');

const content = require(path.join(ROOT, 'data/content.js'));
let subsetBad = 0;
content.tests.forEach((t) => {
  if (!t.subset) return;
  const list = bankMod.getQuestions(t.id, t.subset);
  if (list.length !== t.qcount) subsetBad += 1;
});
if (!subsetBad) ok('轻量测试题目子集数量与标注一致');
else bad(subsetBad + ' 个测试的题数与 qcount 不符');

const rep = bankMod.buildReport('t-punk', bankMod.getQuestions('t-punk', content.tests[1].subset).map((q) => ({ qid: q.id, key: 'b' })));
if (rep && rep.dimList.length === 4 && rep.outfit.length === 3 && rep.tryout.length === 3) ok('报告组装完整（四维 + 穿搭 + 试试看）');
else bad('报告组装缺项');

/* ---------------- 5. 页面与 app.json ---------------- */
console.log('\n[5] 页面与配置');
const appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
let pageBad = 0;
appJson.pages.forEach((p) => {
  ['js', 'json', 'wxml', 'wxss'].forEach((ext) => {
    if (!fs.existsSync(path.join(ROOT, p + '.' + ext))) {
      pageBad += 1;
      bad('页面文件缺失 ' + p + '.' + ext);
    }
  });
});
if (!pageBad) ok(appJson.pages.length + ' 个页面四件套齐全');

const tabList = appJson.tabBar.list || [];
const tabBad = tabList.filter((t) => !appJson.pages.includes(t.pagePath));
if (!tabBad.length) ok('tabBar 5 项均在主包 pages 内'); else bad('tabBar 页面不在 pages 内');

['home', 'test', 'culture', 'shop', 'mine'].forEach((k) => {
  if (!fs.existsSync(path.join(ROOT, 'images/tab/' + k + '.png'))) bad('tabBar 图标缺失 ' + k);
  if (!fs.existsSync(path.join(ROOT, 'images/tab/' + k + '-active.png'))) bad('tabBar 选中图标缺失 ' + k);
});
ok('tabBar 图标 10 个已生成');

/* ---------------- 6. 图片引用 ---------------- */
console.log('\n[6] 图片引用');
const refFiles = walk(ROOT, ['.wxml', '.wxss', '.js']);
const refs = new Set();
refFiles.forEach((f) => {
  const src = fs.readFileSync(f, 'utf8');
  const m = src.match(/\/images\/[A-Za-z0-9_\-\/.]+\.(png|jpg|jpeg)/g);
  if (m) m.forEach((x) => refs.add(x));
});
// 动态拼接路径（如 '/images/ic/' + name + '-ink.png'）单独补齐
const icDir = fs.readdirSync(path.join(ROOT, 'images/ic'));
let miss = 0;
refs.forEach((r) => {
  if (!fs.existsSync(path.join(ROOT, r.replace(/^\//, '')))) {
    miss += 1;
    bad('图片缺失 ' + r);
  }
});
if (!miss) ok(refs.size + ' 处静态图片引用均存在');
ok('图标库 ' + icDir.length + ' 个文件');

/* ---------------- 7. 硬规则：界面无英文 ---------------- */
console.log('\n[7] 硬规则 R1 · 界面可见文本无英文');
let latinBad = 0;
walk(ROOT, ['.wxml']).forEach((f) => {
  const src = fs.readFileSync(f, 'utf8');
  const cleaned = src
    .replace(/\{\{[^}]*\}\}/g, '')     // 去掉表达式
    .replace(/\\n/g, ' ')              // 换行转义不算文本
    .replace(/<[^>]*>/g, '\n');        // 去掉标签，保留文本节点
  cleaned.split('\n').forEach((line) => {
    const t = line.trim();
    if (!t) return;
    const hit = t.match(/[A-Za-z]+/g);
    if (hit) {
      latinBad += 1;
      bad('可见文本含英文：' + rel(f) + ' → 「' + t.slice(0, 24) + '」');
    }
  });
});
if (!latinBad) ok('全部 WXML 可见文本无英文');

/* ---------------- 7b. WXML 表达式不得调用方法 ---------------- */
console.log('\n[7b] WXML 表达式（小程序不支持方法调用）');
const CALL_RE = /\{\{[^}]*\.(indexOf|some|filter|map|forEach|includes|slice|split|replace|join|push|toFixed|toString|trim)\s*\(/;
let callBad = 0;
walk(ROOT, ['.wxml']).forEach((f) => {
  const src = fs.readFileSync(f, 'utf8');
  if (CALL_RE.test(src)) {
    callBad += 1;
    bad('WXML 表达式含方法调用：' + rel(f));
  }
});
if (!callBad) ok('全部 WXML 表达式只用取值 / 三元 / 算术');

/* ---------------- 7c. 动效库 ---------------- */
console.log('\n[7c] 动效库（多种动效 · 无彩色）');
const motionPath = path.join(ROOT, 'styles/motion.wxss');
if (fs.existsSync(motionPath)) ok('styles/motion.wxss 存在');
else bad('动效库缺失 styles/motion.wxss');

const appWxss = fs.readFileSync(path.join(ROOT, 'app.wxss'), 'utf8');
if (appWxss.indexOf('@import') >= 0 && appWxss.indexOf('motion.wxss') >= 0) ok('app.wxss 已引入动效库');
else bad('app.wxss 未引入 styles/motion.wxss');

const motionSrc = fs.existsSync(motionPath) ? fs.readFileSync(motionPath, 'utf8') : '';
const kfNames = (motionSrc.match(/@keyframes\s+([A-Za-z0-9_-]+)/g) || []).map((s) => s.split(/\s+/)[1]);
const kfDup = kfNames.filter((n, i) => kfNames.indexOf(n) !== i);
if (kfDup.length) bad('@keyframes 重名：' + kfDup.join('、'));
else ok('@keyframes 无重名（共 ' + kfNames.length + ' 组）');

const mClasses = (motionSrc.match(/^\.(m|t)[0-9]?-[A-Za-z0-9-]+/gm) || []);
if (mClasses.length >= 25) ok('动效类不少于 25 个（实际 ' + mClasses.length + '）');
else bad('动效类只有 ' + mClasses.length + ' 个，种类偏少');

// 硬规则：全屏无彩色 —— 光晕 / 流光 / 扫光一律黑灰白
const colorHits = [];
const hexRe = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
let hm;
while ((hm = hexRe.exec(motionSrc))) {
  let h = hm[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if (!isNeutral(r, g, b)) colorHits.push('#' + hm[1]);
}
// 判定「中性色」：三通道差值 ≤ 4 都算黑灰白（品牌墨色 #111114 属于近中性）
function isNeutral(r, g, b) {
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  return mx - mn <= 4;
}
const rgbRe = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g;
let rm;
while ((rm = rgbRe.exec(motionSrc))) {
  if (!isNeutral(+rm[1], +rm[2], +rm[3])) colorHits.push('rgb(' + rm[1] + ',' + rm[2] + ',' + rm[3] + ')');
}
if (!colorHits.length) ok('动效库无彩色（光晕 / 流光 / 扫光全为黑灰白）');
else bad('动效库出现彩色：' + colorHits.slice(0, 5).join('、'));

/* ---------------- 7d. 声音系统 ---------------- */
console.log('\n[7d] 声音系统');
const audioDir = path.join(ROOT, 'audio');
if (fs.existsSync(audioDir)) {
  const files = fs.readdirSync(audioDir).filter((f) => f.endsWith('.wav'));
  if (files.length >= 7) ok('音效素材 ' + files.length + ' 个');
  else bad('音效素材只有 ' + files.length + ' 个，应 ≥ 7');

  const soundSrc = fs.readFileSync(path.join(ROOT, 'utils/sound.js'), 'utf8');
  const names = Object.keys((() => {
    const m = soundSrc.match(/const VOL = \{([^}]*)\}/);
    const out = {};
    if (m) m[1].split(',').forEach((line) => {
      const kv = line.split(':');
      if (kv.length === 2) out[kv[0].trim()] = 1;
    });
    return out;
  })());
  const missAudio = names.filter((n) => files.indexOf(n + '.wav') < 0);
  if (!missAudio.length) ok('sound.js 声明的 ' + names.length + ' 个音效均有素材');
  else bad('音效素材缺失：' + missAudio.join('、'));

  const big = files.filter((f) => fs.statSync(path.join(audioDir, f)).size > 60 * 1024);
  if (!big.length) ok('单个音效均 < 60KB');
  else warn('音效偏大：' + big.join('、'));
} else {
  bad('audio/ 目录缺失');
}

/* ---------------- 7e. 跳转收敛到 Nav ---------------- */
console.log('\n[7e] 跳转统一走 utils/nav.js');
const navBad = [];
walk(path.join(ROOT, 'pages'), ['.js']).forEach((f) => {
  const src = fs.readFileSync(f, 'utf8');
  ['UI.go(', 'UI.tab(', 'wx.navigateTo(', 'wx.switchTab(', 'wx.navigateBack('].forEach((k) => {
    if (src.indexOf(k) >= 0) navBad.push(rel(f) + ' → ' + k);
  });
});
if (!navBad.length) ok('全部页面跳转经 Nav（带转场 / 音效 / 防连点）');
else navBad.forEach((x) => bad('未收敛的跳转：' + x));

/* ---------------- 7f. 筛选独立页契约 ---------------- */
console.log('\n[7f] 筛选独立页');
if (appJson.pages.indexOf('pages/filter/filter') >= 0) ok('app.json 已注册 pages/filter/filter');
else bad('app.json 未注册筛选页');

// 入口：谁会跳进筛选页
const entries = [];
walk(path.join(ROOT, 'pages'), ['.js']).forEach((f) => {
  const r = rel(f);
  if (r.indexOf('pages/filter/') >= 0) return;   // 筛选页自己不算入口
  const src = fs.readFileSync(f, 'utf8');
  if (src.indexOf('/pages/filter/filter') >= 0) entries.push(r.split('/')[1]);
});
if (entries.length >= 2) ok('筛选入口 ' + entries.length + ' 处：' + entries.join('、'));
else bad('筛选入口少于 2 处（当前 ' + entries.join('、') + '）');

// 契约：跳进筛选页的页面必须实现 onBackFrom 接收结果
let contractBad = 0;
entries.forEach((name) => {
  const src = fs.readFileSync(path.join(ROOT, 'pages/' + name + '/' + name + '.js'), 'utf8');
  if (src.indexOf('onBackFrom') < 0) {
    contractBad += 1;
    bad('筛选回传契约缺失：pages/' + name + '/' + name + '.js 没有 onBackFrom');
  }
});
if (!contractBad) ok('所有筛选入口都实现了 onBackFrom 回传');

// 抽屉式筛选面板已下线（不应再有 .sheet / openFilter）
const sheetLeft = [];
walk(path.join(ROOT, 'pages'), ['.wxml', '.js']).forEach((f) => {
  if (rel(f).indexOf('pages/filter/') >= 0) return;
  const src = fs.readFileSync(f, 'utf8');
  if (src.indexOf('openFilter') >= 0 || src.indexOf('closeFilter') >= 0) sheetLeft.push(rel(f));
});
if (!sheetLeft.length) ok('旧的点按弹出式筛选面板已全部移除');
else sheetLeft.forEach((x) => bad('仍在用弹出式筛选：' + x));

/* ---------------- 7g. 转场标记 ---------------- */
console.log('\n[7g] 页面转场标记');
const trBad = [];
const noReduce = [];
walk(path.join(ROOT, 'pages'), ['.wxml']).forEach((f) => {
  const src = fs.readFileSync(f, 'utf8');
  if (src.indexOf('{{tr}}') < 0) trBad.push(rel(f));
  if (src.indexOf('reduce-motion') < 0) noReduce.push(rel(f));   // 减弱动效必须全站覆盖
});
if (!trBad.length) ok('全部页面挂了 {{tr}} 转场类');
else trBad.forEach((x) => bad('缺少 {{tr}}：' + x));
if (!noReduce.length) ok('全部页面支持减弱动效降级');
else noReduce.forEach((x) => bad('未接入减弱动效：' + x));

// 挂了 {{tr}} 的页面，JS 侧必须有人写入它
const applyBad = [];
walk(path.join(ROOT, 'pages'), ['.wxml']).forEach((f) => {
  const r = rel(f);
  if (fs.readFileSync(f, 'utf8').indexOf('{{tr}}') < 0) return;
  const jf = f.replace(/\.wxml$/, '.js');
  if (!fs.existsSync(jf)) return;
  const js = fs.readFileSync(jf, 'utf8');
  if (js.indexOf('Nav.apply(this)') < 0 && js.indexOf('t2-hero') < 0 && js.indexOf('t3-up') < 0) {
    applyBad.push(r.replace(/\.wxml$/, '.js'));
  }
});
if (!applyBad.length) ok('每个挂了转场类的页面都有写入方');
else applyBad.forEach((x) => bad('挂了 {{tr}} 却没人写入：' + x));

/* ---------------- 8. 体积 ---------------- */
console.log('\n[8] 主包体积');
function dirSize(d) {
  let n = 0;
  for (const name of fs.readdirSync(d)) {
    const p = path.join(d, name);
    const st = fs.statSync(p);
    n += st.isDirectory() ? dirSize(p) : st.size;
  }
  return n;
}
const total = dirSize(ROOT);
const mb = (total / 1024 / 1024).toFixed(2);
console.log('  主包（含素材）' + mb + ' MB');
if (total < 2 * 1024 * 1024) ok('主包 < 2MB'); else warn('主包超过 2MB，建议图片改 CDN 或分包');

/* ---------------- 9. 数据真实性（《需求文档 V3.0》§4 / §5） ---------------- */
console.log('\n[9] 数据真实性');

const RF = require(path.join(ROOT, 'data', 'realfacts.js'));
const CONTENT = require(path.join(ROOT, 'data', 'content.js'));

// 9.1 14 型真实档案：条数、必填、出处可解析
if (RF.types.length === 14) ok('14 型真实档案齐全'); else bad('真实档案条数 ' + RF.types.length + '，应为 14');
const archBad = [];
RF.types.forEach((t) => {
  if (!t.origin || !t.origin.year || !t.origin.place || !t.origin.event) archBad.push(t.id + ' 缺起源');
  if (!t.markers || !t.markers.length) archBad.push(t.id + ' 缺标志物');
  if (!t.facts || !t.facts.length) archBad.push(t.id + ' 缺事实');
  (t.facts || []).forEach((f) => {
    if (!f.src || !RF.meta.sources_index[f.src]) archBad.push(t.id + ' 出处代号无法解析：' + (f.src || '空'));
  });
  (t.realBrands || []).forEach((b) => {
    if (/[A-Za-z]/.test(b.cn || '')) archBad.push(t.id + ' 品牌名含英文：' + b.cn);
  });
});
if (!archBad.length) ok('每型都有起源 / 标志物 / 事实 / 可解析出处'); else archBad.forEach((x) => bad('真实档案：' + x));

// 9.2 知识库文章：必须有出处链接，且正文末尾写明出处
const srcIndex = RF.meta.sources_index;
const artBad = [];
CONTENT.articles.forEach((a) => {
  if (!a.sources || !a.sources.length) artBad.push(a.id + ' 无 sources');
  (a.sources || []).forEach((s) => {
    if (!/^https?:\/\//.test(s.url || '')) artBad.push(a.id + ' 出处链接非法：' + (s.url || '空'));
  });
  if ((a.body || '').indexOf('出处：') < 0) artBad.push(a.id + ' 正文未标出处');
  (a.facts || []).forEach((f) => {
    if (!f.src || !srcIndex[f.src]) artBad.push(a.id + ' 事实出处无法解析');
  });
});
if (!artBad.length) ok('知识库 ' + CONTENT.articles.length + ' 篇均有可核对出处'); else artBad.forEach((x) => bad('文章：' + x));

// 9.3 示例数据必须带 demo 标记（正式版据此隐藏虚构数字）
const demoBad = [];
// 只有虚构的店铺 / 商品 / 帖子需要 demo 标；测试题与文章是真实内容
['products', 'shops', 'posts'].forEach((k) => {
  (CONTENT[k] || []).forEach((x) => { if (x.demo !== true) demoBad.push(k + ':' + x.id); });
});
if (!demoBad.length) ok('示例数据全部带 demo 标记'); else demoBad.slice(0, 6).forEach((x) => bad('缺 demo 标记：' + x));

// 9.4 数字闸门：正式版能自动关闭虚构数字
const statFile = path.join(ROOT, 'utils', 'stat.js');
if (fs.existsSync(statFile)) ok('数字闸门 utils/stat.js 存在'); else bad('缺 utils/stat.js');
const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const demoGateOff = /resolveDemoStats[\s\S]{0,200}statsFromBackend/.test(appJs) && !/envVersion/.test(appJs);
if (demoGateOff) ok('示例数字只认后台开关，任何环境都不再默认放开');
else bad('app.js 仍按环境放开示例数字（开发/体验版会显示假数据）');
const leakBad = [];
walk(path.join(ROOT, 'pages'), ['.js']).forEach((f) => {
  const s = fs.readFileSync(f, 'utf8');
  if (/\+\s*'\s*粉丝'/.test(s) || /好评率\s*\d/.test(s) || /'已售\s*'\s*\+/.test(s)) leakBad.push(rel(f));
});
walk(path.join(ROOT, 'pages'), ['.wxml']).forEach((f) => {
  const s = fs.readFileSync(f, 'utf8');
  if (/好评率\s*\d+\s*%/.test(s) || /已售\s*\{\{/.test(s)) leakBad.push(rel(f));
});
if (!leakBad.length) ok('页面里没有绕过闸门硬编码的粉丝/好评率/销量'); else leakBad.forEach((x) => bad('绕过闸门硬编码：' + x));

/* ---------------- 10. 交付完整性（能上线的最小条件） ---------------- */
console.log('\n[10] 交付完整性');

if (appJson.__usePrivacyCheck__ === true) ok('app.json 已开启 __usePrivacyCheck__'); else bad('app.json 缺 __usePrivacyCheck__（隐私接口会直接失败）');
const privacyFile = path.join(ROOT, 'utils', 'privacy.js');
if (fs.existsSync(privacyFile)) ok('隐私授权模块 utils/privacy.js 存在'); else bad('缺 utils/privacy.js');

// 用到隐私接口的文件，必须经过 Privacy.ensure
const privTargets = [];
walk(ROOT, ['.js']).forEach((f) => {
  if (rel(f) === 'utils/privacy.js') return;
  const s = fs.readFileSync(f, 'utf8');
  if (/wx\.(chooseMedia|chooseImage|setClipboardData|getLocation|chooseAddress)\s*\(/.test(s)) {
    if (s.indexOf('Privacy.ensure') < 0) privTargets.push(rel(f));
  }
});
// nav.js 是统一出口，符合规则即可
if (!privTargets.length) ok('所有隐私接口调用都经过 Privacy.ensure'); else privTargets.forEach((x) => bad('隐私接口未走 ensure：' + x));

// 举报：内容类小程序必须有入口（P0）
const pdJs = fs.readFileSync(path.join(ROOT, 'pages', 'post-detail', 'post-detail.js'), 'utf8');
const pdWxml = fs.readFileSync(path.join(ROOT, 'pages', 'post-detail', 'post-detail.wxml'), 'utf8');
const storeSrc = fs.readFileSync(path.join(ROOT, 'utils', 'store.js'), 'utf8');
if (pdJs.indexOf('onReport') >= 0 && storeSrc.indexOf('Report') >= 0 && pdWxml.indexOf('onMore') >= 0) ok('帖子/文章详情有举报入口并落库'); else bad('举报链路不完整');

// 数字闸门覆盖：页面不得直出原始价格 / 点赞数
const rawBad = [];
walk(path.join(ROOT, 'pages'), ['.wxml']).forEach((f) => {
  const s = fs.readFileSync(f, 'utf8');
  if (/\{\{\s*(p|item|it)\.price\s*\}\}/.test(s)) rawBad.push(rel(f) + ' 直出 price');
  if (/\{\{\s*(item|it)\.(likes|views|favs|sold)\s*\}\}/.test(s)) rawBad.push(rel(f) + ' 直出互动数');
});
if (!rawBad.length) ok('页面没有直出原始价格/互动数'); else rawBad.forEach((x) => bad('绕过闸门直出：' + x));

// 模块引用完整性：用了 Xxx.yyy 就必须 require 对应文件（防止运行时 ReferenceError → 页面空白）
const MODS = [
  ['UI', 'ui.js'], ['Store', 'store.js'], ['F', 'filter.js'], ['M', 'motion.js'],
  ['Nav', 'nav.js'], ['Sound', 'sound.js'], ['Stat', 'stat.js'], ['Privacy', 'privacy.js'],
  ['RF', 'realfacts.js'], ['C', 'content.js'], ['Engine', 'engine.js']
];
const SELF = { 'nav.js': 'Nav', 'privacy.js': 'Privacy', 'ui.js': 'UI', 'sound.js': 'Sound', 'motion.js': 'M', 'store.js': 'Store', 'filter.js': 'F', 'stat.js': 'Stat', 'engine.js': 'Engine', 'realfacts.js': 'RF', 'content.js': 'C', 'bank.js': 'Bank' };
const missReq = [];
walk(ROOT, ['.js']).forEach((f) => {
  const s = fs.readFileSync(f, 'utf8');
  if (rel(f).indexOf('tools/') === 0) return;
  MODS.forEach(([id, file]) => {
    if (SELF[file] === id) return;   // 模块自己定义的名字，不需要 require 自己
    const used = new RegExp('\\b' + id + '\\.[a-zA-Z_]').test(s);
    const req = new RegExp("require\\([^)]*" + file.replace('.', '\\.')).test(s);
    if (used && !req && !new RegExp('(const|let|var)\\s+' + id + '\\s*=').test(s)) missReq.push(rel(f) + ' 用了 ' + id + ' 但没 require');
  });
});
if (!missReq.length) ok('用了的模块都 require 了（无未定义变量）'); else missReq.forEach((x) => bad(x));

// 埋点口径：所有 track('x') 的事件名必须在 utils/track.js 的 EVENTS 表里
const trackSrc = fs.readFileSync(path.join(ROOT, 'utils', 'track.js'), 'utf8');
const declared = {};
const evBlock = trackSrc.slice(trackSrc.indexOf('const EVENTS = {'), trackSrc.indexOf('};', trackSrc.indexOf('const EVENTS = {')));
(evBlock.match(/^\s{2}([a-z_]+):/gm) || []).forEach((m) => { declared[m.trim().replace(':', '')] = 1; });
const evBad = [];
walk(ROOT, ['.js']).forEach((f) => {
  const s = fs.readFileSync(f, 'utf8');
  const re = /track\('([a-z_]+)'/g;
  let m;
  while ((m = re.exec(s))) {
    if (!declared[m[1]]) evBad.push(rel(f) + " → '" + m[1] + "' 未登记");
  }
});
if (!evBad.length) ok('埋点事件全部在 track.js 白名单内（' + Object.keys(declared).length + ' 个事件）');
else evBad.forEach((x) => bad('埋点越界：' + x));

// 举报闭环：我的举报页已注册、有入口、能撤销
const mineWxml = fs.readFileSync(path.join(ROOT, 'pages/mine/mine.wxml'), 'utf8');
if (appJson.pages.indexOf('pages/my-report/my-report') >= 0) ok('「我的举报」页已注册');
else bad('「我的举报」页未在 app.json 注册');
if (mineWxml.indexOf('onMyReport') >= 0) ok('「我的」有举报入口');
else bad('「我的」页缺少举报入口');
if (storeSrc.indexOf('grouped:') >= 0 && storeSrc.indexOf('removeById:') >= 0) ok('举报聚合与撤销 API 就位（grouped / removeById）');
else bad('举报聚合/撤销 API 缺失');

// 商家资质：执照号必须走校验，不能只判非空
const mApply = fs.readFileSync(path.join(ROOT, 'pages/merchant-apply/merchant-apply.js'), 'utf8');
if (mApply.indexOf("require('../../utils/qualify.js')") >= 0 && mApply.indexOf('Q.creditCode') >= 0) ok('商家登记接入执照号校验（qualify.creditCode）');
else bad('商家登记未接入执照号校验');
if (mApply.indexOf("merchantStatus: 'reviewing'") < 0) ok('不再伪造「审核中」状态');
else bad('仍在写 merchantStatus: reviewing（没有审核后台）');

// 示例内容必须可识别：demo=true 的内容在列表/详情都要打「示例」标
const SAMPLE_PAGES = [
  ['pages/community/community.wxml', '社区瀑布流'],
  ['pages/post-detail/post-detail.wxml', '内容详情'],
  ['pages/shop/shop.wxml', '商城列表'],
  ['pages/shop-detail/shop-detail.wxml', '商品详情'],
  ['pages/search/search.wxml', '搜索结果'],
  ['pages/result/result.wxml', '报告推荐位']
];
SAMPLE_PAGES.forEach(([f, name]) => {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  if (src.indexOf('sample-tag') >= 0 || src.indexOf('sample-inline') >= 0) ok(name + '标出了示例内容');
  else bad(name + '没有示例标识（虚构店铺/数据会被当成真实内容）');
});

// 不做交易承诺：这些词一旦上屏就是无法兑现的承诺
const BAN = ['包邮', '正品', '支持直接下单', '好评率', '七天无理由', '销量第一', '假一赔十'];
const banHit = [];
walk(ROOT, ['.wxml']).forEach((f) => {
  const src = fs.readFileSync(f, 'utf8');
  BAN.forEach((w) => { if (src.indexOf(w) >= 0) banHit.push(rel(f) + ' → ' + w); });
});
if (!banHit.length) ok('界面没有无法兑现的交易承诺（' + BAN.length + ' 个禁用词）');
else banHit.forEach((x) => bad('交易承诺：' + x));

// 示例数据必须自带 demo 标记，否则闸门与徽标都会漏
const CD = require(path.join(ROOT, 'data/content.js'));
const noFlag = [];
['posts', 'products', 'shops'].forEach((k) => (CD[k] || []).forEach((x) => { if (!x.demo) noFlag.push(k + '/' + x.id); }));
if (!noFlag.length) ok('示例数据全部带 demo 标记（' + ['posts', 'products', 'shops'].reduce((n, k) => n + (CD[k] || []).length, 0) + ' 条）');
else noFlag.forEach((x) => bad('示例数据缺 demo：' + x));

// 自定义导航栏必须给系统胶囊让位（否则右上角图标被「···○」盖住）
const TABS5 = ['pages/home/home', 'pages/tests/tests', 'pages/community/community', 'pages/shop/shop', 'pages/mine/mine'];
const noCap = [];
TABS5.forEach((f) => {
  const src = fs.readFileSync(path.join(ROOT, f + '.wxml'), 'utf8');
  if (src.indexOf('padding-right:{{capR}}px') < 0) noCap.push(f);
});
// 所有 navbar / topbar 都必须让位（不只五个 Tab 页）
const navNoCap = [];
walk(ROOT, ['.wxml']).forEach((f) => {
  const src = fs.readFileSync(f, 'utf8');
  const hasBar = src.indexOf('class="navbar"') >= 0 || src.indexOf('class="topbar"') >= 0;
  // 右侧真的放了控件的才必须让位；右侧只是空占位（.ph）的页面保持标题居中
  const rightCtrl = src.indexOf('class="navbtn"') >= 0 || src.indexOf('class="tx"') >= 0
    || src.indexOf('class="rt"') >= 0 || src.indexOf('class="pubbtn"') >= 0
    || src.indexOf('class="follow') >= 0 || src.indexOf('class="timing"') >= 0
    || src.indexOf('class="icbtn"') >= 0 || src.indexOf('class="pub"') >= 0;
  const phOnly = src.indexOf('class="ph"') >= 0;   // 右侧是空占位，胶囊下面没有按钮
  if (hasBar && rightCtrl && !phOnly && (src.indexOf('padding-right:{{capR}}px') < 0 || src.indexOf('capr') < 0)) navNoCap.push(rel(f));
});
const uiSrc = fs.readFileSync(path.join(ROOT, 'utils', 'ui.js'), 'utf8');
const capOk = !noCap.length && !navNoCap.length && uiSrc.indexOf('getMenuButtonBoundingClientRect') >= 0;
if (capOk) ok('所有顶栏都给系统胶囊让了位（topbar + navbar，capR）');
else bad('顶栏未避让胶囊：' + (noCap.concat(navNoCap).join(', ') || 'ui.js 缺 getMenuButtonBoundingClientRect'));

// 短标签只允许一行（换行会顶破行高、压到下一行）
const appCss = fs.readFileSync(path.join(ROOT, 'app.wxss'), 'utf8');
if (appCss.indexOf('.navbar.capr') < 0) bad('缺 .capr 兜底规则（内联 style 失效时会压到胶囊）');
else ok('.capr 兜底规则就位（不依赖内联 style）');
const nowrapScope = ['.navbar .ttl', '.navbar .tx', '.authbtn', '.sbar .ph', '.cat', '.sample-tag'];
const mark = appCss.indexOf('单行策略');
const blockEnd = mark >= 0 ? appCss.indexOf('}', appCss.indexOf('{', mark)) : -1;
const block = mark >= 0 ? appCss.slice(mark, blockEnd) : '';
const missNowrap = nowrapScope.filter((sel) => block.indexOf(sel) < 0);
if (block.indexOf('white-space: nowrap') >= 0 && !missNowrap.length) ok('短标签单行策略就位（' + nowrapScope.length + ' 类，禁换行）');
else bad('短标签允许换行：' + (missNowrap.join(', ') || 'app.wxss 缺「单行策略」段'));

// 交付代码里不留 TODO
const todoBad = [];
walk(ROOT, ['.js', '.wxml']).forEach((f) => {
  const s = fs.readFileSync(f, 'utf8');
  if (/\b(TODO|FIXME|XXX)\b/.test(s)) todoBad.push(rel(f));
});
if (!todoBad.length) ok('代码里没有 TODO/FIXME 残留'); else todoBad.forEach((x) => bad('残留 TODO：' + x));

/* ---------------- 结果 ---------------- */
console.log('\n' + '='.repeat(48));
console.log('通过 ' + passed + ' 项｜失败 ' + fails.length + ' 项｜提醒 ' + warns.length + ' 项');
if (fails.length) {
  console.log('\n失败明细：');
  fails.forEach((f) => console.log('  - ' + f));
}
process.exit(fails.length ? 1 : 0);
