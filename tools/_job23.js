module.exports = [
  {
    file: 'miniprogram/app.wxss',
    old: `.navbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40rpx; height: 88rpx; box-sizing: border-box;
}`,
    new: `.navbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40rpx; height: 88rpx; box-sizing: border-box;
  position: relative;
}`
  },
  {
    file: 'miniprogram/app.wxss',
    old: `.navbar .ttl { font-size: 30rpx; font-weight: 800; letter-spacing: 1rpx; color: var(--text); }`,
    new: `.navbar .ttl { font-size: 30rpx; font-weight: 800; letter-spacing: 1rpx; color: var(--text);
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  max-width: 58%; text-align: center; }`
  },
  {
    file: 'miniprogram/app.wxss',
    old: `.topbar .brand {
  font-size: 30rpx; font-weight: 800; letter-spacing: 2.8rpx; line-height: 1;
  color: var(--text);
}`,
    new: `.topbar .brand {
  font-size: 30rpx; font-weight: 800; letter-spacing: 2.8rpx; line-height: 1.12;
  color: var(--text);
}`
  },
  {
    file: 'miniprogram/app.wxss',
    old: `.topbar .pagename {
  font-size: 21rpx; font-weight: 600; letter-spacing: 5.2rpx; line-height: 1;
  color: var(--text-3); margin-top: 10rpx;
}`,
    new: `.topbar .pagename {
  font-size: 21rpx; font-weight: 600; letter-spacing: 5.2rpx; line-height: 1.12;
  color: var(--text-3); margin-top: 10rpx;
}`
  },
  {
    file: 'miniprogram/pages/result/result.wxss',
    old: `.btn-card { flex: 1; height: 100rpx; border-radius: 8rpx; background: var(--ink); color: var(--on-ink);`,
    new: `.btn-card { flex: 1; height: 100rpx; border-radius: 999rpx; background: var(--ink); color: var(--on-ink);`
  },
  {
    file: 'miniprogram/pages/result/result.wxss',
    old: `.btn-share { width: 100rpx; height: 100rpx; border-radius: 8rpx; background: transparent;`,
    new: `.btn-share { width: 100rpx; height: 100rpx; border-radius: 999rpx; background: transparent;`
  },
  {
    file: 'miniprogram/pages/result/result.wxml',
    old: `    <button class="btn-share" open-type="share" hover-class="press">
      <image src="/images/ic/share-white.png" mode="aspectFit" />
    </button>`,
    new: `    <button class="btn-share" open-type="share" hover-class="press">
      <image src="/images/ic/share-{{dark ? 'white' : 'ink'}}.png" mode="aspectFit" />
    </button>`
  },
  {
    file: 'miniprogram/pages/card/card.wxss',
    old: `.save, .share { flex: 1; height: 92rpx; display: flex; align-items: center; justify-content: center;
  font-size: 27rpx; font-weight: 800; letter-spacing: 1rpx; padding: 0; margin: 0; line-height: 1; }`,
    new: `.save, .share { flex: 1; height: 92rpx; border-radius: 999rpx; display: flex; align-items: center; justify-content: center;
  font-size: 27rpx; font-weight: 800; letter-spacing: 1rpx; padding: 0; margin: 0; line-height: 1; }`
  },
  {
    file: 'miniprogram/pages/legal/legal.wxss',
    old: `.tab { padding: 12rpx 22rpx; font-size: 22rpx; color: var(--text-2); border: 1rpx solid var(--line); }`,
    new: `.tab { padding: 12rpx 24rpx; border-radius: 999rpx; font-size: 22rpx; color: var(--text-2); border: 1rpx solid var(--line); }`
  },
  {
    file: 'miniprogram/pages/legal/legal.wxss',
    old: `.contract { margin-top: 34rpx; padding: 24rpx 24rpx; display: flex; align-items: center; gap: 12rpx;
  background: var(--card); border: 1rpx solid var(--line); font-size: 23rpx; font-weight: 700; }`,
    new: `.contract { margin-top: 34rpx; padding: 24rpx 24rpx; border-radius: 28rpx; display: flex; align-items: center; gap: 12rpx;
  background: var(--card); border: 1rpx solid var(--line); font-size: 23rpx; font-weight: 700; }`
  },
  {
    file: 'miniprogram/pages/drafts/drafts.wxss',
    old: `.list { padding: 22rpx 40rpx 0; }
.d { display: flex; align-items: center; gap: 20rpx; padding: 22rpx 0; border-bottom: 1rpx solid var(--line); }
.cv { width: 132rpx; height: 132rpx; flex: 0 0 132rpx; background: var(--card-2); }
.cv.ph { display: flex; align-items: center; justify-content: center; font-size: 19rpx; color: var(--text-3); }`,
    new: `.list { padding: 22rpx 40rpx 0; }
.d { display: flex; align-items: center; gap: 20rpx; padding: 22rpx 24rpx; margin-bottom: 16rpx;
  background: var(--card); border: 1rpx solid var(--line); border-radius: 32rpx; box-shadow: var(--shadow-card); }
.cv { width: 132rpx; height: 132rpx; flex: 0 0 132rpx; border-radius: 24rpx; overflow: hidden; background: var(--card-2); }
.cv.ph { display: flex; align-items: center; justify-content: center; border: 1rpx dashed var(--line-2);
  font-size: 21rpx; font-weight: 700; letter-spacing: 1rpx; color: var(--text-3); }`
  },
  {
    file: 'miniprogram/data/content.js',
    old: `  { k: 'default', n: '编辑推荐', d: '按编辑顺序展示，不按销量' },`,
    new: `  { k: 'default', n: '默认推荐', d: '按默认顺序展示，不按销量' },`
  },
  {
    file: 'miniprogram/utils/filter.js',
    old: `/** 排序（三种：编辑推荐 / 价格升 / 价格降） */`,
    new: `/** 排序（三种：默认推荐 / 价格升 / 价格降） */`
  },
  {
    file: 'miniprogram/pages/interests/interests.wxml',
    old: `    <view class="rt">第 3 / 5 步</view>`,
    new: `    <view class="rt">最后一步</view>`
  }
];