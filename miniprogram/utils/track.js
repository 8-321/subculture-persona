// 行为埋点（V3.1）：只记在本机，不上报、不含手机号等个人信息。
// 事件名必须在下表登记；未登记的事件直接丢弃并告警，避免「随手起个名字」把口径搞乱。
// 用途：核对漏斗（进详情 → 开始 → 每题 → 完成 → 报告 → 收藏/分享/跳转），设置页可查看与清空。
//
// 用法：getApp().track('post_view', { id: 'w1' })
//       Track.recent(5) / Track.summary() / Track.clear()

const KEY = 'sc_track';
const MAX = 300;

const EVENTS = {
  app_launch:         { k: [],                        d: '冷启动' },
  test_detail_view:   { k: ['id', 'resumed'],         d: '进测试详情' },
  quiz_start:         { k: ['id', 'resumed'],         d: '开始/继续答题' },
  quiz_answer:        { k: ['id', 'index', 'key'],    d: '作答一题' },
  quiz_finish:        { k: ['id', 'type', 'seconds'], d: '答完出报告' },
  result_view:        { k: ['type'],                  d: '看报告' },
  result_fav:         { k: ['type', 'on'],            d: '收藏报告' },
  result_copy_source: { k: ['type'],                  d: '复制文化出处' },
  post_view:          { k: ['id', 'kind'],            d: '看帖子/文章' },
  post_like:          { k: ['id', 'on'],              d: '点赞' },
  post_fav:           { k: ['id', 'on'],              d: '收藏内容' },
  post_share:         { k: ['id', 'kind'],            d: '分享内容' },
  report_submit:      { k: ['id', 'reason', 'times'], d: '举报内容' },
  product_view:       { k: ['id'],                    d: '看商品' },
  shop_view:          { k: ['name'],                  d: '看店铺' },
  product_jump:       { k: ['id', 'hasLink'],         d: '点去第三方' },
  search_submit:      { k: ['kw', 'hits'],            d: '搜索' },
  setting_toggle:     { k: ['key', 'value'],          d: '改设置' },
  merchant_submit:    { k: ['type', 'cats'],          d: '提交商家登记' },
  report_undo:        { k: ['id'],                    d: '撤销举报' },
  type_view:          { k: ['code'],                  d: '看人格档案' },
  card_save:          { k: ['type'],                  d: '保存人格名片' }
};

function allowed(e) {
  return Object.prototype.hasOwnProperty.call(EVENTS, e);
}

// 只保留登记过的参数名与基础类型，字符串截 80 字（防止把整段正文写进日志）
function clean(params, keys) {
  const out = {};
  if (!params) return out;
  Object.keys(params).forEach((k) => {
    if (keys && keys.length && keys.indexOf(k) < 0) return;
    const v = params[k];
    if (v === null || v === undefined) return;
    if (typeof v === 'string') out[k] = v.slice(0, 80);
    else if (typeof v === 'number' || typeof v === 'boolean') out[k] = v;
  });
  return out;
}

function all() {
  try {
    const a = wx.getStorageSync(KEY);
    return Array.isArray(a) ? a : [];
  } catch (e) {
    return [];
  }
}

function log(event, params) {
  if (!allowed(event)) {
    console.warn('[track] 未登记事件已丢弃：' + event);
    return false;
  }
  const arr = all();
  arr.push({ e: event, p: clean(params, EVENTS[event].k), t: Date.now() });
  try {
    wx.setStorageSync(KEY, arr.slice(-MAX));
  } catch (e) {
    /* 存储写失败不影响主流程 */
  }
  return true;
}

function hhmm(ts) {
  const d = new Date(ts);
  const p = (n) => (n < 10 ? '0' + n : '' + n);
  return p(d.getHours()) + ':' + p(d.getMinutes());
}

// 最近 n 条（新的在前），带中文事件名与时间，直接可渲染
function recent(n) {
  return all().slice(-(n || 10)).reverse().map((it) => ({
    e: it.e,
    d: (EVENTS[it.e] || {}).d || it.e,
    time: hhmm(it.t),
    p: it.p || {}
  }));
}

// 事件计数（按次数从多到少），给设置页做「漏斗一眼看」
function summary() {
  const m = {};
  all().forEach((it) => { m[it.e] = (m[it.e] || 0) + 1; });
  return Object.keys(m)
    .map((e) => ({ e: e, n: m[e], d: (EVENTS[e] || {}).d || e }))
    .sort((a, b) => b.n - a.n);
}

function count() {
  return all().length;
}

function clear() {
  try { wx.setStorageSync(KEY, []); } catch (e) { /* noop */ }
}

module.exports = { log: log, all: all, recent: recent, summary: summary, count: count, clear: clear, EVENTS: EVENTS, allowed: allowed };
