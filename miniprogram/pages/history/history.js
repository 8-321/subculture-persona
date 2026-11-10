const UI = require('../../utils/ui.js');
const Store = require('../../utils/store.js');
const Nav = require('../../utils/nav.js');

Page({
  data: {
    groups: [],
    total: 0,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onShow() {
    Nav.apply(this);
    UI.sync(this);
    this.apply();
  },

  apply() {
    const all = Store.History.all();
    const buckets = { '今天': [], '昨天': [], '更早': [] };
    all.forEach((it) => {
      const d = UI.relTime(it.ts);
      const key = buckets[d] ? d : '更早';
      const timeText = (d === '今天') ? (UI.timeOfDay(it.ts) + ' 浏览') : (d + ' 浏览');
      buckets[key].push(Object.assign({}, it, { timeText: timeText }));
    });
    const groups = ['今天', '昨天'].map((n) => ({ name: n, items: buckets[n] }));
    groups.push({ name: '更早', items: buckets['更早'] });
    this.setData({ groups: groups, total: all.length });
  },

  // 清空历史：确认弹层 + heavy 震动
  onClear() {
    if (!this.data.total) { UI.toast('已经是空的'); return; }
    const self = this;
    wx.showModal({
      title: '清空浏览历史',
      content: '清空后无法恢复，确定吗？',
      confirmText: '清空',
      success: (res) => {
        if (!res.confirm) return;
        Store.History.clear();
        UI.vibrate('heavy');
        UI.toast('已清空');
        self.apply();
      }
    });
  },

  onOpen(e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type;
    if (type === 'product') Nav.hero('/pages/shop-detail/shop-detail?id=' + id);
    else if (type === 'test') Nav.hero('/pages/test-detail/test-detail?id=' + id);
    else Nav.hero('/pages/post-detail/post-detail?id=' + id);
  },

  onBack() { UI.back(); }
});
