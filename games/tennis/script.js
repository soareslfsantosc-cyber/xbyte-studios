"use strict";

// ============================================================================
//  CONSTANTS
// ============================================================================
const W = 220, H = 390;

const COLORS = {
  sky: "#3aa0e8", skyHigh: "#62b8ec", skyDawn: "#f07030", skyDusk: "#7030a0",
  skyNight: "#0a0820", skyMidnight: "#060412",
  stadium: "#2a1a0a", railing: "#105506",
  courtA: "#c47a3d", courtB: "#b06a30", courtDark: "#7a4520",
  lines: "#f5f5f5", net: "#dcdcdc", netDark: "#888",
  player: "#e23838", playerAlt: "#8a1010",
  cpu: "#3858d8", cpuAlt: "#1a2a8a",
  skin: "#f4c890", ball: "#fae850", ballEdge: "#c9a418",
  shadow: "#0a0a14", hud: "#000", accent: "#f0a020", splashBg: "#1a0e2e"
};

const CROWD_HATS = ["#e23838","#3858d8","#fae850","#2d7a3e","#1a1a1a","#f0a020","#a040b8","#3a8a5a"];
const CROWD_SKINS = ["#f4c890","#d4a070","#8a6040","#a07050"];

const COURT = {
  nearY: 372, farY: 104,
  nearLeftX: 30, nearRightX: 190,
  farLeftX: 78, farRightX: 142,
  nearLeftXOuter: 8, nearRightXOuter: 212,
  farLeftXOuter: 64, farRightXOuter: 156
};

const PHYS = {
  gravity: 0.08, flightFrames: 60,
  bounceDamp: 0.55, netZ: 8,
  hitZmin: 2, hitZmax: 30, hitRadius: 0.2
};

const STATE = {
  SPLASH: "splash", MENU: "menu", INTRO: "intro", SERVING: "serving",
  RALLYING: "rallying", POINT_END: "pointEnd", MATCH_END: "matchEnd",
  SET_END: "setEnd", DEMO: "demo", REPLAY: "replay"
};

const MUTE_BTN         = { x: 196, y: 370, w: 20, h: 16 };
const SPLASH_SOUND_BTN = { x: 60,  y: 265, w: 100, h: 22 };
const SPLASH_START_BTN = { x: 30,  y: 335, w: 160, h: 32 };

// Difficulty presets — AI personalities (Phase 5 expanded)
const DIFFICULTY = {
  easy:   { label: "ROOKIE",   errorRate: 0.38, speed: 0.010, hitRadius: 0.18, reactionDelay: 22, personality: "rookie"     },
  medium: { label: "DEFENDER", errorRate: 0.16, speed: 0.014, hitRadius: 0.13, reactionDelay: 9,  personality: "defender"   },
  hard:   { label: "AGGRO",    errorRate: 0.09, speed: 0.018, hitRadius: 0.11, reactionDelay: 4,  personality: "aggressive" },
  expert: { label: "PRO",      errorRate: 0.03, speed: 0.022, hitRadius: 0.09, reactionDelay: 1,  personality: "pro"        }
};

// Demo mode idle timeout (frames at 60fps = 8 seconds)
const DEMO_IDLE_FRAMES = 480;

// ============================================================================
//  LANGUAGE SYSTEM — PT-BR padrão / EN secondary
//  Uso: t("key")         → string da lingua atual
//       tDiff(diffKey)   → label de dificuldade traduzido
//       tModeLabel(key)  → label de modo traduzido
//       tModeDesc(key)   → descrição de modo traduzida
// ============================================================================
let _lang = "ptbr"; // ← padrão: português

const LANGS = {
  ptbr: {
    // Dificuldades
    diff: { easy:"INICIANTE", medium:"DEFENSOR", hard:"AGRESSIVO", expert:"PRO" },
    // Modos
    mode:  { casual:"CASUAL",     training:"TREINO"       },
    modeD: { casual:"1 PARTIDA",  training:"MODO TREINO"  },
    // Banners in-game
    bannerToday:   "PARTIDA DE HOJE",
    bannerMatch:   "MATCH POINT",
    bannerAce:     "  ACE!  ",
    bannerVic:     "VITÓRIA!",
    bannerReplay:  "REPLAY",
    bannerLongest: "MAIOR RALLY",
    bannerRecord:  "NOVO RECORDE!",
    // Tela de intro
    player:   "JOGADOR",   player1:  "JOGADOR 1",  player2:  "JOGADOR 2",
    p1:       "J1",        p2:       "J2",          cpu:      "CPU",
    you:      "VOCÊ",      todayMatch:"PARTIDA DE HOJE",
    getReady: "PREPARE-SE!",
    // Demo
    demoMode: "MODO DEMO",  pressAny: "APERTE QUALQUER TECLA",
    idleDemo: "IDLE = MODO DEMO",
    // Saque
    yourServe:"SEU SAQUE",  cpuServe: "SAQUE CPU",
    p1Serve:  "SAQUE J1",   p2Serve:  "SAQUE J2",
    // Ponto / Set
    pointYou: "PONTO SEU",  pointCpu: "PONTO CPU",
    youWin:   "VOCÊ VENCEU", cpuWins:  "CPU VENCEU",
    // Fim de partida
    gameT1:   "FIM",        gameT2:   "DE JOGO",
    p1Wins:   "J1 VENCEU!", p2Wins:   "J2 VENCEU!",
    youWin2:  "VOCÊ GANHOU!", cpuWins2:"CPU GANHOU",
    excellent:"QUE JOGO!",  tryAgain: "TENTE DE NOVO!",
    statRally:"RALLY:",     statPoints:"PONTOS:",
    statAcP1: "ACES: J1=", statBest:  "MELHOR:",
    statW:    "V:",         statL:     "D:",
    statCpu:  "CPU=",       sets:      "SETS ",
    pressStart:"APERTE INICIAR",
    // Splash
    subtitle: "TÊNIS 8-BIT",
    p2off:    "  2P LOCAL OFF  ",   p2on: "★ 2P LOCAL ATIVO ★",
    cpuLocked:"CPU: FÁCIL (FIXO)", cpuLabel:"CPU: ",
    howTo:    "COMO REBATER",
    p1ctrl:   "J1: DESLIZE / ← ↑ →",  p2ctrl: "J2: A  W  D",
    soundOn:  "SOM ON",    soundOff: "SOM OFF",
    start:    "INICIAR",   langBtn:  "EN",
    // HUD labels
    hudYou:   "VOCÊ",      hudCpu:   "CPU",
    hudP1:    "J1",        hudP2:    "J2",
  },
  en: {
    diff: { easy:"ROOKIE", medium:"DEFENDER", hard:"AGGRO", expert:"PRO" },
    mode:  { casual:"CASUAL",     training:"TRAINING"     },
    modeD: { casual:"1 GAME MATCH", training:"PRACTICE MODE" },
    bannerToday:   "TODAY'S MATCH",
    bannerMatch:   "MATCH POINT",
    bannerAce:     "  ACE!  ",
    bannerVic:     "VICTORY!",
    bannerReplay:  "REPLAY",
    bannerLongest: "LONGEST RALLY",
    bannerRecord:  "NEW RECORD!",
    player:   "PLAYER",    player1:  "PLAYER 1",   player2:  "PLAYER 2",
    p1:       "P1",        p2:       "P2",          cpu:      "CPU",
    you:      "YOU",       todayMatch:"TODAY'S MATCH",
    getReady: "GET READY!",
    demoMode: "DEMO MODE", pressAny: "PRESS ANY KEY TO START",
    idleDemo: "IDLE = DEMO MODE",
    yourServe:"YOUR SERVE", cpuServe: "CPU SERVE",
    p1Serve:  "P1 SERVE",  p2Serve:  "P2 SERVE",
    pointYou: "POINT YOU", pointCpu: "POINT CPU",
    youWin:   "YOU WIN",   cpuWins:  "CPU WINS",
    gameT1:   "GAME",      gameT2:   "OVER",
    p1Wins:   "P1 WINS!",  p2Wins:   "P2 WINS!",
    youWin2:  "YOU WIN!",  cpuWins2: "CPU WINS",
    excellent:"EXCELLENT GAME!", tryAgain:"TRY AGAIN!",
    statRally:"RALLY:",    statPoints:"POINTS:",
    statAcP1: "ACES: P1=",statBest:  "BEST:",
    statW:    "W:",        statL:     "L:",
    statCpu:  "CPU=",      sets:      "SETS ",
    pressStart:"PRESS START",
    subtitle: "8-BIT TENNIS",
    p2off:    "  LOCAL 2P OFF  ", p2on: "★ LOCAL 2P ON  ★",
    cpuLocked:"CPU: EASY (LOCKED)", cpuLabel:"CPU: ",
    howTo:    "HOW TO HIT",
    p1ctrl:   "P1: SWIPE / ← ↑ →", p2ctrl: "P2: A  W  D",
    soundOn:  "SOUND ON",  soundOff: "SOUND OFF",
    start:    "START",     langBtn:  "PT",
    hudYou:   "YOU",       hudCpu:   "CPU",
    hudP1:    "P1",        hudP2:    "P2",
  }
};

function t(k) {
  const L = LANGS[_lang] || LANGS.ptbr;
  return L[k] !== undefined ? L[k] : (LANGS.en[k] !== undefined ? LANGS.en[k] : k);
}
function tDiff(key)      { const L = LANGS[_lang] || LANGS.ptbr; return (L.diff && L.diff[key]) || (LANGS.en.diff[key]) || key; }
function tModeLabel(key) { const L = LANGS[_lang] || LANGS.ptbr; return (L.mode && L.mode[key]) || (LANGS.en.mode[key]) || key; }
function tModeDesc(key)  { const L = LANGS[_lang] || LANGS.ptbr; return (L.modeD && L.modeD[key]) || (LANGS.en.modeD[key]) || key; }

const LANG_BTN = { x: 4, y: 372, w: 28, h: 14 };  // bottom-left, symmetric with mute btn



// Player 2 key bindings
const P2_KEYS = { left: "a", right: "d", up: "w" };

// Game modes — Phase 5
const GAME_MODE = {
  casual:   { label: "CASUAL",   sets: 1, description: "1 GAME MATCH"  },
  training: { label: "TRAINING", sets: 1, description: "PRACTICE MODE" },
};

// ============================================================================
//  STORAGE — Phase 4 / JSON persistence
// ============================================================================
const Store = {
  KEY: "matchpoint_v1",
  _data: null,

  _defaults() {
    return {
      records: { wins: 0, losses: 0, longestRally: 0, totalPoints: 0 },
      history: [],        // last 10 matches
      settings: { difficulty: "medium", mode: "casual", muted: false, lang: "ptbr" },
      highScore: 0
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      this._data = raw ? Object.assign(this._defaults(), JSON.parse(raw)) : this._defaults();
    } catch(e) { this._data = this._defaults(); }
    return this._data;
  },

  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this._data)); } catch(e) {}
  },

  get(key) { return this._data ? this._data[key] : this._defaults()[key]; },

  set(key, val) {
    if (!this._data) this.load();
    this._data[key] = val;
    this.save();
  },

  addMatchResult(playerSets, cpuSets, rally, points) {
    if (!this._data) this.load();
    const won = playerSets > cpuSets;
    if (won) this._data.records.wins++;
    else this._data.records.losses++;
    this._data.records.totalPoints += points;
    if (rally > this._data.records.longestRally) this._data.records.longestRally = rally;
    this._data.history.unshift({ won, playerSets, cpuSets, ts: Date.now() });
    if (this._data.history.length > 10) this._data.history.pop();
    this.save();
  }
};

// ============================================================================
//  PIXEL SPRITES
// ============================================================================
const ARROW = {
  NW: ["####...","##.....","#.#....","#..#...","....#..",".....#.","......#"],
  N:  ["...#...","..###..",".#####.","#..#..#","...#...","...#...","...#..."],
  NE: ["...####",".....##","....#.#","...#..#","..#....",".#.....","#......"],
  W:  ["...#...","..##...",".######","#######",".######","..##...","...#..."],
  E:  ["...#...","...##..","######.","#######","######.","...##..","...#..."]
};

const CLOUD = {
  big:   ["....######....","..##########...",".############.","##############",".############.","..##########..","....######...."],
  small: ["...####...",".########.","##########",".########.","..######.."],
  tiny:  ["..####..",".######.","########",".######."]
};

// Stars for night sky
const STARS = (() => {
  const s = [];
  const rng = (seed) => { let x = Math.sin(seed) * 43758.5453; return x - Math.floor(x); };
  for (let i = 0; i < 60; i++) {
    s.push({ x: Math.floor(rng(i * 3.1) * W), y: Math.floor(rng(i * 7.7) * 50), b: rng(i * 13.3) });
  }
  return s;
})();

function drawSprite(ctx, sprite, x, y, color) {
  ctx.fillStyle = color;
  for (let r = 0; r < sprite.length; r++) {
    const row = sprite[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] === "#") ctx.fillRect(x + c, y + r, 1, 1);
    }
  }
}

// ============================================================================
//  PROJECTION (unchanged from original — do not touch)
// ============================================================================
const PERSPECTIVE_EASE = 0.82;

function projectGround(x, y) {
  const t = Math.pow(y, PERSPECTIVE_EASE);
  const lx = COURT.nearLeftX + (COURT.farLeftX - COURT.nearLeftX) * t;
  const rx = COURT.nearRightX + (COURT.farRightX - COURT.nearRightX) * t;
  const sx = lx + (rx - lx) * (x + 1) * 0.5;
  const sy = COURT.nearY + (COURT.farY - COURT.nearY) * t;
  return { sx, sy };
}
function projectScale(y) { return 1 - 0.55 * Math.pow(y, PERSPECTIVE_EASE); }
function project(x, y, z) {
  const g = projectGround(x, y);
  const s = projectScale(y);
  return { sx: g.sx, sy: g.sy - z * s, scale: s };
}

// ============================================================================
//  DAY/NIGHT CYCLE — Phase 3
// ============================================================================
const DayNight = {
  // time: 0=dawn, 0.25=day, 0.5=dusk, 0.75=night, 1=dawn
  // One full cycle = 7200 frames (~2 min at 60fps)
  CYCLE: 7200,

  getPhase(frame) { return (frame % this.CYCLE) / this.CYCLE; },

  // Returns {skyTop, skyBot, ambientAlpha, isNight, isDusk, isDawn}
  getColors(frame) {
    const t = this.getPhase(frame);
    // phase ranges: dawn 0-0.12, day 0.12-0.42, dusk 0.42-0.58, night 0.58-0.88, dawn2 0.88-1
    if (t < 0.12 || t > 0.88) {
      const p = t < 0.12 ? t / 0.12 : (1 - t) / 0.12;
      return { skyTop: _lerpc("#0a0820","#f07030",p), skyBot: _lerpc("#060412","#f0a040",p), isNight: false, isDawn: true, ambientAlpha: 0.18 * (1-p) };
    } else if (t < 0.42) {
      const p = Math.min(1, (t - 0.12) / 0.1);
      return { skyTop: _lerpc("#f07030","#62b8ec",p), skyBot: _lerpc("#f0a040","#3aa0e8",p), isNight: false, isDawn: false, ambientAlpha: 0 };
    } else if (t < 0.58) {
      const p = (t - 0.42) / 0.16;
      return { skyTop: _lerpc("#62b8ec","#7030a0",p), skyBot: _lerpc("#3aa0e8","#4010a0",p), isNight: p > 0.7, isDawn: false, ambientAlpha: p * 0.35 };
    } else {
      const p = Math.min(1, (t - 0.58) / 0.08);
      return { skyTop: _lerpc("#7030a0","#0a0820",p), skyBot: _lerpc("#4010a0","#060412",p), isNight: true, isDawn: false, ambientAlpha: p * 0.55 };
    }
  }
};

