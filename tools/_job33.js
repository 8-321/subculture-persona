module.exports = [
  {
    file: 'miniprogram/app.wxss',
    old: `.topbar .brand, .topbar .pagename { overflow: visible; text-overflow: clip; }`,
    new: `.topbar .brand, .topbar .pagename { overflow: visible; text-overflow: clip; }
.cat { overflow: visible; text-overflow: clip; }`
  },
  {
    file: 'miniprogram/pages/community/community.wxml',
    old: `  <view class="demo-note" wx:if="{{hasDemo}}">当前为示例内容：店铺与互动数据为演示数据，正式版替换为真实发布。</view>`,
    new: `  <view class="demo-note" wx:if="{{hasDemo}}">
    <view>示例内容：店铺与互动数据为演示数据。</view>
    <view>正式版替换为真实发布。</view>
  </view>`
  }
];