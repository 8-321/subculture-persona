// 本地存储层：登录态 / 收藏 / 点赞 / 历史 / 报告 / 答题进度 / 搜索历史
// 零后端方案，全部走 wx.*StorageSync；后续接云开发时只需替换本文件的读写实现。

const K = {
  CONFIG: 'sc_config',
  USER: 'sc_user',
  FAV_POST: 'sc_fav_post',      // 内容收藏（帖子 / 知识 / 测试）
  FAV_LIKE: 'sc_fav_like',      // 点赞
  FAV_SHOP: 'sc_fav_shop',      // 商品收藏
  HISTORY: 'sc_history',        // 浏览历史
  REPORTS: 'sc_reports',        // 我的报告
  PROGRESS: 'sc_progress',      // 答题进度
  SEARCH: 'sc_search',          // 搜索历史
  FOLLOW: 'sc_follow',          // 关注的商家
  REPORT: 'sc_report',          // 内容举报记录
  DRAFT: 'sc_draft'             // 本地草稿（发布通道未开时先存这里）
};

function get(key, def) {
  try {
    const v = wx.getStorageSync(key);
    return (v === '' || v === null || v === undefined) ? def : v;
  } catch (e) {
    return def;
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(key, value);
  } catch (e) {
    console.warn('storage set failed', key, e);
  }
}

/* ---------------- 配置 ---------------- */
function getConfig() {
  return get(K.CONFIG, { theme: 'light', reduceMotion: false });
}
function setConfig(patch) {
  const next = Object.assign(getConfig(), patch || {});
  set(K.CONFIG, next);
  return next;
}

/* ---------------- 登录态 ---------------- */
function getUser() {
  return get(K.USER, null);
}
function setUser(user) {
  set(K.USER, user || null);
}
function updateUser(patch) {
  const u = Object.assign(getUser() || {}, patch || {});
  set(K.USER, u);
  return u;
}

// 举报列表用的时间显示（HH:MM；跨天加「昨天/日期」）
function hhmm(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const p = (n) => (n < 10 ? '0' + n : '' + n);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const hm = p(d.getHours()) + ':' + p(d.getMinutes());
  if (sameDay) return hm;
  return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm;
}

/* ---------------- 通用列表增删查 ---------------- */
function list(key) {
  const v = get(key, []);
  return Array.isArray(v) ? v : [];
}
function has(key, id) {
  return list(key).some((it) => it.id === id);
}
function add(key, item) {
  const arr = list(key);
  if (arr.some((it) => it.id === item.id)) return arr;
  arr.unshift(Object.assign({ ts: Date.now() }, item));
  set(key, arr);
  return arr;
}
function remove(key, id) {
  const arr = list(key).filter((it) => it.id !== id);
  set(key, arr);
  return arr;
}
function toggle(key, item) {
  return has(key, item.id) ? remove(key, item.id) : add(key, item);
}

/* ---------------- 收藏 / 点赞 ---------------- */
const FavPost = {
  all: () => list(K.FAV_POST),
  has: (id) => has(K.FAV_POST, id),
  toggle: (item) => toggle(K.FAV_POST, item),
  remove: (id) => remove(K.FAV_POST, id)
};
const FavLike = {
  all: () => list(K.FAV_LIKE),
  has: (id) => has(K.FAV_LIKE, id),
  toggle: (item) => toggle(K.FAV_LIKE, item),
  remove: (id) => remove(K.FAV_LIKE, id)
};
const FavShop = {
  all: () => list(K.FAV_SHOP),
  has: (id) => has(K.FAV_SHOP, id),
  toggle: (item) => toggle(K.FAV_SHOP, item),
  remove: (id) => remove(K.FAV_SHOP, id)
};
const Follow = {
  all: () => list(K.FOLLOW),
  has: (id) => has(K.FOLLOW, id),
  toggle: (item) => toggle(K.FOLLOW, item),
  remove: (id) => remove(K.FOLLOW, id)
};

/* ---------------- 浏览历史 ---------------- */
const History = {
  all: () => list(K.HISTORY),
  push: (item) => {
    const arr = list(K.HISTORY).filter((it) => it.id !== item.id);
    arr.unshift(Object.assign({ ts: Date.now() }, item));
    set(K.HISTORY, arr.slice(0, 200));
    return arr;
  },
  clear: () => set(K.HISTORY, [])
};

