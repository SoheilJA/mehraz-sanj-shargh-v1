/**
 * Procedural line-art illustrations (ink + brand gold) drawn as inline SVG.
 * Used by service cards, the capabilities composition and the hero fallback.
 */

const INK = '#1e2229'
const GOLD = '#d4af37'
const MUT = '#9aa0ab'

const base = (vb = '0 0 400 300', body) =>
  `<svg class="svc-visual" viewBox="${vb}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`

const txt = (x, y, s, cls = 'mono') =>
  `<text x="${x}" y="${y}" class="sv-${cls}" >${s}</text>`

/* ---------------- Service visuals ---------------- */

export const serviceVisuals = {
  // SRV-01 — axes grid, column markers, plumb line, dimension
  'geometric-control': base(
    '0 0 400 300',
    `
    <g stroke="${INK}" stroke-width="1.1" opacity="0.55">
      ${[70, 140, 210, 280].map((x) => `<line x1="${x}" y1="30" x2="${x}" y2="250" stroke-dasharray="3 5"/>`).join('')}
      ${[60, 140, 220].map((y) => `<line x1="30" y1="${y}" x2="330" y2="${y}" stroke-dasharray="3 5"/>`).join('')}
    </g>
    ${txt(66, '20', 'A')}${txt(136, '20', 'B')}${txt(206, '20', 'C')}${txt(276, '20', 'D')}
    ${txt(20, '64', '1')}${txt(20, '144', '2')}${txt(20, '224', '3')}
    ${[70, 140, 210, 280].map((x) => [60, 140, 220].map((y) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="${INK}" opacity="0.75"/>`).join('')).join('')}
    <line data-anim x1="140" y1="140" x2="140" y2="40" stroke="${GOLD}" stroke-width="1.6"/>
    <circle cx="140" cy="140" r="13" stroke="${GOLD}" stroke-width="1.6"/>
    <path d="M140 127 l6 13 -6 0 -6 -13 z" fill="${GOLD}"/>
    ${txt(318, '54', 'PL.0.00', 'gold')}
    <g stroke="${INK}" stroke-width="1">
      <line x1="60" y1="272" x2="280" y2="272"/>
      <line x1="60" y1="266" x2="60" y2="278"/><line x1="280" y1="266" x2="280" y2="278"/>
    </g>
    ${txt(150, '290', 'a = 12.600 m', 'ink')}
    <g stroke="${MUT}" stroke-width="0.8">
      <path d="M340 60 h16 M348 52 v16"/>
      <path d="M340 250 h16 M348 242 v16"/>
    </g>`
  ),

  // SRV-02 — topographic contours, spot heights, section line
  'topographic-surveying': base(
    '0 0 400 300',
    `
    <g stroke="${INK}" stroke-width="1.1">
      <path d="M60 200 q60 -42 120 -8 t120 -52 q18 -14 -6 -30 q-40 -24 -86 8 t-110 18 q-40 14 -38 64z"/>
      <path d="M86 192 q52 -34 104 -6 t102 -46 q14 -12 -6 -24 q-34 -20 -74 8 t-94 14 q-34 12 -32 54z" opacity="0.85"/>
      <path d="M112 184 q44 -26 88 -4 t84 -38 q10 -8 -6 -18 q-28 -16 -62 8 t-78 10 q-28 10 -26 42z" opacity="0.7"/>
      <path d="M138 176 q36 -18 72 -2 t66 -30 q6 -6 -6 -12 q-22 -12 -50 8 t-62 6 q-22 8 -20 30z" opacity="0.55"/>
      <path d="M164 168 q28 -10 56 0 t48 -22 q2 -4 -6 -6 q-16 -8 -38 8 t-46 2 q-16 6 -14 18z" opacity="0.4"/>
    </g>
    <g stroke="${MUT}" stroke-width="0.9">
      <path d="M300 40 v220"/><path d="M294 46 h12 M294 254 h12"/>
    </g>
    ${txt(302, '36', "A", 'ink')}${txt(302, '272', "A'", 'ink')}
    ${txt(116, '182', '۸۵.۲', 'mono')}
    ${txt(166, '160', '۹۰.۰', 'gold')}
    ${txt(214, '136', '۹۴.۶', 'mono')}
    <g stroke="${GOLD}" stroke-width="1.4">
      <path d="M166 164 M160 164 h12 M166 158 v12"/>
      <path d="M208 128 l22 -26" stroke-dasharray="4 3"/>
      <path d="M226 104 l4 0 M228 98 l0 4" />
    </g>
    ${txt(236, '96', 'BM 94.60', 'gold')}
    <g stroke="${MUT}" stroke-width="0.8">
      <path d="M40 250 h24 M52 244 v12"/><path d="M64 250 l-14 10"/>
    </g>
    ${txt(70, '262', 'N', 'ink')}`
  ),

  // SRV-03 — cadastral parcels with bearings
  'utm-cadastre': base(
    '0 0 400 300',
    `
    <g stroke="${INK}" stroke-width="1.3">
      <path d="M60 50 h150 l40 60 -70 130 -90 -30 -30 -80 z"/>
      <path d="M210 50 l130 0 -30 160 -160 -10" opacity="0.9"/>
      <path d="M310 110 l-20 100" opacity="0.6" stroke-dasharray="2 4"/>
    </g>
    <g stroke="${GOLD}" stroke-width="1.6">
      <path data-anim d="M60 50 v130"/>
      <rect x="54" y="44" width="12" height="12"/>
      <rect x="54" y="174" width="12" height="12"/>
    </g>
    ${txt(70, '110', 'N 36°18′', 'gold')}
    ${txt(70, '130', 'E 59°36′', 'gold')}
    ${txt(120, '108', 'پلاک ۱۲', 'ink')}
    ${txt(240, '120', 'پلاک ۱۳', 'ink')}
    <g fill="none" stroke="${MUT}" stroke-width="0.9">
      <path d="M352 52 v46 M346 58 h12"/>
      <path d="M352 98 l-10 16 h20 z" fill="${MUT}" stroke="none" opacity="0.9"/>
    </g>
    ${txt(340, '132', 'N', 'ink')}
    <g stroke="${INK}" stroke-width="0.8" opacity="0.5">
      <path d="M60 220 h320 M60 214 v12 M380 214 v12"/>
    </g>
    ${txt(150, '240', 'UTM — ZONE 40N', 'mono')}
    ${txt(150, '258', 'WGS84 / EPSG:32640', 'mono')}`
  ),

  // SRV-04 — cut & fill section
  'earthwork-calculation': base(
    '0 0 400 300',
    `
    <g stroke="${INK}" stroke-width="1.4">
      <path d="M30 200 q50 -30 90 -14 t80 -20 q40 -8 80 6 t90 18" />
    </g>
    <g stroke="${GOLD}" stroke-width="1.6">
      <path data-anim d="M30 160 L370 140"/>
    </g>
    <g stroke="${MUT}" stroke-width="0.8" stroke-dasharray="3 4">
      <path d="M30 60 v240 M370 60 v240"/>
    </g>
    <g stroke="${INK}" stroke-width="0.55" opacity="0.6">
      ${[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280].map((dx) =>
        `<path d="M${40 + dx} ${200 - (Math.cos(dx / 60) * 8)} l9 -9" />`
      ).join('')}
      ${[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280].map((dx) =>
        `<path d="M${40 + dx} ${168 - dx / 26} l9 9" />`
      ).join('')}
    </g>
    ${txt(150, '128', 'CUT  V₁', 'ink')}
    ${txt(150, '190', 'FILL  V₂', 'ink')}
    <g stroke="${GOLD}" stroke-width="1.2">
      <path d="M212 168 v-8 M212 160 l-4 4 M212 160 l4 4"/>
    </g>
    ${txt(222, '158', 'Δh = 0.8 m', 'gold')}
    ${txt(40, '280', 'EXIST. GROUND', 'mono')}
    ${txt(250, '136', 'DESIGN GRADE', 'gold')}`
  ),
}

export function serviceVisual(slug) {
  return serviceVisuals[slug] || ''
}

/* ---------------- Capability diagrams ---------------- */

const cap = (vb, body) => base(vb, body)

export const capabilityVisuals = {
  monitoring: cap(
    '0 0 320 220',
    `
    <g stroke="${INK}" stroke-width="1.3">
      <path d="M40 180 h240 M40 180 V60 h40 V40 h60 v20 h40 V40 h60 v140"/>
      <path d="M60 60 v120 M100 40 v140 M140 60 v120 M180 40 v140 M220 60 v120" opacity="0.35"/>
    </g>
    <g stroke="${GOLD}" stroke-width="1.5">
      <path data-anim d="M140 20 v190"/>
      <path d="M180 140 l16 8" />
      <path d="M188 140 h12 v8 h-12 z" fill="${GOLD}" stroke="none"/>
    </g>
    ${txt(252, '150', 'Δ = 4 mm', 'gold')}
    ${txt(40, '204', 'DATUM 0.00', 'mono')}`
  ),
  layout: cap(
    '0 0 320 220',
    `
    <g stroke="${INK}" stroke-width="1.1" opacity="0.5">
      <path d="M160 20 v180 M40 110 h240" stroke-dasharray="3 5"/>
      <path d="M80 20 v180 M240 20 v180 M40 50 h240 M40 170 h240" stroke-dasharray="2 6"/>
    </g>
    <g stroke="${GOLD}" stroke-width="1.5">
      <path data-anim d="M160 110 L80 50 M160 110 L240 170 M160 110 L80 170 M160 110 L240 50"/>
      <circle cx="160" cy="110" r="7"/>
      <circle cx="80" cy="50" r="3" fill="${GOLD}" stroke="none"/>
      <circle cx="240" cy="170" r="3" fill="${GOLD}" stroke="none"/>
    </g>
    ${txt(196, '104', 'STS 01', 'gold')}
    ${txt(40, '50', 'A.1', 'mono')}
    ${txt(248, '170', 'B.2', 'mono')}`
  ),
  topo: cap(
    '0 0 320 220',
    `
    <g stroke="${INK}" stroke-width="1.1">
      <path d="M30 150 q50 -40 100 -10 t90 -50 q16 -12 -8 -24 q-34 -18 -72 10 t-92 16 q-34 12 -18 58z"/>
      <path d="M56 142 q42 -32 84 -8 t74 -42 q12 -10 -6 -20 q-28 -16 -62 8 t-80 12 q-28 10 -10 50z" opacity="0.7"/>
      <path d="M82 134 q34 -24 68 -4 t58 -34 q8 -8 -6 -14 q-22 -12 -48 8 t-66 4 q-20 6 -6 40z" opacity="0.45"/>
    </g>
    ${txt(120, '128', '۹۲.۴', 'gold')}
    <g stroke="${GOLD}" stroke-width="1.3">
      <path d="M120 118 M114 118 h12 M120 112 v12"/>
      <path data-anim d="M120 118 q60 -10 130 -60"/>
    </g>
    ${txt(226, '58', '+1.5 m', 'gold')}`
  ),
  gnss: cap(
    '0 0 320 220',
    `
    <g stroke="${INK}" stroke-width="1.2">
      <path d="M160 30 l-18 30 h36 z"/>
      <path d="M142 74 h36" opacity="0.6"/>
    </g>
    <g stroke="${GOLD}" stroke-width="1.3">
      <path data-anim d="M160 74 L60 170"/>
      <path data-anim d="M160 74 L160 170"/>
      <path data-anim d="M160 74 L260 170"/>
    </g>
    <g stroke="${INK}" stroke-width="1.4">
      <path d="M150 170 h20 v14 h-20 z"/>
      <path d="M160 184 v16"/>
      <path d="M148 200 h24" opacity="0.6"/>
    </g>
    ${txt(176, '80', 'L1 · L2 · L5', 'gold')}
    ${txt(60, '196', 'φ 36.2605°', 'mono')}
    ${txt(160, '208', 'λ 59.6168°', 'gold')}`
  ),
  asbuilt: cap(
    '0 0 320 220',
    `
    <g stroke="${INK}" stroke-width="1.2">
      <path d="M50 30 h180 v160 h-180 z"/>
      <path d="M50 70 h180 M50 110 h180 M50 150 h180" opacity="0.25"/>
      <path d="M95 30 v160 M140 30 v160 M185 30 v160" opacity="0.25"/>
    </g>
    <g stroke="${GOLD}" stroke-width="1.4">
      <path data-anim d="M95 70 L185 150"/>
      <circle cx="95" cy="70" r="4"/>
      <circle cx="185" cy="150" r="4"/>
      <path d="M240 70 h40 M240 64 v12 M280 64 v12"/>
    </g>
    ${txt(246, '62', '5.42 m', 'gold')}
    <g stroke="${MUT}" stroke-width="0.8">
      <path d="M245 90 v70 M241 96 h8 M241 154 h8"/>
    </g>
    ${txt(288, '128', 'AS-BUILT', 'mono')}
    ${txt(58, '208', 'SCALE 1:100', 'mono')}`
  ),
  earthwork: cap(
    '0 0 320 220',
    `
    <g stroke="${INK}" stroke-width="1.3">
      <path d="M30 130 q40 -26 70 -10 t60 -16 q30 -6 60 4 t70 12"/>
    </g>
    <g stroke="${GOLD}" stroke-width="1.5">
      <path data-anim d="M30 100 L290 92"/>
    </g>
    <g stroke="${INK}" stroke-width="0.5" opacity="0.55">
      ${[0, 22, 44, 66, 88, 110, 132, 154, 176].map((dx) => `<path d="M${36 + dx} ${124 - Math.cos(dx / 40) * 4} l7 -7"/>`).join('')}
      ${[0, 22, 44, 66, 88, 110, 132, 154, 176].map((dx) => `<path d="M${36 + dx} ${98 - dx / 62} l7 7"/>`).join('')}
    </g>
    ${txt(120, '88', 'V = Σ(A×d)', 'gold')}
    ${txt(30, '196', 'SECTION 2+20 — CUT/FILL', 'mono')}`
  ),
}

/* ---------------- Hero fallback (static composition) ---------------- */

export function heroFallback() {
  return base(
    '0 0 900 620',
    `
    <g stroke="${INK}" stroke-width="1" opacity="0.35">
      ${Array.from({ length: 14 }, (_, i) => `<line x1="${60 + i * 60}" y1="40" x2="${60 + i * 60}" y2="580" />`).join('')}
      ${Array.from({ length: 10 }, (_, i) => `<line x1="60" y1="${40 + i * 60}" x2="840" y2="${40 + i * 60}" />`).join('')}
    </g>
    <g stroke="${INK}" stroke-width="1.3">
      <path d="M210 470 q60 -22 120 -4 t120 -18 q50 -8 100 6" opacity="0.8"/>
      <path d="M230 452 q50 -18 100 -3 t100 -14 q40 -6 84 4" opacity="0.55"/>
      <path d="M250 436 q40 -14 80 -2 t80 -10 q32 -5 68 3" opacity="0.35"/>
    </g>
    <g stroke="${INK}" stroke-width="1.4">
      <path d="M420 440 v-230 h150 v230"/>
      <path d="M420 330 h150 M420 220 h150" opacity="0.4"/>
      <path d="M435 440 v-210 M450 440 v-210 M465 440 v-210" opacity="0.28"/>
      <path d="M525 440 v-210 M540 440 v-210 M555 440 v-210" opacity="0.28"/>
      <path d="M600 440 v-300 l60 30 v270" />
    </g>
    <g stroke="${GOLD}" stroke-width="1.7">
      <path d="M300 500 L420 330 M300 500 L495 210 M300 500 L660 140" stroke-dasharray="6 5"/>
      <circle cx="300" cy="500" r="8"/>
      <path d="M282 500 h-14 M300 482 v-14"/>
    </g>
    <g stroke="${MUT}" stroke-width="1">
      ${[[660, 140], [495, 210], [840, 470], [180, 470], [720, 520]].map(([x, y]) =>
        `<path d="M${x - 7} ${y} h14 M${x} ${y - 7} v14"/>`
      ).join('')}
    </g>
    ${txt(640, '132', 'PRISM-01', 'gold')}
    ${txt(60, '560', 'N36°18′ · E59°36′ — MASHHAD', 'mono')}
    ${txt(620, '560', 'FIG. 01 — GEODETIC REFERENCE', 'mono')}`
  )
}
