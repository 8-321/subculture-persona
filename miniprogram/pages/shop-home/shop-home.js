const UI = require('../../utils/ui.js');
const C = require('../../data/content.js');
const Store = require('../../utils/store.js');
const Stat = require('../../utils/stat.js');
const Sound = require('../../utils/sound.js');
const Nav = require('../../utils/nav.js');

Page({
  data: {
    shop: null,
    goods: [],
    shopDesc: '',
    follow: false,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad(options) {
    let name = '';
    try { name = decodeURIComponent(options.name || ''); } catch (e) { name = options.name || ''; }
    const shop = C.shops.filter((s) => s.name === name)[0];
    if (!shop) {
      UI.toast('这家店还没有档案');
      setTimeout(() => Nav.back(), 900);
      return;
    }
    const goods = C.products
      .filter((p) => p.brand === shop.name)
      .map((p) => Object.assign({}, p, { priceText: Stat.price(p.price) }));
    UI.sync(this, {
      shop: shop,
      goods: goods,
      shopDesc: Stat.shopMeta(shop),
      follow: Store.Follow.has(shop.name)
    });
    getApp().track('shop_view', { name: shop.name });
  },

  onShow() {
    Nav.apply(this);
    const shop = this.data.shop;
    if (shop) UI.sync(this, { follow: Store.Follow.has(shop.name) });
  },

  onBack() { Nav.back(); },

  onFollow() {
    const shop = this.data.shop;
    if (!shop) return;
    Store.Follow.toggle({ id: shop.name, title: shop.name, img: shop.img });
    const on = Store.Follow.has(shop.name);
    if (on) Sound.pop(); else Sound.tap();
    UI.vibrate('medium');
    UI.toast(on ? '已关注' : '已取消关注');
    this.setData({ follow: on });
  },

  onProduct(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    Nav.hero('/pages/shop-detail/shop-detail?id=' + id);
  },

  onShopList() {
    Nav.tab('/pages/shop/shop');
  },

  onShareAppMessage() {
    const shop = this.data.shop;
    if (!shop) return { title: '第二文化', path: '/pages/home/home' };
    return {
      title: shop.name + ' · 店铺档案',
      path: '/pages/shop-home/shop-home?name=' + encodeURIComponent(shop.name || ''),
      imageUrl: shop.img || ''
    };
  }
});