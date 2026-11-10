# -*- coding: utf-8 -*-
"""第二文化 · 音效素材生成（纯 Python，无第三方依赖）
输出：miniprogram/audio/*.wav
规格：单声道 / 16bit / 22050Hz（体积优先，全部音效合计 < 90KB）

设计对齐《第二文化_动效设计规范》：
  tap    轻点     40ms   高频木感，按钮按下
  pop    弹性     140ms  上滑 + 过冲，收藏 / 选中
  slide  抽屉     260ms  噪声下扫，抽屉升起 / 落下
  whoosh 转场     320ms  带通扫频，页面跳转
  chime  完成     720ms  三音和弦，结果生成
  warn   提示     220ms  低频双击，错误 / 拦截
  tick   码表     60ms   极短促，滚动吸附每格
"""

import os
import math
import wave
import struct
import random

SR = 22050
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'audio')


def write(name, samples):
    if not os.path.isdir(OUT):
        os.makedirs(OUT)
    path = os.path.join(OUT, name + '.wav')
    n = len(samples)
    raw = bytearray()
    for v in samples:
        v = max(-1.0, min(1.0, v))
        raw += struct.pack('<h', int(v * 32767))
    w = wave.open(path, 'wb')
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(bytes(raw))
    w.close()
    return path, n


def dur(sec):
    return int(SR * sec)


def env_attack_decay(i, n, attack=0.02):
    """极短 attack + 指数衰减包络"""
    a = max(1, int(n * attack))
    if i < a:
        return i / float(a)
    k = (i - a) / float(max(1, n - a))
    return math.pow(1.0 - k, 2.2)


def sine(freq, phase=0.0):
    return math.sin(phase * 2.0 * math.pi * freq)


def glide(f0, f1, k):
    """频率线性滑音"""
    return f0 + (f1 - f0) * k


def mix(*gens):
    n = max(len(g) for g in gens)
    out = [0.0] * n
    for g in gens:
        for i, v in enumerate(g):
            out[i] += v
    return out


def norm(samples, peak=0.92):
    m = max(abs(v) for v in samples) or 1.0
    k = peak / m
    return [v * k for v in samples]


def fade_edges(samples, fin=40, fout=120):
    n = len(samples)
    for i in range(min(fin, n)):
        samples[i] *= i / float(fin)
    for i in range(min(fout, n)):
        j = n - 1 - i
        samples[j] *= i / float(fout)
    return samples


# ---------------------------------------------------------------- tap
def gen_tap():
    n = dur(0.045)
    out = []
    for i in range(n):
        t = i / float(SR)
        e = env_attack_decay(i, n, 0.06)
        f = glide(1500, 780, i / float(n))
        body = sine(f, t) * 0.9
        click = (random.random() * 2 - 1) * 0.18 * math.pow(1 - i / float(n), 6)
        out.append((body + click) * e * 0.55)
    return fade_edges(out, 8, 60)


# ---------------------------------------------------------------- pop
def gen_pop():
    n = dur(0.15)
    out = []
    for i in range(n):
        t = i / float(SR)
        k = i / float(n)
        e = env_attack_decay(i, n, 0.03)
        f = glide(420, 1180, math.pow(k, 0.6))
        body = sine(f, t) * 0.85
        harm = sine(f * 2.0, t) * 0.16 * math.pow(1 - k, 3)
        out.append((body + harm) * e * 0.62)
    return fade_edges(out, 6, 90)


# ---------------------------------------------------------------- slide（抽屉）
def gen_slide():
    n = dur(0.28)
    out = []
    lp = 0.0
    for i in range(n):
        k = i / float(n)
        e = math.sin(math.pi * math.pow(k, 0.85))  # 钟形，起落都柔
        noise = random.random() * 2 - 1
        # 一阶低通，中心频率从 900 扫到 2600 再回落
        c = 0.045 + 0.16 * math.sin(math.pi * k)
        lp += c * (noise - lp)
        tone = sine(glide(320, 180, k), i / float(SR)) * 0.18
        out.append((lp * 1.5 + tone) * e * 0.42)
    return fade_edges(out, 30, 120)


# ---------------------------------------------------------------- whoosh（转场）
def gen_whoosh():
    n = dur(0.34)
    out = []
    hp = 0.0
    prev = 0.0
    for i in range(n):
        k = i / float(n)
        e = math.sin(math.pi * math.pow(k, 0.72))
        noise = random.random() * 2 - 1
        # 带通近似：一阶高通 + 一阶低通，中心随 k 上升
        lo_c = 0.06 + 0.30 * k
        hp += lo_c * (noise - hp)
        band = hp - prev
        prev = hp
        out.append(band * e * 1.15)
    return fade_edges(out, 20, 140)


# ---------------------------------------------------------------- chime（完成）
def gen_chime():
    n = dur(0.78)
    notes = [(0.00, 0.62, 880.0), (0.10, 0.55, 1174.7), (0.20, 0.58, 1567.9)]
    out = [0.0] * n
    for off, amp, f in notes:
        s = int(off * SR)
        ln = int(0.62 * SR)
        for i in range(ln):
            if s + i >= n:
                break
            t = i / float(SR)
            e = math.pow(1 - i / float(ln), 2.4)
            a = math.sin(2 * math.pi * f * t) * 0.7
            a += math.sin(2 * math.pi * f * 2 * t) * 0.12
            a += math.sin(2 * math.pi * f * 3 * t) * 0.05
            out[s + i] += a * e * amp
        # 起音柔化避免爆音
    return fade_edges(out, 60, 240)


# ---------------------------------------------------------------- warn（提示）
def gen_warn():
    n = dur(0.24)
    out = []
    for i in range(n):
        t = i / float(SR)
        k = i / float(n)
        # 两下：0~45% 与 55%~100%
        seg = 0.0 if k < 0.48 else 1.0
        local = (k % 0.52) / 0.52
        e = math.pow(1 - local, 2.0) * (0.55 if k < 0.48 else 1.0)
        f = 196.0 if seg == 0 else 164.0
        a = sine(f, t) * 0.8 + sine(f * 2, t) * 0.2
        out.append(a * e * 0.5)
    return fade_edges(out, 10, 80)


# ---------------------------------------------------------------- tick（码表吸附）
def gen_tick():
    n = dur(0.05)
    out = []
    for i in range(n):
        t = i / float(SR)
        k = i / float(n)
        e = math.pow(1 - k, 3.4)
        f = glide(2400, 1600, k)
        a = sine(f, t) * 0.5 + (random.random() * 2 - 1) * 0.3 * math.pow(1 - k, 8)
        out.append(a * e * 0.42)
    return fade_edges(out, 4, 50)


random.seed(20261008)

SPECS = [
    ('tap', gen_tap),
    ('pop', gen_pop),
    ('slide', gen_slide),
    ('whoosh', gen_whoosh),
    ('chime', gen_chime),
    ('warn', gen_warn),
    ('tick', gen_tick)
]

total = 0
print('输出目录：' + OUT)
for name, fn in SPECS:
    samples = norm(fn())
    p, n = write(name, samples)
    size = os.path.getsize(p)
    total += size
    print('  %-8s %5.2fs  %6d B' % (name + '.wav', n / float(SR), size))
print('合计 %.1f KB' % (total / 1024.0))
