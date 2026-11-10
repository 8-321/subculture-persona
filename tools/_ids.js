const bank = require('../miniprogram/data/bank.js');
const qs = bank.bank || bank;
const dash = qs.filter(q => /—\s*$/.test(q.text || ''));
console.log('total', qs.length, 'ending with dash', dash.length);
dash.slice(0, 8).forEach(q => console.log(q.id, q.text));
