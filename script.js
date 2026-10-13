/* ============================================================
   XBYTE GAMES STUDIOS — script.js (Modernized)
   Preserves: Loading, Navbar, Scroll Reveal, Testimonials,
              Contact Form, Back-to-Top, Typing, Easter Egg,
              Cart infrastructure
   Adds: Three.js hero particle field, GSAP smooth-scroll nav
         with sliding pill + arrival pulse, topographic canvas
         background (Sobre Nós), rising-particles footer canvas,
         3D tilt on cards, GSAP scroll parallax, Stat Counter.
   All new effects are additive and degrade gracefully if the
   GSAP / Three.js CDNs fail to load — core site functionality
   never depends on them.
   ============================================================ */

'use strict';

// ===== GLOBAL FX SETUP =====
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER    = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const HAS_GSAP        = typeof window.gsap !== 'undefined';

if (HAS_GSAP) {
  if (window.ScrollTrigger)  gsap.registerPlugin(ScrollTrigger);
  if (window.ScrollToPlugin) gsap.registerPlugin(ScrollToPlugin);
}

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingText   = loadingScreen.querySelector('.loading-text');

  const messages = ['Iniciando sistemas...', 'Carregando assets...', 'Preparando experiência...'];
  let mIdx = 0;
  const msgTimer = setInterval(() => {
    mIdx = (mIdx + 1) % messages.length;
    if (loadingText) loadingText.textContent = messages[mIdx];
  }, 900);

  setTimeout(() => {
    clearInterval(msgTimer);
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      initHeroCanvas();
      initTypingEffect();
      initStatCounters();
    }, 600);
  }, 2900);
});

// ===== HERO BACKGROUND (Three.js depth scene, 2D fallback) =====
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  if (typeof THREE !== 'undefined') {
    try {
      initHeroThree(canvas);
      return;
    } catch (err) {
      console.warn('Three.js hero scene failed, falling back to 2D canvas.', err);
    }
  }
  initHeroCanvas2D(canvas);
}

function initHeroThree(canvas) {
  const heroSection = canvas.closest('.hero');
  let width  = canvas.offsetWidth  || window.innerWidth;
  let height = canvas.offsetHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 2000);
  camera.position.z = 420;
  scene.fog = new THREE.FogExp2(0x040c18, 0.0014);

  // Particle field — depth cloud
  const isMobile = window.innerWidth < 768;
  const COUNT = isMobile ? 220 : 480;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 900;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 620;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 700;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x2e8bff,
    size: 3.2,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Wireframe icosahedron — subtle tech centerpiece for depth
  const icoGeo = new THREE.IcosahedronGeometry(190, 1);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x00b9ff, wireframe: true, transparent: true, opacity: 0.09 });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(0, 0, -180);
  scene.add(ico);

  let mouseX = 0, mouseY = 0, camX = 0, camY = 0;
  if (!REDUCED_MOTION && FINE_POINTER) {
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    });
  }

  function resize() {
    width  = canvas.offsetWidth  || window.innerWidth;
    height = canvas.offsetHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
  window.addEventListener('resize', resize);

  let raf = null;
  const clock = new THREE.Clock();
  function animate() {
    raf = requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);

    points.rotation.y += dt * (REDUCED_MOTION ? 0.005 : 0.02);
    ico.rotation.y     += dt * (REDUCED_MOTION ? 0.008 : 0.035);
    ico.rotation.x     += dt * (REDUCED_MOTION ? 0.004 : 0.015);

    if (!REDUCED_MOTION && FINE_POINTER) {
      camX += (mouseX * 60 - camX) * 0.04;
      camY += (-mouseY * 40 - camY) * 0.04;
      camera.position.x = camX;
      camera.position.y = camY;
      camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
  }
  animate();

  // Pause rendering while the hero is scrolled out of view (perf)
  if (heroSection) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { if (!raf) animate(); }
        else if (raf) { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0 });
    io.observe(heroSection);
  }
}

