module.exports = [
  { file: 'miniprogram/pages/my-report/my-report.wxml', old: `      <text class="s">同一条内容满 3 次反馈会自动隐藏待复核</text>`, new: `      <text class="s">同一条内容满 3 次，会先在这台手机上隐藏</text>` },
  { file: 'miniprogram/pages/home/home.js', old: `  onLoad() {
    const main = C.tests.filter((t) => t.main)[0] || C.tests[0];
    const rest = C.tests.filter((t) => !t.main);
    UI.sync(this, {
      slides: C.heroSlides,
      recCatsView: M.stagger(C.recCats, 26, 0, 8),
      testsView: M.stagger([main].concat(rest), 26, 0, 8)
    });
  },`, new: `  onLoad() {
    const main = C.tests.filter((t) => t.main)[0] || C.tests[0];
    this._main = main;
    this._rest = C.tests.filter((t) => !t.main);
    this._rot = 0;
    UI.sync(this, {
      slides: C.heroSlides,
      recCatsView: M.stagger(C.recCats, 26, 0, 8),
      testsView: M.stagger([main].concat(this._rest), 26, 0, 8)
    });
  },` },
  { file: 'miniprogram/pages/home/home.js', old: `  onPullDownRefresh() {
    const self = this;
    setTimeout(() => {
      UI.sync(self, { slides: C.heroSlides, recCatsView: M.stagger(C.recCats, 26, 0, 8) });
      wx.stopPullDownRefresh();
      UI.toast('已更新推荐');
    }, 600);
  },`, new: `  onPullDownRefresh() {
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
  },` }
];
