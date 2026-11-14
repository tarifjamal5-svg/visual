// ПРЕСЛЕДОВАТЕЛЬ, серия 1 - таймлайн, кадры, субтитры, звуковые события.
// buildTimeline(DATA) работает и в node (для звука), и в браузере (для картинки).
(function (root) {
  'use strict';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const ease = u => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const easeOut = u => 1 - Math.pow(1 - u, 3);
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const pad = n => String(n).padStart(2, '0');

  // ---------------- ТАЙМЛАЙН ----------------
  function buildTimeline(D) {
    const U = id => D.units[id];
    const W = (id, i) => { const ws = U(id).words; return ws[i < 0 ? ws.length + i : i]; };
    const S = id => U(id).start - 0.06;
    const END = D.duration;
    const endStart = U('n41').end + 0.55;
    const shots = [
      ['cold', 0, S('n0')],
      ['mug', S('n0'), S('n1')],
      ['kitchen', S('n1'), S('n2')],
      ['photo', S('n2'), S('n3')],
      ['kitchen2', S('n3'), S('n4')],
      ['cam', S('n4'), S('n6')],
      ['clock', S('n6'), S('n7')],
      ['closet', S('n7'), S('n8')],
      ['nikSit', S('n8'), S('n10')],
      ['slit', S('n10'), S('n11')],
      ['dawn', S('n11'), S('n14')],
      ['open', S('n14'), S('n15')],
      ['key', S('n15'), S('n17')],
      ['footage1', S('n17'), S('n19')],
      ['yard', S('n19'), S('n22')],
      ['podezd', S('n22'), S('s')],
      ['sonya', S('s'), S('n25')],
      ['lock17', S('n25'), S('n26')],
      ['empty', S('n26'), S('n28')],
      ['window', S('n28'), S('n30')],
      ['wall', S('n30'), W('n32', 2).start - 0.05],
      ['oldphoto', W('n32', 2).start - 0.05, S('n33')],
      ['door', S('n33'), S('n34')],
      ['newlock', S('n34'), S('n36')],
      ['phone', S('n36'), S('n37')],
      ['footage2', S('n37'), S('n41')],
      ['freeze', S('n41'), endStart],
      ['end', endStart, END],
    ].map(([id, from, to]) => ({ id, from, to }));

    const titles = [
      { text: 'ПЯТНИЦА, 21:40', from: S('n0') + 0.15, to: S('n0') + 2.8 },
      { text: 'СУББОТА, 13:40', from: S('n22') + 0.1, to: S('n22') + 2.7 },
      { text: 'ВОСКРЕСЕНЬЕ, 08:10', from: S('n36') + 0.05, to: S('n37') - 0.05 },
    ];

    // моменты для анимации и звука
    const M = {
      camWord: W('n5', 2).start,
      chelovek: W('n10', 2).start,
      usnul: W('n13', 1).start,
      otkuda: W('n21', 1).start,
      podoshel: W('n25', 1).start,
      staroe: W('n32', 2).start,
      syn: W('l', 4).start,
      smotrit: W('l', -1).end,
      zamok: W('n34', 2).start,
      vstayu: U('n38').start,
      idu: U('n39').start,
      otkryvayu: W('n40', 1).start,
      nePomnyu: U('n41').start,
      endStart,
    };

    const cues = [
      { sfx: 'vhs', t: 0, dur: S('n0'), gain: -16 },
      { sfx: 'click', t: 0.45, gain: -8 },
      { sfx: 'glitch', t: S('n0') - 0.12, gain: -14 },
      { sfx: 'beep', t: M.camWord + 0.05, gain: -20 },
      { sfx: 'breath', t: S('n7'), gain: -12, dur: S('n8') - S('n7') + 0.6 },
      { sfx: 'heartbeat', t: S('n8'), gain: -10, dur: S('n11') - S('n8') },
      { sfx: 'boom', t: M.chelovek, gain: -9 },
      { sfx: 'creak', t: S('n14') + 0.05, gain: -12 },
      { sfx: 'click', t: S('n16') + 0.1, gain: -16 },
      { sfx: 'glitch', t: S('n17'), gain: -14 },
      { sfx: 'vhs', t: S('n17'), dur: S('n19') - S('n17'), gain: -24 },
      { sfx: 'wind', t: S('n19'), dur: S('n22') - S('n19') + 0.5, gain: -14 },
      { sfx: 'boom', t: M.otkuda, gain: -14 },
      { sfx: 'key_lock', t: M.podoshel - 0.7, gain: -8 },
      { sfx: 'boom', t: M.staroe, gain: -15 },
      { sfx: 'chain', t: S('n33') + 0.1, gain: -12 },
      { sfx: 'boom', t: M.syn, gain: -9 },
      { sfx: 'click', t: M.smotrit + 0.25, gain: -6 },
      { sfx: 'key_lock', t: M.zamok - 0.6, gain: -8 },
      { sfx: 'beep', t: S('n36') + 0.4, gain: -22 },
      { sfx: 'glitch', t: S('n37'), gain: -12 },
      { sfx: 'vhs', t: S('n37'), dur: endStart - S('n37'), gain: -24 },
      { sfx: 'heartbeat', t: S('n37'), dur: M.otkryvayu - S('n37'), gain: -11 },
      { sfx: 'footsteps', t: M.idu + 0.05, gain: -14 },
      { sfx: 'door_open', t: M.otkryvayu, gain: -6 },
      { sfx: 'boom', t: M.otkryvayu + 0.1, gain: -8 },
      { sfx: 'glitch', t: M.nePomnyu - 0.1, gain: -10 },
      { sfx: 'breath', t: endStart + 0.1, gain: -9, dur: END - endStart },
    ];
    // дождь по сценам (фон), громкость в дБ
    const rainAuto = [
      [0, -40], [S('n0'), -34], [S('n6'), -30], [S('n19'), -22], [S('n22'), -26], [S('n25'), -32],
      [S('n26'), -28], [S('n33'), -38], [S('n34'), -34], [S('n37'), -30], [endStart, -40], [END, -40],
    ];
    return { shots, titles, M, cues, rainAuto, duration: END, U, W, S };
  }

  // ---------------- СУБТИТРЫ ----------------
  const RED = ['дышал', 'человек', 'человека', 'тень', 'сплю', 'смотрит', 'сын', 'открываю', 'помню', '03:17', 'спящим', 'никому', 'дышат'];
  const YEL = ['кружка', 'ключи', 'ключ', 'хозяйки', 'хозяйка', 'камеру', 'ветеринар', 'скальпелем', 'окна', 'соня', 'пустую', 'квартиру',
    'свет', 'подошёл', 'спальня', 'фото', 'мальчиком', 'замок', 'запись', 'двери', 'шкафа', 'шкаф', 'чужой', 'откуда', 'стул'];
  const norm = w => w.toLowerCase().replace(/[«»"“”.,:;!?…]/g, '').replace(/ё/g, 'ё');

  function buildSubs(D, measure) {
    const order = Object.keys(D.units).sort((a, b) => D.units[a].start - D.units[b].start);
    const chunks = [];
    for (const id of order) {
      const raw = D.units[id].words;
      // «три семнадцать» -> 03:17
      const ws = [];
      for (let i = 0; i < raw.length; i++) {
        const n = norm(raw[i].w);
        if (n === 'три' && raw[i + 1] && norm(raw[i + 1].w).startsWith('семнадцать')) {
          ws.push({ w: '03:17', start: raw[i].start, end: raw[i + 1].end }); i++; continue;
        }
        ws.push(raw[i]);
      }
      let cur = [];
      const flush = () => { if (cur.length) chunks.push({ unit: id, words: cur }); cur = []; };
      for (const w of ws) {
        const txt = w.w.replace(/[«»"]/g, '').replace(/[.,:;!]+$/, '').replace(/\.\.\.$/, '').toUpperCase();
        const item = { txt, start: w.start, end: w.end, key: norm(w.w) };
        const len = cur.reduce((s, c) => s + c.txt.length + 1, 0) + txt.length;
        if (cur.length && (cur.length >= 4 || len > 21)) flush();
        cur.push(item);
        if (/[.?!…]$/.test(w.w) || /\.\.\.$/.test(w.w)) flush();
      }
      flush();
    }
    chunks.forEach(c => { c.from = c.words[0].start - 0.04; });
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const next = chunks[i + 1];
      c.to = Math.min(next ? next.from : c.words[c.words.length - 1].end + 0.6, c.words[c.words.length - 1].end + 0.6);
      // раскладка в одну или две строки
      const FS = 92, maxW = 860;
      const widths = c.words.map(w => measure(w.txt, FS));
      const space = measure(' ', FS) + 42;
      const total = widths.reduce((a, b) => a + b, 0) + space * (c.words.length - 1);
      let lines = [c.words.map((w, k) => k)];
      if (total > maxW && c.words.length > 1) {
        let best = 1, bestDiff = 1e9;
        for (let k = 1; k < c.words.length; k++) {
          const a = widths.slice(0, k).reduce((x, y) => x + y, 0) + space * (k - 1);
          const b = widths.slice(k).reduce((x, y) => x + y, 0) + space * (c.words.length - k - 1);
          if (Math.abs(a - b) < bestDiff) { bestDiff = Math.abs(a - b); best = k; }
        }
        lines = [c.words.map((w, k) => k).slice(0, best), c.words.map((w, k) => k).slice(best)];
      }
      c.layout = [];
      lines.forEach((ln, li) => {
        const lw = ln.reduce((s, k) => s + widths[k], 0) + space * (ln.length - 1);
        let fs = FS;
        const scale = lw > maxW ? maxW / lw : 1;
        let x = 520 - (lw * scale) / 2;
        const y = (lines.length === 1 ? 1235 : 1180 + li * 108);
        ln.forEach(k => {
          c.layout.push({ k, x: x + (widths[k] * scale) / 2, y, fs: fs * scale });
          x += (widths[k] + space) * scale;
        });
      });
    }
    return chunks;
  }

  function subsSVG(chunks, t) {
    const c = chunks.find(ch => t >= ch.from && t < ch.to);
    if (!c) return '';
    let label = '';
    if (c.unit === 's' || c.unit === 'l') {
      const name = c.unit === 's' ? 'СОНЯ' : 'ХОЗЯЙКА';
      const col = c.unit === 's' ? '#f2c230' : '#c79ab4';
      const top = Math.min(...c.layout.map(l => l.y)) - 100;
      label = `<text x="520" y="${top}" text-anchor="middle" font-family="Inter" font-weight="800" font-size="40" letter-spacing="6" fill="${col}" stroke="#000" stroke-width="8" paint-order="stroke">${name}</text>`;
    }
    const out = c.layout.map(l => {
      const w = c.words[l.k];
      if (t < w.start - 0.03) return '';
      const age = t - w.start;
      const pop = age < 0.14 ? 1 + 0.14 * (1 - age / 0.14) : 1;
      const col = RED.includes(w.key) ? '#ff3b2e' : YEL.includes(w.key) ? '#f2c230' : (c.unit === 's' ? '#fff4c8' : c.unit === 'l' ? '#f1dbe7' : '#ffffff');
      return `<g transform="translate(${l.x.toFixed(1)} ${l.y}) scale(${pop.toFixed(3)})"><text x="0" y="0" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${l.fs.toFixed(1)}" fill="${col}" stroke="#000" stroke-width="18" stroke-linejoin="round" paint-order="stroke">${w.txt}</text></g>`;
    }).join('');
    return `<g filter="url(#subShadow)">${label}${out}</g>`;
  }

  // ---------------- КАДРЫ ----------------
  function makeDraw(TL, D) {
    const A = root.ART, X = root.ART_EXTRA, M = TL.M;
    const blinkAt = t => { const ph = t % 3.7; return ph < 0.12 ? Math.sin(ph / 0.12 * Math.PI) : 0; };
    const lampFlicker = t => {
      const a = Math.sin(t * 13.1) * Math.sin(t * 7.3 + 1) * Math.sin(t * 2.1);
      return a > 0.55 ? 0.35 : 1 - 0.06 * Math.abs(Math.sin(t * 31));
    };
    const speaking = (unit, t) => {
      const ws = D.units[unit].words;
      const w = ws.find(x => t >= x.start && t <= x.end);
      if (!w) return 0;
      return 0.5 + 0.5 * Math.abs(Math.sin((t - w.start) * Math.PI * 7));
    };
    const room = (o, mid) => A.bgRoom(Object.assign({ gap: 0.3, mid }, o));
    const nikSitAt = (o) => `<g transform="translate(850 1905) scale(1.25)">${A.nikita(Object.assign({ pose: 'sit', scalpel: true, eyesWide: true, lookX: -1 }, o))}</g>`;
    const hand = (x, y, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M 0 0 L 40 260" stroke="#3a4231" stroke-width="120" stroke-linecap="round"/><ellipse cx="0" cy="-10" rx="62" ry="80" fill="#c39f88"/><ellipse cx="28" cy="6" rx="26" ry="52" fill="#9d7b69"/></g>`;

    const D_ = {
      cold(t, lt, dur) {
        const p = lt / dur;
        return {
          svg: X.doorCloseup({ num: '', keyIn: 1, tag: false, hand: false, turn: easeOut(prog(lt, 0.2, 0.95)) }),
          cam: { x: 540, y: 1330, z: 1.3 + 0.12 * p }, ir: true, hud: { time: 'ВС 03:17:0' + Math.min(9, 4 + Math.floor(lt * 2)) },
          glitch: lt < 0.12 || dur - lt < 0.14 ? 1 : 0,
        };
      },
      mug(t, lt, dur) {
        const p = lt / dur;
        return { svg: A.bgKitchen({ flicker: lampFlicker(t) }), cam: { x: 470, y: 1400, z: lerp(1.55, 1.95, ease(p)) } };
      },
      kitchen(t, lt, dur) {
        const nik = `<g transform="translate(330 1720) scale(1.55)">${A.nikita({ lookX: 0.8, lookY: 0.9, blink: blinkAt(t) })}</g>`;
        return { svg: A.bgKitchen({ flicker: lampFlicker(t), mid: nik }), cam: { x: 470, y: 1180, z: lerp(1.12, 1.2, lt / dur) } };
      },
      photo(t, lt, dur) {
        return { svg: A.bgKitchen({ flicker: lampFlicker(t) }), cam: { x: 560, y: 545, z: lerp(2.7, 3.2, ease(lt / dur)) } };
      },
      kitchen2(t, lt, dur) {
        const lurk = lt > dur * 0.5 && lt < dur * 0.5 + 0.1 ? 0.95 : 0;
        const nik = `<g transform="translate(330 1720) scale(1.55)">${A.nikita({ lookX: -0.6, lookY: 0.2, blink: blinkAt(t + 1) })}</g>`;
        return { svg: A.bgKitchen({ flicker: lampFlicker(t), mid: nik, lurker: lurk }), cam: { x: 560, y: 1100, z: 1.18 } };
      },
      cam(t, lt, dur) {
        const on = t >= M.camWord;
        const hy = lt < dur * 0.45 ? lerp(1700, 1330, easeOut(lt / (dur * 0.45))) : lerp(1330, 2300, ease(prog(lt, dur * 0.55, dur * 0.85)));
        return {
          svg: `<g filter="url(#b16)">${A.bgRoom({ gap: 0, underDoor: 0.4, led: false })}</g><rect width="1080" height="1920" fill="#000" opacity=".35"/>
            <rect x="140" y="1180" width="800" height="40" fill="#1f1b22"/>
            <g transform="translate(540 1180) scale(5.2)">${A.petCam(on)}</g>${hand(760, hy, -20)}
            ${on ? `<circle cx="644" cy="1107" r="${60 + 10 * Math.sin(t * 9)}" fill="url(#glowRed)" opacity=".8"/>` : ''}`,
          cam: { x: 540, y: 1100, z: lerp(1.0, 1.1, lt / dur) },
        };
      },
      clock(t, lt, dur) {
        const g = 0.75 + 0.25 * Math.sin(t * 5);
        return {
          svg: `<g filter="url(#b16)">${room({ gap: 0.25 })}</g><rect width="1080" height="1920" fill="#000" opacity=".55"/>
            <g transform="translate(540 960) scale(${lerp(6.5, 7.2, lt / dur)})">${A.digitalClock('03:17', g)}</g>`,
          cam: { x: 540, y: 960, z: 1 },
        };
      },
      closet(t, lt, dur) {
        const gap = 0.26 + 0.07 * Math.sin((lt / 2.8) * Math.PI * 2);
        return { svg: room({ gap }), cam: { x: 200, y: 960, z: lerp(1.55, 1.9, ease(lt / dur)) } };
      },
      nikSit(t, lt, dur) {
        const gap = 0.26 + 0.07 * Math.sin((t / 2.8) * Math.PI * 2);
        return { svg: room({ gap }, nikSitAt({ blink: blinkAt(t) })), cam: { x: 760, y: 1450, z: lerp(1.35, 1.6, ease(lt / dur)) } };
      },
      slit(t, lt, dur) {
        const glint = t > M.chelovek - 0.05 ? clamp((t - M.chelovek + 0.05) / 0.2) : 0;
        return { svg: room({ gap: 0.36, eyeGlint: glint }), cam: { x: 190, y: 720, z: lerp(3.6, 4.4, ease(lt / dur)) }, shake: 2.5 };
      },
      dawn(t, lt, dur) {
        const asleep = t >= M.usnul;
        const nik = asleep ? `<g transform="translate(850 1905) scale(1.25)">${A.nikita({ pose: 'sleep' })}</g>` : nikSitAt({ blink: blinkAt(t), lookX: -0.6 });
        return { svg: room({ gap: 0.25, dawn: ease(lt / dur) }, nik), cam: { x: 700, y: 1300, z: lerp(1.15, 1.28, lt / dur) } };
      },
      open(t, lt, dur) {
        return { svg: room({ dawn: 1, closetOpen: easeOut(clamp(lt / 0.6)) }), cam: { x: 240, y: 960, z: lerp(1.45, 1.6, lt / dur) } };
      },
      key(t, lt, dur) {
        return { svg: X.keyFloorShot({ t }), cam: { x: 520, y: 1000, z: lerp(1.0, 1.3, ease(lt / dur)) } };
      },
      footage1(t, lt, dur) {
        const sh = 0.15 + 0.75 * ease(clamp(lt / (dur * 0.6)));
        const nik = `<g transform="translate(850 1905) scale(1.25)">${A.nikita({ pose: 'sleep' })}</g>`;
        const shadow = `<g transform="translate(${lerp(980, 760, ease(clamp(lt / (dur * 0.7))))} 1905) scale(1.55 1.25) skewX(-16)" opacity="${sh}">${A.shadowMan()}</g>`;
        return {
          svg: room({ dawn: 0.2 }, nik + shadow), ir: true, cam: { x: 760, y: 1350, z: lerp(1.2, 1.5, ease(lt / dur)) },
          hud: { time: 'СБ 05:02:' + pad(13 + Math.floor(lt)) }, glitch: lt < 0.18 ? 1 : 0,
        };
      },
      yard(t, lt, dur) {
        const tz = M.otkuda;
        const z = t < tz ? lerp(1.0, 1.18, ease(clamp(lt / (tz - (t - lt))))) : lerp(1.18, 2.6, easeOut(clamp((t - tz) / 0.5)));
        return { svg: A.bgYard({ t }), cam: { x: lerp(540, 610, clamp((z - 1) / 1.6)), y: lerp(960, 1250, clamp((z - 1) / 1.6)), z } };
      },
      podezd(t, lt, dur) {
        const nik = `<g transform="translate(300 1990) scale(1.75)">${A.nikita({ lookX: 1, lookY: 0.4, blink: blinkAt(t) })}</g>`;
        const so = `<g transform="translate(790 1900) scale(1.45)">${A.sonya({ chalk: true, blink: blinkAt(t + 0.7) })}</g>`;
        return { svg: A.bgPodezd({ t, flicker: lampFlicker(t * 0.7) }) + nik + so, cam: { x: 540, y: 1300, z: lerp(1.05, 1.14, lt / dur) } };
      },
      sonya(t, lt, dur) {
        const nik = `<g transform="translate(300 1990) scale(1.75)">${A.nikita({ lookX: 1, lookY: 0.4, blink: blinkAt(t) })}</g>`;
        const so = `<g transform="translate(790 1900) scale(1.45)">${A.sonya({ point: true, blink: blinkAt(t + 0.7), mouthOpen: speaking('s', t) })}</g>`;
        return {
          svg: A.bgPodezd({ t, flicker: lampFlicker(t * 0.7), lurker: 0.15 + 0.55 * ease(clamp(lt / dur)) }) + nik + so,
          cam: { x: lerp(700, 640, lt / dur), y: 1380, z: lerp(1.45, 1.6, lt / dur) },
        };
      },
      lock17(t, lt, dur) {
        const k = easeOut(prog(t, M.podoshel - 0.9, M.podoshel - 0.35));
        const turn = ease(prog(t, M.podoshel - 0.2, M.podoshel + 0.25));
        return { svg: X.doorCloseup({ num: '17', keyIn: k, turn, hand: true }), cam: { x: 540, y: 1150, z: lerp(1.0, 1.12, lt / dur) } };
      },
      empty(t, lt, dur) {
        return { svg: A.bgEmpty({ t }), cam: { x: 690, y: 1250, z: lerp(1.05, 1.25, ease(lt / dur)) } };
      },
      window(t, lt, dur) {
        const u = ease(clamp(lt / (dur * 0.8)));
        return { svg: A.bgEmpty({ t }), cam: { x: lerp(700, 732, u), y: lerp(950, 834, u), z: lerp(1.4, 4.6, u) } };
      },
      wall(t, lt, dur) {
        return { svg: A.bgEmpty({ t }), cam: { x: lerp(150, 330, ease(lt / dur)), y: lerp(700, 860, ease(lt / dur)), z: 2.0 } };
      },
      oldphoto(t, lt, dur) {
        return { svg: A.bgEmpty({ t }), cam: { x: 240, y: 792, z: lerp(2.2, 5.6, easeOut(clamp(lt / 0.9))) }, shake: 1.5 };
      },
      door(t, lt, dur) {
        const o1 = lerp(0.25, 1, easeOut(clamp(lt / 0.6)));
        const close = clamp((t - M.smotrit - 0.05) / 0.25);
        const open = o1 * (1 - close);
        return {
          svg: A.bgDoorChain({ open: Math.max(open, 0.001), face: open > 0.25, mouth: speaking('l', t) }),
          cam: { x: 640, y: 920, z: lerp(1.25, 1.4, ease(lt / dur)) },
        };
      },
      newlock(t, lt, dur) {
        const k = easeOut(prog(t, M.zamok - 0.75, M.zamok - 0.25));
        const turn = ease(prog(t, M.zamok - 0.1, M.zamok + 0.3));
        return { svg: X.doorCloseup({ num: '3', padded: true, keyIn: k, turn, hand: true, tag: false }), cam: { x: 540, y: 1150, z: lerp(1.05, 1.15, lt / dur) } };
      },
      phone(t, lt, dur) {
        const inner = `<g filter="url(#ir)">${A.bgRoom({ gap: 0.3 })}${X.nikitaLying({})}</g>${A.camHUD({ time: 'ВС 03:17:00' })}`;
        return { svg: X.phone(inner, { progress: lerp(0.1, 0.62, ease(lt / dur)), label: '03:17:00', thumb: true }), cam: { x: 540, y: 980, z: lerp(1.0, 1.12, ease(lt / dur)) } };
      },
      footage2(t, lt, dur) {
        let nik = '', door = 0, z = 1.15, fx = 640, fy = 1300;
        if (t < M.vstayu) {
          nik = X.nikitaLying({});
        } else if (t < M.idu) {
          nik = `<g transform="translate(830 1900) scale(1.25)">${A.nikita({ eyesWide: true, lookX: -1 })}</g>`;
        } else {
          const u = ease(clamp((t - M.idu) / Math.max(0.6, M.otkryvayu - M.idu)));
          const x = lerp(830, 512, u), y = lerp(1900, 1388, u), s = lerp(1.25, 0.5, u);
          const bob = Math.abs(Math.sin((t - M.idu) * 5.2)) * 10 * (1 - u);
          nik = `<g transform="translate(${x} ${y - bob}) scale(${s})">${A.nikita({ pose: 'back' })}</g>`;
          door = clamp((t - M.otkryvayu) / 0.6);
          z = lerp(1.15, 1.6, u); fx = lerp(640, 520, u); fy = lerp(1300, 1080, u);
        }
        const roomSvg = A.bgRoom({ gap: 0.3, doorOpen: door, voidShape: door * 0.35, underDoor: 1 - door });
        // Никита в прихожей рисуется поверх двери
        return {
          svg: roomSvg + nik, ir: true, cam: { x: fx, y: fy, z },
          hud: { time: 'ВС 03:17:' + pad(Math.floor(lt)) }, glitch: lt < 0.2 ? 1 : 0,
        };
      },
      freeze(t, lt, dur) {
        const base = D_.footage2(M.nePomnyu - 0.01, M.nePomnyu - 0.01 - TL.shots.find(s => s.id === 'footage2').from, 1);
        base.glitch = 0.35 + 0.65 * Math.abs(Math.sin(t * 17));
        base.hud.time = 'ВС 03:17:' + pad(Math.floor(M.nePomnyu - TL.shots.find(s => s.id === 'footage2').from));
        base.fade = clamp((lt - (dur - 0.25)) / 0.25);
        return base;
      },
      end(t, lt, dur) {
        const txt = 'КОМУ ОН ОТКРЫЛ?';
        const n = Math.floor(clamp(lt / 1.1) * txt.length);
        const shown = txt.slice(0, n);
        const blinkC = Math.floor(lt * 2) % 2 === 0;
        return {
          svg: `<rect width="1080" height="1920" fill="#030406"/>
            <text x="540" y="930" text-anchor="middle" font-family="Inter" font-weight="900" font-size="104" fill="#fff">${shown.split(' ').slice(0, 2).join(' ')}</text>
            <text x="540" y="1060" text-anchor="middle" font-family="Inter" font-weight="900" font-size="120" fill="#ff3b2e">${shown.split(' ').slice(2).join(' ')}${blinkC && n < txt.length ? '_' : ''}</text>
            <text x="540" y="1300" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="44" letter-spacing="8" fill="#8792a0" opacity="${clamp((lt - 1.2) / 0.4)}">СЕРИЯ 2 · ПОДПИШИСЬ</text>
            <circle cx="178" cy="1286" r="12" fill="#ff3b2e" opacity="${clamp((lt - 1.2) / 0.4) * (blinkC ? 1 : 0.2)}"/>`,
          cam: { x: 540, y: 960, z: 1 }, noGrainVign: false,
        };
      },
    };
    return D_;
  }

  // ---------------- СБОРКА КАДРА ----------------
  function frameSVG(state, t, frameNo) {
    const { TL, DRAW, chunks } = state;
    const sh = TL.shots.find(s => t >= s.from && t < s.to) || TL.shots[TL.shots.length - 1];
    const lt = t - sh.from, dur = sh.to - sh.from;
    const r = DRAW[sh.id](t, lt, dur);
    let { x, y, z } = r.cam;
    const shake = r.shake || 1;
    x += Math.sin(t * 1.3) * 2.2 * shake + Math.sin(t * 3.7) * 0.8 * shake;
    y += Math.cos(t * 1.1) * 2.0 * shake;
    x = clamp(x, 540 / z, 1080 - 540 / z); y = clamp(y, 960 / z, 1920 - 960 / z);
    const camT = `translate(540 960) scale(${z.toFixed(4)}) translate(${(-x).toFixed(2)} ${(-y).toFixed(2)})`;
    let scene = `<g transform="${camT}">${r.svg}</g>`;
    if (r.ir) scene = `<g filter="url(#ir)">${scene}</g>` + root.ART.camHUD({ time: r.hud && r.hud.time });
    let body = `<defs><g id="scn">${scene}</g></defs><use href="#scn"/>`;
    if (r.glitch) {
      const rnd = root.ART.rng(frameNo * 7 + 3);
      let sl = '';
      for (let k = 0; k < 6; k++) {
        const yy = Math.floor(rnd() * 1800), hh = 20 + Math.floor(rnd() * 120), dx = (rnd() - 0.5) * 120 * r.glitch;
        sl += `<clipPath id="gc${k}"><rect x="0" y="${yy}" width="1080" height="${hh}"/></clipPath><g clip-path="url(#gc${k})"><use href="#scn" x="${dx.toFixed(1)}"/></g>`;
      }
      body += sl + `<use href="#scn" x="${(9 * r.glitch).toFixed(1)}" opacity=".35" style="mix-blend-mode:screen" filter="url(#redOnly)"/>`;
    }
    // титры дня и времени
    let title = '';
    for (const ti of TL.titles) {
      if (t >= ti.from && t < ti.to) {
        const n = Math.floor(clamp((t - ti.from) / 0.6) * ti.text.length);
        const a = clamp((ti.to - t) / 0.25);
        title = `<g opacity="${a}"><rect x="70" y="280" width="${60 + ti.text.length * 33}" height="84" rx="6" fill="#000" opacity=".55"/>
          <text x="100" y="337" font-family="JetBrains Mono" font-weight="700" font-size="52" fill="#e6efe8">${ti.text.slice(0, n)}${n < ti.text.length || Math.floor(t * 2) % 2 ? '▌' : ''}</text></g>`;
      }
    }
    const badge = sh.id === 'end' ? '' : `<g opacity=".8"><text x="70" y="232" font-family="Inter" font-weight="900" font-size="34" letter-spacing="5" fill="#ffffff" stroke="#000" stroke-width="6" paint-order="stroke">ПРЕСЛЕДОВАТЕЛЬ<tspan fill="#ff3b2e"> · 1</tspan></text></g>`;
    const grain = `<filter id="gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="${frameNo % 47}" stitchTiles="stitch"/><feColorMatrix type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 .6"/></filter>`;
    const fade = r.fade ? `<rect width="1080" height="1920" fill="#000" opacity="${r.fade}"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920" style="display:block;background:#000">
      <defs>${grain}</defs>
      ${body}
      <rect width="1080" height="1920" fill="url(#vign)"/>
      ${root.GRAIN ? `<image href="${root.GRAIN[Math.floor(frameNo / 2) % root.GRAIN.length]}" x="0" y="0" width="1080" height="1920" preserveAspectRatio="none" opacity=".38" style="mix-blend-mode:overlay;image-rendering:pixelated"/>` : `<rect width="1080" height="1920" filter="url(#gr)" opacity=".42" style="mix-blend-mode:overlay"/>`}
      ${fade}
      ${title}${badge}
      ${subsSVG(chunks, t)}
    </svg>`;
  }

  function init(D, measure) {
    const TL = buildTimeline(D);
    const DRAW = makeDraw(TL, D);
    const chunks = buildSubs(D, measure);
    return { TL, DRAW, chunks };
  }

  root.EPISODE = { buildTimeline, buildSubs, init, frameSVG };
  if (typeof module !== 'undefined') module.exports = root.EPISODE;
})(typeof window !== 'undefined' ? window : globalThis);
