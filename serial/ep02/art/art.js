// ПРЕСЛЕДОВАТЕЛЬ - персонажи, фоны и реквизит. Всё рисуется кодом в SVG.
// Каждая функция возвращает строку SVG-разметки. Персонажи стоят ногами в точке (0,0).
// Фоны рисуются в кадре 1080x1920.
(function (root) {
  'use strict';

  const C = {
    ink: '#05070b',
    lamp: '#e8b65f', lampHot: '#ffd98f',
    red: '#d23b2e',
    yellow: '#f2c230', yellowSh: '#c48f17', yellowHi: '#ffd95a',
    chalk: '#dcd8cc',
  };

  function rng(seed) {
    let s = (seed >>> 0) || 1;
    return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }
  const tr = (x, y, s = 1, r = 0) => `translate(${x} ${y}) rotate(${r}) scale(${s})`;

  // ---------- общие defs ----------
  function defs() {
    return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <radialGradient id="vign" cx="50%" cy="46%" r="72%"><stop offset="50%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".82"/></radialGradient>
  <radialGradient id="glowLamp"><stop offset="0" stop-color="${C.lampHot}" stop-opacity=".95"/><stop offset=".22" stop-color="${C.lamp}" stop-opacity=".4"/><stop offset="1" stop-color="${C.lamp}" stop-opacity="0"/></radialGradient>
  <radialGradient id="glowRed"><stop offset="0" stop-color="#ff5a48" stop-opacity=".75"/><stop offset="1" stop-color="#ff5a48" stop-opacity="0"/></radialGradient>
  <radialGradient id="glowCold"><stop offset="0" stop-color="#a9c2ee" stop-opacity=".5"/><stop offset="1" stop-color="#a9c2ee" stop-opacity="0"/></radialGradient>
  <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.lamp}" stop-opacity=".30"/><stop offset="1" stop-color="${C.lamp}" stop-opacity="0"/></linearGradient>
  <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9e0e2" stop-opacity=".20"/><stop offset="1" stop-color="#d9e0e2" stop-opacity="0"/></linearGradient>
  <linearGradient id="shadowFig" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#010204"/><stop offset="1" stop-color="#0a1120"/></linearGradient>
  <linearGradient id="winNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26385a"/><stop offset="1" stop-color="#121c33"/></linearGradient>
  <linearGradient id="skyGrey" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#465260"/><stop offset="1" stop-color="#2b3440"/></linearGradient>
  <linearGradient id="gapWarm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0bd6a"/><stop offset="1" stop-color="#8f5a2a"/></linearGradient>
  <linearGradient id="slit" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#07060a"/></linearGradient>
  <filter id="b2"><feGaussianBlur stdDeviation="2"/></filter>
  <filter id="b6" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="b16" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>
  <filter id="b40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="7" stitchTiles="stitch"/><feColorMatrix type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 .55"/></filter>
  <filter id="ir" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".30 .52 .18 0 .06  .32 .56 .20 0 .07  .28 .48 .16 0 .05  0 0 0 1 0"/><feComponentTransfer><feFuncR type="gamma" exponent=".62" amplitude="1.25"/><feFuncG type="gamma" exponent=".62" amplitude="1.32"/><feFuncB type="gamma" exponent=".62" amplitude="1.22"/></feComponentTransfer></filter>
  <filter id="subShadow" x="-10%" y="-30%" width="120%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity=".7"/></filter>
  <filter id="redOnly" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter>
  <pattern id="scan" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="3" fill="#000" opacity=".28"/></pattern>
  <pattern id="wallpaper" width="96" height="128" patternUnits="userSpaceOnUse"><path d="M48 14 q14 20 0 40 q-14 -20 0 -40z M0 78 q14 20 0 40 M96 78 q-14 20 0 40" fill="#fff" opacity=".04"/><rect x="0" width="2" height="128" fill="#fff" opacity=".025"/></pattern>
  <pattern id="quilt" width="70" height="70" patternUnits="userSpaceOnUse"><path d="M0 0 L70 70 M70 0 L0 70" stroke="#24150f" stroke-width="3"/><circle cx="0" cy="0" r="5" fill="#9a7a45"/><circle cx="70" cy="0" r="5" fill="#9a7a45"/><circle cx="0" cy="70" r="5" fill="#9a7a45"/><circle cx="70" cy="70" r="5" fill="#9a7a45"/><circle cx="35" cy="35" r="5" fill="#9a7a45"/></pattern>
</defs></svg>`;
  }

  // ---------- НИКИТА ----------
  const NK = {
    skin: '#c39f88', skinSh: '#9d7b69', hair: '#8f949a', hairSh: '#6d7277',
    coat: '#3a4231', coatSh: '#2a3024', coatHi: '#4a5440', pants: '#1b1f27', pantsHi: '#252a35',
    shoe: '#0d0f12', scrub: '#2c5f5b', brow: '#6c7075', eye: '#12151a', lip: '#6b4740',
  };

  function nikitaHead(o = {}) {
    const s = NK, bl = o.blink || 0, ry = Math.max(0.7, 5.2 * (1 - bl));
    const eyeL = o.eyesWide ? 7.5 : 6.5, lx = (o.lookX || 0) * 3.5, ly = (o.lookY || 0) * 2.5;
    return `<g>
  <ellipse cx="-54" cy="2" rx="9" ry="16" fill="${s.skinSh}"/><ellipse cx="54" cy="2" rx="9" ry="16" fill="${s.skinSh}"/>
  <path d="M -50 -30 Q -52 -72 0 -74 Q 52 -72 50 -30 L 48 20 Q 44 66 0 70 Q -44 66 -48 20 Z" fill="${s.skin}"/>
  <path d="M 16 -73 Q 52 -70 50 -30 L 48 20 Q 44 66 0 70 Q 30 50 30 10 Q 28 -40 16 -73 Z" fill="${s.skinSh}" opacity=".5"/>
  <path d="M -20 -36 Q 4 -40 28 -36 M -14 -27 Q 4 -30 22 -27" stroke="${s.skinSh}" stroke-width="2" fill="none" opacity=".5"/>
  <path d="M -54 6 Q -60 -66 -14 -80 Q 6 -84 26 -80 Q 62 -70 56 6 L 50 6 Q 52 -34 40 -50 Q 34 -38 18 -46 Q 4 -40 -10 -46 Q -28 -38 -38 -50 Q -50 -32 -48 6 Z" fill="${s.hair}"/>
  <path d="M 26 -80 Q 62 -70 56 6 L 50 6 Q 52 -34 40 -50 Z" fill="${s.hairSh}" opacity=".7"/>
  <path d="M -36 -20 L -10 -13 M 14 -13 L 40 -20" stroke="${s.brow}" stroke-width="7" stroke-linecap="round"/>
  <path d="M -33 9 Q -22 17 -11 9 M 15 9 Q 26 17 37 9" stroke="#6e5258" stroke-width="3" fill="none" opacity=".7"/>
  <ellipse cx="${-22 + lx}" cy="${ly}" rx="${eyeL}" ry="${ry}" fill="${s.eye}"/><ellipse cx="${26 + lx}" cy="${ly}" rx="${eyeL}" ry="${ry}" fill="${s.eye}"/>
  ${bl < 0.5 ? `<circle cx="${-20 + lx}" cy="${ly - 2}" r="1.8" fill="#fff" opacity=".9"/><circle cx="${28 + lx}" cy="${ly - 2}" r="1.8" fill="#fff" opacity=".9"/>` : ''}
  <path d="M -32 -6 Q -22 -11 -12 -6 M 16 -6 Q 26 -11 36 -6" stroke="${s.skinSh}" stroke-width="3" fill="none"/>
  <path d="M 3 -6 Q 1 14 -4 28 Q 6 36 16 30 Q 12 26 10 20 Z" fill="${s.skinSh}"/>
  <path d="M -14 30 Q -20 42 -16 54 M 22 30 Q 28 42 26 54" stroke="${s.skinSh}" stroke-width="2" fill="none" opacity=".6"/>
  <path d="M -46 18 Q -42 64 0 70 Q 42 64 48 18 Q 36 44 20 40 Q 2 32 -16 40 Q -34 44 -46 18 Z" fill="#4f5358" opacity=".38"/>
  <path d="M -14 40 Q 4 34 22 40 L 20 45 Q 4 41 -12 45 Z" fill="#4f5358" opacity=".45"/>
  ${o.mouthOpen ? `<ellipse cx="5" cy="51" rx="7" ry="5" fill="#2a1714"/>` : `<path d="M -10 51 Q 4 46 20 52" stroke="${s.lip}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`}
</g>`;
  }

  function nikitaHeadBack() {
    const s = NK;
    return `<g>
  <ellipse cx="-54" cy="2" rx="9" ry="16" fill="${s.skinSh}"/><ellipse cx="54" cy="2" rx="9" ry="16" fill="${s.skinSh}"/>
  <path d="M -50 -30 Q -52 -74 0 -76 Q 52 -74 50 -30 L 48 20 Q 44 62 0 64 Q -44 62 -48 20 Z" fill="${s.hair}"/>
  <path d="M 20 -74 Q 52 -70 50 -30 L 48 20 Q 44 62 10 64 Q 34 30 32 -10 Z" fill="${s.hairSh}" opacity=".7"/>
  <ellipse cx="0" cy="-52" rx="26" ry="18" fill="${s.skin}" opacity=".85"/>
  <path d="M -30 58 Q 0 70 30 58 L 26 66 Q 0 74 -26 66 Z" fill="${s.skinSh}"/>
</g>`;
  }

  function coatBody(top, hem, back) {
    const s = NK;
    const sh = top, h = hem;
    return `<g>
  <ellipse cx="0" cy="${sh - 4}" rx="64" ry="${back ? 30 : 20}" fill="${s.coatSh}"/>
  <path d="M -60 ${sh} Q -84 ${sh + 4} -88 ${sh + 30} L -92 ${h - 16} Q -92 ${h} -80 ${h} L 80 ${h} Q 92 ${h} 92 ${h - 16} L 88 ${sh + 30} Q 84 ${sh + 4} 60 ${sh} Z" fill="${s.coat}"/>
  <path d="M 30 ${sh} L 60 ${sh} Q 84 ${sh + 4} 88 ${sh + 30} L 92 ${h - 16} Q 92 ${h} 80 ${h} L 40 ${h} Q 52 ${(sh + h) / 2} 30 ${sh} Z" fill="${s.coatSh}" opacity=".7"/>
  <rect x="-92" y="${h - 16}" width="184" height="16" fill="${s.coatSh}" opacity=".6"/>
  ${back ? `<path d="M -50 ${sh - 6} Q 0 ${sh + 46} 50 ${sh - 6} Q 0 ${sh + 20} -50 ${sh - 6} Z" fill="${s.coatSh}"/>` : `
  <path d="M -24 ${sh - 2} L 0 ${sh + 36} L 24 ${sh - 2} Z" fill="${s.scrub}"/>
  <line x1="0" y1="${sh + 36}" x2="0" y2="${h - 4}" stroke="#1f251b" stroke-width="3"/>
  <rect x="-80" y="${h - 92}" width="54" height="7" rx="2" fill="${s.coatSh}"/><rect x="26" y="${h - 92}" width="54" height="7" rx="2" fill="${s.coatSh}"/>`}
</g>`;
  }

  function arm(d, fill, w = 34) {
    return `<path d="${d}" stroke="${fill}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  function scalpel(x, y, r = 0) {
    return `<g transform="${tr(x, y, 1, r)}"><rect x="-3" y="-4" width="6" height="34" rx="2" fill="#7c858c"/><path d="M -3 -4 L 3 -4 L 1 -30 Q -1 -36 -4 -30 Z" fill="#e3ebef"/><path d="M 1 -30 L -1 -8" stroke="#fff" stroke-width="1" opacity=".8"/></g>`;
  }

  function nikita(o = {}) {
    const s = NK, pose = o.pose || 'front';
    const shoes = (dy = 0) => `<rect x="-58" y="${-26 + dy}" width="50" height="26" rx="11" fill="${s.shoe}"/><rect x="8" y="${-26 + dy}" width="50" height="26" rx="11" fill="${s.shoe}"/>`;
    if (pose === 'sit' || pose === 'sleep') {
      const sleep = pose === 'sleep';
      const top = -350, hem = -168;
      const head = sleep
        ? `<g transform="${tr(12, -404, 1, 24)}">${nikitaHead({ blink: 1 })}</g>`
        : `<g transform="${tr(4, -436)}">${nikitaHead(o)}</g>`;
      const hands = sleep
        ? `${arm('M -74 -336 Q -106 -240 -48 -176', s.coatHi)}${arm('M 74 -336 Q 106 -240 50 -178', s.coatSh)}<ellipse cx="-44" cy="-170" rx="16" ry="13" fill="${s.skin}"/><ellipse cx="48" cy="-172" rx="16" ry="13" fill="${s.skinSh}"/>${scalpel(70, -160, 100)}`
        : `${arm('M -74 -336 Q -106 -240 -44 -178', s.coatHi)}${arm('M 74 -336 Q 112 -270 70 -232', s.coatSh)}<ellipse cx="-40" cy="-172" rx="16" ry="13" fill="${s.skin}"/><ellipse cx="66" cy="-236" rx="14" ry="17" fill="${s.skinSh}"/>${scalpel(66, -246, 8)}`;
      return `<g>
  <path d="M -56 -150 L -16 -150 L -20 -20 L -50 -20 Z M 16 -150 L 56 -150 L 50 -20 L 20 -20 Z" fill="${s.pants}"/>
  ${shoes()}
  <rect x="-15" y="-382" width="30" height="34" fill="${s.skinSh}"/>
  ${coatBody(top, hem - 26)}
  <path d="M -74 -200 Q -76 -150 -36 -142 Q 0 -146 -2 -196 Z M 74 -200 Q 76 -150 36 -142 Q 0 -146 2 -196 Z" fill="${s.pantsHi}"/>
  <ellipse cx="-38" cy="-160" rx="36" ry="24" fill="${s.pantsHi}"/><ellipse cx="38" cy="-160" rx="36" ry="24" fill="${s.pantsHi}"/>
  <path d="M -70 -164 Q -38 -150 -6 -164 M 6 -164 Q 38 -150 70 -164" stroke="${s.pants}" stroke-width="3" fill="none"/>
  ${head}
  ${hands}
</g>`;
    }
    if (pose === 'back') {
      return `<g>
  <path d="M -46 -300 L -6 -300 L -10 -20 L -40 -20 Z M 6 -300 L 46 -300 L 40 -20 L 10 -20 Z" fill="${s.pants}"/>
  ${shoes()}
  <rect x="-15" y="-506" width="30" height="36" fill="${s.skinSh}"/>
  ${coatBody(-474, -240, true)}
  ${arm('M -74 -462 Q -102 -400 -100 -280', s.coatSh)}${arm('M 74 -462 Q 102 -400 100 -280', s.coatSh)}
  <ellipse cx="-98" cy="-260" rx="14" ry="18" fill="${s.skinSh}"/><ellipse cx="98" cy="-260" rx="14" ry="18" fill="${s.skinSh}"/>
  <g transform="${tr(0, -556)}">${nikitaHeadBack()}</g>
</g>`;
    }
    // front
    const raise = o.armRaise || 0; // 0..1 правая рука к лицу/двери
    const rArm = raise
      ? `${arm(`M 74 -462 Q ${120} -400 ${100 + raise * 40} ${-300 - raise * 120}`, s.coatSh)}<ellipse cx="${100 + raise * 40}" cy="${-292 - raise * 120}" rx="14" ry="18" fill="${s.skinSh}"/>`
      : `${arm('M 74 -462 Q 104 -400 100 -280', s.coatSh)}<ellipse cx="98" cy="-260" rx="14" ry="18" fill="${s.skinSh}"/>`;
    return `<g>
  <path d="M -46 -300 L -6 -300 L -10 -20 L -40 -20 Z M 6 -300 L 46 -300 L 40 -20 L 10 -20 Z" fill="${s.pants}"/>
  ${shoes()}
  <rect x="-15" y="-506" width="30" height="36" fill="${s.skinSh}"/>
  ${coatBody(-474, -240)}
  ${arm('M -74 -462 Q -104 -400 -100 -280', s.coatHi)}<ellipse cx="-98" cy="-260" rx="14" ry="18" fill="${s.skin}"/>
  ${rArm}
  ${o.scalpel ? scalpel(100, -262, 6) : ''}
  <g transform="${tr(4, -560)}">${nikitaHead(o)}</g>
</g>`;
  }

  // ---------- СОНЯ ----------
  function sonya(o = {}) {
    const skin = '#e3c3aa', skinSh = '#c9a58d', hair = '#2b1e1b', bl = o.blink || 0;
    const ry = Math.max(0.8, 13 * (1 - bl));
    const point = o.point;
    const rArm = point
      ? `${arm('M 38 -186 Q 82 -206 124 -244', C.yellowSh, 22)}<circle cx="130" cy="-248" r="10" fill="${skin}"/><path d="M 136 -252 L 152 -262" stroke="${skin}" stroke-width="6" stroke-linecap="round"/>`
      : `${arm('M 38 -186 Q 56 -150 58 -114', C.yellowSh, 22)}<circle cx="58" cy="-106" r="10" fill="${skin}"/>`;
    return `<g>
  <rect x="-28" y="-112" width="19" height="92" fill="#474c57"/><rect x="9" y="-112" width="19" height="92" fill="#3d424c"/>
  <rect x="-34" y="-38" width="30" height="38" rx="9" fill="#16181d"/><rect x="4" y="-38" width="30" height="38" rx="9" fill="#16181d"/>
  <ellipse cx="0" cy="-198" rx="42" ry="14" fill="${C.yellowSh}"/>
  <path d="M -34 -198 Q -48 -192 -52 -172 L -72 -102 Q -74 -88 -60 -88 L 60 -88 Q 74 -88 72 -102 L 52 -172 Q 48 -192 34 -198 Z" fill="${C.yellow}"/>
  <path d="M 14 -198 L 34 -198 Q 48 -192 52 -172 L 72 -102 Q 74 -88 60 -88 L 22 -88 Q 34 -140 14 -198 Z" fill="${C.yellowSh}" opacity=".75"/>
  <path d="M -30 -194 Q -40 -160 -36 -150" stroke="${C.yellowHi}" stroke-width="5" fill="none" opacity=".6" stroke-linecap="round"/>
  <circle cx="0" cy="-172" r="4.5" fill="#2a2416"/><circle cx="0" cy="-146" r="4.5" fill="#2a2416"/><circle cx="0" cy="-120" r="4.5" fill="#2a2416"/>
  ${arm('M -38 -186 Q -56 -150 -58 -114', C.yellow, 22)}<circle cx="-58" cy="-106" r="10" fill="${skin}"/>
  ${o.chalk ? `<rect x="-64" y="-100" width="7" height="16" rx="2" fill="${C.chalk}" transform="rotate(-20 -60 -92)"/>` : ''}
  ${rArm}
  <rect x="-9" y="-212" width="18" height="16" fill="${skinSh}"/>
  <ellipse cx="-80" cy="-236" rx="15" ry="25" fill="${hair}"/><ellipse cx="80" cy="-236" rx="15" ry="25" fill="${hair}"/>
  <rect x="-76" y="-262" width="12" height="7" rx="2" fill="#0d0d0f"/><rect x="64" y="-262" width="12" height="7" rx="2" fill="#0d0d0f"/>
  <circle cx="0" cy="-262" r="70" fill="${skin}"/>
  <path d="M 30 -324 Q 70 -300 70 -262 Q 70 -214 20 -194 Q 44 -230 40 -270 Q 38 -300 30 -324 Z" fill="${skinSh}" opacity=".55"/>
  <path d="M -74 -258 Q -78 -344 0 -342 Q 78 -344 74 -258 Q 70 -288 54 -300 Q 30 -284 4 -294 Q -24 -282 -52 -300 Q -68 -288 -74 -258 Z" fill="${hair}"/>
  <path d="M -74 -258 L -72 -214 Q -66 -228 -64 -262 Z M 74 -258 L 72 -214 Q 66 -228 64 -262 Z" fill="${hair}"/>
  <path d="M -36 -281 L -14 -286 M 14 -286 L 36 -281" stroke="${hair}" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M -36 -240 Q -24 -232 -12 -240 M 12 -240 Q 24 -232 36 -240" stroke="#8e7280" stroke-width="3" fill="none" opacity=".55"/>
  <ellipse cx="-24" cy="-256" rx="11" ry="${ry}" fill="#14161b"/><ellipse cx="24" cy="-256" rx="11" ry="${ry}" fill="#14161b"/>
  ${bl < 0.5 ? `<circle cx="-20" cy="-261" r="3.6" fill="#fff"/><circle cx="28" cy="-261" r="3.6" fill="#fff"/>` : ''}
  <path d="M -2 -240 Q 2 -234 6 -240" stroke="${skinSh}" stroke-width="3" fill="none"/>
  ${o.mouthOpen ? `<ellipse cx="0" cy="-221" rx="${5 + o.mouthOpen * 2}" ry="${2 + o.mouthOpen * 5}" fill="#3a1d1a"/>` : `<path d="M -7 -222 L 8 -222" stroke="#7a4a44" stroke-width="3" stroke-linecap="round"/>`}
  <circle cx="-42" cy="-230" r="10" fill="#d98a86" opacity=".18"/><circle cx="42" cy="-230" r="10" fill="#d98a86" opacity=".18"/>
</g>`;
  }

  // ---------- ХОЗЯЙКА ----------
  function landladyHead(o = {}) {
    const skin = '#cfae98', skinSh = '#ad8c78';
    const curls = [[-58, -20], [-50, -44], [-32, -60], [-10, -68], [14, -68], [36, -60], [54, -44], [60, -20], [-62, 4], [62, 4]];
    return `<g>
  ${curls.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${20 + (i % 3) * 2}" fill="${i % 2 ? '#a9a6a0' : '#bcb9b3'}"/>`).join('')}
  <path d="M -54 -10 Q -56 -60 0 -62 Q 56 -60 54 -10 L 56 24 Q 52 66 0 70 Q -52 66 -56 24 Z" fill="${skin}"/>
  <path d="M 20 -60 Q 56 -56 54 -10 L 56 24 Q 52 66 0 70 Q 34 46 32 0 Q 30 -40 20 -60 Z" fill="${skinSh}" opacity=".5"/>
  ${curls.slice(1, 8).map(([x, y], i) => `<circle cx="${x * 0.9}" cy="${y + 6}" r="${15 + (i % 2) * 3}" fill="${i % 2 ? '#bcb9b3' : '#a9a6a0'}"/>`).join('')}
  <path d="M -30 -22 L -10 -20 M 10 -20 L 30 -22" stroke="#8a8580" stroke-width="4" stroke-linecap="round"/>
  <circle cx="-24" cy="-2" r="20" fill="#a8bccb" opacity=".6"/><circle cx="24" cy="-2" r="20" fill="#a8bccb" opacity=".6"/>
  <circle cx="-24" cy="-2" r="20" fill="none" stroke="#151518" stroke-width="5"/><circle cx="24" cy="-2" r="20" fill="none" stroke="#151518" stroke-width="5"/>
  <path d="M -4 -4 Q 0 -8 4 -4" stroke="#151518" stroke-width="4" fill="none"/>
  <path d="M -34 -10 L -18 -18 M 14 -10 L 30 -18" stroke="#fff" stroke-width="4" opacity=".75" stroke-linecap="round"/>
  <path d="M 0 6 Q -4 22 -2 28 Q 4 32 10 28" stroke="${skinSh}" stroke-width="3" fill="none"/>
  ${o.mouthOpen ? `<ellipse cx="0" cy="48" rx="${10 + o.mouthOpen * 3}" ry="${2 + o.mouthOpen * 6}" fill="#2a1512"/>` : `<path d="M -16 46 L 16 46" stroke="#6b4740" stroke-width="3" stroke-linecap="round"/>`}
  <path d="M -16 46 Q -22 50 -24 58 M 16 46 Q 22 50 24 58" stroke="#6b4740" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M -40 30 Q -36 50 -26 58 M 40 30 Q 36 50 26 58" stroke="${skinSh}" stroke-width="2" fill="none" opacity=".6"/>
