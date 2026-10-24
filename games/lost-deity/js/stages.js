/**
 * LOST DEITY ARCADE - SISTEMA DE CENÁRIOS (STAGES)
 *
 * Sistema profissional de gerenciamento de backgrounds/stages
 * Suporta: backgrounds estáticos, animados com parallax, especiais e boss stages
 *
 * Arquitetura inspirada em King of Fighters e Fatal Fury
 */

// ============================================
// CONFIGURAÇÃO GLOBAL DE PERFORMANCE
// ============================================

const STAGE_CONFIG = {
  LOW_PERFORMANCE_MODE: false, // true = reduz animações em máquinas fracas
  PARALLAX_ENABLED: true,       // true = ativa parallax nos backgrounds
  ANIMATION_QUALITY: 'high',    // 'high', 'medium', 'low'
  MAX_PARTICLES: 50,            // Máximo de partículas quando animações ativas
}

// ============================================
// DEFINIÇÃO DOS CENÁRIOS
// ============================================

const STAGES = {
  // ==========================================
  // CENÁRIOS NORMAIS (Normal Stages)
  // ==========================================

  temple: {
    id: 'temple',
    name: 'Templo Antigo',
    category: 'normal',
    type: 'static', // static | animated | parallax
    imageSrc: './img/stages/normal/temple.png',
    layers: [
      './img/stages/normal/temple_layers/Plan 5.png',
      './img/stages/normal/temple_layers/Plan 4.png',
      './img/stages/normal/temple_layers/Plan 3.png',
      './img/stages/normal/temple_layers/Plan 2.png',
      './img/stages/normal/temple_layers/Plan 1.png',
    ],
    parallaxSpeeds: [0.2, 0.35, 0.5, 0.65, 0.8], // Velocidade de cada layer
    music: null, // TODO: './audio/temple.mp3'
    theme: 'classic',
    difficulty: 'normal',
    enabled: true,
    description: 'Um antigo templo perdido no tempo, onde guerreiros se encontram para combate.'
  },

  ruins: {
    id: 'ruins',
    name: 'Ruínas Misteriosas',
    category: 'normal',
    type: 'parallax',
    imageSrc: './img/stages/normal/ruins.png',
    layers: [
      './img/stages/normal/ruins_layers/Plan 6.png',
      './img/stages/normal/ruins_layers/Plan 5.png',
      './img/stages/normal/ruins_layers/Plan 4.png',
      './img/stages/normal/ruins_layers/Plan 3.png',
      './img/stages/normal/ruins_layers/Plan 2.png',
      './img/stages/normal/ruins_layers/Plan 1.png',
    ],
    parallaxSpeeds: [0.15, 0.3, 0.45, 0.6, 0.75, 0.9],
    music: null, // TODO: './audio/ruins.mp3'
    theme: 'ancient',
    difficulty: 'normal',
    enabled: true,
    description: 'Destroços de uma civilização perdida. Ecos do passado ecoam nos combates.'
  },

  forest: {
    id: 'forest',
    name: 'Floresta Sombria',
    category: 'normal',
    type: 'static',
    imageSrc: './img/stages/normal/forest.png',
    layers: null,
    parallaxSpeeds: [],
    music: null, // TODO: './audio/forest.mp3'
    theme: 'nature',
    difficulty: 'normal',
    enabled: true,
    description: 'Uma floresta densa e escura onde a natureza selvagem testemunha batalhas mortais.'
  },

  city: {
    id: 'city',
    name: 'Metrópole Urbana',
    category: 'normal',
    type: 'static',
    imageSrc: './img/stages/normal/city.png',
    layers: null,
    parallaxSpeeds: [],
    music: null, // TODO: './audio/city.mp3'
    theme: 'modern',
    difficulty: 'normal',
    enabled: true,
    description: 'Os arranha-céus de uma metrópole moderna servem como arena para competição.'
  },

  beach: {
    id: 'beach',
    name: 'Praia Paradisíaca',
    category: 'normal',
    type: 'static',
    imageSrc: './img/stages/normal/beach.png',
    layers: null,
    parallaxSpeeds: [],
    music: null, // TODO: './audio/beach.mp3'
    theme: 'tropical',
    difficulty: 'easy',
    enabled: true,
    description: 'Uma praia tranquila onde o clima festivo contrasta com a intensidade do combate.'
  },

  // ==========================================
  // CENÁRIOS ESPECIAIS (Special Stages)
  // Temas do universo Lost Deity
  // ==========================================

  creation: {
    id: 'creation',
    name: 'Dimensão da Criação',
    category: 'special',
    type: 'animated',
    imageSrc: './img/stages/special/creation.gif',
    layers: null,
    parallaxSpeeds: [],
    music: null, // TODO: './audio/creation.mp3'
    theme: 'divine',
    difficulty: 'hard',
    enabled: true,
    description: 'Realm de origem dos deuses primordiais. Energias divinas fluem livremente.',
    properties: {
      glowIntensity: 0.8,
      particleColor: '#FFD700',
      animationSpeed: 1.2
    }
  },

  chaos: {
    id: 'chaos',
    name: 'Abismo do Caos',
    category: 'special',
    type: 'animated',
    imageSrc: './img/stages/special/chaos.png',
    layers: null,
    parallaxSpeeds: [],
    music: null, // TODO: './audio/chaos.mp3'
    theme: 'corrupt',
    difficulty: 'hard',
    enabled: true,
    description: 'Onde a ordem desmorona e o caos reina supremo. Realidade é um conceito vago aqui.',
    properties: {
      glowIntensity: 0.6,
      particleColor: '#9400D3',
      animationSpeed: 1.5,
      distortionEnabled: true
    }
  },

  observers: {
    id: 'observers',
    name: 'Reino dos Observadores',
    category: 'special',
    type: 'static',
    imageSrc: './img/stages/special/observers.png',
    layers: null,
    parallaxSpeeds: [],
    music: null, // TODO: './audio/observers.mp3'
    theme: 'celestial',
    difficulty: 'hard',
    enabled: true,
    description: 'Antigos observadores testemunham cada movimento. Poder cósmico permeia o ar.',
    properties: {
      glowIntensity: 0.7,
      particleColor: '#00FFFF',
      animationSpeed: 0.8
    }
  },

  // ==========================================
  // CENÁRIOS DE CHEFE (Boss Stages)
  // ==========================================

  blackHole: {
    id: 'blackHole',
    name: 'Galactic Black Hole',
    category: 'boss',
    type: 'special',
    imageSrc: null,
    layers: null,
    parallaxSpeeds: [],
    music: null,
    theme: 'cosmic',
    difficulty: 'insane',
    enabled: true,
    description: 'O destino final. Um buraco negro consume tudo. Apenas o escolhido pode prevalecer.',
    properties: {
      glowIntensity: 1.0,
      particleColor: '#FF1493',
      animationSpeed: 2.0,
      is3D: true,
      renderMode: 'threejs'
    }
  }
}

