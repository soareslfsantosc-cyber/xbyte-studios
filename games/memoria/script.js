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
const rankingPanel = document.getElementById("ranking-panel");
const rankingList = document.getElementById("ranking-list");
const rankingEmpty = document.getElementById("ranking-empty");
const showRankingBtn = document.getElementById("show-ranking");
const closeRankingBtn = document.getElementById("close-ranking");
const RANKING_KEY = "xbyte_memory_hall_of_fame_v1";
let gameStartedAt = performance.now();

const loadRanking = () => {
	try { return JSON.parse(localStorage.getItem(RANKING_KEY) || "[]"); } catch { return []; }
};
const saveRanking = (entry) => {
	const ranking = loadRanking().concat(entry).sort((a, b) => a.time - b.time || a.tries - b.tries).slice(0, 8);
	try { localStorage.setItem(RANKING_KEY, JSON.stringify(ranking)); } catch {}
	renderRanking();
};
const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const renderRanking = () => {
	if (!rankingList) return;
	const ranking = loadRanking();
	rankingList.innerHTML = ranking.map((entry, i) => `<li><span class="rank-number">${String(i + 1).padStart(2, "0")}</span><strong>${entry.name.replace(/[<>]/g, "")}</strong><span>${formatTime(entry.time)} · ${entry.tries} tent.</span></li>`).join("");
	rankingEmpty.hidden = ranking.length > 0;
};
const toggleRanking = (open) => {
	rankingPanel.classList.toggle("is-visible", open);
	rankingPanel.setAttribute("aria-hidden", String(!open));
};
renderRanking();
// ============================================================
//  PLATEIA DO ESTÁDIO — pixel art 2.5D, reage ao jogador
//  (2D canvas puro, sem libs externas — mesma técnica leve do
//   jogo de tênis da XByte, sem depender de three.js/WebGL)
// ============================================================
const stadiumCanvas = document.getElementById("stadium-canvas");
const stadiumCtx = stadiumCanvas ? stadiumCanvas.getContext("2d") : null;
const STADIUM_W = 900, STADIUM_H = 520;

// Faixas verticais da cena — a arquibancada preenche o espaço
// inteiro até o corrimão, sem vão vazio entre a torcida e o palco.
const SKY_H = 70;
const STANDS_TOP = 64, STANDS_BOTTOM = 232;
const RAILING_Y = STANDS_BOTTOM, RAILING_H = 4;
const STAGE_TOP = RAILING_Y + RAILING_H;

// Paleta predominantemente fria (identidade neon-azul do jogo),
// com poucos tons quentes espalhados para a torcida parecer viva.
const CROWD_SHIRTS = ["#1a6bff", "#0d3f8a", "#24c8ff", "#6e6bff", "#2a2a3a",
	"#75edff", "#3a3a52", "#12579e", "#e2a838", "#c94b4b"];
// Mesmas cores, versão acinzentada/apagada — usada quando a pessoa
// está "de cabeça baixa" (decepção). Pré-calculada, sem custo por frame.
const CROWD_SHIRTS_SAD = ["#26344a", "#202c3e", "#283848", "#2e2e3e", "#242430",
	"#2a3a42", "#2c2c38", "#22303e", "#3a3428", "#3a2626"];
const CROWD_SKIN = ["#f4c890", "#d4a070", "#8a6040", "#c98860", "#e8b888"];
const CROWD_HAIR = ["#1a1410", "#3a2a1a", "#0a0a0a", "#5a4a3a", "#241820", "#2a3a4a"];

let stadiumMoodTarget = 0;   // -1 triste .. 0 neutro .. 1 empolgada
let stadiumMood = 0;        // valor suavizado (interpola até o alvo)
let stadiumMoodUntil = 0;
let stadiumFrame = 0;
let stadiumConfetti = [];

const triggerStadium = (mood) => {
	stadiumMoodTarget = mood === "win" ? 1 : mood === "lose" ? -1 : 0;
	stadiumMoodUntil = performance.now() + 1650;
	if (mood === "win") spawnConfetti();
};

const spawnConfetti = () => {
	for (let i = 0; i < 26; i++) {
		stadiumConfetti.push({
			x: 130 + Math.random() * 640,
			y: STANDS_TOP + 20 + Math.random() * 40,
			vx: (Math.random() - 0.5) * 1.4,
			vy: -1.6 - Math.random() * 1.8,
			color: CROWD_SHIRTS[Math.floor(Math.random() * CROWD_SHIRTS.length)],
			life: 55 + Math.random() * 25
		});
	}
};

