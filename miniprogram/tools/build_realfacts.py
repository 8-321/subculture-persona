# -*- coding: utf-8 -*-
"""真实文化档案 JSON → miniprogram/data/realfacts.js
用法：python miniprogram/tools/build_realfacts.py
口径：字典顺序、ASCII 转义关掉（界面要中文），键名与 JSON 一一对应。
"""
import io, json, os

SRC = os.path.join(os.path.dirname(__file__), '..', '..', '05-需求V3', '真实文化档案_14型.json')
OUT = os.path.join(os.path.dirname(__file__), '..', 'data', 'realfacts.js')

data = json.load(io.open(SRC, encoding='utf-8'))
head = (
    '// 本文件由 tools/build_realfacts.py 自动生成，请勿手改\n'
    '// 来源：05-需求V3/真实文化档案_14型.json（每条 facts 带 src，指向 sources_index 的可核对链接）\n'
    '// 硬规则：这里只放可溯源事实；价格不写进档案（价格只能由入驻商家后台录入）。\n\n'
)
body = 'const realfacts = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n\n'
tail = """const byId = {};
realfacts.types.forEach(function (t) { byId[t.id] = t; });

/* 结果页「文化溯源」一行：只取该型的起源与标志物，不堆字 */
function originLine(id) {
  var t = byId[id] || byId[String(id || '').toUpperCase()];
  if (!t) return '';
  return t.cn + '：' + t.origin.year + ' · ' + t.origin.place;
}

/* 知识库正文引用：把 src 代号换成可复制的来源名 */
function sourceOf(code) {
  var url = (realfacts.meta.sources_index || {})[code] || '';
  return url;
}

module.exports = { meta: realfacts.meta, types: realfacts.types, market: realfacts.market, ownMetrics: realfacts.own_metrics, byId: byId, originLine: originLine, sourceOf: sourceOf };
"""
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(head + body + tail)
print('written', OUT, len(data['types']), 'types')
