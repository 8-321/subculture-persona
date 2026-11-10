const UI = require('../../utils/ui.js');
const Stat = require('../../utils/stat.js');
const Sound = require('../../utils/sound.js');
const Store = require('../../utils/store.js');
const Nav = require('../../utils/nav.js');

Page({
  data: {
    cur: 0,
    list: [],
    count: 0,
    managing: false,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad(options) {
    UI.sync(this, { cur: Number(options.tab || 0) });
  },

  onShow() {
    Nav.apply(this);
    UI.sync(this);
    this.apply();
  },

  apply() {
    const cur = this.data.cur;
    let list = [];
    if (cur === 0) list = Store.FavPost.all();
    else if (cur === 1) list = Store.FavLike.all();
    else list = Store.FavShop.all().map((it) => ({
      id: it.id, img: it.img, title: it.title, desc: it.brand || '', extra: Stat.price(it.price) || '价格见商家', type: 'product'
    }));
    this.setData({ list: list, count: list.length });
  },

  onSeg(e) {
    const i = Number(e.currentTarget.dataset.i);
    if (i === this.data.cur) return;
    UI.vibrate('light');
    this.setData({ cur: i }, () => this.apply());
  },

  onManage() {
    this.setData({ managing: !this.data.managing });
  },

  // 取消收藏：移除并让其余条目补位
  onRemove(e) {
    const id = e.currentTarget.dataset.id;
    const cur = this.data.cur;
    const self = this;
    wx.showModal({
      title: '取消收藏',
      content: '取消后这条会从我的一栏里移除。',
      success: (res) => {
        if (!res.confirm) return;
        if (cur === 0) Store.FavPost.remove(id);
        else if (cur === 1) Store.FavLike.remove(id);
        else Store.FavShop.remove(id);
        UI.vibrate('medium');
        UI.toast('已取消收藏');
        self.apply();
      }
    });
  },

  onOpen(e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type;
    if (type === 'product') Nav.hero('/pages/shop-detail/shop-detail?id=' + id);
    else if (type === 'report') Nav.push('/pages/result/result?rid=' + String(id).replace('report_', ''));
    else if (type === 'test') Nav.hero('/pages/test-detail/test-detail?id=' + String(id).replace('test_', ''));
    else Nav.hero('/pages/post-detail/post-detail?id=' + id);
  },

  goCommunity() { Nav.tab('/pages/community/community'); },
  goShop() { Nav.tab('/pages/shop/shop'); },
  onBack() { UI.back(); }
});
