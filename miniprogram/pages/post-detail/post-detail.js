const UI = require('../../utils/ui.js');
const Sound = require('../../utils/sound.js');
const Stat = require('../../utils/stat.js');
const C = require('../../data/content.js');
const Store = require('../../utils/store.js');
const Nav = require('../../utils/nav.js');

Page({
  onShow() {
    Nav.apply(this);
  },

  data: {
    item: null,
    isArticle: false,
    shots: [],
    cur: 0,
    followed: false,
    faved: false,
    liked: false,
    favCount: 0,
    likeCount: 0,
    viewsText: '',
    favText: '',
    likeText: '',
    goodsPriceText: '',
    reportOpen: false,
    reasons: ['垃圾广告', '色情低俗', '侵权盗图', '虚假信息', '其他'],
    playing: false,
    reading: false,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad(options) {
    const id = options.id || '';
    const isArticle = options.type === 'article';
    let item = null;
    if (isArticle) {
      item = C.articles.filter((a) => a.id === id)[0];
    } else {
      item = C.posts.filter((p) => p.id === id)[0];
    }
    if (!item) {
      UI.toast('这条内容已经不在了');
      setTimeout(() => Nav.back(), 900);
      return;
    }

    const shots = isArticle ? [item.img] : [item.cover];
    const favN = (item.favs || item.likes || 0);
    const likeN = item.likes || 0;

    UI.sync(this, {
      item: item,
      isArticle: isArticle,
      shots: shots,
      cur: 0,
      followed: Store.Follow.has(item.shop || item.author),
      faved: Store.FavPost.has(item.id),
      liked: Store.FavLike.has(item.id),
      favCount: favN,
      likeCount: likeN,
      viewsText: Stat.count(item.views || 0, ' 观看'),
      favText: Stat.count(favN, ''),
      likeText: Stat.count(likeN, ''),
      goodsPriceText: Stat.price(item.goods && item.goods.price)
    });

    Store.History.push({
      id: item.id, title: item.title, img: isArticle ? item.img : item.cover,
      src: '第二文化', type: isArticle ? 'article' : 'post'
    });
    getApp().track('post_view', { id: item.id, kind: isArticle ? 'article' : 'post' });
  },

  onShot(e) { this.setData({ cur: e.detail.current }); },

  onBack() { UI.back(); },

  onFollow() {
    const it = this.data.item;
    const shop = it.shop || it.author;
    Store.Follow.toggle({ id: shop, title: shop, img: it.shopImg || it.img });
    const on = Store.Follow.has(shop);
    if (on) Sound.pop(); else Sound.tap();
    UI.vibrate('medium');
    UI.toast(on ? '已关注' : '已取消关注');
    this.setData({ followed: on, _beat: on ? 1 : 0 });
    if (on) setTimeout(() => this.setData({ _beat: 0 }), 420);
  },

  onFav() {
    const it = this.data.item;
    Store.FavPost.toggle({ id: it.id, title: it.title, img: it.cover || it.img, type: 'post', desc: it.shop || it.author });
    const on = Store.FavPost.has(it.id);
    Sound.pop();
    UI.vibrate('medium');
    UI.toast(on ? '已收藏' : '已取消收藏');
    getApp().track('post_fav', { id: it.id, on: on });
    this.setData({
      faved: on,
      favCount: this.data.favCount + (on ? 1 : -1),
      favText: Stat.count(this.data.favCount + (on ? 1 : -1), ''),
      _beat: on ? 1 : 0
    });
    if (on) setTimeout(() => this.setData({ _beat: 0 }), 420);
  },

  onLike() {
    const it = this.data.item;
    Store.FavLike.toggle({ id: it.id, title: it.title, img: it.cover || it.img, type: 'post', desc: it.shop || it.author });
    const on = Store.FavLike.has(it.id);
    if (on) Sound.pop(); else Sound.tap();
    UI.vibrate('medium');
    getApp().track('post_like', { id: it.id, on: on });
    this.setData({
      liked: on,
      likeCount: this.data.likeCount + (on ? 1 : -1),
      likeText: Stat.count(this.data.likeCount + (on ? 1 : -1), ''),
      _beat: on ? 1 : 0
    });
    if (on) setTimeout(() => this.setData({ _beat: 0 }), 420);
  },

  onGoods() {
    const g = this.data.item.goods;
    if (!g) return;
    Nav.hero('/pages/shop-detail/shop-detail?id=' + g.id);
  },

  /* ---------------- 举报（P0 合规：内容类小程序必须有入口） ---------------- */
  onMore() {
    Sound.tap();
    UI.vibrate('light');
    this.setData({ reportOpen: true });
  },

  onCloseReport() {
    this.setData({ reportOpen: false });
  },

  onReport(e) {
    const reason = e.currentTarget.dataset.r;
    const it = this.data.item;

    Store.Report.add({ id: it.id, reason: reason, title: it.title, type: this.data.isArticle ? 'article' : 'post' });
    const times = Store.Report.countOf(it.id);
    getApp().track('report_submit', { id: it.id, reason: reason, times: times });
    Sound.pop();
    UI.vibrate('medium');
    this.setData({ reportOpen: false });

    if (Store.Report.isHidden(it.id)) {
      UI.toast('已在本机隐藏这条内容');
      setTimeout(() => { UI.back(); }, 900);
    } else {
      UI.toast('已记录（第 ' + times + ' 次），满 3 次在本机隐藏');
    }
  },

  onShareAppMessage() {
    if (!this.data.item) return { title: '第二文化', path: '/pages/home/home' };
    getApp().track('post_share', { id: this.data.item.id, kind: this.data.isArticle ? 'article' : 'post' });
    return {
      title: this.data.item.title,
      path: '/pages/post-detail/post-detail?id=' + this.data.item.id + (this.data.isArticle ? '&type=article' : '')
    };
  }
});
