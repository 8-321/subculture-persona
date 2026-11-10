// 兼容入口：这个 AppID 以前发布过的旧版首页是 pages/index/index，
// 旧二维码/旧链接仍带着这条 path。这里只做一次跳转，落到正式首页。
const UI = require('../../utils/ui.js');
const Nav = require('../../utils/nav.js');

Page({
  data: { tr: '', reduce: false },

  onLoad(opts) {
    UI.sync(this);
    Nav.apply(this);
    const rest = Object.keys(opts || {})
      .filter((k) => k !== 'path')
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(opts[k]))
      .join('&');
    wx.reLaunch({ url: '/pages/home/home' + (rest ? '?' + rest : '') });
  },
});
