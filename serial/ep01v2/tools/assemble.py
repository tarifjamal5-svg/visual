"""Сборка голосовой дорожки (один рассказчик) и данных таймлайна.
Паузы длиннее MAX_GAP ужимаются, драматические паузы из KEEP сохраняются.

python3 -I assemble.py <ep_dir>
"""
import json, os, re, subprocess, sys, wave
import numpy as np

SR = 44100
LEAD = 0.35      # картинка начинается чуть раньше голоса
TAIL = 4.15       # финальная карточка после последнего слова
MAX_GAP = 0.42
# (индекс фразы, после которой пауза остаётся длиннее, её длина)
KEEP = {0: 0.6, 1: 0.85, 5: 0.5, 13: 0.85, 20: 0.75, 21: 0.7, 22: 0.9, 24: 0.6, 25: 0.7}


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


def main():
    ep = sys.argv[1]
    A = os.path.join(ep, 'audio')
    path = os.path.join(A, 'narrator.mp3')
    nar = load(path)
    total = len(nar) / SR
    nw = json.load(open(os.path.join(A, 'narrator_words.json'), encoding='utf-8'))
    units, words = nw['units'], nw['words']
    sil = silences(path)
    # лимит паузы: по умолчанию MAX_GAP, после отмеченных фраз - своё значение
    def limit_for(s, e):
        for ui, L in KEEP.items():
            end = units[ui]['end']
            nxt = units[ui + 1]['start'] if ui + 1 < len(units) else total
            if s <= nxt and e >= end:
                return L
        return MAX_GAP
    segs, cur = [], 0.0
    for s, e in sil:
        L = e - s
        lim = limit_for(s, e)
        if s <= 0.01:  # тишина в самом начале
            cur = max(cur, e - 0.05)
            continue
        if L > lim:
            segs.append((cur, s + lim / 2))
            cur = e - lim / 2
    last_word_end = units[-1]['end']
    segs.append((cur, min(total, last_word_end + 0.45)))
    # драматические паузы: вставляем тишину между фразами
    EXTRA = {1: 0.3, 10: 0.5, 13: 0.4, 20: 0.4, 22: 0.6, 25: 0.4}
    cuts = sorted(((units[ui]['end'] + units[ui + 1]['start']) / 2, L) for ui, L in EXTRA.items())
    split = []
    for a, b in segs:
        for p, L in cuts:
            if a < p < b:
                split.append((a, p, 0.0)); a = p
                split[-1] = (split[-1][0], split[-1][1], L)
        split.append((a, b, 0.0))
    out, edl, t = [np.zeros(int(LEAD * SR))], [], LEAD
    for a, b, gap in split:
        edl.append((a, b, t))
        clip = nar[int(a * SR):int(b * SR)]
        out.append(clip); t += len(clip) / SR
        if gap:
            out.append(np.zeros(int(gap * SR))); t += gap
    voice_end = t
    out.append(np.zeros(int(TAIL * SR)))
    x = np.concatenate(out)
    save(os.path.join(A, 'voice.wav'), x)

    def mapt(ts):
        for a, b, o in edl:
            if a - 1e-3 <= ts <= b + 1e-3:
                return o + (min(max(ts, a), b) - a)
        best = min(edl, key=lambda e: min(abs(ts - e[0]), abs(ts - e[1])))
        a, b, o = best
        return o if abs(ts - a) < abs(ts - b) else o + (b - a)

    U = {}
    for ui, u in enumerate(units):
        ws = [w for w in words if w['unit'] == ui]
        U[f'n{ui}'] = {'text': u['text'], 'start': round(mapt(u['start']), 3), 'end': round(mapt(u['end']), 3),
                       'words': [{'w': w['w'], 'start': round(mapt(w['start']), 3), 'end': round(mapt(w['end']), 3)} for w in ws]}
    data = {'duration': round(len(x) / SR, 3), 'voice_end': round(voice_end, 3), 'units': U}
    with open(os.path.join(ep, 'anim', 'data.js'), 'w', encoding='utf-8') as f:
        f.write('(typeof window !== "undefined" ? window : globalThis).DATA = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    print('duration', data['duration'], 'voice_end', data['voice_end'])


if __name__ == '__main__':
    main()
