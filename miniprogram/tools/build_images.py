#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""把 01-UI/assets 的定稿素材压缩进小程序 images/ui/。

口径（需求文档 4.1）：
  缩略图 ≤ 60KB（1:1，导出 400×400）
  首屏图 ≤ 180KB（3:4，导出 750×1000）
  结果主图 750×750
全部 JPEG、真实色彩，不做任何蒙版/色调处理（硬规则 R5）。

用法：python build_images.py
"""
import os
import sys
from PIL import Image

SRC = r"E:\亚文化小程序开发\01-UI\assets"
OUT = r"E:\亚文化小程序开发\miniprogram\images\ui"

# 1:1 方形（列表缩略图 / 人格头像 / 选项图 / 商品图）
SQUARE = {
    "p-biker": 400, "p-cyber": 400, "p-dance": 400, "p-dark": 400,
    "p-gothic": 400, "p-hiphop": 400, "p-jk": 400, "p-lolita": 400,
    "p-punk": 400, "p-rock": 400, "p-skate": 400, "p-street": 400,
    "p-trend": 400, "p-vaporwave": 400,
    "q-a": 400, "q-b": 400, "q-c": 400, "q-d": 400, "m-q-b": 400,
    "shop-lolita": 400, "shop-jacket": 400, "shop-cyber": 400, "shop-street": 400,
    "know-1": 400, "know-2": 400, "know-3": 400,
    "home-brand": 400, "home-knowledge": 400, "home-product": 400, "home-test": 400,
}

# 3:4 大图（首页主视觉 / 测试封面 / 轮播）
PORTRAIT = {
    "lt-t10": (750, 1000),
    "lt-t03": (750, 1000),
    "lt-t07": (750, 1000),
    "lt-t09": (750, 1000),
    "m-test-hero": (750, 1000),
    "test-hero": (750, 1000),
}

# 1:1 大图（结果页主图 / 我的页头）
BIG = {
    "m-result-punk": (750, 750),
    "result-punk": (750, 750),
}


def cover(src, dst, size, quality):
    im = Image.open(src)
    im = im.convert("RGB")
    tw, th = size
    sw, sh = im.size
    scale = max(tw / float(sw), th / float(sh))
    nw, nh = int(round(sw * scale)), int(round(sh * scale))
    im = im.resize((nw, nh), Image.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    im = im.crop((left, top, left + tw, top + th))
    im.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)
    return os.path.getsize(dst)


def main():
    os.makedirs(OUT, exist_ok=True)
    total = 0
    rows = []
    for name, size in SQUARE.items():
        src = os.path.join(SRC, name + ".jpg")
        if not os.path.exists(src):
            print("MISS", name)
            continue
        dst = os.path.join(OUT, name + ".jpg")
        n = cover(src, dst, (size, size), 72)
        total += n
        rows.append((name, n))

    for name, size in PORTRAIT.items():
        src = os.path.join(SRC, name + ".jpg")
        if not os.path.exists(src):
            print("MISS", name)
            continue
        dst = os.path.join(OUT, name + ".jpg")
        n = cover(src, dst, size, 70)
        total += n
        rows.append((name, n))

    for name, size in BIG.items():
        src = os.path.join(SRC, name + ".jpg")
        if not os.path.exists(src):
            print("MISS", name)
            continue
        dst = os.path.join(OUT, name + ".jpg")
        n = cover(src, dst, size, 70)
        total += n
        rows.append((name, n))

    rows.sort(key=lambda r: -r[1])
    print("--- top 10 by size ---")
    for name, n in rows[:10]:
        print("  %-16s %6.1f KB" % (name, n / 1024.0))
    print("files=%d  total=%.2f MB" % (len(rows), total / 1024.0 / 1024.0))
    if total > 2 * 1024 * 1024:
        print("WARN: 图片总量超过 2MB，建议部分改为 CDN")


if __name__ == "__main__":
    main()
