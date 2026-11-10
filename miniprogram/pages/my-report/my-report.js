const UI = require('../../utils/ui.js');
const Store = require('../../utils/store.js');
const Nav = require('../../utils/nav.js');

const LIMIT = 3; // 与 Store.Report.HIDE_AT 一致：同一条内容 3 次先隐藏待复核

Page({
  data: {
    list: [],
    hiddenCount: 0,
    subTitle: '',
    note: '记录只存在这台手机，用于回看与撤销；后台接入后才受理。',
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
    const list = Store.Report.grouped().map((g) => Object.assign({}, g, {
      reasonText: g.reasons.join('、'),
      statusText: g.hidden ? '本机已隐藏' : '本机已记录',
      timesText: g.times + ' 次'
    }));
    const hidden = list.filter((g) => g.hidden).length;
    this.setData({
      list: list,
      hiddenCount: hidden,
      subTitle: list.length ? ('共 ' + list.length + ' 条内容 · 被举报 ' + list.reduce((s, g) => s + g.times, 0) + ' 次 · 已隐藏 ' + hidden + ' 条') : '还没有举报过内容'
    });
  },

  // 撤销：把这条内容的所有举报删掉，内容回到列表
  onUndo(e) {
    const id = e.currentTarget.dataset.id;
    const g = this.data.list.filter((x) => x.id === id)[0];
    if (!g) return;
    wx.showModal({
      title: '撤销举报',
      content: '撤销后「' + (g.title || '这条内容') + '」会重新出现在列表里。确定吗？',
      confirmText: '撤销',
      cancelText: '保留',
      success: (res) => {
        if (!res.confirm) return;
        Store.Report.removeById(id);
        getApp().track('report_undo', { id: id });
        UI.vibrate('medium');
        UI.toast('已撤销');
        this.apply();
      }
    });
  },

  onOpen(e) {
    const d = e.currentTarget.dataset;
    Nav.push('/pages/post-detail/post-detail?id=' + d.id);
  },

  onBack() { UI.back(); }
});
