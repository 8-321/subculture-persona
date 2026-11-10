module.exports = [
  { file: 'miniprogram/data/content.js', old: `img: P + 'know-2.jpg', qcount: 9`, new: `img: P + 'p-gothic.jpg', qcount: 9` },
  { file: 'miniprogram/data/content.js', old: `img: P + 'home-knowledge.jpg', qcount: 10`, new: `img: P + 'p-skate.jpg', qcount: 10` },
  { file: 'miniprogram/data/content.js', old: `img: P + 'know-3.jpg', qcount: 8`, new: `img: P + 'p-vaporwave.jpg', qcount: 8` },
  { file: 'miniprogram/data/content.js', old: `img: P + 'test-hero.jpg', qcount: 8`, new: `img: P + 'p-jk.jpg', qcount: 8` },

  { file: 'miniprogram/pages/settings/settings.wxml', old: `    <!-- 数据真实性：示例数字只在开发/体验版出现，正式版自动改为后台实测（V3.0 §4） -->
    <view class="st sub">
      <view class="t2">数据来源：{{statNote}}</view>
    </view>`, new: `    <!-- 数据真实性：示例数字只在开发/体验版出现，正式版自动改为后台实测（V3.0 §4） -->
    <view class="st sub split">
      <view class="t2">数据说明：{{statNote}}</view>
    </view>` },
  { file: 'miniprogram/pages/settings/settings.wxss', old: `.st.sub {`, new: `.st.sub.split { border-top: 1rpx solid var(--line); margin-top: 4rpx; padding-top: 20rpx; }
.st.sub {` },

  { file: 'miniprogram/pages/my-report/my-report.wxss', old: `.empty { padding: 140rpx 40rpx; text-align: center; }`, new: `.empty { padding: 140rpx 40rpx 48rpx; text-align: center; }` },

  { file: 'miniprogram/pages/category/category.wxss', old: `.cc .ct { font-size: 24rpx; font-weight: 700; margin-top: 14rpx; line-height: 1.34; color: var(--text); }`, new: `.cc .ct { font-size: 24rpx; font-weight: 700; margin-top: 14rpx; line-height: 1.34; color: var(--text);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }` }
];
