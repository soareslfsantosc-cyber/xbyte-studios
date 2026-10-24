const ATTACK_TYPES = ['attack1', 'attack2', 'attack3']
const BLOCK_GUARD_FRAME  = 1  // frame mostrado enquanto segura a guarda
const BLOCK_IMPACT_FRAME = 2  // frame mostrado ao bloquear um golpe
const BLOCK_IMPACT_TICKS = 10 // por quantos ticks o frame de impacto fica na tela

class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.offset = offset
    this.flipX = false
  }

  draw() {
    const frameW    = this.image.width / this.framesMax
    const renderedW = frameW * this.scale
    const renderedH = this.image.height * this.scale
    const drawX     = this.position.x - this.offset.x
    const drawY     = this.position.y - this.offset.y

    if (this.flipX) {
      c.save()
      c.translate(drawX + renderedW, drawY)
      c.scale(-1, 1)
      c.drawImage(this.image, this.framesCurrent * frameW, 0, frameW, this.image.height, 0, 0, renderedW, renderedH)
      c.restore()
    } else {
      c.drawImage(this.image, this.framesCurrent * frameW, 0, frameW, this.image.height, drawX, drawY, renderedW, renderedH)
    }
  }

  animateFrames() {
    this.framesElapsed++
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) this.framesCurrent++
      else this.framesCurrent = 0
    }
  }

  update() {
    this.draw()
    this.animateFrames()
  }
}

class Fighter extends Sprite {
  constructor({
    position, velocity, color = 'red', imageSrc,
    scale = 1, framesMax = 1, framesHold = 5,
    offset = { x: 0, y: 0 }, sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
    flipX = false,
    hitFrames = {}
  }) {
    super({ position, imageSrc, scale, framesMax, offset })

    this.velocity    = velocity
    this.width       = 50
    this.height      = 150
    this.color       = color
    this.health      = 100
    this.defense     = 100
    this.power       = 0
    this.isBlocking  = false
    this.dead        = false
    this.isResetting = false
    this.lastKey     = null
    this.isAttacking = false
    this.flipX       = flipX

    // Combate: qual golpe está em andamento, frames de impacto de cada golpe
    // e quais desses frames já foram processados neste golpe.
    this.hitFrames     = hitFrames
    this.currentAttack = null
    this.hitDone       = new Set()
    this.blockHitTimer = 0

    this.framesCurrent     = 0
    this.framesElapsed     = 0
    this.framesHold        = framesHold
    this.defaultFramesHold = framesHold

    this.sprites = sprites

    this.attackBoxDef = {
      offset: attackBox.offset,
      width:  attackBox.width,
      height: attackBox.height
    }

    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      offset: attackBox.offset,
      width:  attackBox.width,
      height: attackBox.height
    }

    for (const sprite in this.sprites) {
      sprites[sprite].image     = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }

  // true enquanto a animação de QUALQUER golpe ainda não chegou ao último frame
  isAttackAnimating() {
    for (const type of ATTACK_TYPES) {
      const s = this.sprites[type]
      if (s && this.image === s.image && this.framesCurrent < s.framesMax - 1) return true
    }
    return false
  }

  // true enquanto está em guarda (sprite de bloqueio ativo)
  isGuarding() {
    return !!(this.isBlocking && this.sprites.block && this.image === this.sprites.block.image)
  }

  // Limpa todo o estado de combate (usado ao iniciar um round)
  resetCombatState() {
    this.isAttacking   = false
    this.isBlocking    = false
    this.currentAttack = null
    this.hitDone       = new Set()
    this.blockHitTimer = 0
  }

  // Volta ao sprite parado ignorando as proteções de golpe/dano (usado no reset de round)
  resetToIdle() {
    const s = this.sprites.idle
    this.image         = s.image
    this.framesMax     = s.framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold    = s.framesHold || this.defaultFramesHold
  }