// Gera uma fileira de arquibancada escalonada (efeito "torcida real"),
// mais distante = menor e mais apagada -> cria a sensação de profundidade.
const buildCrowdTier = (rows, colSpacing, yStart, rowSpacing, seedBase) => {
	const people = [];
	const cols = Math.ceil(STADIUM_W / colSpacing) + 2;
	for (let row = 0; row < rows; row++) {
		const y = yStart + row * rowSpacing;
		const stagger = (row % 2 === 0) ? 0 : colSpacing / 2;
		for (let col = 0; col < cols; col++) {
			const x = col * colSpacing + stagger - colSpacing;
			if (x < -12 || x > STADIUM_W + 12) continue;
			const seed = Math.abs((col * 37 + row * 71 + seedBase) | 0);
			const shirtIdx = seed % CROWD_SHIRTS.length;
			people.push({
				x, y,
				shirt: CROWD_SHIRTS[shirtIdx],
				shirtSad: CROWD_SHIRTS_SAD[shirtIdx],
				skin: CROWD_SKIN[(seed >> 2) % CROWD_SKIN.length],
				hair: CROWD_HAIR[(seed >> 4) % CROWD_HAIR.length],
				phase: (seed % 100) / 100 * Math.PI * 2,
				idleFan: (seed % 13) === 0, // alguns fãs sempre animados, mesmo parado o jogo
				armUp: false, armTimer: 0
			});
		}
	}
	return people;
};

// 3 fileiras de profundidade preenchendo a arquibancada inteira:
// fundo (pequena/apagada, no topo) -> frente (maior/viva, embaixo)
const crowdBack  = buildCrowdTier(3, 14, STANDS_TOP + 10, 13, 101);
const crowdMid   = buildCrowdTier(3, 18, STANDS_TOP + 50, 16, 307);
const crowdFront = buildCrowdTier(3, 22, STANDS_TOP + 96, 20, 509);
const CROWD_TIERS = [crowdBack, crowdMid, crowdFront];

const exciteTier = (tier, fraction) => {
	const n = Math.floor(tier.length * fraction);
	for (let i = 0; i < n; i++) {
		const p = tier[Math.floor(Math.random() * tier.length)];
		p.armUp = true;
		p.sadPose = false;
		p.armTimer = 26 + Math.floor(Math.random() * 30);
	}
};

// Cabeça baixa + camiseta acinzentada — reação de decepção
// (par do exciteTier, mesmo contador de tempo, aparência diferente ao desenhar).
const sadTier = (tier, fraction) => {
	const n = Math.floor(tier.length * fraction);
	for (let i = 0; i < n; i++) {
		const p = tier[Math.floor(Math.random() * tier.length)];
		p.armUp = true;
		p.sadPose = true;
		p.armTimer = 30 + Math.floor(Math.random() * 34);
	}
};

const exciteIdleFans = (tier) => {
	tier.forEach(p => {
		if (p.idleFan && p.armTimer === 0 && Math.random() < 0.004) {
			p.armUp = true;
			p.sadPose = false;
			p.armTimer = 20 + Math.floor(Math.random() * 20);
		}
	});
};

const updateStadium = (now) => {
	// Aproxima o humor suavemente do alvo — transições sem solavancos
	const active = now < stadiumMoodUntil;
	const target = active ? stadiumMoodTarget : 0;
	stadiumMood += (target - stadiumMood) * 0.06;

	if (active && stadiumMoodTarget > 0 && Math.random() < 0.5) {
		exciteTier(crowdFront, 0.05);
		if (Math.random() < 0.5) exciteTier(crowdMid, 0.03);
	} else if (active && stadiumMoodTarget < 0 && Math.random() < 0.4) {
		sadTier(crowdFront, 0.06);
		if (Math.random() < 0.4) sadTier(crowdMid, 0.04);
	} else if (!active) {
		// Torcida "viva" mesmo parada: fãs animados acenam de vez em quando
		exciteIdleFans(crowdFront);
		exciteIdleFans(crowdMid);
	}

	CROWD_TIERS.forEach(tier => tier.forEach(p => {
		if (p.armTimer > 0) { p.armTimer--; if (p.armTimer === 0) { p.armUp = false; p.sadPose = false; } }
	}));

	stadiumConfetti = stadiumConfetti.filter(c => c.life > 0);
	stadiumConfetti.forEach(c => { c.x += c.vx; c.y += c.vy; c.vy += 0.05; c.life--; });
};