</g>`;
  }

  function keyShape(tag = true, scale = 1) {
    return `<g transform="scale(${scale})">
  <circle cx="0" cy="0" r="14" fill="none" stroke="#b8b0a0" stroke-width="7"/>
  <path d="M 12 -4 L 70 -4 L 70 4 L 62 4 L 62 14 L 56 14 L 56 4 L 48 4 L 48 12 L 42 12 L 42 4 L 12 4 Z" fill="#b8b0a0"/>
  <path d="M 14 -2 L 68 -2" stroke="#e6dfcf" stroke-width="2" opacity=".7"/>
  ${tag ? `<path d="M -10 10 Q -30 30 -34 44" stroke="#5a4c3a" stroke-width="2" fill="none"/><g transform="translate(-58 40) rotate(-18)"><rect x="0" y="0" width="56" height="34" rx="4" fill="#b89a6a"/><circle cx="8" cy="9" r="3.5" fill="#3a2e22"/><text x="30" y="26" font-family="Caveat, 'Comic Sans MS', cursive" font-size="20" fill="#3a2a1e" text-anchor="middle" font-style="italic">17</text></g>` : ''}
</g>`;
  }

  function landlady(o = {}) {
    const card = '#4b3342', cardSh = '#3a2733', dress = '#2f2a36', skin = '#cfae98';
    return `<g>
  <ellipse cx="-30" cy="-8" rx="30" ry="11" fill="#3a2b30"/><ellipse cx="30" cy="-8" rx="30" ry="11" fill="#3a2b30"/>
  <rect x="-42" y="-84" width="26" height="78" fill="#8a7466"/><rect x="16" y="-84" width="26" height="78" fill="#7a6658"/>
  <path d="M -86 -250 L -98 -80 Q -98 -70 -88 -70 L 88 -70 Q 98 -70 98 -80 L 86 -250 Z" fill="${dress}"/>
  <path d="M -56 -334 Q -100 -330 -106 -290 L -114 -140 Q -114 -126 -100 -126 L 100 -126 Q 114 -126 114 -140 L 106 -290 Q 100 -330 56 -334 Z" fill="${card}"/>
  <path d="M 30 -334 L 56 -334 Q 100 -330 106 -290 L 114 -140 Q 114 -126 100 -126 L 44 -126 Q 56 -230 30 -334 Z" fill="${cardSh}" opacity=".8"/>
  <path d="M -18 -332 L -10 -126 L 10 -126 L 18 -332 Z" fill="${dress}"/>
  <circle cx="0" cy="-300" r="4" fill="#7a6a5a"/><circle cx="0" cy="-268" r="4" fill="#7a6a5a"/>
  ${arm('M -84 -320 Q -116 -240 -26 -206', card, 32)}${arm('M 84 -320 Q 116 -240 26 -206', cardSh, 32)}
  <ellipse cx="0" cy="-206" rx="34" ry="17" fill="${skin}"/>
  <g transform="translate(-6 -188) rotate(80)">${keyShape(false, 0.55)}</g>
  <g transform="translate(6 -186) rotate(100)">${keyShape(false, 0.5)}</g>
  <g transform="translate(-12 -192) rotate(70)"><path d="M -10 10 Q -24 26 -26 40" stroke="#5a4c3a" stroke-width="2" fill="none"/><rect x="-42" y="36" width="32" height="20" rx="3" fill="#b89a6a" transform="rotate(-20 -26 46)"/></g>
  <rect x="-16" y="-350" width="32" height="22" fill="#ad8c78"/>
  <g transform="${tr(0, -400)}">${landladyHead(o)}</g>
