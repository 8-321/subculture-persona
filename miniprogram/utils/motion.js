// 动效调度器 · JS 侧
// 配合 styles/motion.wxss 使用。WXSS 负责「怎么动」，本文件负责「什么时候动、动多久、动到第几个」。
// 参数严格照《第二文化_动效设计规范》：
//   交错入场 26ms/40ms 错峰；码表数字滚动 700ms 曲线 F；多位数逐位错峰 40ms；
//   减弱动效（reduceMotion）时一律直接落到终值，不做补间。

/* ---------------- cubic-bezier 求解器（牛顿迭代 + 二分兜底） ---------------- */
function bezier(x1, y1, x2, y2) {
  function A(a1, a2) { return 1 - 3 * a2 + 3 * a1; }
  function B(a1, a2) { return 3 * a2 - 6 * a1; }
  function C(a1) { return 3 * a1; }
  function calc(t, a1, a2) { return ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t; }
  function slope(t, a1, a2) { return 3 * A(a1, a2) * t * t + 2 * B(a1, a2) * t + C(a1); }
  return function (x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i += 1) {
      const s = slope(t, x1, x2);
      if (s === 0) break;
      t -= (calc(t, x1, x2) - x) / s;
    }
    // 兜底二分
    if (t < 0 || t > 1) {
      let lo = 0; let hi = 1;
      t = x;
      for (let i = 0; i < 20; i += 1) {
        const v = calc(t, x1, x2);
        if (Math.abs(v - x) < 1e-4) break;
        if (v > x) hi = t; else lo = t;
        t = (lo + hi) / 2;
      }
    }
    return calc(t, y1, y2);
  };
}

// 规范六条曲线
const EASE = {
  A: bezier(0.2, 0, 0, 1),        // 标准减速
  B: bezier(0.34, 1.56, 0.64, 1), // 过冲回弹
  C: bezier(0.22, 1, 0.36, 1),    // 快出慢收
  D: bezier(0.65, 0.05, 0.36, 1), // 缓入快出
  E: function (x) { return x; },  // 匀速
  F: bezier(0.33, 1, 0.68, 1)     // 长尾收束
};

function reduce() {
  try {
    return !!getApp().globalData.reduceMotion;
  } catch (e) {
    return false;
  }
}

/* ---------------- 交错入场 ---------------- */
/**
 * 生成延迟数组：长列表只做前 cap 项，其余统一用最后一档，避免尾部等待过久
 * @param {number} n 项数
 * @param {number} step 错峰 26（卡片）/ 40（行）
 * @param {number} base 起始延迟
 * @param {number} cap 最多错峰到第几项（规范：长列表只做前 8~10 项）
 */
function delays(n, step, base, cap) {
  step = step === undefined ? 26 : step;
  base = base || 0;
  cap = cap === undefined ? 10 : cap;
  const out = [];
  for (let i = 0; i < n; i += 1) {
    out.push(base + Math.min(i, cap) * step);
  }
  return out;
}

/** 给列表每一项挂上 _d（延迟 ms），WXML 里写 style="--m-d:{{item._d}}ms" */
function stagger(list, step, base, cap) {
  if (reduce()) {
    return (list || []).map((it) => Object.assign({}, it, { _d: 0 }));
  }
  const ds = delays((list || []).length, step, base, cap);
  return (list || []).map((it, i) => Object.assign({}, it, { _d: ds[i] }));
}

/* ---------------- 通用补间 ---------------- */
/**
 * @param {object} opts { dur, ease('C'), onFrame(k, eased), onDone }
 * @returns {function} cancel
 */
function tween(opts) {
  const dur = opts.dur || 300;
  const ease = EASE[opts.ease || 'C'] || EASE.C;
  const onFrame = opts.onFrame || function () {};
  const onDone = opts.onDone || function () {};
  if (reduce() || dur <= 0) {
    onFrame(1, 1);
    onDone();
    return function () {};
  }
  const step = 1000 / 60;
  const total = Math.max(1, Math.round(dur / step));
  let i = 0;
  const timer = setInterval(() => {
    i += 1;
    const k = i / total;
    if (k >= 1) {
      clearInterval(timer);
      onFrame(1, 1);
      onDone();
    } else {
      onFrame(k, ease(k));
    }
  }, step);
  return function () { clearInterval(timer); };
}

/* ---------------- 码表数字滚动（CountUp） ---------------- */
/**
 * 单个数字滚动：700ms / 曲线 F（前段慢启动、末段减速）
 * @param {object} page 页面实例
 * @param {string} key  data 里的键，如 'matched'
 * @param {number} to   终值
 */
