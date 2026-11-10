module.exports = [
  {
    file: 'miniprogram/pages/tests/tests.js',
    old: `      doneText: Stat.count(t.done, '人测过'),
      demo: Stat.on()`,
    new: `      doneText: Stat.count(t.done, '人测过')`
  },
  {
    file: 'miniprogram/pages/tests/tests.wxml',
    old: `        <view wx:if="{{item.demo}}" class="tc-demo">示例</view>`,
    new: ``
  },
  {
    file: 'miniprogram/pages/tests/tests.wxml',
    old: `      <view class="tc-b">{{item.qcount}} 题 · {{item.minutes}} 分钟 · {{item.doneText}}</view>`,
    new: `      <view class="tc-b">{{item.qcount}} 题 · {{item.minutes}} 分钟<text wx:if="{{item.doneText}}"> · {{item.doneText}}</text></view>`
  },
  {
    file: 'miniprogram/pages/test-detail/test-detail.js',
    old: `      doneText: Stat.count(test.done, '人测过'),
      demo: Stat.on(),`,
    new: `      doneText: Stat.count(test.done, '人测过'),`
  },
  {
    file: 'miniprogram/pages/test-detail/test-detail.wxml',
    old: `  <view class="meta">{{test.qcount}} 题 · 约 {{test.minutes}} 分钟 · {{doneText}}<text wx:if="{{demo}}" class="sample-inline">示例数据</text></view>`,
    new: `  <view class="meta">{{test.qcount}} 题 · 约 {{test.minutes}} 分钟<text wx:if="{{doneText}}"> · {{doneText}}</text></view>`
  },
  {
    file: 'miniprogram/pages/shop-detail/shop-detail.js',
    old: `      shopDesc: Stat.shopMeta(shop),
      demo: Stat.on(),`,
    new: `      shopDesc: Stat.shopMeta(shop),`
  },
  {
    file: 'miniprogram/pages/shop-detail/shop-detail.wxml',
    old: `      <view class="d">{{shopDesc}}<text wx:if="{{demo}}" class="sample-inline">示例数据</text></view>`,
    new: `      <view class="d">{{shopDesc}}</view>`
  },
  {
    file: 'miniprogram/pages/shop-home/shop-home.js',
    old: `      shopDesc: Stat.shopMeta(shop),
    demo: Stat.on(),`,
    new: `      shopDesc: Stat.shopMeta(shop),`
  },
  {
    file: 'miniprogram/pages/shop-home/shop-home.wxml',
    old: `      <view wx:if="{{demo}}" class="id-demo">示例数据 · 正式版自动隐藏</view>`,
    new: ``
  },
  {
    file: 'miniprogram/pages/post-detail/post-detail.wxml',
    old: `    <view class="stat">
      <image src="/images/ic/eye-{{dark ? 'white' : 'ink'}}.png" mode="aspectFit" />
      {{viewsText}}
    </view>`,
    new: `    <view wx:if="{{viewsText}}" class="stat">
      <image src="/images/ic/eye-{{dark ? 'white' : 'ink'}}.png" mode="aspectFit" />
      {{viewsText}}
    </view>`
  },
  {
    file: 'miniprogram/pages/post-detail/post-detail.wxml',
    old: `        <image src="{{faved ? '/images/ic/heart-fill-ink.png' : '/images/ic/heart-ink.png'}}" mode="aspectFit" />
        收藏 {{favText}}`,
    new: `        <image src="{{faved ? '/images/ic/heart-fill-ink.png' : '/images/ic/heart-ink.png'}}" mode="aspectFit" />
        收藏<text wx:if="{{favText}}"> {{favText}}</text>`
  },
  {
    file: 'miniprogram/pages/post-detail/post-detail.wxml',
    old: `        <image src="{{liked ? '/images/ic/heart-fill-ink.png' : '/images/ic/heart-ink.png'}}" mode="aspectFit" />
        点赞 {{likeText}}`,
    new: `        <image src="{{liked ? '/images/ic/heart-fill-ink.png' : '/images/ic/heart-ink.png'}}" mode="aspectFit" />
        点赞<text wx:if="{{likeText}}"> {{likeText}}</text>`
  },
  {
    file: 'miniprogram/pages/community/community.wxml',
    old: `            <text class="lk3">{{item.likesText}}</text>`,
    new: `            <text wx:if="{{item.likesText}}" class="lk3">{{item.likesText}}</text>`
  },
  {
    file: 'miniprogram/pages/community/community.wxml',
    old: `            <text class="lk3">{{item.likesText}}</text>`,
    new: `            <text wx:if="{{item.likesText}}" class="lk3">{{item.likesText}}</text>`
  },
  {
    file: 'miniprogram/pages/category/category.wxml',
    old: `            <text class="lk">{{item.likesText}}</text>`,
    new: `            <text wx:if="{{item.likesText}}" class="lk">{{item.likesText}}</text>`
  }
];