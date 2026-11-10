module.exports = [
  { file: 'miniprogram/pages/category/category.js', old: `  // 分类页内容 = 社区帖子 + 商城商品混合（数据驱动，条目可升格为品类）
  apply(topIndex, sub) {
    const tree = C.categoryTree;
    const g = tree[topIndex];
    const subs = g.subs;

    let items = [];
    if (g.name === '店铺') {
      items = C.shops.map((s) => ({
        id: 's_' + s.id, title: s.name, img: s.img, sub: s.tags.join(' / '), likesText: Stat.fans(s.fans), type: 'shop'
      }));
    } else {
      const hidden = Store.Report.hiddenIds();
      const posts = C.posts.filter((p) => hidden.indexOf(p.id) < 0).map((p) => ({
        id: p.id, title: p.title, img: p.cover, sub: p.shop, likesText: Stat.count(p.likes, ''), type: 'post'
      }));
      const goods = C.products.map((p) => ({
        id: p.id, title: p.name, img: p.img, sub: p.brand, likesText: Stat.price(p.price) || '价格见商家', type: 'product'
      }));
      items = posts.concat(goods);
    }

    if (sub !== '全部') {
      items = items.filter((it) => it.sub.indexOf(sub) >= 0 || it.title.indexOf(sub) >= 0);
    }

    // 商品部分走统一筛选内核（帖子 / 店铺不参与筛选）
    const cond = this.data.cond || F.empty();
    let filtered = items;
    if (hasCond(cond)) {
      const hitIds = {};
      F.apply(C.products, cond).forEach((p) => { hitIds[p.id] = 1; });
      filtered = items.filter((it) => (it.type === 'product' ? !!hitIds[it.id] : true));
    }

    this.setData({
      curTop: topIndex, topName: g.name, subs: subs, curSub: sub,
      list: M.stagger(filtered, 26, 0, 12),
      chosen: F.chosen(cond),
      selCount: F.chosenCount(cond)
    });
  },`, new: `  // 分类页内容 = 社区帖子 + 商城商品混合；一级 / 二级都按数据里的 cat / sub 过滤
  apply(topIndex, sub) {
    const tree = C.categoryTree;
    const g = tree[topIndex] || tree[0];
    let items = [];

    if (g.name === '店铺') {
      items = C.shops.map((s) => ({
        id: 's_' + s.id, title: s.name, img: s.img, sub: s.tags.join(' / '),
        subTag: s.name, likesText: Stat.fans(s.fans), type: 'shop'
      }));
    } else {
      const hidden = Store.Report.hiddenIds();
      const posts = C.posts
        .filter((p) => hidden.indexOf(p.id) < 0 && p.cat === g.name)
        .map((p) => ({
          id: p.id, title: p.title, img: p.cover, sub: p.shop,
          subTag: p.sub || '', likesText: Stat.count(p.likes, ' 赞'), type: 'post'
        }));
      const goods = C.products
        .filter((p) => p.cat === g.name)
        .map((p) => ({
          id: p.id, title: p.name, img: p.img, sub: p.brand,
          subTag: p.sub || '', likesText: Stat.price(p.price) || '价格见商家', type: 'product'
        }));
      items = posts.concat(goods);
    }

    // 二级只列「真的有内容」的项，避免点进去空白
    let subs = ['全部'];
    if (g.name === '店铺') {
      subs = subs.concat(C.shops.map((s) => s.name));
    } else {
      const have = {};
      items.forEach((it) => { if (it.subTag) have[it.subTag] = 1; });
      subs = subs.concat(g.subs.filter((s) => s !== '全部' && have[s]));
    }

    let curSub = sub;
    if (subs.indexOf(sub) < 0) curSub = '全部';
    let filtered = curSub === '全部' ? items : items.filter((it) => it.subTag === curSub);

    // 商品部分走统一筛选内核（帖子 / 店铺不参与筛选）
    const cond = this.data.cond || F.empty();
    if (hasCond(cond)) {
      const hitIds = {};
      F.apply(C.products, cond).forEach((p) => { hitIds[p.id] = 1; });
      filtered = filtered.filter((it) => (it.type === 'product' ? !!hitIds[it.id] : true));
    }

    this.setData({
      curTop: topIndex, topName: g.name, subs: subs, curSub: curSub,
      list: M.stagger(filtered, 26, 0, 12),
      chosen: F.chosen(cond),
      selCount: F.chosenCount(cond)
    });
  },` }
];
