const UI = require('../../utils/ui.js');
const Sound = require('../../utils/sound.js');
const C = require('../../data/content.js');
const Store = require('../../utils/store.js');
const Nav = require('../../utils/nav.js');
const TM = require('../../utils/typemedia.js');

Page({
  data: {
    user: null,
    heroImg: '/images/ui/lt-t10.jpg',
    heroName: '还没有测过',
    heroDesc: '点一下，3 分钟看见你的隐藏人格',
    interests: [],
    stat: { fav: 0, like: 0, follow: 0, history: 0, report: 0, reportIdx: 0, draft: 0 },
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad() {
    UI.sync(this);
  },

  onShow() {
    Nav.apply(this);
    const user = Store.getUser();
    const reports = Store.Reports.all();
    const latest = reports[0] || null;
    const interests = (user && user.interests) ? user.interests : [];

    const patch = {
      user: user,
      interests: C.interests.filter((i) => interests.indexOf(i.name) >= 0),
      stat: {
        fav: Store.FavPost.all().length + Store.FavShop.all().length,
        like: Store.FavLike.all().length,
        follow: Store.Follow.all().length,
        history: Store.History.all().length,
        report: reports.length,
        reportIdx: Store.Report.grouped().length,
        draft: Store.Draft.all().length
      },
      heroName: latest ? (latest.typeName || (latest.type && latest.type.name) || '已测出') : (user ? '还没有测过' : '还没有档案'),
      heroDesc: latest ? ((latest.dateText || (latest.ts ? UI.relTime(latest.ts) : '最近')) + ' 测出 · 已生成完整报告') : (user ? '点一下，3 分钟看见你的隐藏人格' : '建档不用手机号，数据只存本机'),
      heroImg: latest ? TM.img(latest.type) : '/images/ui/lt-t10.jpg'
    };
    UI.sync(this, patch);
    UI.setTab(this, 4);
  },

  onHeroTap() {
    const reports = Store.Reports.all();
    if (reports.length) {
      Nav.push('/pages/reports/reports');
    } else {
      Nav.hero('/pages/test-detail/test-detail?id=main');
    }
  },

  onEditInterest() {
    Nav.push('/pages/interests/interests');
  },

  onFav() { Nav.push('/pages/favorites/favorites?tab=0'); },
  onLike() { Nav.push('/pages/favorites/favorites?tab=1'); },
  onFollow() { Nav.push('/pages/followed-shops/followed-shops'); },
  onMerchant() { Nav.push('/pages/merchant-apply/merchant-apply'); },
  onDrafts() { Nav.push('/pages/drafts/drafts'); },
  onCoop() { Nav.push('/pages/cooperation/cooperation'); },
  onHistory() { Nav.push('/pages/history/history'); },
  onReports() { Nav.push('/pages/reports/reports'); },
  onMyReport() { Nav.push('/pages/my-report/my-report'); },
  onSettings() { Nav.push('/pages/settings/settings'); },

  toggleTheme() {
    const app = getApp();
    const next = app.globalData.theme === 'dark' ? 'light' : 'dark';
    app.setTheme(next);
    UI.vibrate('medium');
    UI.sync(this);
    UI.toast(next === 'dark' ? '已切换深色' : '已切换浅色');
  },

  onShareAppMessage() {
    return { title: '第二文化 · 我的主页', path: '/pages/mine/mine' };
  }
});
