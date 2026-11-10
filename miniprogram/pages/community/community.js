const UI = require('../../utils/ui.js');
const Stat = require('../../utils/stat.js');
const C = require('../../data/content.js');
const Store = require('../../utils/store.js');
const M = require('../../utils/motion.js');
const Sound = require('../../utils/sound.js');
const Nav = require('../../utils/nav.js');

Page({
  data: {
    cats: [],
    cur: '推荐',
    colA: [],
    colB: [],
    canPublish: false,
    flip: 0,
    swapCls: 'm-fade',
    hasDemo: false,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad() {
    UI.sync(this, { cats: C.postCats });
    this.applyFilter('推荐');
  },

  onShow() {
    UI.sync(this, { canPublish: true });
    UI.setTab(this, 2);
    Nav.apply(this);
  },

  onUnload() {
    if (this._obsA) { try { this._obsA.disconnect(); } catch (e) { /* noop */ } }
    if (this._obsB) { try { this._obsB.disconnect(); } catch (e) { /* noop */ } }
  },

  applyFilter(cat) {
    // 被多人举报的内容先隐藏（本地规则，接后台后由服务端复核状态决定）
    const hidden = Store.Report.hiddenIds();
    let list = C.posts.filter((p) => hidden.indexOf(p.id) < 0);
    if (cat !== '推荐') {
      list = list.filter((p) => p.topics.indexOf(cat) >= 0 || p.shop === cat);
    }
    const items = list.map((p) => ({
      id: p.id,
      cover: p.cover,
      h: p.h * 2,
      title: p.title,
      shop: p.shop,
      shopImg: p.shopImg,
      likesText: Stat.count(p.likes, ' 赞'),
      demo: !!p.demo,
      goods: p.goods
    }));
    const colA = [];
    const colB = [];
    items.forEach((it, i) => { (i % 2 === 0 ? colA : colB).push(it); });
    this.setData({ cur: cat, colA: colA, colB: colB, hasDemo: items.some((it) => it.demo) }, () => {
      // 瀑布流揭示式入场：卡片进入视口才播，避免一进页面整屏抖
      if (this._obsA) { try { this._obsA.disconnect(); } catch (e) { /* noop */ } }
      if (this._obsB) { try { this._obsB.disconnect(); } catch (e) { /* noop */ } }
      this._obsA = M.reveal(this, 'colA', { step: 40, cap: 8 });
      this._obsB = M.reveal(this, 'colB', { step: 40, cap: 8 });
    });
  },

  onCat(e) {
    const cat = e.currentTarget.dataset.cat;
    if (cat === this.data.cur) return;
    Sound.tap();
    UI.vibrate('light');
    this.setData({
      flip: this.data.flip + 1,
      swapCls: this.data.flip % 2 === 0 ? 'm-fade-b' : 'm-fade'
    }, () => this.applyFilter(cat));
  },

  onPost(e) {
    const id = e.currentTarget.dataset.id;
    const p = C.posts.filter((x) => x.id === id)[0];
    if (p) Store.History.push({ id: p.id, title: p.title, img: p.cover, src: '第二文化', type: 'post' });
    Nav.hero('/pages/post-detail/post-detail?id=' + id);
  },

  onSearch() {
    Nav.push('/pages/search/search');
  },

  // 商家账号可见（交互规范：非商家无发布按钮）
  onPublish() {
    const app = getApp();
    if (!app.isLogin()) { app.requireLogin(); return; }
    Nav.push('/pages/post-publish/post-publish');
  },

  onShareAppMessage() {
    return { title: '第二文化 · 商家在发的穿搭与手作', path: '/pages/community/community' };
  }
});
