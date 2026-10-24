/* ============================================================
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
   XBYTE GAMES STUDIOS — script.js (Modernized)
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
   Preserves: Loading, Navbar, Scroll Reveal, Testimonials,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
              Contact Form, Back-to-Top, Typing, Easter Egg,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
              Cart infrastructure
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
   Adds: Three.js hero particle field, GSAP smooth-scroll nav
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
         with sliding pill + arrival pulse, topographic canvas
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
         background (Sobre Nós), rising-particles footer canvas,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
         3D tilt on cards, GSAP scroll parallax, Stat Counter.
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
   All new effects are additive and degrade gracefully if the
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
   GSAP / Three.js CDNs fail to load — core site functionality
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
   never depends on them.
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
   ============================================================ */

  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
'use strict';

// ===== GLOBAL FX SETUP =====
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const FINE_POINTER    = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const HAS_GSAP        = typeof window.gsap !== 'undefined';

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
if (HAS_GSAP) {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (window.ScrollTrigger)  gsap.registerPlugin(ScrollTrigger);
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (window.ScrollToPlugin) gsap.registerPlugin(ScrollToPlugin);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== LOADING SCREEN =====
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
window.addEventListener('load', () => {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const loadingScreen = document.getElementById('loading-screen');
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const loadingText   = loadingScreen.querySelector('.loading-text');

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const messages = ['Iniciando sistemas...', 'Carregando assets...', 'Preparando experiência...'];
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let mIdx = 0;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const msgTimer = setInterval(() => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    mIdx = (mIdx + 1) % messages.length;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (loadingText) loadingText.textContent = messages[mIdx];
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  }, 900);

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  setTimeout(() => {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    clearInterval(msgTimer);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    loadingScreen.classList.add('hidden');
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    setTimeout(() => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      loadingScreen.style.display = 'none';
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      initHeroCanvas();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      initTypingEffect();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      initStatCounters();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    }, 600);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  }, 2900);
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
});

