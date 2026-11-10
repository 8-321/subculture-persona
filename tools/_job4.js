module.exports = [
  { file: 'miniprogram/pages/shop-detail/shop-detail.js', old: `    const shots = [p.img, p.img, p.img];`, new: `    const shots = [p.img];` },
  { file: 'miniprogram/pages/shop-detail/shop-detail.wxml', old: `    <view class="pg-no">{{cur + 1}} / {{shots.length}}</view>`, new: `    <view wx:if="{{shots.length > 1}}" class="pg-no">{{cur + 1}} / {{shots.length}}</view>` },
  { file: 'miniprogram/pages/shop-detail/shop-detail.wxml', old: `  <view class="card shopcard">
    <view class="av">{{shopFirst}}</view>
    <view wx:if="{{p.demo}}" class="sample-tag static">示例店铺</view>
    <view class="tx">
      <view class="t">{{p.brand}}</view>
      <view class="d">{{shopDesc}}</view>
      <view wx:if="{{demo}}" class="sample-inline">示例数据</view>
    </view>
    <view class="go" bindtap="onShop">进店看看
      <image src="/images/ic/fwd-{{dark ? 'white' : 'ink'}}.png" mode="aspectFit" />
    </view>
  </view>`, new: `  <view class="card shopcard">
    <view class="av">{{shopFirst}}</view>
    <view class="tx">
      <view class="nrow">
        <text class="t">{{p.brand}}</text>
        <text wx:if="{{p.demo}}" class="sample-tag static">示例店铺</text>
      </view>
      <view class="d">{{shopDesc}}<text wx:if="{{demo}}" class="sample-inline">示例数据</text></view>
    </view>
    <view class="go" bindtap="onShop">进店
      <image src="/images/ic/fwd-{{dark ? 'white' : 'ink'}}.png" mode="aspectFit" />
    </view>
  </view>` },
  { file: 'miniprogram/pages/shop-detail/shop-detail.wxss', old: `.shopcard { display: flex; align-items: center; gap: 20rpx; }`, new: `.shopcard { display: flex; align-items: flex-start; gap: 20rpx; }` },
  { file: 'miniprogram/pages/shop-detail/shop-detail.wxss', old: `.shopcard .tx { flex: 1; min-width: 0; }
.shopcard .tx .t { font-size: 27rpx; font-weight: 800; color: var(--text); }
.shopcard .tx .d { font-size: 20rpx; color: var(--text-3); margin-top: 8rpx; }
.shopcard .go { display: flex; align-items: center; gap: 6rpx; font-size: 23rpx; font-weight: 700; color: var(--text-2); }`, new: `.shopcard .tx { flex: 1; min-width: 0; }
.shopcard .nrow { display: flex; align-items: center; min-width: 0; }
.shopcard .tx .t { font-size: 27rpx; font-weight: 800; color: var(--text); flex: 0 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.shopcard .tx .d { font-size: 20rpx; line-height: 1.55; color: var(--text-3); margin-top: 8rpx; }
.shopcard .go { align-self: center; display: flex; align-items: center; gap: 6rpx; font-size: 23rpx; font-weight: 700; color: var(--text-2); flex: 0 0 auto; }` }
];
