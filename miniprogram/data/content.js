// 第二文化 · 内容库（测试 / 商品 / 社区 / 文章 / 兴趣 / 报告推荐）
// 全部为本地演示数据，接后台时按同样结构替换即可。
// 硬规则：界面无英文、只推荐不收款（商品只展示，不提供购买与支付入口）。

const P = '/images/ui/';

/* ---------------- 首页主视觉轮播（4 张） ---------------- */
const heroSlides = [
  {
    id: 'h1', img: P + 'lt-t10.jpg', pill: '主推测试',
    title: '看看你隐藏的\n亚文化人格',
    sub: '30 道题 · 约 3 分钟 · 14 种人格',
    cta: '开始测试', target: 'main'
  },
  {
    id: 'h2', img: P + 'lt-t03.jpg', pill: '人格图鉴',
    title: '14 种人格\n你是哪一种',
    sub: '别针、裙撑、反光条——每一种都有名字',
    cta: '去看看', target: 'personality'
  },
  {
    id: 'h3', img: P + 'lt-t07.jpg', pill: '社区示例',
    title: '商家的穿搭\n与手作',
    sub: '示例内容 · 上线后替换为真实发布',
    cta: '看示例', target: 'community'
  },
  {
    id: 'h4', img: P + 'lt-t09.jpg', pill: '商城示例',
    title: '这一周的\n好物清单',
    sub: '示例商品 · 上线后替换为真实商品',
    cta: '看示例', target: 'shop'
  }
];

/* ---------------- 推荐品类（首页第二模块 4 张） ---------------- */
const recCats = [
  { id: 'c1', code: 'LOTA', no: '01', name: '洛丽塔', img: P + 'p-lolita.jpg' },
  { id: 'c2', code: 'GOTH', no: '02', name: '哥特', img: P + 'p-gothic.jpg' },
  { id: 'c3', code: 'PUNK', no: '03', name: '朋克', img: P + 'p-punk.jpg' },
  { id: 'c4', code: 'V4PR', no: '04', name: '蒸汽波', img: P + 'p-vaporwave.jpg' }
];

/* ---------------- 分类页（23）：一级竖排 + 二级横排 ---------------- */
const categoryTree = [
  { id: 'g1', name: '衣服', subs: ['全部', '洛丽塔', '哥特', '朋克', '暗黑', '复古'] },
  { id: 'g2', name: '鞋包', subs: ['全部', '厚底鞋'] },
  { id: 'g3', name: '配饰', subs: ['全部', '铆钉', '缎带', '墨镜', '头盔', '千禧'] },
  { id: 'g4', name: '手作', subs: ['全部', '改制', '皮革', '刺绣', '滴胶', '蜡烛', '摆件'] },
  { id: 'g5', name: '店铺', subs: ['全部'] }
];

/* ---------------- 测评列表 ----------------
   subset = 该测试使用的题目编号（共用同一套 30 题引擎）   */
