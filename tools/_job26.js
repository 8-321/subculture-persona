module.exports = [
  {
    file: 'miniprogram/app.wxss',
    old: `.navbar .ttl { font-size: 30rpx; font-weight: 800; letter-spacing: 1rpx; color: var(--text);
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  max-width: 58%; text-align: center; }`,
    new: `.navbar .ttl { font-size: 30rpx; font-weight: 800; letter-spacing: 1rpx; color: var(--text);
  flex: 1 1 auto; min-width: 0; text-align: center; }`
  }
];