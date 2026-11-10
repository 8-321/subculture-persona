const fs=require('fs'),path=require('path');
const root='miniprogram/pages';
const out=[];
for(const d of fs.readdirSync(root)){
  const dir=path.join(root,d);
  const w=path.join(dir,d+'.wxml'), j=path.join(dir,d+'.js');
  if(!fs.existsSync(w)||!fs.existsSync(j)) continue;
  const wx=fs.readFileSync(w,'utf8'), js=fs.readFileSync(j,'utf8');
  const names=new Set();
  const re=/(?:bind|catch)(?::)?([a-z]+)=["']([A-Za-z_$][\w$]*)["']/g; let m;
  while(m=re.exec(wx)) names.add(m[2]);
  for(const n of names){ if(!new RegExp('\\b'+n+'\\s*\\(').test(js) && !new RegExp('\\b'+n+'\\s*:').test(js)) out.push(d+' -> '+n); }
}
console.log(out.length?out.join('\n'):'all handlers present');