// ===== HERO BACKGROUND (Three.js depth scene, 2D fallback) =====
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function initHeroCanvas() {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const canvas = document.getElementById('hero-canvas');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!canvas) return;

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (typeof THREE !== 'undefined') {
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    try {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      initHeroThree(canvas);
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      return;
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    } catch (err) {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      console.warn('Three.js hero scene failed, falling back to 2D canvas.', err);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  initHeroCanvas2D(canvas);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function initHeroThree(canvas) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const heroSection = canvas.closest('.hero');
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let width  = canvas.offsetWidth  || window.innerWidth;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let height = canvas.offsetHeight || window.innerHeight;

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  renderer.setSize(width, height, false);

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const scene  = new THREE.Scene();
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 2000);
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  camera.position.z = 420;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  scene.fog = new THREE.FogExp2(0x040c18, 0.0014);

  // Particle field — depth cloud
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const isMobile = window.innerWidth < 768;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const COUNT = isMobile ? 220 : 480;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const positions = new Float32Array(COUNT * 3);
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  for (let i = 0; i < COUNT; i++) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    positions[i * 3]     = (Math.random() - 0.5) * 900;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    positions[i * 3 + 1] = (Math.random() - 0.5) * 620;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    positions[i * 3 + 2] = (Math.random() - 0.5) * 700;
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const geo = new THREE.BufferGeometry();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const mat = new THREE.PointsMaterial({
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    color: 0x2e8bff,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    size: 3.2,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    transparent: true,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    opacity: 0.85,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    blending: THREE.AdditiveBlending,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    depthWrite: false,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    sizeAttenuation: true,
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const points = new THREE.Points(geo, mat);
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  scene.add(points);

  // Wireframe icosahedron — subtle tech centerpiece for depth
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const icoGeo = new THREE.IcosahedronGeometry(190, 1);
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x00b9ff, wireframe: true, transparent: true, opacity: 0.09 });
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const ico = new THREE.Mesh(icoGeo, icoMat);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  ico.position.set(0, 0, -180);
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  scene.add(ico);

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let mouseX = 0, mouseY = 0, camX = 0, camY = 0;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!REDUCED_MOTION && FINE_POINTER) {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    window.addEventListener('mousemove', (e) => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      mouseX = (e.clientX / window.innerWidth) - 0.5;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      mouseY = (e.clientY / window.innerHeight) - 0.5;
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
    });
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function resize() {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    width  = canvas.offsetWidth  || window.innerWidth;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    height = canvas.offsetHeight || window.innerHeight;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    camera.aspect = width / height;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    camera.updateProjectionMatrix();
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    renderer.setSize(width, height, false);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  window.addEventListener('resize', resize);

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let raf = null;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const clock = new THREE.Clock();
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function animate() {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    raf = requestAnimationFrame(animate);
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const dt = Math.min(clock.getDelta(), 0.05);

  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    points.rotation.y += dt * (REDUCED_MOTION ? 0.005 : 0.02);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    ico.rotation.y     += dt * (REDUCED_MOTION ? 0.008 : 0.035);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    ico.rotation.x     += dt * (REDUCED_MOTION ? 0.004 : 0.015);

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (!REDUCED_MOTION && FINE_POINTER) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      camX += (mouseX * 60 - camX) * 0.04;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      camY += (-mouseY * 40 - camY) * 0.04;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      camera.position.x = camX;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      camera.position.y = camY;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      camera.lookAt(0, 0, 0);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    renderer.render(scene, camera);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  animate();

  // Pause rendering while the hero is scrolled out of view (perf)
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (heroSection) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const io = new IntersectionObserver((entries) => {
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
      entries.forEach((entry) => {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
        if (entry.isIntersecting) { if (!raf) animate(); }
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
        else if (raf) { cancelAnimationFrame(raf); raf = null; }
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
      });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    }, { threshold: 0 });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    io.observe(heroSection);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// Original 2D canvas particle network — used only if Three.js is unavailable
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function initHeroCanvas2D(canvas) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const ctx = canvas.getContext('2d');
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let W, H, particles, animId;

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const CONFIG = {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    count:        65,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    speed:        0.35,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    connectDist:  145,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    dotRadius:    1.8,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    dotColor:     '26, 107, 255',
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    lineOpacity:  0.12,
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  };

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function resize() {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    W = canvas.width  = canvas.offsetWidth;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    H = canvas.height = canvas.offsetHeight;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    buildParticles();
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function buildParticles() {
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    particles = Array.from({ length: CONFIG.count }, () => ({
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      x:  Math.random() * W,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      y:  Math.random() * H,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      vx: (Math.random() - 0.5) * CONFIG.speed,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      vy: (Math.random() - 0.5) * CONFIG.speed,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      r:  CONFIG.dotRadius * (0.6 + Math.random() * 0.8),
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      o:  0.25 + Math.random() * 0.55,
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
    }));
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function draw() {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    ctx.clearRect(0, 0, W, H);

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    for (const p of particles) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      p.x += p.vx;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      p.y += p.vy;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (p.x < 0 || p.x > W) p.vx *= -1;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (p.y < 0 || p.y > H) p.vy *= -1;

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      ctx.beginPath();
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      ctx.fillStyle = `rgba(${CONFIG.dotColor}, ${p.o})`;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      ctx.fill();
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    for (let i = 0; i < particles.length; i++) {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      for (let j = i + 1; j < particles.length; j++) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
        const dx   = particles[i].x - particles[j].x;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
        const dy   = particles[i].y - particles[j].y;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
        const dist = Math.sqrt(dx * dx + dy * dy);

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
        if (dist < CONFIG.connectDist) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
          const alpha = (1 - dist / CONFIG.connectDist) * CONFIG.lineOpacity;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
          ctx.beginPath();
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
          ctx.moveTo(particles[i].x, particles[i].y);
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
          ctx.lineTo(particles[j].x, particles[j].y);
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
          ctx.strokeStyle = `rgba(${CONFIG.dotColor}, ${alpha})`;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
          ctx.lineWidth = 0.8;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
          ctx.stroke();
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
        }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
      }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }

  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    animId = requestAnimationFrame(draw);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  window.addEventListener('resize', () => {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    cancelAnimationFrame(animId);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    resize();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    draw();
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });

  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  resize();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  draw();
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== NAVBAR =====
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const navbar     = document.getElementById('navbar');
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const navToggle  = document.getElementById('nav-toggle');
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const navMenu    = document.getElementById('nav-menu');
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const navLinks   = document.querySelectorAll('.nav-link');

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
window.addEventListener('scroll', () => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  navbar.classList.toggle('scrolled', window.scrollY > 80);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  updateActiveLink();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  toggleBackToTop();
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
});

  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
navToggle.addEventListener('click', () => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  navToggle.classList.toggle('active');
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  navMenu.classList.toggle('active');
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
});

  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
navLinks.forEach(link => {
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  link.addEventListener('click', () => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    navToggle.classList.remove('active');
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    navMenu.classList.remove('active');
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    document.body.style.overflow = '';
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
});

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
let lastActiveHref = null;
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function updateActiveLink() {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let current = '';
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  document.querySelectorAll('section[id]').forEach(sec => {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const newHref = `#${current}`;
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  navLinks.forEach(link => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    link.classList.toggle('active', link.getAttribute('href') === newHref);
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (newHref !== lastActiveHref) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    lastActiveHref = newHref;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (window.__moveNavPill) window.__moveNavPill(document.querySelector('.nav-link.active'));
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// Sliding "pill" that glides smoothly beneath the active navbar link
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function initNavPill() {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!navMenu || window.innerWidth < 769) return;

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const pill = document.createElement('div');
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  pill.className = 'nav-pill';
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  navMenu.insertBefore(pill, navMenu.firstChild);

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function movePill(link) {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (!link) { pill.style.opacity = 0; return; }
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const menuRect = navMenu.getBoundingClientRect();
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const linkRect = link.getBoundingClientRect();
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const x = linkRect.left - menuRect.left;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const w = linkRect.width;

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (HAS_GSAP) {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      gsap.to(pill, { x, width: w, opacity: 1, duration: 0.45, ease: 'power3.out' });
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    } else {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      pill.style.transform = `translateX(${x}px)`;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      pill.style.width     = `${w}px`;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      pill.style.opacity   = 1;
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  window.__moveNavPill = movePill;

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  requestAnimationFrame(() => {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const active = document.querySelector('.nav-link.active') || navLinks[0];
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    movePill(active);
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  window.addEventListener('resize', () => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    movePill(document.querySelector('.nav-link.active'));
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== SMOOTH SCROLL =====
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  anchor.addEventListener('click', function (e) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const href = this.getAttribute('href');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (!href || href.length < 2) return;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const target = document.querySelector(href);
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (!target) return;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    e.preventDefault();

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (HAS_GSAP && window.ScrollToPlugin) {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      gsap.to(window, {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
        duration: REDUCED_MOTION ? 0.2 : 1.1,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
        scrollTo: { y: target, offsetY: 74 },
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
        ease: 'power3.inOut',
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
        onComplete: () => pulseSectionTitle(target),
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
      });
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    } else {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      target.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'start' });
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      setTimeout(() => pulseSectionTitle(target), 500);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
});

// Gentle glow pulse on a section's title when navigation arrives there
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function pulseSectionTitle(target) {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!HAS_GSAP || REDUCED_MOTION) return;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const title = target.querySelector('.section-title');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!title) return;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  gsap.fromTo(
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    title,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    { filter: 'drop-shadow(0 0 0px rgba(0, 185, 255, 0))' },
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      filter: 'drop-shadow(0 0 16px rgba(0, 185, 255, 0.75))',
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      duration: 0.5,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      yoyo: true,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      repeat: 1,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      ease: 'sine.inOut',
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  );
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== SCROLL REVEAL =====
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const revealObserver = new IntersectionObserver(
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  entries => entries.forEach(e => {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (e.isIntersecting) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      e.target.classList.add('revealed');
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      revealObserver.unobserve(e.target);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  }),
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
);
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

// ===== STAT COUNTERS (animated numbers) =====
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function initStatCounters() {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const statObserver = new IntersectionObserver(entries => {
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    entries.forEach(entry => {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (!entry.isIntersecting) return;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const el     = entry.target;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const target = parseInt(el.dataset.target);
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (isNaN(target)) return;

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      let current  = 0;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const step   = Math.ceil(target / 40);
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const timer  = setInterval(() => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
        current += step;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
        if (current >= target) { el.textContent = target; clearInterval(timer); }
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
        else                     el.textContent = current;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      }, 50);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      statObserver.unobserve(el);
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
    });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  }, { threshold: 0.5 });

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  document.querySelectorAll('.stat-number[data-target]').forEach(el => statObserver.observe(el));
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== TYPING EFFECT =====
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function initTypingEffect() {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const el = document.getElementById('hero-typing-target');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!el) return;

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const texts = [
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    'Criando experiências imersivas que transcendem realidades',
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    'Desenvolvendo jogos indie com paixão e inovação',
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    'Transformando ideias em mundos digitais únicos',
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  ];

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  setTimeout(() => new TypingEffect(el, texts, 75), 1800);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
class TypingEffect {
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  constructor(el, texts, speed = 80) {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.el        = el;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.texts     = texts;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.speed     = speed;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.textIdx   = 0;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.charIdx   = 0;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.deleting  = false;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.el.textContent = texts[0];
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    setTimeout(() => this.tick(), 2200);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  tick() {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const cur = this.texts[this.textIdx];

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (this.deleting) {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      this.el.textContent = cur.substring(0, --this.charIdx);
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    } else {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      this.el.textContent = cur.substring(0, ++this.charIdx);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    let delay = this.deleting ? this.speed / 2.2 : this.speed;

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (!this.deleting && this.charIdx === cur.length) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      delay = 2400;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      this.deleting = true;
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    } else if (this.deleting && this.charIdx === 0) {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      this.deleting = false;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      this.textIdx  = (this.textIdx + 1) % this.texts.length;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      delay = 450;
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    setTimeout(() => this.tick(), delay);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== TESTIMONIALS SLIDER =====
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
class TestimonialsSlider {
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  constructor() {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.idx    = 0;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.slides = document.querySelectorAll('.testimonial-card');
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.dots   = document.querySelectorAll('.dot');
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.timer  = null;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (!this.slides.length) return;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.show(0);
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.bindEvents();
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.start();
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  show(idx) {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.slides.forEach(s => s.classList.remove('active'));
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.dots.forEach(d => d.classList.remove('active'));
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.slides[idx].classList.add('active');
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.dots[idx].classList.add('active');
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.idx = idx;
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  next() { this.show((this.idx + 1) % this.slides.length); }

  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  bindEvents() {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.dots.forEach((d, i) => d.addEventListener('click', () => { this.show(i); this.restart(); }));
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const slider = document.querySelector('.testimonials-slider');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (slider) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      slider.addEventListener('mouseenter', () => this.stop());
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      slider.addEventListener('mouseleave', () => this.start());
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  start()   { this.timer = setInterval(() => this.next(), 5000); }
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  stop()    { clearInterval(this.timer); }
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  restart() { this.stop(); this.start(); }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== CONTACT FORM =====
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const contactForm = document.getElementById('contact-form');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
if (contactForm) {
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  contactForm.addEventListener('submit', function (e) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    e.preventDefault();
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const btn  = this.querySelector('button[type="submit"]');
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const orig = btn.innerHTML;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    btn.disabled  = true;

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    setTimeout(() => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      this.reset();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      btn.innerHTML = orig;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      btn.disabled  = false;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    }, 2000);
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== NOTIFICATION SYSTEM =====
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function showNotification(message, type = 'info') {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  document.querySelectorAll('.notification').forEach(n => n.remove());

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const n = document.createElement('div');
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  n.className = `notification notification-${type}`;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  n.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    </div>`;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  document.body.appendChild(n);

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  requestAnimationFrame(() => n.classList.add('show'));

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const close = () => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    n.classList.remove('show');
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    setTimeout(() => n.remove(), 350);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  };
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  n.querySelector('.notification-close').addEventListener('click', close);
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  setTimeout(close, 5000);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== BACK TO TOP =====
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const backToTop = document.getElementById('back-to-top');

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function toggleBackToTop() {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
if (backToTop) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== PARALLAX (hero watermark) =====
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
(function initWatermarkParallax() {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const watermark = document.querySelector('.hero-logo-watermark');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!watermark) return;

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (HAS_GSAP && window.ScrollTrigger && !REDUCED_MOTION) {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    gsap.to(watermark, {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      y: () => window.innerHeight * 0.3,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      ease: 'none',
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
      scrollTrigger: {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
        trigger: '.hero',
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
        start: 'top top',
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
        end: 'bottom top',
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
        scrub: true,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      },
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
    });
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  } else {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    window.addEventListener('scroll', () => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      watermark.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
    });
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
})();

// ===== 3D CARD TILT (depth-on-hover, desktop only) =====
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function initCardTilt() {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!HAS_GSAP || REDUCED_MOTION || !FINE_POINTER) return;

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const cards = document.querySelectorAll('.project-card, .game-card, .service-card, .team-card');
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  cards.forEach(card => {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const lift = card.classList.contains('service-card') ? -6 : -8;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    gsap.set(card, { transformPerspective: 900, transformStyle: 'preserve-3d' });

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const rotateY = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3.out' });
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const rotateX = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3.out' });
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const liftY   = gsap.quickTo(card, 'y',       { duration: 0.5, ease: 'power3.out' });

  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    card.addEventListener('mousemove', (e) => {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const rect = card.getBoundingClientRect();
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const px = (e.clientX - rect.left) / rect.width  - 0.5;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const py = (e.clientY - rect.top)  / rect.height - 0.5;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      rotateY(px * 8);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      rotateX(py * -8);
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
    });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    card.addEventListener('mouseenter', () => liftY(lift));
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    card.addEventListener('mouseleave', () => { rotateY(0); rotateX(0); liftY(0); });
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// Subtle tilt on the About section portrait — echoes the card tilt for depth
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function initAboutImageTilt() {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!HAS_GSAP || REDUCED_MOTION || !FINE_POINTER) return;

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const wrap = document.querySelector('.about-image');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!wrap) return;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  gsap.set(wrap, { transformPerspective: 1000, transformStyle: 'preserve-3d' });

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const rotateY = gsap.quickTo(wrap, 'rotateY', { duration: 0.6, ease: 'power3.out' });
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const rotateX = gsap.quickTo(wrap, 'rotateX', { duration: 0.6, ease: 'power3.out' });

  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  wrap.addEventListener('mousemove', (e) => {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const rect = wrap.getBoundingClientRect();
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const px = (e.clientX - rect.left) / rect.width  - 0.5;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const py = (e.clientY - rect.top)  / rect.height - 0.5;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    rotateY(px * 8);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    rotateX(py * -8);
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  wrap.addEventListener('mouseleave', () => { rotateY(0); rotateX(0); });
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== PROJECT DEMOS (auto-played gameplay on hover / tap / keyboard focus) =====
// Each .project-card[data-demo] shows a poster; the looping auto-play recording is only attached to the
// <img class="demo-anim"> while the demo is running, so idle cards cost nothing (no decoding, no battery).
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function initProjectDemos() {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const cards = document.querySelectorAll('.project-card[data-demo]');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!cards.length) return;

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const clickToggles = !canHover || REDUCED_MOTION; // touch devices / reduced-motion users start the demo on purpose
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let active = null;

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function setPlaying(card, on) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const anim = card.querySelector('.demo-anim');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (!anim) return;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (on) {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (active && active !== card) setPlaying(active, false); // one demo at a time
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      active = card;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      card.classList.add('is-playing');
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      anim.classList.remove('is-ready');
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      anim.onload = () => { if (card.classList.contains('is-playing')) anim.classList.add('is-ready'); };
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      anim.src = card.dataset.demo;
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    } else {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (active === card) active = null;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      card.classList.remove('is-playing');
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      anim.classList.remove('is-ready');
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      anim.onload = null;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      anim.removeAttribute('src');
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const toggle = (card) => setPlaying(card, !card.classList.contains('is-playing'));

  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  cards.forEach((card) => {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (canHover && !REDUCED_MOTION) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      card.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') setPlaying(card, true); });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      card.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') setPlaying(card, false); });
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    card.addEventListener('click', (e) => {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (e.target.closest('a')) return; // the GitHub link must keep working
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (clickToggles) toggle(card);
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
    });
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    card.addEventListener('keydown', (e) => {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (e.target !== card) return;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(card); }
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
    });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    card.addEventListener('focusin', () => { if (!REDUCED_MOTION && card.matches(':focus-visible')) setPlaying(card, true); });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    card.addEventListener('focusout', (e) => { if (!card.contains(e.relatedTarget)) setPlaying(card, false); });
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });

  // stop when the card is scrolled away or the tab is hidden
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if ('IntersectionObserver' in window) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const io = new IntersectionObserver((entries) => {
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
      entries.forEach((en) => {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
        if ((!en.isIntersecting || en.intersectionRatio < 0.35) && en.target.classList.contains('is-playing')) setPlaying(en.target, false);
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
      });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    }, { threshold: [0, 0.35] });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    cards.forEach((c) => io.observe(c));
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  document.addEventListener('visibilitychange', () => { if (document.hidden && active) setPlaying(active, false); });

  // warm the cache shortly before the section is reached (skipped on data-saver / 2G connections)
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const conn = navigator.connection || {};
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const lite = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const section = document.getElementById('projetos');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!lite && section && 'IntersectionObserver' in window) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const keep = [];
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const pre = new IntersectionObserver((entries, obs) => {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (!entries.some((e) => e.isIntersecting)) return;
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
      cards.forEach((c) => {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
        const url = c.dataset.demo;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
        if (url && !url.startsWith('data:')) { const im = new Image(); im.decoding = 'async'; im.src = url; keep.push(im); }
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
      });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      obs.disconnect();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    }, { rootMargin: '500px 0px' });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    pre.observe(section);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== SHARED NOISE UTILITY (compact simplex noise, used by About bg) =====
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const XByteSimplexNoise = (function () {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const grad3 = [
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  ];

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function SimplexNoise(seed) {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.perm = new Uint8Array(512);
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    this.permMod12 = new Uint8Array(512);
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const p = new Uint8Array(256);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    seed = seed || Math.random() * 65536;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    for (let i = 0; i < 256; i++) p[i] = i;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    for (let i = 255; i > 0; i--) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      seed = (seed * 16807) % 2147483647;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const j = seed % (i + 1);
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    for (let i = 0; i < 512; i++) {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      this.perm[i] = p[i & 255];
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      this.permMod12[i] = this.perm[i] % 12;
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const F3 = 1 / 3, G3 = 1 / 6;
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  SimplexNoise.prototype.noise3D = function (xin, yin, zin) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const perm = this.perm, permMod12 = this.permMod12;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    let n0, n1, n2, n3;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const s = (xin + yin + zin) * F3;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const t = (i + j + k) * G3;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const X0 = i - t, Y0 = j - t, Z0 = k - t;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    let i1, j1, k1, i2, j2, k2;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (x0 >= y0) {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (y0 >= z0)      { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      else               { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    } else {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (y0 < z0)       { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      else if (x0 < z0)  { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      else               { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const x1 = x0 - i1 + G3,   y1 = y0 - j1 + G3,   z1 = z0 - k1 + G3;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const x2 = x0 - i2 + 2*G3, y2 = y0 - j2 + 2*G3, z2 = z0 - k2 + 2*G3;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const x3 = x0 - 1 + 3*G3,  y3 = y0 - 1 + 3*G3,  z3 = z0 - 1 + 3*G3;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const ii = i & 255, jj = j & 255, kk = k & 255;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    n0 = t0 < 0 ? 0 : (t0*=t0, t0*t0*dot3(grad3[permMod12[ii+perm[jj+perm[kk]]]], x0, y0, z0));
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    n1 = t1 < 0 ? 0 : (t1*=t1, t1*t1*dot3(grad3[permMod12[ii+i1+perm[jj+j1+perm[kk+k1]]]], x1, y1, z1));
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    n2 = t2 < 0 ? 0 : (t2*=t2, t2*t2*dot3(grad3[permMod12[ii+i2+perm[jj+j2+perm[kk+k2]]]], x2, y2, z2));
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    n3 = t3 < 0 ? 0 : (t3*=t3, t3*t3*dot3(grad3[permMod12[ii+1+perm[jj+1+perm[kk+1]]]], x3, y3, z3));
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    return 32 * (n0 + n1 + n2 + n3);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  };
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function dot3(g, x, y, z) { return g[0]*x + g[1]*y + g[2]*z; }

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  return SimplexNoise;
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
})();

// ===== ABOUT SECTION — TOPOGRAPHIC CONTOUR BACKGROUND =====
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function initAboutTopographic() {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const canvas  = document.getElementById('about-topo-canvas');
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const section = document.getElementById('sobre');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!canvas || !section) return;

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const ctx   = canvas.getContext('2d');
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const noise = new XByteSimplexNoise(73);
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const dpr   = Math.min(window.devicePixelRatio || 1, 1.75);

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const CELL_SIZE   = window.innerWidth < 768 ? 18 : 13;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const NUM_CONTOURS = 9;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const NOISE_SCALE  = 0.0032;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const TIME_SPEED   = 0.11;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const BG_FILL      = '#070f1f'; // matches --bg-secondary

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const colors = {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    deep: { r: 18,  g: 46,  b: 110 },
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    mid:  { r: 26,  g: 107, b: 255 }, // --blue-accent
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    high: { r: 0,   g: 185, b: 255 }, // --blue-neon
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  };
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function rgba(c, a) { return `rgba(${c.r},${c.g},${c.b},${a})`; }
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function lerpC(a, b, t) {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    return { r: Math.round(a.r + (b.r-a.r)*t), g: Math.round(a.g + (b.g-a.g)*t), b: Math.round(a.b + (b.b-a.b)*t) };
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const EDGE_TABLE = [
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    [], [[3,2]], [[2,1]], [[3,1]], [[1,0]], [[1,0],[3,2]], [[2,0]], [[3,0]],
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    [[0,3]], [[0,2]], [[0,3],[2,1]], [[0,1]], [[1,3]], [[1,2]], [[2,3]], []
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  ];
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function interp(v1, v2, threshold) {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (Math.abs(v2 - v1) < 0.0001) return 0.5;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    return (threshold - v1) / (v2 - v1);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function edgePoint(edge, cx, cy, cw, ch, tl, tr, br, bl, threshold) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    let t;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    switch (edge) {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      case 0: t = interp(tl, tr, threshold); return [cx + t*cw, cy];
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      case 1: t = interp(tr, br, threshold); return [cx + cw, cy + t*ch];
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      case 2: t = interp(bl, br, threshold); return [cx + t*cw, cy + ch];
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      case 3: t = interp(tl, bl, threshold); return [cx, cy + t*ch];
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function fbm(x, y, z) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    let val = 0, amp = 1, freq = 1, sum = 0;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    for (let o = 0; o < 4; o++) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      val += noise.noise3D(x*freq, y*freq, z) * amp;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      sum += amp; amp *= 0.5; freq *= 2;
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    return val / sum;
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let W, H, field = new Float32Array(0), fieldCols = 0, fieldRows = 0;
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function resize() {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    W = section.offsetWidth;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    H = section.offsetHeight;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    canvas.width  = W * dpr;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    canvas.height = H * dpr;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    canvas.style.width  = W + 'px';
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    canvas.style.height = H + 'px';
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  window.addEventListener('resize', resize);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  resize();

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let mouseX = 0, mouseY = 0, mouseActive = false;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!REDUCED_MOTION && FINE_POINTER) {
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    canvas.addEventListener('mousemove', (e) => {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const rect = canvas.getBoundingClientRect();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      mouseX = e.clientX - rect.left;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      mouseY = e.clientY - rect.top;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      mouseActive = true;
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
    });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    canvas.addEventListener('mouseleave', () => { mouseActive = false; });
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let time = 0, lastTime = 0;
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function drawFrame(timestamp) {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (!lastTime) lastTime = timestamp;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    lastTime = timestamp;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (!REDUCED_MOTION) time += dt * TIME_SPEED;

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    ctx.fillStyle = BG_FILL;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    ctx.fillRect(0, 0, W, H);

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const cols = Math.ceil(W / CELL_SIZE) + 1;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const rows = Math.ceil(H / CELL_SIZE) + 1;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (cols !== fieldCols || rows !== fieldRows) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      fieldCols = cols; fieldRows = rows;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      field = new Float32Array(cols * rows);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    for (let j = 0; j < rows; j++) {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      for (let i = 0; i < cols; i++) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
        const x = i * CELL_SIZE, y = j * CELL_SIZE;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
        let val = fbm(x * NOISE_SCALE, y * NOISE_SCALE, time);
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
        if (mouseActive) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
          const mdx = x - mouseX, mdy = y - mouseY;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
          const md = Math.sqrt(mdx*mdx + mdy*mdy);
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
          const radius = Math.min(W, H) * 0.28;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
          if (md < radius) { const falloff = 1 - md / radius; val += 0.4 * falloff * falloff; }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
        }
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
        field[j * cols + i] = val;
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
      }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    let minVal = Infinity, maxVal = -Infinity;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    for (let k = 0; k < field.length; k++) {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (field[k] < minVal) minVal = field[k];
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (field[k] > maxVal) maxVal = field[k];
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const range = maxVal - minVal || 1;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    for (let k = 0; k < field.length; k++) field[k] = (field[k] - minVal) / range;

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    for (let c = 0; c < NUM_CONTOURS; c++) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const threshold = (c + 1) / (NUM_CONTOURS + 1);
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const lineColor = threshold < 0.5
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
        ? lerpC(colors.deep, colors.mid, threshold * 2)
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
        : lerpC(colors.mid, colors.high, (threshold - 0.5) * 2);

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const distFromCenter = Math.abs(threshold - 0.5) * 2;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const baseAlpha = 0.16 + (1 - distFromCenter) * 0.30;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const isMajor = (c % 4 === 0);
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const sharpWidth = isMajor ? 1.1 : 0.6;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const glowWidth  = isMajor ? 3.5 : 2;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const sharpAlpha = baseAlpha * (isMajor ? 0.9 : 0.65);
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const glowAlpha  = baseAlpha * 0.2;

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const segments = [];
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      for (let j = 0; j < rows - 1; j++) {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
        for (let i = 0; i < cols - 1; i++) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
          const tl = field[j*cols + i], tr = field[j*cols + i + 1];
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
          const br = field[(j+1)*cols + i + 1], bl = field[(j+1)*cols + i];
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
          const caseIdx = (tl>=threshold?8:0)|(tr>=threshold?4:0)|(br>=threshold?2:0)|(bl>=threshold?1:0);
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
          const edges = EDGE_TABLE[caseIdx];
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
          if (!edges || !edges.length) continue;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
          const cx = i * CELL_SIZE, cy = j * CELL_SIZE;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
          for (let e = 0; e < edges.length; e++) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
            const p1 = edgePoint(edges[e][0], cx, cy, CELL_SIZE, CELL_SIZE, tl, tr, br, bl, threshold);
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
            const p2 = edgePoint(edges[e][1], cx, cy, CELL_SIZE, CELL_SIZE, tl, tr, br, bl, threshold);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
            segments.push(p1[0], p1[1], p2[0], p2[1]);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
          }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
        }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
      }
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (!segments.length) continue;

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      ctx.beginPath();
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      for (let s = 0; s < segments.length; s += 4) { ctx.moveTo(segments[s], segments[s+1]); ctx.lineTo(segments[s+2], segments[s+3]); }
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      ctx.strokeStyle = rgba(lineColor, glowAlpha); ctx.lineWidth = glowWidth; ctx.lineCap = 'round'; ctx.stroke();

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      ctx.beginPath();
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      for (let s = 0; s < segments.length; s += 4) { ctx.moveTo(segments[s], segments[s+1]); ctx.lineTo(segments[s+2], segments[s+3]); }
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      ctx.strokeStyle = rgba(lineColor, sharpAlpha); ctx.lineWidth = sharpWidth; ctx.lineCap = 'round'; ctx.stroke();
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let raf = null, running = false;
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function loop(ts) { drawFrame(ts); if (running) raf = requestAnimationFrame(loop); }
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function start() { if (running) return; running = true; lastTime = 0; raf = requestAnimationFrame(loop); }
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function stop()  { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (REDUCED_MOTION) {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    requestAnimationFrame((ts) => drawFrame(ts)); // single static frame
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  } else {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const io = new IntersectionObserver((entries) => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      entries.forEach((e) => (e.isIntersecting ? start() : stop()));
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    }, { threshold: 0.05 });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    io.observe(section);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== FOOTER — RISING PARTICLES BACKGROUND =====
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function initFooterParticles() {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (REDUCED_MOTION) return;

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const canvas    = document.getElementById('footer-particles-canvas');
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const container = canvas ? canvas.closest('.footer-top') : null;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!canvas || !container) return;

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const ctx = canvas.getContext('2d');
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const RATE  = 0.55;   // motes spawned per "tick" (scaled by dt)
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const MAX   = 90;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const COLOR = '0, 185, 255';

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let W, H, particles = [];
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function resize() {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    W = container.offsetWidth;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    H = container.offsetHeight;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    canvas.width  = W * dpr;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    canvas.height = H * dpr;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    canvas.style.width  = W + 'px';
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    canvas.style.height = H + 'px';
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  window.addEventListener('resize', resize);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  resize();

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function spawn() {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (particles.length >= MAX) return;
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
    particles.push({
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      x: Math.random() * W,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      y: H + 8,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      r: 1 + Math.random() * 2.4,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      vy: 0.22 + Math.random() * 0.45,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      wobble: Math.random() * Math.PI * 2,
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      wobbleSpeed: 0.5 + Math.random(),
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      o: 0.15 + Math.random() * 0.35,
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
    });
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let spawnAcc = 0, lastTime = 0;
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function drawFrame(ts) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const dt = Math.min((ts - lastTime) / 1000, 0.05);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    lastTime = ts;

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    ctx.clearRect(0, 0, W, H);

  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    spawnAcc += RATE * dt * 60;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    while (spawnAcc >= 1) { spawn(); spawnAcc -= 1; }

  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    for (let i = particles.length - 1; i >= 0; i--) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const p = particles[i];
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      p.y -= p.vy * dt * 60;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      p.wobble += p.wobbleSpeed * dt;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      p.x += Math.sin(p.wobble) * 0.35;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (p.y < -10) { particles.splice(i, 1); continue; }

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const fadeTop = H * 0.22;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const fade = p.y < fadeTop ? Math.max(0, p.y / fadeTop) : 1;

  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      ctx.beginPath();
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      ctx.fillStyle = `rgba(${COLOR}, ${p.o * fade})`;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
      ctx.fill();
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  let raf = null, running = false;
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function loop(ts) { drawFrame(ts); if (running) raf = requestAnimationFrame(loop); }
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function start() { if (running) return; running = true; lastTime = performance.now(); raf = requestAnimationFrame(loop); }
  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
  function stop()  { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const io = new IntersectionObserver((entries) => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    entries.forEach((e) => (e.isIntersecting ? start() : stop()));
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  }, { threshold: 0 });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  io.observe(container);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== IMAGE LAZY LOADING =====
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const imgObserver = new IntersectionObserver((entries, obs) => {
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  entries.forEach(entry => {
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (entry.isIntersecting) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
      const img = entry.target;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
      if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
      obs.unobserve(img);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
    }
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
});
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));

// ===== KONAMI EASTER EGG =====
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
let konamiSeq = [];
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const konamiCode = [
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
];
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
document.addEventListener('keydown', e => {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  konamiSeq.push(e.code);
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (konamiSeq.length > konamiCode.length) konamiSeq.shift();
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (konamiSeq.join() === konamiCode.join()) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    activateEasterEgg();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
    konamiSeq = [];
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
  }
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
});

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function activateEasterEgg() {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const style = document.createElement('style');
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  style.id = 'easter-style';
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  style.textContent = `@keyframes hueShift { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }`;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  document.head.appendChild(style);
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  document.body.style.animation = 'hueShift 3s linear infinite';
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  showNotification('🎮 Código Konami ativado! XBYTE Easter Egg desbloqueado! 🎮', 'success');
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  setTimeout(() => {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    document.body.style.animation = '';
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
    document.getElementById('easter-style')?.remove();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  }, 6000);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// ===== CART INFRASTRUCTURE (preserved, not displayed) =====
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
const products = {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  'z890-aorus-elite':   { name: 'Z890 AORUS Elite WIFI7',       price: 2899.00, image: 'assets/images/CCh1CxCxlaEH.jpg',    specs: {}, description: '' },
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  'z890-aorus-xtreme':  { name: 'Z890 AORUS Xtreme AI TOP',     price: 4599.00, image: 'assets/images/nMUkda5cPHSW.jpg',    specs: {}, description: '' },
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  'z890-aorus-master':  { name: 'Z890 AORUS Master WIFI7',      price: 3699.00, image: 'assets/images/WqvYCzAkaHUg.jpeg',   specs: {}, description: '' },
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  'b550-gaming-x':      { name: 'B550 Gaming X V2',             price:  899.00, image: 'assets/images/YDwIddNSWCFt.jpg',    specs: {}, description: '' },
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  'b760m-gaming-x':     { name: 'B760M Gaming X AX DDR4',       price: 1299.00, image: 'assets/images/LPJKlpswsu7D.jpg',    specs: {}, description: '' },
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  'z390-gaming-x':      { name: 'Z390 Gaming X',                price:  699.00, image: 'assets/images/yTbQnFlhRXdY.jpg',    specs: {}, description: '' },
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
};

  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
let cart = [];

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function addToCart(productId) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const product = products[productId];
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!product) return;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const existing = cart.find(i => i.id === productId);
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (existing) existing.quantity += 1;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  else cart.push({ id: productId, name: product.name, price: product.price, image: product.image, quantity: 1 });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  updateCartUI();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  showNotification(`${product.name} adicionado ao carrinho!`, 'success');
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function removeFromCart(productId) {
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  cart = cart.filter(i => i.id !== productId);
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  updateCartUI();
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function updateCartQuantity(productId, change) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const item = cart.find(i => i.id === productId);
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!item) return;
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  item.quantity += change;
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (item.quantity <= 0) removeFromCart(productId);
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  else updateCartUI();
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function updateCartUI() {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const countEl = document.getElementById('cart-count');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (countEl) countEl.textContent = cart.reduce((s, i) => s + i.quantity, 0);
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function showProductDetails(productId) {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const product = products[productId];
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (!product) return;
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const modal = document.getElementById('product-modal');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (modal) modal.classList.add('open');
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function showCheckoutModal() {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
  const modal = document.getElementById('checkout-modal');
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
  if (modal) modal.classList.add('open');
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

  // Declaração de função/classe: define o componente reutilizável descrito pelo nome e pelo corpo a seguir.
function finishCheckout() {
  // Abertura de bloco de execução; as instruções internas formam o escopo deste componente.
  ['checkout-modal', 'cart-sidebar'].forEach(id => {
  // Declaração: cria ou inicializa a variável usada pela lógica indicada nesta instrução.
    const el = document.getElementById(id);
  // Controle de fluxo: avalia a condição ou encerra/itera a execução conforme indicado.
    if (el) el.classList.remove('open');
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
  });
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  cart = [];
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  updateCartUI();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  showNotification('Obrigado pela sua compra!', 'success');
  // Fechamento do bloco, chamada ou expressão iniciada anteriormente.
}

// Global exports
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
window.addToCart          = addToCart;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
window.removeFromCart     = removeFromCart;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
window.updateCartQuantity = updateCartQuantity;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
window.showProductDetails = showProductDetails;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
window.showCheckoutModal  = showCheckoutModal;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
window.finishCheckout     = finishCheckout;
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
window.showNotification   = showNotification;

// ===== INIT =====
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
document.addEventListener('DOMContentLoaded', () => {
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  new TestimonialsSlider();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  initNavPill();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  initAboutTopographic();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  initFooterParticles();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  initCardTilt();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  initAboutImageTilt();
  // Instrução do componente atual; realiza a etapa indicada pela expressão JavaScript.
  initProjectDemos();
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  console.log('%c🎮 XBYTE Games Studios', 'font-size:16px; font-weight:bold; color:#1a6bff;');
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  console.log('%c💻 Todos os sistemas iniciados.', 'color:#00b9ff;');
  // Instrução: executa a operação indicada, como configurar estado, registrar evento, desenhar ou agendar trabalho.
  console.log('%c🚀 Tente o Código Konami ↑↑↓↓←→←→BA', 'color:#7baad4;');
  // Continuação ou fechamento de bloco/callback da operação imediatamente acima.
});
