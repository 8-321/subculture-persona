// 人格 → 视觉 / 档案序号的唯一映射
// 结果页、人格档案页、分享卡片共用，避免「所有人都是朋克」这类前后不一致。
const IMG = {
  PUNK: 'p-punk.jpg',
  GOTH: 'p-gothic.jpg',
  LOTA: 'p-lolita.jpg',
  STR8: 'p-street.jpg',
  CYB3: 'p-cyber.jpg',
  V4PR: 'p-vaporwave.jpg',
  ROCK: 'p-rock.jpg',
  HHOP: 'p-hiphop.jpg',
  DANC: 'p-dance.jpg',
  SK8R: 'p-skate.jpg',
  BIKR: 'p-biker.jpg',
  JK: 'p-jk.jpg',
  DARK: 'p-dark.jpg',
  TRND: 'p-trend.jpg'
};

// 与 data/types.js 顺序一致：档案编号 01-14
const ORDER = ['PUNK', 'GOTH', 'LOTA', 'STR8', 'CYB3', 'V4PR', 'ROCK', 'HHOP', 'DANC', 'SK8R', 'BIKR', 'JK', 'DARK', 'TRND'];

function codeOf(t) {
  if (!t) return '';
  if (typeof t === 'string') return t;
  return t.id || t.code || '';
}

function img(t) {
  return '/images/ui/' + (IMG[codeOf(t)] || 'p-punk.jpg');
}

function index(t) {
  const i = ORDER.indexOf(codeOf(t));
  return i < 0 ? 0 : i;
}

function serial(t) {
  const n = index(t) + 1;
  return n < 10 ? '0' + n : String(n);
}

module.exports = { IMG: IMG, ORDER: ORDER, codeOf: codeOf, img: img, index: index, serial: serial };
