// 筛选内核 · 商城 / 分类 / 搜索 / 独立筛选页共用同一套口径
// 独立成文件的原因：之前筛选逻辑散在各页面，容易出现「筛选页显示 5 件、列表页出 7 件」。
// 现在所有页面都调用这里的 apply / count / chosen，条件结构与结果必然一致。

const C = require('../data/content.js');

/** 空条件 */
function empty() {
  return {
    cat: '',
    sort: 'default',
    min: '',
    max: '',
    range: '',
    style: [],
    brand: [],
    size: []
  };
}

function priceNum(p) {
  return Number(String(p).replace(/[^\d.]/g, '')) || 0;
}

/** 快捷区间文案 → 数值 */
function parseRange(r) {
  if (!r) return { min: '', max: '' };
  if (r === '¥0-300') return { min: '0', max: '300' };
  if (r === '¥300-800') return { min: '300', max: '800' };
  if (r === '¥800-1500') return { min: '800', max: '1500' };
  if (r === '¥1500 以上') return { min: '1500', max: '' };
  return { min: '', max: '' };
}

/** 单选：某商品是否命中某一组（组内取并集，组间取交集） */
function hitGroup(p, group) {
  const g = C.filterGroups.filter((x) => x.key === group.key)[0];
  if (!g) return true;
  const picked = group.picked || [];
  if (!picked.length) return true;
  const field = g.field || g.key;
  const val = p[field];
  if (Array.isArray(val)) {
    return val.some((v) => picked.indexOf(v) >= 0);
  }
  return picked.indexOf(val) >= 0;
}

/**
 * 执行筛选 + 排序
 * @param {array} list 原始商品（不传则用全量）
 * @param {object} cond 见 empty()
 */
function apply(list, cond) {
  const src = list || C.products;
  cond = cond || empty();
  let out = src.slice();

  if (cond.cat && cond.cat !== '推荐') {
    out = out.filter((p) => p.cat === cond.cat);
  }

  C.filterGroups.forEach((g) => {
    const picked = cond[g.key] || [];
    if (!picked.length) return;
    out = out.filter((p) => hitGroup(p, { key: g.key, picked: picked }));
  });

  const min = cond.min ? Number(cond.min) : 0;
  const max = cond.max ? Number(cond.max) : 0;
  if (min) out = out.filter((p) => priceNum(p.price) >= min);
  if (max) out = out.filter((p) => priceNum(p.price) <= max);

  return sort(out, cond.sort);
}

/** 排序（三种：默认推荐 / 价格升 / 价格降） */
function sort(list, key) {
  const out = list.slice();
  if (key === 'priceAsc') {
    out.sort((a, b) => priceNum(a.price) - priceNum(b.price));
  } else if (key === 'priceDesc') {
    out.sort((a, b) => priceNum(b.price) - priceNum(a.price));
  }
  return out;
}

/** 命中数量 */
function count(cond, list) {
  return apply(list, cond).length;
}

/** 已选条件条：把条件摊平成可单独删除的 chip */
function chosen(cond) {
  const out = [];
  C.filterGroups.forEach((g) => {
    (cond[g.key] || []).forEach((v) => {
      out.push({ k: g.key, v: v, g: g.name, id: g.key + '_' + v });
    });
  });
  if (cond.range || cond.min || cond.max) {
    const label = cond.range ||
      ((cond.min || '0') + ' - ' + (cond.max || '不限'));
    out.push({ k: 'price', v: label, g: '价格', id: 'price' });
  }
  return out;
}

/** 已选条件总数 */
function chosenCount(cond) {
  return chosen(cond).length;
}

/**
 * 从 URL query 还原条件（筛选页入口用）
 * 数组参数用逗号分隔，避免 URL 过长
 */
function fromQuery(q) {
  const c = empty();
  if (!q) return c;
  c.cat = q.cat || '';
  c.sort = q.sort || 'default';
  c.min = q.min || '';
  c.max = q.max || '';
  c.range = q.range || '';
  ['style', 'brand', 'size'].forEach((k) => {
    c[k] = q[k] ? String(q[k]).split(',').filter(Boolean) : [];
  });
  return c;
}

/** 条件 → URL query（数组压成逗号串） */
function toQuery(cond) {
  const p = [];
  if (cond.cat) p.push('cat=' + encodeURIComponent(cond.cat));
  if (cond.sort && cond.sort !== 'default') p.push('sort=' + cond.sort);
  if (cond.min) p.push('min=' + cond.min);
  if (cond.max) p.push('max=' + cond.max);
  if (cond.range) p.push('range=' + encodeURIComponent(cond.range));
  ['style', 'brand', 'size'].forEach((k) => {
    if ((cond[k] || []).length) p.push(k + '=' + encodeURIComponent(cond[k].join(',')));
  });
  return p.length ? '?' + p.join('&') : '';
}

/**
 * 条件 → 可直接 setData 的扁平结构（列表页拿到筛选结果后落地用）
 * 列表页原本的数据键是 sort / min / max / curRange / sel
 */
function toPageData(cond) {
  return {
    sort: cond.sort,
    min: cond.min,
    max: cond.max,
    curRange: cond.range,
    sel: {
      style: cond.style,
      brand: cond.brand,
      size: cond.size
    },
    cond: cond
  };
}

/** 反过来：列表页的扁平结构 → 条件对象 */
function fromPageData(d) {
  const sel = (d && d.sel) || {};
  return {
    cat: (d && d.curCat) || '',
    sort: (d && d.sort) || 'default',
    min: (d && d.min) || '',
    max: (d && d.max) || '',
    range: (d && d.curRange) || '',
    style: sel.style || [],
    brand: sel.brand || [],
    size: sel.size || []
  };
}

module.exports = {
  empty: empty,
  parseRange: parseRange,
  priceNum: priceNum,
  apply: apply,
  sort: sort,
  count: count,
  chosen: chosen,
  chosenCount: chosenCount,
  fromQuery: fromQuery,
  toQuery: toQuery,
  toPageData: toPageData,
  fromPageData: fromPageData
};