// Desenha uma fileira com um nível de detalhe (0..1): controla
// tamanho/brilho/braços -> é isso que cria a profundidade 2.5D.
// Agrupa os retângulos por cor para não trocar fillStyle a cada
// pessoa (bem mais rápido com a arquibancada cheia).
const drawCrowdTier = (ctx, tier, t, detail, moodBoost) => {
	const headSize = Math.round(2 + detail * 2);
	const bodyW = Math.round(3 + detail * 3);
	const bodyH = Math.round(3 + detail * 3);
	const dim = 0.45 + detail * 0.55; // fileiras de trás mais apagadas (névoa)
	const showArms = detail > 0.3;
	const showFlash = moodBoost.lift > 0.3 && detail > 0.4;

	const bodies = new Map(), skinParts = new Map(), hairs = new Map();
	const flashes = [];
	const addTo = (map, color, x, y, w, h) => {
		if (!map.has(color)) map.set(color, []);
		map.get(color).push([x, y, w, h]);
	};

	tier.forEach(p => {
		const sway = Math.sin(t * 1.6 + p.phase) * (0.6 + detail * 1.2);
		const cheer = p.armUp && !p.sadPose;
		const sad = p.armUp && p.sadPose;
		const bounce = cheer
			? Math.abs(Math.sin(t * 10 + p.phase)) * (2 + detail * 4)
			: sad
				? -Math.abs(Math.sin(t * 4 + p.phase)) * 0.6 // balanço lento e curto, cabeça baixa
				: sway + moodBoost.lift * detail * 1.5;
		const y = p.y - bounce;
		const slump = moodBoost.slump * (1 - detail * 0.4) + (sad ? headSize * 0.7 : 0);

		// Corpo (camiseta — acinzentada quando "de cabeça baixa")
		addTo(bodies, sad ? p.shirtSad : p.shirt, p.x - bodyW / 2, y + headSize + slump, bodyW, bodyH);
		// Cabeça + cabelo
		addTo(skinParts, p.skin, p.x - headSize / 2, y + slump, headSize, headSize);
		addTo(hairs, p.hair, p.x - headSize / 2, y - 1 + slump, headSize, Math.max(1, Math.round(headSize * 0.4)));

		// Braços: erguidos ao comemorar, escondidos ao lamentar (cabeça
		// baixa/braços recolhidos), em repouso no resto do tempo.
		if (showArms && !sad) {
			const armY = cheer ? y - headSize * 0.6 : y + headSize + 1;
			const armH = cheer ? headSize * 1.4 : headSize * 0.8;
			addTo(skinParts, p.skin, p.x - bodyW / 2 - 1, armY + slump, 1, armH);
			addTo(skinParts, p.skin, p.x + bodyW / 2, armY + slump, 1, armH);
		}

		// Flash ocasional de torcida (brilho de celular/câmera)
		if (showFlash && (Math.floor(t * 8 + p.phase * 10) % 37 === 0)) {
			flashes.push([p.x - 1, y - 2 + slump, headSize + 2, 2]);
		}
	});

	ctx.globalAlpha = dim;
	[bodies, skinParts, hairs].forEach(map => {
		map.forEach((rects, color) => {
			ctx.fillStyle = color;
			ctx.beginPath();
			rects.forEach(r => ctx.rect(r[0], r[1], r[2], r[3]));
			ctx.fill();
		});
	});
	if (flashes.length) {
		ctx.fillStyle = "rgba(255,255,255,0.9)";
		ctx.beginPath();
		flashes.forEach(r => ctx.rect(r[0], r[1], r[2], r[3]));
		ctx.fill();
	}
	ctx.globalAlpha = 1;
};

