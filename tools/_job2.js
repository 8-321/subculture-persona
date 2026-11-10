module.exports = [
  { file: 'miniprogram/data/content.js', old: `    sub: '30 道真实生活场景题 · 约 3 分钟 · 14 种人格',`, new: `    sub: '30 道生活场景题 · 约 3 分钟 · 14 种人格',` },
  { file: 'miniprogram/data/content.js', old: `const products = [
  { id: 'p1', brand: '洛丽缇', name: '蕾丝拼接连衣裙', price: '¥1,280', img: P + 'shop-lolita.jpg', tag: '精选', style: ['洛丽塔'], cat: '服饰', sold: 328, sizes: ['小号', '中号'] },
  { id: 'p2', brand: '铁器时代', name: '机车皮衣', price: '¥2,680', img: P + 'shop-jacket.jpg', tag: '', style: ['朋克'], cat: '服饰', sold: 512, sizes: ['中号', '大号'] },
  { id: 'p3', brand: '暗巷', name: '赛博护目镜', price: '¥899', img: P + 'shop-cyber.jpg', tag: '', style: ['赛博'], cat: '配饰', sold: 143, sizes: ['中号'] },
  { id: 'p4', brand: '街头商店', name: '厚底运动鞋', price: '¥689', img: P + 'shop-street.jpg', tag: '', style: ['街头'], cat: '鞋履', sold: 764, sizes: ['小号', '中号', '大号'] },
  { id: 'p5', brand: '铆钉工坊', name: '铆钉短靴', price: '¥1,180', img: P + 'shop-jacket.jpg', tag: '手工', style: ['朋克'], cat: '鞋履', sold: 96, sizes: ['小号', '中号'] },
  { id: 'p6', brand: '蒸汽波事务所', name: '千禧回潮项链', price: '¥329', img: P + 'shop-cyber.jpg', tag: '', style: ['蒸汽波'], cat: '配饰', sold: 208, sizes: ['中号'] },
  { id: 'p7', brand: '铆钉工坊', name: '手工银饰 · 别针款', price: '¥458', img: P + 'shop-street.jpg', tag: '手作', style: ['哥特'], cat: '手作', sold: 61, sizes: ['小号'] },
  { id: 'p8', brand: '铁器时代', name: '暗黑长风衣', price: '¥1,980', img: P + 'shop-lolita.jpg', tag: '', style: ['暗黑'], cat: '服饰', sold: 187, sizes: ['中号', '大号'] },
  { id: 'p9', brand: '洛丽缇', name: '缎带腰封', price: '¥520', img: P + 'shop-lolita.jpg', tag: '', style: ['洛丽塔'], cat: '配饰', sold: 355, sizes: ['小号', '中号'] },
  { id: 'p10', brand: '铁器时代', name: '做旧工装裤', price: '¥760', img: P + 'shop-jacket.jpg', tag: '', style: ['街头'], cat: '服饰', sold: 289, sizes: ['中号', '大号'] },
  { id: 'p11', brand: '街头商店', name: '加厚帆布托特包', price: '¥268', img: P + 'shop-street.jpg', tag: '', style: ['街头'], cat: '包袋', sold: 421, sizes: ['中号'] },
  { id: 'p12', brand: '铆钉工坊', name: '手作皮革腰包', price: '¥640', img: P + 'shop-jacket.jpg', tag: '手作', style: ['哥特'], cat: '包袋', sold: 87, sizes: ['小号', '中号'] }
];`, new: `const products = [
  { id: 'p1', brand: '洛丽缇', name: '蕾丝拼接连衣裙', price: '¥1,280', img: P + 'shop-lolita.jpg', tag: '精选', style: ['洛丽塔'], cat: '衣服', sub: '洛丽塔', sold: 328, sizes: ['小号', '中号'] },
  { id: 'p2', brand: '铁器时代', name: '机车皮衣', price: '¥2,680', img: P + 'shop-jacket.jpg', tag: '', style: ['朋克'], cat: '衣服', sub: '朋克', sold: 512, sizes: ['中号', '大号'] },
  { id: 'p3', brand: '暗巷', name: '赛博护目镜', price: '¥899', img: P + 'shop-cyber.jpg', tag: '', style: ['赛博'], cat: '配饰', sub: '护目镜', sold: 143, sizes: ['中号'] },
  { id: 'p4', brand: '街头商店', name: '厚底鞋 · 帽鞋套装', price: '¥689', img: P + 'p-dance.jpg', tag: '', style: ['街头'], cat: '鞋包', sub: '厚底鞋', sold: 764, sizes: ['小号', '中号', '大号'] },
  { id: 'p5', brand: '铁器时代', name: '机车头盔', price: '¥1,180', img: P + 'p-biker.jpg', tag: '手工', style: ['朋克'], cat: '配饰', sub: '头盔', sold: 96, sizes: ['中号', '大号'] },
  { id: 'p6', brand: '蒸汽波事务所', name: '磁带金链', price: '¥329', img: P + 'p-hiphop.jpg', tag: '', style: ['蒸汽波'], cat: '配饰', sub: '千禧', sold: 208, sizes: ['中号'] },
  { id: 'p7', brand: '铆钉工坊', name: '银质拨片胸针', price: '¥458', img: P + 'p-rock.jpg', tag: '手作', style: ['朋克'], cat: '配饰', sub: '铆钉', sold: 61, sizes: ['小号'] },
  { id: 'p8', brand: '铆钉工坊', name: '安全别针胸针', price: '¥199', img: P + 'p-punk.jpg', tag: '手工', style: ['朋克'], cat: '配饰', sub: '铆钉', sold: 187, sizes: ['小号'] },
  { id: 'p9', brand: '洛丽缇', name: '水手领 · 缎带', price: '¥520', img: P + 'p-jk.jpg', tag: '', style: ['洛丽塔'], cat: '配饰', sub: '缎带', sold: 355, sizes: ['小号', '中号'] },
  { id: 'p10', brand: '街头商店', name: '涂鸦喷漆', price: '¥160', img: P + 'p-street.jpg', tag: '手作', style: ['街头'], cat: '手作', sub: '改制', sold: 289, sizes: ['中号'] },
  { id: 'p11', brand: '暗巷', name: '黑蜡香薰', price: '¥268', img: P + 'p-dark.jpg', tag: '', style: ['暗黑'], cat: '手作', sub: '蜡烛', sold: 421, sizes: ['中号', '大号'] },
  { id: 'p12', brand: '蒸汽波事务所', name: '石膏胸像摆件', price: '¥640', img: P + 'p-vaporwave.jpg', tag: '手作', style: ['蒸汽波'], cat: '手作', sub: '摆件', sold: 87, sizes: ['大号'] }
];` },
  { file: 'miniprogram/data/content.js', old: `const categoryTree = [
  {
    id: 'g1', name: '衣服',
    subs: ['全部', '洛丽塔', '哥特', '朋克', '暗黑', '复古', '手作'],
    count: 1286
  },
  {
    id: 'g2', name: '鞋包',
    subs: ['全部', '厚底鞋', '机车靴', '手作包', '帆布袋'],
    count: 742
  },
  {
    id: 'g3', name: '配饰',
    subs: ['全部', '银饰', '铆钉', '缎带', '护目镜'],
    count: 915
  },
  {
    id: 'g4', name: '手作',
    subs: ['全部', '改制', '刺绣', '皮革', '滴胶'],
    count: 386
  },
  {
    id: 'g5', name: '店铺',
    subs: ['全部', '手作店', '古着店', '独立设计', '工作室'],
    count: 168
  }
];`, new: `const categoryTree = [
  { id: 'g1', name: '衣服', subs: ['全部', '洛丽塔', '哥特', '朋克', '暗黑', '复古'] },
  { id: 'g2', name: '鞋包', subs: ['全部', '厚底鞋'] },
  { id: 'g3', name: '配饰', subs: ['全部', '铆钉', '缎带', '护目镜', '头盔', '千禧'] },
  { id: 'g4', name: '手作', subs: ['全部', '改制', '皮革', '刺绣', '滴胶', '蜡烛', '摆件'] },
  { id: 'g5', name: '店铺', subs: ['全部'] }
];` },
  { file: 'miniprogram/data/content.js', old: `    items: ['洛丽缇', '铁器时代', '暗巷', '铆钉工坊', '街头', '夜行', '雨巷手作屋', '蒸汽波事务所']`, new: `    items: ['洛丽缇', '铁器时代', '暗巷', '铆钉工坊', '街头商店', '蒸汽波事务所']` },
  { file: 'miniprogram/data/content.js', old: `const shopCats = ['推荐', '服饰', '鞋履', '包袋', '配饰', '手作'];`, new: `const shopCats = ['推荐', '衣服', '鞋包', '配饰', '手作'];` },
  { file: 'miniprogram/data/content.js', old: `const postCats = ['推荐', '洛丽塔', '哥特', '朋克', '手作', '妆造', '店铺'];`, new: `/* 分类归属：一级 / 二级（分类页与搜索共用同一套，避免页面各自猜） */
const POST_CAT = {
  w1: ['衣服', '哥特'], w2: ['手作', '改制'], w3: ['配饰', '千禧'], w4: ['衣服', '朋克'],
  w5: ['鞋包', '厚底鞋'], w6: ['衣服', '暗黑'], w7: ['衣服', '暗黑'], w8: ['衣服', '复古']
};
posts.forEach((p) => {
  const c = POST_CAT[p.id];
  if (c) { p.cat = c[0]; p.sub = c[1]; }
});

const postCats = ['推荐', '洛丽塔', '哥特', '朋克', '手作', '妆造', '店铺'];` },
  { file: 'miniprogram/data/content.js', old: `    body: '反光、透明、塑料感——越不像真的越对。四件套一共不到三百，随便搭。',`, new: `    body: '反光、透明、塑料感——越不像真的越对。先从一条链子开始，三百出头就能搭。',` },
  { file: 'miniprogram/data/content.js', old: `    goods: { id: 'p6', name: '千禧回潮项链', sub: '示例店铺 · 本页只展示，不提供下单', price: '¥329', img: P + 'shop-cyber.jpg' }`, new: `    goods: { id: 'p6', name: '磁带金链', sub: '示例店铺 · 本页只展示，不提供下单', price: '¥329', img: P + 'p-hiphop.jpg' }` },
  { file: 'miniprogram/data/content.js', old: `    goods: { id: 'p5', name: '铆钉短靴', sub: '示例店铺 · 本页只展示，不提供下单', price: '¥1,180', img: P + 'shop-jacket.jpg' }`, new: `    goods: { id: 'p8', name: '安全别针胸针', sub: '示例店铺 · 本页只展示，不提供下单', price: '¥199', img: P + 'p-punk.jpg' }` },
  { file: 'miniprogram/data/content.js', old: `    goods: { id: 'p4', name: '厚底运动鞋', sub: '示例店铺 · 本页只展示，不提供下单', price: '¥689', img: P + 'shop-street.jpg' }`, new: `    goods: { id: 'p4', name: '厚底鞋 · 帽鞋套装', sub: '示例店铺 · 本页只展示，不提供下单', price: '¥689', img: P + 'p-dance.jpg' }` },
  { file: 'miniprogram/data/content.js', old: `    goods: { id: 'p8', name: '暗黑长风衣', sub: '示例店铺 · 本页只展示，不提供下单', price: '¥1,980', img: P + 'shop-lolita.jpg' }`, new: `    goods: { id: 'p7', name: '银质拨片胸针', sub: '示例店铺 · 本页只展示，不提供下单', price: '¥458', img: P + 'p-rock.jpg' }` },
  { file: 'miniprogram/data/content.js', old: `    goods: { id: 'p9', name: '缎带腰封', sub: '示例店铺 · 本页只展示，不提供下单', price: '¥520', img: P + 'shop-lolita.jpg' }`, new: `    goods: { id: 'p9', name: '水手领 · 缎带', sub: '示例店铺 · 本页只展示，不提供下单', price: '¥520', img: P + 'p-jk.jpg' }` },
  { file: 'miniprogram/data/content.js', old: `const hotWords = ['朋克', '洛丽塔', '哥特', '蒸汽波', '机车皮衣', '手工银饰', '滑板', '人格'];`, new: `const hotWords = ['朋克', '洛丽塔', '哥特', '蒸汽波', '机车皮衣', '胸针', '滑板', '人格'];` }
];
