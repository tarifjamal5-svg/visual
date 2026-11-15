"""Синтез фона и звуковых эффектов кодом (numpy). Всё - собственная работа, CC0.

python3 -I sfx.py <outdir>
"""
import sys, os, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(317)


def save(path, x, sr=SR):
    x = np.asarray(x, dtype=np.float64)
    peak = np.max(np.abs(x)) or 1.0
    x = x / peak * 0.89
    if x.ndim == 1:
        x = x[:, None]
    data = (np.clip(x, -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(data.shape[1]); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes(data.tobytes())


def t_(sec):
    return np.arange(int(sec * SR)) / SR


def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc; y[i] = acc
    return y


def fft_filter(x, lo=None, hi=None, tilt=0.0):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo:
        g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4)
    if hi:
        g *= 1 / np.sqrt(1 + (f / hi) ** 4)
    if tilt:
        g *= (np.maximum(f, 20) / 1000.0) ** tilt
    return np.fft.irfft(X * g, n=len(x))


def noise(sec):
    return rng.standard_normal(int(sec * SR))


def pink(sec):
    return fft_filter(noise(sec), tilt=-0.5)


def bandpass_sweep(x, fc_curve, q=6.0):
    # state-variable filter с меняющейся частотой
    y = np.zeros_like(x); low = band = 0.0
    for i in range(len(x)):
        f = 2 * np.sin(np.pi * min(fc_curve[i], SR / 6) / SR)
        high = x[i] - low - band / q
        band += f * high
        low += f * band
        y[i] = band
    return y


def fade(x, a=0.01, b=0.05):
    n = len(x); ia, ib = int(a * SR), int(b * SR)
    env = np.ones(n)
    if ia: env[:ia] = np.linspace(0, 1, ia)
    if ib: env[-ib:] = np.linspace(1, 0, ib)
    return x * env


def drone(sec=95):
    t = t_(sec)
    x = np.zeros_like(t)
    # низкий кластер: A1, E2, A2 + расстройка, медленное «дыхание»
    for f, a, ph in [(55, 1.0, 0), (55.4, 0.8, 1), (82.4, 0.5, 2), (110, 0.35, 3), (116.5, 0.12, 4)]:
        lfo = 0.6 + 0.4 * np.sin(2 * np.pi * (0.03 + ph * 0.011) * t + ph)
        x += a * lfo * np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.07 * t + ph))
    # мягкая «пила» через фильтр для плотности
    saw = sum(np.sin(2 * np.pi * 55 * k * t) / k for k in range(1, 9))
    x += 0.25 * fft_filter(saw, hi=300)
    # воздух: розовый шум, низ и середина, медленно дышит
    air = fft_filter(pink(sec), lo=80, hi=900)
    air *= 0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * t) ** 2
    x += 0.6 * air / np.std(air) * np.std(x) * 0.35
    # редкий высокий диссонанс (тревожный «звон»)
    for c in [14, 38, 61]:
        env = np.exp(-((t - c) / 3.0) ** 2)
        x += 0.08 * env * (np.sin(2 * np.pi * 1244.5 * t) + np.sin(2 * np.pi * 1318.5 * t))
    return fade(x, 2.0, 3.0)


def rain(sec=30):
    base = fft_filter(noise(sec), lo=400, hi=7000)
    base *= 0.8 + 0.2 * np.sin(2 * np.pi * 0.13 * t_(sec))
    drops = np.zeros(int(sec * SR))
    for _ in range(int(sec * 55)):
        p = rng.integers(0, len(drops) - 2000)
        L = rng.integers(200, 900)
        drops[p:p + L] += rng.uniform(0.3, 1.0) * np.exp(-np.arange(L) / (L / 5)) * rng.standard_normal(L)
    drops = fft_filter(drops, lo=1500, hi=9000)
    x = base / np.std(base) + 0.6 * drops / np.std(drops)
    # бесшовная петля: перекрёстное затухание конца в начало
    n = int(2 * SR)
    x[:n] = x[:n] * np.linspace(0, 1, n) + x[-n:] * np.linspace(1, 0, n)
    return x[:-n]


def wind(sec=20):
    t = t_(sec)
    fc = 350 + 250 * np.sin(2 * np.pi * 0.11 * t) + 120 * np.sin(2 * np.pi * 0.37 * t + 1)
    x = bandpass_sweep(pink(sec), fc, q=5)
    x *= 0.55 + 0.45 * np.sin(2 * np.pi * 0.08 * t + 0.5) ** 2
    return fade(x, 1.5, 1.5)


