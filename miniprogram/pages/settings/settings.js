const UI = require('../../utils/ui.js');
const Store = require('../../utils/store.js');
const Sound = require('../../utils/sound.js');
const Nav = require('../../utils/nav.js');
const Stat = require('../../utils/stat.js');
const Track = require('../../utils/track.js');
const Site = require('../../utils/site.js');

Page({
  data: {
    user: null,
    first: '游',
    masked: '',
    cacheSize: '0 兆',
    logCount: 0,
    logSummary: [],
    logRecent: [],
    sound: true,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad() {
    this.refresh();
  },

  onShow() {
    Nav.apply(this);
    this.refresh();
  },

  refresh() {
    const user = Store.getUser();
    const app = getApp();
    let cacheSize = '0 兆';
    try {
      const info = wx.getStorageInfoSync();
      cacheSize = ((info.currentSize || 0) / 1024).toFixed(1) + ' 兆';
    } catch (e) {
      cacheSize = '0 兆';
    }
    UI.sync(this, {
      user: user,
      statNote: Stat.sourceNote(),
      first: user ? (user.nickname || '用').slice(0, 1) : '游',
      masked: user ? (String(user.phone || '').replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')) : '',
      cacheSize: cacheSize,
      logCount: Track.count(),
      logSummary: Track.summary().slice(0, 3),
      logRecent: Track.recent(5),
      sound: Sound.isEnabled(),
      version: Site.version,
      dark: app.globalData.theme === 'dark',
      reduce: !!app.globalData.reduceMotion
    });
  },

  // 清空本机行为日志（只影响这台手机，不影响任何上报，因为没有上报）
  onClearLog() {
    const n = Track.count();
    if (!n) { UI.toast('还没有记录'); return; }
    wx.showModal({
      title: '清空行为日志',
      content: '本机共 ' + n + ' 条，清空后不可恢复。日志只存在这台手机上，不含手机号。',
      confirmText: '清空',
      cancelText: '取消',
      success: (res) => {
        if (!res.confirm) return;
        Track.clear();
        UI.vibrate('medium');
        UI.toast('已清空');
        this.refresh();
      }
    });
  },

  toggleTheme() {
    const app = getApp();
    app.setTheme(app.globalData.theme === 'dark' ? 'light' : 'dark');
    UI.vibrate('medium');
    this.refresh();
  },

  pickTheme(e) {
    const t = e.currentTarget.dataset.t;
    const app = getApp();
    if ((app.globalData.theme === 'dark') === (t === 'dark')) return;
    app.setTheme(t);
    UI.vibrate('medium');
    this.refresh();
  },

  // 减弱动效（动效规范 §8.2）
  toggleReduce() {
    const app = getApp();
    app.setReduceMotion(!app.globalData.reduceMotion);
    UI.vibrate('light');
    this.refresh();
    UI.toast(app.globalData.reduceMotion ? '已减弱动效' : '已恢复动效');
  },

  // 操作音效开关（声音系统 utils/sound.js）
  toggleSound() {
    const on = !Sound.isEnabled();
    Sound.setEnabled(on);
    UI.vibrate('medium');
    this.refresh();
    if (on) Sound.pop();   // 打开时给一声，确认生效
    UI.toast(on ? '已开启操作音效' : '已关闭操作音效');
  },

  onFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '点右上角「···」，选「反馈与投诉」，会直接提交给微信平台；也可以在小程序资料页查看运营者信息。',
      showCancel: false
    });
  },

  onHelp() {
    wx.showModal({ title: '帮助中心', content: '测试结果仅供兴趣参考，不是心理诊断。商城只做推荐，不收款、不交易。', showCancel: false });
  },

  onAbout() {
    wx.showModal({ title: '关于第二文化', content: Site.version + ' 版 · 亚文化人格测试与文化档案', showCancel: false });
  },

  onLegal(e) {
    const t = e.currentTarget.dataset.t || 'privacy';
    Nav.push('/pages/legal/legal?type=' + t);
  },

  onClearCache() {
    const self = this;
    wx.showModal({
      title: '清除缓存',
      content: '会清空浏览历史与搜索历史，收藏与报告保留。',
      confirmText: '清除',
      success: (res) => {
        if (!res.confirm) return;
        Store.History.clear();
        Store.SearchHistory.clear();
        UI.vibrate('heavy');
        UI.toast('缓存已清除');
        self.refresh();
      }
    });
  },

  onLogout() {
    const self = this;
    wx.showModal({
      title: '移除档案',
      content: '移除后，本机的报告与收藏仍然保留；下次可以重新建档。',
      confirmText: '移除',
      success: (res) => {
        if (!res.confirm) return;
        getApp().logout();
        UI.toast('档案已移除');
        self.refresh();
      }
    });
  },

  onBack() { Nav.back(); }
});