const tests = [
  {
    id: 'main', title: '看看你隐藏的亚文化人格', short: '隐藏的亚文化人格', cat: '人格', main: true,
    img: P + 'lt-t10.jpg', qcount: 30, minutes: 3, done: 12483,
    desc: '不是问你听什么歌、穿什么衣服，而是看你面对「被安排好的选择」时，第一反应是什么。',
    lead: '30 道场景题，全部单选，答完立即出结果，并生成一份四维度报告。',
    samples: ['刷到四张图，你的眼睛先停在哪一张', '有人说你审美很奇怪，你的第一反应', '如果人生有撤回键，你最想撤回'],
    subset: null
  },
  {
    id: 't-punk', title: '你是哪一种朋克人格？', cat: '人格',
    img: P + 'know-1.jpg', qcount: 8, minutes: 2, done: 12043,
    desc: '别针、撕口、旧皮衣。重点不是你穿什么，是你怎么对待规则。',
    samples: ['买不到合适的衣服时，你会怎么处理', '别人说你的审美很奇怪，你的第一反应', '你更愿意被喜欢，还是被记住'],
    subset: [1, 4, 7, 8, 11, 17, 22, 30]
  },
  {
    id: 't-aesthetic', title: '你的亚文化审美类型', cat: '审美',
    img: P + 'home-product.jpg', qcount: 12, minutes: 3, done: 8621,
    desc: '从颜色、材质到「旧」的程度，找出你真正偏执的那一块。',
    samples: ['你的房间最像哪一种空间', '抽屉最底层你会留着什么', '发照片前你会改到什么程度'],
    subset: [1, 5, 10, 13, 15, 18, 20, 23, 25, 26, 28, 29]
  },
  {
    id: 't-goth', title: '你更接近哪一种哥特？', cat: '人格',
    img: P + 'p-gothic.jpg', qcount: 9, minutes: 2, done: 6403,
    desc: '浪漫派、暗黑派还是安静派——黑也有很多种黑。',
    samples: ['凌晨三点，你通常还在做什么', '被误解的时候你会不会解释', '深夜你会听什么'],
    subset: [2, 3, 10, 12, 14, 19, 21, 24, 27]
  },
  {
    id: 't-street', title: '你的隐藏街头人格', cat: '穿搭',
    img: P + 'p-skate.jpg', qcount: 10, minutes: 3, done: 5120,
    desc: '在人群里你怎么走、怎么站位，比穿什么更说明问题。',
    samples: ['在人群里，你的走法是哪一种', '排队 40 人时你会不会留下', '城市很吵的时候你会怎么做'],
    subset: [6, 9, 11, 16, 18, 20, 22, 25, 27, 28]
  },
  {
    id: 't-lolita', title: '你的洛丽塔倾向', cat: '审美',
    img: P + 'shop-lolita.jpg', qcount: 8, minutes: 2, done: 3312,
    desc: '甜、古典还是哥特系——从你对「精致」的态度就能看出来。',
    samples: ['一条舍不得穿的裙子你会怎么处理', '不喜欢的礼物你会怎么处置', '被夸特别的时候你什么反应'],
    subset: [1, 7, 10, 13, 19, 23, 26, 29]
  },
  {
    id: 't-cyber', title: '你的赛博人格是哪一类', cat: '人格',
    img: P + 'shop-cyber.jpg', qcount: 11, minutes: 3, done: 2870,
    desc: '结构、反光、冷感——你是把自己接进系统，还是拔掉线。',
    samples: ['手机内存不够，你第一个删什么', '半离线的时候你在做什么', '十年后的你会在哪里'],
    subset: [1, 4, 6, 8, 12, 14, 16, 21, 24, 27, 30]
  },
  {
    id: 't-music', title: '你的音乐人格档案', cat: '音乐',
    img: P + 'home-test.jpg', qcount: 10, minutes: 3, done: 2148,
    desc: '耳机里放什么，决定你和世界的关系。',
    samples: ['耳机里你会放什么', '现场看不见舞台你会怎么做', '深夜电台你会留什么'],
    subset: [2, 5, 9, 12, 15, 17, 20, 23, 26, 28]
  },
  {
    id: 't-social', title: '你的社交能量类型', cat: '社交',
    img: P + 'home-brand.jpg', qcount: 8, minutes: 2, done: 1906,
    desc: '群聊 99 条未读时，你的第一反应是什么。',
    samples: ['群聊 99 条未读你会怎么处理', '第一次见陌生人你会怎么做', '被误解时你会不会解释'],
    subset: [4, 9, 12, 16, 19, 21, 24, 29]
  },
  {
    id: 't-night', title: '深夜人格测试', cat: '人格',
    img: P + 'm-test-hero.jpg', qcount: 9, minutes: 2, done: 1742,
    desc: '凌晨三点的你，和白天不太一样。',
    samples: ['凌晨三点你在替谁加班', '深夜你会吃什么', '深夜电台你会留什么'],
    subset: [3, 7, 10, 14, 18, 22, 25, 26, 27]
  },
  {
    id: 't-color', title: '你的配色直觉', cat: '审美',
    img: P + 'p-vaporwave.jpg', qcount: 8, minutes: 2, done: 1385,
    desc: '黑、灰、米白之外，你到底偏执哪一种。',
    samples: ['刷到四张图你的眼睛停在哪', '你的房间最像什么', '发照片前你会调到什么程度'],
    subset: [1, 5, 13, 15, 20, 25, 28, 29]
  },
  {
    id: 't-hand', title: '手作倾向测试', cat: '穿搭',
    img: P + 'p-jk.jpg', qcount: 8, minutes: 2, done: 1109,
    desc: '买成品还是自己改——这是两种完全不同的活法。',
    samples: ['买不到合适的衣服你会怎么处理', '修东西你会不会自己来', '搬家时你会留下什么'],
    subset: [3, 5, 8, 11, 17, 22, 24, 30]
  }
];

