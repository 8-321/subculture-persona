module.exports = [
  { file: 'miniprogram/pages/tests/tests.wxml', old: `      <view class="tc-im m-glare">
        <image src="{{item.img}}" mode="aspectFill" />
        <view class="tc-n">{{item.cat}}</view>
      </view>
      <view class="tc-a">{{item.title}}</view>
      <view class="tc-b">{{item.qcount}} 题 · {{item.minutes}} 分钟 · {{item.doneText}}<text wx:if="{{item.demo}}" class="sample-inline">示例</text></view>`, new: `      <view class="tc-im m-glare">
        <image src="{{item.img}}" mode="aspectFill" />
        <view class="tc-n">{{item.cat}}</view>
        <view wx:if="{{item.demo}}" class="tc-demo">示例</view>
      </view>
      <view class="tc-a">{{item.title}}</view>
      <view class="tc-b">{{item.qcount}} 题 · {{item.minutes}} 分钟 · {{item.doneText}}</view>` },
  { file: 'miniprogram/pages/tests/tests.wxss', old: `.tc-b { font-size: 20rpx; color: var(--text-3); margin-top: 8rpx; }`, new: `.tc-b { font-size: 20rpx; color: var(--text-3); margin-top: 8rpx; }
.tc-demo { position: absolute; right: 14rpx; top: 14rpx; height: 34rpx; padding: 0 14rpx; border-radius: 17rpx;
  background: rgba(17,17,20,.62); color: #FFFFFF; font-size: 18rpx; font-weight: 700;
  display: flex; align-items: center; }` },
  { file: 'miniprogram/pages/tests/tests.wxml', old: `    <view class="t">全部测评</view>`, new: `    <view class="t">更多测评</view>` },
  { file: 'miniprogram/pages/community/community.js', old: `      likesText: Stat.count(p.likes, ''),`, new: `      likesText: Stat.count(p.likes, ' 赞'),` },
  { file: 'miniprogram/pages/community/community.wxml', old: `  <view class="demo-note" wx:if="{{hasDemo}}">当前为示例内容：店铺与互动数据均为虚构，用于展示排版；正式版替换为真实用户发布。</view>`, new: `  <view class="demo-note" wx:if="{{hasDemo}}">当前为示例内容：店铺与互动数据为演示数据，正式版替换为真实发布。</view>` }
];
