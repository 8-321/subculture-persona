module.exports = [
  {
    file: 'miniprogram/app.js',
    old: `    // 数据真实性闸门（需求 V3.0 §4）：开发/体验版显示示例数字，正式版自动关闭，
    // 关闭后所有无后台来源的粉丝/好评率/销量/人测过一律显示「待接入」。
    demoStats: true`,
    new: `    // 数据真实性闸门（需求 V3.0 §4）：没有后台来源的粉丝/好评率/销量/人测过一律不显示。
    // 不再用「开发版先显示假数字」的做法；只有接入真实统计后才打开。
    demoStats: false`
  },
  {
    file: 'miniprogram/app.js',
    old: `  // 闸门判定：后台已接入真实统计 → 关；正式版 → 关；开发/体验版 → 开（便于核对排版）
  resolveDemoStats(cfg) {
    if (cfg && cfg.statsFromBackend) return false;
    try {
      const info = wx.getAccountInfoSync();
      const env = info && info.miniProgram && info.miniProgram.envVersion;
      return env !== 'release';
    } catch (e) {
      return false; // 取不到环境信息时按正式版处理：宁可少显示，不可编造
    }
  },`,
    new: `  // 闸门判定：只有后台已接入真实统计才打开；其余一律关闭，宁可少显示，不可编造。
  resolveDemoStats(cfg) {
    return !!(cfg && cfg.statsFromBackend);
  },`
  },
  {
    file: 'miniprogram/utils/stat.js',
    old: `//   2. 开发版 / 体验版为了核对排版，允许显示示例数字（demoStats = true）；
//   3. 正式版（envVersion = release）自动关闭闸门 —— 一切粉丝数、好评率、销量、
//      「多少人测过」、观看数改为「待接入」，宁可空着，不编造；
//   4. 后台已接入真实统计时，把 config.statsFromBackend 设为 true，闸门永久关闭。`,
    new: `//   2. 开发版 / 体验版也不再显示编造数字；只有后台真实统计或商家录入才上屏；
//   3. 没有来源的粉丝数、好评率、销量、「多少人测过」、观看数一律隐藏；
//   4. 后台已接入真实统计时，把 config.statsFromBackend 设为 true，闸门才打开。`
  },
  {
    file: 'miniprogram/utils/stat.js',
    old: `function count(n, unit) {
  const v = num(n);
  if (!demoOn() || !v) return '待接入';
  return fmt(v) + (unit || '');
}`,
    new: `function count(n, unit) {
  const v = num(n);
  if (!demoOn() || !v) return '';
  return fmt(v) + (unit || '');
}`
  },
  {
    file: 'miniprogram/utils/stat.js',
    old: `function fans(n) {
  return demoOn() ? fmt(n) + ' 粉丝' : '粉丝数待接入';
}`,
    new: `function fans(n) {
  return demoOn() && num(n) ? fmt(n) + ' 粉丝' : '';
}`
  },
  {
    file: 'miniprogram/utils/stat.js',
    old: `function rateLine(s) {
  if (!demoOn()) return '待接入';
  return (s && s.reviews ? s.reviews + ' 条 · ' : '') + '好评率 ' + ((s && s.rate) || '—');
}`,
    new: `function rateLine(s) {
  if (!demoOn()) return '评价数据待接入';
  return (s && s.reviews ? s.reviews + ' 条 · ' : '') + '好评率 ' + ((s && s.rate) || '—');
}`
  },
  {
    file: 'miniprogram/utils/stat.js',
    old: `function sold(n) {
  return demoOn() && Number(n) ? '已售 ' + n + ' 件' : '销量待接入';
}`,
    new: `function sold(n) {
  return demoOn() && Number(n) ? '已售 ' + n + ' 件' : '';
}`
  },
  {
    file: 'miniprogram/utils/stat.js',
    old: `// 价格：正式版没有商家录入的采价记录就不给价（宁可不显示，也不给旧价）
function price(v, at) {
  if (!demoOn() || !v) return '';
  return at ? v + ' · ' + at : v;
}`,
    new: `// 价格：商品字段有价就显示；示例商品由页面上的「示例」标负责说明，不拿统计闸门误伤
function price(v, at) {
  if (!v) return '';
  return at ? v + ' · ' + at : v;
}`
  },
  {
    file: 'miniprogram/data/content.js',
    old: `  tests: markDemo(tests),
  products: markDemo(products),`,
    new: `  tests: tests,
  products: markDemo(products),`
  },
  {
    file: 'miniprogram/data/content.js',
    old: `  articles: markDemo(articles),`,
    new: `  articles: articles,`
  }
];