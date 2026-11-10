#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""生成小程序全站图标（纯 Python 手写 PNG，3x 超采样抗锯齿，无 PIL 依赖）。

输出：
  images/tab/{home,test,culture,shop,mine}.png / *-active.png   tabBar 81×81
  images/ic/{name}-ink.png / {name}-white.png                   页面图标 96×96

主色口径：普通态 #8A8A93、激活态 / 墨色 #141418、深底反白 #FFFFFF。
图标一律线性、无彩色（硬规则 R2/R3）。
"""
import zlib
import struct
import os
import math


def _sqrt(v):
    return math.sqrt(v) if v > 0 else 0.0

INK = (20, 20, 24)
GRAY = (138, 138, 147)
WHITE = (255, 255, 255)


# ---------------- PNG 写出 ----------------
def png_chunk(tag, data):
    chunk = tag + data
    return struct.pack(">I", len(data)) + chunk + struct.pack(">I", zlib.crc32(chunk) & 0xFFFFFFFF)


def write_png(path, w, h, rgba_rows):
    raw = b"".join(b"\x00" + b"".join(struct.pack("BBBB", *px) for px in row) for row in rgba_rows)
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)
    data = (b"\x89PNG\r\n\x1a\n" + png_chunk(b"IHDR", ihdr)
            + png_chunk(b"IDAT", zlib.compress(raw, 9)) + png_chunk(b"IEND", b""))
    with open(path, "wb") as f:
        f.write(data)


# ---------------- 几何 ----------------
def seg_dist(px, py, x0, y0, x1, y1):
    dx, dy = x1 - x0, y1 - y0
    if dx == 0 and dy == 0:
        return _sqrt((px - x0) ** 2 + (py - y0) ** 2)
    t = ((px - x0) * dx + (py - y0) * dy) / float(dx * dx + dy * dy)
    t = max(0.0, min(1.0, t))
    return _sqrt((px - (x0 + t * dx)) ** 2 + (py - (y0 + t * dy)) ** 2)


def stroke(x0, y0, x1, y1, w):
    half = w / 2.0
    return lambda x, y: seg_dist(x, y, x0, y0, x1, y1) <= half


def circle(cx, cy, r, w=None):
    if w is None:
        return lambda x, y: (x - cx) ** 2 + (y - cy) ** 2 <= r * r
    outer, inner = r + w / 2.0, max(0.0, r - w / 2.0)
    return lambda x, y: inner ** 2 <= (x - cx) ** 2 + (y - cy) ** 2 <= outer ** 2


def disc(cx, cy, r):
    return circle(cx, cy, r)


def rect(x0, y0, x1, y1, rx=0.0):
    def f(x, y):
        if not (x0 <= x <= x1 and y0 <= y <= y1):
            return False
        if rx <= 0:
            return True
        cx = min(max(x, x0 + rx), x1 - rx)
        cy = min(max(y, y0 + rx), y1 - rx)
        return (x - cx) ** 2 + (y - cy) ** 2 <= rx * rx or x0 + rx <= x <= x1 - rx or y0 + rx <= y <= y1 - rx
    return f


def ellipse(cx, cy, rx, ry):
    return lambda x, y: ((x - cx) / float(rx)) ** 2 + ((y - cy) / float(ry)) ** 2 <= 1.0


def ring_ellipse(cx, cy, rx, ry, w):
    def f(x, y):
        s = ((x - cx) / float(rx)) ** 2 + ((y - cy) / float(ry)) ** 2
        si = ((x - cx) / float(max(rx - w, 1))) ** 2 + ((y - cy) / float(max(ry - w, 1))) ** 2
        return s <= 1.0 and si >= 1.0
    return f


def tri(a, b, c):
    def sign(p1, p2, p3):
        return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])

    def f(x, y):
        d1, d2, d3 = sign((x, y), a, b), sign((x, y), b, c), sign((x, y), c, a)
        neg = (d1 < 0) or (d2 < 0) or (d3 < 0)
        pos = (d1 > 0) or (d2 > 0) or (d3 > 0)
        return not (neg and pos)
    return f


# ---------------- 图标定义（96 网格） ----------------
def S(scale_shapes, k):
    return [lambda x, y, f=f: f(x / k, y / k) for f in scale_shapes]


def ic_home():
    return [
        tri((48, 14), (12, 46), (84, 46)),
        lambda x, y: rect(22, 44, 74, 80, 2)(x, y) and not rect(40, 58, 56, 80, 0)(x, y),
    ]


def ic_test():
    # 烧瓶：顶口 + 颈 + 圆腹 + 底座
    return [
        rect(32, 12, 64, 20, 3),
        rect(42, 18, 54, 40),
        disc(48, 56, 22),
        rect(26, 76, 70, 82, 3),
    ]


def ic_logo():
    # 商标：圆环 + 两条横杠（64 网格等比 ×1.5 → 96 网格）
    return [
        circle(48, 48, 39.75, 13.5),
        rect(24, 29, 72, 43, 7),
        rect(24, 52, 72, 66, 7),
    ]


def ic_bag():
    return [
        lambda x, y: circle(48, 30, 15, 7)(x, y) and y <= 30,
        rect(14, 30, 82, 84, 6),
    ]


def ic_user():
    return [
        disc(48, 32, 17),
        lambda x, y: ellipse(48, 74, 26, 24)(x, y) and y >= 48,
    ]


def ic_back():
    return [stroke(60, 20, 34, 48, 8), stroke(34, 48, 60, 76, 8)]


def ic_fwd():
    return [stroke(36, 20, 62, 48, 8), stroke(62, 48, 36, 76, 8)]


def ic_down():
    return [stroke(24, 38, 48, 64, 8), stroke(48, 64, 72, 38, 8)]


def ic_updown():
    return [stroke(34, 26, 34, 70, 7), tri((34, 20), (22, 34), (46, 34)),
            stroke(62, 26, 62, 70, 7), tri((62, 76), (50, 62), (74, 62))]


def ic_search():
    return [circle(42, 42, 27, 8), stroke(62, 62, 84, 84, 10)]


def ic_heart():
    return [
        lambda x, y: (circle(34, 38, 17, 7)(x, y) or circle(62, 38, 17, 7)(x, y)) and y <= 56,
        lambda x, y: stroke(21, 40, 48, 82, 7)(x, y),
        lambda x, y: stroke(75, 40, 48, 82, 7)(x, y),
    ]


def ic_heart_fill():
    return [
        disc(34, 40, 19), disc(62, 40, 19),
        tri((18, 40), (78, 40), (48, 84)),
    ]


def ic_share():
    return [
        disc(72, 22, 10), disc(24, 46, 10), disc(72, 70, 10),
        stroke(63, 28, 33, 40, 7), stroke(33, 52, 63, 64, 7),
    ]


def ic_more():
    return [disc(20, 48, 8), disc(48, 48, 8), disc(76, 48, 8)]


def ic_filter():
    return [
        stroke(16, 28, 80, 28, 7), stroke(16, 48, 80, 48, 7), stroke(16, 68, 80, 68, 7),
        disc(34, 28, 11), disc(62, 48, 11), disc(40, 68, 11),
    ]


def ic_clock():
    return [circle(48, 48, 34, 7), stroke(48, 26, 48, 50, 7), stroke(48, 48, 66, 56, 7)]


def ic_eye():
    return [ring_ellipse(48, 48, 40, 26, 7), disc(48, 48, 13)]


def ic_plus():
    return [stroke(48, 18, 48, 78, 8), stroke(18, 48, 78, 48, 8)]


def ic_check():
    return [stroke(20, 50, 40, 70, 9), stroke(40, 70, 78, 28, 9)]


def ic_close():
    return [stroke(24, 24, 72, 72, 8), stroke(72, 24, 24, 72, 8)]


def ic_bookmark():
    return [lambda x, y: rect(24, 14, 72, 84, 4)(x, y) and not tri((38, 84), (58, 84), (48, 60))(x, y)]


def ic_music():
    return [
        rect(28, 20, 38, 62, 3), disc(24, 66, 12),
        rect(58, 14, 68, 56, 3), disc(54, 60, 12),
        stroke(28, 24, 66, 18, 7),
    ]


def ic_play():
    return [tri((34, 18), (34, 78), (80, 48))]


def ic_voice():
    return [
        tri((18, 38), (18, 58), (40, 48)),
        rect(40, 40, 48, 56),
        circle(48, 48, 24, 6),
        circle(48, 48, 36, 6),
    ]


def ic_grid():
    return [rect(14, 14, 44, 44, 4), rect(52, 14, 82, 44, 4),
            rect(14, 52, 44, 82, 4), rect(52, 52, 82, 82, 4)]


def ic_crown():
    return [
        tri((14, 66), (48, 24), (82, 66)),
        rect(14, 66, 82, 78, 3),
        disc(14, 26, 7), disc(82, 26, 7),
    ]


def ic_edit():
    return [
        stroke(24, 72, 66, 30, 7),
        tri((66, 30), (78, 18), (80, 38)),
        stroke(20, 84, 34, 70, 7),
    ]


def ic_trash():
    return [
        rect(24, 20, 72, 30, 4),
        rect(40, 12, 56, 22, 3),
        rect(32, 32, 64, 84, 4),
        stroke(44, 44, 44, 72, 6), stroke(60, 44, 60, 72, 6),
    ]


def ic_moon():
    return [
        lambda x, y: circle(44, 48, 34, 0)(x, y) and not circle(66, 38, 30, 0)(x, y),
    ]


def ic_sun():
    return [
        disc(48, 48, 18),
        circle(48, 48, 36, 7),
    ]


def ic_camera():
    return [
        rect(12, 28, 84, 78, 8),
        rect(36, 16, 60, 32, 4),
        disc(48, 53, 16),
    ]


def ic_image():
    return [
        lambda x, y: rect(12, 20, 84, 76, 6)(x, y),
        disc(32, 38, 8),
        tri((20, 76), (52, 44), (84, 76)),
    ]


def ic_help():
    return [
        circle(48, 48, 34, 7),
        lambda x, y: (circle(48, 40, 10, 7)(x, y)) and y <= 42,
        stroke(44, 52, 44, 60, 7), disc(48, 68, 5),
    ]


def ic_info():
    return [circle(48, 48, 34, 7), disc(48, 26, 7), stroke(48, 40, 48, 68, 7)]


def ic_shield():
    return [
        lambda x, y: (tri((48, 12), (12, 32), (12, 60))(x, y) or tri((48, 12), (84, 32), (84, 60))(x, y)
                      or rect(12, 32, 84, 78, 0)(x, y)) and ((x - 48) ** 2 / 900.0 + (y - 78) ** 2 / 400.0 <= 1.0
                                                             or y <= 62),
        stroke(34, 48, 44, 60, 7), stroke(44, 60, 64, 38, 7),
    ]


def ic_logout():
    return [
        stroke(46, 20, 24, 48, 7), stroke(24, 48, 46, 76, 7),
        stroke(18, 48, 60, 48, 7),
        rect(56, 24, 84, 72, 4),
        stroke(74, 40, 74, 56, 7),
    ]


def ic_bell():
    return [
        lambda x, y: ellipse(48, 44, 26, 24)(x, y) and y >= 40,
        rect(30, 62, 66, 72, 4),
        disc(48, 80, 8),
    ]


def ic_fire():
    return [
        lambda x, y: ellipse(48, 56, 22, 28)(x, y),
        lambda x, y: ellipse(40, 34, 12, 18)(x, y),
        lambda x, y: ellipse(60, 30, 9, 14)(x, y),
    ]


ICONS = {
    "home": ic_home, "test": ic_test, "culture": ic_logo, "bag": ic_bag, "user": ic_user,
    "back": ic_back, "fwd": ic_fwd, "down": ic_down, "updown": ic_updown,
    "search": ic_search, "heart": ic_heart, "heart-fill": ic_heart_fill, "share": ic_share,
    "more": ic_more, "filter": ic_filter, "clock": ic_clock, "eye": ic_eye,
    "plus": ic_plus, "check": ic_check, "close": ic_close, "bookmark": ic_bookmark,
    "music": ic_music, "play": ic_play, "voice": ic_voice, "grid": ic_grid,
    "crown": ic_crown, "edit": ic_edit, "trash": ic_trash, "moon": ic_moon,
    "sun": ic_sun, "camera": ic_camera, "image": ic_image, "help": ic_help,
    "info": ic_info, "shield": ic_shield, "logout": ic_logout, "bell": ic_bell,
    "fire": ic_fire, "logo": ic_logo,
}


def render(shapes, size, color, ss=3):
    """3x 超采样渲染，返回 RGBA 行列表"""
    rows = []
    for py in range(size):
        row = []
        for px in range(size):
            hits = 0
            for sy in range(ss):
                for sx in range(ss):
                    x = px + (sx + 0.5) / ss
                    y = py + (sy + 0.5) / ss
                    if any(f(x, y) for f in shapes):
                        hits += 1
            a = int(round(255.0 * hits / (ss * ss)))
            row.append((color[0], color[1], color[2], a))
        rows.append(row)
    return rows


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    tab_dir = os.path.join(base, "images", "tab")
    ic_dir = os.path.join(base, "images", "ic")
    os.makedirs(tab_dir, exist_ok=True)
    os.makedirs(ic_dir, exist_ok=True)

    # tabBar 图标 81×81
    tab = {"home": "home", "test": "test", "culture": "culture", "shop": "bag", "mine": "user"}
    for key, shape_key in tab.items():
        k = 81.0 / 96.0
        shapes = S(ICONS[shape_key](), 1.0)
        scaled = [lambda x, y, f=f: f(x / k, y / k) for f in shapes]
        write_png(os.path.join(tab_dir, key + ".png"), 81, 81, render(scaled, 81, GRAY))
        write_png(os.path.join(tab_dir, key + "-active.png"), 81, 81, render(scaled, 81, INK))

    # 页面图标 96×96：ink（浅底）+ white（深底）
    for name, fn in ICONS.items():
        shapes = fn()
        write_png(os.path.join(ic_dir, name + "-ink.png"), 96, 96, render(shapes, 96, INK))
        write_png(os.path.join(ic_dir, name + "-white.png"), 96, 96, render(shapes, 96, WHITE))

    print("tab icons:", len(tab) * 2, "->", tab_dir)
    print("page icons:", len(ICONS) * 2, "->", ic_dir)


if __name__ == "__main__":
    main()