</g>`;
  }

  // ---------- ТЕНЬ (сын) ----------
  function shadowMan(o = {}) {
    const op = o.opacity == null ? 1 : o.opacity;
    const d = 'M 0 -712 Q 54 -710 60 -640 Q 64 -598 50 -578 Q 120 -562 130 -500 L 150 -280 Q 152 -262 138 -262 L 126 -262 L 112 -440 L 104 -300 L 82 0 L 20 0 L 0 -250 L -20 0 L -82 0 L -104 -300 L -112 -440 L -126 -262 L -138 -262 Q -152 -262 -150 -280 L -130 -500 Q -120 -562 -50 -578 Q -64 -598 -60 -640 Q -54 -710 0 -712 Z';
    return `<g opacity="${op}">
  <path d="${d}" fill="none" stroke="#03050a" stroke-width="18" stroke-opacity=".25" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="#03050a" stroke-width="8" stroke-opacity=".45" stroke-linejoin="round"/>
  <path d="${d}" fill="#03050a"/>
</g>`;
  }

  // ---------- РЕКВИЗИТ ----------
  function mug() {
    return `<g>
  <ellipse cx="18" cy="14" rx="104" ry="24" fill="#000" opacity=".55" filter="url(#b6)"/>
  <path d="M 76 -140 Q 142 -142 138 -80 Q 134 -28 72 -34" stroke="#bdb5a6" stroke-width="22" fill="none"/>
  <path d="M -80 -170 L 80 -170 L 74 0 Q 72 14 58 14 L -58 14 Q -72 14 -74 0 Z" fill="#cfc7b8"/>
  <path d="M 30 -170 L 80 -170 L 74 0 Q 72 14 58 14 L 30 14 Q 46 -80 30 -170 Z" fill="#a39b8d"/>
  <path d="M -62 -150 L -60 -10" stroke="#efe9de" stroke-width="8" opacity=".55" stroke-linecap="round"/>
  <ellipse cx="0" cy="-170" rx="80" ry="20" fill="#e3dccf"/><ellipse cx="0" cy="-168" rx="70" ry="15" fill="#2a1c14"/>
  <path d="M -54 -182 l 10 3 l -4 9 z" fill="#3a3530"/>
  <g transform="translate(-4 -88)" fill="#6f7d82" opacity=".7"><ellipse cx="0" cy="8" rx="17" ry="14"/><circle cx="-18" cy="-14" r="7"/><circle cx="-6" cy="-22" r="7"/><circle cx="8" cy="-22" r="7"/><circle cx="20" cy="-14" r="7"/></g>
