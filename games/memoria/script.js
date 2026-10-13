// Dados dos personagens históricos
const characters = [
	{
		id: 'napoleao',
		name: 'Napoleão Bonaparte',
		image: './images/napoleao.jpg',
		description: 'Napoleão Bonaparte (1769-1821) foi um militar e imperador francês que transformou a Europa através de suas campanhas militares. Instituiu o Código Napoleônico, um sistema legal que influenciou muitas nações. Apesar de suas conquistas, foi derrotado e exilado, deixando um legado duradouro na história militar e política.'
	},
	{
		id: 'einstein',
		name: 'Albert Einstein',
		image: './images/einstein.jpg',
		description: 'Albert Einstein (1879-1955) foi um físico teórico alemão que revolucionou a ciência com suas teorias da relatividade. Seu trabalho fundamentou a física moderna e a compreensão do universo. Recebeu o Prêmio Nobel de Física e é considerado um dos maiores cientistas de todos os tempos.'
	},
	{
		id: 'mandela',
		name: 'Nelson Mandela',
		image: './images/mandela.jpg',
		description: 'Nelson Mandela (1918-2013) foi um líder sul-africano que lutou contra o apartheid, um sistema de segregação racial. Passou 27 anos na prisão por sua luta pela igualdade. Tornou-se presidente da África do Sul e é símbolo mundial de resistência pacífica e reconciliação.'
	},
	{
		id: 'mlk',
		name: 'Martin Luther King Jr',
		image: './images/mlk.jpg',
		description: 'Martin Luther King Jr (1929-1968) foi um pastor e ativista americano que liderou o movimento pelos direitos civis dos afro-americanos. Famoso por seu discurso "Eu Tenho um Sonho", promoveu a não-violência e a igualdade racial. Seu legado continua inspirando lutas por justiça social.'
	},
	{
		id: 'curie',
		name: 'Marie Curie',
		image: './images/curie.jpg',
		description: 'Marie Curie (1867-1934) foi uma cientista polonesa-francesa que descobriu o polônio e o rádio. Foi a primeira mulher a ganhar um Prêmio Nobel e a única a ganhar em dois campos científicos diferentes. Suas pesquisas sobre radioatividade abriram novos caminhos para a medicina e a física.'
	},
	{
		id: 'joana',
		name: 'Joana d\'Arc',
		image: './images/joana.jpg',
		description: 'Joana d\'Arc (1412-1431) foi uma heroína francesa que liderou as forças militares francesas durante a Guerra dos Cem Anos. Acreditava receber mensagens divinas e inspirou vitórias importantes. Foi capturada e executada aos 19 anos, tornando-se um símbolo de coragem e sacrifício.'
	},
	{
		id: 'malala',
		name: 'Malala Yousafzai',
		image: './images/malala.jpg',
		description: 'Malala Yousafzai (1997-) é uma ativista paquistanesa que luta pelo direito das meninas à educação. Sobreviveu a um atentado do Talibã aos 15 anos. Tornou-se a pessoa mais jovem a ganhar o Prêmio Nobel da Paz, continuando sua luta global pela educação.'
	},
	{
		id: 'cleopatra',
		name: 'Cleópatra VII',
		image: './images/cleopatra.jpg',
		description: 'Cleópatra VII (69-30 a.C.) foi a última rainha do Egito Antigo, conhecida por sua inteligência e beleza. Falava múltiplas línguas e foi uma estrategista política hábil. Seu reinado marcou o fim da era faraônica e o início do domínio romano no Egito.'
	}
];

const board = document.querySelector(".board");
const triesValue = document.querySelector(".tries-value");
const best = document.querySelector(".interface-data-best");
const bestValue = best.querySelector(".best-value");
const marquee = document.querySelector(".marquee");
const marqueeText = document.querySelector(".marquee-text");
const infoModal = document.getElementById("info-modal");
const characterName = document.getElementById("character-name");
const characterDescription = document.getElementById("character-description");
const closeInfoBtn = document.getElementById("close-info");

const cls = {
	completed: "is-complete",
	combo: "is-combo",
	loading: "is-loading",
	matched: "is-matched",
	waiting: "is-waiting",
	hidden: "hidden",
	shuffling: "is-shuffling"
};

let selectedCard;
let triesCount = 0;
let matchCount = 0;
let comboCount = 0;
let bestCount;
let completeCount = characters.length;
let cards = [];
let shuffleThreshold = 8; // Embaralha a cada 8 tentativas
let lastShuffleAttempt = 0;

const shuffle = (arr) => {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
};

const displayMarquee = (str, isCombo) => {
	marquee.classList.toggle(cls.combo, isCombo);
	marqueeText.textContent = str;
	marquee.style.setProperty("display", "grid");
};

const toggleCardSelected = (card) => {
	const isPressed = card.getAttribute("aria-pressed") === "true";
	card.setAttribute("aria-pressed", isPressed ? "false" : "true");
};

const setMatchedProps = (el) => {
	el.setAttribute("disabled", "");
	el.classList.add(cls.matched);
};

const updateTries = (value) => {
	triesCount = value;
	triesValue.textContent = value;
};

const showCharacterInfo = (characterId) => {
	const character = characters.find(c => c.id === characterId);
	if (character) {
		characterName.textContent = character.name;
		characterDescription.textContent = character.description;
		infoModal.classList.remove(cls.hidden);
	}
};

const hideCharacterInfo = () => {
	infoModal.classList.add(cls.hidden);
};

