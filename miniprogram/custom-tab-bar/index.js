// 自定义悬浮 Tab 栏（胶囊毛玻璃样式，原生 tabBar 无法实现）
// 切换走 Nav.tab：T5 转场（内容淡入 + 上移 8px）+ 轻点音 + 轻震动 + 防连点
const Nav = require('../utils/nav.js');

Component({
  data: {
    selected: 0,
    dark: false,
    list: [
      { key: 'home', pagePath: '/pages/home/home', text: '首页', icon: '/images/tab/home.png', iconActive: '/images/tab/home-active.png' },
      { key: 'tests', pagePath: '/pages/tests/tests', text: '测试', icon: '/images/tab/test.png', iconActive: '/images/tab/test-active.png' },
      { key: 'community', pagePath: '/pages/community/community', text: '第二文化', icon: '/images/tab/culture.png', iconActive: '/images/tab/culture-active.png' },
      { key: 'shop', pagePath: '/pages/shop/shop', text: '商城', icon: '/images/tab/shop.png', iconActive: '/images/tab/shop-active.png' },
      { key: 'mine', pagePath: '/pages/mine/mine', text: '我的', icon: '/images/tab/mine.png', iconActive: '/images/tab/mine-active.png' }
    ]
  },

  attached() {
    this.syncTheme();
  },

  methods: {
    syncTheme() {
      const app = getApp();
      this.setData({ dark: app.globalData.theme === 'dark' });
    },

    onTap(e) {
      const index = Number(e.currentTarget.dataset.index);
      const item = this.data.list[index];
      if (index === this.data.selected) {
        // 双击回顶（交互规范 G-3）
        wx.pageScrollTo({ scrollTop: 0, duration: 260 });
        return;
      }
      Nav.tab(item.pagePath);
    }
  }
});