</g>`;
  }

  function petCam(led = true) {
    return `<g>
  <rect x="-34" y="-8" width="68" height="16" rx="5" fill="#cfd3d6"/>
  <path d="M -30 -8 Q -30 -58 0 -58 Q 30 -58 30 -8 Z" fill="#e8ebed"/>
  <path d="M 8 -56 Q 30 -50 30 -8 L 14 -8 Q 18 -40 8 -56 Z" fill="#b9bfc4"/>
  <circle cx="0" cy="-30" r="15" fill="#1b1f24"/><circle cx="0" cy="-30" r="8" fill="#0a0c10"/><circle cx="-4" cy="-34" r="3" fill="#8fb4ff" opacity=".7"/>
  ${led ? `<circle cx="20" cy="-14" r="14" fill="url(#glowRed)"/>` : ''}<circle cx="20" cy="-14" r="3.5" fill="${led ? '#ff4a3a' : '#5a2a26'}"/>
  <g transform="translate(-19 -12) scale(.32)" fill="#7a8a90"><ellipse cx="0" cy="8" rx="17" ry="14"/><circle cx="-18" cy="-14" r="7"/><circle cx="-6" cy="-22" r="7"/><circle cx="8" cy="-22" r="7"/><circle cx="20" cy="-14" r="7"/></g>
</g>`;
  }

  function oldPhoto(w = 156, h = 206) {
    // хозяйка в молодости и мальчик (намёк на поворот)
    return `<g>
  <rect x="${-w / 2 - 17}" y="${-h / 2 - 17}" width="${w + 34}" height="${h + 34}" fill="#2b2017"/>
  <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#7a6650"/>
  <g transform="scale(${w / 156})">
    <path d="M -58 103 Q -54 -6 -26 -12 Q 2 -6 6 103 Z" fill="#3b2f24"/><circle cx="-26" cy="-38" r="21" fill="#3b2f24"/>
    <path d="M -46 -46 Q -26 -70 -6 -46 Q -26 -56 -46 -46 Z" fill="#2a2119"/>
    <path d="M 14 103 Q 16 22 32 18 Q 48 22 50 103 Z" fill="#33281f"/><circle cx="32" cy="2" r="14" fill="#33281f"/>
    <rect x="-78" y="-103" width="156" height="206" fill="none" stroke="#d6c7a8" stroke-width="2" opacity=".25"/>
    <path d="M -60 -90 L 40 60 M 20 -100 L 60 -20" stroke="#e6d9bd" stroke-width="1.5" opacity=".18"/>
  </g>
</g>`;
  }

  function polaroid(seed) {
    const r = rng(seed);
    return `<g>
  <rect x="-39" y="-46" width="78" height="92" fill="#aaa69c"/>
  <rect x="-33" y="-40" width="66" height="62" fill="#26303f"/>
  <ellipse cx="${-8 + r() * 6}" cy="-6" rx="20" ry="9" fill="#55607a"/>
  <circle cx="${-10 + r() * 8}" cy="-12" r="8" fill="#8d97a8"/>
  <path d="M -33 8 Q 0 ${-4 - r() * 6} 33 6 L 33 22 L -33 22 Z" fill="#3a465c"/>
  <circle cx="0" cy="-42" r="4" fill="#a4342b"/>
</g>`;
  }

  function digitalClock(text = '03:17', glow = 1) {
    return `<g>
  <rect x="-46" y="-26" width="92" height="44" rx="8" fill="#07080b"/>
  <ellipse cx="0" cy="-4" rx="70" ry="34" fill="url(#glowRed)" opacity="${0.6 * glow}"/>
  <text x="0" y="8" font-family="JetBrains Mono, monospace" font-weight="700" font-size="30" fill="#ff4a36" text-anchor="middle" opacity="${0.4 + 0.6 * glow}">${text}</text>
</g>`;
  }

  function rain(seed, t, n, opts = {}) {
    const r = rng(seed), out = [];
    const { x0 = 0, x1 = 1080, y0 = 0, y1 = 1920, len = 46, speed = 1400, slant = 0.18, op = 0.22, color = '#a9bdd6' } = opts;
    const H = y1 - y0;
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0), ph = r(), sp = speed * (0.7 + r() * 0.6);
      let y = y0 + ((ph * H + t * sp) % H);
      const xx = x + (y - y0) * slant * 0.1;
      out.push(`<line x1="${xx.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(xx - len * slant).toFixed(1)}" y2="${(y - len).toFixed(1)}"/>`);
    }
    return `<g stroke="${color}" stroke-width="2" opacity="${op}" stroke-linecap="round">${out.join('')}</g>`;
  }

  // ---------- ФОНЫ (1080x1920) ----------
  function bgKitchen(o = {}) {
    const fl = o.flicker == null ? 1 : o.flicker, t = o.t || 0;
    return `<g>
  <rect width="1080" height="1920" fill="#141b26"/>
  <rect width="1080" height="1180" fill="url(#wallpaper)"/>
  <rect x="800" y="330" width="290" height="860" fill="#262a31"/>
  <rect x="824" y="354" width="270" height="836" fill="#020306"/>
  ${o.lurker ? `<g transform="${tr(960, 1230, 1.05)}">${shadowMan({ opacity: o.lurker })}</g>` : ''}
  <g transform="${tr(560, 540, 1, -3)}">${oldPhoto()}</g>
  <line x1="430" y1="0" x2="430" y2="300" stroke="#0b0d11" stroke-width="5"/>
  <path d="M 352 392 L 508 392 L 960 1250 L -100 1250 Z" fill="url(#cone)" opacity="${fl}"/>
  <circle cx="430" cy="420" r="300" fill="${C.lamp}" opacity="${0.10 * fl}" filter="url(#b40)"/>
  <path d="M 380 300 L 480 300 L 522 392 L 338 392 Z" fill="#23272e"/>
  <path d="M 338 392 L 522 392" stroke="#5a5040" stroke-width="4"/>
  <ellipse cx="430" cy="398" rx="64" ry="22" fill="url(#glowLamp)" opacity="${fl}"/>
  ${o.mid || ''}
  <path d="M -20 1170 L 1100 1170 L 1100 1920 L -20 1920 Z" fill="#211a16"/>
  <path d="M -20 1170 L 1100 1170" stroke="#3a2e26" stroke-width="6"/>
  <path d="M 0 1300 Q 500 1290 1080 1310 M 0 1520 Q 540 1500 1080 1530 M 0 1760 Q 520 1740 1080 1770" stroke="#17110e" stroke-width="3" fill="none" opacity=".8"/>
  <ellipse cx="440" cy="1430" rx="560" ry="230" fill="${C.lamp}" opacity="${0.17 * fl}" filter="url(#b40)"/>
  <g transform="translate(250 1478)">
    <ellipse cx="0" cy="0" rx="94" ry="26" fill="none" stroke="#0c0807" stroke-width="8" opacity=".9"/>
    <path d="M -84 -6 Q 0 -30 84 -6" stroke="#7a6a5a" stroke-width="2.5" opacity=".55" fill="none"/>
  </g>
  <g transform="translate(600 1470)">${mug()}</g>
  ${rain(11, t, 0)}
