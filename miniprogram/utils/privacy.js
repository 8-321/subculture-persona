// 隐私授权（P0 合规）：2023-09-15 起，调用手机号、相册、剪贴板等接口前必须取得同意。
// 开启 app.json 的 __usePrivacyCheck__ 后，微信会在首次调用相关接口时自动弹官方《用户隐私保护指引》
// 弹层；本模块只负责三件事：判断接口是否可用、调用时挂成功/失败、被拒绝后给出可点开的指引入口。
//
// 用法：Privacy.ensure(function () { 真正要做的事 }, '为什么要这个权限');
// 规则：老基础库（没有 requirePrivacyAuthorize）不拦，避免把用户堵死；被拒时只提示，不重试打扰。

function supported() {
  return typeof wx !== 'undefined' && typeof wx.requirePrivacyAuthorize === 'function';
}

function openContract() {
  if (typeof wx !== 'undefined' && typeof wx.openPrivacyContract === 'function') {
    wx.openPrivacyContract({});
  } else {
    wx.showToast({ title: '请在小程序右上角「···」里查看隐私指引', icon: 'none' });
  }
}

function ensure(action, tip) {
  const run = typeof action === 'function' ? action : function () {};
  if (!supported()) {
    run();
    return;
  }
  wx.requirePrivacyAuthorize({
    success: run,
    fail: () => {
      wx.showModal({
        title: '需要你的同意',
        content: tip || '同意《用户隐私保护指引》后才能使用这个功能',
        confirmText: '查看指引',
        cancelText: '先不用',
        success: (r) => {
          if (r.confirm) openContract();
        }
      });
    }
  });
}

module.exports = { ensure: ensure, supported: supported, openContract: openContract };
