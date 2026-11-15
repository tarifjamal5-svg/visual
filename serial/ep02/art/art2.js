// «Не открывай» - герои и места: Лиза, мама (две версии), площадка через глазок, переписка, люк на крышу.
(function (root) {
  'use strict';
  const tr = (x, y, s = 1, r = 0) => `translate(${x} ${y}) rotate(${r}) scale(${s})`;
  const lerp = (a, b, u) => a + (b - a) * u;

  // ---------- ЛИЗА, 15 ----------
  const LZ = { skin: '#e8cdb9', skinSh: '#c9a893', hair: '#2a1f1d', hairHi: '#3b2c29', hood: '#6b5b8a', hoodSh: '#54476f', eye: '#15161c' };

  function lisaHead(o = {}) {
    const s = LZ, bl = o.blink || 0, lx = (o.lookX || 0) * 5, ly = (o.lookY || 0) * 3;
    const ry = Math.max(0.8, 11 * (1 - bl));
    const scared = o.scared || 0;
    return `<g>
  <ellipse cx="0" cy="-98" rx="40" ry="34" fill="${s.hair}"/><ellipse cx="-14" cy="-108" rx="14" ry="10" fill="${s.hairHi}" opacity=".6"/>
  <path d="M -62 0 Q -66 -76 0 -80 Q 66 -76 62 0 L 60 40 Q 54 84 0 90 Q -54 84 -60 40 Z" fill="${s.skin}"/>
  <path d="M 22 -78 Q 64 -70 62 0 L 60 40 Q 54 84 0 90 Q 36 60 36 10 Q 36 -40 22 -78 Z" fill="${s.skinSh}" opacity=".45"/>
  <path d="M -66 10 Q -72 -84 0 -86 Q 72 -84 66 10 L 60 10 Q 58 -40 40 -50 Q 20 -30 -6 -44 Q -24 -26 -44 -46 Q -58 -36 -60 10 Z" fill="${s.hair}"/>
  <path d="M -64 0 Q -70 60 -54 96 L -46 96 Q -58 50 -58 0 Z M 64 0 Q 70 60 54 96 L 46 96 Q 58 50 58 0 Z" fill="${s.hair}"/>
  <path d="M -44 -46 Q -40 -20 -50 -6 M 40 -50 Q 34 -24 44 -10" stroke="${s.hair}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M -40 ${-24 - scared * 5} L -14 ${-28 + scared * 2} M 14 ${-28 + scared * 2} L 40 ${-24 - scared * 5}" stroke="${s.hair}" stroke-width="5.5" stroke-linecap="round"/>
  <path d="M -42 18 Q -27 26 -12 18 M 12 18 Q 27 26 42 18" stroke="#9a7c86" stroke-width="3" fill="none" opacity=".55"/>
  <ellipse cx="${-27 + lx}" cy="${4 + ly}" rx="${12 + scared * 2}" ry="${ry + scared * 2}" fill="#fff" opacity="${bl < 0.5 ? 0.95 : 0}"/>
  <ellipse cx="${27 + lx}" cy="${4 + ly}" rx="${12 + scared * 2}" ry="${ry + scared * 2}" fill="#fff" opacity="${bl < 0.5 ? 0.95 : 0}"/>
  ${bl < 0.5 ? `<circle cx="${-25 + lx * 1.4}" cy="${5 + ly}" r="${7.5 - scared * 2}" fill="${s.eye}"/><circle cx="${29 + lx * 1.4}" cy="${5 + ly}" r="${7.5 - scared * 2}" fill="${s.eye}"/>
  <circle cx="${-22 + lx * 1.4}" cy="${2 + ly}" r="2.4" fill="#fff"/><circle cx="${32 + lx * 1.4}" cy="${2 + ly}" r="2.4" fill="#fff"/>` : `<path d="M -40 6 Q -27 14 -14 6 M 14 6 Q 27 14 40 6" stroke="${s.hair}" stroke-width="4" fill="none"/>`}
  <path d="M -40 ${-8 + ly} Q -27 ${-14 + ly} -14 ${-8 + ly} M 14 ${-8 + ly} Q 27 ${-14 + ly} 40 ${-8 + ly}" stroke="${s.hair}" stroke-width="3.5" fill="none" opacity="${bl < 0.5 ? 1 : 0}"/>
  <path d="M -2 22 Q 2 34 8 32" stroke="${s.skinSh}" stroke-width="3" fill="none"/>
  ${o.mouthOpen ? `<ellipse cx="2" cy="56" rx="7" ry="${4 + o.mouthOpen * 5}" fill="#4a2420"/>` : `<path d="M -8 56 Q 2 ${54 - scared * 3} 12 56" stroke="#9a5a52" stroke-width="3.5" fill="none" stroke-linecap="round"/>`}
  <circle cx="-44" cy="40" r="11" fill="#e19a96" opacity=".18"/><circle cx="44" cy="40" r="11" fill="#e19a96" opacity=".18"/>
</g>`;
  }

  // крупно: Лиза в кровати, лицо в свете телефона
  function lisaBed(o = {}) {
    const glow = o.glow == null ? 1 : o.glow;
    return `<g>
  <rect width="1080" height="1920" fill="#060912"/>
  <path d="M -60 560 Q 540 430 1140 600 L 1140 1300 Q 540 1220 -60 1340 Z" fill="#232a3f"/>
  <path d="M -60 560 Q 540 430 1140 600 L 1140 640 Q 540 480 -60 610 Z" fill="#2c3550"/>
  <g transform="translate(560 880) rotate(-90) scale(3.2)">${lisaHead(o)}</g>
  <path d="M -60 1130 Q 300 1030 620 1090 Q 900 1150 1140 1070 L 1140 1920 L -60 1920 Z" fill="${LZ.hood}"/>
  <path d="M -60 1130 Q 300 1030 620 1090 Q 900 1150 1140 1070" stroke="${LZ.hoodSh}" stroke-width="22" fill="none"/>
  <g transform="translate(800 1170) rotate(-10)"><rect x="-74" y="-136" width="148" height="272" rx="24" fill="#0b0d12"/><rect x="-62" y="-122" width="124" height="244" rx="14" fill="#b9d2ff" opacity="${0.5 + 0.4 * glow}"/>
    ${o.notify ? `<rect x="-56" y="-100" width="112" height="44" rx="10" fill="#fff" opacity=".85"/><circle cx="-36" cy="-78" r="12" fill="#c46a5a"/><rect x="-18" y="-86" width="60" height="7" rx="3" fill="#333"/><rect x="-18" y="-73" width="40" height="6" rx="3" fill="#777"/>` : ''}
    <ellipse cx="-70" cy="40" rx="34" ry="44" fill="${LZ.skin}"/><ellipse cx="70" cy="60" rx="30" ry="40" fill="${LZ.skinSh}"/></g>
  <circle cx="760" cy="1000" r="520" fill="url(#glowCold)" opacity="${0.9 * glow}" style="mix-blend-mode:screen"/>
  <rect width="1080" height="1920" fill="#0b1a3a" opacity=".22" style="mix-blend-mode:multiply"/>
</g>`;
  }

  // Лиза со спины у двери (крупно, в тёмной прихожей)
  function lisaBack(o = {}) {
    const s = LZ, lean = o.lean || 0;
    return `<g transform="rotate(${-lean * 6})">
  <path d="M -230 400 Q -240 120 -120 60 L 120 60 Q 240 120 230 400 Z" fill="${s.hood}"/>
  <path d="M 60 60 L 120 60 Q 240 120 230 400 L 120 400 Q 150 200 60 60 Z" fill="${s.hoodSh}"/>
  <path d="M -120 70 Q 0 160 120 70 Q 90 20 0 18 Q -90 20 -120 70 Z" fill="${s.hoodSh}"/>
  <path d="M -82 -10 Q -92 -150 0 -156 Q 92 -150 82 -10 Q 70 40 0 46 Q -70 40 -82 -10 Z" fill="${s.hair}"/>
  <ellipse cx="0" cy="-176" rx="52" ry="44" fill="${s.hair}"/><ellipse cx="-16" cy="-188" rx="18" ry="12" fill="${s.hairHi}" opacity=".6"/>
  <ellipse cx="-86" cy="-40" rx="12" ry="22" fill="${s.skinSh}"/><ellipse cx="86" cy="-40" rx="12" ry="22" fill="${s.skinSh}"/>
</g>`;
  }

  // ---------- МАМА ----------
  // kind: 'fake' (идеальная, широкая улыбка, не моргает) или 'real' (мокрая, уставшая)
  function momHead(o = {}) {
    const real = o.kind === 'real';
    const skin = '#e2c0a6', skinSh = '#c49e86', hair = '#5a3426', hairHi = '#74463a';
    const smile = o.smile == null ? (real ? 0 : 1) : o.smile;
    const bl = real ? (o.blink || 0) : 0;
    const ry = Math.max(0.8, 9 * (1 - bl));
    const lx = (o.lookX || 0) * 4, ly = (o.lookY || 0) * 3;
    let drops = '';
    if (real) for (let i = 0; i < 9; i++) { const x = -50 + (i * 37) % 100, y = -60 + (i * 53) % 120; drops += `<path d="M ${x} ${y} q 3 6 0 9 q -3 -3 0 -9 z" fill="#cfe3ff" opacity=".7"/>`; }
    return `<g>
  ${real ? `<path d="M -74 -20 Q -86 -96 0 -98 Q 86 -96 74 -20 L 80 70 Q 60 40 66 0 L -66 0 Q -60 40 -80 70 Z" fill="${hair}"/>
     <path d="M -70 10 Q -84 60 -66 96 M 70 10 Q 84 60 66 96 M -40 -80 Q -60 -40 -50 -10 M 50 -84 Q 70 -40 56 -6" stroke="${hair}" stroke-width="10" fill="none" stroke-linecap="round"/>`
         : `<path d="M -78 -10 Q -84 -100 0 -102 Q 84 -100 78 -10 L 80 64 Q 74 76 60 70 L 60 0 L -60 0 L -60 70 Q -74 76 -80 64 Z" fill="${hair}"/>`}
  <path d="M -58 -20 Q -60 -78 0 -80 Q 60 -78 58 -20 L 56 30 Q 50 78 0 84 Q -50 78 -56 30 Z" fill="${skin}"/>
  <path d="M 20 -78 Q 60 -72 58 -20 L 56 30 Q 50 78 0 84 Q 34 56 34 10 Q 34 -40 20 -78 Z" fill="${skinSh}" opacity=".4"/>
  ${real ? `<path d="M -58 -40 Q -20 -70 30 -60 Q 0 -86 -40 -74 Z" fill="${hair}"/>` : `<path d="M -62 -20 Q -50 -84 4 -84 Q 60 -82 64 -20 Q 40 -60 0 -58 Q -36 -60 -62 -20 Z" fill="${hairHi}"/><path d="M -62 -20 Q -50 -84 4 -84 Q 60 -82 64 -20 Q 40 -50 0 -50 Q -36 -52 -62 -20 Z" fill="${hair}"/>`}
  <path d="M -38 -20 L -14 -22 M 14 -22 L 38 -20" stroke="${hair}" stroke-width="5" stroke-linecap="round"/>
  ${real ? `<path d="M -40 14 Q -27 22 -14 14 M 14 14 Q 27 22 40 14" stroke="#8c6a6a" stroke-width="3" fill="none" opacity=".7"/>` : ''}
  <ellipse cx="-26" cy="0" rx="11" ry="${real ? ry : 11}" fill="#fff"/><ellipse cx="26" cy="0" rx="11" ry="${real ? ry : 11}" fill="#fff"/>
  ${(real && bl > 0.5) ? '' : `<circle cx="${-26 + lx}" cy="${1 + ly}" r="${real ? 6.5 : 4}" fill="#1a1414"/><circle cx="${26 + lx}" cy="${1 + ly}" r="${real ? 6.5 : 4}" fill="#1a1414"/>`}
  ${real ? `<path d="M -38 -6 Q -26 -12 -14 -6 M 14 -6 Q 26 -12 38 -6" stroke="${skinSh}" stroke-width="4" fill="none"/>` : ''}
  <path d="M -3 10 Q 0 30 -6 36 Q 2 42 10 38" stroke="${skinSh}" stroke-width="3" fill="none"/>
  ${smile > 0.05 ? `<path d="M ${-30 * smile - 6} 52 Q 0 ${52 + 30 * smile} ${30 * smile + 6} 52 Q 0 ${58 + 14 * smile} ${-30 * smile - 6} 52 Z" fill="#a8282e"/>
       <path d="M ${-26 * smile - 4} 54 Q 0 ${54 + 18 * smile} ${26 * smile + 4} 54 Q 0 ${58 + 8 * smile} ${-26 * smile - 4} 54 Z" fill="#fff6ee"/>`
     : `<path d="M -14 ${56 + (o.mouthOpen || 0) * 2} Q 0 ${52 - (o.mouthOpen || 0) * 6} 14 ${56 + (o.mouthOpen || 0) * 2}" stroke="${real ? '#9a5a52' : '#a8282e'}" stroke-width="${real ? 3.5 : 6}" fill="none" stroke-linecap="round"/>`}
  ${o.mouthOpen && smile > 0.05 ? `<ellipse cx="0" cy="${60 + 10 * smile}" rx="${14 * smile + 4}" ry="${3 + o.mouthOpen * 5}" fill="#3a1416" opacity=".85"/>` : ''}
  ${drops}
</g>`;
  }

  function momUpper(o = {}) {
    const real = o.kind === 'real';
    const coat = '#b49a7a', coatSh = '#94795c';
    return `<g>
  <path d="M -230 520 Q -240 220 -110 160 L 110 160 Q 240 220 230 520 Z" fill="${coat}"/>
  <path d="M 50 160 L 110 160 Q 240 220 230 520 L 120 520 Q 150 300 50 160 Z" fill="${coatSh}"/>
  <path d="M -60 160 L 0 300 L 60 160 Z" fill="${real ? '#5d7590' : '#e9e2d6'}"/>
  ${real ? `<path d="M -120 170 Q 0 240 120 170 L 110 230 Q 0 300 -110 230 Z" fill="#5d7590"/><path d="M 40 230 L 70 380 L 30 380 Z" fill="#4e6580"/>`
         : `<path d="M -110 160 L -30 320 L -10 160 Z M 110 160 L 30 320 L 10 160 Z" fill="${coatSh}"/>`}
  <path d="M -170 180 Q -150 300 -150 520" stroke="#5a3a26" stroke-width="16" fill="none"/>
  <rect x="-230" y="380" width="120" height="140" rx="16" fill="#6a4630"/><rect x="-220" y="392" width="100" height="18" rx="5" fill="#7d5640"/>
  <rect x="-30" y="140" width="60" height="40" fill="#c49e86"/>
  <g transform="translate(0 70) scale(1.25)">${momHead(o)}</g>
</g>`;
  }

  // мама со спины, уходит вверх по лестнице (маленькая фигура)
  function momWalking(o = {}) {
    return `<g>
  <path d="M -40 -150 L 40 -150 L 50 -20 L -50 -20 Z" fill="#b49a7a"/><path d="M 10 -150 L 40 -150 L 50 -20 L 20 -20 Z" fill="#94795c"/>
  <rect x="-34" y="-20" width="22" height="80" fill="#2b2a30"/><rect x="12" y="-20" width="22" height="80" fill="#2b2a30"/>
  <ellipse cx="0" cy="-182" rx="34" ry="38" fill="#5a3426"/>
  <rect x="-62" y="-110" width="26" height="40" rx="6" fill="#6a4630"/>
</g>`;
  }

  // ---------- ЛЕСТНИЧНАЯ ПЛОЩАДКА (вид через глазок) ----------
  function landing(o = {}) {
    const fl = o.flicker == null ? 1 : o.flicker;
    return `<g>
  <rect width="1080" height="1920" fill="#5c625c"/>
  <rect y="980" width="1080" height="940" fill="#24382f"/><rect y="972" width="1080" height="12" fill="#2f4a3d"/>
  <path d="M -20 1500 L 360 1120 L 380 1120 L 380 1140 L 0 1520 Z" fill="#3a3f3c"/>
  ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M ${-20 + i * 64} ${1500 - i * 64} h 64 v -64" stroke="#2a2e2c" stroke-width="6" fill="none"/>`).join('')}
  <path d="M 0 1300 L 380 920" stroke="#1d201f" stroke-width="10"/>${[0, 1, 2, 3, 4].map(i => `<path d="M ${40 + i * 76} ${1260 - i * 76} v 90" stroke="#1d201f" stroke-width="6"/>`).join('')}
  <rect x="740" y="560" width="300" height="880" fill="#3b2a24"/><rect x="760" y="580" width="260" height="840" fill="#4a352c"/>
  <circle cx="790" cy="1010" r="10" fill="#a08850"/>
  <rect y="1440" width="1080" height="480" fill="#3d3a36"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M ${i * 150 - 60} 1440 L ${i * 170 - 200} 1920" stroke="#33302c" stroke-width="4"/>`).join('')}
  <path d="M 900 1500 Q 950 1400 1010 1440 Q 1060 1500 1030 1560 Q 960 1590 900 1560 Z" fill="#14161a"/><path d="M 950 1420 l 10 -30 l 14 28" stroke="#14161a" stroke-width="8" fill="none"/>
  <ellipse cx="900" cy="1580" rx="120" ry="22" fill="#000" opacity=".45"/>
  <line x1="540" y1="0" x2="540" y2="230" stroke="#1d1f1e" stroke-width="5"/>
  <circle cx="540" cy="250" r="26" fill="#ffe4a0" opacity="${0.9 * fl}"/><circle cx="540" cy="260" r="360" fill="#ffd27a" opacity="${0.16 * fl}" filter="url(#b40)"/>
  ${o.figure || ''}
</g>`;
  }

  function peephole(inner, o = {}) {
    return `<g>
  <defs><clipPath id="ph"><circle cx="540" cy="810" r="450"/></clipPath>
  <radialGradient id="phv" cx="50%" cy="50%" r="50%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset=".92" stop-color="#000" stop-opacity=".75"/><stop offset="1" stop-color="#000" stop-opacity="1"/></radialGradient></defs>
  <rect width="1080" height="1920" fill="#000"/>
  <g clip-path="url(#ph)"><g transform="translate(0 -90)"><g transform="translate(540 900) scale(${o.zoom || 1.05}) translate(-540 -900)">${inner}</g></g>
    <circle cx="540" cy="810" r="450" fill="url(#phv)"/>
    <rect x="90" y="360" width="900" height="900" fill="#9fb3d0" opacity=".05"/></g>
  <circle cx="540" cy="810" r="452" fill="none" stroke="#0a0a0a" stroke-width="10"/>
  <path d="M 230 560 A 370 370 0 0 1 480 390" stroke="#fff" stroke-width="8" opacity=".12" fill="none" stroke-linecap="round"/>
</g>`;
  }

  // ---------- ПЕРЕПИСКА ----------
  function chat(o = {}) {
    const msgs = o.msgs || [];
    let y = 330, body = '';
    for (const m of msgs) {
      const me = m.from === 'me';
      const a = m.alpha == null ? 1 : m.alpha;
      if (m.type === 'voice') {
        const w = 640, h = 130, x = me ? 1000 - w : 80;
        let bars = '';
        for (let i = 0; i < 34; i++) {
          const hh = 12 + Math.abs(Math.sin(i * 1.7) * 40 + Math.sin(i * 0.6) * 18);
          const on = i / 34 < (m.progress || 0);
          bars += `<rect x="${x + 150 + i * 13}" y="${y + h / 2 - hh / 2}" width="7" height="${hh}" rx="3" fill="${on ? '#9fd0ff' : '#5c6f86'}"/>`;
        }
        body += `<g opacity="${a}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="34" fill="${me ? '#2b5278' : '#1f2b3a'}"/>
          <circle cx="${x + 75}" cy="${y + h / 2}" r="44" fill="#4f8fd6"/>
          ${m.playing ? `<rect x="${x + 60}" y="${y + h / 2 - 20}" width="10" height="40" fill="#fff"/><rect x="${x + 80}" y="${y + h / 2 - 20}" width="10" height="40" fill="#fff"/>` : `<path d="M ${x + 64} ${y + h / 2 - 22} L ${x + 96} ${y + h / 2} L ${x + 64} ${y + h / 2 + 22} Z" fill="#fff"/>`}
          ${bars}<text x="${x + w - 30}" y="${y + h - 16}" text-anchor="end" font-family="Inter" font-size="28" fill="#8fa3b8">${m.dur || '0:04'}  ${m.time || '03:17'}</text></g>`;
        y += h + 34;
      } else {
        const lines = m.lines || [m.text];
        const h = 40 + lines.length * 54, w = Math.min(860, 90 + Math.max(...lines.map(l => l.length)) * 25), x = me ? 1000 - w : 80;
        body += `<g opacity="${a}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="34" fill="${me ? '#2b5278' : '#1f2b3a'}"/>
          ${lines.map((l, i) => `<text x="${x + 36}" y="${y + 62 + i * 54}" font-family="Inter" font-weight="500" font-size="42" fill="#eef3f8">${l}</text>`).join('')}
          <text x="${x + w - 28}" y="${y + h - 12}" text-anchor="end" font-family="Inter" font-size="24" fill="#8fa3b8">${m.time || '03:18'}</text></g>`;
        y += h + 34;
      }
    }
    const typing = o.typing ? `<g><rect x="80" y="${y}" width="170" height="80" rx="34" fill="#1f2b3a"/>${[0, 1, 2].map(i => `<circle cx="${130 + i * 36}" cy="${y + 40}" r="10" fill="#8fa3b8" opacity="${0.4 + 0.6 * Math.abs(Math.sin((o.t || 0) * 6 + i))}"/>`).join('')}</g>` : '';
    return `<g>
  <rect width="1080" height="1920" fill="#0e141d"/>
  <rect width="1080" height="290" fill="#17202c"/>
  <text x="70" y="70" font-family="Inter" font-weight="700" font-size="34" fill="#dfe6ee">${o.clock || '03:17'}</text>
  <rect x="930" y="44" width="70" height="32" rx="6" fill="none" stroke="#dfe6ee" stroke-width="4"/><rect x="936" y="50" width="22" height="20" rx="3" fill="#ff5a4a"/>
  <path d="M 90 190 l -30 -30 l 30 -30" stroke="#6fb0ff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="190" cy="160" r="56" fill="#c46a5a"/><text x="190" y="180" text-anchor="middle" font-family="Inter" font-weight="800" font-size="56" fill="#fff">М</text>
  <text x="270" y="152" font-family="Inter" font-weight="800" font-size="50" fill="#f1f5f9">Мама</text>
  <text x="270" y="204" font-family="Inter" font-size="34" fill="#6fb0ff">${o.status || 'в сети'}</text>
  ${body}${typing}
  <rect y="1700" width="1080" height="220" fill="#17202c"/>
  <rect x="60" y="1740" width="820" height="100" rx="50" fill="#0e141d"/>
  <text x="110" y="1806" font-family="Inter" font-size="42" fill="${o.input ? '#eef3f8' : '#5c6f86'}">${o.input || 'Сообщение'}${o.input && Math.floor((o.t || 0) * 3) % 2 ? '|' : ''}</text>
  <circle cx="960" cy="1790" r="54" fill="#4f8fd6"/><path d="M 936 1770 L 990 1790 L 936 1810 L 946 1790 Z" fill="#fff"/>
</g>`;
  }

  // ---------- ЛЮК НА КРЫШУ ----------
  function roofHatch(o = {}) {
    return `<g>
  <rect width="1080" height="1920" fill="#2e3532"/>
  <rect y="0" width="1080" height="700" fill="#1a1e1c"/>
  <rect x="330" y="120" width="420" height="300" fill="#3d3a33"/><rect x="350" y="140" width="380" height="260" fill="#4a463d"/>
  <path d="M 350 270 h 380" stroke="#3a372f" stroke-width="6"/>
  <g transform="translate(540 330)"><path d="M -40 -10 Q -40 -70 0 -70 Q 40 -70 40 -10" stroke="#8d8a80" stroke-width="16" fill="none"/><rect x="-60" y="-14" width="120" height="100" rx="12" fill="#a0874e"/><circle cx="0" cy="30" r="12" fill="#3a2e1a"/><rect x="-4" y="30" width="8" height="30" fill="#3a2e1a"/></g>
  <rect x="400" y="420" width="22" height="1600" fill="#4b4f4b"/><rect x="658" y="420" width="22" height="1600" fill="#4b4f4b"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect x="400" y="${520 + i * 160}" width="280" height="18" fill="#5a5e5a"/>`).join('')}
  <path d="M 0 1920 L 0 1400 L 260 1240 L 260 1920 Z" fill="#232825"/>
  <circle cx="540" cy="-40" r="420" fill="#ffd27a" opacity=".06" filter="url(#b40)"/>
  <text x="540" y="560" text-anchor="middle" font-family="Inter" font-weight="800" font-size="44" fill="#c9c1a6" opacity=".35" transform="rotate(-2 540 560)">ВЫХОД НА КРЫШУ ЗАКРЫТ</text>
</g>`;
  }

  root.ART2 = { lisaHead, lisaBed, lisaBack, momHead, momUpper, momWalking, landing, peephole, chat, roofHatch };
})(typeof window !== 'undefined' ? window : globalThis);