</g>`;
  }

  function bgRoom(o = {}) {
    const t = o.t || 0, gap = o.gap == null ? 0.25 : o.gap, led = o.led !== false;
    const under = o.underDoor == null ? 1 : o.underDoor;
    const clock = o.clock || '03:17', dawn = o.dawn || 0, open = o.closetOpen || 0;
    const r = rng(5);
    let bars = '';
    for (let x = 744; x < 990; x += 42) bars += `<rect x="${x}" y="350" width="6" height="560" fill="#080c14"/>`;
    return `<g>
  <rect width="1080" height="1520" fill="#0f1624"/>
  <rect width="1080" height="1520" fill="url(#wallpaper)"/>
  <rect y="1510" width="1080" height="410" fill="#0a0e16"/>
  <path d="M 0 1600 L 1080 1600 M 0 1700 L 1080 1700 M 0 1820 L 1080 1820" stroke="#070a10" stroke-width="3"/>
  <rect y="1504" width="1080" height="16" fill="#151c2a"/>
  <!-- окно -->
  <rect x="700" y="330" width="310" height="600" fill="#1b2333"/>
  <rect x="720" y="350" width="270" height="560" fill="url(#winNight)"/>
  <rect x="720" y="350" width="270" height="560" fill="#9aa7b8" opacity="${0.55 * dawn}"/>
  <circle cx="940" cy="420" r="170" fill="url(#glowLamp)" opacity=".32"/>
  ${rain(21, t, 26, { x0: 720, x1: 990, y0: 350, y1: 910, len: 30, speed: 500, op: 0.28 })}
  ${bars}<rect x="720" y="610" width="270" height="6" fill="#080c14"/>
  <rect x="850" y="350" width="10" height="560" fill="#1b2333"/><rect x="720" y="560" width="270" height="10" fill="#1b2333"/>
  <rect x="690" y="926" width="330" height="22" fill="#1f2838"/>
  <path d="M 690 320 L 800 320 Q 780 600 806 940 L 690 940 Z" fill="#1a2340"/>
  <path d="M 720 330 Q 712 600 730 930 M 760 330 Q 748 600 770 930" stroke="#121a30" stroke-width="5" fill="none"/>
  <path d="M 960 320 L 1040 320 L 1040 940 L 972 940 Q 990 620 960 320 Z" fill="#1a2340"/>
  <rect x="670" y="310" width="400" height="12" fill="#0d121e"/>
  <path d="M 730 948 L 990 948 L 1120 1920 L 520 1920 Z" fill="${dawn > 0.5 ? '#b8c4d4' : '#6a82b8'}" opacity="${0.07 + 0.1 * dawn}" filter="url(#b16)"/>
  <!-- шкаф -->
  <rect x="10" y="342" width="342" height="32" fill="#1f1b22"/>
  <rect x="20" y="370" width="322" height="1170" fill="#17141a"/>
  <rect x="36" y="388" width="142" height="1136" fill="#1c181f"/>
  ${open ? `<rect x="182" y="388" width="142" height="1136" fill="#050407"/>
  <rect x="${182 + 142 * Math.min(1, open)}" y="388" width="${Math.max(0, 142 * (1 - Math.min(1, open)))}" height="1136" fill="#1d1920"/>
  ${o.closetDark ? '' : `<rect x="190" y="440" width="128" height="8" fill="#2a2630"/>`}
  ${o.closetDark ? (o.closetFigure ? `<g transform="translate(253 1524) scale(${0.62}) " opacity="${o.closetFigure}"><path d="M 0 -712 Q 54 -710 60 -640 Q 64 -598 50 -578 Q 120 -562 130 -500 L 150 -280 L 112 -440 L 104 -300 L 82 0 L -82 0 L -104 -300 L -112 -440 L -150 -280 L -130 -500 Q -120 -562 -50 -578 Q -64 -598 -60 -640 Q -54 -710 0 -712 Z" fill="#000"/><path d="M 0 -712 Q 54 -710 60 -640 Q 64 -598 50 -578 Q 120 -562 130 -500" stroke="#55627a" stroke-width="5" fill="none" opacity=".7"/></g>` : '') : `<path d="M 214 448 l 10 -20 l 10 20 Z M 254 448 l 10 -20 l 10 20 Z M 290 448 l 10 -20 l 10 20 Z" stroke="#3a3540" stroke-width="3" fill="none"/>
  <path d="M 204 448 L 244 448 L 250 900 L 198 900 Z" fill="#1b1d24"/><path d="M 244 448 L 284 448 L 292 820 L 240 820 Z" fill="#23202a"/><path d="M 282 448 L 314 448 L 318 960 L 280 960 Z" fill="#181a20"/>`}
  <path d="M 324 388 L ${324 + 90 * open} ${380 - 20 * open} L ${324 + 90 * open} ${1532 + 20 * open} L 324 1524 Z" fill="#2a2430"/><path d="M ${324 + 90 * open} ${380 - 20 * open} L ${324 + 90 * open} ${1532 + 20 * open}" stroke="#5a5260" stroke-width="5"/>` : `
  <rect x="${182 + gap * 34}" y="388" width="${142 - gap * 34}" height="1136" fill="#1d1920"/>
  <rect x="178" y="388" width="${4 + gap * 34}" height="1136" fill="url(#slit)"/>
  ${o.eyeGlint ? `<ellipse cx="${182 + gap * 17}" cy="700" rx="${3 + gap * 4}" ry="2.5" fill="#d8dde2" opacity="${o.eyeGlint}"/>` : ''}`}
  <rect x="56" y="420" width="102" height="460" fill="none" stroke="#120f14" stroke-width="5"/><rect x="56" y="950" width="102" height="540" fill="none" stroke="#120f14" stroke-width="5"/>
  ${open ? '' : `<rect x="${202 + gap * 34}" y="420" width="${102 - gap * 30}" height="460" fill="none" stroke="#120f14" stroke-width="5"/><rect x="${202 + gap * 34}" y="950" width="${102 - gap * 30}" height="540" fill="none" stroke="#120f14" stroke-width="5"/>
  <rect x="${190 + gap * 34}" y="920" width="7" height="62" rx="3" fill="#57524c"/>`}
  <rect x="164" y="920" width="7" height="62" rx="3" fill="#57524c"/>
  <rect x="20" y="1536" width="322" height="26" fill="#0e0c10"/>
  ${o.noCam ? '' : `<g transform="translate(286 344) scale(.9)">${petCam(led)}</g>
  <path d="M 322 350 Q 346 380 344 700" stroke="#0a0a0d" stroke-width="4" fill="none"/>`}
  <!-- проём в прихожую и входная дверь -->
  <rect x="388" y="448" width="244" height="1062" fill="#1a2130"/>
  <rect x="404" y="464" width="212" height="1046" fill="#04060b"/>
  <path d="M 404 1510 L 616 1510 L 584 1384 L 436 1384 Z" fill="#070a11"/>
  <rect x="446" y="700" width="128" height="684" fill="#0b0f18" stroke="#151b28" stroke-width="4"/>
  ${o.doorOpen ? `<rect x="446" y="700" width="${128 * o.doorOpen}" height="684" fill="${o.doorLight ? '#d7b46c' : '#000'}"/>${o.doorLight ? `<path d="M 446 1384 L ${446 + 128 * o.doorOpen} 1384 L ${430 + 200 * o.doorOpen} 1510 L 420 1510 Z" fill="#d7b46c" opacity=".35"/>` : ''}${o.voidShape ? `<g transform="${tr(452 + 60 * o.doorOpen, 1384, 0.82)}" opacity="${o.voidShape}"><path d="M 0 -712 Q 54 -710 60 -640 Q 64 -598 50 -578 Q 120 -562 130 -500 L 150 -280 L 112 -440 L 104 -300 L 82 0 L -82 0 L -104 -300 L -112 -440 L -150 -280 L -130 -500 Q -120 -562 -50 -578 Q -64 -598 -60 -640 Q -54 -710 0 -712 Z" fill="#1a1f26"/></g>` : ''}<path d="M ${446 + 128 * o.doorOpen} 700 L ${446 + 128 * o.doorOpen + 26 * o.doorOpen} 690 L ${446 + 128 * o.doorOpen + 26 * o.doorOpen} 1394 L ${446 + 128 * o.doorOpen} 1384 Z" fill="#141a26"/>` : ''}
  <circle cx="510" cy="900" r="10" fill="url(#glowLamp)" opacity="${0.8 * under}"/><circle cx="510" cy="900" r="3.5" fill="#ffd27a" opacity="${0.9 * under}"/>
  <rect x="548" y="1030" width="14" height="40" rx="3" fill="#2a2f3a"/>
  <rect x="446" y="1378" width="128" height="5" fill="#ffc46a" opacity="${0.85 * under}"/>
  <ellipse cx="510" cy="1384" rx="90" ry="14" fill="${C.lamp}" opacity="${0.35 * under}" filter="url(#b6)"/>
  <!-- тумбочка и часы -->
  <rect x="640" y="1226" width="104" height="184" fill="#15121a"/><rect x="634" y="1214" width="116" height="16" fill="#1d1922"/>
  <path d="M 650 1310 L 734 1310" stroke="#0d0b10" stroke-width="3"/><circle cx="692" cy="1290" r="4" fill="#3a3540"/>
  <g transform="translate(692 1190)">${digitalClock(clock, o.clockGlow == null ? 1 : o.clockGlow)}</g>
  <!-- кровать -->
  <rect x="772" y="1150" width="330" height="210" rx="10" fill="#1a1d27"/>
  <rect x="790" y="1168" width="300" height="20" rx="6" fill="#222634"/>
  <path d="M 770 1330 L 1090 1330 L 1090 1830 L 610 1830 Q 640 1560 770 1330 Z" fill="#262e42"/>
  <path d="M 790 1360 L 1090 1360 L 1090 1420 L 760 1420 Z" fill="#2b344b"/>
  <ellipse cx="930" cy="1366" rx="128" ry="40" fill="#3a4460"/>
  <path d="M 820 1360 Q 930 1342 1040 1360" stroke="#4a5574" stroke-width="4" fill="none"/>
  <path d="M 700 1560 Q 850 1520 1090 1560 M 650 1720 Q 860 1660 1090 1700" stroke="#1b2233" stroke-width="10" fill="none"/>
  <path d="M 740 1460 Q 900 1430 1090 1470" stroke="#323c56" stroke-width="6" fill="none"/>
  <rect x="604" y="1826" width="490" height="44" fill="#141720"/>
  ${o.mid || ''}
  <rect y="0" width="1080" height="1920" fill="#0a1630" opacity="${0.22 * (1 - dawn * 0.6)}" style="mix-blend-mode:multiply"/>
  ${dawn ? `<rect y="0" width="1080" height="1920" fill="#7d8ea6" opacity="${0.12 * dawn}" style="mix-blend-mode:screen"/>` : ''}
</g>`;
  }

  function bgYard(o = {}) {
    const t = o.t || 0, r = rng(9);
    let wins = '';
    const cols = [70, 250, 430, 610, 790, 970], rows = [380, 600, 820, 1040, 1270];
    rows.forEach((y, ri) => cols.forEach((x, ci) => {
      const empty = ri === 4 && ci === 3;
      const lit = !empty && r() < 0.32;
      wins += `<rect x="${x - 62}" y="${y - 78}" width="124" height="156" fill="#1a2028"/>`;
      if (empty) {
        wins += `<rect x="${x - 52}" y="${y - 68}" width="104" height="136" fill="#030405"/>`;
      } else if (lit) {
        wins += `<rect x="${x - 52}" y="${y - 68}" width="104" height="136" fill="#a37f47"/><rect x="${x - 52}" y="${y - 68}" width="${30 + r() * 20}" height="136" fill="#6d5431"/><circle cx="${x}" cy="${y}" r="90" fill="${C.lamp}" opacity=".08" filter="url(#b16)"/>`;
      } else {
        wins += `<rect x="${x - 52}" y="${y - 68}" width="104" height="136" fill="#151b23"/><rect x="${x - 52}" y="${y - 68}" width="104" height="40" fill="#1d2530" opacity=".7"/>`;
      }
      wins += `<rect x="${x - 3}" y="${y - 68}" width="6" height="136" fill="#1a2028"/>`;
      if (ri === 4) for (let bx = x - 46; bx < x + 50; bx += 22) wins += `<rect x="${bx}" y="${y - 70}" width="4" height="140" fill="#0d1116"/>`;
    }));
    return `<g>
  <rect width="1080" height="1920" fill="url(#skyGrey)"/>
  <path d="M -20 420 L 120 420 L 120 340 L 260 340 L 260 300 L 1100 300 L 1100 700 L -20 700 Z" fill="#26303b"/>
  <rect x="-20" y="270" width="1120" height="1150" fill="#2c3540"/>
  <rect x="-20" y="262" width="1120" height="22" fill="#20272f"/>
  <path d="M -20 490 H 1100 M -20 710 H 1100 M -20 930 H 1100 M -20 1150 H 1100" stroke="#232a33" stroke-width="4"/>
  <path d="M 160 270 V 1420 M 340 270 V 1420 M 520 270 V 1420 M 700 270 V 1420 M 880 270 V 1420" stroke="#262e38" stroke-width="3"/>
  ${wins}
  <rect x="520" y="1350" width="180" height="70" fill="#20272f"/>
  <rect x="-20" y="1420" width="1120" height="500" fill="#1d232b"/>
  <ellipse cx="300" cy="1640" rx="220" ry="34" fill="#3a4452" opacity=".6"/><ellipse cx="820" cy="1760" rx="260" ry="40" fill="#3a4452" opacity=".5"/>
  <rect x="300" y="1620" width="16" height="40" fill="${C.lamp}" opacity=".18"/>
  <path d="M 120 1920 L 150 1100 Q 154 1040 140 980 M 150 1180 Q 60 1080 10 1060 M 146 1260 Q 240 1160 300 1150 M 140 980 Q 90 900 40 880 M 140 1000 Q 200 920 260 900" stroke="#0f1318" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M 150 1180 Q 60 1080 10 1060 M 146 1260 Q 240 1160 300 1150" stroke="#0f1318" stroke-width="10" fill="none"/>
  <rect x="930" y="980" width="12" height="940" fill="#101419"/><path d="M 936 990 Q 936 950 890 950" stroke="#101419" stroke-width="10" fill="none"/><rect x="866" y="946" width="40" height="14" rx="4" fill="#1b2128"/>
  ${rain(31, t, 110, { len: 50, speed: 1500, op: 0.22 })}
  <path fill-rule="evenodd" d="M -10 -10 H 1090 V 1930 H -10 Z M 70 120 H 1010 V 1780 H 70 Z" fill="#0a0d12"/>
  <rect x="530" y="120" width="20" height="1660" fill="#0a0d12"/>
  <rect x="70" y="760" width="940" height="18" fill="#0a0d12"/>
  ${[150, 240, 330, 420, 660, 750, 840, 930].map(x => `<rect x="${x}" y="120" width="9" height="1660" fill="#06080b" opacity=".92"/>`).join('')}
  <rect x="70" y="1300" width="940" height="9" fill="#06080b" opacity=".92"/>
  <path d="M 70 1780 Q 540 1500 1010 1780" stroke="#06080b" stroke-width="9" fill="none" opacity=".92"/>
  <rect x="40" y="1780" width="1000" height="140" fill="#11161d"/>
