// 全站唯一的对外信息源：改这里，不要在页面里散落邮箱 / 版本号 / 主体名。
// 上线前必须跑 node tools/launch_check.js：占位邮箱、空隐私链接、空主体名都会拦住上传。
const SITE = {
  brand: '第二文化',
  version: '1.1.1',
  mail: '',
  mailIsPlaceholder: true,
  privacyUrl: '',
  operator: '',
  icp: ''
};

module.exports = SITE;