const UI = require('../../utils/ui.js');
const Nav = require('../../utils/nav.js');
const Stat = require('../../utils/stat.js');
const C = require('../../data/content.js');
const Store = require('../../utils/store.js');

Page({
  data: {
    kw: '',
    list: [],
    managing: false,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad() {
    UI.sync(this);
  },

  onShow() {
    Nav.apply(this);
    UI.sync(this);
    this.apply();
  },

  apply() {
    // 只显示用户真的关注过的店铺；没有就空着，不拿示例商家冒充
    const followed = Store.Follow.all();
    const names = followed.map((f) => f.id);
    let shops = C.shops.filter((s) => names.indexOf(s.name) >= 0);
    if (this.data.kw) shops = shops.filter((s) => s.name.indexOf(this.data.kw) >= 0);
    // 数字走闸门：正式版没有后台数据时不显示虚构粉丝数与上新数（需求 V3.0 §4）
    const demo = Stat.on();
    const list = shops.map((s) => Object.assign({}, s, {
      meta: demo ? (s.fans + ' 粉丝 · 本周上新 ' + s.neu) : '商家资料以入驻核验信息为准'
    }));
    this.setData({ list: list });
  },

  onInput(e) {
    this.setData({ kw: e.detail.value }, () => this.apply());
  },

  onManage() {
    this.setData({ managing: !this.data.managing });
  },

  onShop(e) {
    const name = e.currentTarget.dataset.name;
    if (!name) return;
    Nav.push('/pages/shop-home/shop-home?name=' + encodeURIComponent(name));
  },

  onUnfollow(e) {
    const id = e.currentTarget.dataset.name;
    if (!this.data.managing) { UI.toast('已关注'); return; }
    const self = this;
    wx.showModal({
      title: '取消关注',
      content: '不再看这家店的内容吗？',
      success: (res) => {
        if (!res.confirm) return;
        Store.Follow.remove(id);
        UI.vibrate('heavy');
        UI.toast('已取消关注');
        self.apply();
      }
    });
  },

  onShopList() { Nav.tab('/pages/shop/shop'); },

  onBack() { UI.back(); }
});
