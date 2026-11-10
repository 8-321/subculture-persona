#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""把 04-测试体系 的题库 / 人格库 JSON 转成小程序 data/*.js。

来源：
  E:\\亚文化小程序开发\\04-测试体系\\题库_爆款版.json   → data/bank.js
  E:\\亚文化小程序开发\\04-测试体系\\人格库_14型.json   → data/types.js
"""
import json
import os

SRC = r"E:\亚文化小程序开发\04-测试体系"
OUT = r"E:\亚文化小程序开发\miniprogram\data"

HEADER = "// 本文件由 tools/build_data.py 自动生成，请勿手改\n// 来源：04-测试体系/《题库_爆款版.json》《人格库_14型.json》\n"


def dump_js(name, var, meta, payload):
    lines = [HEADER, "const %s = %s;" % (var, json.dumps(payload, ensure_ascii=False, indent=1))]
    if meta:
        lines.insert(1, "const meta = %s;" % json.dumps(meta, ensure_ascii=False, indent=1))
        lines.append("module.exports = { meta: meta, %s: %s };" % (var, var))
    else:
        lines.append("module.exports = %s;" % var)
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print("wrote", path, os.path.getsize(path) // 1024, "KB")


def main():
    bank = json.load(open(os.path.join(SRC, "题库_爆款版.json"), encoding="utf-8"))
    dump_js("bank.js", "bank", bank["meta"], bank["questions"])

    types = json.load(open(os.path.join(SRC, "人格库_14型.json"), encoding="utf-8"))
    dump_js("types.js", "types", types["meta"], types["types"])


if __name__ == "__main__":
    main()
