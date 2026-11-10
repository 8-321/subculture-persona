const fs=require('fs'),path=require('path');
const classes=['w','c','mini','tag','link','rw','seg','opt','btn','btn2','mb','pd-tg','sbar','search','cat','pub','authbtn','navbtn','icbtn','sample-tag','sample-inline'];
const files=[];function walk(d){for(const n of fs.readdirSync(d)){const f=path.join(d,n),s=fs.statSync(f);if(s.isDirectory())walk(f);else if(f.endsWith('.wxml'))files.push(f)}}
walk('miniprogram/pages');
for(const c of classes){
  const hits=[];
  for(const f of files){const s=fs.readFileSync(f,'utf8');const re=new RegExp('class="[^"]*\\b'+c+'\\b','g');let m;while(m=re.exec(s)){hits.push(path.basename(f))}}
  if(hits.length) console.log(c.padEnd(12), hits.length, [...new Set(hits)].join(' '));
}
