# -*- coding: utf-8 -*-
"""把 05-需求V3 里整理好的真实文章替换进 miniprogram/data/content.js 的 articles 块，
并给示例数据打 demo 标记。可重复执行（幂等）。
"""
import io, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TARGET = os.path.join(ROOT, 'miniprogram', 'data', 'content.js')
SRC = os.path.join(ROOT, '05-需求V3', '知识库文章_源.js')

new_block = io.open(SRC, encoding='utf-8').read().rstrip() + '\n'
raw = io.open(TARGET, encoding='utf-8', newline='').read()
eol = '\r\n' if '\r\n' in raw else '\n'
new_block = new_block.replace('\r\n', '\n').replace('\n', eol)

start = raw.index('const articles = [')
end_marker = eol + '];' + eol
end = raw.index(end_marker, start) + len(end_marker)
old = raw[start:end]
raw = raw[:start] + new_block + raw[end:]

# 示例数据打标记（只打一次）
if 'markDemo' not in raw:
    helper = (
        eol + '/* ---------------- 示例数据标记（《需求 V3.0》§4） ----------------' + eol +
        '   每条示例数据带 demo=true：正式版据此隐藏无后台来源的数字（粉丝/好评率/销量/人测过）。' + eol +
        '   商家真实录入的数据不带这个标记，所以不依赖它隐藏。 */' + eol +
        'function markDemo(list) {' + eol +
        '  (list || []).forEach(function (x) { x.demo = true; });' + eol +
        '  return list;' + eol +
        '}' + eol + eol
    )
    anchor = 'const P = '  # 插在文件常量区之后更安全，这里放在导出前
    pos = raw.index('module.exports')
    raw = raw[:pos] + helper + raw[pos:]
    raw = raw.replace('  tests: tests,', '  tests: markDemo(tests),')
    raw = raw.replace('  products: products,', '  products: markDemo(products),')
    raw = raw.replace('  shops: shops,', '  shops: markDemo(shops),')
    raw = raw.replace('  posts: posts,', '  posts: markDemo(posts),')
    raw = raw.replace('  articles: articles,', '  articles: markDemo(articles),')

io.open(TARGET, 'w', encoding='utf-8', newline='').write(raw)
print('articles 块已替换：', len(old), '→', len(new_block), '字符；EOL =', repr(eol))
