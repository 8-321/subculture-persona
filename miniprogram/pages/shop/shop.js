// 商城 · 列表（筛选已拆成独立页面 pages/filter/filter，这里只负责展示与入口）
// 本页动效：
//   1 商品卡交错弹入（m-pop + 26ms 错峰，长列表只做前 10 项）
//   2 卡片图片 3D 倾斜 2.5° + 高光掠过（m-tilt / m-glare，按压触发）
//   3 收藏心三段 0.92 → 1.18 → 1（m-heart + medium 震动）
//   4 分类切换 → 内容区侧向推入（m-slide-r）
//   5 已选条件 chip 出现（m-pop-lg）
//   6 结果数变化时码表滚动（countUp 700ms）

const UI = require('../../utils/ui.js');
const C = require('../../data/content.js');
const Store = require('../../utils/store.js');
const Stat = require('../../utils/stat.js');
const F = require('../../utils/filter.js');
const M = require('../../utils/motion.js');
const Sound = require('../../utils/sound.js');
const Nav = require('../../utils/nav.js');

Page({
  data: {
    cats: [],
    curCat: '推荐',
    sort: 'default',
    cond: null,
    list: [],
    listView: [],
    chosen: [],
    selCount: 0,
    hitAnim: 0,
    user: null,
    flip: 0,          // 分类切换计数
    swapCls: 'm-slide-r',  // 在两个动画名之间来回切，实现重播
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad() {
    const cond = F.empty();
    UI.sync(this, { cats: C.shopCats, cond: cond });
    this.apply();
  },

  onShow() {
    UI.sync(this, { user: Store.getUser() });
    UI.setTab(this, 3);
    Nav.apply(this);
    this.apply();
  },

  /* ---------------- 列表 ---------------- */
  apply() {
    const cond = Object.assign({}, this.data.cond, { cat: this.data.curCat, sort: this.data.sort });
    const list = F.apply(C.products, cond);
    const view = M.stagger(
      list.map((p) => Object.assign({}, p, {
        fav: Store.FavShop.has(p.id),
        priceText: Stat.price(p.price),
        _beat: 0
      })),
      26, 0, 10
    );
    this.setData({
      cond: cond,
      list: list,
      listView: view,
      chosen: F.chosen(cond),
      selCount: F.chosenCount(cond)
    });
    const self = this;
    if (this._roll) this._roll();
    this._roll = M.countUp(this, 'hitAnim', list.length, { dur: 700, from: this.data.hitAnim });
    void self;
  },

  // 从独立筛选页返回：条件已经写进 data，这里只重算
  onBackFrom() {
    const cond = Object.assign({}, this.data.cond, { cat: this.data.curCat });
    this.setData({ sort: cond.sort || 'default', cond: cond }, () => this.apply());
  },

  /* ---------------- 分类 / 排序 / 筛选 ---------------- */
  onCat(e) {
    const cat = e.currentTarget.dataset.cat;
    if (cat === this.data.curCat) return;
    Sound.tap();
    UI.vibrate('light');
    this.setData({
      curCat: cat,
      flip: this.data.flip + 1,
      swapCls: this.data.flip % 2 === 0 ? 'm-slide-r-b' : 'm-slide-r'
    }, () => this.apply());
  },

  onSort(e) {
    const s = e.currentTarget.dataset.sort;
    let next = s;
    if (s === 'price') {
      next = this.data.sort === 'priceAsc' ? 'priceDesc' : 'priceAsc';
    }
    Sound.tap();
    UI.vibrate('light');
    this.setData({ sort: next }, () => this.apply());
  },

  // 筛选：跳转进入独立筛选页（不再是点一下弹抽屉）
  onFilter() {
    Sound.slide();
    UI.vibrate('light');
    const cond = Object.assign({}, this.data.cond, { cat: '', sort: this.data.sort });
    Nav.drawer('/pages/filter/filter' + F.toQuery(cond));
  },

  // 已选条件：在列表页就能单独删掉一个
  removeOne(e) {
    const k = e.currentTarget.dataset.k;
    const v = e.currentTarget.dataset.v;
    const cond = Object.assign({}, this.data.cond);
    if (k === 'price') {
      cond.range = ''; cond.min = ''; cond.max = '';
    } else {
      const arr = (cond[k] || []).slice();
      const i = arr.indexOf(v);
      if (i >= 0) arr.splice(i, 1);
      cond[k] = arr;
    }
    Sound.pop();
    UI.vibrate('light');
    this.setData({ cond: cond }, () => this.apply());
  },

  clearAll() {
    const cond = F.empty();
    cond.cat = this.data.curCat;
    Sound.slide();
    UI.vibrate('medium');
    this.setData({ cond: cond, sort: 'default' }, () => this.apply());
  },

  /* ---------------- 商品 ---------------- */
  onProduct(e) {
    const id = e.currentTarget.dataset.id;
    const p = C.products.filter((x) => x.id === id)[0];
    if (p) Store.History.push({ id: p.id, title: p.name, img: p.img, src: '商城', type: 'product' });
    Nav.hero('/pages/shop-detail/shop-detail?id=' + id);
  },

  onFav(e) {
    const id = e.currentTarget.dataset.id;
    const p = C.products.filter((x) => x.id === id)[0];
    if (!p) return;
    const on = !Store.FavShop.has(p.id);
    Store.FavShop.toggle({ id: p.id, title: p.name, img: p.img, price: p.price, brand: p.brand });
    Sound.pop();
    UI.vibrate('medium');
    UI.toast(on ? '已收藏' : '已取消收藏');

    const idx = (this.data.listView || []).findIndex ? this.data.listView.findIndex((x) => x.id === id) : -1;
    const patch = {};
    if (idx >= 0) patch['listView[' + idx + ']._beat'] = on ? 1 : 0;
    patch['listView[' + idx + '].fav'] = on;
    this.setData(patch);
    if (idx >= 0) {
      setTimeout(() => {
        const q = {}; q['listView[' + idx + ']._beat'] = 0; this.setData(q);
      }, 420);
    }
  },

  onSearch() {
    Nav.push('/pages/search/search');
  },

  onAuth() {
    Nav.push('/pages/register/register');
  },

  onShareAppMessage() {
    return { title: '第二文化 · 只推荐，不收款', path: '/pages/shop/shop' };
  }
});