</g>`;
  }

  function bgPodezd(o = {}) {
    const t = o.t || 0, fl = o.flicker == null ? 1 : o.flicker;
    const lurk = o.lurker || 0;
    const babs = o.babushkas !== false;
    let upper = '';
    [90, 300, 780, 990].forEach(x => { upper += `<rect x="${x - 70}" y="230" width="140" height="170" fill="#1d242d"/><rect x="${x - 60}" y="240" width="120" height="150" fill="#2a333d"/>`; });
    const firstWin = (x, lit) => {
      let s = `<rect x="${x - 120}" y="620" width="240" height="300" fill="#1b2129"/><rect x="${x - 106}" y="634" width="212" height="272" fill="${lit ? '#3d4757' : '#222a34'}"/>`;
      s += `<path d="M ${x - 106} 634 L ${x - 30} 634 Q ${x - 60} 780 ${x - 40} 906 L ${x - 106} 906 Z" fill="#59647a" opacity=".55"/>`;
      s += `<rect x="${x - 3}" y="634" width="6" height="272" fill="#1b2129"/>`;
      for (let bx = x - 100; bx <= x + 100; bx += 28) s += `<rect x="${bx}" y="626" width="5" height="288" fill="#0e1217"/>`;
      s += `<path d="M ${x - 106} 900 Q ${x} 820 ${x + 106} 900" stroke="#0e1217" stroke-width="5" fill="none"/>`;
      s += `<rect x="${x - 130}" y="918" width="260" height="16" fill="#4b5562"/>`;
      return s;
    };
    return `<g>
  <rect width="1080" height="1920" fill="#4a5462"/>
  <rect y="190" width="1080" height="1400" fill="#38424f"/>
  <path d="M 0 440 H 1080 M 0 1000 H 1080" stroke="#2e3742" stroke-width="5"/>
  <path d="M 200 190 V 1580 M 880 190 V 1580" stroke="#323b47" stroke-width="4"/>
  ${upper}
  ${firstWin(170, true)}${firstWin(910, false)}
  <rect x="392" y="762" width="296" height="770" fill="#272e37"/>
  <rect x="420" y="830" width="240" height="680" fill="#223029"/>
  <rect x="420" y="830" width="${56}" height="680" fill="#020304"/>
  ${lurk ? `<g transform="${tr(452, 1510, 0.92)}" >${shadowMan({ opacity: lurk })}</g>` : ''}
  <rect x="476" y="830" width="184" height="680" fill="#26352d"/>
  <rect x="492" y="860" width="152" height="300" fill="none" stroke="#1a2621" stroke-width="5"/><rect x="492" y="1190" width="152" height="290" fill="none" stroke="#1a2621" stroke-width="5"/>
  <rect x="594" y="1030" width="40" height="66" rx="4" fill="#15181b"/>
  ${[0, 1, 2, 3].map(i => `<circle cx="${606 + (i % 2) * 16}" cy="${1048 + Math.floor(i / 2) * 16}" r="4" fill="#3a3f44"/>`).join('')}<circle cx="614" cy="1086" r="3" fill="#ff4a3a"/>
  <rect x="488" y="1110" width="10" height="70" rx="4" fill="#4a524c"/>
  <rect x="332" y="726" width="416" height="40" fill="#535d6a"/><rect x="332" y="762" width="416" height="10" fill="#252b33"/>
  <rect x="440" y="640" width="200" height="64" rx="6" fill="#2c4a7a"/><text x="540" y="684" font-family="Inter, sans-serif" font-weight="800" font-size="34" fill="#dfe6ef" text-anchor="middle">1 · 1-20</text>
  <circle cx="540" cy="796" r="16" fill="${C.lampHot}" opacity="${0.85 * fl}"/><circle cx="540" cy="806" r="120" fill="${C.lamp}" opacity="${0.18 * fl}" filter="url(#b16)"/>
  <path d="M 520 780 h 40 v 30 h -40 z M 530 780 v 30 M 550 780 v 30" stroke="#20252b" stroke-width="3" fill="none"/>
  <g transform="translate(318 1010) rotate(-2)"><rect width="66" height="88" fill="#b9b6ad"/><path d="M 8 14 h 50 M 8 26 h 42 M 8 38 h 48" stroke="#55534d" stroke-width="3"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${4 + i * 10}" y="58" width="6" height="30" fill="#b9b6ad" stroke="#8a877f" stroke-width="1"/>`).join('')}</g>
  <rect x="372" y="1508" width="336" height="30" fill="#4a525c"/><rect x="352" y="1536" width="376" height="30" fill="#3f4650"/>
  <rect y="1560" width="1080" height="360" fill="#2b3038"/>
  <path d="M 60 1700 L 140 1720 L 180 1690 M 760 1620 L 820 1650 L 900 1640 M 300 1860 L 380 1840" stroke="#21252c" stroke-width="4" fill="none"/>
  <ellipse cx="860" cy="1640" rx="150" ry="22" fill="#3d4654" opacity=".7"/><ellipse cx="200" cy="1860" rx="190" ry="26" fill="#3d4654" opacity=".6"/>
  <rect x="520" y="1626" width="40" height="22" fill="${C.lamp}" opacity="${0.12 * fl}"/>
  <g transform="translate(700 1760)" stroke="${C.chalk}" stroke-width="5" fill="none" opacity=".75" stroke-linecap="round" stroke-linejoin="round">
    <path d="M -90 0 V -110 H 90 V 0 Z M -110 -108 L 0 -190 L 110 -108"/>
    <rect x="-60" y="-86" width="44" height="44"/><path d="M -60 -86 l 44 44 M -16 -86 l -44 44 M -60 -64 h 44 M -38 -86 v 44" stroke-width="4"/>
    <rect x="18" y="-86" width="44" height="44"/><circle cx="40" cy="-70" r="7"/><path d="M 40 -63 v 14 M 32 -56 h 16"/>
    <path d="M -14 0 v -34 h 28 v 34"/>
  </g>
  <g transform="translate(40 1530)">
    <rect x="0" y="-70" width="330" height="14" rx="3" fill="#3b3029"/><rect x="0" y="-46" width="330" height="14" rx="3" fill="#3b3029"/>
    <rect x="-6" y="0" width="342" height="16" rx="3" fill="#463a31"/><rect x="-6" y="20" width="342" height="12" rx="3" fill="#3b3029"/>
    <rect x="20" y="30" width="12" height="40" fill="#1c1f24"/><rect x="300" y="30" width="12" height="40" fill="#1c1f24"/>
  </g>
  ${babs ? `
  <g transform="translate(120 1546)"><path d="M -54 0 Q -60 -110 0 -116 Q 60 -110 54 0 Z" fill="#2c2833"/><path d="M -34 -110 Q -36 -176 4 -178 Q 42 -176 38 -112 Q 20 -96 0 -98 Q -20 -96 -34 -110 Z" fill="#4a3d4a"/><path d="M -10 -150 Q 20 -160 38 -130" stroke="#3a2f3a" stroke-width="8" fill="none"/></g>
  <g transform="translate(260 1546)"><path d="M -50 0 Q -56 -100 0 -106 Q 56 -100 50 0 Z" fill="#33303a"/><path d="M -32 -100 Q -34 -164 2 -166 Q 38 -164 34 -102 Q 18 -88 0 -90 Q -18 -88 -32 -100 Z" fill="#5a4a3e"/></g>` : ''}
  ${rain(41, t, 70, { len: 40, speed: 1300, op: 0.16 })}
  <rect width="1080" height="700" fill="#8c98a6" opacity=".08"/>
