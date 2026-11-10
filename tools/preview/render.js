/**
 * 本地真渲染 + 超框审计
 * 用法：
 *   node tools/preview/render.js pages/home/home            → 截图
 *   node tools/preview/render.js pages/home/home --audit    → 截图 + 量超框/孤字
 *   node tools/preview/render.js pages/home/home --tall     → 整页长图
 *   node tools/preview/render.js pages/home/home --html     → 只出 HTML
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const MP = path.join(ROOT, 'miniprogram');
const OUT = path.join(ROOT, '.workbuddy', 'render');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const argv = process.argv.slice(2);
const pagePath = (argv[0] || 'pages/home/home').replace(/^\/+/, '');
const flag = (n) => argv.includes('--' + n);
const val = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
const TALL = flag('tall');
const SEED = flag('seed');
const DARK = flag('dark');
const AUDIT = flag('audit');
const NAME = val('out', pagePath.replace(/\//g, '-'));
const W_RAW = val('w', '') || (argv.find((a) => a.indexOf('--w=') === 0) || '').split('=')[1] || '375';
const WIDTH = Math.max(300, Math.min(430, Number(W_RAW) || 375));
const RPX = WIDTH / 750;
const FS = Math.max(0.8, Math.min(2, Number(process.env.PREVIEW_FS) || 1));
const QUERY = {};
(val('query', '') || '').split('&').filter(Boolean).forEach((kv) => {
  const p = kv.split('=');
  QUERY[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
});

let RUN = { query: {}, dark: false, pagePath: '' };
fs.mkdirSync(OUT, { recursive: true });
const read = (p) => fs.readFileSync(p, 'utf8');

function resolveWxss(spec, fromDir) {
  const p = spec.startsWith('/') ? path.join(MP, spec.slice(1)) : path.resolve(fromDir, spec);
  return /\.wxss$/.test(p) ? p : p + '.wxss';
}
function loadWxss(file, seen) {
  seen = seen || new Set();
  if (seen.has(file) || !fs.existsSync(file)) return '';
  seen.add(file);
  let css = read(file);
  const dir = path.dirname(file);
  css = css.replace(/@import\s+["']([^"']+)["']\s*;?/g, (m, spec) => loadWxss(resolveWxss(spec, dir), seen));
  return css;
}
function mapImg(css) {
  return css.replace(/(^|[\s,>+~(])image(?=[\s,{.:#>+~)])/g, '$1mpimg');
}
const toPx0 = (css) => css.replace(/(-?\d*\.?\d+)rpx/g, (m, n) => {
  const v = parseFloat(n) * RPX;
  return (Number.isInteger(v) ? v : v.toFixed(2)) + 'px';
});
const scaleFont = (css) => (FS === 1 ? css : css.replace(/font-size:\s*([\d.]+)px/g, (m, n) => {
  const v = parseFloat(n) * FS;
  return 'font-size:' + (Number.isInteger(v) ? v : v.toFixed(2)) + 'px';
}));
const toPx = (css) => scaleFont(toPx0(mapImg(css)));

const BASE_CSS = [
  'html,body{margin:0;padding:0;background:#fff;}',
  'body{width:' + WIDTH + 'px;overflow-x:hidden;}',
  'page{display:block;position:relative;min-height:100vh;}',
  'view,scroll-view,swiper,swiper-item,block,canvas,picker,form{display:block;}',
  'text{display:inline;}',
  'mpimg{display:inline-block;width:320px;height:240px;border:0;vertical-align:top;background-repeat:no-repeat;background-position:center;background-size:cover;}',
  'button{border:0;background:none;padding:0;margin:0;font:inherit;color:inherit;line-height:normal;display:block;text-align:center;border-radius:0;-webkit-appearance:none;}',
  'button::after{border:0;}',
  'input,textarea{font:inherit;color:inherit;border:0;background:none;padding:0;margin:0;outline:none;display:block;}',
  'scroll-view{overflow-x:auto;overflow-y:hidden;}',
  'scroll-view::-webkit-scrollbar{display:none;}',
  'swiper{position:relative;overflow:hidden;}',
  'swiper-item{position:absolute;left:0;top:0;width:100%;height:100%;display:none;}',
  'swiper-item.on{display:block;}'
].join('\n');

function makeSandbox() {
  const storage = Object.create(null);
  const noop = function () { return undefined; };
  const anyProxy = () => new Proxy(function () {}, {
    get: (t, k) => (k === 'then' || k === 'toJSON' ? undefined : anyProxy()),
    apply: () => anyProxy()
  });
  const wx = new Proxy({}, {
    get: (t, k) => {
      if (k === 'getStorageSync') return (key) => (key in storage ? storage[key] : '');
      if (k === 'setStorageSync') return (key, v) => { storage[key] = v; };
      if (k === 'removeStorageSync') return (key) => { delete storage[key]; };
      if (k === 'clearStorageSync') return () => { Object.keys(storage).forEach((x) => delete storage[x]); };
      if (k === 'getStorageInfoSync') return () => ({ keys: Object.keys(storage), currentSize: 0, limitSize: 10240 });
      if (k === 'getSystemInfoSync' || k === 'getWindowInfo') {
        return () => ({ statusBarHeight: 44, windowWidth: WIDTH, windowHeight: 812, screenWidth: WIDTH, screenHeight: 812, safeArea: { top: 44, bottom: 812, left: 0, right: WIDTH }, SDKVersion: '3.6.0', platform: 'devtools', system: 'iOS 17.0', brand: 'devtools', model: 'iPhone 15', pixelRatio: 3, language: 'zh_CN' });
      }
      if (k === 'getMenuButtonBoundingClientRect') return () => ({ top: 48, bottom: 80, left: WIDTH - 94, right: WIDTH - 7, width: 87, height: 32 });
      if (k === 'getDeviceInfo') return () => ({ platform: 'devtools' });
      if (k === 'getAppBaseInfo') return () => ({ SDKVersion: '3.6.0', language: 'zh_CN' });
      if (k === 'getLaunchOptionsSync') return () => ({ path: RUN.pagePath, query: RUN.query, scene: 1001 });
      if (k === 'nextTick') return (fn) => fn && fn();
      if (k === 'canIUse') return () => true;
      if (k === 'env') return { USER_DATA_PATH: 'wxfile://usr' };
      if (typeof k === 'string' && (k.indexOf('on') === 0 || k.indexOf('off') === 0)) return noop;
      return anyProxy();
    }
  });

  const modules = Object.create(null);
  function makeRequire(fromDir) {
    return function req(spec) {
      let p = spec.startsWith('/') ? path.join(MP, spec.slice(1)) : path.resolve(fromDir, spec);
      if (!/\.(js|json)$/.test(p)) p += '.js';
      if (modules[p]) return modules[p].exports;
      if (!fs.existsSync(p)) throw new Error('module not found: ' + spec);
      if (/\.json$/.test(p)) { const mod = { exports: JSON.parse(read(p)) }; modules[p] = mod; return mod.exports; }
      const code = read(p);
      const mod = { exports: {} };
      modules[p] = mod;
      const fn = new Function('require', 'module', 'exports', 'Page', 'App', 'Component', 'getApp', 'wx', 'getCurrentPages', 'console', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
        code + '\n//# sourceURL=' + p.replace(/\\/g, '/'));
      fn(makeRequire(path.dirname(p)), mod, mod.exports, Page, App, Component, getApp, wx, () => [page], console, () => 0, noop, () => 0, noop);
      return mod.exports;
    };
  }

  let appDef = null;
  let pageDef = null;
  let compDef = null;
  function App(def) { appDef = def; }
  function Page(def) { pageDef = def; }
  function Component(def) { compDef = def; }
  const appObj = { globalData: { theme: 'light', reduceMotion: false, statusBarHeight: 44 } };
  function getApp() { return appObj; }

  try {
    const appReq = makeRequire(MP);
    appReq('./app.js');
    if (appDef) {
      const gd = appDef.globalData || {};
      delete appDef.globalData;
      Object.assign(appObj, appDef);
      appObj.globalData = Object.assign({ theme: 'light', reduceMotion: false, statusBarHeight: 44 }, gd);
    }
  } catch (e) { console.error('[app.js] ' + e.message); }
  if (RUN.dark) appObj.globalData.theme = 'dark';
  if (RUN.reduce === true) appObj.globalData.reduceMotion = true;

  if (RUN.seed) {
    try {
      const r2 = makeRequire(MP);
      const Engine = r2('./utils/engine.js');
      const bank = r2('./data/bank.js');
      const qs = bank.bank || bank;
      const answers = qs.map((q) => ({ qid: q.id, key: q.options[0].key }));
      const rep = Engine.buildReport('main', answers);
      rep.id = 'r_demo';
      storage['sc_reports'] = [rep];
      storage['sc_user'] = { id: 'u_demo', nick: '阿岚', avatar: '/images/ui/p-punk.jpg', bio: '示例档案 · 本地保存', createdAt: Date.now() - 7 * 86400000 };
      storage['sc_progress'] = { main: { index: 9, answers: {}, updatedAt: Date.now() - 3600000 } };
      storage['sc_history'] = [{ id: 'w1', type: 'post', title: '哥特通勤｜暗黑系也能穿去上班', img: '/images/ui/p-gothic.jpg', ts: Date.now() - 3600000 }];
      storage['sc_fav_post'] = [{ id: 'a1', type: 'article', title: '亚文化不是奇装异服', img: '/images/ui/know-1.jpg', ts: Date.now() - 7200000 }];
      storage['sc_fav_shop'] = [{ id: 'p1', title: '蕾丝拼接连衣裙', img: '/images/ui/shop-lolita.jpg', ts: Date.now() - 7200000 }];
      storage['sc_follow'] = [{ id: 's1', name: '铁器时代' }];
      storage['sc_search'] = [{ id: 's_1', kw: '哥特', ts: Date.now() }];
      storage['sc_draft'] = [{ id: 'd1', title: '未写完的穿搭笔记', body: '这是一段本地草稿。', ts: Date.now() - 600000 }];
    } catch (e) { console.error('[seed] ' + e.message); }
  }

  const page = { data: {}, setData() {} };
  return { wx, makeRequire, appObj, getApp, Page, App, Component, page, get pageDef() { return pageDef; }, get compDef() { return compDef; }, storage };
}

const VOID_TAGS = new Set(['input', 'image', 'import', 'include', 'wxs']);
function parseWxml(src) {
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  let i = 0;
  const pushText = (t) => { if (t) stack[stack.length - 1].children.push({ tag: '#text', text: t }); };
  while (i < src.length) {
    const lt = src.indexOf('<', i);
    if (lt < 0) { pushText(src.slice(i)); break; }
    if (lt > i) pushText(src.slice(i, lt));
    if (src.startsWith('<!--', lt)) { const e = src.indexOf('-->', lt); i = e < 0 ? src.length : e + 3; continue; }
    let j = lt + 1; let q = null;
    while (j < src.length) {
      const c = src[j];
      if (q) { if (c === q) q = null; } else if (c === '"' || c === "'") q = c; else if (c === '>') break;
      j += 1;
    }
    const raw = src.slice(lt + 1, j).trim();
    i = j + 1;
    if (raw.charAt(0) === '/') {
      const name = raw.slice(1).trim();
      for (let k = stack.length - 1; k > 0; k -= 1) {
        if (stack[k].tag === name) { stack.length = k; break; }
      }
      continue;
    }
    const selfClose = raw.charAt(raw.length - 1) === '/';
    const body = selfClose ? raw.slice(0, -1) : raw;
    const tag = (body.match(/^[^\s/>]+/) || [''])[0];
    const attrs = {};
    const rest = body.slice(tag.length);
    const re = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
    let m;
    while ((m = re.exec(rest))) {
      if (!m[1]) continue;
      attrs[m[1]] = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : true);
    }
    const node = { tag, attrs, children: [] };
    stack[stack.length - 1].children.push(node);
    if (!selfClose && !VOID_TAGS.has(tag)) stack.push(node);
  }
  return root;
}

const esc = (s) => String(s).replace(/&(?!amp;|lt;|gt;|quot;|#\d+;|nbsp;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function evalExpr(expr, scope) {
  try { return new Function('__s', 'with(__s){return (' + expr + ')}')(scope); } catch (e) { return undefined; }
}
function interp(str, scope) {
  if (typeof str !== 'string') return str;
  return str.replace(/\{\{([\s\S]+?)\}\}/g, (m, e) => {
    const v = evalExpr(e, scope);
    return v === undefined || v === null || v === false ? '' : String(v);
  });
}
function rawVal(str, scope, dflt) {
  if (typeof str !== 'string') return dflt;
  const m = str.match(/^\s*\{\{([\s\S]+)\}\}\s*$/);
  if (!m) return str;
  const v = evalExpr(m[1], scope);
  return v === undefined ? dflt : v;
}
const truthy = (v) => !(v === undefined || v === null || v === false || v === '' || v === 0);

function imgSrc(v) {
  if (!v) return '';
  v = String(v);
  if (/^(https?:|data:|wxfile:)/.test(v)) return v;
  const p = v.charAt(0) === '/' ? v.slice(1) : v;
  return 'file:///' + encodeURI(path.join(MP, p).replace(/\\/g, '/'));
}

function renderNodes(nodes, scope) {
  let out = '';
  let lastIf = null;
  for (const node of nodes) {
    if (node.tag === '#text') { out += esc(interp(node.text, scope)); continue; }
    const a = node.attrs || {};
    if ('wx:if' in a) {
      lastIf = truthy(rawVal(a['wx:if'], scope, false));
      if (!lastIf) continue;
    } else if ('wx:elif' in a) {
      if (lastIf) continue;
      lastIf = truthy(rawVal(a['wx:elif'], scope, false));
      if (!lastIf) continue;
    } else if ('wx:else' in a) {
      if (lastIf) continue;
      lastIf = null;
    } else {
      lastIf = null;
    }
    if ('wx:for' in a) {
      const list = rawVal(a['wx:for'], scope, []);
      if (!list) continue;
      const itemName = a['wx:for-item'] || 'item';
      const idxName = a['wx:for-index'] || 'index';
      const entries = Array.isArray(list) ? list.map((v, i) => [i, v]) : Object.keys(list).map((k) => [k, list[k]]);
      for (const e of entries) {
        const s = Object.assign(Object.create(null), scope);
        s[itemName] = e[1]; s[idxName] = e[0];
        out += renderOne(node, s);
      }
      continue;
    }
    out += renderOne(node, scope);
  }
  return out;
}

function renderOne(node, scope) {
  if (node.tag === '#text') return esc(interp(node.text, scope));
  if (node.tag === 'block') return renderNodes(node.children, scope);
  const a = node.attrs || {};
  const tag = node.tag;
  const cls = interp(a.class || '', scope).trim();
  const st = [interp(a.style || '', scope).trim()];
  if ('hidden' in a && truthy(rawVal(a.hidden, scope, false))) st.push('display:none');
  const style = st.filter(Boolean).join(';');
  const attrCls = cls ? ' class="' + esc(cls) + '"' : '';
  const attrStyle = style ? ' style="' + esc(style) + '"' : '';

  if (tag === 'image') {
    const src = interp(a.src || '', scope);
    const mode = interp(a.mode || '', scope);
    const parts = [style];
    if (src) parts.push("background-image:url('" + imgSrc(src) + "')");
    parts.push(mode === 'aspectFit' ? 'background-size:contain' : 'background-size:cover');
    return '<mpimg' + attrCls + ' style="' + esc(parts.filter(Boolean).join(';')) + '" data-src="' + esc(src) + '"></mpimg>';
  }
  if (tag === 'input') {
    const v = interp(String(a.value === undefined ? '' : a.value), scope);
    const ph = interp(a.placeholder || '', scope);
    return '<input' + attrCls + attrStyle + ' value="' + esc(v) + '" placeholder="' + esc(ph) + '" />';
  }
  if (tag === 'textarea') {
    const v = interp(String(a.value === undefined ? '' : a.value), scope);
    const ph = interp(a.placeholder || '', scope);
    return '<textarea' + attrCls + attrStyle + ' placeholder="' + esc(ph) + '">' + esc(v) + '</textarea>';
  }
  if (tag === 'swiper') {
    let n = 0;
    const inner = node.children.map((ch) => {
      if (ch.tag === 'swiper-item') {
        const s2 = Object.assign(Object.create(null), scope);
        return renderNodes([ch], scope);
      }
      return renderNodes([ch], scope);
    }).join('');
    let first = true;
    const fixed = inner.replace(/<swiper-item class="([^"]*)"/g, (m, c) => {
      const on = first ? ' on' : '';
      first = false;
      return '<swiper-item class="' + c.replace(/\s*on\s*/g, ' ').trim() + on + '"';
    });
    return '<swiper' + attrCls + attrStyle + '>' + fixed + '</swiper>';
  }
  if (tag === 'swiper-item') {
    const on = scope.__sel ? ' on' : '';
    return '<swiper-item class="' + esc(cls + on) + '"' + attrStyle + '>' + renderNodes(node.children, scope) + '</swiper-item>';
  }
  if (tag === 'canvas') {
    return '<canvas' + attrCls + attrStyle + ' style="' + esc(style + ';background:#f2f2f4') + '"></canvas>';
  }
  const safeTag = /^(view|text|scroll-view|button|form|picker|label|navigator|map|video)$/.test(tag) ? tag : 'view';
  return '<' + safeTag + attrCls + attrStyle + '>' + renderNodes(node.children, scope) + '</' + safeTag + '>';
}

