const canvas = document.getElementById(CONFIG.CANVAS.ID)
if (!canvas) throw new Error('Canvas não encontrado!')
const c = canvas.getContext('2d')
const gravity = CONFIG.PHYSICS.GRAVITY

stageManager.initialize(canvas)

const shop = new Sprite({
  position: CONFIG.SHOP.position,
  imageSrc: CONFIG.SHOP.src,
  scale: CONFIG.SHOP.scale,
  framesMax: CONFIG.SHOP.frames
})

const ROSTER = [
  { id: 'sunyakal', name: 'Sūnyakal', data: CHARACTERS.sunyakal },
  { id: 'adamNew',  name: 'Adam',     data: CHARACTERS.adamNew  },
  { id: 'aetheal',  name: 'Aetheal',  data: CHARACTERS.aetheal  },
  { id: 'elyon',    name: 'Elyon',    data: CHARACTERS.elyon    }
]

function buildFighter(charData, initialPosition, color, role) {
  const sprites = {}
  for (const [key, val] of Object.entries(charData.sprites)) {
    sprites[key] = { imageSrc: val.src, framesMax: val.frames, framesHold: val.framesHold }
  }

  const flipX = charData.naturalFacingRight !== (role === 'P1')

  const ATTACK_REACH = 55
  const HITBOX_WIDTH = 50
  const atkOffY      = charData.attackBox.offset.y

  const attackBox = role === 'P1'
    ? { offset: { x: HITBOX_WIDTH,  y: atkOffY }, width: ATTACK_REACH, height: charData.attackBox.height }
    : { offset: { x: -ATTACK_REACH, y: atkOffY }, width: ATTACK_REACH, height: charData.attackBox.height }

  const f = new Fighter({
    position: { ...initialPosition }, velocity: { x: 0, y: 0 },
    color, imageSrc: sprites.idle.imageSrc, framesMax: sprites.idle.framesMax,
    framesHold: sprites.idle.framesHold, scale: charData.scale, offset: charData.offset,
    sprites, attackBox, flipX, hitFrames: charData.hitFrames
  })
  f.name = charData.name
  return f
}

let player = buildFighter(CHARACTERS.sunyakal, CONFIG.PLAYER_1.INITIAL_POSITION, 'red',  'P1')
let enemy  = buildFighter(CHARACTERS.adamNew,  CONFIG.PLAYER_2.INITIAL_POSITION, 'blue', 'P2')

const keys = {
  a: { pressed: false }, d: { pressed: false }, Shift: { pressed: false },
  ArrowRight: { pressed: false }, ArrowLeft: { pressed: false },
  Enter: { pressed: false }
}

let gameTimer     = null
let currentRound  = 1
let playerWins    = 0
let enemyWins     = 0
let isRoundActive = false
let frameCount    = 0

function showAnnouncement(text, duration = 2000) {
  const el = document.getElementById('announcement')
  if (!el) return Promise.resolve()
  el.textContent = text
  el.classList.add('show')
  return new Promise(resolve => {
    setTimeout(() => { el.classList.remove('show'); setTimeout(resolve, 400) }, duration)
  })
}

function updateHUD() {
  const set     = (id, val) => { const el = document.getElementById(id); if (el) el.style.width  = val + '%' }
  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val }
  set('playerHealth',  player.health)
  set('enemyHealth',   enemy.health)
  set('playerDefense', player.defense)
  set('enemyDefense',  enemy.defense)
  set('playerPower',   player.power)
  set('enemyPower',    enemy.power)
  setText('playerName', player.name)
  setText('enemyName',  enemy.name)
}

async function startRound() {
  isRoundActive = false
  ;[[player, CONFIG.PLAYER_1.INITIAL_POSITION], [enemy, CONFIG.PLAYER_2.INITIAL_POSITION]].forEach(([f, pos]) => {
    f.isResetting = true
    f.dead = false
    f.position.x = pos.x; f.position.y = pos.y
    f.velocity.x = 0;     f.velocity.y = 0
    f.health = 100; f.defense = 100; f.power = 0
    f.resetCombatState()
    f.resetToIdle()
    f.isResetting = false
  })
  updateHUD()
  const roundText = currentRound === 3 ? 'FINAL ROUND' : `ROUND ${currentRound}`
  await showAnnouncement(roundText, 1500)
  await showAnnouncement('FIGHT!', 800)
  isRoundActive = true
  if (gameTimer) gameTimer.stop()
  gameTimer = initializeTimer(
    CONFIG.HUD.TIMER_INITIAL,
    (t) => { const el = document.getElementById(CONFIG.HUD.TIMER_ID); if (el) el.textContent = t },
    () => { if (isRoundActive) endRound() }
  )
  gameTimer.start()
}