function _lerpc(a, b, t) {
  const ah = parseInt(a.slice(1), 16), bh = parseInt(b.slice(1), 16);
  const ar = (ah>>16)&0xff, ag = (ah>>8)&0xff, ab = ah&0xff;
  const br = (bh>>16)&0xff, bg = (bh>>8)&0xff, bb = bh&0xff;
  const r = Math.round(ar + (br-ar)*t), g = Math.round(ag + (bg-ag)*t), bl2 = Math.round(ab + (bb-ab)*t);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${bl2.toString(16).padStart(2,'0')}`;
}

// ============================================================================
//  PARTICLE SYSTEM — Phase 2
// ============================================================================
class ParticleSystem {
  constructor() { this.pool = []; }

  emit(x, y, opts = {}) {
    const count = opts.count || 6;
    for (let i = 0; i < count; i++) {
      const angle = (opts.angle || 0) + (Math.random() - 0.5) * (opts.spread || Math.PI * 2);
      const speed = (opts.speed || 1.5) * (0.5 + Math.random());
      this.pool.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, decay: opts.decay || 0.04,
        r: opts.r || 2,
        color: opts.color || "#fae850",
        gravity: opts.gravity || 0
      });
    }
  }

  update() {
    for (let i = this.pool.length - 1; i >= 0; i--) {
      const p = this.pool[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.92; p.vy *= 0.92;
      p.life -= p.decay;
      if (p.life <= 0) this.pool.splice(i, 1);
    }
  }

  draw(ctx) {
    for (const p of this.pool) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x - p.r/2), Math.round(p.y - p.r/2), p.r, p.r);
    }
    ctx.globalAlpha = 1;
  }
}

// ============================================================================
//  CAMERA SHAKE — Phase 2
// ============================================================================
class CameraShake {
  constructor() { this.mag = 0; this.decay = 0.85; }
  trigger(mag) { this.mag = Math.max(this.mag, mag); }
  update() { this.mag *= this.decay; if (this.mag < 0.1) this.mag = 0; }
  apply(ctx) {
    if (!this.mag) return;
    const dx = (Math.random() - 0.5) * this.mag;
    const dy = (Math.random() - 0.5) * this.mag;
    ctx.translate(dx, dy);
  }
}

// ============================================================================
//  BALL TRAIL — Phase 2
// ============================================================================
class BallTrail {
  constructor() { this.history = []; this.MAX = 8; }
  push(sx, sy, scale) {
    this.history.push({ sx, sy, scale });
    if (this.history.length > this.MAX) this.history.shift();
  }
  draw(ctx) {
    for (let i = 0; i < this.history.length; i++) {
      const h = this.history[i];
      const alpha = (i / this.history.length) * 0.35;
      const r = Math.max(1, Math.round(3 * h.scale));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = COLORS.ball;
      ctx.beginPath();
      ctx.arc(h.sx, h.sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  reset() { this.history = []; }
}

// ============================================================================
//  HIT STOP — Phase 1 (1-3 frame freeze on contact)
// ============================================================================
class HitStop {
  constructor() { this.frames = 0; }
  trigger(f) { this.frames = Math.max(this.frames, f || 2); }
  active()   { return this.frames > 0; }
  tick()     { if (this.frames > 0) this.frames--; }
}

// ============================================================================
//  REPLAY BUFFER — Phase 4 (circular snapshot ring, ~5 sec @ 60fps)
// ============================================================================
class ReplayBuffer {
  constructor(capacity) {
    this.cap  = capacity || 300;
    this.ring = new Array(this.cap);
    this.head = 0;
    this.size = 0;
  }

  push(snap) {
    this.ring[this.head] = snap;
    this.head = (this.head + 1) % this.cap;
    if (this.size < this.cap) this.size++;
  }

  // Returns ordered snapshot array (oldest first)
  slice(frames) {
    const n = Math.min(frames, this.size);
    const out = [];
    for (let i = n - 1; i >= 0; i--) {
      const idx = (this.head - 1 - i + this.cap) % this.cap;
      if (this.ring[idx]) out.push(this.ring[idx]);
    }
    return out;
  }

  reset() { this.head = 0; this.size = 0; }
}

// ============================================================================
//  CROWD MOOD — Phase 2 (dynamic audience intelligence)
// ============================================================================
const CrowdMood = {
  BASE:       0,
  RALLY:      1,
  DECISIVE:   2,
  MATCHPOINT: 3,
  WIN:        4,

  _level: 0,
  _peak:  0,
  _timer: 0,

  set(level, durationFrames) {
    if (level >= this._level) {
      this._level = level;
      this._peak  = level;
      this._timer = durationFrames || 180;
    }
  },

  tick() {
    if (this._timer > 0) {
      this._timer--;
      if (this._timer === 0 && this._level > this.BASE) {
        this._level = Math.max(this.BASE, this._level - 1);
        if (this._level > this.BASE) this._timer = 120;
      }
    }
  },

  get level() { return this._level; },

  // Excitement 0..1 for court.excite()
  excitement() {
    return [0, 0.3, 0.6, 0.85, 1.0][this._level] || 0;
  }
};

// ============================================================================
//  BANNER ANIMATOR — Phase 3 (retro event banners: ACE, MATCH POINT, etc.)
// ============================================================================
class BannerAnim {
  constructor() { this._queue = []; this._cur = null; this._t = 0; }

  show(text, color, durationFrames) {
    this._queue.push({ text, color: color || COLORS.accent, dur: durationFrames || 90 });
    if (!this._cur) this._next();
  }

  _next() {
    this._cur = this._queue.shift() || null;
    this._t   = 0;
  }

  tick() {
    if (!this._cur) return;
    this._t++;
    if (this._t >= this._cur.dur) this._next();
  }

  draw(ctx) {
    if (!this._cur) return;
    const t   = this._t;
    const dur = this._cur.dur;
    // Slide in from top, hold, slide out
    const inF  = 8, outF = 8;
    let offsetY = 0;
    if (t < inF)        offsetY = -(1 - t / inF) * 20;
    else if (t > dur - outF) offsetY = -((t - (dur - outF)) / outF) * 20;

    const by = 38 + offsetY;
    const alpha = t < inF ? t / inF : (t > dur - outF ? (dur - t) / outF : 1);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(0,0,0,0.82)";
    ctx.fillRect(0, by, W, 14);
    ctx.fillStyle = this._cur.color;
    ctx.fillRect(0, by, W, 1);
    ctx.fillRect(0, by + 13, W, 1);

    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = "center";

    // Pixel shadow
    ctx.fillStyle = "#000";
    ctx.fillText(this._cur.text, W / 2 + 1, by + 10);
    ctx.fillStyle = this._cur.color;
    ctx.fillText(this._cur.text, W / 2, by + 9);

    ctx.globalAlpha = 1;
  }

  active() { return !!this._cur || this._queue.length > 0; }
}

// ============================================================================
//  SCREEN TRANSITION — Phase 3 (fade in/out between states)
// ============================================================================
class ScreenTransition {
  constructor() { this.alpha = 0; this._dir = 0; this._cb = null; this._speed = 0.06; }

  fadeOut(cb, speed) {
    this._dir = 1; this._cb = cb; this._speed = speed || 0.07;
  }
  fadeIn(speed) {
    this.alpha = 1; this._dir = -1; this._cb = null; this._speed = speed || 0.06;
  }

  tick() {
    if (this._dir === 0) return;
    this.alpha = Math.max(0, Math.min(1, this.alpha + this._dir * this._speed));
    if (this._dir === 1 && this.alpha >= 1) {
      this._dir = 0;
      if (this._cb) { this._cb(); this._cb = null; }
    }
    if (this._dir === -1 && this.alpha <= 0) { this._dir = 0; }
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  busy() { return this._dir !== 0 || this.alpha > 0; }
}


class FlashEffect {
  constructor() { this.alpha = 0; }
  trigger(a) { this.alpha = a || 0.35; }
  update() { this.alpha *= 0.75; if (this.alpha < 0.01) this.alpha = 0; }
  draw(ctx) {
    if (!this.alpha) return;
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
}

// ============================================================================
//  MATCH STATS — Phase 4
// ============================================================================
class MatchStats {
  constructor() { this.reset(); }
  reset() {
    this.rallyLength = 0;
    this.maxRally = 0;
    this.playerAces = 0;
    this.cpuAces = 0;
    this.playerWins = 0;
    this.cpuWins = 0;
    this.totalPoints = 0;
    this.netHits = 0;
  }
  onHit() { this.rallyLength++; }
  onPointEnd(winner, wasNet) {
    if (this.rallyLength > this.maxRally) this.maxRally = this.rallyLength;
    if (wasNet) this.netHits++;
    if (winner === 0) this.playerWins++; else this.cpuWins++;
    this.totalPoints++;
    this.rallyLength = 0;
  }
  onAce(idx) { if (idx === 0) this.playerAces++; else this.cpuAces++; }
}

// ============================================================================
//  SCOREBOARD — Phase 4 (extended: sets support)
// ============================================================================
class Scoreboard {
  constructor(setsToWin) {
    this.setsToWin = setsToWin || 1;
    this.reset();
  }

  reset() {
    this.points  = [0, 0];
    this.games   = [0, 0];   // current set
    this.sets    = [0, 0];   // sets won
    this.serverIdx   = 0;
    this.matchOver   = false;
    this.setOver     = false;
    this.winner      = null;
    this.setWinner   = null;
  }

  scorePoint(idx) {
    const opp = 1 - idx;
    const me = this.points[idx], you = this.points[opp];
    this.setOver = false;
    if (me >= 3 && you >= 3) {
      if (me === you)      this.points[idx] = me + 1;
      else if (me > you)   this._winGame(idx);
      else                 this.points[opp] = you - 1;
    } else {
      if (me === 3) this._winGame(idx);
      else          this.points[idx] = me + 1;
    }
  }

  _winGame(idx) {
    this.games[idx]++;
    this.points = [0, 0];
    this.serverIdx = 1 - this.serverIdx;

    // Check set win (first to 6 games, must lead by 2)
    const g0 = this.games[0], g1 = this.games[1];
    const leader = g0 > g1 ? 0 : 1;
    const ahead = Math.abs(g0 - g1);
    if (Math.max(g0, g1) >= 6 && ahead >= 2) {
      this.sets[leader]++;
      this.games = [0, 0];
      this.setOver = true;
      this.setWinner = leader;

      if (this.sets[leader] >= this.setsToWin) {
        this.matchOver = true;
        this.winner = leader;
      }
    }
  }

  pointDisplay() {
    const map = ["00", "15", "30", "40"];
    const a = this.points[0], b = this.points[1];
    if (a >= 3 && b >= 3) {
      if (a === b) return ["40","40"];
      if (a > b)   return ["AD","--"];
      return ["--","AD"];
    }
    return [map[a], map[b]];
  }

  isMatchPoint(forIdx) {
    const [a, b] = this.pointDisplay();
    if (forIdx === 0) return (a === "AD" || a === "40") && this.sets[0] === this.setsToWin - 1;
    return (b === "AD" || b === "40") && this.sets[1] === this.setsToWin - 1;
  }
}

// ============================================================================
//  SFX — Phase 8 (extended)
// ============================================================================
class SFX {
  constructor() { this.ctx = null; this.muted = true; }

  ensureCtx() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { this.muted = true; return; }
    try { this.ctx = new AC(); } catch(e) { this.muted = true; }
  }

  _beep(freq, duration, type, vol = 0.18) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.005);
    gain.gain.linearRampToValueAtTime(0, t0 + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  _seq(notes, gap = 0.08) {
    if (!this.ctx || this.muted) return;
    notes.forEach((n, i) => {
      setTimeout(() => this._beep(n.f, n.d, n.t || "square", n.v || 0.18), i * gap * 1000);
    });
  }

  hit()    { this._beep(220, 0.05, "square", 0.22); }
  bounce() { this._beep(720, 0.03, "square", 0.1); }
  net()    { this._beep(90, 0.12, "sine", 0.25); }
  serve()  { this._beep(440, 0.04, "square", 0.14); }
  menuNav(){ this._beep(330, 0.04, "square", 0.1); }
  menuSel(){ this._beep(660, 0.07, "square", 0.14); }

  point() {
    this._seq([{f:523,d:0.08},{f:784,d:0.12}], 0.08);
  }
  lost() {
    this._seq([{f:392,d:0.08},{f:262,d:0.14}], 0.08);
  }
  win() {
    this._seq([{f:523,d:0.1},{f:659,d:0.1},{f:784,d:0.1},{f:1047,d:0.22}], 0.12);
  }
  defeat() {
    this._seq([{f:523,d:0.1},{f:466,d:0.1},{f:392,d:0.1},{f:311,d:0.28}], 0.14);
  }
  matchPoint() {
    this._seq([{f:784,d:0.06},{f:987,d:0.06},{f:1175,d:0.14}], 0.07);
  }
  setWon() {
    this._seq([{f:523,d:0.08},{f:659,d:0.08},{f:784,d:0.08},{f:880,d:0.18}], 0.1);
  }

  cheer() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t0 = ctx.currentTime, dur = 1.6;
    const bufSize = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource(); noise.buffer = buf;
    const nf = ctx.createBiquadFilter(); nf.type = "bandpass"; nf.Q.value = 4.2;
    nf.frequency.setValueAtTime(990, t0); nf.frequency.linearRampToValueAtTime(920, t0 + dur);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0, t0);
    ng.gain.linearRampToValueAtTime(0.19, t0 + 0.08);
    ng.gain.linearRampToValueAtTime(0.076, t0 + dur * 0.5);
    ng.gain.linearRampToValueAtTime(0, t0 + dur);
    noise.connect(nf).connect(ng).connect(ctx.destination);
    noise.start(t0); noise.stop(t0 + dur + 0.05);

    const vb = ctx.createGain(); vb.gain.value = 1;
    const tf = ctx.createBiquadFilter(); tf.type = "bandpass"; tf.Q.value = 1;
    tf.frequency.setValueAtTime(3960, t0); tf.frequency.linearRampToValueAtTime(1540, t0 + dur);
    vb.connect(tf).connect(ctx.destination);
    const voices = 6;
    for (let v = 0; v < voices; v++) {
      const osc = ctx.createOscillator(); osc.type = "sine";
      const ts = t0 + v * 0.1; let t = ts, first = true;
      while (t < t0 + dur - 0.01) {
        const f = 249 + Math.random() * 65;
        osc.frequency.setValueAtTime(f, first ? ts : t); first = false;
        t += 0.03 + Math.random() * 0.04;
      }
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ts);
      g.gain.linearRampToValueAtTime(0.07 / voices, ts + 0.308);
      g.gain.linearRampToValueAtTime(0.07 / voices * 0.7, ts + dur * 0.4);
      g.gain.linearRampToValueAtTime(0, t0 + dur);
      osc.connect(g).connect(vb); osc.start(ts); osc.stop(t0 + dur + 0.05);
    }
  }

  // Big crowd roar for match/set win
  roar() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx, t0 = ctx.currentTime, dur = 3.0;
    const bufSize = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const flt = ctx.createBiquadFilter(); flt.type = "bandpass"; flt.Q.value = 2;
    flt.frequency.setValueAtTime(800, t0); flt.frequency.linearRampToValueAtTime(600, t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.32, t0 + 0.15);
    g.gain.linearRampToValueAtTime(0.18, t0 + 1.2);
    g.gain.linearRampToValueAtTime(0, t0 + dur);
    src.connect(flt).connect(g).connect(ctx.destination);
    src.start(t0); src.stop(t0 + dur + 0.1);
  }
}

// ============================================================================
//  MUSIC — unchanged from original
// ============================================================================
class Music {
  constructor(sfx) {
    this.sfx = sfx;
    this.measures = [
      { lead:[587.33,783.99,987.77,783.99,880.0,987.77,880.0,783.99], bassT:196.0, bassF:293.66 },
      { lead:[659.25,783.99,1046.5,783.99,659.25,783.99,880.0,783.99], bassT:130.81, bassF:196.0 },
      { lead:[587.33,739.99,880.0,739.99,587.33,880.0,739.99,880.0], bassT:146.83, bassF:220.0 },
      { lead:[783.99,987.77,1174.66,987.77,783.99,587.33,783.99,987.77], bassT:196.0, bassF:293.66 },
      { lead:[587.33,783.99,987.77,783.99,880.0,987.77,880.0,783.99], bassT:196.0, bassF:293.66 },
      { lead:[659.25,783.99,1046.5,783.99,659.25,783.99,880.0,783.99], bassT:130.81, bassF:196.0 },
      { lead:[587.33,739.99,880.0,739.99,587.33,880.0,739.99,880.0], bassT:146.83, bassF:220.0 },
      { lead:[783.99,987.77,1174.66,1567.98,1174.66,987.77,1567.98,1174.66], bassT:196.0, bassF:293.66 }
    ];
    this.tempoMs = 130; this.step = 0; this.timer = null;
    this.leadOsc = null; this.bassOsc = null;
    this.leadGain = null; this.bassGain = null;
  }

  start() {
    if (this.timer || this.sfx.muted || !this.sfx.ctx) return;
    const ctx = this.sfx.ctx;
    this.leadGain = ctx.createGain(); this.bassGain = ctx.createGain();
    this.leadGain.connect(ctx.destination); this.bassGain.connect(ctx.destination);
    this.leadGain.gain.value = 0; this.bassGain.gain.value = 0;
    this.leadOsc = ctx.createOscillator(); this.bassOsc = ctx.createOscillator();
    this.leadOsc.type = "sawtooth"; this.bassOsc.type = "square";
    this.leadOsc.connect(this.leadGain); this.bassOsc.connect(this.bassGain);
    const now = ctx.currentTime;
    this.leadOsc.frequency.setValueAtTime(this.measures[0].lead[0], now);
    this.bassOsc.frequency.setValueAtTime(this.measures[0].bassT, now);
    this.leadOsc.start(); this.bassOsc.start();
    this.leadGain.gain.setValueAtTime(0, now);
    this.leadGain.gain.linearRampToValueAtTime(0.05, now + 0.05);
    this.step = 0;
    this.timer = setInterval(() => this._tick(), this.tempoMs);
  }

  _tick() {
    if (!this.sfx.ctx || !this.leadOsc) return;
    const now = this.sfx.ctx.currentTime;
    const cs = this.step % 64, mi = Math.floor(cs / 8), ni = cs % 8;
    const m = this.measures[mi];
    this.leadOsc.frequency.setTargetAtTime(m.lead[ni], now, 0.01);
    const bf = ni % 2 === 0 ? m.bassT : m.bassF;
    this.bassOsc.frequency.setValueAtTime(bf, now);
    this.bassGain.gain.cancelScheduledValues(now);
    this.bassGain.gain.setValueAtTime(this.bassGain.gain.value, now);
    this.bassGain.gain.linearRampToValueAtTime(0.0001, now + 0.005);
    this.bassGain.gain.linearRampToValueAtTime(0.1, now + 0.012);
    this.bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    this.step++;
  }

  stop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.sfx.ctx && this.leadOsc) {
      const now = this.sfx.ctx.currentTime;
      try {
        this.leadGain.gain.cancelScheduledValues(now);
        this.leadGain.gain.linearRampToValueAtTime(0, now + 0.05);
        this.bassGain.gain.cancelScheduledValues(now);
        this.bassGain.gain.linearRampToValueAtTime(0, now + 0.05);
        this.leadOsc.stop(now + 0.08);
        this.bassOsc.stop(now + 0.08);
      } catch(e) {}
    }
    this.leadOsc = null; this.bassOsc = null;
    this.leadGain = null; this.bassGain = null;
  }

  isPlaying() { return this.timer !== null; }
}

// ============================================================================
//  COURT — Phase 3 (day/night, clouds in-play, enhanced crowd reactions)
// ============================================================================
class Court {
  constructor() {
    this.crowd = this._buildCrowd();
    this.cloudOffset = 0;
    this.crowdExcitement = 0;  // 0..1, affects flash frequency
    this.rallyMeter = 0;       // grows with rally length
  }

  _buildCrowd() {
    const heads = [];
    const startY = 52, rowSpacing = 9, colSpacing = 4, rows = 5;
    const cols = Math.ceil(W / colSpacing) + 2;
    const FLASH_PERIOD = 3000;
    for (let row = 0; row < rows; row++) {
      const y = startY + row * rowSpacing;
      const offsetX = row % 2 === 0 ? 0 : 2;
      for (let col = 0; col < cols; col++) {
        const x = col * colSpacing + offsetX - 1;
        if (x < -1 || x > W) continue;
        const seed = Math.abs((col * 31 + row * 53 + 11) | 0);
        heads.push({
          x, y,
          hat: CROWD_HATS[seed % CROWD_HATS.length],
          skin: CROWD_SKINS[(seed >> 2) % CROWD_SKINS.length],
          flashSeed: Math.floor(Math.random() * FLASH_PERIOD),
          armUp: false, armTimer: 0
        });
      }
    }
    return heads;
  }

  excite(level) {
    this.crowdExcitement = Math.min(1, level);
    // Randomly trigger crowd arm waves
    const fraction = Math.floor(level * 40);
    for (let i = 0; i < fraction; i++) {
      const h = this.crowd[Math.floor(Math.random() * this.crowd.length)];
      if (h) { h.armUp = true; h.armTimer = 30 + Math.floor(Math.random() * 40); }
    }
  }

  update() {
    for (const h of this.crowd) {
      if (h.armTimer > 0) { h.armTimer--; if (h.armTimer === 0) h.armUp = false; }
    }
  }

  draw(ctx, frame) {
    // -- Sky with day/night --
    const dn = DayNight.getColors(frame);
    const grad = ctx.createLinearGradient(0, 0, 0, 48);
    grad.addColorStop(0, dn.skyTop);
    grad.addColorStop(1, dn.skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 48);

    // Stars at night
    if (dn.isNight) {
      for (const s of STARS) {
        const blink = Math.sin(frame * 0.04 + s.b * 10) * 0.5 + 0.5;
        ctx.globalAlpha = 0.4 + blink * 0.6;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(s.x, s.y, 1, 1);
      }
      ctx.globalAlpha = 1;
    }

    // Animated clouds (move with frame)
    this.cloudOffset = (frame * 0.08) % (W + 60);
    this._drawClouds(ctx, frame, dn);

    ctx.fillStyle = COLORS.stadium;
    ctx.fillRect(0, 48, W, 4);

    this.drawCrowdLayer(ctx, frame);

    ctx.fillStyle = COLORS.railing;
    ctx.fillRect(0, 94, W, 6);
    ctx.fillStyle = "#241410";
    ctx.fillRect(0, 100, W, 4);

    // Night ambient overlay on court
    if (dn.ambientAlpha > 0) {
      ctx.fillStyle = `rgba(5,2,20,${dn.ambientAlpha})`;
      ctx.fillRect(0, 104, W, H - 104);
    }

    ctx.fillStyle = COLORS.courtDark;
    ctx.fillRect(0, 104, W, H - 104);

    ctx.fillStyle = COLORS.courtA;
    ctx.beginPath();
    ctx.moveTo(COURT.nearLeftXOuter, COURT.nearY);
    ctx.lineTo(COURT.nearRightXOuter, COURT.nearY);
    ctx.lineTo(COURT.farRightXOuter, COURT.farY);
    ctx.lineTo(COURT.farLeftXOuter, COURT.farY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = COLORS.courtB;
    this._fillTrapZone(ctx, 0.25, 0.5);
    this._fillTrapZone(ctx, 0.5, 0.75);

    ctx.strokeStyle = COLORS.lines;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(COURT.nearLeftXOuter, COURT.nearY);
    ctx.lineTo(COURT.nearRightXOuter, COURT.nearY);
    ctx.lineTo(COURT.farRightXOuter, COURT.farY);
    ctx.lineTo(COURT.farLeftXOuter, COURT.farY);
    ctx.closePath();
    ctx.stroke();

    this._line(ctx, -1, 0, -1, 1);
    this._line(ctx, 1, 0, 1, 1);
    this._line(ctx, -1, 0.25, 1, 0.25);
    this._line(ctx, -1, 0.75, 1, 0.75);
    this._line(ctx, 0, 0.25, 0, 0.75);
    this._line(ctx, -0.05, 1, 0.05, 1);
    this._line(ctx, -0.05, 0, 0.05, 0);

    this.drawNet(ctx);
  }

  _drawClouds(ctx, frame, dn) {
    const cloudColor = dn.isNight ? "#1a1428" : (dn.isDawn ? "#f8c090" : "#ffffff");
    const cloudFar   = dn.isNight ? "#0e0c1a" : (dn.isDawn ? "#d09060" : "#e8eef5");
    const far  = [
      { sprite: CLOUD.tiny,  baseX: 10,  y: 4 },
      { sprite: CLOUD.small, baseX: 90,  y: 12 },
      { sprite: CLOUD.tiny,  baseX: 160, y: 2 },
      { sprite: CLOUD.small, baseX: 220, y: 8 }
    ];
    const near = [
      { sprite: CLOUD.big,   baseX: 20,  y: 22 },
      { sprite: CLOUD.small, baseX: 130, y: 32 },
      { sprite: CLOUD.big,   baseX: 220, y: 18 }
    ];
    const fo = (frame * 0.06) % (W + 40);
    const no = (frame * 0.18) % (W + 40);
    far.forEach(c  => { const ww = c.sprite[0].length; let x = c.baseX - fo;  while(x < -ww) x += W+40; drawSprite(ctx, c.sprite, Math.round(x), c.y, cloudFar); });
    near.forEach(c => { const ww = c.sprite[0].length; let x = c.baseX - no;  while(x < -ww) x += W+40; drawSprite(ctx, c.sprite, Math.round(x), c.y, cloudColor); });
  }

  drawCrowdLayer(ctx, frame, dy = 0) {
    ctx.fillStyle = "#0e0805";
    ctx.fillRect(0, 48 + dy, W, 50);
    const flashRate = Math.max(80, Math.round(3000 - this.crowdExcitement * 2700));

    for (let i = 0; i < this.crowd.length; i++) {
      const h = this.crowd[i];
      ctx.fillStyle = h.hat;
      ctx.fillRect(h.x, h.y + 2 + dy, 2, 3);
      ctx.fillStyle = h.skin;
      ctx.fillRect(h.x, h.y + dy, 2, 2);

      // Arm wave
      if (h.armUp) {
        ctx.fillStyle = h.skin;
        ctx.fillRect(h.x - 1, h.y - 2 + dy, 1, 2);
        ctx.fillRect(h.x + 2, h.y - 2 + dy, 1, 2);
      }

      if ((frame + h.flashSeed) % flashRate < 3) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(h.x - 1, h.y - 1 + dy, 4, 5);
      }
    }
  }

  _fillTrapZone(ctx, y1, y2) {
    const a = projectGround(-1, y1), b = projectGround(1, y1);
    const c = projectGround(1, y2), d = projectGround(-1, y2);
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy);
    ctx.lineTo(c.sx, c.sy); ctx.lineTo(d.sx, d.sy);
    ctx.closePath(); ctx.fill();
  }

  _line(ctx, x1, y1, x2, y2) {
    const a = projectGround(x1, y1), b = projectGround(x2, y2);
    ctx.beginPath();
    ctx.moveTo(a.sx + 0.5, a.sy + 0.5);
    ctx.lineTo(b.sx + 0.5, b.sy + 0.5);
    ctx.stroke();
  }

  drawNet(ctx) {
    const left = projectGround(-1.55, 0.5), right = projectGround(1.55, 0.5);
    const netH = 18;
    ctx.fillStyle = COLORS.netDark;
    ctx.fillRect(left.sx, left.sy - netH, right.sx - left.sx, netH);
    ctx.fillStyle = COLORS.net;
    for (let y = 0; y < netH; y += 2)
      ctx.fillRect(left.sx, left.sy - netH + y, right.sx - left.sx, 1);
    ctx.fillStyle = "#fff";
    ctx.fillRect(left.sx, left.sy - netH, right.sx - left.sx, 2);
    ctx.fillStyle = "#222";
    ctx.fillRect(left.sx - 2, left.sy - netH - 2, 2, netH + 4);
    ctx.fillRect(right.sx, right.sy - netH - 2, 2, netH + 4);
  }
}

// ============================================================================
//  BALL
// ============================================================================
class Ball {
  constructor() { this.reset(); this.trail = new BallTrail(); }

  reset() {
    this.x = 0; this.y = 0.5; this.z = 0;
    this.vx = 0; this.vy = 0; this.vz = 0;
    this.active = false; this.outOfPlay = false;
    this.bouncedOnTargetSide = false;
    this.lastHitter = null; this.targetSide = null; this.hitNet = false;
    if (this.trail) this.trail.reset();
  }

  hit(tx, ty, hitter) {
    const T = PHYS.flightFrames;
    this.vx = (tx - this.x) / T;
    this.vy = (ty - this.y) / T;
    this.vz = 0.5 * PHYS.gravity * T - this.z / T;
    this.lastHitter = hitter; this.targetSide = hitter === "player" ? "cpu" : "player";
    this.bouncedOnTargetSide = false;
    this.active = true; this.outOfPlay = false; this.hitNet = false;
  }

  update() {
    if (!this.active) return;
    const prevY = this.y;
    this.x += this.vx; this.y += this.vy; this.z += this.vz;
    this.vz -= PHYS.gravity;

    const crossed = (prevY < 0.5 && this.y >= 0.5) || (prevY > 0.5 && this.y <= 0.5);
    if (crossed && this.z < PHYS.netZ) {
      this.hitNet = true; this.outOfPlay = true; this.active = false; return;
    }

    if (this.z <= 0) {
      this.z = 0; this.vz = -this.vz * PHYS.bounceDamp;
      if (!this.bouncedOnTargetSide) {
        const inX = Math.abs(this.x) <= 1;
        const inY = this.y >= 0 && this.y <= 1;
        const correctSide = (this.targetSide === "cpu" && this.y > 0.5) || (this.targetSide === "player" && this.y < 0.5);
        if (inX && inY && correctSide) this.bouncedOnTargetSide = true;
        else { this.outOfPlay = true; this.active = false; return; }
      }
      if (Math.abs(this.vz) < 0.5) this.active = false;
    }

    if (Math.abs(this.x) > 1.6 || this.y < -0.25 || this.y > 1.25) {
      this.outOfPlay = true; this.active = false;
    }

    // Update trail
    if (this.active) {
      const p = project(this.x, this.y, this.z);
      this.trail.push(p.sx, p.sy, p.scale);
    }
  }

  predictHitPoint() {
    let x = this.x, y = this.y, z = this.z;
    let vx = this.vx, vy = this.vy, vz = this.vz;
    let bounced = this.bouncedOnTargetSide;
    for (let i = 0; i < 200; i++) {
      x += vx; y += vy; z += vz; vz -= PHYS.gravity;
      if (z <= 0) {
        if (!bounced) { bounced = true; z = 0; vz = -vz * PHYS.bounceDamp; continue; }
        return { x, y };
      }
      if (bounced && vz <= 0) return { x, y };
    }
    return { x, y };
  }

  draw(ctx) {
    if (!this.active && this.z <= 0 && !this.outOfPlay) return;

    // Draw trail first (behind ball)
    this.trail.draw(ctx);

    const p = project(this.x, this.y, this.z);
    const g = projectGround(this.x, this.y);
    const r = Math.max(2, Math.round(4 * p.scale));

    // Shadow
    ctx.fillStyle = COLORS.shadow;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.ellipse(g.sx, g.sy, r, Math.max(1, r * 0.4), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = COLORS.ballEdge;
    ctx.beginPath(); ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = COLORS.ball;
    ctx.beginPath(); ctx.arc(p.sx - 1, p.sy - 1, Math.max(1, r - 1), 0, Math.PI * 2); ctx.fill();

    // Specular highlight
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillRect(p.sx - 1, p.sy - r, 1, 1);
  }
}

// ============================================================================
//  PLAYERS — Phase 6 (AI personalities)
// ============================================================================
class Player {
  constructor(side) {
    this.side = side;
    this.x = 0; this.y = side === "near" ? 0.05 : 0.95;
    this.targetX = this.x; this.targetY = this.y;
    this.speed = 0.015; this.swingAnim = 0; this.facing = 1;
    this.hitFlash = 0;
  }

  setTarget(x, y) {
    this.targetX = Math.max(-0.95, Math.min(0.95, x));
    if (this.side === "near") this.targetY = Math.max(0.0, Math.min(0.45, y));
    else this.targetY = Math.max(0.55, Math.min(1.0, y));
  }

  update() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    // Independent lateral (x) and depth (y) movement — lateral is faster
    // so players always reach wide balls without sacrificing court depth
    const spX = this.speed * 1.45;
    const spY = this.speed * 0.80;
    if (Math.abs(dx) > 0.0005) {
      this.x += Math.sign(dx) * Math.min(Math.abs(dx), spX);
      if (Math.abs(dx) > 0.001) this.facing = dx > 0 ? 1 : -1;
    } else {
      this.x = this.targetX;
    }
    if (Math.abs(dy) > 0.0005) {
      this.y += Math.sign(dy) * Math.min(Math.abs(dy), spY);
    } else {
      this.y = this.targetY;
    }
    if (this.swingAnim > 0) this.swingAnim--;
    if (this.hitFlash > 0) this.hitFlash--;
  }

  triggerSwing() { this.swingAnim = 14; this.hitFlash = 6; }

  draw(ctx) {
    const p = project(this.x, this.y, 0);
    const s = p.scale;
    const w = Math.max(10, Math.round(18 * s));
    const h = Math.max(20, Math.round(34 * s));
    const main = this.side === "near" ? COLORS.player : COLORS.cpu;
    const alt  = this.side === "near" ? COLORS.playerAlt : COLORS.cpuAlt;

    // Shadow
    ctx.fillStyle = COLORS.shadow;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.ellipse(p.sx, p.sy + 1, w * 0.5, w * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Hit flash ring
    if (this.hitFlash > 0) {
      ctx.globalAlpha = this.hitFlash / 6 * 0.5;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(p.sx, p.sy - h * 0.5, w * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Shorts
    ctx.fillStyle = "#fff";
    ctx.fillRect(Math.round(p.sx - w/2), Math.round(p.sy - h*0.45), w, Math.round(h*0.25));
    // Arms (skin)
    ctx.fillStyle = COLORS.skin;
    ctx.fillRect(Math.round(p.sx - w/2), Math.round(p.sy - h*0.2), Math.floor(w*0.4), Math.round(h*0.2));
    ctx.fillRect(Math.round(p.sx + w/2 - Math.floor(w*0.4)), Math.round(p.sy - h*0.2), Math.floor(w*0.4), Math.round(h*0.2));
    // Shirt
    ctx.fillStyle = main;
    ctx.fillRect(Math.round(p.sx - w/2), Math.round(p.sy - h*0.85), w, Math.round(h*0.45));
    ctx.fillStyle = alt;
    ctx.fillRect(Math.round(p.sx - w/2), Math.round(p.sy - h*0.55), w, 2);

    // Head
    const hd = Math.max(7, Math.round(10 * s));
    ctx.fillStyle = COLORS.skin;
    ctx.fillRect(Math.round(p.sx - hd/2), Math.round(p.sy - h - hd*0.4), hd, hd);
    ctx.fillStyle = alt;
    ctx.fillRect(Math.round(p.sx - hd/2), Math.round(p.sy - h - hd*0.4), hd, Math.max(2, Math.round(hd*0.35)));

    // Racket arm
    const swinging = this.swingAnim > 0, dir = this.facing;
    const torsoX = Math.round(p.sx), shoulderY = Math.round(p.sy - h*0.65);
    let wristX, wristY, racketX, racketY;
    if (swinging) {
      wristX  = torsoX + dir * Math.round(w * 0.55); wristY  = shoulderY + 2;
      racketX = torsoX + dir * Math.round(w * 0.95); racketY = shoulderY - 1;
    } else {
      wristX  = torsoX + dir * Math.round(w * 0.4); wristY  = shoulderY + Math.round(h * 0.2);
      racketX = wristX; racketY = wristY - Math.round(h * 0.3);
    }
    ctx.fillStyle = COLORS.skin;
    const amx = Math.round((torsoX + dir*(w*0.25) + wristX)/2), amy = Math.round((shoulderY + wristY)/2);
    ctx.fillRect(amx, amy, 2, 2); ctx.fillRect(wristX, wristY, 2, 2);
    ctx.fillStyle = "#5a3a1a";
    if (swinging) ctx.fillRect(wristX + dir*2, wristY, 2, 1);
    else ctx.fillRect(wristX, wristY - 2, 1, 2);

    // Racket head
    const cx = racketX, cy = racketY;
    ctx.fillStyle = "#111";
    ctx.fillRect(cx-2, cy-4, 5, 1); ctx.fillRect(cx-2, cy+4, 5, 1);
    ctx.fillRect(cx-4, cy-2, 1, 5); ctx.fillRect(cx+4, cy-2, 1, 5);
    ctx.fillRect(cx-3, cy-3, 1, 1); ctx.fillRect(cx+3, cy-3, 1, 1);
    ctx.fillRect(cx-3, cy+3, 1, 1); ctx.fillRect(cx+3, cy+3, 1, 1);
    ctx.fillStyle = "#dcdcdc";
    ctx.fillRect(cx-2, cy-3, 5, 7); ctx.fillRect(cx-3, cy-1, 1, 3); ctx.fillRect(cx+3, cy-1, 1, 3);
  }
}

class HumanPlayer extends Player {
  constructor() { super("near"); }
  trackBall(ball) {
    if (!ball.active || ball.lastHitter !== "cpu" || ball.targetSide !== "player") return;
    const p = ball.predictHitPoint();
    this.setTarget(p.x, p.y);
  }
  // Used when this player is acting as P2 (side="far")
  tryHit2P(ball) {
    if (!ball.active || ball.targetSide !== "cpu" || !ball.bouncedOnTargetSide) return false;
    if (ball.z < PHYS.hitZmin || ball.z > PHYS.hitZmax) return false;
    if (Math.hypot(ball.x - this.x, ball.y - this.y) > PHYS.hitRadius + 0.04) return false;
    if (!this.swingAnim) return false; // only hit if currently swinging
    const tx = (Math.random()-0.5) * 1.0;
    const ty = 0.1 + Math.random() * 0.25;
    ball.hit(tx, ty, "cpu");
    return true;
  }
}

// Phase 5 — AI Personalities: Rookie / Defender / Aggressive / Pro
class AIPlayer extends Player {
  constructor(difficulty) {
    super("far");
    this._applyDifficulty(difficulty || "medium");
    this._reactionTimer = 0;
    this._pendingTarget = null;
    // Defender state: tracks consecutive returns
    this._consecutiveReturns = 0;
  }

  _applyDifficulty(key) {
    const d = DIFFICULTY[key] || DIFFICULTY.medium;
    this.hitRadius     = d.hitRadius;
    this.errorRate     = d.errorRate;
    this.speed         = d.speed;
    this.reactionDelay = d.reactionDelay;
    this.personality   = d.personality;
  }

  setDifficulty(key) {
    this._applyDifficulty(key);
    this._consecutiveReturns = 0;
  }

  trackBall(ball) {
    if (!ball.active || ball.lastHitter !== "player" || ball.targetSide !== "cpu") return;
    const p = ball.predictHitPoint();

    // Personality-based tracking noise
    let noiseX = 0;
    switch (this.personality) {
      case "rookie":     noiseX = (Math.random()-0.5) * 0.34; break;
      case "defender":   noiseX = (Math.random()-0.5) * 0.04; break; // gets there reliably
      case "aggressive": noiseX = (Math.random()-0.5) * 0.07; break; // slight aggro drift
      case "pro":        noiseX = (Math.random()-0.5) * 0.012; break;
      default:           noiseX = (Math.random()-0.5) * 0.08;
    }

    if (this._reactionTimer <= 0) {
      this._pendingTarget = { x: p.x + noiseX, y: p.y };
      this._reactionTimer = this.reactionDelay;
    } else {
      this._reactionTimer--;
    }
    if (this._pendingTarget) this.setTarget(this._pendingTarget.x, this._pendingTarget.y);
  }

  tryHit(ball) {
    if (!ball.active || ball.targetSide !== "cpu" || !ball.bouncedOnTargetSide) return false;
    if (ball.z < PHYS.hitZmin || ball.z > PHYS.hitZmax) return false;
    if (Math.hypot(ball.x - this.x, ball.y - this.y) > this.hitRadius) return false;

    let tx, ty;

    if (Math.random() < this.errorRate) {
      // Mistake style per personality
      if (this.personality === "pro" || this.personality === "aggressive") {
        // Precision error — just wide
        tx = (Math.random() > 0.5 ? 1 : -1) * (0.92 + Math.random() * 0.15);
      } else if (this.personality === "defender") {
        // Defender rarely errors but when they do, ball goes short/into net area
        tx = (Math.random()-0.5) * 0.5;
        ty = 0.48 + Math.random() * 0.08;
        ball.hit(tx, ty, "cpu"); this.triggerSwing(); return true;
      } else {
        // Rookie: wild miss
        tx = (Math.random()-0.5) * 3.0;
      }
      ty = -0.04 + Math.random() * 0.5;
      ball.hit(tx, ty, "cpu"); this.triggerSwing(); return true;
    }

    // Strategic shot
    switch (this.personality) {
      case "rookie": {
        // Mostly central, slow
        tx = (Math.random()-0.5) * 0.7;
        ty = 0.18 + Math.random() * 0.3;
        break;
      }
      case "defender": {
        // High return rate: deep cross-court, keeps ball in play
        this._consecutiveReturns++;
        const side = this._consecutiveReturns % 2 === 0 ? -1 : 1;
        tx = side * (0.55 + Math.random() * 0.2);
        ty = 0.06 + Math.random() * 0.15; // deep
        break;
      }
      case "aggressive": {
        // Go for winners: sharp angles, low ty (land early, harder to reach)
        const go = Math.random();
        if (go < 0.45)      tx = -0.82 + (Math.random()-0.5)*0.08;
        else if (go < 0.90) tx =  0.82 + (Math.random()-0.5)*0.08;
        else                tx = (Math.random()-0.5)*0.2; // drop-ish
        ty = 0.08 + Math.random() * 0.14;
        break;
      }
      case "pro": {
        // Read-and-react: mix deep and angle, occasional drop
        const strat = Math.random();
        if (strat < 0.30)      { tx = -0.75 + (Math.random()-0.5)*0.08; ty = 0.07 + Math.random()*0.12; }
        else if (strat < 0.60) { tx =  0.75 + (Math.random()-0.5)*0.08; ty = 0.07 + Math.random()*0.12; }
        else if (strat < 0.80) { tx = (Math.random()-0.5)*0.25;         ty = 0.05 + Math.random()*0.10; } // drop
        else                   { tx = (Math.random()-0.5)*0.5;           ty = 0.18 + Math.random()*0.15; }
        break;
      }
      default: {
        tx = (Math.random()-0.5)*0.9;
        ty = 0.1 + Math.random()*0.3;
      }
    }

    ball.hit(tx, ty, "cpu");
    this.triggerSwing();
    return true;
  }
}

// ============================================================================
//  AI DEMO PLAYER — both players run on AI for demo/attract mode (Phase 8)
// ============================================================================
class DemoPlayer extends Player {
  constructor(side, personality) {
    super(side);
    this.personality = personality || "casual";
    this.hitRadius   = 0.14;
    this.errorRate   = 0.08;
    this.speed       = 0.016;
    this.reactionDelay = 6;
    this._timer      = 0;
    this._pendingTarget = null;
  }

  trackBall(ball) {
    const myHitter = this.side === "near" ? "player" : "cpu";
    const myTarget = this.side === "near" ? "player" : "cpu";
    if (!ball.active || ball.targetSide !== myTarget) return;
    const p = ball.predictHitPoint();
    const noiseX = (Math.random()-0.5) * 0.08;
    if (this._timer <= 0) {
      this._pendingTarget = { x: p.x + noiseX, y: p.y };
      this._timer = this.reactionDelay;
    } else { this._timer--; }
    if (this._pendingTarget) this.setTarget(this._pendingTarget.x, this._pendingTarget.y);
  }

  tryHit(ball, hitterTag) {
    const myTarget = this.side === "near" ? "player" : "cpu";
    if (!ball.active || ball.targetSide !== myTarget || !ball.bouncedOnTargetSide) return false;
    if (ball.z < PHYS.hitZmin || ball.z > PHYS.hitZmax) return false;
    if (Math.hypot(ball.x - this.x, ball.y - this.y) > this.hitRadius) return false;
    const destY = this.side === "near" ? 0.68 + Math.random()*0.2 : 0.12 + Math.random()*0.2;
    const tx = (Math.random()-0.5) * 1.1;
    ball.hit(tx, destY, hitterTag);
    this.triggerSwing();
    return true;
  }
}

// ============================================================================
//  INPUT MANAGER — Phase 7 (Gamepad API support)
// ============================================================================
class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.cb = { swing: null, any: null, uiHit: null, menuNav: null };
    this.touch = null;
    this._gamepadPrev = {};
    canvas.addEventListener("touchstart", (e) => this._tStart(e), { passive: false });
    canvas.addEventListener("touchend",   (e) => this._tEnd(e),   { passive: false });
    canvas.addEventListener("touchmove",  (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener("mousedown",  (e) => this._mDown(e));
    window.addEventListener("keydown",    (e) => this._kDown(e));
    // Gamepad polling
    this._gpFrame = 0;
    this._pollGamepad();
  }

  on(evt, fn) { this.cb[evt] = fn; }
  _fire(evt, arg) { if (this.cb[evt]) this.cb[evt](arg); }

  _toCanvas(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: (clientX - rect.left) * (W / rect.width), y: (clientY - rect.top) * (H / rect.height) };
  }

  _tStart(e) {
    e.preventDefault();
    const t = e.changedTouches[0];
    const c = this._toCanvas(t.clientX, t.clientY);
    if (this.cb.uiHit && this.cb.uiHit(c.x, c.y)) return;
    this.touch = { x: t.clientX, y: t.clientY, t: Date.now() };
    this._fire("any");
  }
  _tEnd(e) {
    e.preventDefault();
    if (!this.touch) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - this.touch.x, dy = t.clientY - this.touch.y;
    const dt = Date.now() - this.touch.t, dist = Math.hypot(dx, dy);
    this.touch = null;
    if (dist < 25 || dt > 700 || dy > -15) return;
    let dir;
    if (Math.abs(dx) < dist * 0.4) dir = "CENTER";
    else dir = dx < 0 ? "LEFT" : "RIGHT";
    this._fire("swing", dir);
  }
  _mDown(e) {
    const c = this._toCanvas(e.clientX, e.clientY);
    if (this.cb.uiHit && this.cb.uiHit(c.x, c.y)) return;
    this._fire("any");
  }
  _kDown(e) {
    const k = e.key;
    if (k === "m" || k === "M") {
      if (this.cb.uiHit) this.cb.uiHit(-1, -1);
      e.preventDefault(); return;
    }
    this._fire("any");
    // P1 — arrow keys
    if (k === "ArrowLeft")  { this._fire("swing", "LEFT");   e.preventDefault(); }
    if (k === "ArrowUp")    { this._fire("swing", "CENTER"); e.preventDefault(); }
    if (k === "ArrowRight") { this._fire("swing", "RIGHT");  e.preventDefault(); }
    // P2 — W/A/D keys (local multiplayer)
    if (k === "a" || k === "A") { this._fire("p2swing", "LEFT");   e.preventDefault(); }
    if (k === "w" || k === "W") { this._fire("p2swing", "CENTER"); e.preventDefault(); }
    if (k === "d" || k === "D") { this._fire("p2swing", "RIGHT");  e.preventDefault(); }
    if (k === "Enter" || k === " ") { this._fire("menuNav", "confirm"); e.preventDefault(); }
    if (k === "ArrowDown") { this._fire("menuNav", "down"); e.preventDefault(); }
    if (k === "Escape" || k === "Backspace") { this._fire("menuNav", "back"); e.preventDefault(); }
  }

  _pollGamepad() {
    requestAnimationFrame(() => this._pollGamepad());
    if (!navigator.getGamepads) return;
    const pads = navigator.getGamepads();
    for (let i = 0; i < pads.length; i++) {
      const pad = pads[i];
      if (!pad) continue;
      const prev = this._gamepadPrev[i] || {};

      // D-pad / left stick
      const axisX = pad.axes[0];
      if (!prev.left  && (pad.buttons[14]?.pressed || axisX < -0.5)) { prev.left = true;  this._fire("swing","LEFT"); this._fire("any"); }
      if (!prev.right && (pad.buttons[15]?.pressed || axisX >  0.5)) { prev.right = true; this._fire("swing","RIGHT"); this._fire("any"); }
      if (!prev.up    && (pad.buttons[12]?.pressed || pad.axes[1] < -0.5)) { prev.up = true; this._fire("swing","CENTER"); this._fire("any"); }
      if (pad.buttons[14]?.pressed === false && axisX > -0.5) prev.left  = false;
      if (pad.buttons[15]?.pressed === false && axisX <  0.5) prev.right = false;
      if (pad.buttons[12]?.pressed === false) prev.up = false;

      // A/Cross confirm
      if (!prev.a && pad.buttons[0]?.pressed) { prev.a = true; this._fire("menuNav","confirm"); this._fire("any"); }
      if (!pad.buttons[0]?.pressed) prev.a = false;

      // Gamepad index 1 = P2
      if (i === 1) {
        const ax2 = pad.axes[0];
        if (!prev.p2left  && (pad.buttons[14]?.pressed || ax2 < -0.5)) { prev.p2left = true;  this._fire("p2swing","LEFT"); }
        if (!prev.p2right && (pad.buttons[15]?.pressed || ax2 >  0.5)) { prev.p2right = true; this._fire("p2swing","RIGHT"); }
        if (!prev.p2up    && (pad.buttons[12]?.pressed || pad.axes[1] < -0.5)) { prev.p2up = true; this._fire("p2swing","CENTER"); }
        if (pad.buttons[14]?.pressed === false && ax2 > -0.5) prev.p2left  = false;
        if (pad.buttons[15]?.pressed === false && ax2 <  0.5) prev.p2right = false;
        if (pad.buttons[12]?.pressed === false) prev.p2up = false;
      }

      this._gamepadPrev[i] = prev;
    }
  }
}

// ============================================================================
//  MENU SYSTEM — Phase 9 (mode + difficulty select)
// ============================================================================
class MenuSystem {
  constructor() {
    this.screen   = "main";
    this.modeIdx  = 0;        // default: casual (index 0 in simplified list)
    this.diffIdx  = 1;        // default: medium (DEFENDER)
    this.twoPlayer = false;   // local multiplayer toggle
    this._modes   = Object.keys(GAME_MODE);
    this._diffs   = Object.keys(DIFFICULTY);
  }

  get selectedMode() { return this._modes[this.modeIdx]; }
  get selectedDiff() { return this._diffs[this.diffIdx]; }

  navigate(dir) {
    const delta = dir === "down" ? 1 : -1;
    if (this.screen === "mode") {
      this.modeIdx = (this.modeIdx + delta + this._modes.length) % this._modes.length;
    } else if (this.screen === "difficulty") {
      this.diffIdx = (this.diffIdx + delta + this._diffs.length) % this._diffs.length;
    }
  }

  toggleP2() { this.twoPlayer = !this.twoPlayer; }

  confirm() {
    if (this.screen === "main") { this.screen = "mode"; return null; }
    if (this.screen === "mode") { this.screen = "difficulty"; return null; }
    if (this.screen === "difficulty") return "start";
    return null;
  }

  back() {
    if (this.screen === "difficulty") { this.screen = "mode"; return; }
    if (this.screen === "mode")       { this.screen = "main"; return; }
  }
}

// ============================================================================
//  GAME
// ============================================================================
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    Store.load();

    this.court      = new Court();
    this.ball       = new Ball();
    this.player     = new HumanPlayer();
    this.cpu        = new AIPlayer("medium");
    this.score      = new Scoreboard(1);
    this.input      = new InputManager(canvas);
    this.sfx        = new SFX();
    this.music      = new Music(this.sfx);
    this.particles  = new ParticleSystem();
    this.shake      = new CameraShake();
    this.flash      = new FlashEffect();
    this.stats      = new MatchStats();
    this.menu       = new MenuSystem();
    this.hitstop    = new HitStop();
    this.replay     = new ReplayBuffer(300);
    this.banner     = new BannerAnim();
    this.transition = new ScreenTransition();

    // Load persisted settings
    const saved = Store.get("settings");
    if (saved) {
      this.sfx.muted = saved.muted || false;
      _lang = saved.lang || "ptbr"; // restore language
      this.menu.diffIdx = Object.keys(DIFFICULTY).indexOf(saved.difficulty || "medium");
      const _validModes = Object.keys(GAME_MODE);
      const _savedMode  = _validModes.indexOf(saved.mode || "casual");
      this.menu.modeIdx = _savedMode >= 0 ? _savedMode : 0;
      if (this.menu.diffIdx < 0) this.menu.diffIdx = 1;
    }

    this.state       = STATE.SPLASH;
    this.timer       = 0;
    this.lastWinner  = null;
    this.frame       = 0;
    this.lastTime    = 0;
    this.accumulator = 0;
    this.STEP_MS     = 1000 / 60;
    this.currentMode = "casual";
    this.rallyCount  = 0;
    this._matchPointShown = false;
    this._twoPlayer  = false;       // local multiplayer flag
    this._p2player   = null;        // second human or demo AI
    this._idleFrames = 0;           // demo mode idle counter
    this._demoActive = false;
    this._introTimer = 0;           // arcade intro screen timer
    this._replaySnaps= [];          // saved replay snapshot array
    this._playingReplay = false;
    this._replayIdx  = 0;
    this._replayTimer= 0;
    this._lastAce    = false;       // was last point an ace?
    this._newRecord  = false;       // did player break rally record this match?
    this._p2human    = null;        // HumanPlayer for P2 in 2P mode
    this._p2swingDir = null;        // last direction key pressed by P2

    this.input.on("swing",   (dir) => this.onSwing(dir));
    this.input.on("p2swing", (dir) => this.onP2Swing(dir));
    this.input.on("any",     ()    => this.onAny());
    this.input.on("uiHit",   (x,y) => this._uiHit(x, y));
    this.input.on("menuNav", (d)   => this.onMenuNav(d));

    this._fit();
    window.addEventListener("resize", () => this._fit());
    if (window.visualViewport) window.visualViewport.addEventListener("resize", () => this._fit());
    requestAnimationFrame((t) => this.loop(t));
  }

  _fit() {
    const sw = window.innerWidth, sh = window.innerHeight;
    const scale = Math.min(sw / W, sh / H);
    this.canvas.style.width  = W * scale + "px";
    this.canvas.style.height = H * scale + "px";
    const scan = document.getElementById("scan");
    if (scan) { scan.style.width = W*scale+"px"; scan.style.height = H*scale+"px"; }
  }

  onMenuNav(dir) {
    this.sfx.ensureCtx();
    if (dir === "back") { this.menu.back(); this.sfx.menuNav(); return; }
    if (dir === "confirm") {
      const result = this.menu.confirm();
      this.sfx.menuSel();
      if (result === "start") {
        this.transition.fadeOut(() => {
          this._startMatchFromMenu();
          this.transition.fadeIn();
        }, 0.09);
      }
    } else {
      this.menu.navigate(dir);
      this.sfx.menuNav();
    }
  }

  onAny() {
    this.sfx.ensureCtx();
    // Reset idle counter — any input kills demo mode
    this._idleFrames = 0;
    if (this._demoActive) {
      this._exitDemo();
      return;
    }
    if (this.state === STATE.SPLASH) {
      if (!this.sfx.muted && !this.music.isPlaying()) this.music.start();
    }
    if (this.state === STATE.MATCH_END) return;
  }

  _exitDemo() {
    this._demoActive = false;
    this._demoP1 = null;
    this._demoP2 = null;
    this.music.stop();
    this.transition.fadeOut(() => {
      this.state = STATE.SPLASH;
      this.ball.reset();
      this.transition.fadeIn(0.05);
    }, 0.12);
  }

  _uiHit(cx, cy) {
    if (cx < 0 && cy < 0) {
      this.sfx.ensureCtx(); this._toggleMute(); return true;
    }
    if (this.state === STATE.SPLASH) {
      if (this._inBtn(cx, cy, SPLASH_SOUND_BTN)) { this.sfx.ensureCtx(); this._toggleMute(); return true; }
      if (this._inBtn(cx, cy, LANG_BTN)) { this._toggleLang(); return true; }
      // 2P toggle button
      if (this._inBtn(cx, cy, { x: 20, y: 240, w: W-40, h: 18 })) {
        this.menu.toggleP2(); this.sfx.menuNav(); return true;
      }
      if (this._inBtn(cx, cy, SPLASH_START_BTN)) {
        this.sfx.ensureCtx(); this.sfx.menuSel(); this.music.stop();
        this.transition.fadeOut(() => {
          this._startMatchFromMenu();
          this.transition.fadeIn();
        }, 0.09);
        return true;
      }
      return true;
    }
    if (this.state === STATE.MATCH_END) {
      if (this._inBtn(cx, cy, MUTE_BTN)) { this.sfx.ensureCtx(); this._toggleMute(); return true; }
      if (this._inBtn(cx, cy, LANG_BTN))  { this._toggleLang(); return true; }
      if (this._inBtn(cx, cy, SPLASH_START_BTN)) {
        this.sfx.ensureCtx(); this.music.stop();
        this.transition.fadeOut(() => { this.state = STATE.SPLASH; this.transition.fadeIn(); }, 0.09);
        return true;
      }
      return true;
    }
    if (this._inBtn(cx, cy, MUTE_BTN)) { this.sfx.ensureCtx(); this._toggleMute(); return true; }
    return false;
  }

  _inBtn(cx, cy, b) {
    return cx >= b.x && cx <= b.x + b.w && cy >= b.y && cy <= b.y + b.h;
  }

  _toggleMute() {
    this.sfx.muted = !this.sfx.muted;
    if (this.sfx.muted) { this.music.stop(); }
    else if (this.state === STATE.SPLASH || this.state === STATE.MATCH_END) { this.music.start(); }
    // Persist
    const s = Store.get("settings") || {};
    s.muted = this.sfx.muted; Store.set("settings", s);
  }

  _toggleLang() {
    _lang = _lang === "ptbr" ? "en" : "ptbr";
    const s = Store.get("settings") || {};
    s.lang = _lang; Store.set("settings", s);
    this.sfx.menuNav();
  }

  _startMatchFromMenu() {
    this.currentMode   = this.menu.selectedMode;
    this._twoPlayer    = this.menu.twoPlayer;
    const modeConf     = GAME_MODE[this.currentMode];
    this.score         = new Scoreboard(Math.ceil(modeConf.sets / 2));
    this._matchPointShown = false;
    this._newRecord    = false;
    this._lastAce      = false;

    // Set up players
    if (this._twoPlayer) {
      // P2 is also a HumanPlayer (same side "far" as cpu was, controls W/A/D)
      this._p2human = new HumanPlayer();
      this._p2human.side = "far";
      this._p2human.y    = 0.95;
      this._p2human.targetY = 0.95;
      this._p2human.speed   = 0.016;
    } else {
      this._p2human = null;
      // In TRAINING mode lock CPU to easy so the player can practice freely
      if (this.currentMode === "training") {
        this.cpu.setDifficulty("easy");
      } else {
        this.cpu.setDifficulty(this.menu.selectedDiff);
      }
    }

    this.stats.reset();
    this.replay.reset();

    // Persist settings
    Store.set("settings", {
      difficulty: this.menu.selectedDiff,
      mode: this.currentMode,
      muted: this.sfx.muted
    });

    // Show arcade-style INTRO screen before match (Phase 7)
    this.state       = STATE.INTRO;
    this._introTimer = 180;   // 3 seconds at 60fps
    this.banner.show(t("bannerToday"), COLORS.accent, 60);
  }

  _startPoint() {
    this.ball.reset();
    this.player.x = 0; this.player.y = 0.05; this.player.targetX = 0; this.player.targetY = 0.05;

    if (this._p2human) {
      this._p2swingDir = null;
      this._p2human.x = 0; this._p2human.y = 0.95;
      this._p2human.targetX = 0; this._p2human.targetY = 0.95;
    } else {
      this.cpu.x = 0; this.cpu.y = 0.95; this.cpu.targetX = 0; this.cpu.targetY = 0.95;
    }

    this.rallyCount = 0;
    this._lastAce   = false;
    this.state      = STATE.SERVING;
    this.timer      = 70;
  }

  _serve() {
    const s = this.score.serverIdx;
    if (s === 0) {
      this.ball.x = 0.3; this.ball.y = 0.04; this.ball.z = 0;
      const tx = -0.35 + (Math.random()-0.5)*0.3, ty = 0.62 + Math.random()*0.1;
      this.ball.hit(tx, ty, "player");
      this.player.triggerSwing();
    } else {
      this.ball.x = -0.3; this.ball.y = 0.96; this.ball.z = 0;
      const tx = 0.3 + (Math.random()-0.5)*0.3, ty = 0.32 + Math.random()*0.1;
      this.ball.hit(tx, ty, "cpu");
      if (this._p2human) this._p2human.triggerSwing();
      else                this.cpu.triggerSwing();
    }
    this.sfx.hit();
    this.state = STATE.RALLYING;
  }

  _endPoint() {
    let winner;
    if (this.ball.outOfPlay && !this.ball.bouncedOnTargetSide) {
      winner = this.ball.lastHitter === "player" ? 1 : 0;
    } else {
      winner = this.ball.targetSide === "player" ? 1 : 0;
    }
    this.lastWinner = winner;

    // Detect ace (no bounce at all on target side)
    const isAce = this.rallyCount === 0 && !this.ball.bouncedOnTargetSide;
    this._lastAce = isAce;
    if (isAce) { this.stats.onAce(winner === 0 ? 1 : 0); }

    const wasNet = this.ball.hitNet;
    this.stats.onPointEnd(winner, wasNet);

    // Rally record tracking
    if (this.stats.maxRally > (Store.get("records") || {}).longestRally) {
      this._newRecord = true;
    }

    // ---- CROWD MOOD (Phase 2) ----
    const isMatchPt = this.score.isMatchPoint(0) || this.score.isMatchPoint(1);
    const isSetPt   = !this.score.matchOver && (this.score.games[winner] >= 5);
    if (isMatchPt)         CrowdMood.set(CrowdMood.MATCHPOINT, 300);
    else if (isSetPt)      CrowdMood.set(CrowdMood.DECISIVE,   240);
    else if (this.rallyCount >= 8) CrowdMood.set(CrowdMood.RALLY, 180);
    else                   CrowdMood.set(CrowdMood.BASE,         60);

    this.court.excite(CrowdMood.excitement());

    // ---- BANNER EVENTS (Phase 3) ----
    if (isAce) {
      this.banner.show(t("bannerAce"), COLORS.ball, 90);
    } else if (isMatchPt && !this._matchPointShown) {
      this.banner.show(t("bannerMatch"), winner === 0 ? COLORS.player : COLORS.cpu, 100);
      this._matchPointShown = true;
    } else if (this.rallyCount >= 10 && this.rallyCount > (this.stats.maxRally - 1)) {
      this.banner.show(t("bannerLongest"), COLORS.accent, 80);
    }

    // ---- SAVE REPLAY SNAPSHOT (Phase 4) ----
    this._replaySnaps = this.replay.slice(180);  // last 3s

    // ---- VISUAL EFFECTS ----
    const ballP = project(this.ball.x, this.ball.y, this.ball.z);
    const hitColor = winner === 0 ? COLORS.player : COLORS.cpu;
    this.particles.emit(ballP.sx, ballP.sy, {
      count: 12, speed: 2.5, decay: 0.045,
      color: hitColor, gravity: 0.06,
      spread: Math.PI * 1.8
    });
    const shakeMag = this.rallyCount > 6 ? 3.0 : (isAce ? 2.5 : 1.4);
    this.shake.trigger(shakeMag);
    this.flash.trigger(isAce || isMatchPt ? 0.28 : 0.18);
    this.hitstop.trigger(isMatchPt || isAce ? 3 : 2);

    this.score.scorePoint(winner);
    this.state  = STATE.POINT_END;
    this.timer  = 90;

    if (this.score.matchOver) {
      // handled in update when timer expires
    } else if (this.score.setOver) {
      this.state = STATE.SET_END;
      this.timer = 140;
      this.sfx.setWon(); this.sfx.roar();
      CrowdMood.set(CrowdMood.WIN, 400);
      this.court.excite(1.0);
    } else {
      if (winner === 0) this.sfx.point(); else this.sfx.lost();
      if (isMatchPt && !this._matchPointShown) {
        this.sfx.matchPoint();
      }
    }
    this.sfx.cheer();
  }

  loop(now) {
    if (!this.lastTime) this.lastTime = now;
    let delta = now - this.lastTime;
    this.lastTime = now;
    // Cap delta to avoid spiral of death
    if (delta > 100) delta = 100;
    this.accumulator += delta;
    while (this.accumulator >= this.STEP_MS) {
      this.frame++;
      if (!this.hitstop.active()) this.update();
      else                        this._updateFrozen();
      this.hitstop.tick();
      this.accumulator -= this.STEP_MS;
    }
    this.draw();
    requestAnimationFrame((t) => this.loop(t));
  }

  // During hitstop: only tick effects, no physics
  _updateFrozen() {
    this.shake.update();
    this.flash.update();
    this.particles.update();
    this.banner.tick();
    this.transition.tick();
    CrowdMood.tick();
    this.court.update();
  }

  update() {
    this.shake.update();
    this.flash.update();
    this.particles.update();
    this.banner.tick();
    this.transition.tick();
    CrowdMood.tick();
    this.court.update();

    // ---- DEMO MODE idle detection (Phase 8) ----
    if (this.state === STATE.SPLASH && !this._demoActive) {
      this._idleFrames++;
      if (this._idleFrames >= DEMO_IDLE_FRAMES) this._startDemo();
    }

    // ---- INTRO screen (Phase 7) ----
    if (this.state === STATE.INTRO) {
      this._introTimer--;
      if (this._introTimer <= 0) this._startPoint();
      return;
    }

    // ---- DEMO mode update (Phase 8) ----
    if (this._demoActive) {
      this._updateDemo();
      return;
    }

    // ---- REPLAY playback (Phase 4) ----
    if (this._playingReplay) {
      this._updateReplay();
      return;
    }

    if (this.state === STATE.SERVING) {
      this.timer--;
      if (this.timer <= 0) this._serve();
      this.player.update();
      if (this._p2human) this._p2human.update(); else this.cpu.update();

    } else if (this.state === STATE.RALLYING) {
      // Push snapshot to replay ring before physics step
      this.replay.push({
        bx: this.ball.x, by: this.ball.y, bz: this.ball.z,
        px: this.player.x, py: this.player.y,
        cx: this._p2human ? this._p2human.x : this.cpu.x,
        cy: this._p2human ? this._p2human.y : this.cpu.y,
        ba: this.ball.active
      });

      const prevVz     = this.ball.vz;
      const prevHitter = this.ball.lastHitter;
      const wasActive  = this.ball.active;
      this.ball.update();

      if (wasActive && this.ball.active && prevVz < 0 && this.ball.vz > 0) {
        this.sfx.bounce();
        const g = projectGround(this.ball.x, this.ball.y);
        this.particles.emit(g.sx, g.sy, {
          count: 5, speed: 1.1, decay: 0.09,
          color: COLORS.courtA, spread: Math.PI, gravity: -0.04
        });
      }
      if (wasActive && !this.ball.active && this.ball.hitNet) {
        this.sfx.net(); this.shake.trigger(1.8); this.hitstop.trigger(2);
      }

      this.player.trackBall(this.ball);
      this.player.update();

      if (this._p2human) {
        // P2 auto-positions toward where ball will land; direction comes from key pressed
        this._trackBallP2(this.ball);
        this._p2human.update();
        if (this._p2human.swingAnim > 0 && this._p2swingDir !== null) {
          if (this._p2TryHit(this.ball, this._p2swingDir)) {
            this.sfx.hit(); this.stats.onHit(); this.rallyCount++;
            this.hitstop.trigger(2);
            const bp = project(this.ball.x, this.ball.y, this.ball.z);
            this.particles.emit(bp.sx, bp.sy, { count: 8, speed: 2, decay: 0.08, color: COLORS.cpu, angle: -Math.PI/2, spread: Math.PI*0.8, gravity: 0.05 });
            this.flash.trigger(0.10);
          }
        }
      } else {
        this.cpu.trackBall(this.ball);
        this.cpu.update();
        const hb = prevHitter;
        if (this.cpu.tryHit(this.ball)) {
          if (this.ball.lastHitter === "cpu" && hb !== "cpu") {
            this.sfx.hit(); this.stats.onHit(); this.rallyCount++;
            this.hitstop.trigger(2);
            const bp = project(this.ball.x, this.ball.y, this.ball.z);
            this.particles.emit(bp.sx, bp.sy, { count: 8, speed: 2, decay: 0.08, color: COLORS.cpu, angle: -Math.PI/2, spread: Math.PI*0.8, gravity: 0.05 });
            this.flash.trigger(0.10);
          }
        }
      }

      if (!this.ball.active) this._endPoint();

    } else if (this.state === STATE.POINT_END || this.state === STATE.SET_END) {
      this.timer--;
      this.player.update();
      if (this._p2human) this._p2human.update(); else this.cpu.update();

      if (this.timer <= 0) {
        if (this.score.matchOver) {
          this.state = STATE.MATCH_END;
          Store.addMatchResult(this.score.sets[0], this.score.sets[1], this.stats.maxRally, this.stats.totalPoints);

          if (this._newRecord) this.banner.show(t("bannerRecord"), COLORS.accent, 120);
          if (this.score.winner === 0) {
            this.banner.show(t("bannerVic"), COLORS.player, 140);
            this.sfx.win(); this.sfx.roar();
          } else {
            this.sfx.defeat();
          }
          if (!this.sfx.muted) setTimeout(() => this.music.start(), 2000);

          // Auto-replay last rally if it was interesting
          if (this._replaySnaps.length > 30) {
            setTimeout(() => this._beginReplay(), 2200);
          }
        } else {
          this._matchPointShown = false;
          this._startPoint();
        }
      }
    }
  }

  // ---- DEMO MODE (Phase 8) ----
  _startDemo() {
    this._demoActive  = true;
    this._idleFrames  = 0;
    this._demoP1      = new DemoPlayer("near", "casual");
    this._demoP2      = new DemoPlayer("far",  "casual");
    this.ball.reset();
    this._demoP1.x = 0; this._demoP1.y = 0.05;
    this._demoP2.x = 0; this._demoP2.y = 0.95;
    this._demoServe();
    this.music.stop();
    if (!this.sfx.muted) this.music.start();
    this.state = STATE.RALLYING;
  }

  _demoServe() {
    this.ball.x = 0.2; this.ball.y = 0.04; this.ball.z = 0;
    this.ball.hit(-0.3 + (Math.random()-0.5)*0.3, 0.65 + Math.random()*0.1, "player");
    this._demoP1.triggerSwing();
  }

  _updateDemo() {
    this.ball.update();
    this._demoP1.trackBall(this.ball);
    this._demoP2.trackBall(this.ball);
    this._demoP1.update();
    this._demoP2.update();

    const hb = this.ball.lastHitter;
    if (this._demoP1.tryHit(this.ball, "player")) { this.sfx.hit(); }
    if (this._demoP2.tryHit(this.ball, "cpu"))    { this.sfx.hit(); }

    if (!this.ball.active) {
      // Reset and serve again silently
      this.ball.reset();
      this._demoP1.x = 0; this._demoP1.y = 0.05;
      this._demoP2.x = 0; this._demoP2.y = 0.95;
      setTimeout(() => { if (this._demoActive) this._demoServe(); }, 600);
    }
  }

  // ---- REPLAY (Phase 4) ----
  _beginReplay() {
    if (!this._replaySnaps || this._replaySnaps.length === 0) return;
    if (this.state === STATE.MATCH_END) {
      this._playingReplay = true;
      this._replayIdx     = 0;
      this._replayTimer   = 0;
      this.banner.show(t("bannerReplay"), COLORS.accent, 50);
    }
  }

  _updateReplay() {
    this._replayIdx++;
    if (this._replayIdx >= this._replaySnaps.length) {
      this._playingReplay = false;
      this._replaySnaps   = [];
      return;
    }
    const s = this._replaySnaps[this._replayIdx];
    this.ball.x  = s.bx; this.ball.y  = s.by; this.ball.z  = s.bz;
    this.ball.active = s.ba;
    this.player.x = s.px; this.player.y = s.py;
    if (this._p2human) { this._p2human.x = s.cx; this._p2human.y = s.cy; }
    else { this.cpu.x = s.cx; this.cpu.y = s.cy; }
  }

  // ---- P2 auto-positioning (local multiplayer) ----
  // P2 moves toward predicted ball landing spot automatically.
  // The PLAYER still controls the swing direction (A / W / D).
  _trackBallP2(ball) {
    if (!this._p2human) return;
    if (!ball.active || ball.targetSide !== "cpu") {
      // Ball heading to P1 side — P2 drifts back to center baseline
      this._p2human.setTarget(0, 0.95);
      return;
    }
    const p = ball.predictHitPoint();
    // Clamp to CPU (far) half of court
    const clampedY = Math.max(0.55, Math.min(1.0, p.y));
    this._p2human.setTarget(p.x, clampedY);
  }

  // ---- P2 directional hit (local multiplayer) ----
  _p2TryHit(ball, dir) {
    if (!ball.active || ball.targetSide !== "cpu" || !ball.bouncedOnTargetSide) return false;
    if (ball.z < PHYS.hitZmin || ball.z > PHYS.hitZmax) return false;
    if (Math.hypot(ball.x - this._p2human.x, ball.y - this._p2human.y) > PHYS.hitRadius + 0.04) return false;

    // Directional shot matching P1's convention (from P2's perspective, mirrored)
    let tx;
    if (dir === "LEFT")       tx = -0.62;
    else if (dir === "RIGHT") tx =  0.62;
    else                      tx =  (Math.random() - 0.5) * 0.18;
    tx += (Math.random() - 0.5) * 0.10;
    const ty = 0.10 + Math.random() * 0.28;  // aimed at P1 half
    ball.hit(tx, ty, "cpu");
    this._p2human.triggerSwing();
    this._p2swingDir = null;   // consume direction
    return true;
  }

  // ---- P2 swing handler (local multiplayer) ----
  onP2Swing(dir) {
    if (this.state !== STATE.RALLYING) return;
    if (!this._p2human) return;
    this._p2swingDir = dir;   // remember direction (LEFT / CENTER / RIGHT)
    this._p2human.triggerSwing();
  }

  // ============================================================
  //  DRAW PIPELINE
  // ============================================================
  draw() {
    const ctx = this.ctx;

    if (this.state === STATE.SPLASH && !this._demoActive) {
      this._drawSplash();
      this.transition.draw(ctx);
      return;
    }

    if (this.state === STATE.INTRO) {
      this._drawIntro(ctx);
      this.banner.draw(ctx);
      this.transition.draw(ctx);
      return;
    }

    // --- In-game / demo / replay ---
    ctx.save();
    this.shake.apply(ctx);
    this.court.draw(ctx, this.frame);

    // Determine which players to draw
    const topPlayer  = this._p2human ? this._p2human : (this._demoActive ? this._demoP2 : this.cpu);
    const nearPlayer = this._demoActive ? this._demoP1 : this.player;

    const ents = [
      { y: topPlayer.y,  fn: () => topPlayer.draw(ctx)  },
      { y: nearPlayer.y, fn: () => nearPlayer.draw(ctx) }
    ];
    if (this.ball.active || this.ball.outOfPlay) {
      ents.push({ y: this.ball.y, fn: () => this.ball.draw(ctx) });
    }
    ents.sort((a,b) => b.y - a.y);
    ents.forEach(e => e.fn());
    this.particles.draw(ctx);
    ctx.restore();

    this.flash.draw(ctx);

    if (!this._demoActive) {
      this._drawHUD();
      if (this.state === STATE.SERVING)   this._drawServeHint();
      if (this.state === STATE.POINT_END) this._drawPointEnd();
      if (this.state === STATE.SET_END)   this._drawSetEnd();
      if (this.state === STATE.MATCH_END) this._drawMatchEnd();
    } else {
      this._drawDemoOverlay(ctx);
    }

    this.banner.draw(ctx);

    if ([STATE.SERVING, STATE.RALLYING, STATE.POINT_END, STATE.SET_END].includes(this.state) && !this._demoActive) {
      this._drawMuteButton(ctx);
    }

    this.transition.draw(ctx);
  }

  // ============================================================
  //  INTRO SCREEN — Phase 7 (arcade-style match presentation)
  // ============================================================
  _drawIntro(ctx) {
    const dn = DayNight.getColors(this.frame);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, dn.skyTop); grad.addColorStop(1, dn.skyBot);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

    // Animated scanline stripe
    const stripeY = (this.frame * 3) % (H + 20) - 20;
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, stripeY, W, 8);
    ctx.globalAlpha = 1;

    const _tmr  = this._introTimer;
    const total = 180;
    const phase = 1 - _tmr / total;  // 0..1 progress

    // Slide in from sides
    const slideP = Math.min(1, phase * 5);
    const eased  = 1 - Math.pow(1 - slideP, 3);

    // P1 side — slides in from left
    const p1x = -80 + eased * 90;
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(p1x, 110, 80, 80);
    ctx.fillStyle = COLORS.player;
    ctx.fillRect(p1x, 110, 80, 2);
    ctx.fillRect(p1x, 188, 80, 2);
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(this._twoPlayer ? t("player1") : t("player"), p1x + 40, 146);
    ctx.fillStyle = COLORS.player;
    ctx.fillText(t("p1"), p1x + 40, 170);
    // Mini player sprite
    const mp = project(-0.5, 0.1, 0);
    // Draw at fixed position
    ctx.fillStyle = COLORS.player;
    ctx.fillRect(p1x + 30, 155, 20, 25);
    ctx.fillStyle = COLORS.skin;
    ctx.fillRect(p1x + 33, 148, 14, 9);

    // P2 side — slides in from right
    const p2x = W - 10 + (1-eased) * 80;
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(p2x - 80, 110, 80, 80);
    ctx.fillStyle = COLORS.cpu;
    ctx.fillRect(p2x - 80, 110, 80, 2);
    ctx.fillRect(p2x - 80, 188, 80, 2);
    ctx.fillStyle = "#fff";
    ctx.fillText(this._twoPlayer ? t("player2") : t("cpu"), p2x - 40, 146);
    ctx.fillStyle = COLORS.cpu;
    ctx.fillText(this._twoPlayer ? t("p2") : tDiff(this.menu.selectedDiff), p2x - 40, 170);
    ctx.fillStyle = COLORS.cpu;
    ctx.fillRect(p2x - 50, 155, 20, 25);
    ctx.fillStyle = COLORS.skin;
    ctx.fillRect(p2x - 47, 148, 14, 9);

    // VS center — pops in
    if (phase > 0.3) {
      const vsAlpha = Math.min(1, (phase - 0.3) / 0.2);
      ctx.globalAlpha = vsAlpha;
      ctx.font = '28px "Press Start 2P", monospace';
      ctx.textAlign = "center";
      ctx.fillStyle = "#000";
      ctx.fillText("VS", W/2 + 2, 162);
      ctx.fillStyle = COLORS.accent;
      ctx.fillText("VS", W/2, 160);
      ctx.globalAlpha = 1;
    }

    // Top label
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = "center";
    ctx.fillStyle = COLORS.accent;
    ctx.fillText(t("todayMatch"), W/2, 90);

    // Mode label bottom
    const mode = GAME_MODE[this.currentMode];
    ctx.fillStyle = "#888";
    ctx.fillText(mode ? tModeLabel(this.currentMode) : "", W/2, 220);

    // "GET READY" blink near the end
    if (_tmr < 60 && Math.floor(this.frame / 8) % 2 === 0) {
      ctx.fillStyle = "#fff";
      ctx.fillText(t("getReady"), W/2, 260);
    }
  }

  // ============================================================
  //  DEMO OVERLAY — Phase 8
  // ============================================================
  _drawDemoOverlay(ctx) {
    // Minimal HUD during demo
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, W, 22);
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = "center";
    ctx.fillStyle = COLORS.accent;
    ctx.fillText(t("demoMode"), W/2, 14);

    if (Math.floor(this.frame / 36) % 2 === 0) {
      ctx.fillStyle = "#fff";
      ctx.fillText(t("pressAny"), W/2, 380);
    }
  }

  // ============================================================
  //  HUD — Premium version with 2P labels and rally meter
  // ============================================================
  _drawHUD() {
    const ctx = this.ctx;
    ctx.fillStyle = COLORS.hud;
    ctx.fillRect(0, 0, W, 26);
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(0, 25, W, 1);

    ctx.font = '8px "Press Start 2P", monospace';

    // P1 label
    const p1Label = this._twoPlayer ? t("hudP1") : t("hudYou");
    ctx.textAlign = "left";
    ctx.fillStyle = COLORS.player;
    ctx.fillText(p1Label, 6, 11);

    // P2 / CPU label
    const p2Label = this._twoPlayer ? t("hudP2") : t("hudCpu");
    ctx.textAlign = "right";
    ctx.fillStyle = this._twoPlayer ? COLORS.cpu : "#3858d8";
    ctx.fillText(p2Label, W - 6, 11);

    // Point score center
    const [a, b] = this.score.pointDisplay();
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(a + "-" + b, W / 2, 11);

    // Games score
    ctx.fillStyle = COLORS.accent;
    const gLabel = this.score.games[0] + "-" + this.score.games[1];
    ctx.fillText(gLabel, W / 2, 22);

    // Sets pips (if more than 1 set)
    if (this.score.setsToWin > 1) {
      const pipSize = 3, pipGap = 5, startX = 36;
      for (let i = 0; i < this.score.setsToWin; i++) {
        ctx.fillStyle = this.score.sets[0] > i ? COLORS.player : "#2a2a2a";
        ctx.fillRect(startX + i * pipGap, 4, pipSize, pipSize);
      }
      for (let i = 0; i < this.score.setsToWin; i++) {
        ctx.fillStyle = this.score.sets[1] > i ? COLORS.cpu : "#2a2a2a";
        const px = W - 36 - (i + 1) * pipGap + 2;
        ctx.fillRect(px, 4, pipSize, pipSize);
      }
    }

    // Server dot (animated pulse)
    const pulse = Math.sin(this.frame * 0.15) * 0.4 + 0.6;
    ctx.globalAlpha = pulse;
    ctx.fillStyle = COLORS.ball;
    if (this.score.serverIdx === 0) ctx.fillRect(34, 8, 3, 3);
    else ctx.fillRect(W - 37, 8, 3, 3);
    ctx.globalAlpha = 1;

    // Rally meter (dynamic color: green→yellow→red)
    if (this.state === STATE.RALLYING && this.rallyCount >= 3) {
      const barW = Math.min(80, this.rallyCount * 6);
      const bx = (W - barW) / 2;
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(bx - 1, 26, barW + 2, 5);
      const t = Math.min(1, this.rallyCount / 14);
      const rc = this.rallyCount > 10 ? "#e23838" : (this.rallyCount > 6 ? "#f0a020" : "#44cc44");
      ctx.fillStyle = rc;
      ctx.fillRect(bx, 27, barW, 3);
      // Blink on hot rally
      if (this.rallyCount > 10 && Math.floor(this.frame / 6) % 2 === 0) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(bx, 27, barW, 3);
      }
    }
  }

  _drawServeHint() {
    if (this.timer > 50) return;
    if (Math.floor(this.frame / 12) % 2) return;
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(W/2 - 60, 28, 120, 18);
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(W/2 - 60, 28, 120, 1);
    ctx.fillRect(W/2 - 60, 45, 120, 1);
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = "center";
    ctx.fillStyle = COLORS.accent;
    const _srvLabel = this.score.serverIdx === 0
      ? (this._twoPlayer ? t("p1Serve") : t("yourServe"))
      : (this._twoPlayer ? t("p2Serve") : t("cpuServe"));
    ctx.fillText(_srvLabel, W/2, 40);
  }

  _drawPointEnd() {
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(0, 180, W, 32);
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(0, 180, W, 1);
    ctx.fillRect(0, 211, W, 1);
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.textAlign = "center";
    ctx.fillStyle = this.lastWinner === 0 ? COLORS.player : COLORS.cpu;
    ctx.fillText(this.lastWinner === 0 ? t("pointYou") : t("pointCpu"), W/2, 201);
  }

  _drawSetEnd() {
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(0,0,0,0.78)";
    ctx.fillRect(0, 150, W, 60);
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(0, 150, W, 2);
    ctx.fillRect(0, 209, W, 2);
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.textAlign = "center";
    ctx.fillStyle = this.score.setWinner === 0 ? COLORS.player : COLORS.cpu;
    ctx.fillText("SET " + (this.score.sets[0] + this.score.sets[1]), W/2, 176);
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = "#fff";
    ctx.fillText(this.score.setWinner === 0 ? t("youWin") : t("cpuWins"), W/2, 200);
  }

  _drawMatchEnd() {
    const ctx = this.ctx;

    if (this._playingReplay) {
      // During replay: dim overlay + REPLAY label (banner handles label)
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, W, H);
      return;
    }

    ctx.fillStyle = "rgba(0,0,0,0.92)";
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "center";

    // Animated title lines
    const lineAnim = Math.min(1, (this.frame % 300) / 30);
    ctx.globalAlpha = lineAnim;
    ctx.font = '22px "Press Start 2P", monospace';
    ctx.fillStyle = "#000";
    ctx.fillText(t("gameT1"), W/2+2, 82); ctx.fillText(t("gameT2"), W/2+2, 112);
    ctx.fillStyle = COLORS.accent;
    ctx.fillText(t("gameT1"), W/2, 80);   ctx.fillText(t("gameT2"), W/2, 110);
    ctx.globalAlpha = 1;

    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillStyle = this.score.winner === 0 ? COLORS.player : COLORS.cpu;
    ctx.fillText(this._twoPlayer
      ? (this.score.winner === 0 ? t("p1Wins") : t("p2Wins"))
      : (this.score.winner === 0 ? t("youWin2") : t("cpuWins2")), W/2, 145);

    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = "#fff";
    ctx.fillText(this.score.winner === 0 ? t("excellent") : t("tryAgain"), W/2, 164);

    // Stats panel
    const rec = Store.get("records") || {};
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(20, 176, W-40, 58);
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(20, 176, W-40, 1);
    ctx.fillRect(20, 233, W-40, 1);

    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillStyle = "#aaa";
    ctx.textAlign = "left";
    ctx.fillText(t("statRally") + this.stats.maxRally + (this._newRecord ? " ★" : ""), 28, 192);
    ctx.fillText(t("statPoints") + this.stats.totalPoints, 28, 206);
    ctx.fillText(t("statAcP1") + this.stats.playerAces, 28, 220);
    ctx.textAlign = "right";
    ctx.fillText(t("statBest") + (rec.longestRally || 0), W-28, 192);
    ctx.fillText(t("statW") + (rec.wins||0) + " " + t("statL") + (rec.losses||0), W-28, 206);
    ctx.fillText(t("statCpu") + this.stats.cpuAces, W-28, 220);

    // Sets display
    ctx.textAlign = "center";
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = "#fff";
    const sLabel = this.score.sets[0] + " - " + this.score.sets[1];
    ctx.fillText(t("sets") + sLabel, W/2, 248);

    // Trophy
    const tx = W/2, ty = 282;
    const tc = this.score.winner === 0 ? COLORS.accent : "#2a2a6a";
    ctx.fillStyle = tc;
    ctx.fillRect(tx-14, ty-16, 28, 14);
    ctx.fillRect(tx-8,  ty-2,  16, 4);
    ctx.fillRect(tx-16, ty+2,  32, 3);
    ctx.fillRect(tx-22, ty-14, 6,  10);
    ctx.fillRect(tx+16, ty-14, 6,  10);
    ctx.fillStyle = this.score.winner === 0 ? "#fff" : "#1a1a3a";
    ctx.fillRect(tx-4,  ty-12, 8,  8);

    // Blink "PRESS START"
    if (Math.floor(this.frame / 22) % 2 === 0) {
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillStyle = COLORS.accent;
      ctx.fillText(t("pressStart"), W/2, 320);
    }

    this._drawSplashStartButton(ctx);
    this._drawMuteButton(ctx);
    this._drawLangButton(ctx);
  }

  // ============================================================
  //  SPLASH — Premium professional menu
  // ============================================================
  _drawSplash() {
    const ctx = this.ctx;
    const dn = DayNight.getColors(this.frame);

    // Sky
    const grad = ctx.createLinearGradient(0, 0, 0, 200);
    grad.addColorStop(0, dn.skyTop); grad.addColorStop(1, dn.skyBot);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, 200);

    if (dn.isNight) {
      for (const s of STARS) {
        const blink = Math.sin(this.frame * 0.04 + s.b * 10) * 0.5 + 0.5;
        ctx.globalAlpha = 0.5 + blink * 0.5;
        ctx.fillStyle = "#ffffff"; ctx.fillRect(s.x, Math.round(s.y * 0.5), 1, 1);
      }
      ctx.globalAlpha = 1;
    }

    // Clouds
    const fo = (this.frame * 0.06) % (W + 40), no = (this.frame * 0.18) % (W + 40);
    const cloudColor = dn.isNight ? "#1a1428" : "#ffffff";
    const cloudFar   = dn.isNight ? "#0e0c1a" : "#e8eef5";
    [{s:CLOUD.tiny,bx:10,y:4},{s:CLOUD.small,bx:90,y:12},{s:CLOUD.tiny,bx:160,y:2},{s:CLOUD.small,bx:220,y:8}]
      .forEach(c => { const ww=c.s[0].length; let x=c.bx-fo; while(x<-ww)x+=W+40; drawSprite(ctx,c.s,Math.round(x),c.y,cloudFar); });
    [{s:CLOUD.big,bx:20,y:22},{s:CLOUD.small,bx:130,y:32},{s:CLOUD.big,bx:220,y:18}]
      .forEach(c => { const ww=c.s[0].length; let x=c.bx-no; while(x<-ww)x+=W+40; drawSprite(ctx,c.s,Math.round(x),c.y,cloudColor); });

    // Mini stadium + court
    const stadiumTop = 200;
    ctx.fillStyle = COLORS.stadium; ctx.fillRect(0, stadiumTop, W, 4);
    this.court.drawCrowdLayer(ctx, this.frame, stadiumTop - 48);
    ctx.fillStyle = COLORS.railing; ctx.fillRect(0, stadiumTop+46, W, 6);
    ctx.fillStyle = "#241410";      ctx.fillRect(0, stadiumTop+52, W, 4);

    const sc = { nearY:384, farY:260, nearLeftX:8, nearRightX:212, farLeftX:64, farRightX:156 };
    const sCourt = (cx,cy) => {
      const lx = sc.nearLeftX + (sc.farLeftX - sc.nearLeftX)*cy;
      const rx = sc.nearRightX + (sc.farRightX - sc.nearRightX)*cy;
      return { sx: lx+(rx-lx)*(cx+1)*0.5, sy: sc.nearY+(sc.farY-sc.nearY)*cy };
    };
    ctx.fillStyle = COLORS.courtDark; ctx.fillRect(0, stadiumTop+56, W, H-stadiumTop-56);
    ctx.fillStyle = COLORS.courtA;
    ctx.beginPath();
    let p = sCourt(-1.3,0); ctx.moveTo(p.sx,p.sy);
    p = sCourt(1.3,0);  ctx.lineTo(p.sx,p.sy);
    p = sCourt(1.3,1);  ctx.lineTo(p.sx,p.sy);
    p = sCourt(-1.3,1); ctx.lineTo(p.sx,p.sy);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 1;
    const dl = (x1,y1,x2,y2) => { const a=sCourt(x1,y1),b=sCourt(x2,y2); ctx.beginPath(); ctx.moveTo(a.sx+.5,a.sy+.5); ctx.lineTo(b.sx+.5,b.sy+.5); ctx.stroke(); };
    dl(-1.3,0,1.3,0); dl(-1.3,1,1.3,1); dl(-1.3,0,-1.3,1); dl(1.3,0,1.3,1);
    dl(-1,0,-1,1); dl(1,0,1,1); dl(-1,0.25,1,0.25); dl(-1,0.75,1,0.75); dl(0,0.25,0,0.75);
    const nL=sCourt(-1.4,0.5), nR=sCourt(1.4,0.5), nH=12;
    ctx.fillStyle=COLORS.netDark; ctx.fillRect(nL.sx,nL.sy-nH,nR.sx-nL.sx,nH);
    ctx.fillStyle="#fff";         ctx.fillRect(nL.sx,nL.sy-nH,nR.sx-nL.sx,2);

    // Title
    ctx.textAlign = "center";
    ctx.font = '32px "Press Start 2P", monospace';
    ctx.fillStyle = "#000";    ctx.fillText("MATCH", W/2+3, 84);
    ctx.fillStyle = COLORS.playerAlt; ctx.fillText("MATCH", W/2+1, 82);
    ctx.fillStyle = COLORS.accent;    ctx.fillText("MATCH", W/2, 80);
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = "#000"; ctx.fillText(t("subtitle"), W/2+1, 103);
    ctx.fillStyle = "#fff"; ctx.fillText(t("subtitle"), W/2, 102);

    // Config panel
    const mode = GAME_MODE[this.menu.selectedMode];
    const diff = DIFFICULTY[this.menu.selectedDiff];
    ctx.fillStyle = "rgba(0,0,0,0.65)"; ctx.fillRect(20, 112, W-40, 48);
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(20,112,W-40,1); ctx.fillRect(20,159,W-40,1);
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = "#fff"; ctx.fillText("◀ " + tModeLabel(this.menu.selectedMode) + " ▶", W/2, 126);
    ctx.fillStyle = "#777"; ctx.fillText(tModeDesc(this.menu.selectedMode), W/2, 138);

    // Difficulty color coding — hidden in Training (locked to easy)
    const _isTraining = this.menu.selectedMode === "training";
    const _diffColorMap = { easy:"#44ee44", medium:COLORS.ball, hard:"#f06020", expert:"#e23838" };
    const dc = _diffColorMap[this.menu.selectedDiff] || COLORS.ball;
    ctx.fillStyle = _isTraining ? "#555" : dc;
    const _diffLabel = this.menu.twoPlayer
      ? "2 PLAYER LOCAL"
      : (_isTraining ? "CPU: EASY (LOCKED)" : "CPU: " + diff.label);
    ctx.fillText(_diffLabel, W/2, 152);

    // 2P toggle button
    const p2Active = this.menu.twoPlayer;
    ctx.fillStyle = p2Active ? "rgba(56,88,216,0.4)" : "rgba(0,0,0,0.4)";
    ctx.fillRect(20, 164, W-40, 18);
    ctx.fillStyle = p2Active ? COLORS.cpu : "#555";
    ctx.fillRect(20,164,W-40,1); ctx.fillRect(20,181,W-40,1);
    ctx.fillStyle = p2Active ? "#fff" : "#666";
    ctx.fillText(p2Active ? t("p2on") : t("p2off"), W/2, 176);

    // Controls section
    ctx.fillStyle = COLORS.ball;
    ctx.fillText(t("howTo"), W/2, 198);
    ctx.fillStyle = COLORS.player;
    ctx.fillText(t("p1ctrl"), W/2, 210);
    ctx.fillStyle = COLORS.cpu;
    ctx.fillText(t("p2ctrl"), W/2, 222);

    drawSprite(ctx, ARROW.NW, 50, 232, "#000"); drawSprite(ctx, ARROW.NW, 49, 231, "#fff");
    drawSprite(ctx, ARROW.N,  88, 232, "#000"); drawSprite(ctx, ARROW.N,  87, 231, "#fff");
    drawSprite(ctx, ARROW.NE,126, 232, "#000"); drawSprite(ctx, ARROW.NE,125, 231, "#fff");

    // Idle hint → demo
    if (Math.floor(this.frame / 50) % 2 === 0 && this._idleFrames > 120) {
      ctx.fillStyle = "#444";
      ctx.font = '6px "Press Start 2P", monospace';
      ctx.fillText(t("idleDemo"), W/2, 242);
    }

    // XByte Studios footer
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillStyle = "#333";
    ctx.fillText("XBYTE STUDIOS  2025", W/2, 368);

    // Click zones (registered once)
    if (!this._modeBtnRegistered) {
      this._modeBtnRegistered = true;
      this.canvas.addEventListener("click", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const cx = (e.clientX - rect.left) * (W / rect.width);
        const cy = (e.clientY - rect.top)  * (H / rect.height);
        if (this.state !== STATE.SPLASH) return;
        // Mode zone: top half of config panel
        if (cx >= 20 && cx <= W-20 && cy >= 112 && cy < 140) {
          this.menu.modeIdx = (this.menu.modeIdx + 1) % Object.keys(GAME_MODE).length;
          this.sfx.menuNav();
        }
        // Diff zone: bottom of config panel (disabled in training mode)
        else if (cx >= 20 && cx <= W-20 && cy >= 140 && cy < 160) {
          if (!this.menu.twoPlayer && this.menu.selectedMode !== "training") {
            this.menu.diffIdx = (this.menu.diffIdx + 1) % Object.keys(DIFFICULTY).length;
            this.sfx.menuNav();
          }
        }
        // 2P toggle
        else if (cx >= 20 && cx <= W-20 && cy >= 164 && cy <= 181) {
          this.menu.toggleP2(); this.sfx.menuSel();
        }
      });
    }

    this._drawSplashSoundButton(ctx);
    this._drawSplashStartButton(ctx);
    this._drawLangButton(ctx);
  }

  // ============================================================
  //  UI WIDGETS (unchanged originals + START now says "START")
  // ============================================================

  // Language toggle button (bottom-left corner)
  _drawLangButton(ctx) {
    const b = LANG_BTN;
    const active = _lang === "ptbr";
    ctx.fillStyle = active ? "rgba(0,80,200,0.75)" : "rgba(0,0,0,0.60)";
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(b.x, b.y, b.w, 1); ctx.fillRect(b.x, b.y+b.h-1, b.w, 1);
    ctx.fillRect(b.x, b.y, 1, b.h); ctx.fillRect(b.x+b.w-1, b.y, 1, b.h);
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(t("langBtn"), b.x + b.w/2, b.y + 10);
  }


  _drawSpeakerIcon(ctx, ox, oy, muted) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(ox,   oy+3, 2, 2);
    ctx.fillRect(ox+2, oy+2, 1, 4);
    ctx.fillRect(ox+3, oy+1, 1, 6);
    ctx.fillRect(ox+4, oy,   1, 8);
    if (muted) {
      ctx.fillStyle = "#e23838";
      [[6,1],[7,2],[8,3],[9,4],[10,5],[10,1],[9,2],[8,3],[7,4],[6,5]].forEach(([dx,dy]) => ctx.fillRect(ox+dx,oy+dy,1,1));
    } else {
      ctx.fillStyle = "#fff";
      ctx.fillRect(ox+6,oy+2,1,4); ctx.fillRect(ox+7,oy+1,1,1); ctx.fillRect(ox+7,oy+6,1,1);
      ctx.fillRect(ox+8,oy+3,1,2); ctx.fillRect(ox+9,oy+1,1,1); ctx.fillRect(ox+9,oy+6,1,1);
      ctx.fillRect(ox+10,oy+2,1,4);
    }
  }

  _drawMuteButton(ctx) {
    const b = MUTE_BTN;
    ctx.fillStyle = "rgba(0,0,0,0.65)"; ctx.fillRect(b.x,b.y,b.w,b.h);
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(b.x,b.y,b.w,1); ctx.fillRect(b.x,b.y+b.h-1,b.w,1);
    ctx.fillRect(b.x,b.y,1,b.h); ctx.fillRect(b.x+b.w-1,b.y,1,b.h);
    this._drawSpeakerIcon(ctx, b.x+4, b.y+4, this.sfx.muted);
  }

  _drawSplashSoundButton(ctx) {
    const b = SPLASH_SOUND_BTN;
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(b.x,b.y,b.w,b.h);
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(b.x,b.y,b.w,1); ctx.fillRect(b.x,b.y+b.h-1,b.w,1);
    ctx.fillRect(b.x,b.y,1,b.h); ctx.fillRect(b.x+b.w-1,b.y,1,b.h);
    this._drawSpeakerIcon(ctx, b.x+8, b.y+7, this.sfx.muted);
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = "left";
    ctx.fillStyle = "#fff";
    ctx.fillText(this.sfx.muted ? t("soundOff") : t("soundOn"), b.x+25, b.y+16);
  }

  _drawSplashStartButton(ctx) {
    const b = SPLASH_START_BTN;
    const blink = Math.floor(this.frame / 24) % 2 === 0;
    ctx.fillStyle = blink ? COLORS.accent : "#000"; ctx.fillRect(b.x,b.y,b.w,b.h);
    ctx.fillStyle = blink ? "#000" : COLORS.accent;
    ctx.fillRect(b.x,b.y,b.w,2); ctx.fillRect(b.x,b.y+b.h-2,b.w,2);
    ctx.fillRect(b.x,b.y,2,b.h); ctx.fillRect(b.x+b.w-2,b.y,2,b.h);
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.textAlign = "center";
    ctx.fillStyle = blink ? "#000" : COLORS.accent;
    ctx.fillText(t("start"), b.x+b.w/2, b.y+25);
  }

  // ============================================================
  //  SWING — Phase 1 premium: hitstop + particles + flash
  // ============================================================
  onSwing(dir) {
    if (this.state !== STATE.RALLYING) return;
    this.player.triggerSwing();
    if (this.ball.targetSide !== "player" || !this.ball.bouncedOnTargetSide) return;
    if (this.ball.z < PHYS.hitZmin || this.ball.z > PHYS.hitZmax) return;
    if (Math.hypot(this.ball.x - this.player.x, this.ball.y - this.player.y) >= PHYS.hitRadius) return;

    let tx;
    if (dir === "LEFT")       tx = -0.62;
    else if (dir === "RIGHT") tx =  0.62;
    else                      tx =  0.0;
    tx += (Math.random() - 0.5) * 0.10;
    const ty = 0.62 + Math.random() * 0.3;
    this.ball.hit(tx, ty, "player");
    this.sfx.hit();
    this.stats.onHit();
    this.rallyCount++;

    // Hit stop (Phase 1): 2 frames of freeze
    this.hitstop.trigger(2);

    // Particles
    const bp = project(this.ball.x, this.ball.y, this.ball.z);
    this.particles.emit(bp.sx, bp.sy, {
      count: 9, speed: 2.2, decay: 0.07, color: COLORS.ball,
      angle: -Math.PI/2, spread: Math.PI * 0.85, gravity: 0.05
    });
    this.flash.trigger(0.11);
  }
} // end class Game

// ============================================================================
//  BOOT
// ============================================================================
function start() { new Game(document.getElementById("game")); }
if (document.fonts && document.fonts.ready) {
  let started = false;
  const fire = () => { if (!started) { started = true; start(); } };
  document.fonts.ready.then(fire);
  setTimeout(fire, 1500);
} else {
  window.addEventListener("load", start);
}