function build(pagePathIn, opts) {
  opts = opts || {};
  const pagePath = pagePathIn;
  RUN = { query: opts.query || {}, dark: !!opts.dark, pagePath: pagePath, seed: !!opts.seed, reduce: !!opts.reduce };
  const s = makeSandbox();
  const pageDir = path.dirname(path.join(MP, pagePath));
  const pageBase = path.basename(pagePath);
  const req = s.makeRequire(pageDir);
  try { req('./' + pageBase + '.js'); } catch (e) { console.error('[page.js] ' + e.message); }
  const pageDef = s.pageDef;
  if (!pageDef) throw new Error('页面没有调用 Page()');

  const ctx = Object.assign({}, pageDef);
  ctx.data = JSON.parse(JSON.stringify(pageDef.data || {}));
  ctx.setData = function (patch, cb) { Object.assign(this.data, patch || {}); if (typeof cb === 'function') cb(); };
  if (typeof ctx.onLoad === 'function') { try { ctx.onLoad(RUN.query); } catch (e) { console.error('[onLoad] ' + e.message); } }
  if (typeof ctx.onShow === 'function') { try { ctx.onShow(); } catch (e) { console.error('[onShow] ' + e.message); } }
  if (RUN.query.kw && typeof ctx.onInput === 'function') {
    try { ctx.onInput({ detail: { value: RUN.query.kw } }); } catch (e) { /* noop */ }
    ['onConfirm', 'onSearch', 'onSubmit'].forEach((fn) => { if (typeof ctx[fn] === 'function') { try { ctx[fn](); } catch (e) { /* noop */ } } });
  }

  const ast = parseWxml(read(path.join(MP, pagePath + '.wxml')));
  const body = renderNodes(ast.children, Object.assign(Object.create(null), ctx.data));

  let css = toPx(loadWxss(path.join(MP, 'app.wxss')) + '\n' + loadWxss(path.join(MP, pagePath + '.wxss')));

  const appJson = JSON.parse(read(path.join(MP, 'app.json')));
  const tabList = (appJson.tabBar && appJson.tabBar.list) || [];
  const tabIdx = tabList.findIndex((t) => t.pagePath === pagePath);
  let tabbar = '';
  if (tabIdx >= 0) {
    const cr = s.makeRequire(path.join(MP, 'custom-tab-bar'));
    try { cr('./index.js'); } catch (e) { /* noop */ }
    const cd = Object.assign({}, (s.compDef && s.compDef.data) || {}, { selected: tabIdx, dark: !!opts.dark });
    tabbar = renderNodes(parseWxml(read(path.join(MP, 'custom-tab-bar', 'index.wxml'))).children, Object.assign(Object.create(null), cd));
    css += '\n' + toPx(loadWxss(path.join(MP, 'custom-tab-bar', 'index.wxss')));
  }

  const tallCss = opts.tall ? 'page{min-height:auto}.tabbar{position:absolute;top:calc(100vh - 152px)}' : '';
  return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=' + WIDTH + ',initial-scale=1">' +
    '<style>' + BASE_CSS + '\n' + css + '\n' + tallCss + '</style></head><body>' +
    '<page>' + body + '</page>' + tabbar + '</body></html>';
}

