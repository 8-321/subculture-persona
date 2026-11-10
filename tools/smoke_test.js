// 运行时冒烟测试（不依赖微信开发者工具）：用假的 wx 全局跑真逻辑
// 覆盖：举报落库/阈值隐藏、数字闸门双环境、隐私授权三条路径
// 用法：node miniprogram/tools/smoke_test.js

const path = require('path');
const mem = {};
let modalCalls = [];
let clipboard = [];
let privacyMode = 'ok';   // ok | deny | absent

global.wx = {
  getStorageSync: (k) => (k in mem ? mem[k] : ''),
  setStorageSync: (k, v) => { mem[k] = v; },
  showModal: (o) => { modalCalls.push(o); if (o.success) o.success({ confirm: true, cancel: false }); },
  showToast: () => {},
  setClipboardData: (o) => { clipboard.push(o.data); if (o.success) o.success(); },
  openPrivacyContract: () => { clipboard.push('__open_contract__'); },
  vibrateShort: () => {},
  createSelectorQuery: () => ({ select: () => ({ boundingClientRect: () => ({ exec: () => {} }) }) })
};
if (privacyMode !== 'absent') {
  global.wx.requirePrivacyAuthorize = (o) => {
    if (privacyMode === 'ok') o.success && o.success();
    else o.fail && o.fail({ errMsg: 'privacy denied' });
  };
}
let demo = true;
global.getApp = () => ({ globalData: { demoStats: demo, reduceMotion: true } });

const Store = require(path.resolve(__dirname, '../miniprogram/utils/store.js'));
const Stat = require(path.resolve(__dirname, '../miniprogram/utils/stat.js'));
const Privacy = require(path.resolve(__dirname, '../miniprogram/utils/privacy.js'));
const Track = require(path.resolve(__dirname, '../miniprogram/utils/track.js'));
const Q = require(path.resolve(__dirname, '../miniprogram/utils/qualify.js'));

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? '  → ' + extra : '')); }
}

console.log('[1] 举报：落库 / 计数 / 阈值隐藏');
Store.Report.clear();
ok('初始无记录', Store.Report.all().length === 0);
Store.Report.add({ id: 'p1', reason: '垃圾广告' });
ok('一条举报被记录', Store.Report.all().length === 1);
ok('计数 = 1', Store.Report.countOf('p1') === 1);
ok('未达阈值不隐藏', Store.Report.isHidden('p1') === false);
Store.Report.add({ id: 'p1', reason: '色情低俗' });
Store.Report.add({ id: 'p1', reason: '侵权盗图' });
ok('第 3 条后隐藏', Store.Report.isHidden('p1') === true, 'count=' + Store.Report.countOf('p1'));
ok('hiddenIds 含 p1', Store.Report.hiddenIds().indexOf('p1') >= 0);
ok('其他内容不受影响', Store.Report.isHidden('p2') === false);

console.log('[2] 数字闸门');
demo = true;
const t = { done: 12483 }, s = { fans: '8,204', rate: '98%', years: 6 };
ok('接入后台：人测过 1.2万', Stat.count(t.done, '人测过') === '1.2万人测过', Stat.count(t.done, '人测过'));
ok('接入后台：粉丝 8,204', Stat.fans(s.fans) === '8,204 粉丝', Stat.fans(s.fans));
ok('价格不被统计闸门误伤', Stat.price('¥1,280') === '¥1,280');
demo = false;
ok('未接入：人测过整段不渲染', Stat.count(t.done, '人测过') === '');
ok('未接入：粉丝不渲染', Stat.fans(s.fans) === '');
ok('未接入：好评率给出可解释状态', Stat.rateLine(s) === '评价数据待接入');
ok('未接入：已售不渲染', Stat.sold(328) === '');
ok('未接入：推荐位数字不渲染', Stat.count(87, '') === '');

console.log('[3] 隐私授权三条路径');
let ran = 0;
Privacy.ensure(() => { ran++; });
ok('同意 → 动作执行', ran === 1);
privacyMode = 'deny';
modalCalls = []; clipboard = []; ran = 0;
Privacy.ensure(() => { ran++; }, '需要相册');
ok('拒绝 → 动作不执行', ran === 0);
ok('拒绝 → 弹说明', modalCalls.length === 1 && modalCalls[0].title === '需要你的同意');
ok('点「查看指引」→ 打开隐私指引', clipboard.indexOf('__open_contract__') >= 0);
privacyMode = 'absent';
delete global.wx.requirePrivacyAuthorize;
ran = 0;
Privacy.ensure(() => { ran++; });
ok('老基础库无接口 → 直接放行（不堵死）', ran === 1);

