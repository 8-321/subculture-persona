const UI = require('../../utils/ui.js');
const C = require('../../data/content.js');
const Store = require('../../utils/store.js');
const Engine = require('../../utils/engine.js');
const Sound = require('../../utils/sound.js');
const Nav = require('../../utils/nav.js');
const TM = require('../../utils/typemedia.js');

let timer = null;
let autoTimer = null;

Page({
  onShow() {
    Nav.apply(this);
  },

  data: {
    testId: 'main',
    questions: [],
    total: 0,
    index: 0,
    q: null,
    picked: '',
    answers: [],
    percent: 0,
    timeText: '已答 0 分 00 秒',
    swapCls: 'm-slide-r',
    dark: false,
    reduce: false,
    sbh: 20
  },

  onLoad(options) {
    const testId = options.id || 'main';
    const test = C.tests.filter((t) => t.id === testId)[0] || C.tests[0];
    const raw = Engine.getQuestions(test.id, test.subset);
    const questions = raw.map((q) => ({
      id: q.id,
      topic: q.topic,
      text: q.text,
      options: q.options.map((o) => ({
        key: o.key,
        title: o.title,
        sub: o.sub,
        img: o.img ? '/images/ui/' + o.img : ''
      }))
    }));

    const saved = Store.Progress.get(test.id);
    const answers = (saved && saved.answers) ? saved.answers : [];
    let index = (saved && typeof saved.index === 'number') ? Math.min(saved.index, questions.length - 1) : 0;
    // 续答落在「第一道还没答的题」：上次可能选完了但没来得及翻页
    const answered = {};
    answers.forEach((a) => { answered[a.qid] = 1; });
    while (index < questions.length - 1 && answered[questions[index].id]) index++;
    const seconds = (saved && saved.seconds) ? saved.seconds : 0;

    UI.sync(this, {
      testId: test.id,
      questions: questions,
      total: questions.length,
      answers: answers
    });
    this._seconds = seconds;
    this.render(index);
    this.startTimer();
    getApp().track('quiz_start', { id: test.id, resumed: answers.length > 0 });
  },

  onUnload() {
    if (timer) clearInterval(timer);
    if (autoTimer) clearTimeout(autoTimer);
  },

  render(index) {
    const q = this.data.questions[index];
    const prev = (this.data.answers || []).filter((a) => a.qid === q.id)[0];
    // 题干整块侧向推入重播（两个动画名来回切，CSS 才会重新播）
    const swapCls = index % 2 === 0 ? 'm-slide-r' : 'm-slide-r-b';
    this.setData({
      index: index,
      q: q,
      picked: prev ? prev.key : '',
      swapCls: swapCls,
      percent: Math.round(((index + 1) / this.data.total) * 100)
    });
    this.saveProgress();
  },

  saveProgress() {
    Store.Progress.save(this.data.testId, {
      index: this.data.index,
      answers: this.data.answers,
      seconds: this._seconds || 0
    });
  },

  startTimer() {
    if (timer) clearInterval(timer);
    const self = this;
    timer = setInterval(() => {
      self._seconds = (self._seconds || 0) + 1;
      const s = self._seconds;
      const m = Math.floor(s / 60);
      const sec = s % 60;
      self.setData({ timeText: '已答 ' + m + ' 分 ' + (sec < 10 ? '0' + sec : sec) + ' 秒' });
    }, 1000);
  },

  onPick(e) {
    const key = e.currentTarget.dataset.key;
    const q = this.data.q;
    let answers = this.data.answers.filter((a) => a.qid !== q.id);
    answers.push({ qid: q.id, key: key });
    getApp().track('quiz_answer', { id: this.data.testId, index: this.data.index, key: key });
    Sound.tick();          // 码表一声：选中即时反馈
    UI.vibrate('light');
    this.setData({ picked: key, answers: answers }, () => {
      this.saveProgress();
      // 选后 320ms 自动进入下一题（交互规范 §2.2）
      if (autoTimer) clearTimeout(autoTimer);
      autoTimer = setTimeout(() => {
        if (this.data.index === this.data.total - 1) {
          this.submit();
        } else {
          this.render(this.data.index + 1);
        }
      }, 320);
    });
  },

  onPrev() {
    if (this.data.index === 0) return;
    if (autoTimer) clearTimeout(autoTimer);
    this.render(this.data.index - 1);
  },

  onNext() {
    if (!this.data.picked) return;
    if (autoTimer) clearTimeout(autoTimer);
    if (this.data.index === this.data.total - 1) {
      this.submit();
    } else {
      this.render(this.data.index + 1);
    }
  },

  // 中途退出：进度已自动保存，仅做一次确认
  onExit() {
    wx.showModal({
      title: '要退出吗',
      content: '退出后进度会保留，下次可以继续答。',
      confirmText: '退出',
      cancelText: '继续答',
      success: (res) => {
        if (res.confirm) Nav.back();
      }
    });
  },

  submit() {
    if (timer) clearInterval(timer);
    const testId = this.data.testId;
    const test = C.tests.filter((t) => t.id === testId)[0];
    const report = Engine.buildReport(testId, this.data.answers);
    report.seconds = this._seconds || 0;
    report.dateText = UI.relTime(Date.now());
    report.typeName = report.type.cn;
    // 每个人的结果图必须是他自己那一型：此前全站都用朋克图，是明显的内容错误
    report.img = TM.img(report.type);
    report.serial = TM.serial(report.type);

    const saved = Store.Reports.add(report);
    report.id = saved.id;
    Store.Progress.clear(testId);
    getApp().globalData.lastReport = report;
    getApp().track('quiz_finish', { id: testId, type: report.type.code, seconds: report.seconds });

    Nav.replace('/pages/generating/generating?rid=' + report.id, { silent: true });
  },

  onShareAppMessage() {
    return { title: '亚文化人格测试 · 正在答第 ' + (this.data.index + 1) + ' 题', path: '/pages/home/home' };
  }
});
