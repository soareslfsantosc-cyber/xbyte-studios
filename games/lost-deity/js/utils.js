/**
 * COLLISION DETECTION
 * Detecta colisão retangular entre attack box e hitbox
 *
 * @param {Object} params - Parâmetros
 * @param {Fighter} params.rectangle1 - Atacante
 * @param {Fighter} params.rectangle2 - Defensor
 * @returns {boolean} true se há colisão
 */
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

/**
 * TIMER STATE
 * Mantém estado do timer entre chamadas
 * Separado da lógica de UI para melhor testabilidade
 */
const timerState = {
  timeRemaining: 60,
  timerId: null,
  isRunning: false
}

/**
 * INICIALIZA TIMER
 * Começa a contar regressivo
 *
 * @param {number} initialSeconds - Tempo inicial em segundos
 * @param {Function} onTick - Callback a cada segundo (recebe tempo restante)
 * @param {Function} onComplete - Callback quando timer termina
 * @returns {Object} Object com start() e stop()
 */
function initializeTimer(initialSeconds, onTick, onComplete) {
  timerState.timeRemaining = initialSeconds

  const timer = {
    start() {
      if (timerState.isRunning) return

      timerState.isRunning = true
      const tick = () => {
        if (timerState.timeRemaining > 0) {
          timerState.timerId = setTimeout(() => {
            timerState.timeRemaining--

            // Callback a cada segundo
            if (typeof onTick === 'function') {
              onTick(timerState.timeRemaining)
            }

            if (timerState.timeRemaining > 0) {
              tick()
            } else {
              // Timer completou
              timerState.isRunning = false
              if (typeof onComplete === 'function') {
                onComplete()
              }
            }
          }, 1000)
        }
      }
      tick()
    },

    stop() {
      timerState.isRunning = false
      if (timerState.timerId) {
        clearTimeout(timerState.timerId)
        timerState.timerId = null
      }
    }
  }

  return timer
}

/**
 * DETERMINA VENCEDOR
 * Compara saúde dos lutadores e exibe resultado
 *
 * @param {Object} params - Parâmetros
 * @param {Fighter} params.player - Lutador 1
 * @param {Fighter} params.enemy - Lutador 2
 * @param {Function} params.onWinner - Callback com resultado (opcional)
 */
function determineWinner({ player, enemy, onWinner }) {
  // Para o timer
  timerState.isRunning = false
  if (timerState.timerId) {
    clearTimeout(timerState.timerId)
  }

  // Determina vencedor baseado em rounds (variáveis globais no index.js)
  let message = 'TIE'

  if (typeof playerWins !== 'undefined' && typeof enemyWins !== 'undefined') {
    if (playerWins > enemyWins) {
      message = `${player.name.toUpperCase()} WINS GAME!`
    } else if (enemyWins > playerWins) {
      message = `${enemy.name.toUpperCase()} WINS GAME!`
    } else {
      // Caso de empate de rounds, desempatar por vida
      if (player.health > enemy.health) {
        message = `${player.name.toUpperCase()} WINS GAME!`
      } else if (enemy.health > player.health) {
        message = `${enemy.name.toUpperCase()} WINS GAME!`
      } else {
        message = 'TIE'
      }
    }
  } else {
    // Fallback se as variáveis de round não existirem
    if (player.health > enemy.health) {
      message = `${player.name.toUpperCase()} WINS!`
    } else if (enemy.health > player.health) {
      message = `${enemy.name.toUpperCase()} WINS!`
    }
  }

  // Exibe resultado no DOM
  const displayElement = document.getElementById('displayText')
  if (displayElement) {
    displayElement.textContent = message
    displayElement.classList.add('show')
  }

  // Callback opcional
  if (typeof onWinner === 'function') {
    onWinner({ message, player, enemy })
  }
}

/**
 * VALIDA ELEMENTOS DO DOM
 * Garante que elementos necessários existem antes de usar
 *
 * @param {string} selector - Seletor CSS
 * @returns {HTMLElement|null} Elemento ou null
 */
function getDOMElement(selector) {
  try {
    return document.querySelector(selector)
  } catch (error) {
    console.warn(`[Warning] DOM element not found: ${selector}`)
    return null
  }
}