/* ---------------- 商城（只推荐，不收款） ---------------- */
const products = [
  { id: 'p1', brand: '洛丽缇', name: '蕾丝拼接连衣裙', price: '¥1,280', img: P + 'shop-lolita.jpg', tag: '精选', style: ['洛丽塔'], cat: '衣服', sub: '洛丽塔', sold: 328, sizes: ['小号', '中号'] },
  { id: 'p2', brand: '铁器时代', name: '机车皮衣', price: '¥2,680', img: P + 'shop-jacket.jpg', tag: '', style: ['朋克'], cat: '衣服', sub: '朋克', sold: 512, sizes: ['中号', '大号'] },
  { id: 'p3', brand: '暗巷', name: '赛博墨镜', price: '¥899', img: P + 'shop-cyber.jpg', tag: '', style: ['赛博'], cat: '配饰', sub: '墨镜', sold: 143, sizes: ['中号'] },
  { id: 'p4', brand: '街头商店', name: '厚底鞋 · 帽鞋套装', price: '¥689', img: P + 'p-dance.jpg', tag: '', style: ['街头'], cat: '鞋包', sub: '厚底鞋', sold: 764, sizes: ['小号', '中号', '大号'] },
  { id: 'p5', brand: '铁器时代', name: '机车头盔', price: '¥1,180', img: P + 'p-biker.jpg', tag: '手工', style: ['朋克'], cat: '配饰', sub: '头盔', sold: 96, sizes: ['中号', '大号'] },
  { id: 'p6', brand: '蒸汽波事务所', name: '磁带金链', price: '¥329', img: P + 'p-hiphop.jpg', tag: '', style: ['蒸汽波'], cat: '配饰', sub: '千禧', sold: 208, sizes: ['中号'] },
  { id: 'p7', brand: '铆钉工坊', name: '银质拨片胸针', price: '¥458', img: P + 'p-rock.jpg', tag: '手作', style: ['朋克'], cat: '配饰', sub: '铆钉', sold: 61, sizes: ['小号'] },
  { id: 'p8', brand: '铆钉工坊', name: '安全别针胸针', price: '¥199', img: P + 'p-punk.jpg', tag: '手工', style: ['朋克'], cat: '配饰', sub: '铆钉', sold: 187, sizes: ['小号'] },
  { id: 'p9', brand: '洛丽缇', name: '水手领 · 缎带', price: '¥520', img: P + 'p-jk.jpg', tag: '', style: ['洛丽塔'], cat: '配饰', sub: '缎带', sold: 355, sizes: ['小号', '中号'] },
  { id: 'p10', brand: '街头商店', name: '涂鸦喷漆', price: '¥160', img: P + 'p-street.jpg', tag: '手作', style: ['街头'], cat: '手作', sub: '改制', sold: 289, sizes: ['中号'] },
  { id: 'p11', brand: '暗巷', name: '黑蜡香薰', price: '¥268', img: P + 'p-dark.jpg', tag: '', style: ['暗黑'], cat: '手作', sub: '蜡烛', sold: 421, sizes: ['中号', '大号'] },
  { id: 'p12', brand: '蒸汽波事务所', name: '石膏胸像摆件', price: '¥640', img: P + 'p-vaporwave.jpg', tag: '手作', style: ['蒸汽波'], cat: '手作', sub: '摆件', sold: 87, sizes: ['大号'] }
];

/* 筛选面板维度（05b） */
/* 筛选分组（独立筛选页用：左侧分组导航 + 右侧选项区）
   size 与 products 里的 sizes 字段对应 */
const filterGroups = [
  {
    key: 'style', name: '风格', multi: true, field: 'style',
    items: ['洛丽塔', '朋克', '哥特', '街头', '赛博', '蒸汽波', '暗黑']
  },
  {
    key: 'brand', name: '品牌', multi: true, field: 'brand',
    items: ['洛丽缇', '铁器时代', '暗巷', '铆钉工坊', '街头商店', '蒸汽波事务所']
  },
  {
    key: 'size', name: '版型', multi: true, field: 'sizes',
    items: ['小号', '中号', '大号']
  },
];

const priceRanges = ['¥0-300', '¥300-800', '¥800-1500', '¥1500 以上'];

/* 排序方式（筛选页第一组，与列表页排序条同源） */
const sortOptions = [
  { k: 'default', n: '默认推荐', d: '按默认顺序展示，不按销量' },
  { k: 'priceAsc', n: '价格从低到高', d: '先看价格低的' },
  { k: 'priceDesc', n: '价格从高到低', d: '先看贵的' }
];

const shopCats = ['推荐', '衣服', '鞋包', '配饰', '手作'];

/* ---------------- 商家（社区 / 商城 / 关注共用） ---------------- */
const shops = [
  { id: 's1', name: '铁器时代', img: P + 'p-dark.jpg', fans: '8,204', rate: '98%', years: 6, neu: 3, tags: ['皮衣', '工装'] },
  { id: 's2', name: '洛丽缇', img: P + 'p-lolita.jpg', fans: '3.2万', rate: '99%', years: 8, neu: 5, tags: ['裙装', '缎带'] },
  { id: 's3', name: '暗巷', img: P + 'p-vaporwave.jpg', fans: '1.1万', rate: '97%', years: 4, neu: 2, tags: ['赛博', '配饰'] },
  { id: 's4', name: '铆钉工坊', img: P + 'p-punk.jpg', fans: '6,930', rate: '98%', years: 5, neu: 1, tags: ['铆钉', '手作'] },
  { id: 's5', name: '街头商店', img: P + 'p-skate.jpg', fans: '4,512', rate: '96%', years: 3, neu: 4, tags: ['滑板', '厚底鞋'] },
  { id: 's6', name: '蒸汽波事务所', img: P + 'p-cyber.jpg', fans: '2,348', rate: '97%', years: 2, neu: 2, tags: ['千禧', '回潮'] }
];