// Original 2D canvas particle network — used only if Three.js is unavailable
function initHeroCanvas2D(canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  const CONFIG = {
    count:        65,
    speed:        0.35,
    connectDist:  145,
    dotRadius:    1.8,
    dotColor:     '26, 107, 255',
    lineOpacity:  0.12,
  };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildParticles();
  }

  function buildParticles() {
    particles = Array.from({ length: CONFIG.count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r:  CONFIG.dotRadius * (0.6 + Math.random() * 0.8),
      o:  0.25 + Math.random() * 0.55,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.dotColor}, ${p.o})`;
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectDist) {
          const alpha = (1 - dist / CONFIG.connectDist) * CONFIG.lineOpacity;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CONFIG.dotColor}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });

  resize();
  draw();
}

// ===== NAVBAR =====
const navbar     = document.getElementById('navbar');
const navToggle  = document.getElementById('nav-toggle');
const navMenu    = document.getElementById('nav-menu');
const navLinks   = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
  updateActiveLink();
  toggleBackToTop();
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

let lastActiveHref = null;
function updateActiveLink() {
  let current = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
  });
  const newHref = `#${current}`;
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === newHref);
  });
  if (newHref !== lastActiveHref) {
    lastActiveHref = newHref;
    if (window.__moveNavPill) window.__moveNavPill(document.querySelector('.nav-link.active'));
  }
}

// Sliding "pill" that glides smoothly beneath the active navbar link
function initNavPill() {
  if (!navMenu || window.innerWidth < 769) return;

  const pill = document.createElement('div');
  pill.className = 'nav-pill';
  navMenu.insertBefore(pill, navMenu.firstChild);

  function movePill(link) {
    if (!link) { pill.style.opacity = 0; return; }
    const menuRect = navMenu.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const x = linkRect.left - menuRect.left;
    const w = linkRect.width;

    if (HAS_GSAP) {
      gsap.to(pill, { x, width: w, opacity: 1, duration: 0.45, ease: 'power3.out' });
    } else {
      pill.style.transform = `translateX(${x}px)`;
      pill.style.width     = `${w}px`;
      pill.style.opacity   = 1;
    }
  }

  window.__moveNavPill = movePill;

  requestAnimationFrame(() => {
    const active = document.querySelector('.nav-link.active') || navLinks[0];
    movePill(active);
  });

  window.addEventListener('resize', () => {
    movePill(document.querySelector('.nav-link.active'));
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();

    if (HAS_GSAP && window.ScrollToPlugin) {
      gsap.to(window, {
        duration: REDUCED_MOTION ? 0.2 : 1.1,
        scrollTo: { y: target, offsetY: 74 },
        ease: 'power3.inOut',
        onComplete: () => pulseSectionTitle(target),
      });
    } else {
      target.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'start' });
      setTimeout(() => pulseSectionTitle(target), 500);
    }
  });
});

// Gentle glow pulse on a section's title when navigation arrives there
function pulseSectionTitle(target) {
  if (!HAS_GSAP || REDUCED_MOTION) return;
  const title = target.querySelector('.section-title');
  if (!title) return;
  gsap.fromTo(
    title,
    { filter: 'drop-shadow(0 0 0px rgba(0, 185, 255, 0))' },
    {
      filter: 'drop-shadow(0 0 16px rgba(0, 185, 255, 0.75))',
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut',
    }
  );
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

// ===== STAT COUNTERS (animated numbers) =====
function initStatCounters() {
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      if (isNaN(target)) return;

      let current  = 0;
      const step   = Math.ceil(target / 40);
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else                     el.textContent = current;
      }, 50);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => statObserver.observe(el));
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
  const el = document.getElementById('hero-typing-target');
  if (!el) return;

  const texts = [
    'Criando experiências imersivas que transcendem realidades',
    'Desenvolvendo jogos indie com paixão e inovação',
    'Transformando ideias em mundos digitais únicos',
  ];

  setTimeout(() => new TypingEffect(el, texts, 75), 1800);
}

class TypingEffect {
  constructor(el, texts, speed = 80) {
    this.el        = el;
    this.texts     = texts;
    this.speed     = speed;
    this.textIdx   = 0;
    this.charIdx   = 0;
    this.deleting  = false;
    this.el.textContent = texts[0];
    setTimeout(() => this.tick(), 2200);
  }

