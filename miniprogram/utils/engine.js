// 第二文化 · 计分与判定引擎（纯函数，无 wx 依赖，可被 Node 直接 require 做离线单测）
//
// 计分口径（源自 04-测试体系/题库_爆款版.json meta.scoring）：
//   1. 每个选项给 3 个亚文化人格加分（主 +3 / 次 +2 / 再 +1），四维度同步累加；
//   2. 14 型各带平衡系数（4 万次随机作答校准），保证出率均等；
//   3. 平局按：出现题数多 → 含最后一题得分 → priority 靠前；
//   4. 第一名 / 第二名 ≥ 0.965 时触发彩蛋「你也有一点 X 的影子」；
//   5. 四维展示值 = clamp(32 + (raw-lo)/(hi-lo)*60, 12, 96)。

const bank = require('../data/bank.js');
const types = require('../data/types.js');
const content = require('../data/content.js');

const QUESTIONS = bank.bank || bank;
const TYPES = types.types || types;

// 人格库 id 与题库计分键的别名映射（JKJK ↔ JK）
const ALIAS = { JKJK: 'JK', JK: 'JKJK' };

// 规范键：统一用 types 的 id（人格库里 JK 型 id=JK / code=JKJK，题库计分键用 JK）
function codeOf(t) { return t.id || t.code; }

const DIMS = [
  { key: 'rebel', name: '反叛倾向' },
  { key: 'express', name: '独立表达' },
  { key: 'aesthetic', name: '审美自主' },
  { key: 'social', name: '社交开放度' }
];

// 维度展示值映射区间（取自 meta.scoring.dims_display.scale）
const DIM_SCALE = { rebel: [16, 30], express: [17, 27], aesthetic: [16, 29], social: [16, 29] };
const EGG_RATIO = 0.965;

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

/* ---------------- 题目 ---------------- */
function getQuestions(testId, subset) {
  let list = QUESTIONS;
  if (subset && subset.length) {
    const set = {};
    subset.forEach((n) => { set['q' + n] = true; });
    list = QUESTIONS.filter((q) => set[q.id]);
  }
  return list;
}

function getTest(testId) {
  const t = (content.tests || []).filter((x) => x.id === testId)[0];
  return t || content.tests[0];
}

/* ---------------- 计分 ---------------- */
function score(answers, questions) {
  const styles = {};
  const dims = { rebel: 0, express: 0, aesthetic: 0, social: 0 };
  const hitCount = {};
  let lastHit = {};
  let answeredCount = 0;
  let lastId = null;

  (answers || []).forEach((ans) => {
    const q = (questions || []).filter((x) => x.id === ans.qid)[0];
    if (!q) return;
    const opt = q.options.filter((o) => o.key === ans.key)[0];
    if (!opt) return;
    answeredCount += 1;
    lastId = ans.qid;

    Object.keys(opt.styles || {}).forEach((k) => {
      styles[k] = (styles[k] || 0) + opt.styles[k];
      hitCount[k] = (hitCount[k] || 0) + 1;
      if (String(ans.qid) === String(q.id)) lastHit[k] = (lastHit[k] || 0) + opt.styles[k];
    });
    Object.keys(opt.dims || {}).forEach((k) => {
      dims[k] = (dims[k] || 0) + opt.dims[k];
    });
  });

  return { styles: styles, dims: dims, hitCount: hitCount, lastHit: lastHit, answeredCount: answeredCount, lastId: lastId };
}

/* ---------------- 判定 ---------------- */
function judge(scored) {
  const factors = (bank.meta && bank.meta.scoring && bank.meta.scoring.balance_factors) || {};
  const priority = TYPES.map(codeOf);
  const raw = scored.styles || {};

  const balanced = {};
  Object.keys(raw).forEach((k) => {
    const f = factors[k] || 1;
    balanced[k] = raw[k] * f;
  });

  // 参与排序的型：有得分的 + 所有 14 型（0 分也要占位，避免空结果）
  const keys = priority.slice();
  Object.keys(balanced).forEach((k) => { if (keys.indexOf(k) < 0) keys.push(k); });

  const ranked = keys.map((k) => ({
    code: k,
    raw: raw[k] || 0,
    score: balanced[k] || 0,
    hits: (scored.hitCount || {})[k] || 0,
    last: (scored.lastHit || {})[k] || 0
  }));

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;                 // 平衡分高者优先
    if (b.hits !== a.hits) return b.hits - a.hits;                     // 出现题数多者优先
    if (b.last !== a.last) return b.last - a.last;                     // 含最后一题得分者优先
    return priority.indexOf(a.code) - priority.indexOf(b.code);        // priority 靠前者优先
  });

  const top = ranked[0];
  const second = ranked[1] || null;
  let egg = null;
  if (second && top.score > 0 && (second.score / top.score) >= EGG_RATIO) {
    const st = findType(second.code);
    if (st) egg = st.cn || st.nickname;
  }

  const type = findType(top.code) || TYPES[0];
  const secType = second ? findType(second.code) : null;

  return {
    type: type,
    second: secType,
    egg: egg,
    ranked: ranked,
    matched: matchDegree(ranked),
    dims: dimsDisplay(scored.dims, scored.answeredCount || 0)
  };
}

function findType(code) {
  if (!code) return null;
  return TYPES.filter((t) => (t.code === code || t.id === code || ALIAS[t.id] === code))[0] || null;
}

