"""Разметка слов по времени без распознавания речи.

1) ffmpeg silencedetect даёт куски речи между паузами.
2) Динамическое программирование раскладывает фразы сценария по кускам (длина ~ числу слогов).
3) Внутри фразы ищем ядра слогов (пики громкости) и ставим слова на них.

python3 -I align.py audio.mp3 units.json out.json
units.json: список фраз; каждая фраза - строка слов (теги [..] уже удалены).
"""
import json, re, subprocess, sys
import numpy as np

VOW = set('аеёиоуыэюяАЕЁИОУЫЭЮЯ')


def syl(word):
    n = sum(ch in VOW for ch in word)
    return max(n, 1) if re.search(r'\w', word) else 0


def load(path, sr=16000):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32), sr


def silences(path, noise=-38, dur=0.18):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', f'silencedetect=noise={noise}dB:d={dur}', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', out)]
    en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', out)]
    return list(zip(st, en))


def envelope(x, sr, hop=0.005, win=0.03):
    h, w = int(sr * hop), int(sr * win)
    # полоса 300-3000 Гц через простую разность сглаживаний
    n = (len(x) - w) // h
    frames = np.lib.stride_tricks.sliding_window_view(x, w)[::h][:n]
    spec = np.abs(np.fft.rfft(frames * np.hanning(w), axis=1))
    freqs = np.fft.rfftfreq(w, 1 / sr)
    band = (freqs > 300) & (freqs < 3000)
    e = 10 * np.log10((spec[:, band] ** 2).sum(1) + 1e-10)
    k = 7
    e = np.convolve(e, np.ones(k) / k, mode='same')
    return e, hop


def peaks(e, hop, t0, t1, min_gap=0.09, prom=2.5):
    a, b = int(t0 / hop), int(t1 / hop)
    seg = e[a:b]
    if len(seg) < 3:
        return []
    floor = np.percentile(seg, 30)
    res = []
    for i in range(1, len(seg) - 1):
        if seg[i] >= seg[i - 1] and seg[i] > seg[i + 1] and seg[i] > floor + 4:
            l = seg[max(0, i - 20):i].min()
            r = seg[i + 1:i + 21].min() if i + 1 < len(seg) else seg[i]
            if seg[i] - max(l, r) >= prom:
                t = (a + i) * hop
                if res and t - res[-1][0] < min_gap:
                    if seg[i] > res[-1][1]:
                        res[-1] = (t, seg[i])
                    continue
                res.append((t, seg[i]))
    return [t for t, _ in res]


def main():
    audio, units_path, out_path = sys.argv[1:4]
    units = json.load(open(units_path, encoding='utf-8'))
    x, sr = load(audio)
    total = len(x) / sr
    sil = silences(audio)
    env, hop = envelope(x, sr)
    # кандидаты в границы: середины пауз и глубокие провалы громкости внутри речи
    cands = [(0.0, 0.0, 'start')]
    for s_, e_ in sil:
        if s_ > 0.05 and e_ < total - 0.05:
            cands.append((s_, e_, 'sil'))
    insil = np.zeros(len(env), dtype=bool)
    for s_, e_ in sil:
        insil[int(s_ / hop):int(e_ / hop) + 1] = True
    W = 14
    for i in range(W, len(env) - W):
        if insil[i] or env[i] != env[i - W:i + W + 1].min():
            continue
        depth = min(env[i - W:i].max(), env[i + 1:i + W + 1].max()) - env[i]
        if depth > 9:
            t = i * hop
            cands.append((t, t, 'dip'))
    cands.append((total, total, 'end'))
    cands.sort()
    C = len(cands)
    U = len(units)
    sy = [sum(syl(w) for w in u.split()) for u in units]
    sil_total = sum(e_ - s_ for s_, e_ in sil)
    rate = (total - sil_total) / sum(sy)

    def speech_between(a, b):
        d = b - a
        for s_, e_ in sil:
            lo, hi = max(a, s_), min(b, e_)
            if hi > lo:
                d -= (hi - lo) * 0.85
        return d

    def bpen(c):
        kind = c[2]
        if kind in ('start', 'end'):
            return 0
        if kind == 'sil':
            L = c[1] - c[0]
            return 0 if L >= 0.3 else 0.4
        return 1.5

    INF = 1e18
    dp = np.full((U + 1, C), INF)
    bk = np.zeros((U + 1, C), dtype=int)
    dp[0][0] = 0
    for u in range(1, U + 1):
        exp = rate * sy[u - 1] + 0.08
        for c in range(1, C):
            if u == U and c != C - 1:
                continue
            best, arg = INF, -1
            for j in range(c - 1, -1, -1):
                if cands[c][0] - cands[j][1] > 6:
                    break
                if dp[u - 1][j] >= INF:
                    continue
                a, b = cands[j][1], cands[c][0]
                if b - a < 0.15:
                    continue
                d = speech_between(a, b)
                inner = sum(max(0.0, min(b, e_) - max(a, s_) - 0.22) for s_, e_ in sil if min(b, e_) > max(a, s_))
                cost = dp[u - 1][j] + 0.6 * ((d - exp) / max(exp, 0.4)) ** 2 + bpen(cands[c]) + 6 * inner
                if cost < best:
                    best, arg = cost, j
            dp[u][c], bk[u][c] = best, arg
    spans, c = [], C - 1
    for u in range(U, 0, -1):
        j = bk[u][c]
        spans.append((cands[j][1], cands[c][0]))
        c = j
    spans.reverse()
    # подрезаем тишину по краям фразы
    def trim(a, b):
        for s_, e_ in sil:
            if s_ <= a + 0.02 < e_:
                a = e_
            if s_ < b - 0.02 <= e_:
                b = s_
        return a, b
    spans = [trim(a, b) for a, b in spans]
    words_out = []
    for ui, (u, (a, b)) in enumerate(zip(units, spans)):
        ws = u.split()
        ss = [syl(w) for w in ws]
        n = sum(ss)
        pk = peaks(env, hop, a, b)
        if len(pk) == n and n > 1:
            # слово начинается чуть раньше своего первого ядра
            idx, starts = 0, []
            for s_ in ss:
                starts.append(pk[idx] if s_ else None)
                idx += s_
            ts = []
            for wi, s_ in enumerate(ss):
                st = a if wi == 0 else max(a, starts[wi] - 0.08)
                ts.append(st)
            ends = ts[1:] + [b]
            method = 'nuclei'
        else:
            dur = b - a
            ts, acc = [], 0
            for s_ in ss:
                ts.append(a + dur * acc / n)
                acc += s_
            ends = ts[1:] + [b]
            method = 'proportional'
        for w, s0, e0 in zip(ws, ts, ends):
            words_out.append({'w': w, 'start': round(s0, 3), 'end': round(e0, 3), 'unit': ui})
        print(f'{ui:2d} {a:6.2f}-{b:6.2f} syl={n:2d} peaks={len(pk):2d} {method:12s} {u}')
    json.dump({'duration': total, 'units': [{'text': u, 'start': round(a, 3), 'end': round(b, 3)} for u, (a, b) in zip(units, spans)],
               'words': words_out}, open(out_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
