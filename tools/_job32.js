module.exports = [
  {
    file: 'miniprogram/pages/community/community.wxss',
    old: `.nm2 { font-size: 20rpx; color: var(--text-2); max-width: 120rpx; overflow: hidden; white-space: nowrap; }
.mb { font-size: 17rpx; font-weight: 700; color: var(--on-ink); background: var(--ink);
  padding: 2rpx 10rpx; border-radius: 8rpx; }
.lk3 { margin-left: auto; font-size: 20rpx; color: var(--text-3); }`,
    new: `.nm2 { font-size: 20rpx; color: var(--text-2); max-width: 120rpx; min-width: 0;
  flex: 0 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mb { flex: 0 0 auto; font-size: 17rpx; font-weight: 700; color: var(--on-ink); background: var(--ink);
  padding: 2rpx 10rpx; border-radius: 8rpx; }
.lk3 { margin-left: auto; flex: 0 0 auto; font-size: 20rpx; color: var(--text-3); white-space: nowrap; }`
  }
];