function matchDegree(ranked) {
  const total = ranked.reduce((s, r) => s + r.score, 0);
  if (!total) return 70;
  const avg = total / ranked.length;
  const top = ranked[0].score;
  if (!top) return 70;
  const share = top / (avg || 1);
  return Math.round(clamp(40 + share * 22, 62, 98));
}

// 维度映射区间按 30 题校准，题数不同的轻量测试按 30 题等效分归一
const FULL_COUNT = 30;

function dimsDisplay(rawDims, answeredCount) {
  const k = answeredCount > 0 ? FULL_COUNT / answeredCount : 1;
  const out = {};
  DIMS.forEach((d) => {
    const scale = DIM_SCALE[d.key] || [16, 30];
    const lo = scale[0];
    const hi = scale[1];
    const raw = ((rawDims || {})[d.key] || 0) * k;
    const v = 32 + ((raw - lo) / (hi - lo || 1)) * 60;
    out[d.key] = Math.round(clamp(v, 12, 96));
  });
  return out;
}

/* ---------------- 维度详解文案（04b 报告页） ---------------- */
const DIM_COPY = {
  rebel: {
    high: ['你对「本来就该这样」有天生的怀疑。',
      '遇到既定的穿法、听法、活法，你的第一反应不是照着做，而是拆开看看能不能重装。',
      '这种怀疑不一定说出来，但它会一直留在你做选择的那半秒钟里。'],
    mid: ['你会在必要的时候打破规则，但不是为了反对而反对。',
      '真正让你动手的，是「这件事本来有更好的做法」——而不是单纯想拧着来。',
      '大多数时候你配合得很好，直到那条线被踩到。'],
    low: ['你不反对规则，只是不喜欢被规则推着走。',
      '你能接受大部分安排，但会在关键的地方留一个自己的出口。',
      '这种克制让你看起来很好相处，其实边界一直很清楚。']
  },
  express: {
    high: ['你更在意表达是不是自己的，而不是合不合场合。',
      '别人觉得用力过猛的地方，你只觉得刚好。',
      '你宁可被人说奇怪，也不想被说没想法。'],
    mid: ['你会表达，但会挑时机和对象。',
      '该说的时候一句不少，不该说的时候一句不多。',
      '你不是不在乎被误解，只是觉得解释成本太高。'],
    low: ['你不太主动表达，但心里一直有判断。',
      '与其说出来被讨论，不如自己留着慢慢想。',
      '这种沉默不是没有态度，是还没轮到你说。']
  },
  aesthetic: {
    high: ['你有一套自己的偏执。',
      '旧、破、不对称都能成为理由，唯独「新和整齐」不算理由。',
      '别人看的是好不好看，你看的是对不对味。'],
    mid: ['你有偏好，但不至于被偏好绑住。',
      '你会为了整体效果让步，也会为了一处细节坚持。',
      '你挑东西的标准是「顺眼」，而顺眼里藏着自己的一套。'],
    low: ['你对审美没那么多执念，顺手就好。',
      '你会参考别人的意见，也不介意撞款。',
      '在你看来，舒服比风格重要。']
  },
  social: {
    high: ['你在人群里是充着电的。',
      '陌生的场合对你不是消耗，是新的素材来源。',
      '你容易和不同的人聊起来，也容易记住他们的故事。'],
    mid: ['你能社交，但需要回来补觉。',
      '在熟的人面前话很多，在生的人面前会先观察。',
      '你的社交额度是按人次算的，不是按场合。'],
    low: ['你在同频的小圈子里话很多，在需要应酬的场合迅速关机。',
      '能量来自同频，而不是数量。',
      '你不是不合群，你只是把群缩小到刚刚好。']
  }
};

function dimLevel(v) {
  if (v >= 80) return 'high';
  if (v >= 60) return 'mid';
  return 'low';
}

function buildDimDetail(dims) {
  return DIMS.map((d) => {
    const v = dims[d.key] || 0;
    const lv = dimLevel(v);
    const copy = DIM_COPY[d.key][lv];
    return {
      key: d.key,
      name: d.name,
      value: v,
      level: lv,
      levelText: lv === 'high' ? '维度最高' : (lv === 'mid' ? '偏高' : '偏低'),
      conclusion: copy[0],
      lines: [copy[1], copy[2]]
    };
  });
}

/* ---------------- 报告组装 ---------------- */
function buildReport(testId, answers) {
  const test = getTest(testId);
  const questions = getQuestions(testId, test.subset);
  const scored = score(answers, questions);
  const judged = judge(scored);
  const t = judged.type;

  const dimList = buildDimDetail(judged.dims);
  const key = codeOf(t);
  const outfitList = (content.outfit || {})[key] || content.outfit.PUNK;
  const tryList = (content.tryout || {})[key] || content.tryout.PUNK;

  return {
    testId: testId,
    testTitle: test.title,
    qcount: questions.length,
    answered: scored.answeredCount,
    type: t,
    second: judged.second,
    egg: judged.egg,
    matched: judged.matched,
    dims: judged.dims,
    dimList: dimList,
    quote: t.quote,
    tags: t.tags || [],
    why: t.why || [],
    outfit: outfitList,
    tryout: tryList,
    disclaimer: content.disclaimer,
    createdAt: Date.now()
  };
}

module.exports = {
  DIMS: DIMS,
  QUESTIONS: QUESTIONS,
  TYPES: TYPES,
  codeOf: codeOf,
  getQuestions: getQuestions,
  getTest: getTest,
  score: score,
  judge: judge,
  findType: findType,
  dimsDisplay: dimsDisplay,
  dimLevel: dimLevel,
  buildDimDetail: buildDimDetail,
  buildReport: buildReport
};
