const UI = require('../../utils/ui.js');
const Privacy = require('../../utils/privacy.js');
const Nav = require('../../utils/nav.js');
const Site = require('../../utils/site.js');
const L = require('../../data/legal.js');

const CONTACT = Site.mail;

Page({
  onShow() {
    Nav.apply(this);
    UI.sync(this, {});
  },

  data: {
    type: 'privacy',
    title: '隐私政策',
    kicker: '',
    updated: L.UPDATED,
    sections: [],
    contact: CONTACT,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad(options) {
    const type = L.MAP[options.type] ? options.type : 'privacy';
    UI.sync(this, {
      type: type,
      title: L.TITLE[type],
      kicker: L.KICKER[type],
      sections: L.MAP[type]
    });
  },

  onBack() { Nav.back(); },

  onSwitch(e) {
    const t = e.currentTarget.dataset.t;
    if (!L.MAP[t] || t === this.data.type) return;
    Nav.replace('/pages/legal/legal?type=' + t);
  },

  onCopyEmail() {
    if (!CONTACT) { UI.toast('联系方式待配置'); return; }
    Privacy.ensure(() => {
      wx.setClipboardData({
        data: CONTACT,
        success: () => { UI.vibrate('light'); UI.toast('邮箱已复制'); }
      });
    }, '复制邮箱需要读取剪贴板权限');
  },

  onOpenContract() {
    if (typeof wx.openPrivacyContract !== 'function') {
      UI.toast('当前微信版本不支持，请在小程序资料页查看');
      return;
    }
    wx.openPrivacyContract({
      fail: () => UI.toast('请在小程序资料页查看隐私指引')
    });
  }
});