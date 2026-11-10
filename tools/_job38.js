module.exports = [
  {
    "file": "miniprogram/pages/search/search.wxss",
    "old": ".sbar { display: flex; align-items: center; gap: 14rpx; margin: 24rpx 40rpx 0; height: 88rpx;",
    "new": ".sbar { display: flex; align-items: center; gap: 14rpx; margin: 24rpx 40rpx 0; min-height: 88rpx;"
  },
  {
    "file": "miniprogram/pages/search/search.wxss",
    "old": ".inp { flex: 1; font-size: 27rpx; color: var(--text); height: 88rpx; }",
    "new": ".inp { flex: 1; min-width: 0; font-size: 27rpx; color: var(--text); height: 88rpx; }"
  },
  {
    "file": "miniprogram/pages/search/search.wxss",
    "old": ".cancel { font-size: 25rpx; color: var(--text-2); font-weight: 700; }",
    "new": ".cancel { flex: 0 0 auto; white-space: nowrap; line-height: 1.3; font-size: 25rpx; color: var(--text-2); font-weight: 700; }"
  },
  {
    "file": "miniprogram/pages/search/search.wxss",
    "old": ".chips { display: flex; gap: 18rpx; padding: 0 40rpx; margin-top: 28rpx; }\n.c { height: 60rpx; padding: 0 26rpx; border-radius: 999rpx; background: var(--card);\n  border: 1rpx solid var(--line); color: var(--text-2); font-size: 23rpx; font-weight: 700;\n  display: flex; align-items: center; }",
    "new": ".chips { display: flex; flex-wrap: wrap; align-items: center; gap: 12rpx 14rpx; padding: 0 40rpx; margin-top: 28rpx; }\n.c { flex: 0 0 auto; white-space: nowrap; height: auto; min-height: 60rpx; padding: 6rpx 24rpx;\n  border-radius: 999rpx; background: var(--card); line-height: 1.3;\n  border: 1rpx solid var(--line); color: var(--text-2); font-size: 23rpx; font-weight: 700;\n  display: flex; align-items: center; }"
  },
  {
    "file": "miniprogram/pages/search/search.wxss",
    "old": ".w { height: 60rpx; padding: 0 26rpx; border-radius: 999rpx; background: var(--card);\n  border: 1rpx solid var(--line); font-size: 23rpx; color: var(--text-2);\n  display: flex; align-items: center; }",
    "new": ".w { flex: 0 0 auto; white-space: nowrap; height: auto; min-height: 60rpx; padding: 6rpx 26rpx;\n  border-radius: 999rpx; background: var(--card); line-height: 1.3;\n  border: 1rpx solid var(--line); font-size: 23rpx; color: var(--text-2);\n  display: flex; align-items: center; }"
  },
  {
    "file": "miniprogram/pages/filter/filter.wxss",
    "old": ".b-reset {\n  height: 88rpx; padding: 0 34rpx; border-radius: 999rpx;",
    "new": ".b-reset {\n  flex: 0 0 auto; white-space: nowrap; height: auto; min-height: 88rpx; padding: 12rpx 34rpx; line-height: 1.25; border-radius: 999rpx;"
  },
  {
    "file": "miniprogram/pages/filter/filter.wxss",
    "old": ".b-ok {\n  height: 88rpx; padding: 0 52rpx; border-radius: 999rpx;",
    "new": ".b-ok {\n  flex: 0 0 auto; white-space: nowrap; height: auto; min-height: 88rpx; padding: 12rpx 52rpx; line-height: 1.25; border-radius: 999rpx;"
  },
  {
    "file": "miniprogram/custom-tab-bar/index.wxss",
    "old": ".tb .lb {\n  font-size: 19rpx;\n  font-weight: 600;\n  letter-spacing: .6rpx;\n  line-height: 1;\n  color: #8A8A93;\n}",
    "new": ".tb .lb {\n  white-space: nowrap;\n  font-size: 18rpx;\n  font-weight: 600;\n  letter-spacing: .2rpx;\n  line-height: 1.2;\n  color: #8A8A93;\n}"
  },
  {
    "file": "miniprogram/pages/test-detail/test-detail.wxss",
    "old": "font-size: 54rpx; font-weight: 800; line-height: 1.24;",
    "new": "font-size: 54rpx; font-weight: 800; line-height: 1.34;"
  },
  {
    "file": "miniprogram/pages/interests/interests.wxss",
    "old": ".big { padding: 0 40rpx; margin-top: 48rpx; font-size: 46rpx; font-weight: 800; line-height: 1.24; color: var(--text); }",
    "new": ".big { padding: 0 40rpx; margin-top: 48rpx; font-size: 46rpx; font-weight: 800; line-height: 1.34; color: var(--text); }"
  },
  {
    "file": "miniprogram/pages/post-publish/post-publish.wxss",
    "old": ".navbar .ttl { font-size: 30rpx; font-weight: 800; color: var(--text); }",
    "new": ".navbar .ttl { font-size: 30rpx; font-weight: 800; line-height: 1.3; color: var(--text); }"
  },
  {
    "file": "miniprogram/data/content.js",
    "old": "sub: '30 道生活场景题 · 约 3 分钟 · 14 种人格',",
    "new": "sub: '30 道题 · 约 3 分钟 · 14 种人格',"
  },
  {
    "file": "miniprogram/app.wxss",
    "old": ".t3, .tt2, .ct, .tg-a, .tt1, .ttl, .rc-n, .qt, .h-n, .big {",
    "new": ".t3, .tt2, .ct, .tg-a, .tt1, .ttl, .rc-n, .qt, .h-n, .big, .tc-a { "
  }
];
