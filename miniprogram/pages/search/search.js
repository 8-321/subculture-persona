const UI = require('../../utils/ui.js');
const Stat = require('../../utils/stat.js');
const C = require('../../data/content.js');
const Store = require('../../utils/store.js');
const M = require('../../utils/motion.js');
const F = require('../../utils/filter.js');
const Sound = require('../../utils/sound.js');
const Nav = require('../../utils/nav.js');

// 是否真的设了筛选条件（没设就不该过滤掉任何商品）
function hasCond(c) {
  if (!c) return false;
  if (c.min || c.max) return true;
  return ['style', 'brand', 'size'].some((k) => (c[k] || []).length > 0);
}

const TABS = [
  { k: 'all', n: '全部' },
  { k: 'test', n: '测试' },
  { k: 'post', n: '内容' },
  { k: 'product', n: '商品' }
];

// 全站可搜索条目
function allItems() {
  const items = [];
  C.tests.forEach((t) => items.push({
    id: t.id, type: 'test', title: t.title, img: t.img,
    desc: '测试 · ' + t.qcount + ' 题 · ' + t.minutes + ' 分钟'
  }));
  C.posts.forEach((p) => {
    if (Store.Report.isHidden(p.id)) return;
    items.push({
      sample: !!p.demo,
      id: p.id, type: 'post', title: p.title, img: p.cover,
      desc: ['内容', p.shop, Stat.count(p.likes, '赞')].filter(Boolean).join(' · ')
    });
  });
  C.products.forEach((p) => items.push({
    sample: !!p.demo,
    id: p.id, type: 'product', title: p.name, img: p.img,
    desc: '商品 · ' + (Stat.price(p.price) || '价格见商家') + ' · ' + p.brand
  }));
  C.articles.forEach((a) => items.push({
    sample: !!a.demo,
    id: a.id, type: 'post', title: a.title, img: a.img,
    desc: a.cat + ' · ' + a.time
  }));
  C.shops.forEach((s) => items.push({
    sample: !!s.demo,
    id: s.id, type: 'shop', title: s.name, img: s.img,
    desc: ['商家', Stat.fans(s.fans)].filter(Boolean).join(' · ')
  }));
  return items;
}

let debounce = null;

Page({
  data: {
    kw: '',
    focus: true,
    submitted: false,
    sugs: [],
    tabs: TABS,
    cur: 'all',
    list: [],
    history: [],
    hotView: [],
    cond: null,
    chosen: [],
    selCount: 0,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad() {
    const cond = F.empty();
    UI.sync(this, {
      history: Store.SearchHistory.all(),
      hotView: M.stagger(C.hotWords.map((w) => ({ v: w })), 26, 60, 10),
      cond: cond,
      chosen: F.chosen(cond),
      selCount: 0
    });
  },

  onShow() {
    UI.sync(this);
    Nav.apply(this);
  },

  // 输入联想：防抖 300ms（交互规范 §4）
  onInput(e) {
    const kw = e.detail.value;
    this.setData({ kw: kw, submitted: false });
    if (debounce) clearTimeout(debounce);
    const self = this;
    debounce = setTimeout(() => {
      if (!kw) { self.setData({ sugs: [] }); return; }
      const set = {};
      const sugs = [];
      allItems().forEach((it) => {
        if (it.title.indexOf(kw) >= 0 && !set[it.title]) {
          set[it.title] = true;
          sugs.push(it.title.slice(0, 14));
        }
      });
      self.setData({ sugs: sugs.slice(0, 6) });
    }, 300);
  },

  onSubmit() {
    const kw = (this.data.kw || '').trim();
    if (!kw) return;
    Store.SearchHistory.push(kw);
    this.setData({ submitted: true }, () => this.search(kw));
  },

  onWord(e) {
    const w = e.currentTarget.dataset.w;
    Store.SearchHistory.push(w);
    this.setData({ kw: w, submitted: true, history: Store.SearchHistory.all() }, () => this.search(w));
  },

  search(kw) {
    const items = allItems().filter((it) => it.title.indexOf(kw) >= 0 || it.desc.indexOf(kw) >= 0);
    this._all = items;
    getApp().track('search_submit', { kw: kw, hits: items.length });
    this.applyTab(this.data.cur);
  },

  applyTab(k) {
    const items = this._all || [];
    let list = k === 'all' ? items : items.filter((it) => it.type === k);
    // 命中结果里的商品也按统一筛选口径过滤（内容 / 商家不受影响）
    const cond = this.data.cond;
    if (hasCond(cond)) {
      const hit = {};
      F.apply(C.products, cond).forEach((p) => { hit[p.id] = 1; });
      list = list.filter((it) => (it.type === 'product' ? !!hit[it.id] : true));
    }
    this.setData({
      cur: k,
      list: M.stagger(list, 40, 0, 10),
      chosen: F.chosen(cond || F.empty()),
      selCount: F.chosenCount(cond || F.empty())
    });
  },

  // 从独立筛选页返回
  onBackFrom() {
    this.applyTab(this.data.cur);
  },

  onTab(e) {
    const k = e.currentTarget.dataset.k;
    if (k === this.data.cur) return;
    Sound.tap();
    UI.vibrate('light');
    this.applyTab(k);
  },

  // 搜索结果里也能进独立筛选页（只作用于命中的商品）
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
    this.setData({ cond: cond }, () => this.applyTab(this.data.cur));
  },

  clearAll() {
    Sound.slide();
    UI.vibrate('medium');
    this.setData({ cond: F.empty() }, () => this.applyTab(this.data.cur));
  },

  onItem(e) {
    const type = e.currentTarget.dataset.type;
    const id = e.currentTarget.dataset.id;
    if (type === 'test') Nav.hero('/pages/test-detail/test-detail?id=' + id);
    else if (type === 'product') Nav.hero('/pages/shop-detail/shop-detail?id=' + id);
    else if (type === 'post') Nav.hero('/pages/post-detail/post-detail?id=' + id);
    else if (type === 'shop') {
      const shop = C.shops.filter((s) => s.id === id)[0];
      if (shop) Nav.hero('/pages/shop-home/shop-home?name=' + encodeURIComponent(shop.name));
    }
  },

  onClear() {
    this.setData({ kw: '', sugs: [], submitted: false, list: [] });
  },

  onClearHistory() {
    const self = this;
    wx.showModal({
      title: '清空搜索历史',
      content: '清空后将不再显示，确定吗？',
      success: (res) => {
        if (!res.confirm) return;
        Store.SearchHistory.clear();
        self.setData({ history: [] });
        UI.toast('已清空');
      }
    });
  },

  onBack() { Nav.back(); }
});
