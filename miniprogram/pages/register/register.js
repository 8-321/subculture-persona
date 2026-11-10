const UI = require('../../utils/ui.js');
const Store = require('../../utils/store.js');
const Privacy = require('../../utils/privacy.js');
const Nav = require('../../utils/nav.js');

Page({
  onShow() {
    Nav.apply(this);
    UI.sync(this, {});
  },

  data: {
    nickname: '',
    avatar: '',
    agreed: false,
    canSubmit: false,
    err: '',
    existing: false,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad() {
    const u = Store.getUser();
    UI.sync(this, {});
    this.setData({
      nickname: (u && u.nickname) || '',
      avatar: (u && u.avatar) || '',
      existing: !!u
    }, () => this.check());
  },

  check() {
    const ok = this.data.nickname.trim().length > 0 && this.data.agreed;
    if (ok !== this.data.canSubmit) this.setData({ canSubmit: ok });
    return ok;
  },

  onNick(e) {
    this.setData({ nickname: e.detail.value, err: '' }, () => this.check());
  },

  // 微信头像选择：不经过服务器，选完直接存本机
  onAvatar(e) {
    const tmp = e.detail.avatarUrl;
    if (!tmp) return;
    const self = this;
    try {
      wx.getFileSystemManager().saveFile({
        tempFilePath: tmp,
        success: (res) => { self.setData({ avatar: res.savedFilePath }); },
        fail: () => { self.setData({ avatar: tmp }); }
      });
    } catch (err) {
      self.setData({ avatar: tmp });
    }
    UI.vibrate('light');
  },

  onAgree() {
    this.setData({ agreed: !this.data.agreed }, () => this.check());
  },

  onLink(e) {
    const t = e.currentTarget.dataset.t;
    Nav.push('/pages/legal/legal?type=' + t);
  },

  onSubmit() {
    if (!this.data.nickname.trim()) {
      this.setData({ err: '先给自己起个称呼' });
      return;
    }
    if (!this.data.agreed) {
      this.setData({ err: '请先阅读并同意协议' });
      return;
    }
    const old = Store.getUser() || {};
    const user = Object.assign({}, old, {
      nickname: this.data.nickname.trim(),
      avatar: this.data.avatar || '',
      local: true,
      isMerchant: !!old.isMerchant,
      merchantStatus: old.merchantStatus || 'none',
      interests: old.interests || [],
      createdAt: old.createdAt || Date.now()
    });
    getApp().login(user);
    UI.vibrate('medium');
    UI.toast('档案已建立');
    setTimeout(() => {
      if (!Store.getConfig().interestsDone) {
        Nav.replace('/pages/interests/interests');
      } else {
        Nav.back();
      }
    }, 380);
  },

  onSkip() {
    Nav.tab('/pages/home/home');
  },

  onBack() { Nav.back(); }
});