const AUDIT_JS = `(() => {
  const vis = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const ownText = (el) => {
    let t = '';
    for (const n of el.childNodes) if (n.nodeType === 3) t += n.nodeValue;
    return t.replace(/\\s+/g, ' ').trim();
  };
  const label = (el) => {
    const cls = (el.getAttribute('class') || '').trim().split(/\\s+/).slice(0, 3).join('.');
    const p = el.parentElement;
    const pcls = p ? (p.getAttribute('class') || '').trim().split(/\\s+/)[0] : '';
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '') + (pcls ? ' < ' + pcls : '');
  };
  const rects = (el) => {
    const out = [];
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.nodeValue.trim()) continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      out.push(...Array.from(r.getClientRects()));
    }
    return out;
  };
  const clip = [];
  const spill = [];
  const squeeze = [];
  const orphan = [];
  const overflowBox = [];
  const all = Array.from(document.querySelectorAll('view,text,button,mpimg,input,textarea'));
  for (const el of all) {
    if (!vis(el)) continue;
    const cs = getComputedStyle(el);
    const txt = ownText(el);
    if (!txt) continue;
    const overX = el.scrollWidth - el.clientWidth;
    const overY = el.scrollHeight - el.clientHeight;
    const hidden = cs.overflow + cs.overflowX + cs.overflowY;
    if ((overX > 1 || overY > 1) && /hidden|clip/.test(hidden)) {
      clip.push({ el: label(el), text: txt.slice(0, 24), overX, overY, nowrap: cs.whiteSpace.indexOf('nowrap') >= 0, clamped: !!(cs.webkitLineClamp && cs.webkitLineClamp !== 'none') });
    }
    const rs = rects(el);
    if (rs.length >= 2 && el.clientHeight > 0) {
      const top = Math.min(...rs.map((r) => r.top));
      const bot = Math.max(...rs.map((r) => r.bottom));
      const totalH = bot - top;
      const clamped = cs.webkitLineClamp && cs.webkitLineClamp !== 'none';
      if (!clamped && totalH > el.clientHeight + 1) {
        squeeze.push({ el: label(el), text: txt.slice(0, 20), lines: rs.length, textH: Math.round(totalH), boxH: Math.round(el.clientHeight) });
      }
    }
    if (rs.length > 1) {
      const lines = [];
      let cur = null;
      for (const r of rs) {
        if (!cur || Math.abs(r.top - cur.top) > 2) { cur = { top: r.top, w: r.width }; lines.push(cur); }
        else cur.w = Math.max(cur.w, r.right) - Math.min(r.left, cur.left);
      }
      const maxW = Math.max(...lines.map((l) => l.w));
      const last = lines[lines.length - 1];
      if (lines.length >= 2 && last.w < maxW * 0.22) {
        orphan.push({ el: label(el), text: txt.slice(0, 30), lines: lines.length, lastW: Math.round(last.w), maxW: Math.round(maxW) });
      }
    }
    const par = el.parentElement;
    if (par && par.tagName !== 'PAGE' && !par.closest('scroll-view')) {
      const pcs = getComputedStyle(par);
      const pbb = par.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      const borderB = parseFloat(pcs.borderBottomWidth) || 0;
      const innerBottom = pbb.bottom - (parseFloat(pcs.paddingBottom) || 0) - borderB;
      const hasCard = borderB > 0 || (pcs.backgroundColor && pcs.backgroundColor !== 'rgba(0, 0, 0, 0)');
      if (hasCard && pcs.overflow === 'visible' && er.bottom > innerBottom + 1.5 && cs.position !== 'absolute' && cs.position !== 'fixed') {
        spill.push({ el: label(el), parent: label(par), text: txt.slice(0, 22), over: Math.round(er.bottom - innerBottom) });
      }
    }
    const pr = el.getBoundingClientRect();
    const inRail = el.closest('scroll-view');
    if (!inRail && (pr.right > document.body.clientWidth + 0.5 || pr.left < -0.5)) {
      overflowBox.push({ el: label(el), text: txt.slice(0, 18), left: Math.round(pr.left), right: Math.round(pr.right) });
    }
  }
  const badImg = Array.from(document.querySelectorAll('mpimg[data-src]')).filter((el) => {
    const bg = getComputedStyle(el).backgroundImage;
    return !bg || bg === 'none' || el.getAttribute('data-src') === '';
  }).map((el) => el.getAttribute('data-src') || '(空 src)');
  const pageH = document.documentElement.scrollHeight;
  return { clip: clip.slice(0, 40), squeeze: squeeze.slice(0, 40), spill: spill.slice(0, 40), orphan: orphan.slice(0, 40), outOfScreen: overflowBox.slice(0, 20), emptyImages: badImg.slice(0, 20), emptyImageCount: badImg.length, pageH };
})()`;

