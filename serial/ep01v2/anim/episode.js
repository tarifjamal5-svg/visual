// ПРЕСЛЕДОВАТЕЛЬ, серия 1 «Нас двое» - таймлайн, кадры, субтитры, звуковые события.
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
    const endStart = U('n27').end + 0.7;
    const shots = [
      ['hook', 0, S('n2')],
      ['mug', S('n2'), S('n4')],
      ['doorAjar', S('n4'), S('n5')],
      ['cam', S('n5'), S('n6')],
      ['clock', S('n6'), S('n7')],
      ['irDoor', S('n7'), S('n8')],
      ['enter', S('n8'), S('n10')],
      ['noFace', S('n10'), S('n11')],
      ['sitBed', S('n11'), S('n14')],
      ['lock', S('n14'), S('n16')],
      ['awake', S('n16'), S('n18')],
      ['live', S('n18'), S('n21')],
      ['exhale', S('n21'), S('n22')],
      ['liveCloset', S('n22'), S('n23')],
      ['inside', S('n23'), S('n24')],
      ['bolt', S('n24'), S('n25')],
      ['face', S('n25'), endStart],
      ['end', endStart, END],
    ].map(([id, from, to]) => ({ id, from, to }));

    const M = {
      dvoe: W('n1', -1).start,
      kameru: W('n5', -1).start,
      opens: U('n7').start,
      noFace: U('n10').start,
      utra: U('n13').start,
      zamok: W('n14', -1).start,
      zasov: W('n15', -1).start,
      exhale: U('n21').start,
      shkaf: W('n22', -1).start,
      uhodil: U('n23').start,
      dyshit: W('n26', -1).start,
      zatylok: U('n27').start,
      endStart,
    };

    const cues = [
      { sfx: 'vhs', t: 0, dur: S('n2'), gain: -20 },
      { sfx: 'glitch', t: M.dvoe - 0.08, gain: -10 },
      { sfx: 'boom', t: M.dvoe, gain: -8 },
      { sfx: 'click', t: S('n4') + 0.3, gain: -14 },
      { sfx: 'beep', t: M.kameru + 0.05, gain: -20 },
      { sfx: 'glitch', t: S('n7') - 0.05, gain: -14 },
      { sfx: 'vhs', t: S('n7'), dur: S('n14') - S('n7'), gain: -26 },
      { sfx: 'creak', t: M.opens + 0.1, gain: -9 },
      { sfx: 'footsteps', t: S('n8') + 0.1, gain: -14 },
      { sfx: 'boom', t: M.noFace, gain: -9 },
      { sfx: 'heartbeat', t: S('n11'), dur: S('n14') - S('n11'), gain: -12 },
      { sfx: 'glitch', t: M.utra, gain: -16 },
      { sfx: 'key_lock', t: M.zamok - 0.6, gain: -8 },
      { sfx: 'click', t: M.zasov + 0.05, gain: -6 },
      { sfx: 'beep', t: S('n18') + 0.1, gain: -24 },
      { sfx: 'vhs', t: S('n18'), dur: S('n21') - S('n18'), gain: -28 },
      { sfx: 'breath', t: M.exhale - 0.1, gain: -16, dur: 1.6 },
      { sfx: 'creak', t: S('n22') + 1.0, gain: -10 },
      { sfx: 'heartbeat', t: S('n22'), dur: endStart - S('n22'), gain: -11 },
      { sfx: 'boom', t: M.uhodil - 0.05, gain: -8 },
      { sfx: 'click', t: S('n24') + 0.2, gain: -12 },
      { sfx: 'breath', t: M.dyshit - 0.2, gain: -6, dur: endStart - M.dyshit + 0.6 },
      { sfx: 'boom', t: endStart, gain: -10 },
    ];
    const rainAuto = [
      [0, -38], [S('n2'), -34], [S('n6'), -32], [S('n14'), -36], [S('n16'), -30], [S('n25'), -40], [END, -44],
    ];
    return { shots, M, cues, rainAuto, duration: END, U, W, S };
  }

  // ---------------- СУБТИТРЫ ----------------
  const RED = ['двое', 'сама', 'он', 'лица', 'сплю', 'утра', 'шкаф', 'уходил', 'ним', 'дышит', 'затылка', '03:17', 'оборачиваюсь', 'запер'];
  const YEL = ['один', 'кружка', 'дверь', 'камеру', 'камеры', 'замок', 'засов', 'трансляцию', 'заперта', 'экране', 'спиной', 'кровати', 'высокий', 'выдыхаю'];
  const norm = w => w.toLowerCase().replace(/[«»"“”.,:;!?…]/g, '').replace(/́/g, '');

  function buildSubs(D, measure) {
    const order = Object.keys(D.units).sort((a, b) => D.units[a].start - D.units[b].start);
    const chunks = [];
    for (const id of order) {
      const raw = D.units[id].words;
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
        const txt = w.w.replace(/[«»"]/g, '').replace(/\.\.\.$/, '').replace(/[.,:;!]+$/, '').replace(/́/g, '').toUpperCase();
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
      const c = chunks[i], next = chunks[i + 1];
      const lastEnd = c.words[c.words.length - 1].end;
      c.to = Math.min(next ? next.from : lastEnd + 0.6, lastEnd + 0.6);
      const FS = 96, maxW = 880;
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
        const scale = lw > maxW ? maxW / lw : 1;
        let x = 520 - (lw * scale) / 2;
        const y = lines.length === 1 ? 1240 : 1182 + li * 112;
        ln.forEach(k => {
          c.layout.push({ k, x: x + (widths[k] * scale) / 2, y, fs: FS * scale });
          x += (widths[k] + space) * scale;
        });
      });
    }
    return chunks;
  }

  function subsSVG(chunks, t) {
    const c = chunks.find(ch => t >= ch.from && t < ch.to);
    if (!c) return '';
    const out = c.layout.map(l => {
      const w = c.words[l.k];
      if (t < w.start - 0.03) return '';
      const age = t - w.start;
      const pop = age < 0.14 ? 1 + 0.14 * (1 - age / 0.14) : 1;
      const col = RED.includes(w.key) ? '#ff3b2e' : YEL.includes(w.key) ? '#f2c230' : '#ffffff';
      return `<g transform="translate(${l.x.toFixed(1)} ${l.y}) scale(${pop.toFixed(3)})"><text x="0" y="0" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${l.fs.toFixed(1)}" fill="${col}" stroke="#000" stroke-width="18" stroke-linejoin="round" paint-order="stroke">${w.txt}</text></g>`;
    }).join('');
    return `<g filter="url(#subShadow)">${out}</g>`;
  }

  // ---------------- КАДРЫ ----------------
  function makeDraw(TL, D) {
    const A = root.ART, X = root.ART_EXTRA, M = TL.M;
    const blinkAt = t => { const ph = t % 3.7; return ph < 0.12 ? Math.sin((ph / 0.12) * Math.PI) : 0; };
    const lampFlicker = t => {
      const a = Math.sin(t * 13.1) * Math.sin(t * 7.3 + 1) * Math.sin(t * 2.1);
      return a > 0.55 ? 0.35 : 1 - 0.06 * Math.abs(Math.sin(t * 31));
    };
    const room = (o, mid) => A.bgRoom(Object.assign({ gap: 0, noCam: true, mid }, o));
    const lying = (o = {}) => X.nikitaLying(o);
    const sitFig = (op = 1) => `<g transform="translate(730 1665) scale(0.95)">${X.shadowSit({ opacity: op })}</g>`;
    const closetBlack = (open, fig) => `<rect x="182" y="388" width="${142 * Math.min(1, open)}" height="1136" fill="#000"/>` +
      (fig ? `<g transform="translate(250 1524) scale(0.64)" opacity="${fig}">${A.shadowMan()}</g><g transform="translate(250 1524) scale(0.64)" opacity="${fig}"><path d="M 0 -712 Q 54 -710 60 -640 Q 64 -598 50 -578 Q 120 -562 130 -500" stroke="#6f86a8" stroke-width="5" fill="none" opacity=".55"/></g>` : '');
    const hand = (x, y, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M 0 0 L 40 260" stroke="#3a4231" stroke-width="120" stroke-linecap="round"/><ellipse cx="0" cy="-10" rx="62" ry="80" fill="#c39f88"/><ellipse cx="28" cy="6" rx="26" ry="52" fill="#9d7b69"/></g>`;
    const clock = (t0, t, h, m) => { const s = Math.floor(t - t0); return `${pad(h)}:${pad(m + Math.floor(s / 60))}:${pad(s % 60)}`; };

    const DR = {
      hook(t, lt, dur) {
        const shown = t >= M.dvoe - 0.05;
        const z = shown ? lerp(1.25, 1.55, easeOut(prog(t, M.dvoe, M.dvoe + 1.5))) : lerp(1.1, 1.22, lt / Math.max(0.1, M.dvoe));
        return {
          svg: room({ gap: 0, dawn: 0.1 }, lying()), over: shown ? sitFig(1) : '', ir: true,
          cam: { x: shown ? lerp(790, 760, prog(t, M.dvoe, M.dvoe + 1)) : 840, y: shown ? 1420 : 1400, z },
          hud: { time: 'ПН ' + clock(0, t, 4, 12) }, glitch: (lt < 0.12 || Math.abs(t - M.dvoe) < 0.12) ? 1 : 0,
        };
      },
      mug(t, lt, dur) {
        return { svg: A.bgKitchen({ flicker: lampFlicker(t) }), cam: { x: 470, y: 1400, z: lerp(1.5, 1.9, ease(lt / dur)) } };
      },
      doorAjar(t, lt, dur) {
        return { svg: room({ dawn: 0.6, doorOpen: 0.18, doorLight: true }), cam: { x: 510, y: 1060, z: lerp(2.2, 2.5, lt / dur) } };
      },
      cam(t, lt, dur) {
        const on = t >= M.kameru;
        const hy = lt < dur * 0.45 ? lerp(1700, 1330, easeOut(lt / (dur * 0.45))) : lerp(1330, 2300, ease(prog(lt, dur * 0.55, dur * 0.9)));
        return {
          svg: `<g filter="url(#b16)">${room({ underDoor: 0.4 })}</g><rect width="1080" height="1920" fill="#000" opacity=".35"/>
            <rect x="140" y="1180" width="800" height="40" fill="#1f1b22"/>
            <g transform="translate(540 1180) scale(5.2)">${A.petCam(on)}</g>${hand(760, hy, -20)}
            ${on ? `<circle cx="644" cy="1107" r="${60 + 10 * Math.sin(t * 9)}" fill="url(#glowRed)" opacity=".8"/>` : ''}`,
          cam: { x: 540, y: 1100, z: lerp(1.0, 1.08, lt / dur) },
        };
      },
      clock(t, lt, dur) {
        const g = 0.75 + 0.25 * Math.sin(t * 5);
        return {
          svg: `<g filter="url(#b16)">${room({})}</g><rect width="1080" height="1920" fill="#000" opacity=".6"/>
            <g transform="translate(540 960) scale(${lerp(6.5, 7.2, lt / dur)})">${A.digitalClock('03:17', g)}</g>`,
          cam: { x: 540, y: 960, z: 1 },
        };
      },
      irDoor(t, lt, dur) {
        const o = easeOut(prog(t, M.opens + 0.2, M.opens + 1.4));
        return {
          svg: room({ doorOpen: o, doorLight: true, underDoor: 1 - o }, lying()), ir: true,
          cam: { x: 520, y: 1100, z: lerp(1.6, 2.0, ease(lt / dur)) }, hud: { time: 'ПН ' + clock(0, lt, 3, 17) }, glitch: lt < 0.15 ? 1 : 0,
        };
      },
      enter(t, lt, dur) {
        const u = ease(clamp(lt / dur));
        const fig = `<g transform="translate(${lerp(512, 590, u)} ${lerp(1388, 1690, u)}) scale(${lerp(0.55, 1.05, u)})">${A.shadowMan()}</g>`;
        return {
          svg: room({ doorOpen: 1, doorLight: true, underDoor: 0 }, lying()), over: fig, ir: true,
          cam: { x: lerp(520, 600, u), y: lerp(1150, 1250, u), z: lerp(1.7, 1.35, u) }, hud: { time: 'ПН ' + clock(0, lt + 5, 3, 17) },
        };
      },
      noFace(t, lt, dur) {
        const fig = `<g transform="translate(590 1690) scale(1.05)">${A.shadowMan()}</g>`;
        return {
          svg: room({ doorOpen: 1, doorLight: true, underDoor: 0 }, lying()), over: fig, ir: true,
          cam: { x: 590, y: 1690 - 1.05 * 640, z: lerp(3.2, 4.0, easeOut(clamp(lt / 0.8))) }, hud: { time: 'ПН ' + clock(0, lt + 7, 3, 17) },
          shake: 2.5, glitch: lt < 0.1 ? 1 : 0,
        };
      },
      sitBed(t, lt, dur) {
        const fast = t >= M.utra;
        const f = fast ? prog(t, M.utra, M.utra + 1.2) : 0;
        const mins = Math.floor(lerp(19, 221, f));
        const time = fast ? `ПН ${pad(3 + Math.floor((17 + mins) / 60))}:${pad((17 + mins) % 60)}:${pad(Math.floor(lt * 37) % 60)}` : 'ПН ' + clock(0, lt + 12, 3, 17);
        return {
          svg: room({ dawn: 0.1 + 0.8 * f }, lying()), over: sitFig(1), ir: true,
          cam: { x: 790, y: 1420, z: lerp(1.3, 1.5, ease(lt / dur)) }, hud: { time }, glitch: fast && f < 1 ? 0.25 : 0,
        };
      },
      lock(t, lt, dur) {
        const k = easeOut(prog(t, M.zamok - 0.75, M.zamok - 0.25));
        const turn = ease(prog(t, M.zamok - 0.1, M.zamok + 0.3));
        const bolt = ease(prog(t, M.zasov - 0.15, M.zasov + 0.2));
        const focusBolt = t >= M.zasov - 0.4;
        return {
          svg: X.doorCloseup({ num: '', keyIn: k, turn, hand: !focusBolt, tag: false, bolt }),
          cam: focusBolt ? { x: 640, y: 780, z: lerp(1.4, 1.6, prog(t, M.zasov - 0.4, M.zasov + 1)) } : { x: 540, y: 1200, z: lerp(1.0, 1.12, lt / dur) },
        };
      },
      awake(t, lt, dur) {
        return { svg: X.faceLying({ eyesWide: true, lookX: 0.6, blink: blinkAt(t) * 0.5, glow: 0.85 + 0.15 * Math.sin(t * 3) }), cam: { x: 560, y: 900, z: lerp(1.0, 1.15, ease(lt / dur)) } };
      },
      live(t, lt, dur) {
        const inner = `<g filter="url(#ir)">${room({}, lying({ blink: 0 }))}</g>${A.camHUD({ time: 'ВТ ' + clock(0, lt, 3, 17), rec: 'LIVE' })}`;
        return { svg: X.phone(inner, { progress: 1, label: 'LIVE', thumb: true }), cam: { x: 540, y: 980, z: lerp(1.0, 1.18, ease(lt / dur)) } };
      },
      exhale(t, lt, dur) {
        const closed = lt > 0.15 && lt < dur * 0.75;
        return { svg: X.faceLying({ blink: closed ? 1 : 0, glow: 0.9 }), cam: { x: 560, y: 900, z: lerp(1.15, 1.08, lt / dur) } };
      },
      liveCloset(t, lt, dur) {
        const o = ease(prog(t, S0(t, lt) + 1.0, M.shkaf + 0.4)) * 0.75;
        const inner = room({ closetOpen: o, closetDark: true }, lying({ blink: 0 }));
        return {
          svg: inner, over: o > 0.01 ? closetBlack(o, 0) : '', ir: true, rec: 'LIVE',
          cam: { x: lerp(560, 260, ease(prog(lt, 0.3, dur))), y: lerp(1300, 1120, ease(prog(lt, 0.3, dur))), z: lerp(1.15, 1.8, ease(prog(lt, 0.3, dur))) },
          hud: { time: 'ВТ ' + clock(0, lt + 5, 3, 17) },
        };
      },
      inside(t, lt, dur) {
        return {
          svg: room({ closetOpen: 0.75, closetDark: true }, lying({ blink: 0 })), over: closetBlack(0.75, easeOut(clamp(lt / 0.5))), ir: true, rec: 'LIVE',
          cam: { x: 270, y: 1170, z: lerp(1.8, 2.05, lt / dur) }, hud: { time: 'ВТ ' + clock(0, lt + 9, 3, 17) }, glitch: lt < 0.12 ? 1 : 0, shake: 2,
        };
      },
      bolt(t, lt, dur) {
        return {
          svg: X.doorCloseup({ num: '', keyIn: 1, turn: 1, hand: false, tag: false, bolt: 1 }) + `<rect width="1080" height="1920" fill="#7a0d08" opacity=".35" style="mix-blend-mode:multiply"/>`,
          cam: { x: 640, y: 780, z: lerp(1.6, 2.1, ease(lt / dur)) },
        };
      },
      face(t, lt, dur) {
        const behind = t < M.dyshit - 0.2 ? 0 : lerp(0.15, 0.6, ease(prog(t, M.dyshit - 0.2, M.zatylok))) + lerp(0, 0.4, ease(prog(t, M.zatylok, M.endStart - 0.2)));
        const black = clamp((t - (M.endStart - 0.12)) / 0.12);
        return {
          svg: X.faceLying({ eyesWide: true, lookX: -0.5, glow: 0.8 + 0.2 * Math.sin(t * 2.3), behind }),
          cam: { x: 520, y: 860, z: lerp(1.1, 1.45, ease(lt / dur)) }, shake: 1.6, fade: black,
        };
      },
      end(t, lt, dur) {
        const a = clamp(lt / 0.25);
        const pulse = 0.85 + 0.15 * Math.sin(lt * 6);
        return {
          svg: `<rect width="1080" height="1920" fill="#030406"/>
            <text x="540" y="900" text-anchor="middle" font-family="Inter" font-weight="900" font-size="112" fill="#ff3b2e" opacity="${a * pulse}">ОБЕРНУТЬСЯ?</text>
            <text x="540" y="1060" text-anchor="middle" font-family="Inter" font-weight="900" font-size="78" fill="#ffffff" opacity="${clamp((lt - 0.5) / 0.3)}">ДА ИЛИ НЕТ</text>
            <text x="540" y="1180" text-anchor="middle" font-family="Inter" font-weight="700" font-size="44" letter-spacing="3" fill="#8792a0" opacity="${clamp((lt - 1.0) / 0.3)}">ОТВЕТЬ В КОММЕНТАРИЯХ</text>
            <text x="540" y="1250" text-anchor="middle" font-family="Inter" font-weight="700" font-size="44" letter-spacing="3" fill="#8792a0" opacity="${clamp((lt - 1.3) / 0.3)}">ОТ ЭТОГО ЗАВИСИТ ЧАСТЬ 2</text>`,
          cam: { x: 540, y: 960, z: 1 }, noBadge: true,
        };
      },
    };
    // начало кадра liveCloset (нужно для отсчёта открывания шкафа)
    const S0 = (t, lt) => t - lt;
    return DR;
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
    const over = r.over ? `<g transform="${camT}">${r.over}</g>` : '';
    if (r.ir) scene = `<g filter="url(#ir)">${scene}</g>` + over + root.ART.camHUD({ time: r.hud && r.hud.time, rec: r.rec });
    else scene += over;
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
    const badge = r.noBadge ? '' : `<g opacity=".85"><text x="70" y="232" font-family="Inter" font-weight="900" font-size="34" letter-spacing="5" fill="#ffffff" stroke="#000" stroke-width="6" paint-order="stroke">ПРЕСЛЕДОВАТЕЛЬ</text><text x="70" y="272" font-family="Inter" font-weight="900" font-size="26" letter-spacing="5" fill="#ff3b2e" stroke="#000" stroke-width="5" paint-order="stroke">ЧАСТЬ 1</text></g>`;
    const grain = root.GRAIN ? `<image href="${root.GRAIN[Math.floor(frameNo / 2) % root.GRAIN.length]}" x="0" y="0" width="1080" height="1920" preserveAspectRatio="none" opacity=".38" style="mix-blend-mode:overlay;image-rendering:pixelated"/>` : '';
    const fade = r.fade ? `<rect width="1080" height="1920" fill="#000" opacity="${r.fade}"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920" style="display:block;background:#000">
      ${body}
      <rect width="1080" height="1920" fill="url(#vign)"/>
      ${grain}
      ${fade}
      ${badge}
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
