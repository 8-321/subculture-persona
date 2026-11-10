module.exports = [
  {
    file: 'miniprogram/pages/search/search.js',
    old: `      desc: '内容 · ' + p.shop + ' · ' + Stat.count(p.likes, '赞')`,
    new: `      desc: ['内容', p.shop, Stat.count(p.likes, '赞')].filter(Boolean).join(' · ')`
  },
  {
    file: 'miniprogram/pages/search/search.js',
    old: `    desc: '商家 · ' + Stat.fans(s.fans)`,
    new: `    desc: ['商家', Stat.fans(s.fans)].filter(Boolean).join(' · ')`
  }
];