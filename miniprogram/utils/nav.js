// 跳转中枢 · 统一处理「去哪里 / 怎么转场 / 出什么声 / 震不震」
// 转场对照《第二文化_动效设计规范》§6：
//   T1 推入 380ms/C   常规二级页（介绍、设置、报告…）
//   T2 共享元素 420ms/C  卡片 → 详情（图片放大成头图，文字延迟 80ms）
//   T3 抽屉 420ms/D   筛选页（本项目把筛选做成独立页，用从下升起入场）
//   T4 弹层 300ms/B   确认框（用系统 wx.showModal，不自建）
//   T5 Tab 320ms/C    五个主 Tab（内容淡入 + 上移 8px）
//
// 用法：
//   Nav.push('/pages/a/a?id=1')            T1
//   Nav.hero('/pages/detail/detail?id=1')  T2
//   Nav.drawer('/pages/filter/filter')     T3
//   Nav.tab('/pages/home/home')            T5
//   Nav.back()
// 页面根节点写 class="{{tr}}"，并在 onShow 里 Nav.apply(this) 把转场类挂上。

const UI = require('./ui.js');
const Sound = require('./sound.js');
const Privacy = require('./privacy.js');

const MAX_STACK = 9;      // 小程序页面栈上限 10，留 1 层余量
const GUARD = 400;        // 防连点（交互规范 N2）
const TRANS = { push: 't1-in', hero: 't2-hero', drawer: 't3-up', tab: 't5-in' };

let lastAt = 0;

function guard() {
  const now = Date.now();
  if (now - lastAt < GUARD) return false;
  lastAt = now;
  return true;
}

function stackLen() {
  try {
    return getCurrentPages().length;
  } catch (e) {
    return 1;
  }
}

// 记录待消费的转场类型，目标页 onShow 时读取
function mark(type) {
  try {
    const app = getApp();
    app.globalData.navType = type;
  } catch (e) { /* noop */ }
}

/**
 * 页面 onShow 里调用：把转场动画类写进 data.tr，并消费掉标记
 * @param {object} page
 * @returns {string} 转场类名（也直接 setData 了）
 */
function apply(page) {
  let type = '';
  try {
    type = getApp().globalData.navType || '';
    getApp().globalData.navType = '';
  } catch (e) { /* noop */ }
  const cls = TRANS[type] || '';
  page.setData({ tr: cls });
  return cls;
}

/* ---------------- 发声 + 震动：一次跳转只发一次 ---------------- */
function chime(type) {
  if (type === 'tab') Sound.tap();
  else if (type === 'drawer') Sound.slide();
  else Sound.whoosh();
}

function buzz(type) {
  if (type === 'tab') UI.vibrate('light');
  else UI.vibrate('light');
}

/* ---------------- T1 推入 ---------------- */
function push(url, opts) {
  opts = opts || {};
  if (!guard()) return false;
  if (!opts.silent) { chime('push'); buzz('push'); }
  mark('push');
  if (stackLen() >= MAX_STACK) {
    wx.redirectTo({ url: url, fail: () => {} });
    return true;
  }
  wx.navigateTo({ url: url, fail: () => { wx.redirectTo({ url: url }); } });
  return true;
}

/* ---------------- T2 共享元素 ---------------- */
function hero(url, opts) {
  opts = opts || {};
  if (!guard()) return false;
  if (!opts.silent) { chime('push'); buzz('push'); }
  mark('hero');
  if (stackLen() >= MAX_STACK) {
    wx.redirectTo({ url: url, fail: () => {} });
    return true;
  }
  wx.navigateTo({ url: url, fail: () => { wx.redirectTo({ url: url }); } });
  return true;
}

/* ---------------- T3 抽屉（筛选页） ---------------- */
function drawer(url, opts) {
  opts = opts || {};
  if (!guard()) return false;
  if (!opts.silent) { chime('drawer'); buzz('drawer'); }
  mark('drawer');
  if (stackLen() >= MAX_STACK) {
    wx.redirectTo({ url: url, fail: () => {} });
    return true;
  }
  wx.navigateTo({ url: url, fail: () => { wx.redirectTo({ url: url }); } });
  return true;
}

/* ---------------- T5 Tab ---------------- */
function tab(url, opts) {
  opts = opts || {};
  if (!guard()) return false;
  if (!opts.silent) { chime('tab'); buzz('tab'); }
  mark('tab');
  wx.switchTab({ url: url, fail: () => {} });
  return true;
}

/* ---------------- 重定向 ---------------- */
function replace(url, opts) {
  opts = opts || {};
  if (!guard()) return false;
  if (!opts.silent) { chime('push'); buzz('push'); }
  mark(opts.type || 'push');
  wx.redirectTo({ url: url, fail: () => {} });
  return true;
}

/* ---------------- 返回 ---------------- */
function back(opts) {
  opts = opts || {};
  if (!opts.silent) { Sound.tap(); UI.vibrate('light'); }
  const delta = opts.delta || 1;
  if (stackLen() <= 1) {
    // 已在栈底：回首页，避免黑屏
    wx.switchTab({ url: opts.home || '/pages/home/home', fail: () => {} });
    return true;
  }
  wx.navigateBack({ delta: delta, fail: () => { wx.switchTab({ url: opts.home || '/pages/home/home' }); } });
  return true;
}

/**
 * 返回上一页并回传数据（筛选页 → 列表页用）
 * @param {object} payload 会写到上一页 data 上的键值
 */
function backWith(payload, opts) {
  try {
    const pages = getCurrentPages();
    const prev = pages[pages.length - 2];
    if (prev && payload) prev.setData(payload);
    if (prev && typeof prev.onBackFrom === 'function') {
      prev.onBackFrom(payload || {});
    }
  } catch (e) { /* noop */ }
  back(opts || { silent: true });
}

/* ---------------- 外链跳转前确认（T4 弹层 + heavy 震动） ---------------- */
function confirmOut(title, content, url) {
  UI.vibrate('heavy');
  Sound.warn();
  const isLink = /^https?:\/\//.test(String(url || ''));
  wx.showModal({
    title: title || '即将离开',
    content: content || '即将跳转到外部页面，注意辨别信息。',
    confirmText: isLink ? '复制链接' : '知道了',
    cancelText: isLink ? '返回' : '关闭',
    success: (res) => {
      if (!res.confirm) return;
      // 没有真实外链就不假装有：只说明情况，不往剪贴板塞假链接
      if (!isLink) {
        UI.toast('商家还没上架外部链接');
        return;
      }
      Privacy.ensure(() => {
        wx.setClipboardData({
          data: url,
          success: () => { UI.toast('链接已复制，请在浏览器打开'); }
        });
      }, '复制商家链接需要读取剪贴板权限');
    }
  });
}

/* ---------------- 参数序列化 ---------------- */
function qs(obj) {
  const arr = [];
  Object.keys(obj || {}).forEach((k) => {
    const v = obj[k];
    if (v === undefined || v === null || v === '') return;
    arr.push(encodeURIComponent(k) + '=' + encodeURIComponent(typeof v === 'object' ? JSON.stringify(v) : v));
  });
  return arr.length ? '?' + arr.join('&') : '';
}

module.exports = {
  apply: apply,
  push: push,
  hero: hero,
  drawer: drawer,
  tab: tab,
  replace: replace,
  back: back,
  backWith: backWith,
  confirmOut: confirmOut,
  qs: qs,
  TRANS: TRANS
};
