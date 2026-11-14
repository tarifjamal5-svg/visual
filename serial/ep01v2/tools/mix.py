"""Сведение: голос + ровный фон (на 19 дБ тише голоса) + дождь + редкие эффекты.
Громкость итога -14 LUFS (двухпроходный loudnorm).

python3 -I mix.py <ep_dir> <cues.json> <out.wav>
"""
import json, os, re, subprocess, sys, wave
import numpy as np

SR = 44100
SFX_MASTER = -10.0  # общий запас для эффектов: «редкие и тихие»


def load(path, ch=1):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'],
                         check=True, capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    return x.reshape(-1, ch) if ch > 1 else x


def save(path, x):
    x = np.clip(x, -1, 1)
    if x.ndim == 1:
        x = x[:, None]
    with wave.open(path, 'wb') as w:
        w.setnchannels(x.shape[1]); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())


def lufs(path):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    m = re.findall(r'I:\s+(-?[\d.]+) LUFS', out)
    return float(m[-1])


def db(x):
    return 10 ** (x / 20)


def loop_to(x, n):
    if len(x) >= n:
        return x[:n]
    reps = int(np.ceil(n / len(x)))
    return np.tile(x, reps)[:n]


def main():
    ep, cues_path, out = sys.argv[1:4]
    A = os.path.join(ep, 'audio'); X = os.path.join(A, 'sfx')
    tmp = os.path.join(A, 'tmp'); os.makedirs(tmp, exist_ok=True)
    cues = json.load(open(cues_path, encoding='utf-8'))
    voice = load(os.path.join(A, 'voice.wav'))
    N = len(voice)
    dur = N / SR
    # --- фон: гул, ровно на 19 дБ тише голоса
    v_l = lufs(os.path.join(A, 'voice.wav'))
    drone = load(os.path.join(X, 'drone.wav'))
    drone = loop_to(drone, N)
    fade = int(1.5 * SR)
    drone[-fade:] *= np.linspace(1, 0.4, fade)
    save(os.path.join(tmp, 'drone_raw.wav'), drone)
    d_l = lufs(os.path.join(tmp, 'drone_raw.wav'))
    drone *= db((v_l - 19.0) - d_l)
    # --- дождь с автоматизацией громкости
    rain = load(os.path.join(X, 'rain.wav'))
    rainL = loop_to(rain, N); rainR = loop_to(np.roll(rain, int(3.3 * SR)), N)
    pts = cues['rainAuto']
    tt = np.arange(N) / SR
    g = np.interp(tt, [p[0] for p in pts], [p[1] for p in pts])
    # плавные переходы между сценами
    k = int(0.4 * SR)
    g = np.convolve(g, np.ones(k) / k, mode='same')
    rainL *= db(g) * db(+3); rainR *= db(g) * db(+3)
    # --- эффекты
    sfxL = np.zeros(N); sfxR = np.zeros(N)
    cache = {}
    for c in cues['cues']:
        name = c['sfx']
        if name not in cache:
            cache[name] = load(os.path.join(X, name + '.wav'))
        s = cache[name].copy()
        if c.get('dur'):
            n = int(c['dur'] * SR)
            s = loop_to(s, n)
            f = min(int(0.3 * SR), n // 3)
            s[:f] *= np.linspace(0, 1, f); s[-f:] *= np.linspace(1, 0, f)
        s *= db(c['gain'] + SFX_MASTER)
        p = int(c['t'] * SR)
        if p >= N:
            continue
        s = s[:N - p]
        pan = {'footsteps': -0.25, 'creak': -0.3, 'chain': 0.25, 'key_lock': 0.15}.get(name, 0)
        sfxL[p:p + len(s)] += s * (1 - max(0, pan))
        sfxR[p:p + len(s)] += s * (1 + min(0, pan))
    # --- сумма в стерео
    dL = drone; dR = np.roll(drone, int(0.012 * SR))
    L = voice + dL + rainL + sfxL
    R = voice + dR + rainR + sfxR
    mix = np.stack([L, R], axis=1)
    save(os.path.join(tmp, 'premix.wav'), mix / max(1.0, np.max(np.abs(mix)) / 0.95))
    save(os.path.join(tmp, 'stem_sfx.wav'), np.stack([sfxL, sfxR], 1))
    # --- нормализация громкости: два прохода loudnorm до -14 LUFS, пик -1.5 dBTP
    pre = os.path.join(tmp, 'premix.wav')
    o1 = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', pre, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                        capture_output=True, text=True).stderr
    js = json.loads(o1[o1.rindex('{'):o1.rindex('}') + 1])
    af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:"
          f"measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pre, '-af', af, '-ar', str(SR), out], check=True)
    print(json.dumps({'voice_LUFS': v_l, 'drone_LUFS_after': round(v_l - 19, 1), 'drone_raw_LUFS': d_l,
                      'sfx_stem_LUFS': lufs(os.path.join(tmp, 'stem_sfx.wav')), 'final_LUFS': lufs(out)}, ensure_ascii=False))


if __name__ == '__main__':
    main()
