// 数字闸门双环境对拍：同一份数据，开发版 vs 正式版分别会显示什么
// 用法：node miniprogram/tools/gate_test.js
// 期望：demoStats=true 出真实示例数字；demoStats=false 全部「待接入」
const path = require('path');
let demo = true;
global.getApp = () => ({ globalData: { demoStats: demo } });

const Stat = require(path.resolve(__dirname, '../miniprogram/utils/stat.js'));
const C = require(path.resolve(__dirname, '../miniprogram/data/content.js'));

const t = C.tests[0];
const s = C.shops[0];
const p = C.products[0];

function snap(tag) {
  console.log('[' + tag + ']');
  console.log('  人测过  :', Stat.count(t.done, '人测过'));
  console.log('  粉丝    :', Stat.fans(s.fans));
  console.log('  商家一行:', Stat.shopMeta(s));
  console.log('  评价    :', Stat.rateLine(s));
  console.log('  已售    :', Stat.sold(p.sold));
  console.log('  设置页  :', Stat.sourceNote());
}

snap('开发/体验版 demoStats=true');
demo = false;
snap('正式版 demoStats=false');