async function endRound() {
  if (!isRoundActive) return
  isRoundActive = false
  if (gameTimer) gameTimer.stop()

  if (player.health <= 0) player.die()
  if (enemy.health  <= 0) enemy.die()

  await new Promise(resolve => setTimeout(resolve, 1500))

  let roundWinner = null
  if (player.health > enemy.health)      { roundWinner = 'player'; playerWins++ }
  else if (enemy.health > player.health) { roundWinner = 'enemy';  enemyWins++  }

  if      (roundWinner === 'player') await showAnnouncement(`${player.name} VENCEU!`, 2000)
  else if (roundWinner === 'enemy')  await showAnnouncement(`${enemy.name} VENCEU!`,  2000)
  else                               await showAnnouncement('EMPATE',                 2000)

  if (playerWins === 2 || enemyWins === 2 || currentRound === 3) {
    determineWinner({ player, enemy })
  } else {
    currentRound++
    startRound()
  }
}

function updateControls(f, controls, left, right, wantsBlock) {
  if (!isRoundActive || f.dead || f.image === f.sprites.death.image) return

  const onGround = f.position.y >= CONFIG.PHYSICS.GROUND_Y
  f.isBlocking = false

  if (wantsBlock && onGround && f.sprites.block && !f.isAttackAnimating()) {
    f.isBlocking = true
    f.switchSprite('block')
  } else if (left && f.lastKey === controls.LEFT) {
    f.velocity.x = -CONFIG.PHYSICS.MOVEMENT_SPEED
    f.switchSprite('run')
  } else if (right && f.lastKey === controls.RIGHT) {
    f.velocity.x = CONFIG.PHYSICS.MOVEMENT_SPEED
    f.switchSprite('run')
  } else {
    f.switchSprite('idle')
  }

  if      (f.velocity.y < 0) f.switchSprite('jump')
  else if (f.velocity.y > 0) f.switchSprite('fall')
}

// Processa os frames de impacto do golpe em andamento. Cada frame de impacto
// causa um hit (o dano total do golpe e dividido entre eles).
function resolveAttack(attacker, defender) {
  if (!attacker.isAttacking || !attacker.currentAttack) return

  const type   = attacker.currentAttack
  const frames = attacker.hitFrames[type]
  const sprite = attacker.sprites[type]

  if (!frames || !frames.length || attacker.image !== sprite.image) {
    attacker.isAttacking = false
    return
  }

  const f = attacker.framesCurrent
  if (frames.includes(f) && !attacker.hitDone.has(f)) {
    attacker.hitDone.add(f)
    if (!defender.dead && rectangularCollision({ rectangle1: attacker, rectangle2: defender })) {
      // Divide o dano total entre os hits; o resto vai para os primeiros hits
      // para que a soma seja sempre exatamente o dano total do golpe.
      const total = CONFIG.COMBAT.TOTAL_DAMAGE[type]
      const base  = Math.floor(total / frames.length)
      const extra = frames.indexOf(f) < total % frames.length ? 1 : 0
      defender.takeHit(base + extra)
      attacker.power = Math.min(100, attacker.power + Math.round(10 / frames.length))
      updateHUD()
    }
  }

  if (f > frames[frames.length - 1]) attacker.isAttacking = false
}

