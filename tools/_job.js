module.exports = [
  { file: 'miniprogram/pages/my-report/my-report.wxml', old: `  <view class="card sum">`, new: `  <view wx:if="{{list.length > 0}}" class="card sum">` }
];
