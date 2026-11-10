// 通用 UI 辅助：主题同步 / 状态栏 / Toast / 震动 / 跳转 / Tab 高亮
// 设计口径：375 设计宽 = 750rpx；震动与 Toast 规范见《交互设计规范》§4

let SBH = null;

function statusBarHeight() {
  if (SBH === null) {
    try {
      const info = wx.getSystemInfoSync();
      SBH = info.statusBarHeight || 20;
    } catch (e) {
      SBH = 20;
    }
  }
  return SBH;
}

let CAPR = null;

// 右上角胶囊（···○）占位宽度（px）
// 自定义导航栏页面必须给系统胶囊让位，否则自己的图标会被压在胶囊下面（商城页曾整颗搜索键被盖住）
function capsuleRight() {
  if (CAPR === null) {
    try {
      const r = wx.getMenuButtonBoundingClientRect();
      const info = wx.getSystemInfoSync();
      CAPR = Math.max(0, Math.round(info.windowWidth - r.left + 8));
    } catch (e) {
      CAPR = 96;
    }
  }
  return CAPR;
}

let CAPB = null;

// 胶囊底部往下 8px 的位置（px）：搜索这类「整行控件」要从这里开始，否则会被胶囊压住
function capsuleBottom() {
  if (CAPB === null) {
    try {
      const r = wx.getMenuButtonBoundingClientRect();
      CAPB = Math.round(r.bottom + 8);
    } catch (e) {
      CAPB = 52;
    }
  }
  return CAPB;
}

// 同步主题 / 减弱动效 / 状态栏高度到页面 data
function sync(page, extra) {
  const app = getApp();
  const patch = {
    dark: app.globalData.theme === 'dark',
    reduce: !!app.globalData.reduceMotion,
    sbh: statusBarHeight(),
    capR: capsuleRight(),
    capB: capsuleBottom()
  };
  page.setData(Object.assign(patch, extra || {}));
  const bar = typeof page.getTabBar === 'function' ? page.getTabBar() : null;
  if (bar && typeof bar.syncTheme === 'function') bar.syncTheme();
}

// Tab 页高亮当前项
function setTab(page, index) {
  const bar = typeof page.getTabBar === 'function' ? page.getTabBar() : null;
  if (bar) {
    bar.setData({ selected: index });
    if (typeof bar.syncTheme === 'function') bar.syncTheme();
  }
}

let lastVibrate = 0;
function vibrate(type) {
  if (getApp().globalData.reduceMotion) return;
  const now = Date.now();
  if (now - lastVibrate < 120) return; // 间隔 ≥120ms
  lastVibrate = now;
  try {
    wx.vibrateShort({ type: type || 'light' });
  } catch (e) {
    // 低版本静默降级
  }
}

let toastTimer = null;
function toast(text) {
  if (toastTimer) clearTimeout(toastTimer);
  wx.showToast({ title: text, icon: 'none', duration: 2400 });
  toastTimer = setTimeout(() => { toastTimer = null; }, 2400);
}

let lastNav = 0;
// 防连点 400ms（交互规范 N2）
function go(url) {
  const now = Date.now();
  if (now - lastNav < 400) return;
  lastNav = now;
  wx.navigateTo({ url: url });
}

function tab(url) {
  const now = Date.now();
  if (now - lastNav < 400) return;
  lastNav = now;
  wx.switchTab({ url: url });
}

function back() {
  wx.navigateBack({ delta: 1 });
}

// 数字格式化：12043 → 1.2 万
function fmtCount(n) {
  n = Number(n) || 0;
  if (n >= 10000) {
    const v = n / 10000;
    return (v >= 10 ? Math.round(v) : Math.round(v * 10) / 10) + '万';
  }
  return String(n);
}

// 图标路径：浅底用 ink，深底用 white
function icon(name, suffix) {
  return '/images/ic/' + name + '-' + (suffix || 'ink') + '.png';
}

// 相对时间：用于浏览历史分组
function relTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const day1 = day0 - 86400000;
  const pad = (x) => (x < 10 ? '0' + x : String(x));
  if (ts >= day0) return '今天';
  if (ts >= day1) return '昨天';
  const diff = Math.floor((day0 - ts) / 86400000);
  if (diff < 30) return diff + ' 天前';
  return pad(d.getMonth() + 1) + ' 月 ' + pad(d.getDate()) + ' 日';
}

function timeOfDay(ts) {
  const d = new Date(ts);
  const pad = (x) => (x < 10 ? '0' + x : String(x));
  return pad(d.getHours()) + ':' + pad(d.getMinutes());
}

module.exports = {
  capsuleRight: capsuleRight,
  capsuleBottom: capsuleBottom,
  statusBarHeight: statusBarHeight,
  sync: sync,
  setTab: setTab,
  vibrate: vibrate,
  toast: toast,
  go: go,
  tab: tab,
  back: back,
  fmtCount: fmtCount,
  icon: icon,
  relTime: relTime,
  timeOfDay: timeOfDay
};
