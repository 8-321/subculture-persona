const UI = require('../../utils/ui.js');
const Nav = require('../../utils/nav.js');
const Store = require('../../utils/store.js');

const TIPS = [
  '正在整理答题轨迹…',
  '正在匹配 14 种人格…',
  '正在计算四个维度…',
  '正在生成你的报告…'
];

let tipTimer = null;
let doneTimer = null;
let slowTimer = null;
let verySlowTimer = null;

Page({
  onShow() {
    Nav.apply(this);
  },

  data: {
    rid: '',
    tipText: TIPS[0],
    percent: 10,
    retry: false,
    dark: false,
    reduce: false
  },

  onLoad(options) {
    this.setData({ rid: options.rid || '' });
    UI.sync(this);

    let i = 0;
    tipTimer = setInterval(() => {
      i = (i + 1) % TIPS.length;
      this.setData({ tipText: TIPS[i], percent: Math.min(92, this.data.percent + 22) });
    }, 470);

    // 计算本身是本地瞬时完成：2 秒只够把四步读完，不故意拖时间
    const wait = getApp().globalData.reduceMotion ? 500 : 2000;
    doneTimer = setTimeout(() => { this.goResult(); }, wait);
    slowTimer = setTimeout(() => { this.setData({ tipText: '稍等，快好了' }); }, wait + 900);
    verySlowTimer = setTimeout(() => { this.setData({ retry: true }); }, wait + 4000);
  },

  onUnload() {
    if (tipTimer) clearInterval(tipTimer);
    if (doneTimer) clearTimeout(doneTimer);
    if (slowTimer) clearTimeout(slowTimer);
    if (verySlowTimer) clearTimeout(verySlowTimer);
  },

  goResult() {
    if (doneTimer) clearTimeout(doneTimer);
    this.setData({ percent: 100 });
    const rid = this.data.rid;
    Nav.replace('/pages/result/result?rid=' + rid);
  },

  onRetry() {
    this.setData({ retry: false, percent: 20 });
    this.goResult();
  }
});