/* ---------------- 我的报告 ---------------- */
const Reports = {
  all: () => list(K.REPORTS),
  add: (report) => {
    const item = Object.assign({ id: 'r_' + Date.now(), ts: Date.now() }, report);
    const arr = list(K.REPORTS);
    arr.unshift(item);
    set(K.REPORTS, arr);
    return item;
  },
  remove: (id) => remove(K.REPORTS, id),
  get: (id) => list(K.REPORTS).filter((it) => it.id === id)[0] || null
};

/* ---------------- 答题进度 ---------------- */
const Progress = {
  get: (testId) => {
    const all = get(K.PROGRESS, {});
    return all[testId] || null;
  },
  save: (testId, data) => {
    const all = get(K.PROGRESS, {});
    all[testId] = Object.assign({ updatedAt: Date.now() }, data);
    set(K.PROGRESS, all);
  },
  clear: (testId) => {
    const all = get(K.PROGRESS, {});
    delete all[testId];
    set(K.PROGRESS, all);
  }
};

/* ---------------- 搜索历史 ---------------- */
const SearchHistory = {
  all: () => list(K.SEARCH),
  push: (kw) => {
    if (!kw) return;
    const arr = list(K.SEARCH).filter((it) => it.kw !== kw);
    arr.unshift({ id: 's_' + kw, kw: kw, ts: Date.now() });
    set(K.SEARCH, arr.slice(0, 10));
  },
  clear: () => set(K.SEARCH, [])
};

/* ---------------- 内容举报（P0 合规） ----------------
   内容类小程序必须提供举报入口。这里记录「举报了哪条、什么理由、什么时候」；
   同一条内容被举报达到 HIDE_AT 次，先在本地隐藏（接后台后改成服务端复核状态）。 */
const HIDE_AT = 3;
const Report = {
  all: () => list(K.REPORT),
  add: (item) => {
    const arr = list(K.REPORT);
    arr.unshift(Object.assign({ ts: Date.now() }, item));
    set(K.REPORT, arr.slice(0, 200));
    return arr;
  },
  countOf: (id) => list(K.REPORT).filter((it) => it.id === id).length,
  isHidden: (id) => list(K.REPORT).filter((it) => it.id === id).length >= HIDE_AT,
  // 按内容聚合：我的举报列表用（同一条内容被举报多次合成一行）
  grouped: () => {
    const m = {};
    list(K.REPORT).forEach((it) => {
      if (!m[it.id]) m[it.id] = { id: it.id, title: it.title || '', type: it.type || 'post', times: 0, reasons: [], ts: it.ts || 0 };
      const g = m[it.id];
      g.times++;
      if (it.reason && g.reasons.indexOf(it.reason) < 0) g.reasons.push(it.reason);
      if ((it.ts || 0) > g.ts) g.ts = it.ts;
    });
    return Object.keys(m)
      .map((k) => {
        const g = m[k];
        g.hidden = g.times >= HIDE_AT;
        g.time = hhmm(g.ts);
        return g;
      })
      .sort((a, b) => b.ts - a.ts);
  },
  // 撤销：把这条内容的所有举报都删掉（内容随之回到列表）
  removeById: (id) => set(K.REPORT, list(K.REPORT).filter((it) => it.id !== id)),
  hiddenIds: () => {
    const m = {};
    list(K.REPORT).forEach((it) => { m[it.id] = (m[it.id] || 0) + 1; });
    return Object.keys(m).filter((id) => m[id] >= HIDE_AT);
  },
  clear: () => set(K.REPORT, [])
};

/* ---------------- 本地草稿 ----------------
   发布通道尚未接入后台时，先把用户写的东西完整留在本机，
   不能只说一句「已提交，审核后可见」然后把内容丢掉。 */
const Draft = {
  all: () => list(K.DRAFT),
  add: (item) => {
    const arr = list(K.DRAFT).filter((it) => it.id !== item.id);
    arr.unshift(Object.assign({ ts: Date.now() }, item));
    set(K.DRAFT, arr.slice(0, 30));
    return arr;
  },
  remove: (id) => remove(K.DRAFT, id),
  clear: () => set(K.DRAFT, [])
};

module.exports = {
  K,
  getConfig, setConfig,
  getUser, setUser, updateUser,
  FavPost, FavLike, FavShop, Follow,
  History, Reports, Progress, SearchHistory, Report, Draft
};