const drawStadium = (now = 0) => {
	if (!stadiumCtx) return;
	const ctx = stadiumCtx;
	const t = now / 1000;
	updateStadium(now);

	const mood = stadiumMood; // -1..1 já suavizado
	const moodBoost = {
		lift: Math.max(0, mood),      // 0..1 empolgação
		slump: Math.max(0, -mood) * 3  // 0..3 abatimento
	};

	ctx.clearRect(0, 0, STADIUM_W, STADIUM_H);

	// --- Céu noturno de arena ---
	const sky = ctx.createLinearGradient(0, 0, 0, SKY_H);
	sky.addColorStop(0, "#04060f"); sky.addColorStop(0.55, "#0a1330"); sky.addColorStop(1, "#123a5e");
	ctx.fillStyle = sky; ctx.fillRect(0, 0, STADIUM_W, SKY_H);

	// Refletor central — pulsa nas comemorações, apaga um pouco na tristeza
	const glowR = 90 + moodBoost.lift * 20 - moodBoost.slump * 10;
	const glow = ctx.createRadialGradient(450, 30, 4, 450, 30, glowR);
	glow.addColorStop(0, `rgba(100,200,255,${Math.max(0.18, 0.5 + moodBoost.lift * 0.25 - moodBoost.slump * 0.12)})`);
	glow.addColorStop(1, "rgba(100,200,255,0)");
	ctx.fillStyle = glow; ctx.fillRect(0, 0, STADIUM_W, SKY_H + 60);

	// --- Arquibancada cheia: 3 fileiras de profundidade ---
	ctx.fillStyle = "#0a0714";
	ctx.fillRect(0, STANDS_TOP - 6, STADIUM_W, STANDS_BOTTOM - STANDS_TOP + 6);
	drawCrowdTier(ctx, crowdBack, t, 0.15, moodBoost);
	drawCrowdTier(ctx, crowdMid, t, 0.55, moodBoost);
	drawCrowdTier(ctx, crowdFront, t, 1.0, moodBoost);

	// Onda fria de decepção sobre a arquibancada inteira
	if (moodBoost.slump > 0.15) {
		ctx.fillStyle = `rgba(8,14,34,${Math.min(0.28, moodBoost.slump * 0.11)})`;
		ctx.fillRect(0, STANDS_TOP - 6, STADIUM_W, STANDS_BOTTOM - STANDS_TOP + 6);
	}

	// Névoa de profundidade sobre a fileira de trás
	const haze = ctx.createLinearGradient(0, STANDS_TOP - 6, 0, STANDS_TOP + 46);
	haze.addColorStop(0, "rgba(6,10,26,0.55)"); haze.addColorStop(1, "rgba(6,10,26,0)");
	ctx.fillStyle = haze; ctx.fillRect(0, STANDS_TOP - 6, STADIUM_W, 52);

	// --- Corrimão/grade ---
	ctx.fillStyle = "#0e2a45"; ctx.fillRect(0, RAILING_Y, STADIUM_W, RAILING_H);
	ctx.fillStyle = "rgba(56,200,255,0.55)"; ctx.fillRect(0, RAILING_Y, STADIUM_W, 1);

	// --- Palco/piso com spotlight ---
	ctx.fillStyle = "#050a16"; ctx.fillRect(0, STAGE_TOP, STADIUM_W, STADIUM_H - STAGE_TOP);
	const spot = ctx.createRadialGradient(450, 420, 20, 450, 420, 340);
	spot.addColorStop(0, `rgba(40,110,200,${Math.max(0.12, 0.30 + moodBoost.lift * 0.18 - moodBoost.slump * 0.10)})`);
	spot.addColorStop(1, "rgba(10,15,30,0)");
	ctx.fillStyle = spot; ctx.fillRect(0, STAGE_TOP, STADIUM_W, STADIUM_H - STAGE_TOP);

	ctx.fillStyle = "rgba(20,50,90,0.9)";
	ctx.beginPath();
	ctx.moveTo(70, STADIUM_H); ctx.lineTo(830, STADIUM_H);
	ctx.lineTo(640, STAGE_TOP + 12); ctx.lineTo(260, STAGE_TOP + 12);
	ctx.closePath(); ctx.fill();

	ctx.strokeStyle = `rgba(90,220,255,${0.35 + moodBoost.lift * 0.35})`;
	ctx.lineWidth = 2;
	ctx.strokeRect(260, STAGE_TOP + 12, 380, STADIUM_H - (STAGE_TOP + 12) - 4);
	ctx.beginPath(); ctx.moveTo(450, STAGE_TOP + 12); ctx.lineTo(450, STADIUM_H - 4); ctx.stroke();

	// --- Confete de comemoração ---
	stadiumConfetti.forEach(c => {
		ctx.globalAlpha = Math.min(1, c.life / 20);
		ctx.fillStyle = c.color;
		ctx.fillRect(c.x, c.y, 3, 3);
	});
	ctx.globalAlpha = 1;

	// --- Vinheta ---
	const vig = ctx.createRadialGradient(450, 260, 120, 450, 260, 520);
	vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.55)");
	ctx.fillStyle = vig; ctx.fillRect(0, 0, STADIUM_W, STADIUM_H);

	stadiumFrame = requestAnimationFrame(drawStadium);
};
if (stadiumCanvas) requestAnimationFrame(drawStadium);