  tick() {
    const cur = this.texts[this.textIdx];

    if (this.deleting) {
      this.el.textContent = cur.substring(0, --this.charIdx);
    } else {
      this.el.textContent = cur.substring(0, ++this.charIdx);
    }

    let delay = this.deleting ? this.speed / 2.2 : this.speed;

    if (!this.deleting && this.charIdx === cur.length) {
      delay = 2400;
      this.deleting = true;
    } else if (this.deleting && this.charIdx === 0) {
      this.deleting = false;
      this.textIdx  = (this.textIdx + 1) % this.texts.length;
      delay = 450;
    }

    setTimeout(() => this.tick(), delay);
  }
}

// ===== TESTIMONIALS SLIDER =====
class TestimonialsSlider {
  constructor() {
    this.idx    = 0;
    this.slides = document.querySelectorAll('.testimonial-card');
    this.dots   = document.querySelectorAll('.dot');
    this.timer  = null;
    if (!this.slides.length) return;
    this.show(0);
    this.bindEvents();
    this.start();
  }

  show(idx) {
    this.slides.forEach(s => s.classList.remove('active'));
    this.dots.forEach(d => d.classList.remove('active'));
    this.slides[idx].classList.add('active');
    this.dots[idx].classList.add('active');
    this.idx = idx;
  }

  next() { this.show((this.idx + 1) % this.slides.length); }

