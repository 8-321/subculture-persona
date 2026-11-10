const UI = require('../../utils/ui.js');
const Store = require('../../utils/store.js');
const Nav = require('../../utils/nav.js');

Page({
  onShow() {
    Nav.apply(this);
    this.refresh();
  },

  data: {
    list: [],
    dark: false,
    reduce: false,
    sbh: 20
  },

  refresh() {
    const raw = Store.Draft.all() || [];
    const list = raw.map((d) => ({
      id: d.id,
      title: d.title || '未命名草稿',
      cover: (d.pics && d.pics[0]) || '',
      count: (d.pics || []).length,
      time: UI.relTime(d.ts || Date.now()),
      body: d.body || ''
    }));
    UI.sync(this, { list: list });
  },

  onBack() { Nav.back(); },

  onNew() { Nav.push('/pages/post-publish/post-publish'); },

  onOpen(e) {
    const id = e.currentTarget.dataset.id;
    Nav.push('/pages/post-publish/post-publish?draftId=' + id);
  },

  onDel(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除草稿',
      content: '删掉后无法恢复。',
      confirmText: '删除',
      success: (res) => {
        if (!res.confirm) return;
        Store.Draft.remove(id);
        UI.vibrate('heavy');
        UI.toast('已删除');
        this.refresh();
      }
    });
  }
});