function countUp(page, key, to, opts) {
  opts = opts || {};
  const dur = opts.dur || 700;
  const delay = opts.delay || 0;
  const round = opts.round === undefined ? true : opts.round;
  if (reduce()) {
    const p = {}; p[key] = to; page.setData(p);
    if (opts.onDone) opts.onDone();
    return function () {};
  }
  const set = (v) => { const p = {}; p[key] = v; page.setData(p); };
  set(opts.from || 0);
  let cancel = function () {};
  const t = setTimeout(() => {
    cancel = tween({
      dur: dur,
      ease: 'F',
      onFrame: (k, e) => {
        const v = (opts.from || 0) + (to - (opts.from || 0)) * e;
        set(round ? Math.round(v) : Math.round(v * 10) / 10);
      },
      onDone: () => { set(to); if (opts.onDone) opts.onDone(); }
    });
  }, delay);
  return function () { clearTimeout(t); cancel(); };
}

/**
 * 一组数字滚动：多位数逐位错峰 40ms（个位先动、十位后动，像真码表）
 * @param {object} page
 * @param {string} listKey data 里的数组键
 * @param {string} valKey  数组项里的数值键
 * @param {array} targets  终值数组
 */
function countUpList(page, listKey, valKey, targets, opts) {
  opts = opts || {};
  const dur = opts.dur || 700;
  const gap = opts.gap === undefined ? 40 : opts.gap;
  const list = page.data[listKey] || [];
  if (reduce()) {
    page.setData({
      [listKey]: list.map((it, i) => Object.assign({}, it, { [valKey]: targets[i] }))
    });
    if (opts.onDone) opts.onDone();
    return function () {};
  }
  const cancels = targets.map((to, i) =>
    countUp(page, listKey + '[' + i + '].' + valKey, to, { dur: dur, delay: i * gap })
  );
  return function () { cancels.forEach((c) => c()); };
}

/* ---------------- 点击火花（ClickSpark） ---------------- */
let sparkSeq = 0;

/**
 * 在触点炸开一圈粒子。需要坐标：优先取 e.touches / e.changedTouches，
 * 取不到就静默跳过（不报错、不影响点击）。
 * @returns {boolean} 是否生成了火花
 */
function spark(page, e, opts) {
  if (reduce()) return false;
  opts = opts || {};
  const t = (e && e.touches && e.touches[0]) ||
            (e && e.changedTouches && e.changedTouches[0]) ||
            (e && e.detail && typeof e.detail.x === 'number' ? { clientX: e.detail.x, clientY: e.detail.y } : null);
  if (!t) return false;
  return sparkAt(page, t.clientX, t.clientY, opts);
}

/**
 * 直接用坐标炸火花（跟手场景：bindtouchstart 里取到坐标后调用）
 */
function sparkAt(page, x, y, opts) {
  if (reduce()) return false;
  opts = opts || {};
  const n = opts.count || 7;
  const r = opts.radius || 44;
  const arr = [];
  for (let i = 0; i < n; i += 1) {
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.5;
    const d = r * (0.6 + Math.random() * 0.7);
    sparkSeq += 1;
    arr.push({
      id: 'sp' + sparkSeq,
      x: x - 5,
      y: y - 5,
      sx: Math.round(Math.cos(a) * d),
      sy: Math.round(Math.sin(a) * d),
      s: 0.6 + Math.random() * 0.8
    });
  }
  const sparks = (page.data.sparks || []).concat(arr);
  page.setData({ sparks: sparks });
  setTimeout(() => {
    const ids = {};
    arr.forEach((s) => { ids[s.id] = 1; });
    page.setData({ sparks: (page.data.sparks || []).filter((s) => !ids[s.id]) });
  }, opts.life || 560);
  return true;
}

/* ---------------- 解密文本（DecryptedText） ---------------- */
const GLYPHS = ['▚', '▞', '░', '▓', '◼', '◻', '▙', '▟'];

/**
 * 逐字把乱码替换成真实文字，用于结果页人格名
 * @param {object} page
 * @param {string} key  data 键
 * @param {string} text 最终文本
 */
function decrypt(page, key, text, opts) {
  opts = opts || {};
  const per = opts.per || 46;    // 每字间隔
  const tail = opts.tail || 5;   // 尾部保留几位乱码（滚动的「尾巴」）
  text = String(text || '');
  if (reduce()) {
    const p = {}; p[key] = text; page.setData(p);
    if (opts.onDone) opts.onDone();
    return function () {};
  }
  const n = text.length;
  let i = 0;
  const timer = setInterval(() => {
    i += 1;
    let out = '';
    for (let j = 0; j < n; j += 1) {
      if (j < i) out += text[j];
      else if (j < i + tail) out += GLYPHS[(j + i) % GLYPHS.length];
      else out += ' ';
    }
    const p = {}; p[key] = out; page.setData(p);
    if (i > n + tail) {
      clearInterval(timer);
      const f = {}; f[key] = text; page.setData(f);
      if (opts.onDone) opts.onDone();
    }
  }, per);
  return function () { clearInterval(timer); };
}