  bindEvents() {
    this.dots.forEach((d, i) => d.addEventListener('click', () => { this.show(i); this.restart(); }));
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
      slider.addEventListener('mouseenter', () => this.stop());
      slider.addEventListener('mouseleave', () => this.start());
    }
  }

  start()   { this.timer = setInterval(() => this.next(), 5000); }
  stop()    { clearInterval(this.timer); }
  restart() { this.stop(); this.start(); }
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn  = this.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled  = true;

    setTimeout(() => {
      showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
      this.reset();
      btn.innerHTML = orig;
      btn.disabled  = false;
    }, 2000);
  });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
  document.querySelectorAll('.notification').forEach(n => n.remove());

  const n = document.createElement('div');
  n.className = `notification notification-${type}`;
  n.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    </div>`;
  document.body.appendChild(n);

  requestAnimationFrame(() => n.classList.add('show'));

  const close = () => {
    n.classList.remove('show');
    setTimeout(() => n.remove(), 350);
  };
  n.querySelector('.notification-close').addEventListener('click', close);
  setTimeout(close, 5000);
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('back-to-top');

function toggleBackToTop() {
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
}

if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== PARALLAX (hero watermark) =====
(function initWatermarkParallax() {
  const watermark = document.querySelector('.hero-logo-watermark');
  if (!watermark) return;

  if (HAS_GSAP && window.ScrollTrigger && !REDUCED_MOTION) {
    gsap.to(watermark, {
      y: () => window.innerHeight * 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  } else {
    window.addEventListener('scroll', () => {
      watermark.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    });
  }
})();

// ===== 3D CARD TILT (depth-on-hover, desktop only) =====
function initCardTilt() {
  if (!HAS_GSAP || REDUCED_MOTION || !FINE_POINTER) return;

  const cards = document.querySelectorAll('.project-card, .game-card, .service-card');
  cards.forEach(card => {
    const lift = card.classList.contains('service-card') ? -6 : -8;
    gsap.set(card, { transformPerspective: 900, transformStyle: 'preserve-3d' });

    const rotateY = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3.out' });
    const rotateX = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3.out' });
    const liftY   = gsap.quickTo(card, 'y',       { duration: 0.5, ease: 'power3.out' });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width  - 0.5;
      const py = (e.clientY - rect.top)  / rect.height - 0.5;
      rotateY(px * 8);
      rotateX(py * -8);
    });
    card.addEventListener('mouseenter', () => liftY(lift));
    card.addEventListener('mouseleave', () => { rotateY(0); rotateX(0); liftY(0); });
  });
}

// Subtle tilt on the About section portrait — echoes the card tilt for depth
function initAboutImageTilt() {
  if (!HAS_GSAP || REDUCED_MOTION || !FINE_POINTER) return;

  const wrap = document.querySelector('.about-image');
  if (!wrap) return;
  gsap.set(wrap, { transformPerspective: 1000, transformStyle: 'preserve-3d' });

  const rotateY = gsap.quickTo(wrap, 'rotateY', { duration: 0.6, ease: 'power3.out' });
  const rotateX = gsap.quickTo(wrap, 'rotateX', { duration: 0.6, ease: 'power3.out' });

  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width  - 0.5;
    const py = (e.clientY - rect.top)  / rect.height - 0.5;
    rotateY(px * 8);
    rotateX(py * -8);
  });
  wrap.addEventListener('mouseleave', () => { rotateY(0); rotateX(0); });
}

// ===== SHARED NOISE UTILITY (compact simplex noise, used by About bg) =====
const XByteSimplexNoise = (function () {
  const grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];

  function SimplexNoise(seed) {
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    const p = new Uint8Array(256);
    seed = seed || Math.random() * 65536;
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      seed = (seed * 16807) % 2147483647;
      const j = seed % (i + 1);
      const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  const F3 = 1 / 3, G3 = 1 / 6;
  SimplexNoise.prototype.noise3D = function (xin, yin, zin) {
    const perm = this.perm, permMod12 = this.permMod12;
    let n0, n1, n2, n3;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const X0 = i - t, Y0 = j - t, Z0 = k - t;
    const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0;
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0)      { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
      else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
      else               { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
    } else {
      if (y0 < z0)       { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
      else if (x0 < z0)  { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
      else               { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
    }
    const x1 = x0 - i1 + G3,   y1 = y0 - j1 + G3,   z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2*G3, y2 = y0 - j2 + 2*G3, z2 = z0 - k2 + 2*G3;
    const x3 = x0 - 1 + 3*G3,  y3 = y0 - 1 + 3*G3,  z3 = z0 - 1 + 3*G3;
    const ii = i & 255, jj = j & 255, kk = k & 255;
    let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    n0 = t0 < 0 ? 0 : (t0*=t0, t0*t0*dot3(grad3[permMod12[ii+perm[jj+perm[kk]]]], x0, y0, z0));
    let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    n1 = t1 < 0 ? 0 : (t1*=t1, t1*t1*dot3(grad3[permMod12[ii+i1+perm[jj+j1+perm[kk+k1]]]], x1, y1, z1));
    let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    n2 = t2 < 0 ? 0 : (t2*=t2, t2*t2*dot3(grad3[permMod12[ii+i2+perm[jj+j2+perm[kk+k2]]]], x2, y2, z2));
    let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    n3 = t3 < 0 ? 0 : (t3*=t3, t3*t3*dot3(grad3[permMod12[ii+1+perm[jj+1+perm[kk+1]]]], x3, y3, z3));
    return 32 * (n0 + n1 + n2 + n3);
  };
  function dot3(g, x, y, z) { return g[0]*x + g[1]*y + g[2]*z; }

  return SimplexNoise;
})();

// ===== ABOUT SECTION — TOPOGRAPHIC CONTOUR BACKGROUND =====
function initAboutTopographic() {
  const canvas  = document.getElementById('about-topo-canvas');
  const section = document.getElementById('sobre');
  if (!canvas || !section) return;

  const ctx   = canvas.getContext('2d');
  const noise = new XByteSimplexNoise(73);
  const dpr   = Math.min(window.devicePixelRatio || 1, 1.75);

  const CELL_SIZE   = window.innerWidth < 768 ? 18 : 13;
  const NUM_CONTOURS = 9;
  const NOISE_SCALE  = 0.0032;
  const TIME_SPEED   = 0.11;
  const BG_FILL      = '#070f1f'; // matches --bg-secondary

  const colors = {
    deep: { r: 18,  g: 46,  b: 110 },
    mid:  { r: 26,  g: 107, b: 255 }, // --blue-accent
    high: { r: 0,   g: 185, b: 255 }, // --blue-neon
  };
  function rgba(c, a) { return `rgba(${c.r},${c.g},${c.b},${a})`; }
  function lerpC(a, b, t) {
    return { r: Math.round(a.r + (b.r-a.r)*t), g: Math.round(a.g + (b.g-a.g)*t), b: Math.round(a.b + (b.b-a.b)*t) };
  }

  const EDGE_TABLE = [
    [], [[3,2]], [[2,1]], [[3,1]], [[1,0]], [[1,0],[3,2]], [[2,0]], [[3,0]],
    [[0,3]], [[0,2]], [[0,3],[2,1]], [[0,1]], [[1,3]], [[1,2]], [[2,3]], []
  ];
  function interp(v1, v2, threshold) {
    if (Math.abs(v2 - v1) < 0.0001) return 0.5;
    return (threshold - v1) / (v2 - v1);
  }
  function edgePoint(edge, cx, cy, cw, ch, tl, tr, br, bl, threshold) {
    let t;
    switch (edge) {
      case 0: t = interp(tl, tr, threshold); return [cx + t*cw, cy];
      case 1: t = interp(tr, br, threshold); return [cx + cw, cy + t*ch];
      case 2: t = interp(bl, br, threshold); return [cx + t*cw, cy + ch];
      case 3: t = interp(tl, bl, threshold); return [cx, cy + t*ch];
    }
  }
  function fbm(x, y, z) {
    let val = 0, amp = 1, freq = 1, sum = 0;
    for (let o = 0; o < 4; o++) {
      val += noise.noise3D(x*freq, y*freq, z) * amp;
      sum += amp; amp *= 0.5; freq *= 2;
    }
    return val / sum;
  }

  let W, H, field = new Float32Array(0), fieldCols = 0, fieldRows = 0;
  function resize() {
    W = section.offsetWidth;
    H = section.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  let mouseX = 0, mouseY = 0, mouseActive = false;
  if (!REDUCED_MOTION && FINE_POINTER) {
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;
    });
    canvas.addEventListener('mouseleave', () => { mouseActive = false; });
  }

  let time = 0, lastTime = 0;
  function drawFrame(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    if (!REDUCED_MOTION) time += dt * TIME_SPEED;

    ctx.fillStyle = BG_FILL;
    ctx.fillRect(0, 0, W, H);

    const cols = Math.ceil(W / CELL_SIZE) + 1;
    const rows = Math.ceil(H / CELL_SIZE) + 1;
    if (cols !== fieldCols || rows !== fieldRows) {
      fieldCols = cols; fieldRows = rows;
      field = new Float32Array(cols * rows);
    }

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = i * CELL_SIZE, y = j * CELL_SIZE;
        let val = fbm(x * NOISE_SCALE, y * NOISE_SCALE, time);
        if (mouseActive) {
          const mdx = x - mouseX, mdy = y - mouseY;
          const md = Math.sqrt(mdx*mdx + mdy*mdy);
          const radius = Math.min(W, H) * 0.28;
          if (md < radius) { const falloff = 1 - md / radius; val += 0.4 * falloff * falloff; }
        }
        field[j * cols + i] = val;
      }
    }

    let minVal = Infinity, maxVal = -Infinity;
    for (let k = 0; k < field.length; k++) {
      if (field[k] < minVal) minVal = field[k];
      if (field[k] > maxVal) maxVal = field[k];
    }
    const range = maxVal - minVal || 1;
    for (let k = 0; k < field.length; k++) field[k] = (field[k] - minVal) / range;

    for (let c = 0; c < NUM_CONTOURS; c++) {
      const threshold = (c + 1) / (NUM_CONTOURS + 1);
      const lineColor = threshold < 0.5
        ? lerpC(colors.deep, colors.mid, threshold * 2)
        : lerpC(colors.mid, colors.high, (threshold - 0.5) * 2);

      const distFromCenter = Math.abs(threshold - 0.5) * 2;
      const baseAlpha = 0.16 + (1 - distFromCenter) * 0.30;
      const isMajor = (c % 4 === 0);
      const sharpWidth = isMajor ? 1.1 : 0.6;
      const glowWidth  = isMajor ? 3.5 : 2;
      const sharpAlpha = baseAlpha * (isMajor ? 0.9 : 0.65);
      const glowAlpha  = baseAlpha * 0.2;

      const segments = [];
      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const tl = field[j*cols + i], tr = field[j*cols + i + 1];
          const br = field[(j+1)*cols + i + 1], bl = field[(j+1)*cols + i];
          const caseIdx = (tl>=threshold?8:0)|(tr>=threshold?4:0)|(br>=threshold?2:0)|(bl>=threshold?1:0);
          const edges = EDGE_TABLE[caseIdx];
          if (!edges || !edges.length) continue;
          const cx = i * CELL_SIZE, cy = j * CELL_SIZE;
          for (let e = 0; e < edges.length; e++) {
            const p1 = edgePoint(edges[e][0], cx, cy, CELL_SIZE, CELL_SIZE, tl, tr, br, bl, threshold);
            const p2 = edgePoint(edges[e][1], cx, cy, CELL_SIZE, CELL_SIZE, tl, tr, br, bl, threshold);
            segments.push(p1[0], p1[1], p2[0], p2[1]);
          }
        }
      }
      if (!segments.length) continue;

      ctx.beginPath();
      for (let s = 0; s < segments.length; s += 4) { ctx.moveTo(segments[s], segments[s+1]); ctx.lineTo(segments[s+2], segments[s+3]); }
      ctx.strokeStyle = rgba(lineColor, glowAlpha); ctx.lineWidth = glowWidth; ctx.lineCap = 'round'; ctx.stroke();

      ctx.beginPath();
      for (let s = 0; s < segments.length; s += 4) { ctx.moveTo(segments[s], segments[s+1]); ctx.lineTo(segments[s+2], segments[s+3]); }
      ctx.strokeStyle = rgba(lineColor, sharpAlpha); ctx.lineWidth = sharpWidth; ctx.lineCap = 'round'; ctx.stroke();
    }
  }

  let raf = null, running = false;
  function loop(ts) { drawFrame(ts); if (running) raf = requestAnimationFrame(loop); }
  function start() { if (running) return; running = true; lastTime = 0; raf = requestAnimationFrame(loop); }
  function stop()  { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  if (REDUCED_MOTION) {
    requestAnimationFrame((ts) => drawFrame(ts)); // single static frame
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? start() : stop()));
    }, { threshold: 0.05 });
    io.observe(section);
  }
}

// ===== FOOTER — RISING PARTICLES BACKGROUND =====
function initFooterParticles() {
  if (REDUCED_MOTION) return;

  const canvas    = document.getElementById('footer-particles-canvas');
  const container = canvas ? canvas.closest('.footer-top') : null;
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const RATE  = 0.55;   // motes spawned per "tick" (scaled by dt)
  const MAX   = 90;
  const COLOR = '0, 185, 255';

  let W, H, particles = [];
  function resize() {
    W = container.offsetWidth;
    H = container.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function spawn() {
    if (particles.length >= MAX) return;
    particles.push({
      x: Math.random() * W,
      y: H + 8,
      r: 1 + Math.random() * 2.4,
      vy: 0.22 + Math.random() * 0.45,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.5 + Math.random(),
      o: 0.15 + Math.random() * 0.35,
    });
  }

  let spawnAcc = 0, lastTime = 0;
  function drawFrame(ts) {
    const dt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime = ts;

    ctx.clearRect(0, 0, W, H);

    spawnAcc += RATE * dt * 60;
    while (spawnAcc >= 1) { spawn(); spawnAcc -= 1; }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.y -= p.vy * dt * 60;
      p.wobble += p.wobbleSpeed * dt;
      p.x += Math.sin(p.wobble) * 0.35;
      if (p.y < -10) { particles.splice(i, 1); continue; }

      const fadeTop = H * 0.22;
      const fade = p.y < fadeTop ? Math.max(0, p.y / fadeTop) : 1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, ${p.o * fade})`;
      ctx.fill();
    }
  }

  let raf = null, running = false;
  function loop(ts) { drawFrame(ts); if (running) raf = requestAnimationFrame(loop); }
  function start() { if (running) return; running = true; lastTime = performance.now(); raf = requestAnimationFrame(loop); }
  function stop()  { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? start() : stop()));
  }, { threshold: 0 });
  io.observe(container);
}

