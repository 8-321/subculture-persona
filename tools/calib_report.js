// 出率复测：用工程里同一套引擎跑 N 次随机作答，打印真实出率表
// 用法：node miniprogram/tools/calib_report.js [次数] [种子]
// 口径：理想出率 = 1/14 = 7.14%；偏差 > 1.2pp 视为需要重跑 build_calib.py
const path = require('path');
const E = require(path.resolve(__dirname, '../miniprogram/utils/engine.js'));

const N = Number(process.argv[2]) || 40000;
let seed = Number(process.argv[3]) || 9907;
const seedUsed = seed;
function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

const QS = E.QUESTIONS;
const ids = E.TYPES.map(E.codeOf);
const win = {}; ids.forEach((i) => { win[i] = 0; });

for (let i = 0; i < N; i++) {
  const answers = QS.map((q) => ({ qid: q.id, key: q.options[Math.floor(rnd() * q.options.length)].key }));
  const out = E.judge(E.score(answers, QS));
  win[out.type.id] = (win[out.type.id] || 0) + 1;
}

const ideal = 100 / ids.length;
const rows = ids.map((id) => ({ id: id, rate: win[id] / N * 100 })).sort((a, b) => a.rate - b.rate);
console.log('题数 ' + QS.length + ' | 模拟 ' + N + ' 次 | 种子 ' + seedUsed + ' | 理想 ' + ideal.toFixed(2) + '%');
console.log('区间 ' + rows[0].rate.toFixed(2) + '% ~ ' + rows[rows.length - 1].rate.toFixed(2) + '% | 跨度 ' + (rows[rows.length - 1].rate - rows[0].rate).toFixed(2) + 'pp');
rows.forEach((r) => {
  const d = r.rate - ideal;
  console.log('  ' + r.id.padEnd(5) + r.rate.toFixed(2) + '%  ' + (d >= 0 ? '+' : '') + d.toFixed(2) + 'pp');
});
