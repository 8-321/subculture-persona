const UI = require('../../utils/ui.js');
const Store = require('../../utils/store.js');
const Nav = require('../../utils/nav.js');
const TM = require('../../utils/typemedia.js');

Page({
  data: {
    list: [],
    subTitle: '',
    dark: false,
    reduce: false,
    sbh: 20
  },

  onShow() {
    Nav.apply(this);
    UI.sync(this);
    this.apply();
  },

  apply() {
    const all = Store.Reports.all();
    const list = all.map((r) => {
      const sec = r.seconds || 0;
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return Object.assign({}, r, {
        img: TM.img(r.type),
        footText: (r.qcount || 0) + ' 题' + (sec > 0 ? ' · 用时 ' + m + ' 分 ' + (s < 10 ? '0' + s : s) + ' 秒' : ''),
        dateText: r.dateText || UI.relTime(r.ts || r.createdAt)
      });
    });
    const total = list.reduce((s, r) => s + (r.qcount || 0), 0);
    const subTitle = list.length
      ? ('最近一次：' + (list[0].dateText || '') + ' · 共完成 ' + total + ' 道题')
      : '测一次只要 3 分钟';
    this.setData({ list: list, subTitle: subTitle });
  },

  onOpen(e) {
    Nav.push('/pages/result/result?rid=' + e.currentTarget.dataset.id);
  },

  // 长按删除（防误删走确认）
  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    const self = this;
    wx.showModal({
      title: '删除这份报告',
      content: '删除后无法恢复，确定吗？',
      confirmText: '删除',
      success: (res) => {
        if (!res.confirm) return;
        Store.Reports.remove(id);
        UI.vibrate('heavy');
        UI.toast('已删除');
        self.apply();
      }
    });
  },

  onGoTest() {
    Nav.hero('/pages/test-detail/test-detail?id=main');
  },

  onBack() { UI.back(); }
});