console.log('[4] 埋点白名单');
Track.clear();
ok('白名单内事件写入成功', Track.log('post_view', { id: 'w1', kind: 'post', secret: '不该出现' }) === true);
ok('只落 1 条', Track.count() === 1);
const one = Track.all()[0];
ok('未登记参数被丢弃', one.p.secret === undefined && one.p.id === 'w1', JSON.stringify(one.p));
ok('未登记事件被拒绝', Track.log('whatever_event', {}) === false);
ok('拒写不产生记录', Track.count() === 1);
Track.log('quiz_answer', { id: 't-punk', index: 3, key: 'b' });
Track.log('quiz_answer', { id: 't-punk', index: 4, key: 'a' });
const sum = Track.summary();
ok('summary 计数正确', sum[0].e === 'quiz_answer' && sum[0].n === 2 && sum[0].d === '作答一题', JSON.stringify(sum[0]));
ok('recent 新的在前', Track.recent(1)[0].p.index === 4);
ok('recent 带中文名与时间', /\d\d:\d\d/.test(Track.recent(1)[0].time) && Track.recent(1)[0].d === '作答一题');
for (let i = 0; i < 320; i++) Track.log('app_launch', {});
ok('环形上限 300 条', Track.count() === 300, 'count=' + Track.count());
Track.clear();
ok('清空后为 0', Track.count() === 0);

console.log('[5] 举报聚合与撤销');
Store.Report.clear();
Store.Report.add({ id: 'w9', title: '测试帖九', reason: '垃圾广告', type: 'post' });
Store.Report.add({ id: 'w9', title: '测试帖九', reason: '侵权盗图', type: 'post' });
Store.Report.add({ id: 'w8', title: '测试帖八', reason: '虚假信息', type: 'post' });
let g = Store.Report.grouped();
ok('聚合成 2 条内容', g.length === 2, JSON.stringify(g.map((x) => x.id)));
const g9 = g.filter((x) => x.id === 'w9')[0];
ok('次数与理由去重', g9.times === 2 && g9.reasons.length === 2, JSON.stringify(g9));
ok('未满 3 次不算隐藏', g9.hidden === false);
Store.Report.add({ id: 'w9', title: '测试帖九', reason: '垃圾广告', type: 'post' });
ok('满 3 次标记隐藏', Store.Report.isHidden('w9') === true && Store.Report.grouped().filter((x) => x.id === 'w9')[0].hidden === true);
ok('hiddenIds 含 w9', Store.Report.hiddenIds().indexOf('w9') >= 0);
Store.Report.removeById('w9');
ok('撤销后不再隐藏', Store.Report.isHidden('w9') === false && Store.Report.hiddenIds().indexOf('w9') < 0);
ok('其他内容不受影响', Store.Report.countOf('w8') === 1);
Store.Report.clear();

console.log('[6] 商家资质校验');
ok('真实执照号通过（91330100799655058B）', Q.creditCode('91330100799655058B').ok === true);
ok('末位抄错被拦住并指出应为 B', Q.creditCode('91330100799655058C').ok === false && Q.creditCode('91330100799655058C').msg.indexOf('B') > 0, Q.creditCode('91330100799655058C').msg);
ok('位数不对说清差几位', Q.creditCode('12345').msg.indexOf('18 位') >= 0);
ok('非法字符被拦', Q.creditCode('91330100I99655058B').ok === false);
ok('15 位老注册号放行', Q.creditCode('123456789012345').ok === true);
ok('手机号通过', Q.contact('13800138000').ok === true);
ok('邮箱通过', Q.contact('shop@example.com').ok === true);
ok('乱填联系方式被拦', Q.contact('123').ok === false);

console.log('\n' + '='.repeat(40));
console.log('冒烟通过 ' + pass + ' 项｜失败 ' + fail + ' 项');
process.exit(fail ? 1 : 0);
