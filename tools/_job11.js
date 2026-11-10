module.exports = [
  { file: 'miniprogram/pages/post-detail/post-detail.wxml', old: `        <view class="bs">{{item.read.sub}} · 接入后开放</view>`, new: `        <view class="bs">{{item.read.sub}}</view>` },
  { file: 'miniprogram/pages/post-detail/post-detail.wxml', old: `  <view class="pg-no">{{cur + 1}} / {{shots.length}}</view>`, new: `  <view wx:if="{{shots.length > 1}}" class="pg-no">{{cur + 1}} / {{shots.length}}</view>` },
  { file: 'miniprogram/pages/post-detail/post-detail.js', old: `    const shots = isArticle ? [item.img] : [item.cover, item.cover, item.cover, item.cover];`, new: `    const shots = isArticle ? [item.img] : [item.cover];` },
  { file: 'miniprogram/pages/shop-home/shop-home.wxml', old: `  <view wx:if="{{shop}}" class="endnote">店铺与商品信息由商家提供；平台只做展示与线索转交，不对交易作出承诺。</view>`, new: `  <view wx:if="{{shop}}" class="endnote">示例店铺与商品只做展示，不构成交易承诺。</view>` },
  { file: 'miniprogram/data/content.js', old: `name: '赛博护目镜', price: '¥899', img: P + 'shop-cyber.jpg', tag: '', style: ['赛博'], cat: '配饰', sub: '护目镜'`, new: `name: '赛博墨镜', price: '¥899', img: P + 'shop-cyber.jpg', tag: '', style: ['赛博'], cat: '配饰', sub: '墨镜'` },
  { file: 'miniprogram/data/content.js', old: `subs: ['全部', '铆钉', '缎带', '护目镜', '头盔', '千禧']`, new: `subs: ['全部', '铆钉', '缎带', '墨镜', '头盔', '千禧']` },
  { file: 'miniprogram/data/content.js', old: `    goods: { id: 'p3', name: '赛博护目镜', sub: '示例店铺 · 本页只展示，不提供下单', price: '¥899', img: P + 'shop-cyber.jpg' }`, new: `    goods: { id: 'p3', name: '赛博墨镜', sub: '示例店铺 · 本页只展示，不提供下单', price: '¥899', img: P + 'shop-cyber.jpg' }` },
  { file: 'miniprogram/utils/stat.js', old: `function num(n) {
  // 数据里可能写成 '8,204' 这种带千分位的字符串，先清洗再算
  const v = Number(String(n == null ? 0 : n).replace(/,/g, ''));
  return isFinite(v) ? v : 0;
}`, new: `function num(n) {
  // 数据里可能写成 '8,204' 或 '3.2万'，先清洗再算，避免把中文单位算成 0
  const s = String(n == null ? 0 : n).replace(/,/g, '').trim();
  const wan = s.match(/^([0-9]+(?:\\.[0-9]+)?)\\s*万/);
  if (wan) return Math.round(parseFloat(wan[1]) * 10000);
  const v = Number(s);
  return isFinite(v) ? v : 0;
}` }
];