</g>`;
  }

  function bgEmpty(o = {}) {
    const t = o.t || 0, r = rng(77);
    let pics = '';
    for (let i = 0; i < 24; i++) {
      const cx = 90 + (i % 4) * 100 + (r() - 0.5) * 20, cy = 470 + Math.floor(i / 4) * 118 + (r() - 0.5) * 20;
      if (Math.abs(cx - 240) < 90 && Math.abs(cy - 790) < 120) continue;
      pics += `<g transform="${tr(cx, cy, 1, (r() - 0.5) * 16)}">${polaroid(i + 3)}</g>`;
    }
    let dust = '';
    const rd = rng(123);
    for (let i = 0; i < 46; i++) {
      const x = 300 + rd() * 640, y = 500 + rd() * 1300;
      const dx = Math.sin(t * 0.6 + i) * 14, dy = ((t * 18 + i * 37) % 80) - 40;
      dust += `<circle cx="${(x + dx).toFixed(1)}" cy="${(y + dy).toFixed(1)}" r="${(1.5 + rd() * 2.5).toFixed(1)}" fill="#efe9da" opacity="${(0.15 + rd() * 0.35).toFixed(2)}"/>`;
    }
    let hisWins = '';
    [[560, 700], [730, 700], [900, 700], [560, 900], [900, 900]].forEach(([x, y]) => { hisWins += `<rect x="${x - 50}" y="${y - 62}" width="100" height="124" fill="#232a33"/>`; });
    return `<g>
  <rect width="1080" height="1500" fill="#2b302c"/>
  <rect width="1080" height="1500" fill="url(#wallpaper)" opacity="1.6"/>
  <path d="M 380 200 L 470 180 L 460 300 L 520 360 L 430 420 L 360 330 Z" fill="#4a4c47"/><path d="M 470 180 L 520 360 L 506 362 L 458 190 Z" fill="#6c6b62"/>
  <path d="M 60 1260 L 180 1230 L 220 1320 L 140 1400 L 40 1380 Z" fill="#45473f"/>
  <!-- окно и вид на окна Никиты -->
  <rect x="480" y="380" width="500" height="720" fill="#6a6d66"/>
  <rect x="504" y="404" width="452" height="672" fill="#56616d"/>
  <rect x="504" y="560" width="452" height="516" fill="#343d48"/>
  <path d="M 504 640 H 956 M 504 820 H 956" stroke="#2a323c" stroke-width="3"/>
  ${hisWins}
  <rect x="680" y="770" width="104" height="128" fill="#8a7550"/>
  <rect x="680" y="770" width="104" height="40" fill="#a68c5c"/>
  <rect x="688" y="846" width="88" height="34" rx="5" fill="#3b4258"/><rect x="688" y="838" width="22" height="16" rx="4" fill="#d9d2c0"/>
  <circle cx="702" cy="836" r="7" fill="#c39f88"/><circle cx="702" cy="832" r="7" fill="#8f949a" opacity=".9"/>
  <path d="M 712 846 Q 740 836 776 846" stroke="#4b5470" stroke-width="5" fill="none"/>
  <rect x="756" y="800" width="20" height="40" fill="#15121a"/><rect x="760" y="794" width="12" height="6" fill="#ff4a36"/>
  ${[686, 704, 722, 740, 758, 776].map(x => `<rect x="${x}" y="770" width="3" height="128" fill="#151a22"/>`).join('')}
  <circle cx="732" cy="834" r="90" fill="#e8b65f" opacity=".14" filter="url(#b16)"/>
  ${rain(51, t, 30, { x0: 504, x1: 956, y0: 404, y1: 1076, len: 26, speed: 700, op: 0.2 })}
  <rect x="722" y="404" width="16" height="672" fill="#6a6d66"/><rect x="504" y="700" width="452" height="14" fill="#6a6d66"/>
  <rect x="466" y="1096" width="528" height="26" fill="#5c5f58"/>
  <g transform="translate(600 1080)"><rect x="-44" y="-40" width="34" height="44" rx="10" fill="#141619"/><rect x="2" y="-40" width="34" height="44" rx="10" fill="#141619"/><rect x="-14" y="-30" width="20" height="14" fill="#0c0d0f"/><circle cx="-27" cy="-38" r="12" fill="#22262b"/><circle cx="19" cy="-38" r="12" fill="#22262b"/></g>
  <!-- луч света -->
  <path d="M 504 404 L 956 404 L 900 1920 L -60 1920 Z" fill="url(#beam)"/>
  ${dust}
  <!-- стена с фото -->
  ${pics}
  <g transform="${tr(240, 790, 0.82, 2)}">${oldPhoto()}</g>
  <!-- пол и стул -->
  <rect y="1500" width="1080" height="420" fill="#231d19"/>
  <path d="M 0 1560 H 1080 M 0 1640 H 1080 M 0 1740 H 1080 M 0 1860 H 1080" stroke="#1a1512" stroke-width="3"/>
  <path d="M 504 1500 L 956 1500 L 1000 1920 L 200 1920 Z" fill="#d9e0e2" opacity=".06"/>
  <ellipse cx="700" cy="1660" rx="190" ry="34" fill="#000" opacity=".4" filter="url(#b6)"/>
  <g transform="translate(700 1660)">
    <rect x="-110" y="-250" width="16" height="250" fill="#1f1712"/><rect x="94" y="-250" width="16" height="250" fill="#1f1712"/>
    <rect x="-80" y="-280" width="14" height="250" fill="#2a1f19"/><rect x="66" y="-280" width="14" height="250" fill="#2a1f19"/>
    <rect x="-116" y="-262" width="232" height="22" fill="#33261e"/>
    <rect x="-104" y="-560" width="18" height="320" fill="#2a1f19"/><rect x="86" y="-560" width="18" height="320" fill="#2a1f19"/>
    <rect x="-110" y="-570" width="220" height="36" rx="6" fill="#33261e"/>
    <rect x="-50" y="-534" width="12" height="280" fill="#2a1f19"/><rect x="-6" y="-534" width="12" height="280" fill="#2a1f19"/><rect x="38" y="-534" width="12" height="280" fill="#2a1f19"/>
    <rect x="-110" y="-570" width="220" height="6" fill="#4a382b"/>
  </g>
</g>`;
  }

  function bgDoorChain(o = {}) {
    const open = o.open == null ? 1 : o.open, gw = 84 * open;
    let chain = '';
    for (let i = 0; i <= 7; i++) {
      const u = i / 7, x = 600 + u * (gw + 8), y = 1000 + Math.sin(u * Math.PI) * 26;
      chain += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="9" ry="6" fill="none" stroke="#a09d96" stroke-width="3.5" transform="rotate(${i % 2 ? 0 : 90} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
    return `<g>
  <rect width="1080" height="1920" fill="#4f5552"/>
  <rect y="920" width="1080" height="1000" fill="#1f3229"/>
  <rect y="914" width="1080" height="10" fill="#2a4136"/>
  <path d="M 60 300 Q 120 420 90 560 M 900 1200 L 960 1260" stroke="#3e4441" stroke-width="3" fill="none"/>
  <rect x="190" y="250" width="700" height="1460" fill="#2a2420"/>
  <rect x="${600}" y="278" width="${gw}" height="1412" fill="url(#gapWarm)"/>
  ${o.face !== false && open > 0.2 ? `<g clip-path="url(#gapClip)"><g transform="${tr(600 + gw * 0.62, 830, 1.5)}">${landladyHead({ mouthOpen: o.mouth || 0 })}</g></g>` : ''}
  <rect x="${600 + gw}" y="278" width="${260 - gw}" height="1412" fill="#1c1715"/>
  <rect x="214" y="278" width="386" height="1412" fill="#3b2620"/>
  <rect x="214" y="278" width="386" height="1412" fill="url(#quilt)" opacity=".9"/>
  <rect x="586" y="278" width="14" height="1412" fill="#24160f"/>
  <ellipse cx="410" cy="560" rx="44" ry="30" fill="#9a7a45"/><text x="410" y="574" font-family="Inter, sans-serif" font-weight="800" font-size="38" fill="#3b2a14" text-anchor="middle">5</text>
  <circle cx="410" cy="700" r="9" fill="#151110"/><circle cx="410" cy="700" r="4" fill="#ffd27a" opacity=".8"/>
  <rect x="548" y="1000" width="22" height="70" rx="5" fill="#8a7448"/><rect x="530" y="1020" width="40" height="12" rx="5" fill="#a08850"/>
  ${chain}
  <path d="M ${600} 1690 L ${600 + gw} 1690 L ${760 + gw * 2} 1920 L ${560} 1920 Z" fill="${C.lamp}" opacity="${0.3 * open}" filter="url(#b16)"/>
  <circle cx="540" cy="80" r="200" fill="${C.lamp}" opacity=".08" filter="url(#b40)"/>
  <defs><clipPath id="gapClip"><rect x="600" y="278" width="${gw}" height="1412"/></clipPath></defs>
</g>`;
  }

  // ---------- оверлеи ----------
  function camHUD(o = {}) {
    const recOn = o.rec !== false;
    return `<g font-family="JetBrains Mono, monospace" font-weight="700">
  <rect width="1080" height="1920" fill="url(#scan)" opacity=".7"/>
  <path d="M 60 340 v -60 h 60 M 1020 340 v -60 h -60 M 60 1420 v 60 h 60 M 1020 1420 v 60 h -60" stroke="#e6efe8" stroke-width="5" fill="none" opacity=".75"/>
  <text x="90" y="400" font-size="44" fill="#e6efe8" opacity=".9">${o.label || 'CAM 1'}</text>
  ${recOn ? `<circle cx="866" cy="386" r="14" fill="#ff3b2e"/>` : ''}<text x="890" y="400" font-size="44" fill="#e6efe8" opacity=".9">${o.rec || 'REC'}</text>
  <text x="90" y="1460" font-size="52" fill="#e6efe8" opacity=".95">${o.time || 'СБ 05:02:13'}</text>
</g>`;
  }

  function overlays(o = {}) {
    return `<rect width="1080" height="1920" fill="url(#vign)" opacity="${o.vign == null ? 1 : o.vign}"/>
