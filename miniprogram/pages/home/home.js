const UI = require('../../utils/ui.js');
const C = require('../../data/content.js');
const Store = require('../../utils/store.js');
const M = require('../../utils/motion.js');
const Sound = require('../../utils/sound.js');
const Nav = require('../../utils/nav.js');

let autoTimer = null;
let pauseTimer = null;

Page({
  data: {
    slides: [],
    recCatsView: [],
    testsView: [],
    cur: 0,
    user: null,
    resume: null,
    recent: [],
    sparks: [],
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad() {
    const main = C.tests.filter((t) => t.main)[0] || C.tests[0];
    this._main = main;
    this._rest = C.tests.filter((t) => !t.main);
    this._rot = 0;
    UI.sync(this, {
      slides: C.heroSlides,
      recCatsView: M.stagger(C.recCats, 26, 0, 8),
      testsView: M.stagger([main].concat(this._rest), 26, 0, 8)
    });
  },

  onShow() {
    UI.sync(this, { user: Store.getUser() });
    UI.setTab(this, 0);
    Nav.apply(this);
    this.loadResume();
    this.loadRecent();
    this.startAuto();
  },

  onHide() { this.stopAuto(); },
  onUnload() { this.stopAuto(); },

  /* ---------------- 断点续答：有进度才出现这张卡 ---------------- */
  loadResume() {
    let found = null;
    C.tests.forEach((t) => {
      if (found) return;
      const p = Store.Progress.get(t.id);
      if (p && p.index > 0 && p.index < t.qcount) {
        found = {
          id: t.id,
          title: t.title,
          done: p.index,
          left: t.qcount - p.index,
          pct: Math.round((p.index / t.qcount) * 100)
        };
      }
    });
    if (found) this.setData({ resume: found });
    else if (this.data.resume) this.setData({ resume: null });
  },

  loadRecent() {
    const h = Store.History.all().slice(0, 6);
    if (!h.length) {
      if (this.data.recent.length) this.setData({ recent: [] });
      return;
    }
    this.setData({ recent: M.stagger(h, 26, 0, 6) });
  },

  onResume() {
    const r = this.data.resume;
    if (!r) return;
    Sound.tap();
    UI.vibrate('light');
    Nav.push('/pages/question/question?id=' + r.id + '&resume=1');
  },

  onRecent(e) {
    const d = e.currentTarget.dataset;
    if (d.type === 'post' || d.type === 'article') {
      Nav.hero('/pages/post-detail/post-detail?id=' + d.id + '&type=' + (d.type || 'post'));
    } else if (d.type === 'test') {
      Nav.hero('/pages/test-detail/test-detail?id=' + d.id);
    } else {
      Nav.hero('/pages/shop-detail/shop-detail?id=' + d.id);
    }
  },

  onHistory() {
    Nav.push('/pages/history/history');
  },

  /* ---------------- 轮播 ---------------- */
  startAuto() {
    this.stopAuto();
    autoTimer = setInterval(() => {
      const n = this.data.slides.length;
      if (!n) return;
      this.setData({ cur: (this.data.cur + 1) % n });
    }, 5000);
  },

  stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    if (pauseTimer) { clearTimeout(pauseTimer); pauseTimer = null; }
  },

  onSwipe(e) {
    this.setData({ cur: e.detail.current });
  },

  onTouch() {
    this.stopAuto();
    const self = this;
    pauseTimer = setTimeout(() => { self.startAuto(); }, 8000);
  },

  /* ---------------- 跳转 ---------------- */
  onSearch() { Nav.push('/pages/search/search'); },
  onAuth() { Nav.push('/pages/register/register'); },
  onMine() { Nav.tab('/pages/mine/mine'); },

  onHero(e) {
    const target = e.currentTarget.dataset.target;
    if (target === 'main') Nav.hero('/pages/test-detail/test-detail?id=main');
    else if (target === 'community') Nav.tab('/pages/community/community');
    else if (target === 'shop') Nav.tab('/pages/shop/shop');
    else Nav.tab('/pages/tests/tests');
  },

  onCategory() { Nav.push('/pages/category/category'); },
  onType(e) { Nav.push('/pages/type/type?code=' + e.currentTarget.dataset.code); },
  onAllTests() { Nav.tab('/pages/tests/tests'); },

  onTest(e) {
    M.spark(this, e, { count: 6, radius: 40 });
    Nav.hero('/pages/test-detail/test-detail?id=' + e.currentTarget.dataset.id);
  },

  onPullDownRefresh() {
    const self = this;
    setTimeout(() => {
      const rest = this._rest || [];
      this._rot = rest.length ? (this._rot + 1) % rest.length : 0;
      const view = rest.length ? rest.slice(this._rot).concat(rest.slice(0, this._rot)) : rest;
      UI.sync(self, {
        slides: C.heroSlides,
        recCatsView: M.stagger(C.recCats, 26, 0, 8),
        testsView: M.stagger([this._main].concat(view), 26, 0, 8)
      });
      wx.stopPullDownRefresh();
      UI.toast('已更新推荐');
    }, 600);
  },

  onShareAppMessage() {
    return { title: '看看你隐藏的亚文化人格', path: '/pages/home/home' };
  }
});