/* ---------------- 社区帖子（商家图文） ---------------- */
const posts = [
  {
    id: 'w1', cover: P + 'p-gothic.jpg', h: 188,
    title: '哥特通勤｜暗黑系也能穿去上班',
    body: '不夸张、不压抑的搭配思路：黑衬衫 + 蕾丝马甲、西装 + 铆钉腰带、长裙 + 皮质外套。全部单品都在我的店铺里，点下方链接就能看。',
    shop: '铁器时代', shopImg: P + 'p-dark.jpg', isShop: true,
    likes: 1204, views: 12000, favs: 96, topics: ['哥特', '通勤穿搭', '暗黑系'],
    goods: { id: 'p2', name: '机车皮衣 · 铁器时代', sub: '示例店铺 · 仅展示不下单', price: '¥2,680', img: P + 'shop-jacket.jpg' }
  },
  {
    id: 'w2', cover: P + 'p-lolita.jpg', h: 136,
    title: '手工蕾丝重工裙的制作全过程',
    body: '从选料到缝制一共 42 小时，裙撑做了三层。手作的慢是真的慢，但穿上那一刻也是真的值。',
    shop: '洛丽缇', shopImg: P + 'p-lolita.jpg', isShop: true,
    likes: 986, views: 8600, favs: 74, topics: ['洛丽塔', '手作', '裙装'],
    goods: { id: 'p1', name: '蕾丝拼接连衣裙', sub: '示例店铺 · 仅展示不下单', price: '¥1,280', img: P + 'shop-lolita.jpg' }
  },
  {
    id: 'w3', cover: P + 'p-vaporwave.jpg', h: 146,
    title: '千禧回潮｜蒸汽波配饰 4 件套',
    body: '反光、透明、塑料感——越不像真的越对。先从一条链子开始，三百出头就能搭。',
    shop: '暗巷', shopImg: P + 'p-vaporwave.jpg', isShop: true,
    likes: 654, views: 5200, favs: 41, topics: ['蒸汽波', '配饰', '千禧'],
    goods: { id: 'p6', name: '磁带金链', sub: '示例店铺 · 仅展示不下单', price: '¥329', img: P + 'p-hiphop.jpg' }
  },
  {
    id: 'w4', cover: P + 'p-punk.jpg', h: 176,
    title: '朋克妆造入门：从铆钉妆开始',
    body: '不需要全套装备，先把眼线和唇色压下去，再加一枚别针就成立了。',
    shop: '铆钉工坊', shopImg: P + 'p-punk.jpg', isShop: true,
    likes: 2310, views: 23000, favs: 188, topics: ['朋克', '妆造', '入门'],
    goods: { id: 'p8', name: '安全别针胸针', sub: '示例店铺 · 仅展示不下单', price: '¥199', img: P + 'p-punk.jpg' }
  },
  {
    id: 'w5', cover: P + 'p-skate.jpg', h: 158,
    title: '滑板系穿搭日记 · 第七天',
    body: '宽松、耐脏、能跑。厚底鞋是真的会改变走路姿势，穿一周就回不去了。',
    shop: '街头商店', shopImg: P + 'p-skate.jpg', isShop: true,
    likes: 512, views: 4300, favs: 33, topics: ['滑板', '街头', '厚底鞋'],
    goods: { id: 'p4', name: '厚底鞋 · 帽鞋套装', sub: '示例店铺 · 仅展示不下单', price: '¥689', img: P + 'p-dance.jpg' }
  },
  {
    id: 'w6', cover: P + 'p-dark.jpg', h: 168,
    title: '暗黑三件套：风衣 · 长靴 · 银饰',
    body: '低饱和不代表无聊，材质差别才是暗黑系的乐趣所在。',
    shop: '铁器时代', shopImg: P + 'p-dark.jpg', isShop: true,
    likes: 903, views: 7400, favs: 62, topics: ['暗黑', '风衣', '银饰'],
    goods: { id: 'p7', name: '银质拨片胸针', sub: '示例店铺 · 仅展示不下单', price: '¥458', img: P + 'p-rock.jpg' }
  },
  {
    id: 'w7', cover: P + 'p-cyber.jpg', h: 142,
    title: '机能风怎么穿才不像在拍戏',
    body: '束带减两条，反光留一处。克制比堆叠更难，也更像真的。',
    shop: '暗巷', shopImg: P + 'p-cyber.jpg', isShop: true,
    likes: 447, views: 3900, favs: 28, topics: ['赛博', '机能', '穿搭'],
    goods: { id: 'p3', name: '赛博墨镜', sub: '示例店铺 · 仅展示不下单', price: '¥899', img: P + 'shop-cyber.jpg' }
  },
  {
    id: 'w8', cover: P + 'p-jk.jpg', h: 152,
    title: '日常也能穿的制服感搭配',
    body: '领结换成缎带，裙子放长两厘米——通勤和喜好可以都要。',
    shop: '洛丽缇', shopImg: P + 'p-lolita.jpg', isShop: true,
    likes: 146, views: 1200, favs: 12, topics: ['制服', '通勤', '缎带'],
    goods: { id: 'p9', name: '水手领 · 缎带', sub: '示例店铺 · 仅展示不下单', price: '¥520', img: P + 'p-jk.jpg' }
  }
];

