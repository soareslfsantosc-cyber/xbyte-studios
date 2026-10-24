/**
 * LOST DEITY ARCADE - CONFIGURAÇÕES GLOBAIS
 *
 * Centraliza todos os valores mágicos, dimensões e parâmetros de jogo
 * Facilita tweaking e balanceamento sem mexer na lógica
 */

const CONFIG = {
  // ================================
  // CANVAS & DISPLAY
  // ================================
  CANVAS: {
    WIDTH: 1024,
    HEIGHT: 576,
    ID: 'gameCanvas'
  },

  // ================================
  // FÍSICA
  // ================================
  PHYSICS: {
    GRAVITY: 0.7,
    GROUND_Y: 330,
    GROUND_DETECTION_OFFSET: 96, // Altura da HUD inferior
    MOVEMENT_SPEED: 5,
    JUMP_FORCE: 20
  },

  // ================================
  // COMBATE
  // ================================
  COMBAT: {
    BASE_DAMAGE: 20, // Dano por hit
    // Dano total de cada golpe (dividido igualmente entre os hits do golpe).
    // Os frames de impacto de cada golpe ficam em CHARACTERS[x].hitFrames.
    TOTAL_DAMAGE: {
      attack1: 20, // golpe simples
      attack2: 27, // combo
      attack3: 36  // launcher
    }
  },

  // ================================
  // SPRITES - PLAYER 1 (Sūnyakal)
  //
  // Os dados do personagem (nome, vida, defesa, poder, sprites, hitboxes,
  // offsets, escala) vêm agora de CHARACTERS.sunyakal (js/characters.js).
  // Isso substitui o Samurai Mack pelo Sūnyakal sem alterar nenhuma outra
  // parte do jogo: index.js continua lendo CONFIG.PLAYER_1 exatamente como
  // antes, então HUD, rounds, colisão e ataque permanecem intactos.
  // ================================
  PLAYER_1: {
    NAME: CHARACTERS.sunyakal.name,
    INITIAL_POSITION: {
      x: 100,
      y: 0
    },
    SCALE: CHARACTERS.sunyakal.scale,
    SPRITE_OFFSET: CHARACTERS.sunyakal.offset,
    SPRITES: CHARACTERS.sunyakal.sprites,
    ATTACK_BOX: CHARACTERS.sunyakal.attackBox,
    CONTROLS: {
      LEFT: 'KeyA',
      RIGHT: 'KeyD',
      JUMP: 'KeyW',
      ATTACK: 'Space',
      ATTACK2: 'KeyE',
      ATTACK3: 'KeyQ',
      BLOCK: 'Shift'
    }
  },

  // ================================
  // SPRITES - PLAYER 2 (Adam / Kenji)
  // ================================
  // ================================
  // PLAYER 2 (Adam — sprites novos, direção correta)
  //
  // Substitui o Kenji pixel art pelo Adam novo. Os dados vêm de
  // CHARACTERS.adamNew (js/characters.js). Toda a lógica de HUD,
  // rounds, colisão, ataque, cenários e Black Hole permanece intacta.
  // PLAYER_2 ataca para a ESQUERDA (offset.x negativo no attackBox).
  // ================================
  PLAYER_2: {
    NAME: CHARACTERS.adamNew.name,
    INITIAL_POSITION: {
      x: 800,
      y: 100
    },
    SCALE: CHARACTERS.adamNew.scale,
    SPRITE_OFFSET: CHARACTERS.adamNew.offset,
    SPRITES: CHARACTERS.adamNew.sprites,
    ATTACK_BOX: CHARACTERS.adamNew.attackBox,
    CONTROLS: {
      LEFT: 'ArrowLeft',
      RIGHT: 'ArrowRight',
      JUMP: 'ArrowUp',
      ATTACK: 'ArrowDown',
      ATTACK2: 'Period',
      ATTACK3: 'Comma',
      BLOCK: 'Enter'
    }
  },

  // ================================
  // CENÁRIO
  // ================================
  /*
  BACKGROUND: {
    src: './img/background.png',
    position: { x: 0, y: 0 }
  },
  */

  SHOP: {
    src: './img/shop.png',
    position: { x: 600, y: 128 },
    scale: 2.75,
    frames: 6
  },

  // ================================
  // HUD
  // ================================
  HUD: {
    TIMER_INITIAL: 120,
    TIMER_ID: 'timer',
    PLAYER_HEALTH_ID: 'playerHealth',
    ENEMY_HEALTH_ID: 'enemyHealth',
    DISPLAY_TEXT_ID: 'displayText',
    DISPLAY_CLASS: 'show'
  },

  // ================================
  // ANIMATIONS
  // ================================
  ANIMATION: {
    HEALTH_BAR_TRANSITION_MS: 300,
    WINNER_DISPLAY_DELAY_MS: 300
  }
}

// Congelar objeto para evitar mudanças acidentais
Object.freeze(CONFIG)
Object.freeze(CONFIG.CANVAS)
Object.freeze(CONFIG.PHYSICS)
Object.freeze(CONFIG.COMBAT)
Object.freeze(CONFIG.PLAYER_1)
Object.freeze(CONFIG.PLAYER_2)
Object.freeze(CONFIG.HUD)
Object.freeze(CONFIG.ANIMATION)