const cls = {
	completed: "is-complete",
	combo: "is-combo",
	loading: "is-loading",
	matched: "is-matched",
	waiting: "is-waiting",
	hidden: "hidden",
	shuffling: "is-shuffling",
	preview: "is-previewing"
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
let previewTimers = [];

const clearPreviewTimers = () => {
	previewTimers.forEach(id => clearTimeout(id));
	previewTimers = [];
};

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

const typeText = (element, text, speed = 18) => {
	element.textContent = "";
	let index = 0;
	const writeNext = () => {
		if (index >= text.length) return;
		element.textContent += text[index++];
		setTimeout(writeNext, speed);
	};
	writeNext();
};

const showCharacterInfo = (characterId) => {
	const character = characters.find(c => c.id === characterId);
	if (character) {
		characterName.textContent = character.name;
		characterDescription.textContent = "";
		infoModal.classList.remove(cls.hidden);
		infoModal.classList.remove("is-opening");
		void infoModal.offsetWidth;
		infoModal.classList.add("is-opening");
		typeText(characterDescription, character.description);
		triggerStadium("win");
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
		triggerStadium("lose");

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
	const elapsedSeconds = Math.max(1, Math.round((performance.now() - gameStartedAt) / 1000));
	setTimeout(() => {
		const rawName = window.prompt("Você completou o desafio! Digite seu nome para o ranking:", "Jogador");
		const name = (rawName || "Jogador").trim().slice(0, 18) || "Jogador";
		saveRanking({ name, time: elapsedSeconds, tries: triesCount, createdAt: Date.now() });
		toggleRanking(true);
	}, 1150);

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
	gameStartedAt = performance.now();
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
	clearPreviewTimers(); // cancela prévia de uma partida anterior, se houver
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
		card.setAttribute('aria-pressed', 'true'); // Prévia: começa virada por 5s
		
		card.innerHTML = `
			<div class="content">
				<img src="${character.image}" alt="${character.name}" class="card-image">
			</div>
		`;
		
		card.style.setProperty("--i", index + 1);
		card.addEventListener("click", () => {
			if (board.classList.contains(cls.waiting) || board.classList.contains(cls.shuffling) || board.classList.contains(cls.preview) || card.getAttribute("disabled") !== null) {
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
	board.classList.add(cls.preview);
	board.appendChild(fragment);
	
	setTimeout(() => {
		board.classList.remove(cls.loading);
	}, 1000);

	// Prévia inicial: mostra todas as cartas viradas por 5s para o
	// jogador memorizar, depois embaralha as posições e vira pra baixo.
	previewTimers.push(setTimeout(() => {
		board.classList.add(cls.shuffling);

		// Troca as cartas no "meio" da animação de giro (90°, de perfil),
		// igual ao truque visual usado no embaralhamento do meio-jogo.
		previewTimers.push(setTimeout(() => {
			const currentCards = Array.from(board.querySelectorAll('.card'));
			const shuffledIds = shuffle(currentCards.map(c => c.getAttribute('data-character')));

			currentCards.forEach((card, index) => {
				const character = characters.find(c => c.id === shuffledIds[index]);
				card.setAttribute('data-character', shuffledIds[index]);
				card.setAttribute('aria-pressed', 'false');
				card.querySelector('.card-image').src = character.image;
				card.querySelector('.card-image').alt = character.name;
			});
		}, 300));

		previewTimers.push(setTimeout(() => {
			board.classList.remove(cls.shuffling);
			board.classList.remove(cls.preview);
		}, 600));
	}, 5000));
};

// Event listeners
closeInfoBtn.addEventListener('click', hideCharacterInfo);
showRankingBtn.addEventListener("click", () => { renderRanking(); toggleRanking(true); });
closeRankingBtn.addEventListener("click", () => toggleRanking(false));

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