/* 分类归属：一级 / 二级（分类页与搜索共用同一套，避免页面各自猜） */
const POST_CAT = {
  w1: ['衣服', '哥特'], w2: ['手作', '改制'], w3: ['配饰', '千禧'], w4: ['衣服', '朋克'],
  w5: ['鞋包', '厚底鞋'], w6: ['衣服', '暗黑'], w7: ['衣服', '暗黑'], w8: ['衣服', '复古']
};
posts.forEach((p) => {
  const c = POST_CAT[p.id];
  if (c) { p.cat = c[0]; p.sub = c[1]; }
});

const postCats = ['推荐', '洛丽塔', '哥特', '朋克', '手作', '妆造', '店铺'];

/* ---------------- 文章（第二文化 · 延伸阅读） ---------------- */
const articles = [
  {
    id: 'a1', title: '朋克是从一家服装店开始的', img: P + 'p-punk.jpg', cat: '文化知识',
    author: '第二文化', time: '3 分钟阅读', likes: 328,
    lead: '1976 年的伦敦，一家店里卖的衣服，后来成了整个运动的制服。',
    body: '1974 年到 1976 年，薇薇安·威斯特伍德和马尔科姆·麦克拉伦在伦敦国王路 430 号开了一家服装店。店里卖的东西很便宜：撕口的上衣、用安全别针别起来的布片、像束缚带一样的绑带。\n\n同一套班底做的另一件事是乐队。麦克拉伦同时是性手枪的经纪人，衣服和音乐从那家店里一起长出来。所以朋克最先不是一种「风格」，而是「自己动手做一件能穿出门的衣服」。\n\n这一点到今天都没变：你身上那件改造过的外套，比任何标签都更接近它。\n\n出处：维基百科「性（服装店）」条目。',
    facts: [
      { text: '薇薇安·威斯特伍德与马尔科姆·麦克拉伦于 1974—1976 年在伦敦国王路 430 号经营服装店「性」。', src: 'S8' }
    ],
    sources: [{ title: '维基百科 · 性（服装店）', url: 'https://en.wikipedia.org/wiki/Sex_(boutique)' }]
  },
  {
    id: 'a2', title: '水手服是怎么进校园的', img: P + 'p-jk.jpg', cat: '文化知识',
    author: '第二文化', time: '3 分钟阅读', likes: 441,
    lead: '它最早不是「可爱」的符号，是一次制服改革的结果。',
    body: '1920 年，京都的平安女学院第一次把水手服当作女生校服。此前日本女学生的主流是上半身和服、下半身裤裙，行动很不方便。\n\n水手服的领子来自海军制服，改到校服上之后，被简化成能自己穿、能跑能跳的样式。之后几十年，它在日本校园里普及，又被漫画和影视反复描画，才慢慢变成今天大家认得的「学生制服」。\n\n所以它不是谁设计出来的可爱，而是一群人想让自己动起来更方便。\n\n出处：日本网（nippon.com）《日本的校服》。',
    facts: [
      { text: '1920 年京都平安女学院首次采用水手服作为女生校服，此后在日本校园普及。', src: 'S9' }
    ],
    sources: [{ title: '日本网 · 日本的校服', url: 'https://www.nippon.com/hk/features/jg00033/' }]
  },
  {
    id: 'a3', title: '裙撑为什么是洛丽塔的骨架', img: P + 'p-lolita.jpg', cat: '穿搭',
    author: '第二文化', time: '5 分钟阅读', likes: 903,
    lead: '不是可爱，是结构。',
    body: '洛丽塔服饰最早成规模的品牌，是 1988 年在东京创立的「宝贝，星光闪耀」。在那之前，原宿的年轻人已经在自己做裙子，把蕾丝、缎带和裙撑拼在一起。\n\n裙撑撑起来的不只是裙摆，还有姿态：它会让你不自觉地抬头、收肩、放慢脚步。很多人第一次穿都会说同一句话——走路方式变了。\n\n这也是为什么洛丽塔和朋克其实是一路人：都在用衣服给自己搭一套规则，只是一个向外柔，一个向外硬。\n\n出处：洛丽塔时尚史（lolitafashionhistory.com）品牌条目。',
    facts: [
      { text: '「宝贝，星光闪耀」1988 年由矶部章弘与矶部史代在东京创立，2004 年增开姊妹品牌「爱丽丝与海盗」。', src: 'S1' }
    ],
    sources: [{ title: 'Lolita Fashion History · Baby, the Stars Shine Bright', url: 'https://lolitafashionhistory.com/Brands/baby-the-stars-shine-bright' }]
  },
  {
    id: 'a4', title: '街舞进奥运的那一年', img: P + 'p-dance.jpg', cat: '现场记录',
    author: '第二文化', time: '4 分钟阅读', likes: 512,
    lead: '从布朗克斯的街头，到巴黎的赛场，用了五十年。',
    body: '霹雳舞 1970 年代中期出现在纽约布朗克斯，是嘻哈文化的四个组成部分之一。它一开始在街区派对、在纸板上、在音乐的间奏里发生。\n\n2022 年，它进入世界运动会；2024 年，它成为巴黎奥运会的正式比赛项目。裁判打分看的不是难度堆叠，而是技术、多样性、完成度、音乐性和原创性。\n\n从街头到赛场，规则变了，但有一件事没变：音乐一响，你得先听懂它。\n\n出处：英国广播公司体育《2024 巴黎奥运新增项目说明》。',
    facts: [
      { text: '霹雳舞 1970 年代中期起源于纽约布朗克斯，2022 年进入世界运动会，2024 年成为巴黎奥运会正式项目。', src: 'S6' }
    ],
    sources: [{ title: 'BBC Sport · Breaking at Paris 2024', url: 'https://www.bbc.co.uk/sport/extra/68hxs9lsfb/breaking-the-new-olympic-sport-for-2024-explained' }]
  },
  {
    id: 'a5', title: '一盘磁带定下了蒸汽波的颜色', img: P + 'p-vaporwave.jpg', cat: '文化知识',
    author: '第二文化', time: '3 分钟阅读', likes: 287,
    lead: '2011 年 12 月 9 日，一张专辑把粉色和雕像固定成了一整套视觉。',
    body: '2011 年 12 月 9 日，音乐人维克的罗伊德用「麦金塔加号」的名义发行了《花卉商店》。做法很简单：把 1980 到 90 年代的电梯音乐、广告配乐降速、加混响，再配上一张粉色渐变、白色大理石雕像的封面。\n\n后来所有被叫作蒸汽波的东西——旧电脑窗口、日文、录像带噪点、断裂的雕塑——几乎都能从这张封面里找到出处。\n\n它提醒我们一件事：一种审美定型，往往不是靠宣言，而是靠一张图被人反复转发。\n\n出处：维基百科「花卉商店」条目。',
    facts: [
      { text: '《花卉商店》2011 年 12 月 9 日发行，是蒸汽波最具代表性的专辑，封面由粉色渐变与大理石雕像构成。', src: 'S4' }
    ],
    sources: [{ title: '维基百科 · Floral Shoppe', url: 'https://en.wikipedia.org/wiki/Floral_Shoppe' }]
  },
  {
    id: 'a6', title: '中国摇滚的第一次登台', img: P + 'p-rock.jpg', cat: '现场记录',
    author: '第二文化', time: '4 分钟阅读', likes: 640,
    lead: '1986 年 5 月 9 日，北京工人体育馆，一个裤脚一高一低的人走上了台。',
    body: '1986 年 5 月 9 日，为纪念国际和平年，百名歌星在北京工人体育馆办了一场演唱会。崔健穿着长褂、背着吉他上台，唱了《一无所有》。\n\n当时的观众一开始并不知道发生了什么。等第一句唱出来，现场安静下来，歌唱完之后是长时间的欢呼。后来的评论把这一天当作中国摇滚的起点。\n\n他没换衣服，也没设计造型——一身日常的衣服站在那个台上，本身就是这件事最重要的部分。\n\n出处：中国网《1986 年 5 月 9 日崔健首演〈一无所有〉》。',
    facts: [
      { text: '1986 年 5 月 9 日，崔健在北京工人体育馆的百名歌星演唱会上首唱《一无所有》，被视为中国摇滚的起点。', src: 'S15' }
    ],
    sources: [{ title: '中国网 · 1986 年 5 月 9 日崔健首演《一无所有》', url: 'http://www.china.com.cn/v/cul/2014-05/09/content_32338739.htm' }]
  },
  {
    id: 'a7', title: '嘻哈的生日是可以查的', img: P + 'p-hiphop.jpg', cat: '文化知识',
    author: '第二文化', time: '3 分钟阅读', likes: 369,
    lead: '1973 年 8 月 11 日，一场返校派对。',
    body: '1973 年 8 月 11 日，唱盘师库尔·赫克和姐姐辛迪·坎贝尔在纽约布朗克斯塞奇威克大道 1520 号办了一场返校派对。门票很便宜，场地是楼下的活动室。\n\n他在两台唱机上反复接同一段鼓点，把间奏拉长，让跳舞的人有更多时间。这个动作后来有了名字，也有了整套文化：说唱、涂鸦、街舞、打碟。\n\n所以嘻哈不是「从某张唱片开始」的，它是从一次社区活动开始的。\n\n出处：纽约市公园管理局嘻哈文化史。',
    facts: [
      { text: '1973 年 8 月 11 日，库尔·赫克与辛迪·坎贝尔在塞奇威克大道 1520 号举办返校派对，被公认为嘻哈的诞生日。', src: 'S5' }
    ],
    sources: [{ title: 'NYC Parks · Birth of Hip Hop', url: 'https://www.nycgovparks.org/about/history/hip-hop' }]
  },
  {
    id: 'a8', title: '皮衣的斜拉链不是装饰', img: P + 'p-biker.jpg', cat: '穿搭',
    author: '第二文化', time: '3 分钟阅读', likes: 402,
    lead: '它歪着，是为了骑车时风不往领口里灌。',
    body: '机车夹克的斜拉链是功能设计：人趴在车把上时，正前方的拉链会顶住下巴、留出缝隙，斜着走线才能把风挡在外面。\n\n1947 年，加州霍利斯特的摩托车集会涌进约四千名骑手，而小镇居民只有约四千五百人。媒体把现场写成了骚乱，机车骑手的形象从此被固定下来：皮衣、丹宁马甲、靴子。\n\n一年后的 1948 年 3 月 17 日，第一个「地狱天使」俱乐部在加州丰塔纳成立。衣服跟着人走，人跟着路走。\n\n出处：维基百科「地狱天使」条目。',
    facts: [
      { text: '「地狱天使」摩托车俱乐部 1948 年 3 月 17 日成立于加州丰塔纳，创始人为奥托·弗里德利。', src: 'S12' },
      { text: '1947 年霍利斯特集会约四千名骑手进入人口约四千五百人的小镇，成为机车形象的传播起点。', src: 'S12' }
    ],
    sources: [{ title: '维基百科 · 地狱天使', url: 'https://en.wikipedia.org/wiki/Hell%27s_Angels' }]
  }
];

