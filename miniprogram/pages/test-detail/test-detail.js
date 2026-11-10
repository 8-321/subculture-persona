const UI = require('../../utils/ui.js');
const Stat = require('../../utils/stat.js');
const C = require('../../data/content.js');
const Store = require('../../utils/store.js');
const Engine = require('../../utils/engine.js');
const Nav = require('../../utils/nav.js');

Page({
  data: {
    test: null,
    doneText: '',
    fav: false,
    resume: null,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad(options) {
    const id = options.id || 'main';
    const test = C.tests.filter((t) => t.id === id)[0];
    if (!test) {
      UI.toast('这套测试已经不在了');
      setTimeout(() => Nav.back(), 900);
      return;
    }
    const resume = Store.Progress.get(test.id);
    UI.sync(this, {
      test: test,
      doneText: Stat.count(test.done, '人测过'),
      fav: Store.FavPost.has('test_' + test.id),
      resume: resume && (resume.answers || []).length < test.qcount ? resume : null,
      resumeDone: resume ? (resume.answers || []).length : 0
    });
    getApp().track('test_detail_view', { id: test.id });
  },

  onShow() {
    Nav.apply(this);
    UI.sync(this);
    // 从答题页回来：进度可能已被清空（答完）或刚保存（中途退出），这里重算一次
    const t = this.data.test;
    if (!t) return;
    const p = Store.Progress.get(t.id);
    const ans = (p && p.answers) || [];
    this.setData({
      resume: p && ans.length < t.qcount ? p : null,
      resumeDone: ans.length
    });
  },

  onBack() {
    UI.back();
  },

  // 收藏该测试（未登录拦截）
  onFav() {
    const t = this.data.test;
    Store.FavPost.toggle({ id: 'test_' + t.id, title: t.title, img: t.img, type: 'test', desc: t.qcount + ' 题 · ' + t.minutes + ' 分钟' });
    const on = Store.FavPost.has('test_' + t.id);
    UI.vibrate('medium');
    UI.toast(on ? '已收藏' : '已取消收藏');
    this.setData({ fav: on });
  },

  onStart() {
    UI.vibrate('medium');
    Nav.push('/pages/question/question?id=' + this.data.test.id);
  },

  onShareAppMessage() {
    const test = this.data.test;
    if (!test) return { title: '第二文化', path: '/pages/home/home' };
    return { title: test.title, path: '/pages/test-detail/test-detail?id=' + test.id };
  }
});
