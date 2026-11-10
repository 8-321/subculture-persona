const UI = require('../../utils/ui.js');
const Store = require('../../utils/store.js');
const Nav = require('../../utils/nav.js');
const Q = require('../../utils/qualify.js');
const Privacy = require('../../utils/privacy.js');

const ALL_CATS = ['洛丽塔', '哥特', '手作', '配饰', '鞋包', '店铺'];
const TYPES = [
  { k: 'person', n: '个人', d: '只发内容，不卖货' },
  { k: 'biz', n: '个体户', d: '需营业执照' },
  { k: 'corp', n: '企业', d: '需营业执照' }
];

Page({
  onShow() {
    Nav.apply(this);
    UI.sync(this);
  },

  data: {
    name: '',
    contact: '',
    intro: '',
    cats: [],
    allCats: ALL_CATS,
    types: TYPES,
    type: 'biz',
    typeView: [],
    credit: '',
    creditErr: '',
    contactErr: '',
    canSubmit: false,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad() {
    UI.sync(this, {
      catView: ALL_CATS.map((c) => ({ name: c, on: false })),
      typeView: TYPES.map((t) => ({ k: t.k, n: t.n, d: t.d, on: t.k === 'biz' }))
    });
  },

  // 提交前的硬门槛：名称、品类、联系方式；非个人主体另需合规的执照号
  check() {
    const d = this.data;
    const needCredit = d.type !== 'person';
    const ok = d.name.trim().length > 0 &&
      d.cats.length > 0 &&
      Q.contact(d.contact).ok &&
      (!needCredit || Q.creditCode(d.credit).ok);
    if (ok !== d.canSubmit) this.setData({ canSubmit: ok });
    return ok;
  },

  onName(e) { this.setData({ name: e.detail.value }, () => this.check()); },
  onIntro(e) { this.setData({ intro: e.detail.value }); },

  onContact(e) {
    const v = e.detail.value;
    const r = Q.contact(v);
    this.setData({ contact: v, contactErr: v && !r.ok ? r.msg : '' }, () => this.check());
  },

  // 执照号：边输边校验，错在哪一位直接说清楚
  onCredit(e) {
    const v = e.detail.value;
    const r = Q.creditCode(v);
    this.setData({ credit: v, creditErr: v && !r.ok ? r.msg : '' }, () => this.check());
  },

  onType(e) {
    const k = e.currentTarget.dataset.k;
    UI.vibrate('light');
    this.setData({
      type: k,
      typeView: TYPES.map((t) => ({ k: t.k, n: t.n, d: t.d, on: t.k === k })),
      creditErr: ''
    }, () => this.check());
  },

  // 选中态在 JS 侧预计算（WXML 不支持 indexOf）
  buildView(cats) {
    return ALL_CATS.map((c) => ({ name: c, on: cats.indexOf(c) >= 0 }));
  },

  onCat(e) {
    const c = e.currentTarget.dataset.c;
    const cats = this.data.cats.slice();
    const i = cats.indexOf(c);
    if (i >= 0) cats.splice(i, 1); else cats.push(c);
    UI.vibrate('light');
    this.setData({ cats: cats, catView: this.buildView(cats) }, () => this.check());
  },

  onSubmit() {
    const d = this.data;
    if (!d.name.trim()) { UI.toast('先填店铺名称'); return; }
    if (!d.cats.length) { UI.toast('至少选一个主营品类'); return; }
    const c = Q.contact(d.contact);
    if (!c.ok) { UI.toast(c.msg); return; }
    const isPerson = d.type === 'person';
    if (!isPerson) {
      const r = Q.creditCode(d.credit);
      if (!r.ok) { UI.toast(r.msg); return; }
    }
    Store.updateUser({
      merchantStatus: 'local',
      isMerchant: false,
      merchantApply: {
        name: d.name.trim(),
        type: d.type,
        cats: d.cats,
        contact: d.contact.trim(),
        credit: isPerson ? '' : d.credit.trim().toUpperCase(),
        intro: d.intro.trim(),
        ts: Date.now()
      }
    });
    app.globalData.user = Store.getUser();
    app.track('merchant_submit', { type: d.type, cats: d.cats.length });
    UI.vibrate('medium');
    const text = this.applyText();
    wx.showModal({
      title: '登记信息已存在本机',
      content: '当前没有在线审核后台。可复制这份资料发给运营者，进入人工招募名单；不会自动通过。',
      confirmText: '复制资料',
      cancelText: '知道了',
      success: (res) => {
        if (res.confirm) this.copy(text);
        setTimeout(() => Nav.back(), 700);
      }
    });
  },

  applyText() {
    const d = this.data;
    return [
      '【商家登记】',
      '店铺：' + d.name.trim(),
      '主体：' + (d.type === 'person' ? '个人' : (d.type === 'biz' ? '个体工商户' : '企业')),
      '品类：' + d.cats.join('、'),
      '联系方式：' + d.contact.trim(),
      d.type === 'person' ? '' : '信用代码：' + d.credit.trim().toUpperCase(),
      d.intro.trim() ? '简介：' + d.intro.trim() : ''
    ].filter(Boolean).join('\n');
  },

  copy(text) {
    Privacy.ensure(() => {
      wx.setClipboardData({ data: text, success: () => UI.toast('资料已复制') });
    }, '复制登记信息需要读取剪贴板权限');
  },

  onBack() { UI.back(); }
});