// ===== IMAGE LAZY LOADING =====
const imgObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
      obs.unobserve(img);
    }
  });
});
document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));

// ===== KONAMI EASTER EGG =====
let konamiSeq = [];
const konamiCode = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'
];
document.addEventListener('keydown', e => {
  konamiSeq.push(e.code);
  if (konamiSeq.length > konamiCode.length) konamiSeq.shift();
  if (konamiSeq.join() === konamiCode.join()) {
    activateEasterEgg();
    konamiSeq = [];
  }
});

function activateEasterEgg() {
  const style = document.createElement('style');
  style.id = 'easter-style';
  style.textContent = `@keyframes hueShift { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }`;
  document.head.appendChild(style);
  document.body.style.animation = 'hueShift 3s linear infinite';
  showNotification('🎮 Código Konami ativado! XBYTE Easter Egg desbloqueado! 🎮', 'success');
  setTimeout(() => {
    document.body.style.animation = '';
    document.getElementById('easter-style')?.remove();
  }, 6000);
}

// ===== CART INFRASTRUCTURE (preserved, not displayed) =====
const products = {
  'z890-aorus-elite':   { name: 'Z890 AORUS Elite WIFI7',       price: 2899.00, image: 'assets/images/CCh1CxCxlaEH.jpg',    specs: {}, description: '' },
  'z890-aorus-xtreme':  { name: 'Z890 AORUS Xtreme AI TOP',     price: 4599.00, image: 'assets/images/nMUkda5cPHSW.jpg',    specs: {}, description: '' },
  'z890-aorus-master':  { name: 'Z890 AORUS Master WIFI7',      price: 3699.00, image: 'assets/images/WqvYCzAkaHUg.jpeg',   specs: {}, description: '' },
  'b550-gaming-x':      { name: 'B550 Gaming X V2',             price:  899.00, image: 'assets/images/YDwIddNSWCFt.jpg',    specs: {}, description: '' },
  'b760m-gaming-x':     { name: 'B760M Gaming X AX DDR4',       price: 1299.00, image: 'assets/images/LPJKlpswsu7D.jpg',    specs: {}, description: '' },
  'z390-gaming-x':      { name: 'Z390 Gaming X',                price:  699.00, image: 'assets/images/yTbQnFlhRXdY.jpg',    specs: {}, description: '' },
};