  update() {
    this.draw()

    const dying = this.image === this.sprites.death.image

    if (dying) {
      this.velocity.x = 0
      if (this.framesCurrent < this.sprites.death.framesMax - 1) {
        this.animateFrames()
      } else {
        this.dead = true
      }
    } else if (this.isGuarding()) {
      // Guarda: não anima; segura o frame de guarda e mostra o de impacto ao bloquear
      if (this.blockHitTimer > 0) {
        this.blockHitTimer--
        this.framesCurrent = Math.min(BLOCK_IMPACT_FRAME, this.sprites.block.framesMax - 1)
      } else {
        this.framesCurrent = Math.min(BLOCK_GUARD_FRAME, this.sprites.block.framesMax - 1)
      }
    } else if (!this.dead || this.isResetting) {
      this.animateFrames()
    }

    this.attackBox.position.x = this.position.x + this.attackBoxDef.offset.x
    this.attackBox.position.y = this.position.y + this.attackBoxDef.offset.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    const WALL_LEFT  = 50
    const WALL_RIGHT = canvas.width - 50
    const CEIL_Y     = -150

    if (this.position.x < WALL_LEFT)               { this.position.x = WALL_LEFT;               this.velocity.x = 0 }
    if (this.position.x + this.width > WALL_RIGHT) { this.position.x = WALL_RIGHT - this.width; this.velocity.x = 0 }
    if (this.position.y < CEIL_Y)                  { this.position.y = CEIL_Y;                  this.velocity.y = 0 }

    if (this.position.y + this.height + this.velocity.y >= canvas.height - CONFIG.PHYSICS.GROUND_DETECTION_OFFSET) {
      this.velocity.y = 0
      this.position.y = CONFIG.PHYSICS.GROUND_Y
    } else {
      this.velocity.y += gravity
    }
  }

  // Inicia um golpe (attack1 | attack2 | attack3). Ignora o pedido se o
  // personagem não tiver esse golpe, estiver em guarda ou já estiver atacando.
  attack(type = 'attack1') {
    if (!this.sprites[type] || !this.hitFrames[type]) return
    if (this.isBlocking || this.isAttackAnimating()) return

    this.switchSprite(type)
    // switchSprite pode recusar (ex.: hit-stun em curso). Só arma o golpe se o
    // sprite do golpe realmente entrou em cena — evita dano sem animação.
    if (this.image !== this.sprites[type].image) return

    // Garante que o golpe sempre começa do frame 0, mesmo que o sprite
    // do golpe anterior ainda estivesse ativo no último frame.
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold    = this.sprites[type].framesHold || this.defaultFramesHold

    this.currentAttack = type
    this.hitDone       = new Set()
    this.isAttacking   = true
  }

  takeHit(damage = CONFIG.COMBAT.BASE_DAMAGE) {
    const guarded = this.isGuarding()
    const finalDamage = guarded ? damage * 0.5 : damage

    this.health -= finalDamage
    this.power   = Math.min(100, this.power + finalDamage * 0.5)

    if (this.health <= 0) {
      this.health = 0
      this.switchSprite('death')
    } else if (guarded) {
      this.blockHitTimer = BLOCK_IMPACT_TICKS
    } else {
      this.switchSprite('takeHit')
    }
  }

  die() {
    if (this.image !== this.sprites.death.image) {
      this.image         = this.sprites.death.image
      this.framesMax     = this.sprites.death.framesMax
      this.framesCurrent = 0
      this.framesHold    = this.sprites.death.framesHold || this.defaultFramesHold
    }
    this.velocity.x    = 0
    this.isAttacking   = false
    this.currentAttack = null
  }

  switchSprite(sprite) {
    if (this.dead && !this.isResetting) return
    if (this.image === this.sprites.death.image && !this.isResetting) return

    // Não interrompe um golpe em andamento nem a reação a dano
    if (this.isAttackAnimating()) return
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    ) return

    const spriteData = this.sprites[sprite]
    if (spriteData && this.image !== spriteData.image) {
      this.image         = spriteData.image
      this.framesMax     = spriteData.framesMax
      this.framesCurrent = 0
      this.framesHold    = spriteData.framesHold || this.defaultFramesHold

      // Saiu de um golpe: limpa o estado de ataque
      if (!ATTACK_TYPES.includes(sprite)) {
        this.isAttacking   = false
        this.currentAttack = null
      }
    }
  }
}
