const UI = require('../../utils/ui.js');
const Sound = require('../../utils/sound.js');
const Nav = require('../../utils/nav.js');
const Stat = require('../../utils/stat.js');
const C = require('../../data/content.js');
const Store = require('../../utils/store.js');
const Privacy = require('../../utils/privacy.js');

Page({
  onShow() {
    Nav.apply(this);
  },

  data: {
    p: null,
    shots: [],
    cur: 0,
    fav: false,
    shopFirst: '',
    shopDesc: '',
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad(options) {
    const id = options.id || 'p1';
    const p = C.products.filter((x) => x.id === id)[0];
    if (!p) {
      UI.toast('这件选物已经不在了');
      setTimeout(() => Nav.back(), 900);
      return;
    }
    const shop = C.shops.filter((s) => s.name === p.brand)[0];
    const shots = [p.img];
    getApp().track('product_view', { id: p.id });

    UI.sync(this, {
      p: p,
      shots: shots,
      cur: 0,
      fav: Store.FavShop.has(p.id),
      shopFirst: (p.brand || '店').slice(0, 1),
      shopDesc: Stat.shopMeta(shop),
      rateText: Stat.rateLine(shop || { rate: '—' }),
      soldText: Stat.sold(p.sold),
      priceText: Stat.price(p.price)
    });

    Store.History.push({ id: p.id, title: p.name, img: p.img, src: '商城', type: 'product' });
  },

  onShot(e) {
    this.setData({ cur: e.detail.current });
  },

  onBack() { Nav.back(); },

  onShare() { UI.vibrate('light'); },

  onFav() {
    const p = this.data.p;
    Store.FavShop.toggle({ id: p.id, title: p.name, img: p.img, price: p.price, brand: p.brand });
    const on = Store.FavShop.has(p.id);
    Sound.pop();
    UI.vibrate('medium');
    UI.toast(on ? '已收藏' : '已取消收藏');
    this.setData({ fav: on, _beat: on ? 1 : 0 });
    if (on) setTimeout(() => this.setData({ _beat: 0 }), 420);
  },

  // 外链跳转：只有商家真的录了链接才复制；没有就直说，不塞假链接
  onJump() {
    const p = this.data.p;
    Sound.warn();
    UI.vibrate('heavy');
    const link = p.link || '';
    getApp().track('product_jump', { id: p.id, hasLink: /^https?:\/\//.test(link) });
    if (!/^https?:\/\//.test(link)) {
      // 没有链接不等于死路：把「品牌 + 品名」复制成搜索词，用户可以直接去找同款
      const kw = (p.brand || '') + ' ' + (p.name || '');
      Privacy.ensure(() => {
        wx.setClipboardData({
          data: kw.trim(),
          success: () => {
            wx.showModal({
              title: '搜索词已复制',
              content: '这家店还没上架外部链接。可到常用的购物平台搜索「' + kw.trim() + '」。本小程序只做推荐，不收款、不交易。',
              showCancel: false,
              confirmText: '知道了'
            });
          }
        });
      }, '复制搜索词需要读取剪贴板权限');
      return;
    }
    Nav.confirmOut('即将离开第二文化', '去第三方平台查看「' + p.name + '」。本小程序只做推荐，不收款、不交易。', link);
  },

  onShop() {
    const p = this.data.p;
    if (!p) return;
    Nav.push('/pages/shop-home/shop-home?name=' + encodeURIComponent(p.brand || ''));
  },

  onShareAppMessage() {
    const p = this.data.p;
    if (!p) return { title: '第二文化', path: '/pages/home/home' };
    return { title: p.brand + ' · ' + p.name, path: '/pages/shop-detail/shop-detail?id=' + p.id };
  }
});
