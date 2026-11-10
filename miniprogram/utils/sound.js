// 声音系统 · 音效播放调度
// 规范依据：《第二文化_动效设计规范》§2.5 触觉预算，声音与震动同预算（每次操作只发一次）
// 素材：/audio/*.wav（tools/gen_audio.py 生成，单声道 16bit 22050Hz，合计 < 90KB）
//
// 降级策略：
//   1. 设置里关掉音效 → 全部静默
//   2. 真机静音键拨到静音 → 由系统 obeyMuteSwitch 接管（默认遵守）
//   3. 创建播放器失败 / 低版本基础库 → try 住，不报错

const Store = require('./store.js');

const VOL = {
  tap: 0.42,
  pop: 0.55,
  slide: 0.40,
  whoosh: 0.34,
  chime: 0.52,
  warn: 0.46,
  tick: 0.34
};

let enabled = true;      // 运行时缓存，避免每次读 storage
let inited = false;
const pool = {};
let lastAt = 0;          // 全局预算时间戳
const lastByName = {};

function init() {
  if (inited) return;
  inited = true;
  const cfg = Store.getConfig();
  enabled = cfg.sound !== false; // 默认开启
}

function setEnabled(on) {
  enabled = !!on;
  Store.setConfig({ sound: enabled });
  if (!enabled) {
    // 立刻停掉正在播的，避免关了还在响
    Object.keys(pool).forEach((k) => {
      try { pool[k].stop(); } catch (e) { /* noop */ }
    });
  }
}

function isEnabled() {
  init();
  return enabled;
}

function ensure(name) {
  if (pool[name]) return pool[name];
  try {
    const ctx = wx.createInnerAudioContext();
    ctx.src = '/audio/' + name + '.wav';
    ctx.volume = VOL[name] || 0.5;
    ctx.loop = false;
    ctx.autoplay = false;
    // iOS 静音键：遵守系统（不强行发声，避免公共场合尴尬）
    if (typeof ctx.obeyMuteSwitch === 'boolean') ctx.obeyMuteSwitch = true;
    ctx.onError(() => { /* 静默降级：不打断业务 */ });
    pool[name] = ctx;
    return ctx;
  } catch (e) {
    return null;
  }
}

/**
 * 播放音效
 * @param {string} name  tap | pop | slide | whoosh | chime | warn | tick
 * @param {object} opts  { gap: 全局最小间隔(ms, 默认 70), once: 同名音效最小间隔(ms, 默认 120) }
 */
function play(name, opts) {
  init();
  if (!enabled) return false;
  if (!VOL[name]) return false;
  opts = opts || {};
  const now = Date.now();
  const gap = opts.gap === undefined ? 70 : opts.gap;
  const once = opts.once === undefined ? 120 : opts.once;
  if (now - lastAt < gap) return false;                  // 全局预算：不叠音
  if (now - (lastByName[name] || 0) < once) return false; // 同名节流
  lastAt = now;
  lastByName[name] = now;

  const ctx = ensure(name);
  if (!ctx) return false;
  try {
    ctx.stop();
    ctx.seek(0);
    ctx.play();
  } catch (e) {
    return false;
  }
  return true;
}

/* ---------------- 语义化封装：业务只调这些 ---------------- */

// 轻点：按钮按下 / 分类切换 / 选项勾选
function tap() { play('tap', { once: 100 }); }

// 弹性：收藏心 / 重要选中 / 提交成功
function pop() { play('pop', { once: 260 }); }

// 抽屉：筛选页进出、底部弹层
function slide() { play('slide', { once: 320 }); }

// 转场：页面跳转（T1~T5 共用）
function whoosh() { play('whoosh', { once: 300 }); }

// 完成：结果生成 / 长任务结束
function chime() { play('chime', { once: 1200 }); }

// 提示：错误 / 未登录拦截 / 表单校验失败
function warn() { play('warn', { once: 400 }); }

// 码表：滚动吸附每格
function tick() { play('tick', { once: 60 }); }

/* ---------------- 与震动联动：一次操作 = 一声 + 一震 ---------------- */
const UI_VIB = require('./ui.js');

function feedback(kind) {
  if (kind === 'tap') { tap(); UI_VIB.vibrate('light'); }
  else if (kind === 'pop') { pop(); UI_VIB.vibrate('medium'); }
  else if (kind === 'nav') { whoosh(); UI_VIB.vibrate('light'); }
  else if (kind === 'done') { chime(); UI_VIB.vibrate('medium'); }
  else if (kind === 'warn') { warn(); UI_VIB.vibrate('heavy'); }
  else if (kind === 'tick') { tick(); }
  else if (kind === 'drawer') { slide(); UI_VIB.vibrate('light'); }
}

module.exports = {
  setEnabled: setEnabled,
  isEnabled: isEnabled,
  play: play,
  tap: tap,
  pop: pop,
  slide: slide,
  whoosh: whoosh,
  chime: chime,
  warn: warn,
  tick: tick,
  feedback: feedback
};
