/**
 * GALACTIC BLACK HOLE - LOST DEITY ARCADE
 *
 * Implementação fiel ao projeto original Galactic Black Hole.
 * Restaura: profundidade visual, escala cósmica, distorções espaciais,
 * disco de acreção com shaders GLSL/FBM, bloom UnrealBloomPass cinematográfico,
 * 45 000 estrelas, lensing gravitacional, fotosfera e aura de entidade superior.
 *
 * Carregado como SCRIPT GLOBAL CLÁSSICO (não ES module) para máxima compatibilidade:
 * funciona em file://, redes restritas, sem CORS, sem depender de importmap.
 * THREE e os addons de postprocessing (EffectComposer/RenderPass/UnrealBloomPass)
 * já estão disponíveis em window.THREE pelos <script> carregados antes deste arquivo
 * no index.html (build legada r128 com /examples/js, formato UMD).
 *
 * Se o pipeline de bloom não estiver disponível por qualquer motivo (CDN bloqueado,
 * offline, etc.), o background ainda renderiza normalmente sem bloom — nunca fica
 * em branco / ausente.
 *
 * @version 2.1.0 – Faithful restore, classic-script & offline-safe
 */

(function () {
  if (typeof THREE === 'undefined') {
    console.error('[BlackHole] THREE.js não carregado. Verifique a tag <script> do three.min.js no index.html.');
    window.blackHoleBg = {
      init() {}, start() {}, stop() {}, triggerDiskEcho() {},
    };
    return;
  }

// ─────────────────────────────────────────────────────────────────────────────
//  BLACK HOLE CONSTANTS  (identical to original Galactic Black Hole project)
// ─────────────────────────────────────────────────────────────────────────────
const BH_RADIUS            = 1.0;
const DISK_INNER           = BH_RADIUS + 0.15;   // 1.15
const DISK_OUTER           = 5.5;
const LENSING_RADIUS       = BH_RADIUS + 0.07;   // 1.07
const PHOTON_RADIUS        = BH_RADIUS * 1.5;    // 1.5
const GLOW_FACTOR          = 1.07;

// ─────────────────────────────────────────────────────────────────────────────
//  INFERNO THEME  (default from original; can be extended later)
// ─────────────────────────────────────────────────────────────────────────────
const THEME = {
  diskHot:        new THREE.Color(0xffffff),
  diskMid:        new THREE.Color(0xffaa33),
  diskEdge:       new THREE.Color(0xcc331a),
  diskDeep:       new THREE.Color(0x661a00),
  lensing:        new THREE.Color(0xffcc66),
  glow:           new THREE.Color(0xff8833),
  photonSphere:   new THREE.Color(0xffbb44),
  primaryWave:    new THREE.Color(0xffaa33),
  secondaryWave:  new THREE.Color(0xff5500),
  tertiaryWave:   new THREE.Color(0xffdd22),
};

// ─────────────────────────────────────────────────────────────────────────────
//  CLASS
// ─────────────────────────────────────────────────────────────────────────────
class BlackHoleBackground {
  constructor() {
    this.isActive   = false;
    this.container  = null;
    this.renderer   = null;
    this.composer   = null;
    this.bloomPass  = null;
    this.scene      = null;
    this.camera     = null;
    this.clock      = new THREE.Clock();
    this.animationId = null;

    // sub-objects (populated in _build*)
    this._stars       = null;
    this._starMat     = null;
    this._diskMat     = null;
    this._photonMat   = null;
    this._lensingMat  = null;
    this._glowMat     = null;

    // disk-echo state
    this._echoActive    = false;
    this._echoIntensity = 0;
    this._echoStartTime = 0;
    this._lastEchoTime  = -Infinity;
    this._ECHO_DURATION = 2.8;
    this._ECHO_COOLDOWN = 0.5;
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API
  // ─────────────────────────────────────────────

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn('[BlackHole] Container not found:', containerId);
      return;
    }

    // O container pode estar com display:none no momento do init() (antes do
    // primeiro start()), então clientWidth/Height podem ser 0. Usamos o
    // tamanho do canvas-wrapper (pai) ou o CONFIG do jogo como fallback,
    // garantindo que o renderer NUNCA seja criado com 0x0.
    const fallbackW = (window.CONFIG && CONFIG.CANVAS && CONFIG.CANVAS.WIDTH)  || 1024;
    const fallbackH = (window.CONFIG && CONFIG.CANVAS && CONFIG.CANVAS.HEIGHT) || 576;
    const w = this.container.clientWidth  || fallbackW;
    const h = this.container.clientHeight || fallbackH;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000004, 0.085);

    // Camera
    this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 2000);
    this.camera.position.set(0, 15, 18);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    // outputEncoding/sRGBEncoding é a API do THREE r128 (outputColorSpace só existe a partir do r152)
    if ('outputColorSpace' in this.renderer) {
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if ('outputEncoding' in this.renderer) {
      this.renderer.outputEncoding = THREE.sRGBEncoding;
    }
    this.renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.95;
    this.container.appendChild(this.renderer.domElement);

    // Build all geometry & materials
    this._buildStarField();
    this._buildEventHorizon();
    this._buildAccretionDisk();
    this._buildPhotonSphere();
    this._buildLensingEffect();
    this._buildGlow();

    // Postprocessing (com fallback seguro — o cenário SEMPRE renderiza,
    // com ou sem bloom, mesmo se o CDN dos addons falhar ao carregar)
    this._setupBloom(w, h);
  }

  /**
   * Configura o pipeline de bloom (UnrealBloomPass). Se as classes globais
   * THREE.EffectComposer / THREE.RenderPass / THREE.UnrealBloomPass não
   * existirem (CDN bloqueado, offline, rede restrita), o cenário continua
   * funcionando normalmente via renderer.render() direto, sem bloom.
   */
  _setupBloom(w, h) {
    const hasComposer =
      typeof THREE.EffectComposer  === 'function' &&
      typeof THREE.RenderPass      === 'function' &&
      typeof THREE.UnrealBloomPass === 'function';

    if (!hasComposer) {
      console.warn('[BlackHole] Addons de postprocessing indisponíveis — renderizando sem bloom.');
      this.composer  = null;
      this.bloomPass = null;
      return;
    }

    try {
      this.composer  = new THREE.EffectComposer(this.renderer);
      this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
      this.bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(w, h),
        0.7,   // strength
        0.7,   // radius
        0.75   // threshold
      );
      this.composer.addPass(this.bloomPass);
      console.log('[BlackHole] Inicializado com pipeline de bloom completo ✓');
    } catch (err) {
      console.warn('[BlackHole] Falha ao montar o pipeline de bloom, usando fallback sem bloom:', err);
      this.composer  = null;
      this.bloomPass = null;
    }
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    this.container.style.display = 'block';

    // Garante que o renderer/câmera/composer usem o tamanho REAL do container
    // agora que ele está visível (no init() ele podia estar com display:none
    // e medir 0x0, então aqui recalculamos e ajustamos tudo).
    this._resizeToContainer();

    this.clock.start();
    this._startCameraAnimation();
    this._loop();
  }

  /** Recalcula dimensões do renderer/câmera/composer com base no container atual */
  _resizeToContainer() {
    if (!this.container || !this.renderer) return;
    const fallbackW = (window.CONFIG && CONFIG.CANVAS && CONFIG.CANVAS.WIDTH)  || 1024;
    const fallbackH = (window.CONFIG && CONFIG.CANVAS && CONFIG.CANVAS.HEIGHT) || 576;
    const w = this.container.clientWidth  || fallbackW;
    const h = this.container.clientHeight || fallbackH;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    if (this.composer) this.composer.setSize(w, h);
    if (this.bloomPass && this.bloomPass.resolution) {
      this.bloomPass.resolution.set(w, h);
    }
  }

  stop() {
    this.isActive = false;
    this.container.style.display = 'none';
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // ─────────────────────────────────────────────
  //  SCENE BUILDING
  // ─────────────────────────────────────────────

  /** 45 000 stars distributed via Fibonacci sphere, with per-star color & twinkle */
  _buildStarField() {
    const COUNT  = 45000;
    const RADIUS = 1200;
    const PHI    = (1 + Math.sqrt(5)) / 2;

    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);
    const alphas    = new Float32Array(COUNT);

    const base   = new THREE.Color(0xffffff);
    const blue   = new THREE.Color(0xaaddff);
    const yellow = new THREE.Color(0xffffaa);
    const red    = new THREE.Color(0xffcccc);

    for (let i = 0; i < COUNT; i++) {
      const i3    = i * 3;
      const theta = 2 * Math.PI * i / PHI;
      const phi   = Math.acos(1 - 2 * (i + 0.5) / COUNT);
      const r     = Math.cbrt(Math.random()) * RADIUS;

      positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      const col  = base.clone();
      const ct   = Math.random();
      let   ci   = Math.random() * 0.4 + 0.6;
      if      (ct < 0.50) { col.lerp(blue,   Math.random() * 0.30); }
      else if (ct < 0.85) { col.lerp(yellow, Math.random() * 0.20); ci *= 0.9; }
      else                { col.lerp(red,    Math.random() * 0.15); ci *= 0.8; }
      col.multiplyScalar(ci);
      colors[i3]     = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      const sv = Math.random();
      let sz   = sv > 0.997 ? THREE.MathUtils.randFloat(1.5, 2.2)
               : sv > 0.98  ? THREE.MathUtils.randFloat(0.8, 1.5)
               :               THREE.MathUtils.randFloat(0.3, 0.8);
      sz *= (1.0 - Math.min(1, r / RADIUS) * 0.3);
      sizes[i]  = sz;
      alphas[i] = Math.random() * 0.5 + 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));
    geo.setAttribute('alpha',    new THREE.BufferAttribute(alphas,    1));

    this._starMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:          { value: 0 },
        uEchoActive:    { value: 0 },
        uEchoIntensity: { value: 0 },
      },
      vertexShader: /* glsl */`
        attribute float size;
        attribute float alpha;
        varying vec3  vColor;
        varying float vAlpha;
        uniform float uEchoActive;
        uniform float uEchoIntensity;

        void main() {
          vColor = color;
          vAlpha = alpha;
          vec3 pos = position;
          if (uEchoActive > 0.0) {
            float d    = length(position);
            float push = uEchoIntensity * 0.025 * smoothstep(50.0, 300.0, d);
            pos = position * (1.0 + push);
          }
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (350.0 / -mv.z) * (1.0 + uEchoIntensity * 0.35);
          gl_Position  = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        uniform float uTime;
        uniform float uEchoIntensity;
        varying vec3  vColor;
        varying float vAlpha;

        void main() {
          float r = length(gl_PointCoord - vec2(0.5));
          float a = 1.0 - smoothstep(0.45, 0.5, r);
          if (a < 0.01) discard;
          float ts   = vAlpha * 1.5 + 0.5 + uEchoIntensity * 4.0;
          float tr   = 0.15 + uEchoIntensity * 0.4;
          float twkl = sin(uTime * ts + vAlpha * 10.0) * tr + 0.9;
          vec3  fc   = vColor * twkl * (1.0 + uEchoIntensity * 0.9);
          gl_FragColor = vec4(fc, a * vAlpha * (1.0 + uEchoIntensity * 0.45));
        }`,
      blending:     THREE.AdditiveBlending,
      depthWrite:   false,
      transparent:  true,
      vertexColors: true,
    });

    this._stars = new THREE.Points(geo, this._starMat);
    this.scene.add(this._stars);
  }

  /** Perfectly black event horizon sphere */
  _buildEventHorizon() {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(BH_RADIUS, 64, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    mesh.renderOrder = 0;
    this.scene.add(mesh);
  }

  /**
   * Accretion disk — full GLSL pipeline:
   * FBM noise + vortex spiral + Doppler beaming + relativistic redshift + ripple waves
   */
  _buildAccretionDisk() {
    const INN = DISK_INNER;
    const OUT = DISK_OUTER;

    this._diskMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:                     { value: 0 },
        uColorHot:                 { value: new THREE.Color().copy(THEME.diskHot)  },
        uColorMid:                 { value: new THREE.Color().copy(THEME.diskMid)  },
        uColorEdge:                { value: new THREE.Color().copy(THEME.diskEdge) },
        uColorDeep:                { value: new THREE.Color().copy(THEME.diskDeep) },
        uCameraPosition:           { value: this.camera.position },
        uRippleActive:             { value: 0 },
        uRippleStartTime:          { value: 0 },
        uRippleDuration:           { value: 2.8 },
        uPrimaryWaveColor:         { value: new THREE.Color().copy(THEME.primaryWave)   },
        uSecondaryWaveColor:       { value: new THREE.Color().copy(THEME.secondaryWave) },
        uTertiaryWaveColor:        { value: new THREE.Color().copy(THEME.tertiaryWave)  },
        uRippleMaxRadius:          { value: OUT },
        uRippleThickness:          { value: OUT * 0.12 },
        uRippleIntensity:          { value: 0 },
        uRippleDistortionStrength: { value: 0 },
      },
      vertexShader: /* glsl */`
        varying vec2  vUv;
        varying vec3  vPosition;
        varying float vRadius;
        uniform float uRippleDistortionStrength;
        uniform float uTime;

        void main() {
          vUv      = uv;
          vPosition = position;
          vRadius  = length(position.xy);
          vec3 pos = position;
          if (uRippleDistortionStrength > 0.0) {
            float ang = atan(position.y, position.x);
            pos.z += sin(ang * 10.0 + uTime * 7.0 + vRadius * 2.0)
                     * 0.08 * uRippleDistortionStrength;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }`,
      fragmentShader: /* glsl */`
        uniform float uTime;
        uniform vec3  uColorHot;
        uniform vec3  uColorMid;
        uniform vec3  uColorEdge;
        uniform vec3  uColorDeep;
        uniform vec3  uCameraPosition;
        varying vec2  vUv;
        varying vec3  vPosition;
        varying float vRadius;

        uniform float uRippleActive;
        uniform float uRippleStartTime;
        uniform float uRippleDuration;
        uniform vec3  uPrimaryWaveColor;
        uniform vec3  uSecondaryWaveColor;
        uniform vec3  uTertiaryWaveColor;
        uniform float uRippleMaxRadius;
        uniform float uRippleThickness;
        uniform float uRippleIntensity;

        // ── Noise ─────────────────────────────────────────────────────────────
        float rand(vec2 n){ return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453); }

        float noise(vec2 p){
          vec2 ip=floor(p); vec2 u=fract(p);
          u=u*u*(3.0-2.0*u);
          return mix(mix(rand(ip),        rand(ip+vec2(1,0)),u.x),
                     mix(rand(ip+vec2(0,1)),rand(ip+vec2(1,1)),u.x),u.y);
        }
        // Squaring inside noise() (original did res*res) – preserved for identical look
        float noise2(vec2 p){ float n=noise(p); return n*n; }

        float fbm(vec2 p, float tOff, float freq, int oct) {
          float tot=0.; float amp=0.65; float pers=0.5;
          for(int i=0;i<oct;i++){
            float ts=0.6+0.12*float(i);
            float nv=noise2(p*freq + vec2(tOff*ts*0.45, tOff*ts*0.3));
            tot+=amp*nv;
            vec2  wo=vec2(nv*0.18,-nv*0.12);
            p+=wo*amp*0.5;
            freq*=2.0; amp*=pers;
          }
          return tot;
        }

        float vortexPat(float dist, float ang, float t){
          float sp=sin(ang*2.3 + dist*0.28 + dist*5.8 - t*0.6*0.52);
          return smoothstep(-0.38,0.68,sp)*0.32;
        }

        // ── Ripple wave ───────────────────────────────────────────────────────
        float rippleWave(float dist, float prog, float rr, float thick, float spd) {
          if(prog<=0.0||prog>=1.0) return 0.0;
          float dt   = abs(dist-rr);
          float ht   = thick*0.5*mix(1.0,0.25,prog);
          float ef   = pow(1.0-prog, 0.8*spd);
          float ws   = smoothstep(ht, ht-(thick*0.25), dt);
          float ang  = atan(vPosition.y, vPosition.x);
          float am   = sin(ang*10.0+prog*15.0)*0.15+0.9;
          return ws*ef*am;
        }

        void main(){
          float dist  = vRadius;
          float inner = ${INN.toFixed(2)};
          float outer = ${OUT.toFixed(2)};
          float nPos  = clamp((dist-inner)/(outer-inner), 0.0, 1.0);
          float angle = atan(vPosition.y, vPosition.x);
          float orbV  = 1.0/sqrt(max(dist,0.1));

          // Doppler beaming
          float doppler=0.0; float beaming=1.0;
          if(length(uCameraPosition)>0.01){
            vec3 tang  = normalize(vec3(-vPosition.y,vPosition.x,0.0));
            vec3 toCam = normalize(uCameraPosition-vPosition);
            doppler    = dot(toCam,tang)*orbV*0.3;
            beaming    = clamp(1.0+doppler*0.4, 0.5, 2.0);
          }

          // FBM + vortex pattern
          float rotSpd  = 4.8/(pow(dist,1.6)+1.1);
          float rotAng  = angle - uTime*rotSpd*0.52;
          vec2  bc      = vec2(dist*1.9, rotAng*3.6);
          float et      = uTime*0.17;
          float nFast   = fbm(bc,        et*1.2, 2.2, 6);
          float nSlow   = fbm(bc*0.6,    et*0.5, 1.5, 4);
          float nv      = nFast*0.7 + nSlow*0.4;
          float vv      = vortexPat(dist, angle, uTime);
          float pat     = nv*0.8 + vv*1.1;

          // Temperature → color gradient
          float temp = clamp(orbV*(1.0+pat*0.3), 0.0, 2.0);
          vec3  ci   = mix(uColorHot,  uColorMid,  smoothstep(0.0,0.40,nPos)*(1.0-temp*0.3));
          vec3  co   = mix(uColorMid,  uColorEdge, smoothstep(0.40,0.80,nPos));
          vec3  cd   = mix(uColorEdge, uColorDeep, smoothstep(0.80,1.0, nPos));
          vec3  col  = mix(ci, co, smoothstep(0.40,0.80,nPos));
          col        = mix(col,cd, smoothstep(0.80,1.0, nPos));

          // Relativistic redshift
          col *= vec3(1.0+doppler*0.15, 1.0, 1.0-doppler*0.15);

          // Brightness
          float pb     = (pat+0.5)*1.15 + pow(max(0.0,pat-0.5),1.3)*0.6;
          float rb     = pow(1.0-smoothstep(0.0,0.8,nPos),1.9)*3.0 + 0.25;
          float bright = pb*rb*beaming;

          // ── Ripple system ─────────────────────────────────────────────────
          float ri = 0.0; vec3 rc = vec3(0.0);
          if(uRippleActive > 0.5){
            float rT   = uTime - uRippleStartTime;
            float rP   = clamp(rT/uRippleDuration, 0.0, 1.0);

            float sp1  = 1.0;
            float r1   = mix(inner, uRippleMaxRadius, rP*sp1);
            float i1   = rippleWave(dist,rP,r1,uRippleThickness,sp1);

            float sp2  = 0.75;
            float p2   = max(0.0,rP-0.1)*sp2;
            float r2   = mix(inner, uRippleMaxRadius*0.85, p2);
            float i2   = rippleWave(dist,p2,r2,uRippleThickness*0.8,sp2)*0.8;

            float sp3  = 0.5;
            float p3   = max(0.0,rP-0.2)*sp3;
            float r3   = mix(inner, uRippleMaxRadius*0.7, p3);
            float i3   = rippleWave(dist,p3,r3,uRippleThickness*0.6,sp3)*0.6;

            ri  = i1+i2+i3;
            rc  = uPrimaryWaveColor*i1 + uSecondaryWaveColor*i2 + uTertiaryWaveColor*i3;

            // Sparkle on wave front
            float spk  = rand(vUv*vec2(300.,500.) + uTime*vec2(20.+i1*10.,30.+i1*15.));
            float spkT = 0.985 - i1*0.03;
            if(i1>0.02 && spk>spkT){
              float sb = pow((spk-spkT)/(1.-spkT), 2.0);
              rc += mix(uPrimaryWaveColor, vec3(1.0), 0.6)*i1*sb*10.0*uRippleIntensity;
            }

            // Afterglow pulse
            float ag = sin(rP*15.0)*0.5+0.5;
            float ai = smoothstep(0.0,0.3,rP)*(1.0-rP)*0.4*ag;
            ri += ai*smoothstep(inner,inner+1.5,dist);
          }

          float rBoost = ri*9.0*uRippleIntensity;
          col *= (bright + rBoost);

          if(ri*uRippleIntensity > 0.01){
            float shim = sin(angle*20.0+uTime*10.0+dist*5.0)*0.15+0.9;
            col = mix(col, rc*shim*1.8, min(1.0, ri*uRippleIntensity*1.5));
          }

          // White-hot inner region
          float hb = smoothstep(3.0,5.0,bright+rBoost)*smoothstep(0.0,0.1,nPos);
          col = mix(col, vec3(1.0), hb*0.45);

          // Alpha
          float ia    = smoothstep(0.0,0.06,nPos);
          float oa    = 1.0-smoothstep(0.85,1.0,nPos);
          float naf   = clamp(pat*0.35+0.75, 0.65, 1.0);
          float alpha = ia*oa*naf + ri*0.9*uRippleIntensity;

          col = clamp(col, 0.0, 8.0);
          gl_FragColor = vec4(col, clamp(alpha,0.0,1.0));
        }`,
      transparent: true,
      side:        THREE.DoubleSide,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    const disk = new THREE.Mesh(
      new THREE.RingGeometry(INN, OUT, 128, 64),
      this._diskMat
    );
    disk.rotation.x  = Math.PI / 2.6;
    disk.renderOrder = 1;
    this.scene.add(disk);
  }

  /** Photon sphere — Fresnel glow that pulses and reacts to echo events */
  _buildPhotonSphere() {
    this._photonMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:          { value: 0 },
        uColor:         { value: new THREE.Color().copy(THEME.photonSphere) },
        uEchoActive:    { value: 0 },
        uEchoIntensity: { value: 0 },
      },
      vertexShader: /* glsl */`
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          vViewPos = -mv.xyz;
          vNormal  = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        uniform float uTime;
        uniform vec3  uColor;
        uniform float uEchoActive;
        uniform float uEchoIntensity;
        varying vec3 vNormal;
        varying vec3 vViewPos;

        void main(){
          vec3  vd = normalize(vViewPos);
          float fr = pow(1.0 - abs(dot(vd,vNormal)), 3.0);
          float pr = 2.0 + uEchoIntensity*8.0;
          float pd = 0.1 + uEchoIntensity*0.5;
          float p  = sin(uTime*pr)*pd + 0.9;
          float a  = fr*(0.3+uEchoIntensity*0.6)*p;
          vec3  fc = uColor;
          if(uEchoActive > 0.5){
            float cp = sin(uTime*4.0 + dot(vNormal,vec3(1.0))*5.0)*0.5+0.5;
            fc = mix(fc, fc*vec3(1.4,1.2,0.8), cp*uEchoIntensity*1.2)
                 * (1.0 + uEchoIntensity*0.7);
          }
          gl_FragColor = vec4(fc, a);
        }`,
      transparent: true,
      side:        THREE.FrontSide,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    const ps = new THREE.Mesh(
      new THREE.SphereGeometry(PHOTON_RADIUS, 64, 32),
      this._photonMat
    );
    ps.renderOrder = 4;
    this.scene.add(ps);
  }

  /** Gravitational lensing halo — Fresnel + noise distortion on the rim */
  _buildLensingEffect() {
    this._lensingMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:          { value: 0 },
        uLensingColor:  { value: new THREE.Color().copy(THEME.lensing) },
        uEchoActive:    { value: 0 },
        uEchoIntensity: { value: 0 },
      },
      vertexShader: /* glsl */`
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          vViewPos = -mv.xyz;
          vNormal  = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        uniform float uTime;
        uniform vec3  uLensingColor;
        uniform float uEchoActive;
        uniform float uEchoIntensity;
        varying vec3 vNormal;
        varying vec3 vViewPos;

        float rand(vec2 n){ return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453); }
        float noise(vec2 p){
          vec2 ip=floor(p); vec2 u=fract(p); u=u*u*(3.0-2.0*u);
          float r=mix(mix(rand(ip),rand(ip+vec2(1,0)),u.x),
                      mix(rand(ip+vec2(0,1)),rand(ip+vec2(1,1)),u.x),u.y);
          return r*r;
        }

        void main(){
          vec3  vd  = normalize(vViewPos);
          float fp  = 5.2 - uEchoIntensity*1.5;
          float fF  = pow(1.0 - abs(dot(vd,vNormal)), fp);
          float ps  = 0.55 + uEchoIntensity*3.0;
          float pd  = 0.12 + uEchoIntensity*0.4;
          float p   = sin(uTime*ps + length(vViewPos)*0.12)*pd + 0.95;
          float ns  = 7.0 + uEchoIntensity*5.0;
          float nsp = 0.35 + uEchoIntensity*1.2;
          float nv  = noise(vNormal.xy*ns + uTime*nsp)*(0.12+uEchoIntensity*0.15);
          vec3  dn  = normalize(vNormal + vec3(nv, nv*0.6, 0.0));
          float a   = fF*(0.68+uEchoIntensity*0.5)*p;
          a += pow(1.0-abs(dot(vd,dn)), 8.5-uEchoIntensity*3.5)*(0.38+uEchoIntensity*0.6);
          vec3 fc = uLensingColor;
          if(uEchoActive > 0.5){
            float cs = dot(vd,vNormal)*0.5+0.5;
            fc = mix(fc, fc*vec3(1.3,1.1,0.9), cs*uEchoIntensity)
                 * (1.0+uEchoIntensity*0.4);
          }
          gl_FragColor = vec4(fc, clamp(a,0.0,1.0)*0.90);
        }`,
      transparent: true,
      side:        THREE.FrontSide,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    const ls = new THREE.Mesh(
      new THREE.SphereGeometry(LENSING_RADIUS, 64, 32),
      this._lensingMat
    );
    ls.scale.multiplyScalar(1.62);
    ls.renderOrder = 2;
    this.scene.add(ls);
  }

  /** Outer glow — BackSide shader with noise flicker and echo flare */
  _buildGlow() {
    this._glowMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:          { value: 0 },
        uGlowColor:     { value: new THREE.Color().copy(THEME.glow) },
        uEchoActive:    { value: 0 },
        uEchoIntensity: { value: 0 },
        uEchoColor:     { value: new THREE.Color().copy(THEME.primaryWave) },
      },
      vertexShader: /* glsl */`
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          vViewPos = -mv.xyz;
          vNormal  = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        uniform float uTime;
        uniform vec3  uGlowColor;
        uniform float uEchoActive;
        uniform float uEchoIntensity;
        uniform vec3  uEchoColor;
        varying vec3 vNormal;
        varying vec3 vViewPos;

        float rand(vec2 n){ return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453); }
        float noise(vec2 p){
          vec2 ip=floor(p); vec2 u=fract(p); u=u*u*(3.0-2.0*u);
          float r=mix(mix(rand(ip),rand(ip+vec2(1,0)),u.x),
                      mix(rand(ip+vec2(0,1)),rand(ip+vec2(1,1)),u.x),u.y);
          return r*r;
        }

        void main(){
          float gp = 2.6 - uEchoIntensity*1.2;
          float i  = pow(0.68 - dot(vNormal, normalize(vViewPos)), gp);
          float ps = 0.7 + uEchoIntensity*7.0;
          float pd = 0.18 + uEchoIntensity*0.5;
          float p  = sin(uTime*ps + vNormal.y*1.8)*pd + 0.88;
          float ns = 9.0  + uEchoIntensity*8.0;
          float nsp= 1.8  + uEchoIntensity*6.0;
          float f  = noise(vNormal.xz*ns + uTime*nsp)*(0.35+uEchoIntensity*0.25)+0.75;
          float fI = clamp(i*p*f, 0.0, 1.0)*(0.92+uEchoIntensity*0.5);
          vec3  fc = uGlowColor;
          if(uEchoActive > 0.5){
            float fp  = noise(vNormal.xy*15.0+uTime*3.0)*noise(vNormal.yz*12.0+uTime*2.0);
            float fpp = sin(uTime*8.0+fp*10.0)*0.5+0.5;
            vec3 flare= mix(uGlowColor, uEchoColor, fpp);
            fc = mix(uGlowColor, flare*1.8, uEchoIntensity*fpp*1.2)*(1.0+uEchoIntensity*0.8);
          }
          gl_FragColor = vec4(fc, fI);
        }`,
      transparent: true,
      side:        THREE.BackSide,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    const g = new THREE.Mesh(
      new THREE.SphereGeometry(BH_RADIUS, 64, 32),
      this._glowMat
    );
    g.scale.multiplyScalar(GLOW_FACTOR * 1.16);
    g.renderOrder = 3;
    this.scene.add(g);
  }

  // ─────────────────────────────────────────────
  //  CAMERA INTRO  (same easing curve as original)
  // ─────────────────────────────────────────────

  _startCameraAnimation() {
    const from     = new THREE.Vector3(0, 15, 18);
    const to       = new THREE.Vector3(0, 5, 8);
    const DURATION = 4500;
    const t0       = Date.now();
    this.camera.position.copy(from);

    const tick = () => {
      if (!this.isActive) return;
      const elapsed = Date.now() - t0;
      if (elapsed < DURATION) {
        const t = 1 - Math.pow(1 - elapsed / DURATION, 5); // easeOutQuint
        this.camera.position.lerpVectors(from, to, t);
        this.camera.lookAt(0, 0, 0);
        requestAnimationFrame(tick);
      } else {
        this.camera.position.copy(to);
        this.camera.lookAt(0, 0, 0);
      }
    };
    tick();
  }

  // ─────────────────────────────────────────────
  //  DISK ECHO  (gravitational wave burst)
  // ─────────────────────────────────────────────

  triggerDiskEcho() {
    const now = this.clock.getElapsedTime();
    if (now - this._lastEchoTime < this._ECHO_COOLDOWN) return;
    this._lastEchoTime  = now;
    this._echoStartTime = now;
    this._echoActive    = true;

    this._diskMat.uniforms.uRippleActive.value    = 1.0;
    this._diskMat.uniforms.uRippleStartTime.value = now;
    this._diskMat.uniforms.uPrimaryWaveColor.value
      .copy(THEME.primaryWave).multiplyScalar(3.0);
    this._diskMat.uniforms.uSecondaryWaveColor.value
      .copy(THEME.secondaryWave).multiplyScalar(2.7);
    this._diskMat.uniforms.uTertiaryWaveColor.value
      .copy(THEME.tertiaryWave).multiplyScalar(2.4);
    this._glowMat.uniforms.uEchoColor.value
      .copy(THEME.primaryWave).multiplyScalar(1.8);

    if (this.bloomPass) {
      this.bloomPass.strength  = 1.3;
      this.bloomPass.threshold = 0.60;
    }
  }

  _updateEcho(elapsed) {
    if (!this._echoActive) return;
    const dt   = elapsed - this._echoStartTime;
    const norm = dt / this._ECHO_DURATION;

    let intensity;
    if (norm < 0.07) {
      intensity = norm / 0.07;
    } else {
      const t = (norm - 0.07) / (1.0 - 0.07);
      intensity = Math.pow(1.0 - t, 1.8)
                + Math.sin(t * Math.PI) * 0.35 * Math.pow(1.0 - t, 0.5);
    }
    const pulse = Math.sin(elapsed * 15) * 0.15 + 1.0;
    this._echoIntensity = Math.min(1.2, Math.max(0, intensity) * pulse);

    let distort = 0;
    if (norm < 0.4) distort = Math.sin((norm / 0.4) * Math.PI);
    this._diskMat.uniforms.uRippleDistortionStrength.value = distort * this._echoIntensity * 2.0;

    if (dt >= this._ECHO_DURATION) {
      this._echoActive    = false;
      this._echoIntensity = 0;
      this._diskMat.uniforms.uRippleActive.value              = 0;
      this._diskMat.uniforms.uRippleDistortionStrength.value  = 0;
      if (this.bloomPass) {
        this.bloomPass.strength  = 0.7;
        this.bloomPass.threshold = 0.75;
      }
    }

    const ea = this._echoActive ? 1.0 : 0.0;
    const ei = this._echoIntensity;

    this._diskMat.uniforms.uRippleIntensity.value          = ei;
    this._starMat.uniforms.uEchoActive.value               = ea;
    this._starMat.uniforms.uEchoIntensity.value            = ei;
    this._photonMat.uniforms.uEchoActive.value             = ea;
    this._photonMat.uniforms.uEchoIntensity.value          = ei;
    this._lensingMat.uniforms.uEchoActive.value            = ea;
    this._lensingMat.uniforms.uEchoIntensity.value         = ei;
    this._glowMat.uniforms.uEchoActive.value               = ea;
    this._glowMat.uniforms.uEchoIntensity.value            = ei;
  }

  // ─────────────────────────────────────────────
  //  RENDER LOOP
  // ─────────────────────────────────────────────

  _loop() {
    if (!this.isActive) return;
    this.animationId = requestAnimationFrame(() => this._loop());

    const delta   = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Time uniforms
    this._diskMat.uniforms.uTime.value           = elapsed;
    this._diskMat.uniforms.uCameraPosition.value.copy(this.camera.position);
    this._lensingMat.uniforms.uTime.value        = elapsed;
    this._glowMat.uniforms.uTime.value           = elapsed;
    this._starMat.uniforms.uTime.value           = elapsed;
    this._photonMat.uniforms.uTime.value         = elapsed;

    // Slow stellar drift
    this._stars.rotation.y += delta * 0.004;
    this._stars.rotation.x += delta * 0.0015;

    // Echo / ripple
    this._updateEcho(elapsed);

    // Render with bloom
    this.composer
      ? this.composer.render(delta)
      : this.renderer.render(this.scene, this.camera);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  GLOBAL SINGLETON  (same interface the StageManager expects)
// ─────────────────────────────────────────────────────────────────────────────
try {
  window.blackHoleBg = new BlackHoleBackground();
  console.log('[BlackHole] Módulo carregado e singleton criado ✓');
} catch (err) {
  console.error('[BlackHole] Falha crítica ao instanciar o background:', err);
  window.blackHoleBg = {
    init() {}, start() {}, stop() {}, triggerDiskEcho() {},
  };
}

})(); // fim da IIFE de proteção contra THREE indefinido
