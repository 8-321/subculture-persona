// 第二文化 · 全局
// 零后端方案：登录态、收藏、历史、报告全部走本地存储；云开发预留 track 上报口。

const STORE = require('./utils/store.js');
const Sound = require('./utils/sound.js');
const Nav = require('./utils/nav.js');
const Track = require('./utils/track.js');

App({
  globalData: {
    // 主题：light / dark
    theme: 'light',
    // 减弱动效
    reduceMotion: false,
    // 登录态：null 或 { phone, nickname, interests, isMerchant, merchantStatus }
    user: null,
    // 埋点开关：本地记录（utils/track.js），只存本机不上报；设置页可查看与清空
    trackEnabled: true,
    // 商城定位：只推荐不收款（全站不得出现购买/支付入口）
    shopReadOnly: true,
    // 数据真实性闸门（需求 V3.0 §4）：没有后台来源的粉丝/好评率/销量/人测过一律不显示。
    // 不再用「开发版先显示假数字」的做法；只有接入真实统计后才打开。
    demoStats: false
  },

  onLaunch() {
    const cfg = STORE.getConfig();
    this.globalData.theme = cfg.theme || 'light';
    this.globalData.reduceMotion = !!cfg.reduceMotion;
    this.globalData.user = STORE.getUser();
    this.globalData.demoStats = this.resolveDemoStats(cfg);
    this.track('app_launch', {});
    this.applyTheme(this.globalData.theme);
  },

  // 闸门判定：只有后台已接入真实统计才打开；其余一律关闭，宁可少显示，不可编造。
  resolveDemoStats(cfg) {
    return !!(cfg && cfg.statsFromBackend);
  },

  onShow() {
    // 每次回到前台刷新登录态，保证「我的」页数据同步
    this.globalData.user = STORE.getUser();
  },

  applyTheme(theme) {
    this.globalData.theme = theme;
    const dark = theme === 'dark';
    wx.setBackgroundColor({
      backgroundColor: dark ? '#0E0E11' : '#F5F5F6',
      backgroundColorTop: dark ? '#0E0E11' : '#F5F5F6',
      backgroundColorBottom: dark ? '#0E0E11' : '#F5F5F6'
    });
  },

  setTheme(theme) {
    STORE.setConfig({ theme: theme });
    this.applyTheme(theme);
  },

  setReduceMotion(on) {
    this.globalData.reduceMotion = !!on;
    STORE.setConfig({ reduceMotion: !!on });
  },

  isLogin() {
    return !!this.globalData.user;
  },

  // 未登录拦截：弹登录引导（交互规范 N4），点「去登录」进 07
  requireLogin() {
    if (this.isLogin()) return true;
    Sound.warn();                 // 拦截：提示音，与成功音区分
    wx.showModal({
      title: '先建个本地档案',
      content: '不用手机号。建档后可以保存称呼、兴趣和商家身份。',
      confirmText: '去建档',
      cancelText: '再看看',
      success: (res) => {
        if (res.confirm) Nav.push('/pages/register/register', { silent: true });
      }
    });
    return false;
  },

  login(user) {
    STORE.setUser(user);
    this.globalData.user = user;
  },

  logout() {
    STORE.setUser(null);
    this.globalData.user = null;
  },

  // 埋点：事件名与参数由 utils/track.js 白名单校验，只写本机（V3.1 §6.1 G-11）
  track(event, params) {
    if (!this.globalData.trackEnabled) return false;
    return Track.log(event, params);
  }
});