let cart = [];

function addToCart(productId) {
  const product = products[productId];
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) existing.quantity += 1;
  else cart.push({ id: productId, name: product.name, price: product.price, image: product.image, quantity: 1 });
  updateCartUI();
  showNotification(`${product.name} adicionado ao carrinho!`, 'success');
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  updateCartUI();
}

function updateCartQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) removeFromCart(productId);
  else updateCartUI();
}

function updateCartUI() {
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = cart.reduce((s, i) => s + i.quantity, 0);
}

function showProductDetails(productId) {
  const product = products[productId];
  if (!product) return;
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.add('open');
}

function showCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('open');
}

function finishCheckout() {
  ['checkout-modal', 'cart-sidebar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  });
  cart = [];
  updateCartUI();
  showNotification('Obrigado pela sua compra!', 'success');
}

// Global exports
window.addToCart          = addToCart;
window.removeFromCart     = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.showProductDetails = showProductDetails;
window.showCheckoutModal  = showCheckoutModal;
window.finishCheckout     = finishCheckout;
window.showNotification   = showNotification;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  new TestimonialsSlider();
  initNavPill();
  initAboutTopographic();
  initFooterParticles();
  initCardTilt();
  initAboutImageTilt();
  console.log('%c🎮 XBYTE Games Studios', 'font-size:16px; font-weight:bold; color:#1a6bff;');
  console.log('%c💻 Todos os sistemas iniciados.', 'color:#00b9ff;');
  console.log('%c🚀 Tente o Código Konami ↑↑↓↓←→←→BA', 'color:#7baad4;');
});
