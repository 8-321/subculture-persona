
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..', '..');
const MP = path.join(ROOT, 'miniprogram');
global.getApp = () => ({ globalData: { demoStats: false } });

const Engine = require(path.join(MP, 'utils/engine.js'));
const bank = require(path.join(MP, 'data/bank.js'));
const qs = bank.bank || bank;
const answers = qs.map((q) => ({ qid: q.id, key: q.options[0].key }));
const rep = Engine.buildReport('main', answers);
const TM = require(path.join(MP, 'utils/typemedia.js'));
rep.serial = rep.serial || TM.serial(rep.type);

const cardSrc = fs.readFileSync(path.join(MP, 'pages/card/card.js'), 'utf8');
const start = cardSrc.indexOf('paint(ctx, canvas) {');
const end = cardSrc.indexOf('toTemp(canvas) {');
const paint = cardSrc.slice(start, end).replace(/[\s,]+$/, '');
const wStart = cardSrc.indexOf('function wrap(ctx, text, maxW) {');
const wEnd = cardSrc.indexOf('\n}\n', wStart) + 3;
const wrap = cardSrc.slice(wStart, wEnd);

const html = '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#ddd}canvas{display:block}</style>'
  + '<canvas id="c" width="750" height="1180"></canvas><script>'
  + 'const REPORT=' + JSON.stringify(rep) + ';\nconst W=750,H=1180;\n' + wrap + '\n'
  + 'const page={data:{report:REPORT,serial:' + JSON.stringify(rep.serial || '01') + '},toTemp(){},_canvas:null};\n'
  + 'const paint=function ' + paint + '\n'
  + 'paint.call(page, document.getElementById("c").getContext("2d"), document.getElementById("c"));\n'
  + '</script>';

(async () => {
  const OUT = path.join(ROOT, '.workbuddy', 'render');
  fs.writeFileSync(path.join(OUT, 'card-proof.html'), html, 'utf8');
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const p = await browser.newPage({ viewport: { width: 750, height: 1180 } });
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  p.on('console', (m) => console.log('CONSOLE', m.type(), m.text()));
  await p.goto('file:///' + path.join(OUT, 'card-proof.html').replace(/\\/g, '/'));
  await p.waitForTimeout(300);
  await p.locator('#c').screenshot({ path: path.join(OUT, 'card-proof.png') });
  await browser.close();
  console.log('type=' + rep.type.cn + ' serial=' + rep.serial + ' dims=' + (rep.dimList || []).map(d => d.name + d.value).join(','));
  console.log('saved ' + path.join(OUT, 'card-proof.png'));
})();