<rect width="1080" height="1920" filter="url(#grain)" opacity="${o.grain == null ? 0.5 : o.grain}" style="mix-blend-mode:overlay"/>`;
  }

  function frame(inner, o = {}) {
    const w = o.w || 1080, h = o.h || 1920;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="${w}" height="${h}" style="display:block">${inner}${o.noOverlay ? '' : overlays(o)}</svg>`;
  }


  // лежит в кровати (вид с камеры на шкафу)
  function nikitaLying(o = {}) {
    return `<g>
  <path d="M 790 1420 Q 860 1380 960 1400 Q 1060 1420 1090 1460 L 1090 1700 Q 900 1640 720 1700 Q 700 1560 790 1420 Z" fill="#2f3850"/>
  <path d="M 800 1440 Q 900 1420 1080 1470" stroke="#3a4560" stroke-width="8" fill="none"/>
  <g transform="${tr(905, 1352, 0.62, -8)}">${nikitaHead({ blink: o.blink == null ? 1 : o.blink })}</g>
  <path d="M 820 1418 Q 900 1396 1000 1414" stroke="#262e42" stroke-width="14" fill="none"/>
</g>`;
  }

  // крупный план двери с номером и замком
  function doorCloseup(o = {}) {
    const num = o.num == null ? '17' : o.num, turn = o.turn || 0, keyIn = o.keyIn == null ? 1 : o.keyIn;
    const padded = o.padded;
    return `<g>
  <rect width="1080" height="1920" fill="${padded ? '#3b2620' : '#26302c'}"/>
  ${padded ? `<rect width="1080" height="1920" fill="url(#quilt)" opacity=".9"/>` : `<rect x="60" y="120" width="960" height="1680" fill="none" stroke="#1b2420" stroke-width="10"/><rect x="120" y="180" width="840" height="1560" fill="none" stroke="#202b26" stroke-width="6"/>`}
  ${num === '' ? '' : `<g transform="translate(540 520)"><ellipse rx="150" ry="100" fill="#9a7a45"/><ellipse rx="138" ry="88" fill="none" stroke="#6e5530" stroke-width="5"/><text y="52" font-family="Inter, sans-serif" font-weight="900" font-size="150" fill="#3b2a14" text-anchor="middle">${num}</text></g>`}
  <circle cx="540" cy="1000" r="16" fill="#0c0b0a"/><circle cx="540" cy="1000" r="7" fill="#e8b65f" opacity=".5"/>
  ${o.bolt != null ? `<g transform="translate(0 760)">
    <rect x="300" y="-50" width="260" height="100" rx="10" fill="#6d6458"/><rect x="314" y="-38" width="232" height="76" rx="8" fill="#857a6b"/>
    <rect x="${340 + o.bolt * 360}" y="-22" width="${220}" height="44" rx="20" fill="#c9bfa8"/><rect x="${340 + o.bolt * 360}" y="-22" width="220" height="12" rx="6" fill="#efe6d0" opacity=".7"/>
    <rect x="${420 + o.bolt * 360}" y="-70" width="26" height="60" rx="10" fill="#b5ab95"/>
    <rect x="860" y="-60" width="170" height="120" rx="10" fill="#6d6458"/><rect x="880" y="-30" width="120" height="60" rx="6" fill="#2a2620"/>
    ${[320, 540, 880, 1010].map(x => `<circle cx="${x}" cy="0" r="7" fill="#4a443b"/>`).join('')}
  </g>` : ''}
  <g transform="translate(540 1300)">
    <rect x="-70" y="-150" width="140" height="300" rx="26" fill="#8f8a80"/><rect x="-58" y="-138" width="116" height="276" rx="20" fill="#a6a196"/>
    <circle cx="0" cy="0" r="44" fill="#6d6a63"/><circle cx="0" cy="0" r="34" fill="#c2bdb1"/>
    <g transform="rotate(${turn * 90})"><rect x="-6" y="-26" width="12" height="40" rx="3" fill="#2a2724"/><circle cx="0" cy="18" r="9" fill="#2a2724"/></g>
    ${keyIn ? `<g transform="rotate(${turn * 90}) translate(0 ${(1 - keyIn) * 260})"><g transform="rotate(90) translate(-70 0) scale(2.3)">${keyShape(o.tag !== false)}</g></g>` : ''}
  </g>
  ${o.hand ? `<g transform="translate(${560 + (1 - keyIn) * 40} ${1300 + 330 + (1 - keyIn) * 260}) rotate(${turn * 40})"><ellipse rx="70" ry="95" fill="#c39f88"/><ellipse cx="40" cy="20" rx="30" ry="60" fill="#9d7b69"/><rect x="-80" y="80" width="160" height="300" rx="40" fill="#3a4231"/></g>` : ''}
  <rect width="1080" height="1920" fill="#000" opacity=".25"/>
</g>`;
  }

  // телефон с записью камеры
  function phone(inner, o = {}) {
    return `<g>
  <rect width="1080" height="1920" fill="#0b0e14"/>
  <circle cx="540" cy="900" r="700" fill="#1b2433" opacity=".6" filter="url(#b40)"/>
  <g transform="translate(540 980) rotate(${o.rot || -3})">
    <rect x="-330" y="-640" width="660" height="1280" rx="70" fill="#07080a"/>
    <rect x="-300" y="-600" width="600" height="1200" rx="44" fill="#000"/>
    <svg x="-300" y="-600" width="600" height="1200" viewBox="0 0 1080 2160" preserveAspectRatio="xMidYMid slice">${inner}</svg>
    <rect x="-90" y="-616" width="180" height="26" rx="13" fill="#07080a"/>
    <rect x="-300" y="420" width="600" height="180" fill="#000" opacity=".55"/>
    <rect x="-250" y="470" width="500" height="10" rx="5" fill="#3a3f48"/><rect x="-250" y="470" width="${500 * (o.progress || 0)}" height="10" rx="5" fill="#ff3b2e"/>
    <circle cx="${-250 + 500 * (o.progress || 0)}" cy="475" r="16" fill="#fff"/>
    <text x="-250" y="540" font-family="JetBrains Mono, monospace" font-weight="700" font-size="34" fill="#e6efe8">${o.label || ''}</text>
    <path d="M 175 -120 l 0 0" />
  </g>
  ${o.thumb ? `<g transform="translate(${610 + 0} ${1560}) rotate(-8)"><ellipse rx="90" ry="120" fill="#c39f88"/><ellipse cx="-30" cy="-10" rx="36" ry="70" fill="#9d7b69"/></g>` : ''}
</g>`;
  }

  function keyFloorShot(o = {}) {
    const t = o.t || 0;
    let boards = '';
    for (let y = -40; y < 1980; y += 150) boards += `<rect x="0" y="${y}" width="1080" height="146" fill="${(y / 150) % 2 ? '#211b17' : '#251e19'}"/><path d="M 0 ${y + 148} H 1080" stroke="#120e0b" stroke-width="5"/>`;
    return `<g>
  ${boards}
  <path d="M 300 -100 L 1180 -100 L 1180 2000 L 600 2000 Z" fill="#c9d0d6" opacity=".07"/>
  <ellipse cx="560" cy="1010" rx="260" ry="70" fill="#000" opacity=".45" filter="url(#b16)"/>
  <g transform="translate(470 980) rotate(${-14 + Math.sin(t * 0.7) * 1.5}) scale(4.2)">${keyShape(true)}</g>
  <rect x="0" y="0" width="210" height="1920" fill="#060507" opacity=".9"/><rect x="200" y="0" width="16" height="1920" fill="#17141a"/>
</g>`;
  }

  root.ART_EXTRA = { nikitaLying, doorCloseup, phone, keyFloorShot };

  // сидящая тень (сын/«он»)
  function shadowSit(o = {}) {
    const d = 'M 0 -520 Q 52 -518 58 -450 Q 62 -410 48 -392 Q 116 -376 126 -316 L 146 -120 L 112 -112 L 104 -250 L 96 -170 L 150 -150 L 156 0 L 108 0 L 100 -110 L 0 -130 L -100 -110 L -108 0 L -156 0 L -150 -150 L -96 -170 L -104 -250 L -112 -112 L -146 -120 L -126 -316 Q -116 -376 -48 -392 Q -62 -410 -58 -450 Q -52 -518 0 -520 Z';
    return `<g opacity="${o.opacity == null ? 1 : o.opacity}"><path d="${d}" fill="none" stroke="#03050a" stroke-width="14" stroke-opacity=".3" stroke-linejoin="round"/><path d="${d}" fill="#03050a"/></g>`;
  }

  // крупно: Никита лежит, лицо в свете телефона; за спиной может появиться «он»
  function faceLying(o = {}) {
    const glow = o.glow == null ? 1 : o.glow, behind = o.behind || 0;
    return `<g>
  <rect width="1080" height="1920" fill="#05080f"/>
  <path d="M -60 520 Q 540 380 1140 560 L 1140 1300 Q 540 1200 -60 1340 Z" fill="#1c2436"/>
  <path d="M -60 520 Q 540 380 1140 560 L 1140 600 Q 540 440 -60 570 Z" fill="#26304a"/>
  ${behind ? `<g transform="translate(${lerp(300, 380, behind)} ${lerp(420, 520, behind)}) scale(${lerp(2.2, 3.4, behind)})" opacity="${Math.min(1, behind * 1.6)}">
     <ellipse cx="0" cy="0" rx="62" ry="78" fill="#000"/><path d="M -56 30 Q -70 -70 0 -80 Q 70 -70 56 30" stroke="#4a5a7a" stroke-width="4" fill="none" opacity=".6"/>
     <path d="M -120 160 Q -90 70 0 70 Q 90 70 120 160 Z" fill="#000"/></g>` : ''}
  <g transform="translate(560 860) rotate(-90) scale(3.3)">${nikitaHead({ blink: o.blink || 0, eyesWide: o.eyesWide, lookX: o.lookX || 0, lookY: o.lookY || 0 })}</g>
  <path d="M -60 1120 Q 300 1010 620 1080 Q 900 1140 1140 1060 L 1140 1920 L -60 1920 Z" fill="#202941"/>
  <path d="M -60 1120 Q 300 1010 620 1080 Q 900 1140 1140 1060" stroke="#2f3a58" stroke-width="18" fill="none"/>
  <g transform="translate(820 1150) rotate(-12)"><rect x="-70" y="-130" width="140" height="260" rx="22" fill="#0b0d12"/><rect x="-60" y="-118" width="120" height="236" rx="14" fill="#b9d2ff" opacity="${0.55 + 0.35 * glow}"/></g>
  <circle cx="760" cy="1000" r="520" fill="url(#glowCold)" opacity="${0.9 * glow}" style="mix-blend-mode:screen"/>
  <rect width="1080" height="1920" fill="#0b1a3a" opacity=".25" style="mix-blend-mode:multiply"/>
</g>`;
  }
  const lerp = (a, b, u) => a + (b - a) * u;
  Object.assign(root.ART_EXTRA, { shadowSit, faceLying });
  root.ART = { C, rng, tr, defs, nikita, nikitaHead, sonya, landlady, landladyHead, shadowMan, mug, petCam, keyShape, oldPhoto, polaroid, digitalClock, scalpel, rain,
    bgKitchen, bgRoom, bgYard, bgPodezd, bgEmpty, bgDoorChain, camHUD, overlays, frame };
})(typeof window !== 'undefined' ? window : globalThis);
