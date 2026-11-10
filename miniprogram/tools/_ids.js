const C = require('./data/content.js');
console.log('tests', C.tests.map(t => t.id).join(','));
console.log('posts', (C.posts||[]).slice(0,3).map(p => p.id).join(','));
console.log('articles', (C.articles||[]).slice(0,3).map(p => p.id).join(','));
console.log('products', (C.products||[]).slice(0,3).map(p => p.id).join(','));
console.log('shops', (C.shops||[]).slice(0,3).map(p => p.id).join(','));
console.log('types', Object.keys(C.types||{}).join(','));
