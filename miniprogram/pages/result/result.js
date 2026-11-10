const UI = require('../../utils/ui.js');
const C = require('../../data/content.js');
const RF = require('../../data/realfacts.js');
const Privacy = require('../../utils/privacy.js');
const Stat = require('../../utils/stat.js');
const Store = require('../../utils/store.js');
const Engine = require('../../utils/engine.js');
const M = require('../../utils/motion.js');
const Sound = require('../../utils/sound.js');
const Nav = require('../../utils/nav.js');
const TM = require('../../utils/typemedia.js');

Page({
  data: {
    report: null,
    nameAnim: '',
    dimsAnim: [],
    matchedAnim: 0,
    dimOpen: -1,
    goods: [],
    reads: [],
    culture: null,
    kin: null,
    serial: '01',
    fav: false,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad(options) {
    const rid = options.rid || '';
    let report = rid ? Store.Reports.get(rid) : null;
    if (!report) report = getApp().globalData.lastReport;
    if (!report) {
      wx.showToast({ title: '报告已失效', icon: 'none' });
      setTimeout(() => { Nav.tab('/pages/home/home'); }, 1200);
      return;
    }

    // 旧报告可能存的是统一的朋克图：读取时按人格纠正，不改历史数据
    report.img = TM.img(report.type);
    report.serial = report.serial || TM.serial(report.type);

    // 首份报告自动保存提示（交互规范：仅首次 Toast）
    const first = !Store.getConfig().reportedToast;
    if (first) {
      Store.setConfig({ reportedToast: true });
      UI.toast('已保存到我的报告');
    }

    const dimList = report.dimList || [];
    // 文化溯源：一条可核对的事实，不堆百科（《需求 V3.0》§5.1）
    const rf = RF.byId[TM.codeOf(report.type)] || null;
    const srcUrl = rf && rf.facts && rf.facts.length ? RF.sourceOf(rf.facts[0].src) : '';
    const culture = rf ? {
      year: rf.origin.year,
      place: rf.origin.place,
      event: rf.origin.event,
      marker: (rf.markers || []).join(' / '),
      host: (srcUrl.split('/')[2] || ''),
      url: srcUrl
    } : null;

    // 同类 / 反面：给报告一个「往外走」的出口，而不是读完就结束
    const match = Engine.findType(report.type.match);
    const clash = Engine.findType(report.type.clash);
    const kin = {
      match: match ? { code: TM.codeOf(match), cn: match.cn, nick: match.nickname, img: TM.img(match) } : null,
      clash: clash ? { code: TM.codeOf(clash), cn: clash.cn, nick: clash.nickname, img: TM.img(clash) } : null
    };

    UI.sync(this, {
      report: report,
      culture: culture,
      kin: kin,
      serial: report.serial,
      dimsAnim: dimList.map((d) => ({ key: d.key, name: d.name, value: 0, levelText: d.levelText, conclusion: d.conclusion, lines: d.lines })),
      goods: C.products.slice(0, 2).map((p) => Object.assign({}, p, { priceText: Stat.price(p.price) })),
      reads: C.articles.slice(0, 2),
      fav: Store.FavPost.has('report_' + report.id)
    });

    // 人格名：解密式逐字显现（DecryptedText）
    this.setData({ nameAnim: M.reduce() ? report.type.cn : '' });
    M.decrypt(this, 'nameAnim', report.type.cn, { per: 46, tail: 4 });

    this.playCountUp(dimList, report.matched || 80);
    getApp().track('result_view', { type: report.type.code });
  },

  onShow() {
    UI.sync(this, {});
    Nav.apply(this);
    Sound.chime();
  },

  // 数字与维度条 count-up（减弱动效时直接落到终值）
  playCountUp(dimList, matched) {
    const reduce = getApp().globalData.reduceMotion;
    if (reduce) {
      this.setData({
        dimsAnim: dimList.map((d) => ({ key: d.key, name: d.name, value: d.value, levelText: d.levelText, conclusion: d.conclusion, lines: d.lines })),
        matchedAnim: matched
      });
      return;
    }
    const target = dimList.map((d) => d.value);
    const steps = 24;
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      const k = step / steps;
      this.setData({
        dimsAnim: dimList.map((d, i) => ({
          key: d.key,
          name: d.name,
          value: Math.round(target[i] * (1 - Math.pow(1 - k, 3))),
          levelText: d.levelText,
          conclusion: d.conclusion,
          lines: d.lines
        })),
        matchedAnim: Math.round(matched * (1 - Math.pow(1 - k, 3)))
      });
      if (step >= steps) clearInterval(timer);
    }, 32);
  },

  onBack() {
    // 从报告列表 / 收藏 / 人格档案进来时，返回原处；从答题流程进来时回首页
    let prev = '';
    try {
      const pages = getCurrentPages();
      const p = pages[pages.length - 2];
      prev = (p && p.route) || '';
    } catch (e) { prev = ''; }
    if (['pages/reports/reports', 'pages/favorites/favorites', 'pages/type/type'].indexOf(prev) >= 0) Nav.back();
    else Nav.tab('/pages/home/home');
  },

  // 点维度展开解读：把三屏的「维度长文」收进一次点击，首屏不再被文字淹没
  onDim(e) {
    const i = Number(e.currentTarget.dataset.i);
    Sound.tap();
    UI.vibrate('light');
    this.setData({ dimOpen: this.data.dimOpen === i ? -1 : i });
  },

  onFav() {
    const r = this.data.report;
    Store.FavPost.toggle({
      id: 'report_' + r.id,
      title: r.type.cn + ' · 人格报告',
      img: r.img,
      type: 'report',
      desc: '匹配度 ' + r.matched + '%'
    });
    const on = Store.FavPost.has('report_' + r.id);
    UI.vibrate('medium');
    Sound.pop();
    UI.toast(on ? '已收藏' : '已取消收藏');
    getApp().track('result_fav', { type: r.type.code, on: on });
    this.setData({ fav: on });
  },

  onGood(e) {
    Nav.hero('/pages/shop-detail/shop-detail?id=' + e.currentTarget.dataset.id);
  },

  onRead(e) {
    Nav.hero('/pages/post-detail/post-detail?id=' + e.currentTarget.dataset.id + '&type=article');
  },

  onKin(e) {
    const code = e.currentTarget.dataset.code;
    if (!code) return;
    Nav.push('/pages/type/type?code=' + code);
  },

  onType() {
    const code = TM.codeOf(this.data.report.type);
    Nav.push('/pages/type/type?code=' + code);
  },

  onCard() {
    Nav.push('/pages/card/card?rid=' + this.data.report.id);
  },

  // 文化溯源的出处：小程序不能开外链，改为复制链接让用户自己核对
  onCopySource() {
    const url = (this.data.culture || {}).url;
    if (!url) return;
    getApp().track('result_copy_source', { type: TM.codeOf((this.data.report || {}).type) });
    Privacy.ensure(() => {
      wx.setClipboardData({
        data: url,
        success: () => {
          UI.vibrate('light');
          UI.toast('出处链接已复制');
        }
      });
    }, '复制出处链接需要读取剪贴板权限');
  },

  onShareAppMessage() {
    const r = this.data.report;
    if (!r) return { title: '第二文化', path: '/pages/home/home' };
    const code = TM.codeOf(r.type);
    return {
      title: '我是' + r.type.nickname + '，你像哪一种？',
      path: '/pages/type/type?code=' + code + '&from=share',
      imageUrl: r.img
    };
  }
});