async function shot(html, name, audit, viewport, tall) {
  const { chromium } = require('playwright-core');
  const browser = await chromium.launch({ executablePath: EDGE, headless: true });
  const page = await browser.newPage({ viewport: viewport || { width: 375, height: 812 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const htmlPath = path.join(OUT, name + '.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  await page.goto('file:///' + encodeURI(htmlPath.replace(/\\/g, '/')), { waitUntil: 'load' });
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none !important;transition:none !important}.m-rv{opacity:1 !important}' });
  await page.waitForTimeout(250);
  const png = path.join(OUT, name + '.png');
  await page.screenshot({ path: png, fullPage: !!tall });
  let res = null;
  if (audit) res = await page.evaluate(AUDIT_JS);
  await browser.close();
  return { png, res, errors };
}

module.exports = { build, shot, AUDIT_JS, OUT, EDGE, WIDTH };

if (require.main === module) (async () => {
  const html = build(pagePath, { query: QUERY, dark: DARK, tall: TALL, seed: SEED || flag('seed') });
  if (flag('html')) {
    const p = path.join(OUT, NAME + '.html');
    fs.writeFileSync(p, html, 'utf8');
    console.log('HTML ' + p);
    process.exit(0);
  }
  const { png, res, errors } = await shot(html, NAME, AUDIT, { width: WIDTH, height: TALL ? 2400 : 812 }, TALL);
  console.log('PNG ' + png + ' ' + (fs.statSync(png).size / 1024).toFixed(1) + ' KB');
  if (errors.length) console.log('页面报错：' + errors.slice(0, 3).join(' | '));
  if (res) {
    const out = { page: pagePath, pageHeight: res.pageH, clip: res.clip, orphan: res.orphan, outOfScreen: res.outOfScreen, emptyImageCount: res.emptyImageCount, emptyImages: res.emptyImages };
    fs.writeFileSync(path.join(OUT, NAME + '.audit.json'), JSON.stringify(out, null, 2), 'utf8');
    console.log('超框(clip)=' + res.clip.length + '  孤字(orphan)=' + res.orphan.length + '  出屏=' + res.outOfScreen.length + '  空图=' + res.emptyImageCount + '  页高=' + res.pageH);
    res.clip.slice(0, 12).forEach((x) => console.log('  裁剪 ' + x.el + ' | ' + x.text + ' | +' + x.overX + '/' + x.overY));
    res.orphan.slice(0, 12).forEach((x) => console.log('  孤字 ' + x.el + ' | ' + x.text + ' | ' + x.lines + '行 末行' + x.lastW + '/' + x.maxW));
    res.outOfScreen.slice(0, 8).forEach((x) => console.log('  出屏 ' + x.el + ' | ' + x.text + ' | ' + x.left + '→' + x.right));
  }
  process.exit(0);
})().catch((e) => { console.error('ERR ' + e.message); process.exit(1); });