// ============================================
// GERENCIADOR DE STAGES
// ============================================

class StageManager {
  constructor() {
    this.currentStage = null
    this.loadedImages = new Map()
    this.canvas = null
    this.ctx = null
  }

  /**
   * Inicializa o gerenciador com canvas do jogo
   * @param {HTMLCanvasElement} gameCanvas
   */
  initialize(gameCanvas) {
    this.canvas = gameCanvas
    this.ctx = gameCanvas.getContext('2d')
  }

  /**
   * Carrega um stage pela ID
   * @param {string} stageId
   * @returns {Object|null} Stage object ou null se não encontrado
   */
  async loadStage(stageId) {
    const stage = STAGES[stageId]

    if (!stage) {
      console.error(`Stage '${stageId}' not found in STAGES definition`)
      return null
    }

    if (!stage.enabled) {
      console.warn(`Stage '${stageId}' is disabled`)
      return null
    }

    // Gerenciamento especial para Three.js (Black Hole)
    if (this.blackHole) {
      this.blackHole.stop()
    }

    if (stage.properties && stage.properties.renderMode === 'threejs') {
      if (!this.blackHole && window.blackHoleBg) {
        this.blackHole = window.blackHoleBg;
        this.blackHole.init('blackHoleContainer');
      }
      if (this.blackHole) this.blackHole.start();
    }

    this.currentStage = stage
    this._preloadImages(stage)

    console.log(`[STAGE] Loaded: ${stage.name} (${stage.category})`)
    return stage
  }

  /**
   * Pré-carrega imagens do stage
   * @private
   */
  _preloadImages(stage) {
    // Carrega imagem principal
    if (stage.imageSrc) {
      this._loadImage(stage.imageSrc)
    }

    // Carrega layers para parallax
    if (stage.layers && stage.type === 'parallax') {
      stage.layers.forEach(layerSrc => {
        this._loadImage(layerSrc)
      })
    }
  }

  /**
   * Carrega uma imagem
   * @private
   */
  _loadImage(src) {
    if (this.loadedImages.has(src)) {
      return this.loadedImages.get(src)
    }

    const img = new Image()
    img.src = src
    this.loadedImages.set(src, img)

    img.onerror = () => {
      console.error(`Failed to load image: ${src}`)
    }

    return img
  }

  /**
   * Renderiza o background estático
   */
  renderStatic() {
    if (!this.currentStage || !this.currentStage.imageSrc) return

    const img = this.loadedImages.get(this.currentStage.imageSrc)
    if (img && img.complete) {
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
    }
  }

