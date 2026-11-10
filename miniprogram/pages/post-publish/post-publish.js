const UI = require('../../utils/ui.js');
const C = require('../../data/content.js');
const Nav = require('../../utils/nav.js');
const Privacy = require('../../utils/privacy.js');
const Store = require('../../utils/store.js');

Page({
  onShow() {
    Nav.apply(this);
  },

  data: {
    pics: [],
    title: '',
    body: '',
    topics: ['哥特', '通勤穿搭'],
    music: '',
    readOn: true,
    goods: null,
    canPub: false,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad(options) {
    UI.sync(this);
    this.setData({ goods: C.products[0] });
    const id = options && options.draftId;
    if (!id) return;
    const d = Store.Draft.all().filter((x) => x.id === id)[0];
    if (!d) return;
    this._draftId = d.id;
    this.setData({
      pics: d.pics || [],
      title: d.title || '',
      body: d.body || '',
      topics: d.topics || [],
      music: d.music || '',
      goods: d.goods || null
    }, () => this.check());
  },

  check() {
    this.setData({ canPub: this.data.pics.length > 0 && this.data.title.length > 0 });
  },

  onAdd() {
    const self = this;
    // 选相册前先过隐私授权（2023-09-15 起平台强制）
    Privacy.ensure(() => {
      wx.chooseMedia({
        count: 9 - self.data.pics.length,
        mediaType: ['image'],
        sizeType: ['compressed'],
        success: (res) => {
          const files = res.tempFiles.map((f) => f.tempFilePath);
          // 草稿要用得久，先把临时文件落到本机用户目录（否则关掉小程序就失效）
          const fs = wx.getFileSystemManager();
          const out = [];
          let done = 0;
          const finish = () => {
            self.setData({ pics: self.data.pics.concat(out) }, () => self.check());
          };
          files.forEach((f, i) => {
            fs.saveFile({
              tempFilePath: f,
              success: (r) => { out[i] = r.savedFilePath; },
              fail: () => { out[i] = f; },
              complete: () => { done++; if (done === files.length) finish(); }
            });
          });
        }
      });
    }, '选图需要访问你的相册');
  },

  onDel(e) {
    const i = Number(e.currentTarget.dataset.i);
    const pics = this.data.pics.slice();
    pics.splice(i, 1);
    this.setData({ pics: pics }, () => this.check());
  },

  onTitle(e) { this.setData({ title: e.detail.value }, () => this.check()); },
  onBody(e) { this.setData({ body: e.detail.value }); },

  onAddTopic() {
    const self = this;
    wx.showActionSheet({
      itemList: ['哥特', '洛丽塔', '朋克', '手作', '妆造', '通勤穿搭'],
      success: (res) => {
        const list = ['哥特', '洛丽塔', '朋克', '手作', '妆造', '通勤穿搭'];
        const t = list[res.tapIndex];
        if (self.data.topics.indexOf(t) >= 0) return;
        self.setData({ topics: self.data.topics.concat([t]) });
      }
    });
  },

  onToggleRead() { this.setData({ readOn: !this.data.readOn }); },

  onPickGoods() {
    const self = this;
    const names = C.products.slice(0, 6).map((p) => p.brand + ' · ' + p.name);
    wx.showActionSheet({
      itemList: names,
      success: (res) => { self.setData({ goods: C.products[res.tapIndex] }); }
    });
  },

  draftText() {
    const d = this.data;
    return [
      '【第二文化投稿】',
      '标题：' + d.title.trim(),
      d.topics.length ? '话题：' + d.topics.join('、') : '',
      d.body.trim() ? '正文：' + d.body.trim() : '',
      d.goods ? '关联商品：' + d.goods.brand + ' · ' + d.goods.name : '',
      '（图片请在聊天里另发）'
    ].filter(Boolean).join('\n');
  },

  onPublish() {
    if (!this.data.canPub) {
      UI.toast('至少一张图和一个标题');
      return;
    }
    const d = this.data;
    // 不假装有审核后台：完整存本地草稿，投稿文本由用户自己决定发不发
    Store.Draft.add({
      id: this._draftId || ('d_' + Date.now()),
      title: d.title.trim(),
      body: d.body.trim(),
      topics: d.topics,
      music: d.music,
      pics: d.pics,
      goods: d.goods,
      ts: Date.now()
    });
    UI.vibrate('medium');
    const text = this.draftText();
    wx.showModal({
      title: '已存为本地草稿',
      content: '发布通道还没开放。可复制内容发给「第二文化」的运营者，由人工确认后发布。',
      confirmText: '复制投稿',
      cancelText: '稍后再说',
      success: (res) => {
        if (res.confirm) {
          Privacy.ensure(() => {
            wx.setClipboardData({ data: text, success: () => UI.toast('投稿内容已复制') });
          }, '复制投稿内容需要读取剪贴板权限');
        }
        setTimeout(() => Nav.back(), 600);
      }
    });
  },

  onBack() { UI.back(); }
});