/* ---------------- 兴趣选择（08 / 12） ---------------- */
const interests = [
  { id: 'i1', name: '朋克', img: P + 'p-punk.jpg' },
  { id: 'i2', name: '摇滚', img: P + 'p-rock.jpg' },
  { id: 'i3', name: '嘻哈', img: P + 'p-hiphop.jpg' },
  { id: 'i4', name: '街舞', img: P + 'p-dance.jpg' },
  { id: 'i5', name: '洛丽塔', img: P + 'p-lolita.jpg' },
  { id: 'i6', name: '水手服', img: P + 'p-jk.jpg' },
  { id: 'i7', name: '哥特', img: P + 'p-gothic.jpg' },
  { id: 'i8', name: '暗黑', img: P + 'p-dark.jpg' },
  { id: 'i9', name: '赛博', img: P + 'p-cyber.jpg' },
  { id: 'i10', name: '蒸汽波', img: P + 'p-vaporwave.jpg' },
  { id: 'i11', name: '滑板', img: P + 'p-skate.jpg' },
  { id: 'i12', name: '街头', img: P + 'p-street.jpg' },
  { id: 'i13', name: '机车', img: P + 'p-biker.jpg' },
  { id: 'i14', name: '潮流', img: P + 'p-trend.jpg' },
  { id: 'i15', name: '手作', img: P + 'home-brand.jpg' }
];

