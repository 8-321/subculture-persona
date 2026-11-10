const UI = require('../../utils/ui.js');
const Stat = require('../../utils/stat.js');
const C = require('../../data/content.js');
const T = require('../../data/types.js');
const TM = require('../../utils/typemedia.js');
const M = require('../../utils/motion.js');
const Sound = require('../../utils/sound.js');
const Nav = require('../../utils/nav.js');

const CATS = ['全部', '人格', '审美', '音乐', '穿搭', '社交'];

Page({
  data: {
    cats: CATS,
    cur: '全部',
    main: null,
    list: [],
    types: [],
    sparks: [],
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad() {
    this.applyFilter('全部');
  },

  onShow() {
    UI.sync(this);
    UI.setTab(this, 1);
    Nav.apply(this);
  },

  applyFilter(cat) {
    const rest = C.tests.filter((t) => !t.main);
    const list = (cat === '全部' ? rest : rest.filter((t) => t.cat === cat)).map((t) => ({
      id: t.id,
      title: t.title,
      cat: t.cat,
      img: t.img,
      qcount: t.qcount,
      minutes: t.minutes,
      doneText: Stat.count(t.done, '人测过')
    }));
    this.setData({
      cur: cat,
      main: C.tests.filter((t) => t.main)[0] || C.tests[0],
      list: M.stagger(list, 26, 0, 10),
      types: T.types.map((t) => ({ id: TM.codeOf(t), cn: t.cn, nick: t.nickname, img: TM.img(t), serial: TM.serial(t) }))
    });
  },

  onCat(e) {
    const cat = e.currentTarget.dataset.cat;
    if (cat === this.data.cur) return;
    Sound.tap();
    UI.vibrate('light');
    this.applyFilter(cat);
  },

  onTest(e) {
    M.spark(this, e, { count: 6, radius: 40 });
    Nav.hero('/pages/test-detail/test-detail?id=' + e.currentTarget.dataset.id);
  },

  onType(e) {
    Nav.push('/pages/type/type?code=' + e.currentTarget.dataset.id);
  },

  onSearch() {
    Nav.push('/pages/search/search');
  },

  onShareAppMessage() {
    return { title: '亚文化人格测试 · 14 种人格', path: '/pages/tests/tests' };
  }
});
