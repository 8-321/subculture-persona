const UI = require('../../utils/ui.js');
const C = require('../../data/content.js');
const Store = require('../../utils/store.js');
const Nav = require('../../utils/nav.js');

Page({
  onShow() {
    Nav.apply(this);
  },

  data: {
    list: [],
    sel: [],
    rest: 0,
    dark: false,
    reduce: false,
    sbh: 20
  },

  // WXML 不支持方法调用，选中态在 JS 侧预计算成 on 字段
  buildView(sel) {
    return C.interests.map((i) => ({
      id: i.id, name: i.name, img: i.img, on: sel.indexOf(i.name) >= 0
    }));
  },

  onLoad() {
    const user = Store.getUser();
    const sel = (user && user.interests) ? user.interests.slice() : [];
    UI.sync(this, {
      list: this.buildView(sel),
      sel: sel,
      rest: C.interests.length - sel.length
    });
  },

  onPick(e) {
    const n = e.currentTarget.dataset.n;
    const sel = this.data.sel.slice();
    const i = sel.indexOf(n);
    if (i >= 0) sel.splice(i, 1); else sel.push(n);
    UI.vibrate('light');
    this.setData({ sel: sel, list: this.buildView(sel), rest: C.interests.length - sel.length });
  },

  onNext() {
    if (this.data.sel.length < 3) {
      UI.toast('至少选 3 个');
      return;
    }
    Store.updateUser({ interests: this.data.sel });
    Store.setConfig({ interestsDone: true });
    getApp().globalData.user = Store.getUser();
    UI.vibrate('medium');
    UI.toast('欢迎加入');
    setTimeout(() => { Nav.tab('/pages/home/home'); }, 600);
  },

  onBack() { UI.back(); }
});
