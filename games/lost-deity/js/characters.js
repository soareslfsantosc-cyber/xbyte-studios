const CHARACTERS = {
  samuraiMack: {
    name: 'Samurai Mack',
    health: 100, defense: 100, power: 0,
    naturalFacingRight: true,
    scale: 2.5,
    offset: { x: 215, y: 157 },
    sprites: {
      idle:    { src: './img/samuraiMack/Idle.png',                        frames: 8 },
      run:     { src: './img/samuraiMack/Run.png',                         frames: 8 },
      jump:    { src: './img/samuraiMack/Jump.png',                        frames: 2 },
      fall:    { src: './img/samuraiMack/Fall.png',                        frames: 2 },
      attack1: { src: './img/samuraiMack/Attack1.png',                     frames: 6 },
      takeHit: { src: './img/samuraiMack/Take Hit - white silhouette.png', frames: 4 },
      death:   { src: './img/samuraiMack/Death.png',                       frames: 6 }
    },
    attackBox: { offset: { x: 10, y: 50 }, width: 55, height: 50 }
  },

  kenji: {
    name: 'Adam',
    health: 100, defense: 100, power: 0,
    naturalFacingRight: false,
    scale: 2.5,
    offset: { x: 215, y: 167 },
    sprites: {
      idle:    { src: './img/kenji/Idle.png',     frames: 4 },
      run:     { src: './img/kenji/Run.png',      frames: 8 },
      jump:    { src: './img/kenji/Jump.png',     frames: 2 },
      fall:    { src: './img/kenji/Fall.png',     frames: 2 },
      attack1: { src: './img/kenji/Attack1.png',  frames: 4 },
      takeHit: { src: './img/kenji/Take hit.png', frames: 3 },
      death:   { src: './img/kenji/Death.png',    frames: 7 }
    },
    attackBox: { offset: { x: -65, y: 50 }, width: 55, height: 50 }
  },

  sunyakal: {
    name: 'Sūnyakal',
    health: 100, defense: 100, power: 0,
    naturalFacingRight: true,
    scale: 0.31,
    offset: { x: 54, y: 38 },
    sprites: {
      run:           { src: './img/sunyakal/Run.png',           frames: 10, framesHold: 4 },
      attack1:       { src: './img/sunyakal/Attack1.png',       frames: 8,  framesHold: 3 },
      attack2:       { src: './img/sunyakal/Attack2.png',       frames: 8,  framesHold: 3 },
      attack3:       { src: './img/sunyakal/Attack3.png',       frames: 10, framesHold: 4 },
      block:         { src: './img/sunyakal/Block.png',         frames: 6,  framesHold: 4 },
      dodge:         { src: './img/sunyakal/Dodge.png',         frames: 8,  framesHold: 3 },
      darknessSkill: { src: './img/sunyakal/DarknessSkill.png', frames: 10, framesHold: 4 },
      takeHit:       { src: './img/sunyakal/TakeHit.png',       frames: 2,  framesHold: 4 },
      death:         { src: './img/sunyakal/Death.png',         frames: 7,  framesHold: 6 },
      idle:          { src: './img/sunyakal/Idle.png',          frames: 8,  framesHold: 6 },
      jump:          { src: './img/sunyakal/Jump.png',          frames: 1,  framesHold: 5 },
      fall:          { src: './img/sunyakal/Fall.png',          frames: 1,  framesHold: 5 }
    },
    attackBox: { offset: { x: 10, y: 40 }, width: 55, height: 60 },
    hitFrames: { attack1: [4], attack2: [2, 4, 6], attack3: [4] }
  },

  adamNew: {
    name: 'Adam',
    health: 100, defense: 100, power: 0,
    naturalFacingRight: false,
    scale: 0.31,
    offset: { x: 54, y: 38 },
    sprites: {
      idle:    { src: './img/adam_new/Idle.png',    frames: 8, framesHold: 6 },
      run:     { src: './img/adam_new/Run.png',     frames: 9, framesHold: 4 },
      jump:    { src: './img/adam_new/Jump.png',    frames: 1, framesHold: 5 },
      fall:    { src: './img/adam_new/Fall.png',    frames: 1, framesHold: 5 },
      attack1: { src: './img/adam_new/Attack1.png', frames: 8, framesHold: 3 },
      attack2: { src: './img/adam_new/Attack2.png', frames: 8, framesHold: 3 },
      attack3: { src: './img/adam_new/Attack3.png', frames: 10, framesHold: 4 },
      block:   { src: './img/adam_new/Block.png',   frames: 6, framesHold: 4 },
      takeHit: { src: './img/adam_new/TakeHit.png', frames: 4, framesHold: 4 },
      death:   { src: './img/adam_new/Death.png',   frames: 7, framesHold: 6 },
      dodge:   { src: './img/adam_new/Dodge.png',   frames: 8, framesHold: 3 },
      skills:  { src: './img/adam_new/Skills.png',  frames: 8, framesHold: 4 }
    },
    attackBox: { offset: { x: -65, y: 50 }, width: 55, height: 50 },
    hitFrames: { attack1: [2], attack2: [2, 5], attack3: [4] }
  },

  aetheal: {
    name: 'Aetheal',
    health: 100, defense: 100, power: 0,
    naturalFacingRight: true,
    scale: 0.31,
    offset: { x: 54, y: 38 },
    sprites: {
      idle:    { src: './img/aetheal/idle.png',    frames: 8,  framesHold: 6 },
      run:     { src: './img/aetheal/run.png',     frames: 10, framesHold: 4 },
      jump:    { src: './img/aetheal/jump.png',    frames: 1,  framesHold: 5 },
      fall:    { src: './img/aetheal/fall.png',    frames: 1,  framesHold: 5 },
      attack1: { src: './img/aetheal/attack1.png', frames: 8,  framesHold: 3 },
      attack2: { src: './img/aetheal/attack2.png', frames: 8,  framesHold: 3 },
      attack3: { src: './img/aetheal/attack3.png', frames: 10, framesHold: 4 },
      block:   { src: './img/aetheal/block.png',   frames: 6,  framesHold: 4 },
      takeHit: { src: './img/aetheal/takeHit.png', frames: 4,  framesHold: 4 },
      death:   { src: './img/aetheal/death.png',   frames: 8,  framesHold: 6 },
      dodge:   { src: './img/aetheal/dodge.png',   frames: 8,  framesHold: 3 },
      skills:  { src: './img/aetheal/skills.png',  frames: 10, framesHold: 4 }
    },
    attackBox: { offset: { x: 10, y: 40 }, width: 55, height: 60 },
    hitFrames: { attack1: [1], attack2: [2, 4, 5], attack3: [4] }
  },

  elyon: {
    name: 'Elyon',
    health: 100, defense: 100, power: 0,
    naturalFacingRight: true,
    scale: 0.31,
    offset: { x: 54, y: 38 },
    sprites: {
      idle:    { src: './img/elyon/idle.png',    frames: 8, framesHold: 6 },
      run:     { src: './img/elyon/run.png',     frames: 9, framesHold: 4 },
      jump:    { src: './img/elyon/jump.png',    frames: 1, framesHold: 5 },
      fall:    { src: './img/elyon/fall.png',    frames: 1, framesHold: 5 },
      attack1: { src: './img/elyon/attack1.png', frames: 8, framesHold: 3 },
      attack2: { src: './img/elyon/attack2.png', frames: 8, framesHold: 3 },
      attack3: { src: './img/elyon/attack3.png', frames: 10, framesHold: 4 },
      block:   { src: './img/elyon/block.png',   frames: 6, framesHold: 4 },
      takeHit: { src: './img/elyon/takeHit.png', frames: 4, framesHold: 4 },
      death:   { src: './img/elyon/death.png',   frames: 6, framesHold: 6 },
      dodge:   { src: './img/elyon/dodge.png',   frames: 8, framesHold: 3 },
      skills:  { src: './img/elyon/skills.png',  frames: 10, framesHold: 4 }
    },
    attackBox: { offset: { x: 10, y: 40 }, width: 55, height: 60 },
    hitFrames: { attack1: [3], attack2: [2, 4, 5], attack3: [4] }
  }
}

Object.freeze(CHARACTERS)
