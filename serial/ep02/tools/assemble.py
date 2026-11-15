"""Сборка голосовой дорожки «Не открывай»: три голоса по сценарию + данные таймлайна.

Каждый кусок: источник, диапазон фраз, пауза после. Длинные паузы внутри куска ужимаются.
Мама из телефона идёт через «телефонный» фильтр, мама за дверью приглушена, как через дверь.

python3 -I assemble.py <ep_dir>
"""
import json, os, re, subprocess, sys, wave
import numpy as np

SR = 44100
LEAD = 0.3
TAIL = 4.0
MAX_GAP = 0.45

SOURCES = {
    'n': ('narrator.mp3', 'narrator_words.json', None),
    'p': ('phone.mp3', 'phone_words.json', 'highpass=f=320,lowpass=f=3300,acompressor=threshold=-20dB:ratio=4,volume=1.6'),
    'd': ('door.mp3', 'door_words.json', 'lowpass=f=2600,aecho=0.8:0.5:28:0.25,volume=1.1'),
}
# (источник, первая фраза, последняя фраза, пауза после)
SEQ = [
    ('n', 0, 0, 0.35),
    ('p', 0, 1, 0.55),
    ('n', 1, 1, 0.9),
    ('n', 2, 5, 0.4),
    ('d', 0, 1, 0.45),
    ('n', 6, 6, 0.35),
    ('n', 7, 8, 0.5),
    ('d', 2, 4, 0.55),
    ('n', 9, 9, 0.4),
    ('n', 10, 10, 0.7),
    ('n', 11, 12, 0.45),
    ('n', 13, 13, 0.85),
    ('n', 14, 14, 0.4),
    ('p', 2, 3, 0.5),
    ('n', 15, 15, 0.75),
    ('n', 16, 19, 0.0),
]


def load(path, af=None):
    cmd = ['ffmpeg', '-v', 'error', '-i', path]
    if af:
        cmd += ['-af', af]
    cmd += ['-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    raw = subprocess.run(cmd, check=True, capture_output=True).stdout
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


def main():
    ep = sys.argv[1]
    A = os.path.join(ep, 'audio')
    src = {}
    for k, (f, wf, af) in SOURCES.items():
        p = os.path.join(A, f)
        wj = json.load(open(os.path.join(A, wf), encoding='utf-8'))
        src[k] = {'x': load(p, af), 'sil': silences(p), 'units': wj['units'], 'words': wj['words'], 'dur': None}
        src[k]['dur'] = len(src[k]['x']) / SR
    out, t = [np.zeros(int(LEAD * SR))], LEAD
    U = {}
    for k, u0, u1, gap in SEQ:
        s = src[k]
        a = max(0.0, s['units'][u0]['start'] - 0.08)
        b = min(s['dur'], s['units'][u1]['end'] + 0.18)
        # ужимаем длинные паузы внутри куска
        segs, cur = [], a
        for ss, ee in s['sil']:
            if ee <= a or ss >= b:
                continue
            ss, ee = max(ss, a), min(ee, b)
            if ee - ss > MAX_GAP:
                segs.append((cur, ss + MAX_GAP / 2)); cur = ee - MAX_GAP / 2
        segs.append((cur, b))
        edl = []
        for p, q in segs:
            edl.append((p, q, t))
            clip = s['x'][int(p * SR):int(q * SR)].copy()
            f = min(len(clip) // 4, int(0.01 * SR))
            if f:
                clip[:f] *= np.linspace(0, 1, f); clip[-f:] *= np.linspace(1, 0, f)
            out.append(clip); t += len(clip) / SR

        def mapt(ts):
            for p, q, o in edl:
                if p - 1e-3 <= ts <= q + 1e-3:
                    return o + (min(max(ts, p), q) - p)
            p, q, o = min(edl, key=lambda e: min(abs(ts - e[0]), abs(ts - e[1])))
            return o if abs(ts - p) < abs(ts - q) else o + (q - p)

        for ui in range(u0, u1 + 1):
            ws = [w for w in s['words'] if w['unit'] == ui]
            U[f'{k}{ui}'] = {'speaker': k, 'text': s['units'][ui]['text'], 'start': round(mapt(s['units'][ui]['start']), 3),
                             'end': round(mapt(s['units'][ui]['end']), 3),
                             'words': [{'w': w['w'], 'start': round(mapt(w['start']), 3), 'end': round(mapt(w['end']), 3)} for w in ws]}
        if gap:
            out.append(np.zeros(int(gap * SR))); t += gap
    voice_end = t
    out.append(np.zeros(int(TAIL * SR)))
    x = np.concatenate(out)
    x *= 0.95 / max(1e-6, np.max(np.abs(x)))
    save(os.path.join(A, 'voice.wav'), x)
    data = {'duration': round(len(x) / SR, 3), 'voice_end': round(voice_end, 3), 'units': U}
    with open(os.path.join(ep, 'anim', 'data.js'), 'w', encoding='utf-8') as f:
        f.write('(typeof window !== "undefined" ? window : globalThis).DATA = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    print('duration', data['duration'], 'voice_end', data['voice_end'])
    for k, u in U.items():
        print(f"{k:4s} {u['start']:6.2f}-{u['end']:6.2f} {u['text']}")


if __name__ == '__main__':
    main()
