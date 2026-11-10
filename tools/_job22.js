module.exports = [
  {
    file: 'miniprogram/pages/home/home.wxml',
    old: `  <!-- 推荐品类 -->
  <view class="recsect">
    <view class="st">推荐品类</view>
    <view class="lnk" bindtap="onCategory">
      查看全部
      <image class="lnk-ic" src="{{dark ? '/images/ic/fwd-white.png' : '/images/ic/fwd-ink.png'}}" mode="aspectFit" />
    </view>
  </view>
  <scroll-view class="recrail" scroll-x enable-flex show-scrollbar="{{false}}">
    <view
      class="rc m-pop m-st"
      style="animation-delay:{{item._d}}ms"
      wx:for="{{recCatsView}}"
      wx:key="id"
      bindtap="onType"
      data-code="{{item.code}}"
    >
      <view class="rc-im m-tilt m-glare" hover-class="press">
        <image src="{{item.img}}" mode="aspectFill" />
        <view class="rk">{{item.no}}</view>
      </view>
      <view class="rc-n">{{item.name}}</view>
    </view>
  </scroll-view>`,
    new: `  <!-- 推荐品类：四格一框，整块有边，避免横滑把第四格切掉 -->
  <view class="recblock">
    <view class="recsect">
      <view class="st">推荐品类</view>
      <view class="lnk" bindtap="onCategory">
        查看全部
        <image class="lnk-ic" src="{{dark ? '/images/ic/fwd-white.png' : '/images/ic/fwd-ink.png'}}" mode="aspectFit" />
      </view>
    </view>
    <view class="recgrid">
      <view
        class="rc m-pop m-st"
        style="animation-delay:{{item._d}}ms"
        wx:for="{{recCatsView}}"
        wx:key="id"
        bindtap="onType"
        data-code="{{item.code}}"
        hover-class="rc-press"
      >
        <view class="rc-im m-glare">
          <image src="{{item.img}}" mode="aspectFill" />
          <view class="rk">{{item.no}}</view>
        </view>
        <view class="rc-n">{{item.name}}</view>
      </view>
    </view>
  </view>`
  },
  {
    file: 'miniprogram/pages/home/home.wxml',
    old: `    <scroll-view class="rail sm" scroll-x enable-flex show-scrollbar="{{false}}">`,
    new: `    <view class="railbox sm">
    <scroll-view class="rail sm" scroll-x enable-flex show-scrollbar="{{false}}">`
  },
  {
    file: 'miniprogram/pages/home/home.wxml',
    old: `        <view class="rg-n">{{item.title}}</view>
      </view>
    </scroll-view>
  </view>`,
    new: `        <view class="rg-n">{{item.title}}</view>
      </view>
    </scroll-view>
    </view>
  </view>`
  },
  {
    file: 'miniprogram/pages/home/home.wxml',
    old: `    <scroll-view class="rail" scroll-x enable-flex show-scrollbar="{{false}}">`,
    new: `    <view class="railbox">
    <scroll-view class="rail" scroll-x enable-flex show-scrollbar="{{false}}">`
  },
  {
    file: 'miniprogram/pages/home/home.wxml',
    old: `        <view class="tg-b">{{item.qcount}} 题 · {{item.minutes}} 分钟</view>
      </view>
    </scroll-view>
  </view>`,
    new: `        <view class="tg-b">{{item.qcount}} 题 · {{item.minutes}} 分钟</view>
      </view>
    </scroll-view>
    </view>
  </view>`
  },
  {
    file: 'miniprogram/pages/home/home.wxss',
    old: `.recsect { display: flex; align-items: center; justify-content: space-between; padding: 0 40rpx; margin-top: 30rpx; }
.recsect .st { font-size: 29rpx; font-weight: 800; letter-spacing: .8rpx; }
.recsect .lnk { display: flex; align-items: center; gap: 6rpx; font-size: 23rpx; font-weight: 700; color: var(--text-2); }
.lnk-ic { width: 24rpx; height: 24rpx; }
.recrail { margin-top: 20rpx; padding: 0 40rpx 12rpx; white-space: nowrap; }
.rc {
  display: inline-block; width: 196rpx; margin-right: 20rpx; vertical-align: top;
  padding: 12rpx 12rpx 10rpx; box-sizing: border-box;
  background: var(--card); border: 1rpx solid var(--line-2); border-radius: 30rpx;
  box-shadow: 0 6rpx 22rpx rgba(17,17,20,.05);
}
.rc-im { position: relative; width: 100%; height: 150rpx; border-radius: 22rpx; overflow: hidden; background: var(--card-2); }
.rc-im image { width: 100%; height: 100%; }
.rk { position: absolute; left: 10rpx; top: 10rpx; height: 30rpx; min-width: 44rpx; padding: 0 10rpx;
  border-radius: 16rpx; background: rgba(17,17,20,.86); color: #FFFFFF;
  font-size: 17rpx; font-weight: 800; letter-spacing: 1rpx;
  display: flex; align-items: center; justify-content: center; }
.rc-n { font-size: 23rpx; font-weight: 700; letter-spacing: .6rpx; margin-top: 12rpx; padding: 0 4rpx; }`,
    new: `/* 推荐品类：整块卡片，2×2 网格 */
.recblock {
  margin: 28rpx 40rpx 0; padding: 26rpx 24rpx 24rpx;
  background: var(--card); border: 1rpx solid var(--line-2);
  border-radius: 40rpx; box-shadow: var(--shadow-card);
}
.recsect { display: flex; align-items: center; justify-content: space-between; padding: 0 4rpx; }
.recsect .st { font-size: 29rpx; font-weight: 800; letter-spacing: .8rpx; }
.recsect .lnk { display: flex; align-items: center; gap: 6rpx; font-size: 23rpx; font-weight: 700; color: var(--text-2); }
.lnk-ic { width: 24rpx; height: 24rpx; }
.recgrid { display: flex; flex-wrap: wrap; justify-content: space-between; margin-top: 6rpx; }
.rc { width: calc(50% - 10rpx); margin-top: 20rpx; }
.rc-press { opacity: .9; }
.rc-im { position: relative; width: 100%; height: 208rpx; border-radius: 26rpx; overflow: hidden; background: var(--card-2); }
.rc-im image { width: 100%; height: 100%; }
.rk { position: absolute; left: 12rpx; top: 12rpx; height: 32rpx; min-width: 46rpx; padding: 0 10rpx;
  border-radius: 16rpx; background: rgba(17,17,20,.86); color: #FFFFFF;
  font-size: 17rpx; font-weight: 800; letter-spacing: 1rpx;
  display: flex; align-items: center; justify-content: center; }
.rc-n { font-size: 25rpx; font-weight: 700; letter-spacing: .6rpx; margin-top: 12rpx; padding: 0 4rpx; }`
  },
  {
    file: 'miniprogram/pages/home/home.wxss',
    old: `.rail { margin: 24rpx -40rpx 0; padding: 0 40rpx 8rpx; white-space: nowrap; }`,
    new: `.railbox { position: relative; margin: 24rpx -40rpx 0; }
.railbox.sm { margin-top: 20rpx; }
.railbox::after {
  content: ''; position: absolute; top: 0; right: 0; bottom: 8rpx; width: 64rpx;
  z-index: 2; pointer-events: none;
  background: linear-gradient(90deg, rgba(0,0,0,0) 0%, var(--bg) 86%);
}
.rail { margin: 0; padding: 0 40rpx 8rpx; white-space: nowrap; }`
  },
  {
    file: 'miniprogram/pages/home/home.wxss',
    old: `.rail.sm { margin-top: 20rpx; }`,
    new: `.rail.sm { margin-top: 0; }`
  }
];