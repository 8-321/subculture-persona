const UI = require('../../utils/ui.js');
const Privacy = require('../../utils/privacy.js');
const Nav = require('../../utils/nav.js');
const Site = require('../../utils/site.js');

const MAIL = Site.mail;

Page({
  onShow() {
    Nav.apply(this);
    UI.sync(this, {});
  },

  data: {
    mail: MAIL,
    hasMail: !!MAIL,
    dark: false,
    reduce: false,
    sbh: 20,
    steps: [
      { n: '01', t: '聊清楚问题', d: '先确认你要影响谁、想验证什么，不急着做物料。' },
      { n: '02', t: '共创题目与叙事', d: '把品牌问题翻译成用户愿意答的题，不写广告语。' },
      { n: '03', t: '上线与内容分发', d: '测试、结果页、人格名片与内容同步上线。' },
      { n: '04', t: '复盘数据与下一期', d: '看答题完成率、分享率与内容互动，不编造数据。' }
    ],
    offers: [
      {
        no: '01',
        t: '品牌命题测试',
        d: '把品牌真正关心的问题，做成一套可传播的人格测试。',
        items: ['题目共创与人格映射', '结果页品牌位与匹配单品', '匿名答题数据报告', '一套可复用的分享名片'],
        quote: '3.8 万起 / 期',
        time: '4-6 周'
      },
      {
        no: '02',
        t: '城市同好局',
        d: '把线上人格标签，变成一次真实的线下见面。',
        items: ['主题策划与场地联名', '报名与签到页', '现场内容拍摄', '活动后内容沉淀'],
        quote: '按场报价',
        time: '6-8 周'
      },
      {
        no: '03',
        t: '商家年册',
        d: '给独立小店一个能被搜到、被读懂的档案页。',
        items: ['店铺档案与主理人访谈', '每季 2 次内容共创', '选物位与人格标签关联', '线索转交，不做交易担保'],
        quote: '1980 / 年',
        time: '随时开始'
      }
    ]
  },

  onBack() { Nav.back(); },

  onCopyMail() {
    if (!MAIL) { UI.toast('联系邮箱上线前公布'); return; }
    Privacy.ensure(() => {
      wx.setClipboardData({
        data: MAIL,
        success: () => { UI.vibrate('light'); UI.toast('邮箱已复制'); }
      });
    }, '复制邮箱需要读取剪贴板权限');
  },

  onCopyKit() {
    const text = [
      '【第二文化 · 合作咨询】',
      '品牌 / 场地：',
      '想合作的方向：品牌命题测试 / 城市同好局 / 商家年册',
      '希望上线时间：',
      '联系方式：',
      '',
      '补充：可附上品牌介绍、预算区间与参考案例。'
    ].join('\n');
    Privacy.ensure(() => {
      wx.setClipboardData({
        data: text,
        success: () => { UI.vibrate('light'); UI.toast('咨询模板已复制'); }
      });
    }, '复制咨询模板需要读取剪贴板权限');
  }
});