/* ---------------- 滚动揭示（ScrollReveal） ---------------- */
/**
 * 元素进入视口才播入场动画。WXML 里给列表项加 class="m-rv" data-idx="{{index}}"
 * @param {object} page
 * @param {string} listKey data 里的数组键
 * @param {object} opts { sel, step, cap, bottom }
 * @returns {object|null} observer（页面 onUnload 里 disconnect）
 */
function reveal(page, listKey, opts) {
  opts = opts || {};
  const sel = opts.sel || '.m-rv';
  const step = opts.step || 40;
  const cap = opts.cap === undefined ? 8 : opts.cap;
  let seq = 0;
  try {
    const obs = wx.createIntersectionObserver(page, { thresholds: [0.02], observeAll: true });
    obs.relativeToViewport({ bottom: opts.bottom === undefined ? -10 : opts.bottom });
    obs.observe(sel, (res) => {
      const idx = Number(res.dataset && res.dataset.idx);
      if (isNaN(idx)) return;
      const arr = page.data[listKey] || [];
      if (!arr[idx] || arr[idx]._rv) return;
      const d = Math.min(seq, cap) * step;
      seq += 1;
      page.setData({
        [listKey + '[' + idx + ']._rv']: true,
        [listKey + '[' + idx + ']._d']: reduce() ? 0 : d
      });
    });
    return obs;
  } catch (e) {
    // 兜底：观察器不可用时全部直接可见，绝不留白屏
    const arr = page.data[listKey] || [];
    const patch = {};
    arr.forEach((it, i) => {
      patch[listKey + '[' + i + ']._rv'] = true;
      patch[listKey + '[' + i + ']._d'] = 0;
    });
    if (arr.length) page.setData(patch);
    return null;
  }
}

/* ---------------- 一次性重播（用于反复触发的反馈动画） ---------------- */
/**
 * 给某个元素临时加 class，动画结束后摘掉，便于下次再次触发
 * @param {object} page
 * @param {string} key  data 里的 class 名键
 * @param {string} cls  要加的 class
 */
function once(page, key, cls, ms) {
  if (reduce()) return;
  const p = {}; p[key] = cls; page.setData(p);
  setTimeout(() => {
    const q = {}; q[key] = ''; page.setData(q);
  }, ms || 420);
}

/* ---------------- 跟手：3D 倾斜（TiltCard） ---------------- */
/**
 * bindtouchmove 里调用，按触点在元素内的相对位置算 ±2.5° 倾斜
 * @returns {object} { rx, ry }
 */
function tiltOf(e, max) {
  max = max || 2.5;
  const t = (e && e.touches && e.touches[0]) || null;
  if (!t) return { rx: 0, ry: 0 };
  const d = e.currentTarget || {};
  const w = (d.offsetWidth || d.width || 300);
  const h = (d.offsetHeight || d.height || 300);
  const px = (t.clientX || 0) - (d.offsetLeft || 0);
  const py = (t.clientY || 0) - (d.offsetTop || 0);
  const fx = Math.max(-1, Math.min(1, (px / w) * 2 - 1));
  const fy = Math.max(-1, Math.min(1, (py / h) * 2 - 1));
  return { rx: -fy * max, ry: fx * max };
}

/* ---------------- 跟手：磁吸（MagneticButton） ---------------- */
/**
 * bindtouchmove 里调用，元素向触点吸附（最多 max px）
 * @returns {object} { mx, my, ms }
 */
function magnetOf(e, max) {
  max = max || 10;
  const t = (e && e.touches && e.touches[0]) || null;
  if (!t) return { mx: 0, my: 0, ms: 1 };
  const d = e.currentTarget || {};
  const cx = (d.offsetLeft || 0) + (d.offsetWidth || d.width || 120) / 2;
  const cy = (d.offsetTop || 0) + (d.offsetHeight || d.height || 56) / 2;
  let dx = (t.clientX || 0) - cx;
  let dy = (t.clientY || 0) - cy;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const k = Math.min(1, dist / 90);
  return {
    mx: Math.round((dx / dist) * max * k),
    my: Math.round((dy / dist) * max * k),
    ms: 1 + 0.03 * k
  };
}

module.exports = {
  EASE: EASE,
  bezier: bezier,
  reduce: reduce,
  delays: delays,
  stagger: stagger,
  tween: tween,
  countUp: countUp,
  countUpList: countUpList,
  spark: spark,
  sparkAt: sparkAt,
  decrypt: decrypt,
  reveal: reveal,
  once: once,
  tiltOf: tiltOf,
  magnetOf: magnetOf
};
