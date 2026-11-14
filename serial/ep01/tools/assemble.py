"""Сборка голосовой дорожки серии и данных таймлайна для анимации.

Склеивает: холодное открытие (тишина) + рассказчик (паузы ужаты) + Соня + хозяйка + финал.
Пишет voice.wav и anim/data.js (время каждого слова на итоговой шкале).

python3 -I assemble.py <ep_dir>
"""
import json, os, re, subprocess, sys, wave
import numpy as np

SR = 44100


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def silences(path, noise=-40, dur=0.12):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', f'silencedetect=noise={noise}dB:d={dur}', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', out)]
    en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', out)]
    return list(zip(st, en))


def save(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())


class Track:
    def __init__(self):
        self.buf = []
        self.t = 0.0

    def silence(self, sec):
        self.buf.append(np.zeros(int(round(sec * SR)))); self.t += sec

    def clip(self, x):
        self.buf.append(x); self.t += len(x) / SR

    def out(self):
        return np.concatenate(self.buf)


def compressed(x, sil, a, b, max_gap=0.34, keep_long=()):
    """Возвращает куски [a,b] источника с ужатыми паузами: [(src_a, src_b)]"""
    segs, cur = [], a
    for s, e in sil:
        if e <= a or s >= b:
            continue
        s, e = max(s, a), min(e, b)
        L = e - s
        lim = max_gap
        for (ka, kb, kl) in keep_long:
            if s <= kb and e >= ka:
                lim = kl
        if L > lim:
            mid_keep = lim / 2
            segs.append((cur, s + mid_keep))
            cur = e - mid_keep
    segs.append((cur, b))
    return [(p, q) for p, q in segs if q - p > 0.001]


def main():
    ep = sys.argv[1]
    A = os.path.join(ep, 'audio')
    nar_path = os.path.join(A, 'narrator.mp3')
    nar = load(nar_path)
    nw = json.load(open(os.path.join(A, 'narrator_words.json'), encoding='utf-8'))
    units = nw['units']
    words = nw['words']
    sil = silences(nar_path)
    total = len(nar) / SR

    def gap_after(ui):
        end = units[ui]['end']; nxt = units[ui + 1]['start']
        return (end + nxt) / 2

    cutA, cutB = gap_after(24), gap_after(33)
    keep = [(units[40]['end'] - 0.05, units[41]['start'] + 0.05, 1.0)]
    parts = [compressed(nar, sil, 0, cutA, keep_long=keep), compressed(nar, sil, cutA, cutB, keep_long=keep),
             compressed(nar, sil, cutB, total, keep_long=keep)]

    tr = Track()
    edl = []  # (src_a, src_b, out_a)
    COLD = 1.1
    tr.silence(COLD)

    def put_part(segs):
        for a, b in segs:
            edl.append((a, b, tr.t))
            tr.clip(nar[int(a * SR):int(b * SR)])

    def trim(x):
        i = np.where(np.abs(x) > 0.01)[0]
        if not len(i):
            return x, 0.0
        a = max(0, i[0] - 800)
        return x[a:i[-1] + 2000], a / SR

    extra = {}
    put_part(parts[0])
    tr.silence(0.15)
    sonya, lead = trim(load(os.path.join(A, 'sonya.mp3')))
    extra['s'] = (tr.t - lead, os.path.join(A, 'sonya_words.json'), len(sonya) / SR)
    tr.clip(sonya)
    tr.silence(0.25)
    put_part(parts[1])
    tr.silence(0.6)
    lpath = os.path.join(A, 'landlady.mp3')
    land, lead = trim(load(lpath))
    extra['l'] = (tr.t - lead, os.path.join(A, 'landlady_words.json'), len(land) / SR)
    tr.clip(land)
    tr.silence(0.3)
    put_part(parts[2])
    voice_end = tr.t
    tr.silence(2.6)
    out = tr.out()
    save(os.path.join(A, 'voice.wav'), out)

    def mapt(ts):
        for a, b, o in edl:
            if a - 1e-3 <= ts <= b + 1e-3:
                return o + (min(max(ts, a), b) - a)
        # в вырезанной паузе - к ближайшему краю
        best = min(edl, key=lambda e: min(abs(ts - e[0]), abs(ts - e[1])))
        a, b, o = best
        return o if abs(ts - a) < abs(ts - b) else o + (b - a)

    U = {}
    for ui, u in enumerate(units):
        ws = [w for w in words if w['unit'] == ui]
        U[f'n{ui}'] = {'text': u['text'], 'start': round(mapt(u['start']), 3), 'end': round(mapt(u['end']), 3),
                       'words': [{'w': w['w'], 'start': round(mapt(w['start']), 3), 'end': round(mapt(w['end']), 3)} for w in ws]}
    for key, (off, wpath, dur) in extra.items():
        wj = json.load(open(wpath, encoding='utf-8'))
        ws = [{'w': w['w'], 'start': round(off + w['start'], 3), 'end': round(off + w['end'], 3)} for w in wj['words']]
        U[key] = {'text': ' '.join(w['w'] for w in ws), 'start': ws[0]['start'], 'end': ws[-1]['end'], 'words': ws}
    data = {'duration': round(len(out) / SR, 3), 'voice_end': round(voice_end, 3), 'units': U}
    js = '(typeof window !== "undefined" ? window : globalThis).DATA = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n'
    with open(os.path.join(ep, 'anim', 'data.js'), 'w', encoding='utf-8') as f:
        f.write(js)
    print('duration', data['duration'], 'voice_end', data['voice_end'])


if __name__ == '__main__':
    main()