function animate() {
  window.requestAnimationFrame(animate)
  frameCount++
  updateHUD()

  const currentStage = getCurrentStage()
  if (currentStage && currentStage.properties?.renderMode === 'threejs') {
    c.clearRect(0, 0, canvas.width, canvas.height)
  } else {
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
  }

  if (currentStage) {
    if (currentStage.properties?.renderMode !== 'threejs') {
      if (currentStage.type === 'parallax') stageManager.renderParallax(frameCount)
      else stageManager.renderStatic()
      stageManager.renderEffects(frameCount)
    }
    if (currentStage.category === 'normal') {
      c.fillStyle = 'rgba(255,255,255,0.15)'
      c.fillRect(0, 0, canvas.width, canvas.height)
    }
  }

  if (currentStage && currentStage.id === 'forest') shop.update()

  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x  = 0

  updateControls(player, CONFIG.PLAYER_1.CONTROLS, keys.a.pressed,         keys.d.pressed,          keys.Shift.pressed)
  updateControls(enemy,  CONFIG.PLAYER_2.CONTROLS, keys.ArrowLeft.pressed, keys.ArrowRight.pressed, keys.Enter.pressed)

  resolveAttack(player, enemy)
  resolveAttack(enemy, player)

  if (isRoundActive && (player.health <= 0 || enemy.health <= 0)) {
    endRound()
  }
}

animate()

;(function setupCharacterSelect() {
  const screen     = document.getElementById('charSelectScreen')
  const grid       = document.getElementById('charGrid')
  const p1Display  = document.getElementById('p1CharName')
  const p2Display  = document.getElementById('p2CharName')
  const p1Avatar   = document.getElementById('p1Avatar')
  const p2Avatar   = document.getElementById('p2Avatar')
  const confirmBtn = document.getElementById('charConfirmBtn')
  const p1Marker   = document.getElementById('p1Marker')
  const p2Marker   = document.getElementById('p2Marker')
  const phaseLabel = document.getElementById('selectPhaseLabel')

  if (!screen) return

  let phase      = 1
  let p1Choice   = null
  let p2Choice   = null
  let hoveredIdx = 0

  function buildGrid() {
    grid.innerHTML = ''
    ROSTER.forEach((char, idx) => {
      const card = document.createElement('div')
      card.className = 'char-card'
      card.dataset.idx = idx
      card.innerHTML = `
        <div class="char-portrait" style="background:${idx===0?'#1a1a3e':'#1a3a1a'}">
          <span class="char-initial">${char.name[0]}</span>
        </div>
        <div class="char-card-name">${char.name}</div>
      `
      card.addEventListener('click', () => selectChar(idx))
      grid.appendChild(card)
    })
    updateFocus(0)
  }

  function updateFocus(idx) {
    hoveredIdx = idx
    document.querySelectorAll('.char-card').forEach((c, i) => c.classList.toggle('focused', i === idx))
  }

  function selectChar(idx) {
    const char = ROSTER[idx]
    if (phase === 1) {
      p1Choice = char
      if (p1Display) p1Display.textContent = char.name
      if (p1Avatar)  p1Avatar.textContent  = char.name[0]
      if (p1Marker) {
        const cards = document.querySelectorAll('.char-card')
        if (cards[idx]) { p1Marker.style.display = 'block'; cards[idx].appendChild(p1Marker) }
      }
      phase = 2
      if (phaseLabel) phaseLabel.textContent = 'PLAYER 2 — ESCOLHA SEU PERSONAGEM'
      if (confirmBtn) confirmBtn.textContent  = 'CONFIRMAR P2'
    } else {
      p2Choice = char
      if (p2Display) p2Display.textContent = char.name
      if (p2Avatar)  p2Avatar.textContent  = char.name[0]
      if (p2Marker) {
        const cards = document.querySelectorAll('.char-card')
        if (cards[idx]) { p2Marker.style.display = 'block'; cards[idx].appendChild(p2Marker) }
      }
      if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.textContent = 'LUTAR!' }
    }
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (!p1Choice || !p2Choice) return
      player = buildFighter(p1Choice.data, CONFIG.PLAYER_1.INITIAL_POSITION, 'red',  'P1')
      enemy  = buildFighter(p2Choice.data, CONFIG.PLAYER_2.INITIAL_POSITION, 'blue', 'P2')
      screen.style.display = 'none'
      startAutoStage()
    })
  }

  window.addEventListener('keydown', (e) => {
    if (!screen || screen.style.display === 'none') return
    const total = ROSTER.length
    if      (e.key === 'ArrowRight' || e.key === 'd') updateFocus((hoveredIdx + 1) % total)
    else if (e.key === 'ArrowLeft'  || e.key === 'a') updateFocus((hoveredIdx - 1 + total) % total)
    else if (e.key === 'Enter'      || e.key === ' ') { selectChar(hoveredIdx); e.preventDefault() }
  })

  buildGrid()
})()

