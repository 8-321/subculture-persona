// 独立筛选页（T3 抽屉转场 · 跳转进来即是筛选界面，不需要再点一次）
// 入口：商城 / 分类 / 搜索页的「筛选」—— Nav.drawer('/pages/filter/filter' + Filter.toQuery(cond))
// 出口：确定 → Nav.backWith()，回写到上一页并触发重新筛选
//
// 本页承担了 6 种不同的动效，是「动效不止一种」的集中体现：
//   1 T3 从下升起入场（420ms/D）
//   2 分组切换 → 右侧选项交错弹入（m-pop + 26ms 错峰）
//   3 已选条件 chip 出现（m-pop-lg 过冲）
//   4 底部结果数（countUp 700ms 曲线 F + 逐格 tick 音）
//   5 顶部拖拽跟手位移 + 弹簧回弹（曲线 B）
//   6 关闭 t3-down 落下 + slide 音

const UI = require('../../utils/ui.js');
const C = require('../../data/content.js');
const F = require('../../utils/filter.js');
const M = require('../../utils/motion.js');
const Sound = require('../../utils/sound.js');
const Nav = require('../../utils/nav.js');

Page({
  data: {
    cond: null,
    tabs: [],
    curGroup: 'sort',
    curName: '',
    curItems: [],
    chosen: [],
    selCount: 0,
    hitCount: 0,
    hitAnim: 0,
    sortOptionsView: [],
    rangesView: [],
    rangeOn: '',
    sparks: [],
    min: '',
    max: '',
    dragY: 0,
    closing: false,
    tr: '',
    dark: false,
    reduce: false,
    sbh: 20
  },

  /* ---------------- 生命周期 ---------------- */
  onLoad(options) {
    const cond = F.fromQuery(options);
    UI.sync(this, {
      cond: cond,
      sortOptionsView: M.stagger(C.sortOptions, 40, 30, 8),
      rangesView: M.stagger(C.priceRanges.map((v) => ({ v: v })), 26, 60, 8),
      rangeOn: cond.range,
      min: cond.min,
      max: cond.max,
      curGroup: 'sort'
    });
    this.refresh();
  },

  onShow() {
    UI.sync(this, {});
    Nav.apply(this);
    // 入场动画结束后摘掉转场类，否则 animation 的 fill 会压住拖拽的行内 transform
    const self = this;
    setTimeout(() => { self.setData({ tr: '' }); }, 480);
  },

  onUnload() {
    if (this._obs) { try { this._obs.disconnect(); } catch (e) { /* noop */ } }
  },

  /* ---------------- 条件 → 视图 ---------------- */
  refresh() {
    const cond = this.data.cond;
    const tabs = [{ key: 'sort', name: '排序', count: cond.sort && cond.sort !== 'default' ? 1 : 0 }]
      .concat([{ key: 'price', name: '价格', count: (cond.range || cond.min || cond.max) ? 1 : 0 }])
      .concat(C.filterGroups.map((g) => ({
        key: g.key, name: g.name, count: (cond[g.key] || []).length
      })));

    const cur = tabs.filter((t) => t.key === this.data.curGroup)[0] || tabs[0];
    let items = [];
    if (cur.key !== 'sort' && cur.key !== 'price') {
      const g = C.filterGroups.filter((x) => x.key === cur.key)[0];
      const picked = cond[cur.key] || [];
      items = (g ? g.items : []).map((v) => ({ v: v, on: picked.indexOf(v) >= 0 }));
    }

    const hit = F.count(cond);
    UI.sync(this, {
      tabs: tabs,
      curName: cur.name,
      curItems: M.stagger(items, 26, 40, 12),
      chosen: F.chosen(cond),
      selCount: F.chosenCount(cond),
      hitCount: hit
    });
    this.rollHit(hit);
  },

  // 结果数：码表滚动 700ms / 曲线 F（减弱动效时直接落值）
  rollHit(to) {
    const self = this;
    if (this._roll) this._roll();
    this._roll = M.countUp(this, 'hitAnim', to, {
      dur: 700,
      onDone: () => { Sound.tick(); }
    });
    void self;
  },

  /* ---------------- 分组导航 ---------------- */
  onGroup(e) {
    const k = e.currentTarget.dataset.k;
    if (k === this.data.curGroup) return;
    Sound.tap();
    UI.vibrate('light');
    this.setData({ curGroup: k }, () => this.refresh());
  },

  /* ---------------- 选项 ---------------- */
  onChip(e) {
    const v = e.currentTarget.dataset.v;
    const key = this.data.curGroup;
    const cond = Object.assign({}, this.data.cond);
    const arr = (cond[key] || []).slice();
    const i = arr.indexOf(v);
    if (i >= 0) arr.splice(i, 1); else arr.push(v);
    cond[key] = arr;
    Sound.tap();
    UI.vibrate('light');
    if (M.reduce()) {
      this.setData({ cond: cond }, () => this.refresh());
    } else {
      // 只重算选中态，不重播整组弹入，避免点一下整屏都抖
      this.setData({
        cond: cond,
        curItems: this.data.curItems.map((it) => (it.v === v ? Object.assign({}, it, { on: i < 0 }) : it))
      }, () => this.refresh());
    }
  },

  onSort(e) {
    const k = e.currentTarget.dataset.k;
    const cond = Object.assign({}, this.data.cond, { sort: k });
    Sound.tap();
    UI.vibrate('light');
    this.setData({ cond: cond }, () => this.refresh());
  },

  onRange(e) {
    const r = e.currentTarget.dataset.r;
    const on = this.data.rangeOn === r ? '' : r;
    const p = F.parseRange(on);
    const cond = Object.assign({}, this.data.cond, { range: on, min: p.min, max: p.max });
    Sound.tap();
    UI.vibrate('light');
    this.setData({ cond: cond, rangeOn: on, min: p.min, max: p.max }, () => this.refresh());
  },

  onMin(e) {
    const cond = Object.assign({}, this.data.cond, { min: e.detail.value, range: '' });
    this.setData({ cond: cond, min: e.detail.value, rangeOn: '' }, () => this.refresh());
  },

  onMax(e) {
    const cond = Object.assign({}, this.data.cond, { max: e.detail.value, range: '' });
    this.setData({ cond: cond, max: e.detail.value, rangeOn: '' }, () => this.refresh());
  },

  /* ---------------- 已选条件：单独删除 ---------------- */
  removeOne(e) {
    const k = e.currentTarget.dataset.k;
    const v = e.currentTarget.dataset.v;
    const cond = Object.assign({}, this.data.cond);
    if (k === 'price') {
      cond.range = ''; cond.min = ''; cond.max = '';
      this.setData({ rangeOn: '', min: '', max: '' });
    } else {
      const arr = (cond[k] || []).slice();
      const i = arr.indexOf(v);
      if (i >= 0) arr.splice(i, 1);
      cond[k] = arr;
    }
    Sound.pop();
    UI.vibrate('light');
    this.setData({ cond: cond }, () => this.refresh());
  },

  onReset() {
    const cond = F.empty();
    cond.cat = this.data.cond.cat;
    cond.sort = 'default';
    Sound.slide();
    UI.vibrate('medium');
    UI.toast('已清空筛选条件');
    this.setData({ cond: cond, rangeOn: '', min: '', max: '' }, () => this.refresh());
  },

  /* ---------------- 关闭 / 确定 ---------------- */
  onClose() {
    this.doClose();
  },

  doClose() {
    const self = this;
    Sound.slide();
    if (M.reduce()) { Nav.back({ silent: true }); return; }
    this.setData({ closing: true, dragY: 0 });
    setTimeout(() => { Nav.back({ silent: true }); }, 380);
    void self;
  },

  // 按下主按钮时记录触点，抬手时在该点炸开火花（ClickSpark）
  onSpark(e) {
    M.spark(this, e, { count: 7, radius: 52 });
  },

  onConfirm() {
    Sound.pop();
    UI.vibrate('medium');
    const payload = F.toPageData(this.data.cond);
    Nav.backWith(payload, { silent: true });
  },

  /* ---------------- 顶部拖拽关闭（跟手 + 弹簧回弹） ---------------- */
  onDragStart(e) {
    if (this.data.closing) return;
    this._y0 = e.touches[0].clientY;
    this._t0 = Date.now();
  },

  onDragMove(e) {
    if (this._y0 === undefined || this.data.closing) return;
    let dy = e.touches[0].clientY - this._y0;
    if (dy < 0) dy = dy * 0.32;              // 向上越界：橡皮筋阻尼
    this.setData({ dragY: Math.round(dy) });
  },

  onDragEnd() {
    if (this._y0 === undefined) return;
    const dy = this.data.dragY || 0;
    const fast = Date.now() - (this._t0 || 0) < 260 && dy > 40;  // 快速下拉也算关闭
    this._y0 = undefined;
    if (dy > 120 || fast) {
      this.doClose();
      return;
    }
    // 弹簧回弹：曲线 B，300ms 回到 0
    const from = dy;
    M.tween({
      dur: 300,
      ease: 'B',
      onFrame: (k, e) => { this.setData({ dragY: Math.round(from * (1 - e)) }); },
      onDone: () => { this.setData({ dragY: 0 }); }
    });
  },

  onShareAppMessage() {
    return { title: '第二文化 · 按风格挑东西', path: '/pages/shop/shop' };
  }
});
