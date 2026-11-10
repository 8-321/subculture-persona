const UI = require('../../utils/ui.js');
const C = require('../../data/content.js');
const T = require('../../data/types.js');
const RF = require('../../data/realfacts.js');
const Store = require('../../utils/store.js');
const Engine = require('../../utils/engine.js');
const Sound = require('../../utils/sound.js');
const Privacy = require('../../utils/privacy.js');
const Nav = require('../../utils/nav.js');
const TM = require('../../utils/typemedia.js');

function hostOf(url) {
  return String(url || '').split('/')[2] || '';
}

Page({
  onShow() {
    Nav.apply(this);
    UI.sync(this, {});
  },

  data: {
    t: null,
    img: '/images/ui/p-punk.jpg',
    serial: '01',
    dims: [],
    facts: [],
    match: null,
    clash: null,
    tests: [],
    goods: [],
    reads: [],
    isMine: false,
    fav: false,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad(options) {
    const code = options.code || 'PUNK';
    const t = T.types.filter((x) => x.id === code || x.code === code)[0];
    if (!t) {
      UI.toast('这份档案已经不在了');
      setTimeout(() => Nav.back(), 900);
      return;
    }
    const key = TM.codeOf(t);
    const rf = RF.byId[key] || null;
    const facts = rf ? (rf.facts || []).map((f) => {
      const url = RF.sourceOf(f.src);
      return { text: f.text, host: hostOf(url), url: url };
    }) : [];

    const dims = Engine.DIMS.map((d) => ({
      key: d.key,
      name: d.name,
      value: (t.dims_base || {})[d.key] || 0
    }));

    const toCard = (x) => x ? { code: TM.codeOf(x), cn: x.cn, nick: x.nickname, img: TM.img(x) } : null;
    const match = toCard(Engine.findType(t.match));
    const clash = toCard(Engine.findType(t.clash));

    const main = C.tests.filter((x) => x.main)[0] || C.tests[0];
    const spec = C.tests.filter((x) => !x.main && x.title.indexOf(t.cn) >= 0).slice(0, 1);
    const tests = [main].concat(spec).slice(0, 2);

    const hit = C.products.filter((p) => (p.style || []).indexOf(t.cn) >= 0);
    const goods = (hit.length ? hit : C.products).slice(0, 2).map((p) => Object.assign({}, p, { priceText: '' }));

    const rel = C.articles.filter((a) => (a.title + (a.body || '')).indexOf(t.cn) >= 0);
    const reads = (rel.length ? rel : C.articles).slice(0, 2);

    const latest = Store.Reports.all()[0];
    const isMine = !!(latest && TM.codeOf(latest.type) === key);

    UI.sync(this, {
      t: t,
      img: TM.img(t),
      serial: TM.serial(t),
      origin: rf ? rf.origin : null,
      misconception: rf ? rf.misconception : '',
      markers: rf ? (rf.markers || []) : [],
      facts: facts,
      dims: dims,
      match: match,
      clash: clash,
      tests: tests,
      goods: goods,
      reads: reads,
      isMine: isMine,
      fav: Store.FavPost.has('type_' + key)
    });
    getApp().track('type_view', { code: key });
  },

  onBack() { Nav.back(); },

  onFav() {
    const t = this.data.t;
    const key = TM.codeOf(t);
    Store.FavPost.toggle({ id: 'type_' + key, title: t.cn + ' · 人格档案', img: TM.img(t), type: 'type', desc: t.nickname });
    const on = Store.FavPost.has('type_' + key);
    Sound.pop();
    UI.vibrate('medium');
    UI.toast(on ? '已收藏' : '已取消收藏');
    this.setData({ fav: on });
  },

  onStart() {
    const test = this.data.tests[0];
    if (!test) return;
    Nav.push('/pages/test-detail/test-detail?id=' + test.id);
  },

  onTest(e) {
    Nav.push('/pages/test-detail/test-detail?id=' + e.currentTarget.dataset.id);
  },

  onKin(e) {
    const code = e.currentTarget.dataset.code;
    if (!code || code === TM.codeOf(this.data.t)) return;
    Nav.replace('/pages/type/type?code=' + code);
  },

  onGood(e) {
    Nav.hero('/pages/shop-detail/shop-detail?id=' + e.currentTarget.dataset.id);
  },

  onRead(e) {
    Nav.hero('/pages/post-detail/post-detail?id=' + e.currentTarget.dataset.id + '&type=article');
  },

  onCopySource(e) {
    const url = e.currentTarget.dataset.url;
    if (!url) return;
    Privacy.ensure(() => {
      wx.setClipboardData({
        data: url,
        success: () => { UI.vibrate('light'); UI.toast('出处链接已复制'); }
      });
    }, '复制出处链接需要读取剪贴板权限');
  },

  onShareAppMessage() {
    const t = this.data.t;
    if (!t) return { title: '第二文化', path: '/pages/home/home' };
    return {
      title: t.cn + ' · ' + t.nickname + '｜第二文化人格档案',
      path: '/pages/type/type?code=' + TM.codeOf(t) + '&from=share',
      imageUrl: TM.img(t)
    };
  }
});