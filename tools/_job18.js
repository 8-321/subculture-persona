module.exports = [
  { file: 'miniprogram/data/content.js', old: `author: '第二文化编辑部'`, new: `author: '第二文化'`, once: false },
  { file: 'miniprogram/pages/post-detail/post-detail.wxml', old: `      <image class="av" src="{{item.shopImg || item.img}}" mode="aspectFill" />`, new: `      <image wx:if="{{!isArticle}}" class="av" src="{{item.shopImg || item.img}}" mode="aspectFill" />` },
  { file: 'miniprogram/pages/shop-detail/shop-detail.wxss', old: `.shopcard .go { align-self: center;`, new: `.shopcard .sample-inline { margin-left: 8rpx; padding: 0; background: transparent; font-weight: 400; }
.shopcard .go { align-self: center;` }
];
