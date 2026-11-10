module.exports = [
  {
    file: 'miniprogram/app.wxss',
    old: `.navbar.capr, .topbar.capr { padding-right: 200rpx; box-sizing: border-box; }`,
    new: `.navbar.capr, .topbar.capr { padding-right: 200rpx; box-sizing: border-box; }

/* 品牌字不截断：只有两三个字，纵向留出字形余量，避免真机字体度量把底部切掉 */
.topbar .brand, .topbar .pagename { overflow: visible; text-overflow: clip; }`
  }
];