def breath(cycles=3):
    out = []
    for i in range(cycles):
        for dur, shape, fc in [(1.15, 'in', 1500), (1.5, 'out', 900), (0.35, 'gap', 0)]:
            n = int(dur * SR)
            if shape == 'gap':
                out.append(np.zeros(n)); continue
            tt = np.linspace(0, 1, n)
            env = np.sin(np.pi * tt) ** (1.6 if shape == 'in' else 1.2)
            if shape == 'out':
                env *= np.exp(-tt * 0.8)
            nz = noise(dur)
            fcv = fc + 500 * (tt if shape == 'in' else (1 - tt))
            y = bandpass_sweep(nz, fcv, q=2.2)
            y += 0.35 * fft_filter(nz, lo=2500, hi=6000)
            out.append(y * env * (1.0 if shape == 'in' else 0.85))
    return fade(np.concatenate(out), 0.02, 0.2)


def metal_click(n_hits=2, spacing=0.09):
    sec = 0.25 + n_hits * spacing
    x = np.zeros(int(sec * SR))
    for k in range(n_hits):
        p = int((0.02 + k * spacing) * SR)
        L = int(0.12 * SR); tt = np.arange(L) / SR
        hit = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, d in [(2350, 60), (3900, 90), (5400, 120), (1480, 45)])
        hit += 0.8 * rng.standard_normal(L) * np.exp(-tt * 300)
        x[p:p + L] += hit * (1.0 if k == n_hits - 1 else 0.6)
    return fade(x, 0.001, 0.05)


def key_in_lock():
    # скрежет ключа + два щелчка
    scr_sec = 0.45
    tt = t_(scr_sec)
    scr = bandpass_sweep(noise(scr_sec), 2500 + 1500 * tt / scr_sec, q=8) * (0.3 + 0.7 * np.abs(np.sin(2 * np.pi * 9 * tt)))
    scr = fade(scr, 0.02, 0.05) * 0.5
    cl = metal_click(2, 0.16)
    return np.concatenate([scr, np.zeros(int(0.12 * SR)), cl])


def creak(sec=1.8):
    # stick-slip: поток импульсов с плавающей частотой через резонансы дерева
    t = t_(sec)
    rate = 55 + 45 * np.sin(np.pi * t / sec) + 15 * np.sin(2 * np.pi * 3.3 * t)
    phase = np.cumsum(rate / SR)
    pulses = (np.diff(np.floor(phase), prepend=0) > 0).astype(float)
    pulses *= rng.uniform(0.5, 1.0, len(pulses))
    y = np.zeros_like(t)
    for f, q, a in [(620, 18, 1.0), (1180, 22, 0.7), (2350, 25, 0.4), (340, 12, 0.6)]:
        y += a * bandpass_sweep(pulses, np.full_like(t, f) * (1 + 0.04 * np.sin(2 * np.pi * 1.7 * t)), q=q)
    env = np.sin(np.pi * np.clip(t / sec, 0, 1)) ** 0.7
    return fade(y * env, 0.03, 0.15)


def footstep():
    sec = 0.35; tt = t_(sec)
    thump = np.sin(2 * np.pi * (70 + 40 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 22)
    scuff = fft_filter(noise(sec), lo=300, hi=2500) * np.exp(-tt * 35) * 0.4
    return fade(thump + scuff, 0.001, 0.05)


def footsteps(n=4, gap=0.62):
    out = np.zeros(int((n * gap + 0.5) * SR))
    for i in range(n):
        s = footstep() * rng.uniform(0.7, 1.0)
        p = int((i * gap + rng.uniform(-0.03, 0.03) + 0.02) * SR)
        out[p:p + len(s)] += s
    return out


def heartbeat(n=6, bpm=62):
    gap = 60 / bpm
    out = np.zeros(int((n * gap + 0.6) * SR))
    for i in range(n):
        for off, a in [(0, 1.0), (0.24, 0.7)]:
            tt = t_(0.25)
            b = np.sin(2 * np.pi * (48 + 20 * np.exp(-tt * 25)) * tt) * np.exp(-tt * 18) * a
            p = int((i * gap + off) * SR)
            out[p:p + len(b)] += b
    return fft_filter(out, hi=180)


def boom(sec=3.5):
    tt = t_(sec)
    f = 30 + 90 * np.exp(-tt * 3)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.1)
    x += 0.3 * fft_filter(noise(sec), hi=400) * np.exp(-tt * 4)
    return fade(x, 0.002, 0.4)