/* ---------------- 报告推荐：适合你的穿搭 / 可以试试看（按人格代号） ---------------- */
const outfit = {
  PUNK: ['机车皮衣 + 白 T + 破洞丹宁', '铆钉短靴 + 工装裤 + 银饰', '别针耳饰 + 做旧皮带'],
  GOTH: ['黑衬衫 + 蕾丝马甲 + 长裙', '银饰层叠 + 低饱和唇色', '西装外套 + 皮质腰带'],
  LOTA: ['缎带腰封 + 及膝裙 + 圆头鞋', '三层裙撑 + 蕾丝手套', '古典柄衬衫 + 发带'],
  STR8: ['宽松卫衣 + 工装裤 + 厚底鞋', '棒球帽 + 直筒丹宁', '背包斜挎 + 高筒袜'],
  CYB3: ['束带马甲 + 机能裤 + 护目镜', '反光条外套 + 结构感背包', '半指手套 + 金属项链'],
  V4PR: ['透明 PVC 包 + 千禧项链', '渐变卫衣 + 阔腿裤', '塑料感耳饰 + 老式墨镜'],
  ROCK: ['乐队 T + 皮衣 + 窄脚裤', '长发 + 环形耳饰 + 手镯', '马丁靴 + 做旧牛仔'],
  HHOP: ['宽肩外套 + 运动裤 + 球鞋', '项链叠戴 + 渔夫帽', '大号卫衣 + 束脚裤'],
  DANC: ['宽松短袖 + 束脚裤 + 板鞋', '护腕 + 头巾 + 大包', '亮色上衣 + 深色下装'],
  SK8R: ['印花 T + 宽松丹宁 + 板鞋', '卫衣 + 工装短裤 + 长袜', '棒球帽反戴 + 帆布包'],
  BIKR: ['皮衣 + 直筒裤 + 机车靴', '皮质手套 + 围巾', '墨镜 + 复古腕表'],
  JK: ['缎带领结 + 及膝裙 + 中筒袜', '针织背心 + 衬衫', '制服感外套 + 乐福鞋'],
  DARK: ['长风衣 + 高领 + 长靴', '暗纹衬衫 + 银戒', '低饱和配色 + 硬挺廓形'],
  TRND: ['当季单品叠穿 + 金属配件', '大廓形外套 + 紧身内搭', '限量配件点睛全身']
};

