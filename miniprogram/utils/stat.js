// 第二文化 · 数字展示闸门（《需求文档 V3.0》§4 数据真实性规范）
//
// 规则（P0，不可绕过）：
//   1. 只有【后台实测】或【商家后台录入】的数字可以上屏；
//   2. 开发版 / 体验版也不再显示编造数字；只有后台真实统计或商家录入才上屏；
//   3. 没有来源的粉丝数、好评率、销量、「多少人测过」、观看数一律隐藏；
//   4. 后台已接入真实统计时，把 config.statsFromBackend 设为 true，闸门才打开。

function demoOn() {
  try {
    return !!getApp().globalData.demoStats;
  } catch (e) {
    return false;
  }
}

function num(n) {
  // 数据里可能写成 '8,204' 或 '3.2万'，先清洗再算，避免把中文单位算成 0
  const s = String(n == null ? 0 : n).replace(/,/g, '').trim();
  const wan = s.match(/^([0-9]+(?:\.[0-9]+)?)\s*万/);
  if (wan) return Math.round(parseFloat(wan[1]) * 10000);
  const v = Number(s);
  return isFinite(v) ? v : 0;
}

function fmt(n) {
  const v = num(n);
  if (v >= 10000) {
    const w = v / 10000;
    return (w >= 10 ? Math.round(w) : Math.round(w * 10) / 10) + '万';
  }
  return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 通用数字 + 单位：人数、观看数、点赞数
function count(n, unit) {
  const v = num(n);
  if (!demoOn() || !v) return '';
  return fmt(v) + (unit || '');
}

// 商家粉丝：只显示「有来源」的数字，否则给出可解释的状态
function fans(n) {
  return demoOn() && num(n) ? fmt(n) + ' 粉丝' : '';
}

// 商家名片一行：粉丝 / 好评率 / 开店年数
function shopMeta(s) {
  if (!s) return '独立小店 · 手作与改制';
  if (!demoOn()) return '店铺信息待接入 · 不展示未核验数据';
  return '粉丝 ' + fmt(s.fans) + ' · 好评率 ' + s.rate + ' · 开店 ' + s.years + ' 年';
}

// 商品评价一行（详情页「评价」那一栏）
function rateLine(s) {
  if (!demoOn()) return '评价数据待接入';
  return (s && s.reviews ? s.reviews + ' 条 · ' : '') + '好评率 ' + ((s && s.rate) || '—');
}

// 已售件数
function sold(n) {
  return demoOn() && Number(n) ? '已售 ' + n + ' 件' : '';
}

// 设置页「数据来源」状态说明
function sourceNote() {
  return demoOn() ? '示例数据 · 正式版自动关闭' : '暂未接入统计 · 不展示估算值，接入后自动显示';
}

// 价格：商品字段有价就显示；示例商品由页面上的「示例」标负责说明，不拿统计闸门误伤
function price(v, at) {
  if (!v) return '';
  return at ? v + ' · ' + at : v;
}

module.exports = {
  on: demoOn,
  count: count,
  fans: fans,
  shopMeta: shopMeta,
  rateLine: rateLine,
  sold: sold,
  price: price,
  sourceNote: sourceNote
};
