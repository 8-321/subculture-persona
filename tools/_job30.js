module.exports = [
  {
    file: 'miniprogram/pages/shop/shop.wxss',
    old: `.cats { display: flex; gap: 18rpx; padding: 0 40rpx 4rpx; white-space: nowrap; }`,
    new: `.cats { display: flex; gap: 14rpx; padding: 0 32rpx 4rpx; white-space: nowrap; }`
  },
  {
    file: 'miniprogram/pages/shop/shop.wxss',
    old: `  height: 68rpx; padding: 0 30rpx; border-radius: 999rpx;`,
    new: `  height: 68rpx; padding: 0 26rpx; border-radius: 999rpx;`
  },
  {
    file: 'miniprogram/pages/shop/shop.wxml',
    old: `  <!-- 已选条件：在列表页就能一个个删掉，不用再进筛选页 -->`,
    new: `  <view class="demo-note">示例商品：图片、品牌与价格为演示排版，当前版本不提供下单与支付。</view>

  <!-- 已选条件：在列表页就能一个个删掉，不用再进筛选页 -->`
  }
];