async function startAutoStage() {
  const allStages   = getAllStages().filter(s => s.id !== 'blackHole')
  const randomStage = allStages[Math.floor(Math.random() * allStages.length)]
  const stage       = await loadStage(randomStage.id)

  canvas.style.background = (stage?.properties?.renderMode === 'threejs') ? 'transparent' : 'black'

  currentRound = 1; playerWins = 0; enemyWins = 0
  startRound()
}

// Identifica a tecla pelo codigo fisico: independe de Shift, CapsLock e layout.
// Os dois Shifts contam como "Shift".
function keyId(event) {
  return (event.code === 'ShiftLeft' || event.code === 'ShiftRight') ? 'Shift' : event.code
}

const GAME_KEY_IDS = new Set([
  'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Comma', 'Period'
])

function fightScreenActive() {
  const charScreen = document.getElementById('charSelectScreen')
  return !(charScreen && charScreen.style.display !== 'none')
}

window.addEventListener('keydown', (event) => {
  if (!fightScreenActive() || !isRoundActive) return

  const id = keyId(event)
  if (GAME_KEY_IDS.has(id)) event.preventDefault()

  // Ignora key-repeat (disparado pelo navegador quando a tecla fica pressionada):
  // sem isso, segurar PULO faz "bunny hop" e segurar ATAQUE re-arma o golpe.
  if (event.repeat) return

  const P1 = CONFIG.PLAYER_1.CONTROLS
  const P2 = CONFIG.PLAYER_2.CONTROLS

  if (!player.dead) {
    switch (id) {
      case P1.RIGHT:   keys.d.pressed = true; player.lastKey = P1.RIGHT; break
      case P1.LEFT:    keys.a.pressed = true; player.lastKey = P1.LEFT;  break
      case P1.JUMP:
        if (player.position.y >= CONFIG.PHYSICS.GROUND_Y) player.velocity.y = -CONFIG.PHYSICS.JUMP_FORCE
        break
      case P1.ATTACK:  player.attack('attack1'); break
      case P1.ATTACK2: player.attack('attack2'); break
      case P1.ATTACK3: player.attack('attack3'); break
      case P1.BLOCK:   keys.Shift.pressed = true; break
    }
  }

  if (!enemy.dead) {
    switch (id) {
      case P2.RIGHT:   keys.ArrowRight.pressed = true; enemy.lastKey = P2.RIGHT; break
      case P2.LEFT:    keys.ArrowLeft.pressed  = true; enemy.lastKey = P2.LEFT;  break
      case P2.JUMP:
        if (enemy.position.y >= CONFIG.PHYSICS.GROUND_Y) enemy.velocity.y = -CONFIG.PHYSICS.JUMP_FORCE
        break
      case P2.ATTACK:  enemy.attack('attack1'); break
      case P2.ATTACK2: enemy.attack('attack2'); break
      case P2.ATTACK3: enemy.attack('attack3'); break
      case P2.BLOCK:   keys.Enter.pressed = true; break
    }
  }
})

window.addEventListener('keyup', (event) => {
  const id = keyId(event)
  const P1 = CONFIG.PLAYER_1.CONTROLS
  const P2 = CONFIG.PLAYER_2.CONTROLS

  switch (id) {
    // Ao soltar uma direcao com a oposta ainda pressionada, passa a seguir a oposta
    case P1.RIGHT: keys.d.pressed = false; if (keys.a.pressed) player.lastKey = P1.LEFT;  break
    case P1.LEFT:  keys.a.pressed = false; if (keys.d.pressed) player.lastKey = P1.RIGHT; break
    case P1.BLOCK: keys.Shift.pressed = false; break
    case P2.RIGHT: keys.ArrowRight.pressed = false; if (keys.ArrowLeft.pressed)  enemy.lastKey = P2.LEFT;  break
    case P2.LEFT:  keys.ArrowLeft.pressed  = false; if (keys.ArrowRight.pressed) enemy.lastKey = P2.RIGHT; break
    case P2.BLOCK: keys.Enter.pressed = false; break
  }
})

// Se a janela perde o foco o navegador nao envia keyup: zera tudo para
// ninguem ficar "preso" andando ou bloqueando ao voltar.
window.addEventListener('blur', () => {
  for (const k in keys) keys[k].pressed = false
})
