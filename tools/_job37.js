module.exports = [
  {
    file: 'miniprogram/pages/shop-detail/shop-detail.wxml',
    old: `      <text class="sold">{{soldText}}</text>`,
    new: `      <text wx:if="{{soldText}}" class="sold">{{soldText}}</text>`
  }
];