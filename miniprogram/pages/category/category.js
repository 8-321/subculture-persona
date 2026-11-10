const UI = require('../../utils/ui.js');
const Stat = require('../../utils/stat.js');
const C = require('../../data/content.js');
const Store = require('../../utils/store.js');
const M = require('../../utils/motion.js');
const F = require('../../utils/filter.js');
const Sound = require('../../utils/sound.js');
const Nav = require('../../utils/nav.js');

// 是否真的设了筛选条件（没设就不该过滤掉任何商品）
function hasCond(cond) {
  if (!cond) return false;
  if (cond.min || cond.max) return true;
  return ['style', 'brand', 'size'].some((k) => (cond[k] || []).length > 0);
}

Page({
  data: {
    tree: [],
    curTop: 0,
    topName: '',
    subs: [],
    curSub: '全部',
    list: [],
    cond: null,
    chosen: [],
    selCount: 0,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad() {
    UI.sync(this, { tree: C.categoryTree, cond: F.empty(), chosen: [], selCount: 0 });
    this.apply(0, '全部');
  },

  onShow() {
    UI.sync(this, {});
    Nav.apply(this);
  },

  // 从独立筛选页返回
  onBackFrom() {
    this.apply(this.data.curTop, this.data.curSub);
  },

  // 分类页内容 = 社区帖子 + 商城商品混合；一级 / 二级都按数据里的 cat / sub 过滤
  apply(topIndex, sub) {
    const tree = C.categoryTree;
    const g = tree[topIndex] || tree[0];
    let items = [];

    if (g.name === '店铺') {
      items = C.shops.map((s) => ({
        id: 's_' + s.id, title: s.name, img: s.img, sub: s.tags.join(' / '),
        subTag: s.name, likesText: Stat.fans(s.fans), type: 'shop'
      }));
    } else {
      const hidden = Store.Report.hiddenIds();
      const posts = C.posts
        .filter((p) => hidden.indexOf(p.id) < 0 && p.cat === g.name)
        .map((p) => ({
          id: p.id, title: p.title, img: p.cover, sub: p.shop,
          subTag: p.sub || '', likesText: Stat.count(p.likes, ' 赞'), type: 'post'
        }));
      const goods = C.products
        .filter((p) => p.cat === g.name)
        .map((p) => ({
          id: p.id, title: p.name, img: p.img, sub: p.brand,
          subTag: p.sub || '', likesText: Stat.price(p.price) || '价格见商家', type: 'product'
        }));
      items = posts.concat(goods);
    }

    // 二级只列「真的有内容」的项，避免点进去空白
    let subs = ['全部'];
    if (g.name === '店铺') {
      subs = subs.concat(C.shops.map((s) => s.name));
    } else {
      const have = {};
      items.forEach((it) => { if (it.subTag) have[it.subTag] = 1; });
      subs = subs.concat(g.subs.filter((s) => s !== '全部' && have[s]));
    }

    let curSub = sub;
    if (subs.indexOf(sub) < 0) curSub = '全部';
    let filtered = curSub === '全部' ? items : items.filter((it) => it.subTag === curSub);

    // 商品部分走统一筛选内核（帖子 / 店铺不参与筛选）
    const cond = this.data.cond || F.empty();
    if (hasCond(cond)) {
      const hitIds = {};
      F.apply(C.products, cond).forEach((p) => { hitIds[p.id] = 1; });
      filtered = filtered.filter((it) => (it.type === 'product' ? !!hitIds[it.id] : true));
    }

    this.setData({
      curTop: topIndex, topName: g.name, subs: subs, curSub: curSub,
      list: M.stagger(filtered, 26, 0, 12),
      chosen: F.chosen(cond),
      selCount: F.chosenCount(cond)
    });
  },

  onTop(e) {
    const i = Number(e.currentTarget.dataset.i);
    if (i === this.data.curTop) return;
    Sound.tap();
    UI.vibrate('light');
    this.apply(i, '全部');
  },

  onSub(e) {
    const s = e.currentTarget.dataset.s;
    if (s === this.data.curSub) return;
    Sound.tap();
    UI.vibrate('light');
    this.apply(this.data.curTop, s);
  },

  onItem(e) {
    const id = e.currentTarget.dataset.id;
    if (String(id).indexOf('s_') === 0) {
      const shop = C.shops.filter((s) => 's_' + s.id === String(id))[0];
      if (shop) Nav.push('/pages/shop-home/shop-home?name=' + encodeURIComponent(shop.name));
      return;
    }
    const isProduct = C.products.some((p) => p.id === id);
    if (isProduct) {
      Store.History.push({ id: id, title: '', img: '', src: '商城', type: 'product' });
      Nav.hero('/pages/shop-detail/shop-detail?id=' + id);
    } else {
      Nav.hero('/pages/post-detail/post-detail?id=' + id);
    }
  },

  // 筛选：跳转进独立筛选页
  onFilter() {
    Sound.slide();
    UI.vibrate('light');
    Nav.drawer('/pages/filter/filter' + F.toQuery(this.data.cond || F.empty()));
  },

  removeOne(e) {
    const k = e.currentTarget.dataset.k;
    const v = e.currentTarget.dataset.v;
    const cond = Object.assign({}, this.data.cond);
    if (k === 'price') { cond.range = ''; cond.min = ''; cond.max = ''; }
    else {
      const arr = (cond[k] || []).slice();
      const i = arr.indexOf(v);
      if (i >= 0) arr.splice(i, 1);
      cond[k] = arr;
    }
    Sound.pop();
    UI.vibrate('light');
    this.setData({ cond: cond }, () => this.apply(this.data.curTop, this.data.curSub));
  },

  clearAll() {
    Sound.slide();
    UI.vibrate('medium');
    this.setData({ cond: F.empty() }, () => this.apply(this.data.curTop, this.data.curSub));
  },

  onSearch() {
    Nav.push('/pages/search/search');
  },

  onBack() { Nav.back(); }
});