const shuffleCards = () => {
	if (board.classList.contains(cls.waiting) || board.classList.contains(cls.shuffling)) {
		return;
	}

	board.classList.add(cls.shuffling);
	displayMarquee("Embaralhando!", false);

	// Obter apenas as cartas que NÃO foram encontradas
	const allCards = board.querySelectorAll('.card');
	const unmatched = Array.from(allCards).filter(card => card.getAttribute('disabled') === null);
	const matched = Array.from(allCards).filter(card => card.getAttribute('disabled') !== null);

	// Desabilitar interação durante o embaralhamento
	unmatched.forEach(card => {
		card.style.pointerEvents = 'none';
	});

	setTimeout(() => {
		// Embaralhar apenas as cartas não encontradas
		const unmatchedIds = unmatched.map(card => card.getAttribute('data-character'));
		const shuffledIds = shuffle(unmatchedIds);

		unmatched.forEach((card, index) => {
			card.setAttribute('data-character', shuffledIds[index]);
			const character = characters.find(c => c.id === shuffledIds[index]);
			card.querySelector('.card-image').src = character.image;
			card.querySelector('.card-image').alt = character.name;
		});

		// Reabilitar interação
		unmatched.forEach(card => {
			card.style.pointerEvents = 'auto';
		});

		board.classList.remove(cls.shuffling);
		lastShuffleAttempt = triesCount;
	}, 1500);
};

const checkMatch = (card) => {
	const cardId = card.getAttribute("data-character");
	const selectedCardId = selectedCard.getAttribute("data-character");

	board.classList.add(cls.waiting);

	if (cardId === selectedCardId) {
		setMatchedProps(card);
		setMatchedProps(selectedCard);
		matchCount++;
		comboCount++;

		if (comboCount > 1) {
			displayMarquee(`${comboCount}×!`, true);
		}

		setTimeout(() => {
			showCharacterInfo(cardId);
			card.removeAttribute("aria-pressed");
			selectedCard.removeAttribute("aria-pressed");
			selectedCard = null;
			board.classList.remove(cls.waiting);
		}, 500);
	} else {
		comboCount = 0;

		setTimeout(() => {
			toggleCardSelected(card);
			toggleCardSelected(selectedCard);
			selectedCard = null;
			board.classList.remove(cls.waiting);
		}, 1000);
	}

	updateTries(triesCount + 1);

	// Verificar se deve embaralhar (apenas se houver cartas não encontradas)
	if ((triesCount + 1) % shuffleThreshold === 0 && (triesCount + 1) - lastShuffleAttempt >= shuffleThreshold) {
		const unmatched = board.querySelectorAll('.card:not([disabled])');
		if (unmatched.length > 0) {
			setTimeout(() => {
				shuffleCards();
			}, 1500);
		}
	}
};

const checkBest = () => {
	if (!bestCount || triesCount < bestCount) {
		best.style.setProperty("display", "flex");
		bestCount = triesCount;
		bestValue.textContent = bestCount;
	}
};

const checkComplete = () => {
	if (matchCount !== completeCount) {
		return;
	}

	displayMarquee("Parabéns!", false);

	setTimeout(() => {
		board.classList.add(cls.completed);
	}, 1000);
};

const resetGame = () => {
	if (board.classList.contains(cls.completed)) {
		checkBest();
	}

	matchCount = 0;
	comboCount = 0;
	updateTries(0);
	selectedCard = null;
	lastShuffleAttempt = 0;
	hideCharacterInfo();

	cards.forEach((card) => {
		card.removeAttribute("disabled");
		card.removeAttribute("aria-pressed");
		card.classList.remove(cls.matched);
		card.style.pointerEvents = 'auto';
	});

	board.classList.remove(cls.completed);
	board.classList.remove(cls.shuffling);
};

const setupGame = () => {
	board.innerHTML = '';
	const fragment = document.createDocumentFragment();
	
	// Criar pares de cartas (cada personagem aparece 2 vezes)
	const cardPairs = [];
	characters.forEach(character => {
		cardPairs.push(character.id);
		cardPairs.push(character.id);
	});
	
	const shuffledPairs = shuffle(cardPairs);
	
	shuffledPairs.forEach((characterId, index) => {
		const character = characters.find(c => c.id === characterId);
		const card = document.createElement('button');
		card.className = 'card';
		card.setAttribute('data-character', characterId);
		card.setAttribute('aria-pressed', 'false');
		
		card.innerHTML = `
			<div class="content">
				<img src="${character.image}" alt="${character.name}" class="card-image">
			</div>
		`;
		
		card.style.setProperty("--i", index + 1);
		card.addEventListener("click", () => {
			if (board.classList.contains(cls.waiting) || board.classList.contains(cls.shuffling) || card.getAttribute("disabled") !== null) {
				return;
			}
			
			toggleCardSelected(card);

			if (!selectedCard) {
				selectedCard = card;
				return;
			}

			if (card === selectedCard) {
				selectedCard = null;
				return;
			}

			checkMatch(card);
			checkComplete();
		});
		
		fragment.appendChild(card);
	});

	cards = Array.from(fragment.querySelectorAll('.card'));
	board.classList.add(cls.loading);
	board.appendChild(fragment);
	
	setTimeout(() => {
		board.classList.remove(cls.loading);
	}, 1000);
};

// Event listeners
closeInfoBtn.addEventListener('click', hideCharacterInfo);

infoModal.addEventListener('click', (e) => {
	if (e.target === infoModal) {
		hideCharacterInfo();
	}
});

marquee.addEventListener("animationend", (e) => {
	if (e.animationName !== "marquee-reveal") {
		return;
	}
	marquee.style.setProperty("display", "none");
});

document.querySelector("#reset-game").addEventListener("click", () => {
	resetGame();
	setupGame();
});

// Inicializar o jogo
setupGame();
