const UI = require('../../utils/ui.js');
const Store = require('../../utils/store.js');
const Privacy = require('../../utils/privacy.js');
const Sound = require('../../utils/sound.js');
const Nav = require('../../utils/nav.js');
const TM = require('../../utils/typemedia.js');

const W = 750;
const H = 1180;

function wrap(ctx, text, maxW) {
  const out = [];
  let line = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ctx.measureText(line + ch).width > maxW && line) {
      out.push(line);
      line = ch;
    } else {
      line += ch;
    }
  }
  if (line) out.push(line);
  return out;
}

Page({
  onShow() {
    Nav.apply(this);
    UI.sync(this, {});
  },

  data: {
    report: null,
    serial: '01',
    tempFile: '',
    saving: false,
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad(options) {
    const rid = options.rid || '';
    let report = rid ? Store.Reports.get(rid) : null;
    if (!report) report = getApp().globalData.lastReport;
    if (!report) {
      wx.showToast({ title: '报告已失效', icon: 'none' });
      setTimeout(() => Nav.tab('/pages/home/home'), 1200);
      return;
    }
    report.img = TM.img(report.type);
    UI.sync(this, { report: report, serial: report.serial || TM.serial(report.type) });
  },

  onReady() {
    if (!this.data.report) return;
    // 等首帧布局完成再取 canvas 节点
    setTimeout(() => this.draw(), 60);
  },

  draw() {
    const q = wx.createSelectorQuery().in(this);
    q.select('#card').fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) return;
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      let dpr = 2;
      try { dpr = wx.getSystemInfoSync().pixelRatio || 2; } catch (e) { dpr = 2; }
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      this.paint(ctx, canvas);
    });
  },

  paint(ctx, canvas) {
    const r = this.data.report;
    const t = r.type;
    const dims = r.dimList || [];

    ctx.fillStyle = '#F2EFE9';
    ctx.fillRect(0, 0, W, H);

    // 顶部：品牌与档案号
    ctx.fillStyle = '#141418';
    ctx.font = '700 22px "PingFang SC", sans-serif';
    ctx.fillText('第 二 文 化', 56, 72);
    ctx.font = '400 20px "PingFang SC", sans-serif';
    ctx.fillStyle = '#6E6E76';
    ctx.textAlign = 'right';
    ctx.fillText('人格档案 ' + this.data.serial + ' / 14', W - 56, 72);
    ctx.textAlign = 'left';

    ctx.strokeStyle = 'rgba(20,20,24,.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(56, 102);
    ctx.lineTo(W - 56, 102);
    ctx.stroke();

    // 人格名
    ctx.fillStyle = '#141418';
    ctx.font = '700 104px "Songti SC", "STSong", serif';
    ctx.fillText(t.cn, 52, 248);

    ctx.font = '400 26px "PingFang SC", sans-serif';
    ctx.fillStyle = '#3E3E46';
    ctx.fillText(t.nickname + ' · ' + t.symbol, 58, 296);

    // 判词
    ctx.font = '400 31px "Songti SC", "STSong", serif';
    ctx.fillStyle = '#141418';
    const ql = wrap(ctx, '「' + r.quote + '」', W - 112);
    ql.forEach((line, i) => ctx.fillText(line, 56, 372 + i * 50));

    // 标签
    let tx = 56;
    ctx.font = '500 20px "PingFang SC", sans-serif';
    (r.tags || []).forEach((tag) => {
      const tw = ctx.measureText(tag).width + 28;
      if (tx + tw > W - 56) return;
      ctx.strokeStyle = 'rgba(20,20,24,.24)';
      ctx.strokeRect(tx, 350 + ql.length * 50 + 8, tw, 38);
      ctx.fillStyle = '#141418';
      ctx.fillText(tag, tx + 14, 350 + ql.length * 50 + 33);
      tx += tw + 12;
    });

    // 四维
    const baseY = 610;
    ctx.font = '700 20px "PingFang SC", sans-serif';
    ctx.fillStyle = '#6E6E76';
    ctx.fillText('四 个 维 度', 56, baseY - 40);
    dims.forEach((d, i) => {
      const y = baseY + i * 62;
      ctx.fillStyle = '#141418';
      ctx.font = '500 22px "PingFang SC", sans-serif';
      ctx.fillText(d.name, 56, y);
      ctx.textAlign = 'right';
      ctx.font = '700 22px "PingFang SC", sans-serif';
      ctx.fillText(String(d.value), W - 56, y);
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(20,20,24,.12)';
      ctx.fillRect(56, y + 14, W - 112, 4);
      ctx.fillStyle = '#141418';
      ctx.fillRect(56, y + 14, (W - 112) * d.value / 100, 4);
    });

    // 结论
    ctx.fillStyle = '#6E6E76';
    ctx.font = '400 21px "PingFang SC", sans-serif';
    const cl = wrap(ctx, t.tagline, W - 112);
    cl.forEach((line, i) => ctx.fillText(line, 56, 858 + i * 34));

    // 底部黑块
    ctx.fillStyle = '#141418';
    ctx.fillRect(0, 940, W, H - 940);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 34px "Songti SC", "STSong", serif';
    ctx.fillText('你像哪一种？', 56, 1012);
    ctx.font = '400 22px "PingFang SC", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.72)';
    ctx.fillText('微信搜索「第二文化」 · 14 型亚文化人格档案', 56, 1056);
    ctx.fillStyle = 'rgba(255,255,255,.4)';
    ctx.font = '400 19px "PingFang SC", sans-serif';
    ctx.fillText('结果仅供兴趣参考，不是心理诊断', 56, 1112);

    this._canvas = canvas;
    this.toTemp(canvas);
  },

  toTemp(canvas) {
    wx.canvasToTempFilePath({
      canvas: canvas,
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
      destWidth: canvas.width,
      destHeight: canvas.height,
      fileType: 'png',
      success: (res) => { this.setData({ tempFile: res.tempFilePath }); },
      fail: () => { /* 预览失败不阻塞保存 */ }
    }, this);
  },

  onBack() { Nav.back(); },

  onSave() {
    if (this.data.saving) return;
    const canvas = this._canvas;
    if (!canvas) { UI.toast('名片还在生成'); return; }
    this.setData({ saving: true });
    const self = this;
    Privacy.ensure(() => {
      wx.canvasToTempFilePath({
        canvas: canvas,
        width: canvas.width,
        height: canvas.height,
        destWidth: canvas.width,
        destHeight: canvas.height,
        fileType: 'png',
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              Sound.pop();
              UI.vibrate('medium');
              UI.toast('已保存到相册');
              self.setData({ saving: false });
              getApp().track('card_save', { type: self.data.report.type.code });
            },
            fail: (err) => {
              self.setData({ saving: false });
              if (String(err.errMsg || '').indexOf('auth') >= 0 || String(err.errMsg || '').indexOf('deny') >= 0) {
                wx.showModal({
                  title: '需要相册权限',
                  content: '去设置里打开「保存到相册」，就能保存这张名片。',
                  confirmText: '去设置',
                  success: (r) => { if (r.confirm) wx.openSetting(); }
                });
              } else {
                UI.toast('保存失败，请重试');
              }
            }
          });
        },
        fail: () => { self.setData({ saving: false }); UI.toast('生成失败，请重试'); }
      }, this);
    }, '保存名片需要访问你的相册');
  },

  onShareAppMessage() {
    const r = this.data.report;
    if (!r) return { title: '第二文化', path: '/pages/home/home' };
    return {
      title: '我是' + r.type.nickname + '，你像哪一种？',
      path: '/pages/type/type?code=' + TM.codeOf(r.type) + '&from=card',
      imageUrl: this.data.tempFile || r.img
    };
  }
});