  /**
   * Renderiza background com parallax
   * @param {number} cameraX - Posição X da câmera (movimento do viewport)
   */
  renderParallax(cameraX = 0) {
    if (!this.currentStage || !this.currentStage.layers) return

    const stage = this.currentStage
    const canvasWidth = this.canvas.width
    const canvasHeight = this.canvas.height

    // Renderiza cada layer com velocidade de parallax diferente
    stage.layers.forEach((layerSrc, index) => {
      const img = this.loadedImages.get(layerSrc)
      if (!img || !img.complete) return

      const parallaxSpeed = stage.parallaxSpeeds[index] || 0.5
      const offsetX = cameraX * parallaxSpeed

      // Renderiza a imagem com wrap para movimento contínuo
      this.ctx.drawImage(img, offsetX, 0, canvasWidth, canvasHeight)
    })
  }

  /**
   * Renderiza background com performance reduzida (LOW_PERFORMANCE_MODE)
   */
  renderLowPerformance() {
    if (!this.currentStage || !this.currentStage.imageSrc) return

    const img = this.loadedImages.get(this.currentStage.imageSrc)
    if (img && img.complete) {
      // Renderiza apenas a imagem principal, sem efeitos
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
    }
  }

  /**
   * Renderiza efeitos especiais do stage (glows, partículas, etc.)
   * @param {number} frameCount - Frame atual para animações
   */
  renderEffects(frameCount = 0) {
    if (!this.currentStage || !this.currentStage.properties) return

    const props = this.currentStage.properties

    if (STAGE_CONFIG.LOW_PERFORMANCE_MODE) return

    // Glow effect
    if (props.glowIntensity && props.glowIntensity > 0) {
      this._drawGlow(props.particleColor, props.glowIntensity)
    }

    // Partículas animadas
    if (props.animationSpeed && props.particleColor) {
      this._drawParticles(frameCount, props)
    }
  }

  /**
   * Desenha efeito de glow no cenário
   * @private
   */
  _drawGlow(color, intensity) {
    this.ctx.save()
    this.ctx.fillStyle = `rgba(${this._hexToRgb(color).join(',')},${intensity * 0.1})`
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.restore()
  }

  /**
   * Desenha partículas animadas
   * @private
   */
  _drawParticles(frameCount, props) {
    const particleCount = STAGE_CONFIG.LOW_PERFORMANCE_MODE ? 5 : STAGE_CONFIG.MAX_PARTICLES
    const speed = props.animationSpeed || 1

    for (let i = 0; i < particleCount; i++) {
      const x = (frameCount * speed + i * 30) % this.canvas.width
      const y = (i * 40) % this.canvas.height
      const size = 2 + Math.sin(frameCount * 0.05 + i) * 1

      this.ctx.save()
      this.ctx.fillStyle = props.particleColor || '#FFFFFF'
      this.ctx.globalAlpha = 0.3 + Math.sin(frameCount * 0.02 + i) * 0.2
      this.ctx.beginPath()
      this.ctx.arc(x, y, size, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.restore()
    }
  }

  /**
   * Converte hex color para RGB
   * @private
   */
  _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [255, 255, 255]
  }

  /**
   * Retorna informações do stage atual
   */
  getCurrentStage() {
    return this.currentStage
  }

  /**
   * Retorna lista de stages disponíveis de uma categoria
   * @param {string} category - 'normal' | 'special' | 'boss'
   */
  getStagesByCategory(category) {
    return Object.values(STAGES).filter(stage => stage.category === category)
  }

  /**
   * Retorna todas as stages disponíveis
   */
  getAllStages() {
    return Object.values(STAGES).filter(stage => stage.enabled)
  }

  /**
   * Alterna modo de performance
   */
  setPerformanceMode(lowPerformance) {
    STAGE_CONFIG.LOW_PERFORMANCE_MODE = lowPerformance
    console.log(`[STAGE] Performance mode: ${lowPerformance ? 'LOW' : 'HIGH'}`)
  }
}

// ============================================
// CRIAÇÃO DA INSTÂNCIA GLOBAL
// ============================================

const stageManager = new StageManager();
window.stageManager = stageManager;

// ============================================
// FUNÇÕES DE CONVENIÊNCIA
// ============================================

/**
 * Carrega um stage rapidamente
 * @param {string} stageId
 */
window.loadStage = function(stageId) {
  return stageManager.loadStage(stageId)
}

window.getCurrentStage = function() {
  return stageManager.getCurrentStage()
}

window.getStagesByCategory = function(category) {
  return stageManager.getStagesByCategory(category)
}

window.getAllStages = function() {
  return stageManager.getAllStages()
}
