// «Не открывай» - таймлайн, кадры, субтитры, звуковые события.
(function (root) {
  'use strict';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const ease = u => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const easeOut = u => 1 - Math.pow(1 - u, 3);
  const prog = (t, a, b) => clamp((t - a) / (b - a));

  function buildTimeline(D) {
    const U = id => D.units[id];
    const W = (id, i) => { const ws = U(id).words; return ws[i < 0 ? ws.length + i : i]; };
    const S = id => U(id).start - 0.06;
    const END = D.duration;
    const endStart = U('n19').end + 0.6;
    const M = {
      voice1: W('n0', -1).start,
      bell1: W('n1', -1).end - 0.1,
      coat: U('n4').start, bag: U('n5').start,
      sent: W('n6', -1).end,
      reply1: W('n7', 3).start, reply2: U('n8').start,
      smile: W('n11', -1).start,
      walk: U('n12').start,
      buzz2: U('n14').start,
      bell2: U('n15').start,
      wet: U('n17').start, tired: U('n18').start,
      real: U('n19').start,
      endStart,
    };
    const shots = [
      ['bed', 0, M.voice1 - 0.05],
      ['voice1', M.voice1 - 0.05, S('n1')],
      ['door', S('n1'), S('n2')],
      ['lean', S('n2'), S('n3')],
      ['peep1', S('n3'), S('d0')],
      ['peepTalk', S('d0'), S('n6')],
      ['type', S('n6'), S('n7')],
      ['reply', S('n7'), S('d2')],
      ['peepTalk2', S('d2'), S('n9')],
      ['split', S('n9'), S('n10')],
      ['chain', S('n10'), S('n11')],
      ['smile', S('n11'), M.walk - 0.05],
      ['walk', M.walk - 0.05, S('n13')],
      ['hatch', S('n13'), S('n14')],
      ['bed2', S('n14'), S('p2')],
      ['voice2', S('p2'), S('n15')],
      ['door2', S('n15'), S('n16')],
      ['real', S('n16'), M.real - 0.05],
      ['stare', M.real - 0.05, endStart],
      ['end', endStart, END],
    ].map(([id, from, to]) => ({ id, from, to }));
    const cues = [
      { sfx: 'room', t: 0, dur: END, gain: -22 },
      { sfx: 'buzz', t: 0.25, gain: -12 },
      { sfx: 'pop', t: M.voice1 - 0.05, gain: -18 },
      { sfx: 'doorbell', t: M.bell1, gain: -7 },
      { sfx: 'heartbeat', t: S('n2'), dur: S('n6') - S('n2'), gain: -13 },
      { sfx: 'typing', t: S('n6') + 0.6, gain: -16 },
      { sfx: 'pop', t: M.sent, gain: -14 },
      { sfx: 'pop', t: M.reply1 - 0.1, gain: -14 },
      { sfx: 'boom', t: M.reply2, gain: -12 },
      { sfx: 'glitch', t: S('n9'), gain: -18 },
      { sfx: 'chain', t: S('n10') + 0.2, gain: -9 },
      { sfx: 'boom', t: M.smile, gain: -12 },
      { sfx: 'stairs', t: M.walk + 0.2, gain: -12 },
      { sfx: 'wind', t: S('n13'), dur: S('n14') - S('n13') + 0.4, gain: -16 },
      { sfx: 'buzz', t: M.buzz2 + 0.2, gain: -12 },
      { sfx: 'pop', t: S('p2') - 0.05, gain: -18 },
      { sfx: 'doorbell', t: M.bell2 - 0.05, gain: -7 },
      { sfx: 'heartbeat', t: S('n16'), dur: endStart - S('n16'), gain: -11 },
      { sfx: 'boom', t: endStart, gain: -9 },
    ];
    const rainAuto = [[0, -40], [S('n16'), -30], [endStart, -40], [END, -44]];
    return { shots, M, cues, rainAuto, duration: END, U, W, S };
  }

  // ---------- субтитры ----------
  const RED = ['открывай', 'голосом', 'врёт', 'улыбаться', 'вверх', 'лестнице', 'этаже', 'настоящая', 'холодно', 'последнем'];
  const YEL = ['голосовое', 'глазок', 'глазке', 'пальто', 'сумка', 'телефону', 'ключи', 'смене', 'звонок', 'мокрая', 'уставшая', 'позвонили', 'дверь', 'двери', 'дверью', 'украли'];
  const norm = w => w.toLowerCase().replace(/[«»"“”.,:;!?…]/g, '');

  function buildSubs(D, measure) {
    const order = Object.keys(D.units).sort((a, b) => D.units[a].start - D.units[b].start);
    const chunks = [];
    for (const id of order) {
      const raw = D.units[id].words, ws = [];
      for (let i = 0; i < raw.length; i++) {
        if (norm(raw[i].w) === 'три' && raw[i + 1] && norm(raw[i + 1].w).startsWith('семнадцать')) { ws.push({ w: '03:17', start: raw[i].start, end: raw[i + 1].end }); i++; continue; }
        ws.push(raw[i]);
      }
      let cur = [];
      const flush = () => { if (cur.length) chunks.push({ unit: id, sp: D.units[id].speaker, words: cur }); cur = []; };
      for (const w of ws) {
        const txt = w.w.replace(/[«»"]/g, '').replace(/[.,:;!]+$/, '').toUpperCase();
        const len = cur.reduce((s, c) => s + c.txt.length + 1, 0) + txt.length;
        if (cur.length && (cur.length >= 4 || len > 21)) flush();
        cur.push({ txt, start: w.start, end: w.end, key: norm(w.w) });
        if (/[.?!…]$/.test(w.w)) flush();
      }
      flush();
    }
    chunks.forEach(c => { c.from = c.words[0].start - 0.04; });
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i], next = chunks[i + 1], lastEnd = c.words[c.words.length - 1].end;
      c.to = Math.min(next ? next.from : lastEnd + 0.6, lastEnd + 0.6);
      const FS = 92, maxW = 880;
      const widths = c.words.map(w => measure(w.txt, FS)), space = measure(' ', FS) + 40;
      const total = widths.reduce((a, b) => a + b, 0) + space * (c.words.length - 1);
      let lines = [c.words.map((w, k) => k)];
      if (total > maxW && c.words.length > 1) {
        let best = 1, bd = 1e9;
        for (let k = 1; k < c.words.length; k++) {
          const a = widths.slice(0, k).reduce((x, y) => x + y, 0), b = widths.slice(k).reduce((x, y) => x + y, 0);
          if (Math.abs(a - b) < bd) { bd = Math.abs(a - b); best = k; }
        }
        lines = [c.words.map((w, k) => k).slice(0, best), c.words.map((w, k) => k).slice(best)];
      }
      c.layout = [];
      lines.forEach((ln, li) => {
        const lw = ln.reduce((s, k) => s + widths[k], 0) + space * (ln.length - 1);
        const sc = lw > maxW ? maxW / lw : 1;
        let x = 540 - (lw * sc) / 2;
        const y = lines.length === 1 ? 1390 : 1340 + li * 106;
        ln.forEach(k => { c.layout.push({ k, x: x + (widths[k] * sc) / 2, y, fs: FS * sc }); x += (widths[k] + space) * sc; });
      });
    }
    return chunks;
  }

  function subsSVG(chunks, t) {
    const c = chunks.find(ch => t >= ch.from && t < ch.to);
    if (!c) return '';
    let label = '';
    if (c.sp === 'p' || c.sp === 'd') {
      const name = c.sp === 'p' ? 'ГОЛОСОВОЕ ОТ МАМЫ' : 'ЗА ДВЕРЬЮ';
      const col = c.sp === 'p' ? '#7fc4ff' : '#ff8fb0';
      const top = Math.min(...c.layout.map(l => l.y)) - 96;
      label = `<text x="540" y="${top}" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" letter-spacing="4" fill="${col}" stroke="#000" stroke-width="9" paint-order="stroke">${name}</text>`;
    }
    const base = c.sp === 'p' ? '#d9efff' : c.sp === 'd' ? '#ffe3ec' : '#ffffff';
    const out = c.layout.map(l => {
      const w = c.words[l.k];
      if (t < w.start - 0.03) return '';
      const age = t - w.start, pop = age < 0.14 ? 1 + 0.14 * (1 - age / 0.14) : 1;
      const col = RED.includes(w.key) ? '#ff3b2e' : YEL.includes(w.key) ? '#f2c230' : base;
      return `<g transform="translate(${l.x.toFixed(1)} ${l.y}) scale(${pop.toFixed(3)})"><text x="0" y="0" text-anchor="middle" font-family="Inter" font-weight="900" font-size="${l.fs.toFixed(1)}" fill="${col}" stroke="#000" stroke-width="18" stroke-linejoin="round" paint-order="stroke">${w.txt}</text></g>`;
    }).join('');
    return `<g filter="url(#subShadow)">${label}${out}</g>`;
  }

  // ---------- кадры ----------
  function makeDraw(TL, D) {
    const A = root.ART, X = root.ART_EXTRA, B = root.ART2, M = TL.M;
    const blinkAt = t => { const ph = t % 3.3; return ph < 0.12 ? Math.sin((ph / 0.12) * Math.PI) : 0; };
    const speaking = (prefix, t) => {
      for (const [id, u] of Object.entries(D.units)) {
        if (!id.startsWith(prefix)) continue;
        const w = u.words.find(x => t >= x.start && t <= x.end);
        if (w) return 0.5 + 0.5 * Math.abs(Math.sin((t - w.start) * Math.PI * 7));
      }
      return 0;
    };
    const flick = t => (Math.sin(t * 11.3) * Math.sin(t * 5.1) > 0.7 ? 0.45 : 1);
    // площадка + фигура мамы (без тени у «маминой копии», с тенью у настоящей)
    const landingWith = (t, momSvg, opts = {}) => B.landing({ flicker: flick(t), figure: momSvg });
    const fakeMom = (o, sc = 1.1, y = 760) => `<g transform="translate(540 ${y}) scale(${sc})">${B.momUpper(Object.assign({ kind: 'fake' }, o))}</g>`;
    const realMom = (o, sc = 1.1, y = 760) => `<g transform="translate(600 ${y - 10}) scale(${sc})" opacity=".45" style="mix-blend-mode:multiply"><g transform="scale(1.02)">${B.momUpper({ kind: 'real' }).replace(/fill="#[0-9a-fA-F]{6}"/g, 'fill="#1b1f1c"')}</g></g>` +
      `<g transform="translate(540 ${y}) scale(${sc})">${B.momUpper(Object.assign({ kind: 'real' }, o))}</g>`;
    const peep = (inner, zoom, fx = 540, fy = 900) => B.peephole(`<g transform="translate(540 900) scale(${zoom}) translate(${-fx} ${-fy})">${inner}</g>`, { zoom: 1.0 });
    const doorIn = (o = {}) => {
      const chain = o.chain == null ? 0 : o.chain;
      let links = '';
      const x0 = 160, x1 = lerp(320, 700, chain), y0 = 760;
      for (let i = 0; i <= 8; i++) { const u = i / 8, x = lerp(x0, x1, u), y = y0 + Math.sin(u * Math.PI) * lerp(70, 8, chain); links += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="16" ry="10" fill="none" stroke="#b9b6ae" stroke-width="6" transform="rotate(${i % 2 ? 0 : 90} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }
      return X.doorCloseup({ num: '', keyIn: 0, hand: false, tag: false }) +
        `<rect x="${x0 - 30}" y="${y0 - 40}" width="60" height="80" rx="10" fill="#8f8a80"/><rect x="680" y="${y0 - 26}" width="150" height="52" rx="10" fill="#8f8a80"/><rect x="690" y="${y0 - 8}" width="120" height="16" rx="8" fill="#3a3632"/>` + links +
        `<rect x="0" y="1880" width="1080" height="40" fill="#ffd27a" opacity="${o.under == null ? 0.5 : o.under}"/><rect x="0" y="1840" width="1080" height="80" fill="#ffd27a" opacity=".12" filter="url(#b16)"/>`;
    };
    const momMsgs = (stage, t) => {
      const m = [{ type: 'voice', from: 'mom', dur: '0:04', time: '03:17', progress: 1 }];
      if (stage >= 1) m.push({ type: 'text', from: 'me', lines: ['Ты где?'], time: '03:18' });
      if (stage >= 2) m.push({ type: 'text', from: 'mom', lines: ['На смене до утра.'], time: '03:18' });
      if (stage >= 3) m.push({ type: 'text', from: 'mom', lines: ['Оно говорит', 'моим голосом.'], time: '03:18' });
      return m;
    };
    const DR = {
      bed(t, lt, dur) {
        return { svg: B.lisaBed({ blink: lt < 0.25 ? 1 : blinkAt(t), lookX: 0.5, notify: lt > 0.2, glow: lt > 0.2 ? 1 : 0.35 }), cam: { x: 560, y: 900, z: lerp(1.05, 1.2, ease(lt / dur)) } };
      },
      voice1(t, lt, dur) {
        const p0 = TL.U('p0').start, p1 = TL.U('p1').end;
        const playing = t >= p0 && t <= p1;
        return { svg: B.chat({ msgs: [{ type: 'voice', from: 'mom', dur: '0:04', time: '03:17', playing, progress: prog(t, p0, p1) }], t, clock: '03:17' }), cam: { x: 540, y: 700, z: lerp(1.25, 1.4, ease(lt / dur)) }, noBadge: true };
      },
      door(t, lt, dur) {
        const ring = t >= M.bell1 ? Math.exp(-(t - M.bell1) * 3) : 0;
        return { svg: doorIn({ under: 0.5 + 0.4 * ring }), cam: { x: 540 + Math.sin(t * 60) * 6 * ring, y: 1100, z: lerp(1.05, 1.18, ease(lt / dur)) }, shake: 1 + 4 * ring };
      },
      lean(t, lt, dur) {
        const u = ease(clamp(lt / dur));
        return { svg: doorIn({}) + `<g transform="translate(${lerp(300, 470, u)} ${lerp(1650, 1420, u)}) scale(${lerp(1.6, 1.9, u)})">${B.lisaBack({ lean: u })}</g>`, cam: { x: 540, y: 1150, z: 1.05 } };
      },
      peep1(t, lt, dur) {
        let fx = 540, fy = 900, z = 1.0;
        if (t >= M.bag) { const u = easeOut(prog(t, M.bag, M.bag + 0.5)); fx = lerp(540, 360, u); fy = lerp(1060, 1240, u); z = lerp(1.7, 2.1, u); }
        else if (t >= M.coat) { const u = easeOut(prog(t, M.coat, M.coat + 0.5)); fx = 540; fy = lerp(900, 1060, u); z = lerp(1.0, 1.7, u); }
        return { svg: peep(landingWith(t, fakeMom({})), z, fx, fy), cam: { x: 540, y: 960, z: 1 } };
      },
      peepTalk(t, lt, dur) {
        return { svg: peep(landingWith(t, fakeMom({ mouthOpen: speaking('d', t) })), lerp(1.25, 1.45, ease(lt / dur)), 540, 900), cam: { x: 540, y: 960, z: 1 } };
      },
      type(t, lt, dur) {
        const txt = 'Ты где?';
        const n = Math.floor(clamp((t - (TL.S('n6') + 0.6)) / 1.0) * txt.length);
        const sent = t >= M.sent;
        return { svg: B.chat({ msgs: sent ? momMsgs(1) : momMsgs(0), input: sent ? '' : txt.slice(0, n), t, clock: '03:18' }), cam: { x: 540, y: 960, z: 1.12 }, noBadge: true };
      },
      reply(t, lt, dur) {
        const st = t >= M.reply2 ? 3 : t >= M.reply1 ? 2 : 1;
        return { svg: B.chat({ msgs: momMsgs(st), typing: st === 1, t, clock: '03:18', status: st === 1 ? 'печатает...' : 'в сети' }), cam: { x: 540, y: 820, z: lerp(1.12, 1.3, ease(lt / dur)) }, noBadge: true };
      },
      peepTalk2(t, lt, dur) {
        return { svg: peep(landingWith(t, fakeMom({ mouthOpen: speaking('d', t) })), lerp(1.8, 2.3, ease(lt / dur)), 540, 870), cam: { x: 540, y: 960, z: 1 }, shake: 1.3 };
      },
      split(t, lt, dur) {
        const top = `<g transform="translate(0 -230)">${B.chat({ msgs: momMsgs(3), t, clock: '03:19' })}</g>`;
        const bot = `<g transform="translate(108 870) scale(0.8)">${peep(landingWith(t, fakeMom({})), 1.7, 540, 870)}</g>`;
        return {
          svg: `<defs><clipPath id="cT"><rect width="1080" height="955"/></clipPath><clipPath id="cB"><rect y="965" width="1080" height="955"/></clipPath></defs>
            <rect width="1080" height="1920" fill="#000"/><g clip-path="url(#cT)">${top}</g><g clip-path="url(#cB)">${bot}</g>
            <rect y="952" width="1080" height="16" fill="#ff3b2e"/>`,
          cam: { x: 540, y: 960, z: 1 }, glitch: lt < 0.12 ? 1 : 0, noBadge: true,
        };
      },
      chain(t, lt, dur) {
        const c = easeOut(prog(lt, 0.15, 0.75));
        return { svg: doorIn({ chain: c }), cam: { x: lerp(420, 470, c), y: 820, z: lerp(1.6, 1.75, ease(lt / dur)) } };
      },
      smile(t, lt, dur) {
        const sm = 1 - ease(prog(t, M.smile, M.smile + 0.6));
        return { svg: peep(landingWith(t, fakeMom({ smile: sm })), lerp(2.1, 2.5, ease(lt / dur)), 540, 900), cam: { x: 540, y: 960, z: 1 } };
      },
      walk(t, lt, dur) {
        const u = ease(clamp(lt / (dur * 0.9)));
        const fig = `<g transform="translate(${lerp(90, 350, u)} ${lerp(1470, 1130, u)}) scale(${lerp(1.5, 0.95, u)})" opacity="${1 - prog(u, 0.85, 1)}">${B.momWalking()}</g>`;
        return { svg: peep(landingWith(t, fig), 1.0, 360, 1180), cam: { x: 540, y: 960, z: 1 } };
      },
      hatch(t, lt, dur) {
        return { svg: B.roofHatch({}), cam: { x: 540, y: lerp(1100, 700, ease(lt / dur)), z: lerp(1.15, 1.5, ease(lt / dur)) } };
      },
      bed2(t, lt, dur) {
        const clk = `<g transform="translate(540 330) scale(3)">${A.digitalClock('04:17', 0.9)}</g>`;
        return { svg: B.lisaBed({ blink: 0, lookX: 0.6, scared: 0.6, notify: lt > 0.3, glow: 1 }) + clk, cam: { x: 560, y: 820, z: lerp(1.05, 1.15, ease(lt / dur)) } };
      },
      voice2(t, lt, dur) {
        const p0 = TL.U('p2').start, p1 = TL.U('p3').end;
        const msgs = momMsgs(3).concat([{ type: 'voice', from: 'mom', dur: '0:03', time: '04:17', playing: t >= p0 && t <= p1, progress: prog(t, p0, p1) }]);
        return { svg: B.chat({ msgs, t, clock: '04:17' }), cam: { x: 540, y: 1080, z: lerp(1.2, 1.35, ease(lt / dur)) }, noBadge: true };
      },
      door2(t, lt, dur) {
        const ring = t >= M.bell2 ? Math.exp(-(t - M.bell2) * 3) : 0;
        return { svg: doorIn({ chain: 1, under: 0.5 + 0.4 * ring }), cam: { x: 540, y: 1000, z: 1.1 }, shake: 1 + 4 * ring };
      },
      real(t, lt, dur) {
        let fx = 540, fy = 900, z = 1.2;
        if (t >= M.tired) { const u = easeOut(prog(t, M.tired, M.tired + 0.4)); fx = 540; fy = lerp(760, 830, u); z = lerp(2.2, 2.7, u); }
        else if (t >= M.wet) { const u = easeOut(prog(t, M.wet, M.wet + 0.4)); fy = lerp(900, 760, u); z = lerp(1.2, 2.2, u); }
        const r = A.rain(61, t, 60, { len: 30, speed: 900, op: 0.12 });
        return { svg: peep(landingWith(t, realMom({ blink: blinkAt(t), lookY: 0.8 })) + r, z, fx, fy), cam: { x: 540, y: 960, z: 1 } };
      },
      stare(t, lt, dur) {
        const look = ease(prog(lt, 0.2, 0.9));
        const black = clamp((t - (M.endStart - 0.1)) / 0.1);
        return { svg: peep(landingWith(t, realMom({ blink: 0, lookY: lerp(0.8, -0.2, look) })), lerp(2.8, 3.4, ease(lt / dur)), 540, 845), cam: { x: 540, y: 960, z: 1 }, fade: black, shake: 1.4 };
      },
      end(t, lt, dur) {
        const a = clamp(lt / 0.25), pulse = 0.85 + 0.15 * Math.sin(lt * 6);
        return {
          svg: `<rect width="1080" height="1920" fill="#030406"/>
            <text x="540" y="900" text-anchor="middle" font-family="Inter" font-weight="900" font-size="140" fill="#ff3b2e" opacity="${a * pulse}">ОТКРЫТЬ?</text>
            <text x="540" y="1060" text-anchor="middle" font-family="Inter" font-weight="900" font-size="78" fill="#ffffff" opacity="${clamp((lt - 0.5) / 0.3)}">ДА ИЛИ НЕТ</text>
            <text x="540" y="1180" text-anchor="middle" font-family="Inter" font-weight="700" font-size="44" letter-spacing="3" fill="#8792a0" opacity="${clamp((lt - 1.0) / 0.3)}">ОТВЕТЬ В КОММЕНТАРИЯХ</text>`,
          cam: { x: 540, y: 960, z: 1 }, noBadge: true,
        };
      },
    };
    return DR;
  }

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
    const scene = `<g transform="${camT}">${r.svg}</g>`;
    let body = `<defs><g id="scn">${scene}</g></defs><use href="#scn"/>`;
    if (r.glitch) {
      const rnd = root.ART.rng(frameNo * 7 + 3);
      let sl = '';
      for (let k = 0; k < 6; k++) {
        const yy = Math.floor(rnd() * 1800), hh = 20 + Math.floor(rnd() * 120), dx = (rnd() - 0.5) * 120 * r.glitch;
        sl += `<clipPath id="gc${k}"><rect x="0" y="${yy}" width="1080" height="${hh}"/></clipPath><g clip-path="url(#gc${k})"><use href="#scn" x="${dx.toFixed(1)}"/></g>`;
      }
      body += sl;
    }
    const badge = r.noBadge ? '' : `<g opacity=".9"><text x="70" y="232" font-family="Inter" font-weight="900" font-size="36" letter-spacing="5" fill="#ff3b2e" stroke="#000" stroke-width="7" paint-order="stroke">НЕ ОТКРЫВАЙ</text></g>`;
    const grain = root.GRAIN ? `<image href="${root.GRAIN[Math.floor(frameNo / 2) % root.GRAIN.length]}" x="0" y="0" width="1080" height="1920" preserveAspectRatio="none" opacity=".34" style="mix-blend-mode:overlay;image-rendering:pixelated"/>` : '';
    const fade = r.fade ? `<rect width="1080" height="1920" fill="#000" opacity="${r.fade}"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920" style="display:block;background:#000">
      ${body}<rect width="1080" height="1920" fill="url(#vign)" opacity=".85"/>${grain}${fade}${badge}${subsSVG(chunks, t)}</svg>`;
  }

  function init(D, measure) {
    const TL = buildTimeline(D);
    return { TL, DRAW: makeDraw(TL, D), chunks: buildSubs(D, measure) };
  }
  root.EPISODE = { buildTimeline, buildSubs, init, frameSVG };
  if (typeof module !== 'undefined') module.exports = root.EPISODE;
})(typeof window !== 'undefined' ? window : globalThis);