const tryout = {
  PUNK: ['把一件旧衣服改到只剩你喜欢的样子', '去看一次现场，不戴耳机、不录像', '把「像不像我」的判断权收回来'],
  GOTH: ['给自己留一段完全不社交的夜晚', '写一封不会寄出去的信', '把深色穿去白天的工作场合'],
  LOTA: ['为自己搭一整套，只为了自己看', '把喜欢的东西认真收好，而不是用坏', '给自己设一个不赶时间的早晨'],
  STR8: ['走一条没走过的路回家', '在人群里试一次不低头', '把最舒服的那套穿出门'],
  CYB3: ['断网两小时，看自己会做什么', '把手机里的推荐内容清一次', '给自己做一份使用说明'],
  V4PR: ['翻出一张老照片，照着它过一天', '听一张完整的专辑，不快进', '把旧东西修好而不是换掉'],
  ROCK: ['把音量调大一次，只在没人的时候', '学一件需要练三个月的事', '把一句想说的话写成歌词'],
  HHOP: ['在朋友面前讲一件你一直想讲的事', '把吐槽变成押韵的句子', '主动带一次节奏'],
  DANC: ['跟着节拍走一段路', '去上一次完全不会的课', '在没有音乐的地方数拍子'],
  SK8R: ['摔一次，然后继续', '去一个没人的地方练到天黑', '把路线画在纸上'],
  BIKR: ['骑到不认识的地方再回来', '夜里出门一次，不带目的', '把一件旧装备修到能用'],
  JK: ['给自己准备一份放学后的零食', '和朋友约一次不赶时间的见面', '把喜欢的东西整齐摆出来'],
  DARK: ['一个人看一场电影', '把灯关掉听完一张专辑', '给自己留一段不给任何人看的时间'],
  TRND: ['先试一件你还没看懂的新东西', '把流行改成自己的版本', '记录一周里你改变了几次想法']
};

/* ---------------- 搜索热词 ---------------- */
const hotWords = ['朋克', '洛丽塔', '哥特', '蒸汽波', '机车皮衣', '胸针', '滑板', '人格'];

/* ---------------- 合规文案 ---------------- */
const disclaimer = '结果仅供兴趣参考，不是心理诊断';
const jumpNotice = '即将离开第二文化，去第三方平台查看';


/* ---------------- 示例数据标记（《需求 V3.0》§4） ----------------
   每条示例数据带 demo=true：正式版据此隐藏无后台来源的数字（粉丝/好评率/销量/人测过）。
   商家真实录入的数据不带这个标记，所以不依赖它隐藏。 */
function markDemo(list) {
  (list || []).forEach(function (x) { x.demo = true; });
  return list;
}

module.exports = {
  P: P,
  heroSlides: heroSlides,
  recCats: recCats,
  categoryTree: categoryTree,
  tests: tests,
  products: markDemo(products),
  shopCats: shopCats,
  filterGroups: filterGroups,
  priceRanges: priceRanges,
  sortOptions: sortOptions,
  shops: markDemo(shops),
  posts: markDemo(posts),
  postCats: postCats,
  articles: articles,
  interests: interests,
  outfit: outfit,
  tryout: tryout,
  hotWords: hotWords,
  disclaimer: disclaimer,
  jumpNotice: jumpNotice
};