def glitch(sec=0.35):
    x = noise(sec)
    # бит-краш и «заикание»
    step = 18
    x = np.repeat(x[::step], step)[:int(sec * SR)]
    gate = (np.sin(2 * np.pi * 37 * t_(sec)) > 0).astype(float) * 0.7 + 0.3
    tone = np.sign(np.sin(2 * np.pi * 950 * t_(sec))) * 0.25
    return fade((x * 0.6 + tone) * gate, 0.002, 0.03)


def beep():
    tt = t_(0.18)
    return fade(np.sin(2 * np.pi * 2093 * tt) * 0.6, 0.005, 0.04)


def chain():
    sec = 0.9
    x = np.zeros(int(sec * SR))
    for _ in range(14):
        p = rng.integers(0, int(0.6 * SR)); L = int(0.06 * SR); tt = np.arange(L) / SR
        f = rng.uniform(2500, 6500)
        x[p:p + L] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 70) * rng.uniform(0.3, 1)
    return fade(x, 0.001, 0.1)


def door_open():
    return np.concatenate([metal_click(1, 0.05), creak(1.6)[: int(1.6 * SR)]])


def vhs_hiss(sec=8):
    x = fft_filter(noise(sec), lo=3000, hi=12000) * 0.5
    hum = 0.25 * np.sin(2 * np.pi * 50 * t_(sec)) + 0.1 * np.sin(2 * np.pi * 150 * t_(sec))
    return x + hum


def doorbell():
    # двухтональный звонок «динь-дон»
    out = []
    for f0, dur in [(784.0, 0.55), (622.3, 1.1)]:
        tt = t_(dur)
        env = np.exp(-tt * 3.2) * (1 - np.exp(-tt * 300))
        tone = sum(a * np.sin(2 * np.pi * f0 * k * tt) for k, a in [(1, 1.0), (2.01, 0.35), (3.02, 0.12), (4.1, 0.05)])
        out.append(tone * env)
    x = np.concatenate([out[0][: int(0.42 * SR)], out[1]])
    return fade(x, 0.002, 0.2)


def buzz(n=3):
    out = []
    for i in range(n):
        tt = t_(0.38)
        b = np.sign(np.sin(2 * np.pi * 165 * tt)) * 0.5 + np.sin(2 * np.pi * 330 * tt) * 0.3
        b = fft_filter(b, lo=90, hi=1200) * fade(np.ones_like(tt), 0.01, 0.03)
        out += [b, np.zeros(int(0.22 * SR))]
    return np.concatenate(out)


def pop():
    tt = t_(0.12)
    f = 900 + 700 * (1 - np.exp(-tt * 40))
    return fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 30), 0.002, 0.03)


def typing(n=7):
    out = np.zeros(int((n * 0.14 + 0.3) * SR))
    for i in range(n):
        tt = t_(0.03)
        c = rng.standard_normal(len(tt)) * np.exp(-tt * 260)
        c = fft_filter(c, lo=1500, hi=7000)
        p = int((i * 0.14 + rng.uniform(-0.02, 0.02) + 0.05) * SR)
        out[p:p + len(c)] += c
    return out


def stairs_up(n=6):
    return footsteps(n, 0.55) * np.linspace(1.0, 0.25, int((n * 0.55 + 0.5) * SR))


def room_tone(sec=20):
    x = fft_filter(pink(sec), lo=40, hi=400) * 0.6 + 0.08 * np.sin(2 * np.pi * 50 * t_(sec))
    return fade(x, 1.0, 1.0)


def main():
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    items = {
        'drone': drone(), 'rain': rain(), 'wind': wind(), 'breath': breath(3),
        'key_lock': key_in_lock(), 'click': metal_click(1), 'creak': creak(), 'footsteps': footsteps(4),
        'heartbeat': heartbeat(8), 'boom': boom(), 'glitch': glitch(), 'beep': beep(), 'chain': chain(),
        'door_open': door_open(), 'vhs': vhs_hiss(),
        'doorbell': doorbell(), 'buzz': buzz(), 'pop': pop(), 'typing': typing(), 'stairs': stairs_up(), 'room': room_tone(),
    }
    for k, v in items.items():
        save(os.path.join(out, k + '.wav'), v)
        print(k, round(len(v) / SR, 2), 's')


if __name__ == '__main__':
    main()
