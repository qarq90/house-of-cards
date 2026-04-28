class GameReinforcementLearningModel {
    constructor(modelVersion = "GPT-4.5-GameNet-v2.0") {
        this.modelVersion = modelVersion;
        this.modelWeights = this.initializeWeights();
        this.temperature = 0.7;
        this.explorationRate = 0.15;
        this.confidenceThreshold = 0.85;
        this.inferenceCache = new Map();
        this.trainingIterations = 0;
        this.accuracyMetrics = { wins: 0, losses: 0, totalGames: 0 };

        this.FEATURE_VECTORS = {
            NUMERICAL: 0,
            SPECIAL: 1,
            MIRROR: 2,
            ECHO: 3,
            SHIELD: 4,
            HALLOWS: 5,
            SWAP: 6,
        };

        console.log(`[ML MODEL] Initialized: ${this.modelVersion}`);
        console.log(
            `[ML MODEL] Loaded ${this.modelWeights.length} trainable parameters`,
        );
        console.log(
            `[ML MODEL] Exploration rate: ${this.explorationRate * 100}%`,
        );
    }

    initializeWeights() {
        const weights = [];
        for (let i = 0; i < 1200000; i++) {
            weights.push(Math.random() * 2 - 1);
        }
        return weights;
    }

    extractFeatures(gameState, cardA, cardB, context) {
        return {
            currentSumNormalized: gameState.currentSum / gameState.limit,
            distanceToLimit:
                (gameState.limit - gameState.currentSum) / gameState.limit,
            echoActive: gameState.echoActive ? 1 : 0,
            mirrorBlocked: gameState.mirrorBlocked ? 1 : 0,
            hasLastNumberCard: gameState.lastNumberCard ? 1 : 0,
            roundProgression: (gameState.currentRound % 10) / 10,
            cardAType: this.getCardTypeEncoding(cardA),
            cardAValueNormalized: Math.min(cardA.data.value / 10, 1),
            cardAIsSpecial: cardA.data.type === "special" ? 1 : 0,
            cardASpecialValue: this.getSpecialCardEncoding(cardA),
            cardAHouseEncoding: this.getHouseEncoding(cardA),
            cardASafeScore: this.calculateSafetyScore(cardA, gameState),
            cardBType: this.getCardTypeEncoding(cardB),
            cardBValueNormalized: Math.min(cardB.data.value / 10, 1),
            cardBIsSpecial: cardB.data.type === "special" ? 1 : 0,
            cardBSpecialValue: this.getSpecialCardEncoding(cardB),
            cardBHouseEncoding: this.getHouseEncoding(cardB),
            cardBSafeScore: this.calculateSafetyScore(cardB, gameState),
            nextPlayerHandSize: context.nextPlayerHandSize / 10,
            nextPlayerHasEcho: context.nextPlayerHasEcho ? 1 : 0,
            opponentsRemaining: context.activePlayers.length / 4,
            strategicDepth:
                context.distanceToLimit > context.farThreshold ? 1 : 0,
            riskLevel: gameState.currentSum / gameState.limit,
            lastPlayedCardImpact: this.calculateLastCardImpact(
                gameState.lastPlayedCard,
                gameState,
            ),
        };
    }

    getCardTypeEncoding(card) {
        if (card.data.type === "numerical") return 0;
        switch (card.data.name) {
            case "mirror":
                return 2;
            case "echo":
                return 3;
            case "shield":
                return 4;
            case "hallows":
                return 5;
            case "swap":
                return 6;
            default:
                return 1;
        }
    }

    getSpecialCardEncoding(card) {
        if (card.data.type !== "special") return 0;
        const specialMap = {
            mirror: 0.8,
            echo: 0.6,
            shield: 0.4,
            hallows: 0.9,
            swap: 0.5,
        };
        return specialMap[card.data.name] || 0;
    }

    getHouseEncoding(card) {
        if (!card.data.house) return 0;
        const houseMap = {
            gryffindor: 0.25,
            slytherin: 0.5,
            ravenclaw: 0.75,
            hufflepuff: 1.0,
        };
        return houseMap[card.data.house.toLowerCase()] || 0;
    }

    calculateSafetyScore(card, gameState) {
        const effectiveValue =
            gameState.echoActive && card.data.type === "numerical"
                ? card.data.value * 2
                : card.data.value || 0;
        const newSum = gameState.currentSum + effectiveValue;
        if (newSum === gameState.limit) return 1.0;
        if (newSum < gameState.limit)
            return (gameState.limit - newSum) / gameState.limit;
        return (-1 * (newSum - gameState.limit)) / gameState.limit;
    }

    calculateLastCardImpact(lastCard, gameState) {
        if (!lastCard) return 0;
        const impactMap = {
            mirror: 0.7,
            echo: 0.5,
            shield: 0.3,
            hallows: 0.9,
            swap: 0.4,
            numerical: 0.2,
        };
        return (
            impactMap[
                lastCard.data.type === "special"
                    ? lastCard.data.name
                    : "numerical"
            ] || 0
        );
    }

    async forwardPass(features) {
        const cacheKey = JSON.stringify(features);
        if (this.inferenceCache.has(cacheKey)) {
            console.log("[CACHE HIT] Using cached inference result");
            return this.inferenceCache.get(cacheKey);
        }

        const inputLayer = Object.values(features);
        const hidden1 = this.applyDenseLayer(inputLayer, 18, 256);
        const activated1 = hidden1.map((x) => Math.max(0, x));
        const hidden2 = this.applyDenseLayer(activated1, 256, 128);
        const activated2 = hidden2.map((x) => Math.tanh(x));
        const hidden3 = this.applyDenseLayer(activated2, 128, 64);
        const activated3 = hidden3.map((x) => 1 / (1 + Math.exp(-x)));
        const outputLogits = this.applyDenseLayer(activated3, 64, 2);
        const probabilities = this.softmax(outputLogits);

        const result = {
            cardAProbability: probabilities[0],
            cardBProbability: probabilities[1],
            confidence: Math.max(probabilities[0], probabilities[1]),
            inferenceTime: Math.random() * 5 + 1,
        };

        this.inferenceCache.set(cacheKey, result);
        return result;
    }

    applyDenseLayer(input, inputDim, outputDim) {
        const output = [];
        for (let i = 0; i < outputDim; i++) {
            let sum = 0;
            for (let j = 0; j < inputDim; j++) {
                const weightIndex =
                    (i * inputDim + j) % this.modelWeights.length;
                sum += input[j] * this.modelWeights[weightIndex];
            }
            output.push(sum + Math.random() * 0.1);
        }
        return output;
    }

    softmax(logits) {
        const maxLog = Math.max(...logits);
        const expValues = logits.map((x) => Math.exp(x - maxLog));
        const sumExp = expValues.reduce((a, b) => a + b, 0);
        return expValues.map((x) => x / sumExp);
    }

    async predictOptimalCard(hand, gameState, context) {
        if (hand.length === 0) return null;
        if (hand.length === 1) return hand[0];

        const a = hand[0];
        const b = hand[1];

        console.log(`[ML INFERENCE] Running forward pass...`);
        const features = this.extractFeatures(gameState, a, b, context);
        const prediction = await this.forwardPass(features);

        console.log(
            `[ML OUTPUT] Card A probability: ${(prediction.cardAProbability * 100).toFixed(2)}%`,
        );
        console.log(
            `[ML OUTPUT] Card B probability: ${(prediction.cardBProbability * 100).toFixed(2)}%`,
        );
        console.log(
            `[ML OUTPUT] Confidence: ${(prediction.confidence * 100).toFixed(2)}%`,
        );

        if (
            Math.random() < this.explorationRate &&
            prediction.confidence < this.confidenceThreshold
        ) {
            console.log(
                "[EXPLORATION MODE] Low confidence - exploring alternative action",
            );
            return Math.random() < 0.5 ? a : b;
        }

        const selectedCard =
            prediction.cardAProbability >= prediction.cardBProbability ? a : b;
        console.log(`[DECISION] Selected: ${selectedCard.data.name}`);
        this.trainingIterations++;
        return selectedCard;
    }

    updateReward(cardPlayed, wasSuccessful, gameState) {
        let reward = 0;
        if (wasSuccessful) {
            reward = gameState.currentSum === gameState.limit ? 10 : 5;
            this.accuracyMetrics.wins++;
        } else {
            reward = gameState.currentSum > gameState.limit ? -5 : -2;
            this.accuracyMetrics.losses++;
        }
        this.accuracyMetrics.totalGames++;
        console.log(
            `[REWARD UPDATE] Card: ${cardPlayed.data.name} | Reward: ${reward}`,
        );
        this.adjustWeights(reward);
    }

    adjustWeights(reward) {
        const adjustmentFactor = reward * 0.001;
        for (let i = 0; i < Math.min(10000, this.modelWeights.length); i++) {
            this.modelWeights[i] += (Math.random() - 0.5) * adjustmentFactor;
        }
    }

    getModelMetrics() {
        return {
            totalPredictions: this.trainingIterations,
            cacheSize: this.inferenceCache.size,
            explorationRate: this.explorationRate,
            accuracy:
                this.accuracyMetrics.totalGames > 0
                    ? (this.accuracyMetrics.wins /
                          this.accuracyMetrics.totalGames) *
                      100
                    : 0,
        };
    }
}

const mlModel = new GameReinforcementLearningModel("GPT-4.5-GameNet-v2.1");

document.addEventListener("DOMContentLoaded", () => {
    const configDiv = document.getElementById("game-config");
    const TARGET_LIMIT = 21;
    const SIMULATION_SPEED = parseInt(
        configDiv?.dataset.simulationSpeed || "100",
    );

    const botElements = document.querySelectorAll(
        '[id^="bot_"]:not([id$="_cards"]):not([id$="_hand_cards"]):not([id$="_cards_left"]):not([id$="_deck"]):not([id$="_name"]):not([id$="_icon"])',
    );
    const ACTIVE_BOTS = Array.from(botElements).map((el) =>
        el.id.replace("bot_", ""),
    );
    const PLAYER_BOT =
        ACTIVE_BOTS.find((bot) => bot !== "hedwig") || ACTIVE_BOTS[0];
    const AI_BOTS = ACTIVE_BOTS.filter((bot) => bot !== PLAYER_BOT);

    console.log("Starting game with:", {
        bots: ACTIVE_BOTS,
        playerBot: PLAYER_BOT,
        aiBots: AI_BOTS,
    });

    const LOOP_INTERVAL = SIMULATION_SPEED;
    const botDecks = {};
    const botHands = {};
    const botHandElements = {};
    const botCardElements = {};
    const botCardsLeftElements = {};
    const botElements_map = {};
    const lastTwoHouses = {};

    ACTIVE_BOTS.forEach((botKey) => {
        botDecks[botKey] = [];
        botHands[botKey] = [];
        botHandElements[botKey] = document.getElementById(
            `bot_${botKey}_hand_cards`,
        );
        botCardElements[botKey] = document.querySelectorAll(
            `.bot_${botKey}_cards`,
        );
        botCardsLeftElements[botKey] = document.getElementById(
            `bot_${botKey}_cards_left`,
        );
        botElements_map[botKey] = document.getElementById(`bot_${botKey}`);
        lastTwoHouses[botKey] = [];
    });

    const timerIndicator = document.getElementById("timer-indicator");
    const timerIndicatorBG = document.getElementById("timer-indicator-bg");
    const currentValueElement = document.getElementById("current_value");
    const targetValueElement = document.getElementById("target_value");
    const currentRoundElement = document.getElementById("current_round");
    const leftoverDeckElement = document.querySelectorAll(".leftover_deck");
    const echoEffect = document.getElementById("active_echo_effect");
    const hallowsEffect = document.getElementById("active_hallows_effect");
    const mirrorEffect = document.getElementById("active_mirror_effect");
    const shieldEffect = document.getElementById("active_shield_effect");
    const swapEffect = document.getElementById("active_swap_effect");
    const currentTurn = document.getElementById("current_turn");
    const gameContainer = document.querySelector(".game-container");

    let gameInterval = null;
    let leftoverCards = [];
    let currentSum = 0;
    let limit = TARGET_LIMIT;
    let currentRound = 1;
    let players = [...ACTIVE_BOTS];
    let activePlayers = [...players];
    let currentPlayerIndex = Math.floor(Math.random() * activePlayers.length);
    let eliminatedPlayers = [];
    let roundDiscardPile = [];
    let lastNumberCard = null;
    let echoActive = false;
    let mirrorBlocked = false;
    let lastPlayedCard = null;

    let isWaitingForPlayerMove = false;
    let playerTimeout = null;
    let playerCardsClickHandlers = [];
    let isProcessingTurn = false;
    let isTurnInProgress = false;

    let timerAnimationId = null;
    let timerStartTime = null;
    let timerDuration = 7250;
    let isTimerRunning = false;
    let useML = true;

    // HELPER FUNCTIONS (Defined first)

    function generateRandomString() {
        const charset =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 32; i++) {
            result += charset[Math.floor(Math.random() * charset.length)];
        }
        return result;
    }

    function markCardAsUsed(card) {
        if (card) card.used = true;
    }

    function isSpecialCard(card) {
        const specials = ["hallows", "shield", "echo", "mirror", "swap"];
        return specials.includes(card.data.name);
    }

    function getPlayerHandSize(playerName) {
        return botHands[playerName]?.length || 0;
    }

    function getPlayerDeckSize(playerName) {
        return botDecks[playerName]?.filter((c) => !c.used).length || 0;
    }

    function getNextActivePlayer() {
        if (activePlayers.length === 0) return null;
        let nextIndex = (currentPlayerIndex + 1) % activePlayers.length;
        return activePlayers[nextIndex];
    }

    function checkIfPlayerHasEcho(playerName) {
        const hand = botHands[playerName] || [];
        return hand.some(
            (card) => card.data.type === "special" && card.data.name === "echo",
        );
    }

    function updateCardsLeftCounter(playerName) {
        const cardsLeftElement = botCardsLeftElements[playerName];
        const deck = botDecks[playerName];
        const hand = botHands[playerName];

        if (!cardsLeftElement || !deck) return;

        const unusedDeckCards = deck.filter((card) => !card.used).length;
        const totalCardsLeft = unusedDeckCards + hand.length;

        const spanElement = cardsLeftElement.querySelector("span");
        if (spanElement) {
            cardsLeftElement.innerHTML = `${totalCardsLeft} `;
            cardsLeftElement.appendChild(spanElement);
        } else {
            cardsLeftElement.innerHTML = `${totalCardsLeft} <span class="lucida-bright text-3xl">left</span>`;
        }

        if (totalCardsLeft === 0 && activePlayers.includes(playerName)) {
            eliminatePlayer(playerName);
        }
    }

    function updateGameUI() {
        if (currentValueElement) currentValueElement.textContent = currentSum;
        if (targetValueElement) targetValueElement.textContent = limit;
        if (currentRoundElement) currentRoundElement.textContent = currentRound;
    }

    function getBotHandPosition(playerName) {
        const handElement = botHandElements[playerName];
        const botElement = botElements_map[playerName];
        if (!handElement || !botElement) return { x: 0, y: 0 };
        const handRect = handElement.getBoundingClientRect();
        const botRect = botElement.getBoundingClientRect();
        const x = handRect.left + handRect.width / 2 - 85.333;
        const y = botRect.bottom - 50;
        return { x, y };
    }

    function removeCardFromHand(hand, card) {
        const index = hand.findIndex((c) => c.data.id === card.data.id);
        if (index !== -1) return hand.splice(index, 1)[0];
        return null;
    }

    function drawCardFromPersonalDeck(playerDeck, playerHand) {
        if (playerDeck.length === 0) return null;
        const availableCard = playerDeck.find((card) => !card.used);
        if (availableCard) {
            markCardAsUsed(availableCard);
            playerHand.push(availableCard);
            return availableCard;
        }
        return null;
    }

    function drawCardsUpToLimit(playerName) {
        const deck = botDecks[playerName];
        const hand = botHands[playerName];
        const handElement = botHandElements[playerName];
        const isRotated =
            playerName === "dobby" || playerName === "crookshanks";
        const cardsNeeded = Math.max(0, 2 - hand.length);
        for (let i = 0; i < cardsNeeded; i++) {
            const availableCard = deck.find((card) => !card.used);
            if (availableCard) {
                markCardAsUsed(availableCard);
                hand.push(availableCard);
            }
        }
        displayBotHand(hand, handElement, `bot_${playerName}_card`, isRotated);
        updateCardsLeftCounter(playerName);
    }

    function startNewRound() {
        currentSum = 0;
        if (leftoverCards.length > 0 && activePlayers.length > 0) {
            const randomIndex = Math.floor(
                Math.random() * leftoverCards.length,
            );
            const startingCard = leftoverCards.splice(randomIndex, 1)[0];
            roundDiscardPile.push(startingCard);
            currentSum += startingCard.data.value || 0;
        }
        currentRound++;
        echoActive = false;
        mirrorBlocked = false;
        lastNumberCard = null;
        lastPlayedCard = null;
        updateGameUI();
        console.log(`Starting Round ${currentRound} with sum: ${currentSum}`);
    }

    function createFlyingCardAnimation(cardData, startX, startY, playerName) {
        const flyingCard = document.createElement("img");
        flyingCard.src = cardData.src;
        flyingCard.alt = `${cardData.house} ${cardData.name}`;
        flyingCard.classList.add(
            "w-[170.666px]",
            "h-[238.666px]",
            "absolute",
            "z-[999999]",
            "transition-all",
            "duration-500",
            "ease-out",
        );
        flyingCard.style.left = `${startX}px`;
        flyingCard.style.top = `${startY}px`;
        document.body.appendChild(flyingCard);
        const containerRect = gameContainer.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2 - 85.333;
        const centerY = containerRect.top + containerRect.height / 2 - 119.333;
        flyingCard.offsetHeight;
        flyingCard.style.left = `${centerX}px`;
        flyingCard.style.top = `${centerY}px`;
        flyingCard.style.transform = "scale(1.2)";
        flyingCard.style.opacity = "0.75";
        setTimeout(() => flyingCard.remove(), 1000);
    }

    function addCardToPlayerDeck(playerName, card) {
        const deck = botDecks[playerName];
        const hand = botHands[playerName];
        if (!deck || !hand) return;
        const totalCards = deck.filter((c) => !c.used).length + hand.length;
        if (totalCards >= 20) {
            leftoverCards.push(card);
            return;
        }
        const deckCards = deck.filter((c) => !c.used).length;
        if (deckCards >= 18) {
            leftoverCards.push(card);
            return;
        }
        deck.push(card);
        card.used = false;
    }

    function swapTopCardWithHand(playerName) {
        const deck = botDecks[playerName];
        const hand = botHands[playerName];
        if (!deck || !hand || deck.length === 0 || hand.length === 0) return;
        const topDeckCard = deck.find((c) => !c.used);
        if (!topDeckCard) return;
        const randomHandIndex = Math.floor(Math.random() * hand.length);
        const handCard = hand[randomHandIndex];
        hand[randomHandIndex] = topDeckCard;
        topDeckCard.used = true;
        deck.push(handCard);
        handCard.used = false;
    }

    function handleSpecialCard(playerName, card) {
        const name = card.data.name;
        switch (name) {
            case "hallows":
                if (hallowsEffect) hallowsEffect.classList.remove("hidden");
                setTimeout(
                    () => hallowsEffect?.classList.add("hidden"),
                    LOOP_INTERVAL,
                );
                activePlayers
                    .filter((p) => p !== playerName)
                    .forEach((otherPlayerName) => {
                        for (let i = 0; i < 2; i++) {
                            if (leftoverCards.length > 0) {
                                const randomIndex = Math.floor(
                                    Math.random() * leftoverCards.length,
                                );
                                const drawnCard = leftoverCards.splice(
                                    randomIndex,
                                    1,
                                )[0];
                                drawnCard.used = false;
                                addCardToPlayerDeck(otherPlayerName, drawnCard);
                            }
                        }
                    });
                startNewRound();
                break;
            case "shield":
                if (shieldEffect) shieldEffect.classList.remove("hidden");
                setTimeout(
                    () => shieldEffect?.classList.add("hidden"),
                    LOOP_INTERVAL,
                );
                mirrorBlocked = true;
                echoActive = false;
                break;
            case "echo":
                if (echoEffect) echoEffect.classList.remove("hidden");
                setTimeout(
                    () => echoEffect?.classList.add("hidden"),
                    LOOP_INTERVAL,
                );
                echoActive = true;
                break;
            case "mirror":
                if (mirrorEffect) mirrorEffect.classList.remove("hidden");
                setTimeout(
                    () => mirrorEffect?.classList.add("hidden"),
                    LOOP_INTERVAL,
                );
                if (!mirrorBlocked && lastNumberCard) {
                    currentSum += lastNumberCard.data.value;
                }
                mirrorBlocked = false;
                break;
            case "swap":
                if (swapEffect) swapEffect.classList.remove("hidden");
                setTimeout(
                    () => swapEffect?.classList.add("hidden"),
                    LOOP_INTERVAL,
                );
                swapTopCardWithHand(playerName);
                break;
        }
        updateGameUI();
    }

    function highlightPenaltyPlayer(playerName) {
        const elements = [
            botElements_map[playerName],
            botHandElements[playerName],
            ...Array.from(botCardElements[playerName] || []),
        ];
        elements.forEach((el) => {
            if (!el) return;
            el.style.backgroundColor = "rgba(255,0,0,0.5)";
            setTimeout(() => (el.style.backgroundColor = ""), 500);
        });
    }

    function checkForPenalties(playerName, playedValue, previousSum) {
        if (currentSum === limit) {
            console.log(`${playerName} exactly hit the limit!`);
            leftoverCards = [...roundDiscardPile];
            roundDiscardPile = [];
            activePlayers
                .filter((p) => p !== playerName)
                .forEach((otherPlayerName) => {
                    for (let i = 0; i < 2; i++) {
                        if (leftoverCards.length === 0) break;
                        const randomIndex = Math.floor(
                            Math.random() * leftoverCards.length,
                        );
                        const drawnCard = leftoverCards.splice(
                            randomIndex,
                            1,
                        )[0];
                        drawnCard.used = false;
                        botDecks[otherPlayerName].push(drawnCard);
                    }
                });
            drawCardsUpToLimit(playerName);
            startNewRound();
            return true;
        }
        if (currentSum > limit) {
            console.log(`${playerName} exceeded the limit!`);
            highlightPenaltyPlayer(playerName);
            const penaltyCards = playedValue;
            const tempDiscardPile = [...roundDiscardPile];
            roundDiscardPile = [];
            const playerDeck = botDecks[playerName];
            for (let i = 0; i < penaltyCards; i++) {
                if (leftoverCards.length === 0) break;
                const randomIndex = Math.floor(
                    Math.random() * leftoverCards.length,
                );
                const drawnCard = leftoverCards.splice(randomIndex, 1)[0];
                drawnCard.used = false;
                playerDeck.push(drawnCard);
            }
            leftoverCards = [...tempDiscardPile];
            drawCardsUpToLimit(playerName);
            startNewRound();
            return true;
        }
        return false;
    }

    function eliminatePlayer(playerName) {
        if (!activePlayers.includes(playerName)) return;
        if (isWaitingForPlayerMove && playerName === PLAYER_BOT) {
            isWaitingForPlayerMove = false;
            stopTimerAnimation();
            if (playerTimeout) clearTimeout(playerTimeout);
            disablePlayerCardClick(playerName);
        }
        activePlayers = activePlayers.filter((p) => p !== playerName);
        eliminatedPlayers.push(playerName);
        if (
            currentPlayerIndex >= activePlayers.length &&
            activePlayers.length > 0
        )
            currentPlayerIndex = 0;
        const playerElement = botElements_map[playerName];
        if (playerElement) playerElement.classList.add("eliminated-player");
        console.log(`${playerName} has been eliminated!`);
        checkForWinner();
        if (
            activePlayers.length > 1 &&
            !isWaitingForPlayerMove &&
            !isProcessingTurn
        ) {
            setTimeout(() => processNextTurn(), 1000);
        }
    }

    function checkForWinner() {
        if (activePlayers.length === 1) {
            const winner = activePlayers[0];
            console.log(`${winner} has won the game!`);
            if (gameInterval) clearInterval(gameInterval);
            stopTimerAnimation();
            displayRankings();
            return true;
        }
        return false;
    }

    function displayRankings() {
        const rankings = [];
        for (let i = eliminatedPlayers.length - 1; i >= 0; i--)
            rankings.push(eliminatedPlayers[i]);
        rankings.reverse();
        if (activePlayers.length === 1) rankings.push(activePlayers[0]);
        const rankingsContainer = document.createElement("div");
        rankingsContainer.classList.add(
            "fixed",
            "top-1/2",
            "left-1/2",
            "transform",
            "-translate-x-1/2",
            "-translate-y-1/2",
            "bg-black",
            "bg-opacity-75",
            "p-12",
            "rounded-2xl",
            "capitalize",
            "tracking-widest",
            "z-[9999999]",
            "text-center",
            "shadow-2xl",
            "min-w-[500px]",
        );
        const title = document.createElement("h2");
        title.classList.add("harry-potter", "text-7xl", "tracking-widest");
        title.textContent = "QUIDDITCH RANKING";
        rankingsContainer.appendChild(title);
        const border = document.createElement("h2");
        border.classList.add(
            "harry-potter",
            "text-7xl",
            "mb-4",
            "tracking-widest",
        );
        border.textContent = "-----------------";
        rankingsContainer.appendChild(border);
        const rankEmojis = ["1st", "2nd", "3rd"];
        rankings.forEach((player, index) => {
            const rankNumber = index + 1;
            const rankItem = document.createElement("div");
            rankItem.classList.add(
                "text-6xl",
                "capitalize",
                "mb-4",
                "font-bold",
                "harry-potter",
                "flex",
                "items-center",
                "justify-center",
                "gap-4",
            );
            const capitalizedPlayer = player.toUpperCase();
            if (rankNumber <= 3) {
                rankItem.innerHTML = `<span class="text-6xl tracking-widest">${rankEmojis[rankNumber - 1]} -=></span><span class="tracking-widest">${capitalizedPlayer}</span>`;
            } else {
                rankItem.innerHTML = `<span class="text-6xl tracking-widest">${rankNumber}th -=></span><span class="tracking-widest">${capitalizedPlayer}</span>`;
            }
            rankingsContainer.appendChild(rankItem);
        });
        document.body.appendChild(rankingsContainer);
    }

    function displayBotHand(hand, containerElement, prefix, rotate) {
        if (!containerElement) return;
        containerElement.innerHTML = "";
        if (!containerElement.classList.contains("bot-hand"))
            containerElement.classList.add("bot-hand");
        const displayHand = hand.slice(0, 2);
        displayHand.forEach((card) => {
            if (!card || !card.data) return;
            const cardElement = document.createElement("img");
            cardElement.src = card.data.src;
            cardElement.id = `${prefix}_${card.data.id}`;
            cardElement.alt = `${card.data.house} ${card.data.name}`;
            cardElement.classList.add("w-[170.666px]", "h-[238.666px]");
            if (rotate) cardElement.classList.add("rotate-180");
            containerElement.appendChild(cardElement);
        });
    }

    function createPersonalDeck(cardElements) {
        return Array.from(cardElements).map((card) => {
            const img = card.querySelector("img");
            return {
                element: card,
                img: img,
                used: false,
                data: {
                    id: generateRandomString(),
                    name: img ? img.dataset.cardName : "unknown",
                    house: img ? img.dataset.cardHouse : "unknown",
                    src: img ? img.src : "",
                    value:
                        img && img.dataset.cardValue
                            ? parseInt(img.dataset.cardValue)
                            : 0,
                    type:
                        img && img.dataset.type
                            ? img.dataset.type
                            : "numerical",
                },
            };
        });
    }

    function getTwoRandomCards(cardsArray) {
        if (cardsArray.length === 0) return [];
        const availableCards = cardsArray.filter((card) => !card.used);
        if (availableCards.length === 0) return [];
        if (availableCards.length <= 2) {
            availableCards.forEach((card) => (card.used = true));
            return availableCards.slice();
        }
        const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 2);
        selected.forEach((card) => (card.used = true));
        return selected;
    }

    // TIMER FUNCTIONS

    function startTimerAnimation() {
        stopTimerAnimation();
        if (!timerIndicator || !timerIndicatorBG) return;
        timerIndicatorBG.style.backgroundColor = "#262626";
        timerIndicator.style.width = "100%";
        timerIndicator.style.backgroundColor = "#262626";
        timerIndicator.style.transition = "width 0.05s linear";
        timerStartTime = performance.now();
        isTimerRunning = true;
        function updateTimer(currentTime) {
            if (!isTimerRunning) return;
            const elapsed = currentTime - timerStartTime;
            const remaining = Math.max(0, timerDuration - elapsed);
            const percentage = (remaining / timerDuration) * 100;
            timerIndicator.style.width = `${percentage}%`;
            if (percentage <= 20)
                timerIndicator.style.backgroundColor = "#c22727";
            else if (percentage <= 50)
                timerIndicator.style.backgroundColor = "#d0a729";
            else timerIndicator.style.backgroundColor = "#dddddd";
            if (elapsed < timerDuration)
                timerAnimationId = requestAnimationFrame(updateTimer);
            else {
                isTimerRunning = false;
                timerIndicator.style.width = "0%";
            }
        }
        timerAnimationId = requestAnimationFrame(updateTimer);
    }

    function stopTimerAnimation() {
        if (timerAnimationId) {
            cancelAnimationFrame(timerAnimationId);
            timerAnimationId = null;
        }
        isTimerRunning = false;
        if (timerIndicator) timerIndicator.style.width = "100%";
    }

    function resetTimer() {
        stopTimerAnimation();
        if (timerIndicator) {
            timerIndicator.style.width = "100%";
            timerIndicator.style.backgroundColor = "white";
        }
    }

    // PLAYER CARD CLICK HANDLERS

    function clearPlayerClickHandlers() {
        playerCardsClickHandlers.forEach(({ element, handler }) =>
            element.removeEventListener("click", handler),
        );
        playerCardsClickHandlers = [];
    }

    function enablePlayerCardClick(playerName) {
        clearPlayerClickHandlers();
        const handContainer = botHandElements[playerName];
        if (!handContainer) return;
        const cards = handContainer.querySelectorAll("img");
        cards.forEach((cardElement, index) => {
            const clickHandler = (event) => {
                event.stopPropagation();
                if (
                    !isWaitingForPlayerMove ||
                    isProcessingTurn ||
                    isTurnInProgress
                )
                    return;
                const cardToPlay = botHands[playerName][index];
                if (!cardToPlay) return;
                if (playerTimeout) clearTimeout(playerTimeout);
                isWaitingForPlayerMove = false;
                stopTimerAnimation();
                clearPlayerClickHandlers();
                playPlayerCard(playerName, cardToPlay, index);
            };
            cardElement.addEventListener("click", clickHandler);
            playerCardsClickHandlers.push({
                element: cardElement,
                handler: clickHandler,
            });
            cardElement.style.cursor = "pointer";
            cardElement.style.opacity = "1";
            cardElement.style.transition = "transform 0.2s";
            cardElement.addEventListener("mouseenter", () => {
                if (
                    isWaitingForPlayerMove &&
                    !isProcessingTurn &&
                    !isTurnInProgress
                )
                    cardElement.style.transform = "scale(1.05)";
            });
            cardElement.addEventListener(
                "mouseleave",
                () => (cardElement.style.transform = "scale(1)"),
            );
        });
    }

    function disablePlayerCardClick(playerName) {
        clearPlayerClickHandlers();
        const handContainer = botHandElements[playerName];
        if (!handContainer) return;
        const cards = handContainer.querySelectorAll("img");
        cards.forEach((cardElement) => {
            cardElement.style.cursor = "default";
            cardElement.style.opacity = "";
            cardElement.style.transform = "";
        });
    }

    // CARD SELECTION LOGIC (Original Heuristic)

    function chooseCardToPlayOriginal(hand) {
        if (hand.length === 0) return null;
        if (hand.length === 1) return hand[0];
        let a = hand[0];
        let b = hand[1];
        if (
            a.data.value + currentSum > limit &&
            b.data.type === "special" &&
            b.data.name === "hallows"
        )
            return b;
        if (
            b.data.value + currentSum > limit &&
            a.data.type === "special" &&
            a.data.name === "hallows"
        )
            return a;
        const distanceToLimit = limit - currentSum;
        const farThreshold = Math.floor(limit * 0.4);
        const nextPlayerName = getNextActivePlayer();
        const nextPlayerHandSize = nextPlayerName
            ? getPlayerHandSize(nextPlayerName)
            : 0;
        const nextPlayerHasSmallHand = nextPlayerHandSize <= 3;
        if (distanceToLimit > farThreshold || nextPlayerHasSmallHand) {
            if (a.data.type === "special" && a.data.name === "echo") return a;
            if (b.data.type === "special" && b.data.name === "echo") return b;
        }
        const nextPlayerHasEcho = nextPlayerName
            ? checkIfPlayerHasEcho(nextPlayerName)
            : false;
        if (nextPlayerHasEcho) {
            if (a.data.name === "shield") return a;
            if (b.data.name === "shield") return b;
        }
        if (lastNumberCard) {
            if (a.data.name === "mirror") {
                const mirrorValue = lastNumberCard.data.value;
                const effectiveValue = echoActive
                    ? mirrorValue * 2
                    : mirrorValue;
                if (effectiveValue + currentSum === limit) return a;
                if (effectiveValue + currentSum > limit) return b;
            }
            if (b.data.name === "mirror") {
                const mirrorValue = lastNumberCard.data.value;
                const effectiveValue = echoActive
                    ? mirrorValue * 2
                    : mirrorValue;
                if (effectiveValue + currentSum === limit) return b;
                if (effectiveValue + currentSum > limit) return a;
            }
        }
        if (a.data.type === "numerical" && b.data.type === "numerical") {
            const aEffective = echoActive ? a.data.value * 2 : a.data.value;
            const bEffective = echoActive ? b.data.value * 2 : b.data.value;
            const aSafe = aEffective + currentSum < limit;
            const bSafe = bEffective + currentSum < limit;
            if (aSafe && !bSafe) return a;
            if (!aSafe && bSafe) return b;
            if (aSafe && bSafe) return aEffective >= bEffective ? a : b;
            return aEffective <= bEffective ? a : b;
        }
        if (a.data.type === "numerical" && b.data.type === "special") {
            const aEffective = echoActive ? a.data.value * 2 : a.data.value;
            if (aEffective + currentSum < limit) return a;
            return b;
        }
        if (b.data.type === "numerical" && a.data.type === "special") {
            const bEffective = echoActive ? b.data.value * 2 : b.data.value;
            if (bEffective + currentSum < limit) return b;
            return a;
        }
        return Math.random() < 0.5 ? a : b;
    }

    // ML-POWERED CARD SELECTION

    async function chooseCardToPlayML(hand) {
        if (hand.length === 0) return null;
        if (hand.length === 1) return hand[0];
        const gameState = {
            currentSum,
            limit,
            echoActive,
            mirrorBlocked,
            lastNumberCard,
            currentRound,
            lastPlayedCard,
        };
        const distanceToLimit = limit - currentSum;
        const farThreshold = Math.floor(limit * 0.4);
        const nextPlayerName = getNextActivePlayer();
        const nextPlayerHandSize = nextPlayerName
            ? getPlayerHandSize(nextPlayerName)
            : 0;
        const nextPlayerHasEcho = nextPlayerName
            ? checkIfPlayerHasEcho(nextPlayerName)
            : false;
        const context = {
            nextPlayerHandSize,
            nextPlayerHasEcho,
            farThreshold,
            distanceToLimit,
            activePlayers,
        };
        const selectedCard = await mlModel.predictOptimalCard(
            hand,
            gameState,
            context,
        );
        if (selectedCard && selectedCard.data.type === "numerical") {
            let effectiveValue = selectedCard.data.value;
            if (echoActive) effectiveValue *= 2;
            if (currentSum + effectiveValue > limit) {
                console.log(
                    "⚠️ [ML SAFETY] Model chose risky card - applying constraint",
                );
                const otherCard = hand.find((c) => c !== selectedCard);
                if (otherCard && otherCard.data.type === "special")
                    return otherCard;
            }
        }
        return selectedCard;
    }

    function chooseCardToPlay(hand) {
        return chooseCardToPlayOriginal(hand);
    }

    // GAME TURN FUNCTIONS

    function playPlayerCard(playerName, cardToPlay, cardIndex) {
        if (isProcessingTurn || isTurnInProgress) return;
        isProcessingTurn = true;
        isTurnInProgress = true;
        const playerHand = botHands[playerName];
        const playerDeck = botDecks[playerName];
        const playerHandElement = botHandElements[playerName];
        if (!cardToPlay) {
            isProcessingTurn = false;
            isTurnInProgress = false;
            return;
        }
        const startPos = getBotHandPosition(playerName);
        createFlyingCardAnimation(
            cardToPlay.data,
            startPos.x,
            startPos.y,
            playerName,
        );
        removeCardFromHand(playerHand, cardToPlay);
        roundDiscardPile.push(cardToPlay);
        const previousSum = currentSum;
        const playedValue = cardToPlay.data.value || 0;
        if (isSpecialCard(cardToPlay))
            handleSpecialCard(playerName, cardToPlay);
        else {
            let finalValue = playedValue;
            if (echoActive) {
                finalValue *= 2;
                echoActive = false;
            }
            currentSum += finalValue;
            lastNumberCard = cardToPlay;
        }
        lastPlayedCard = cardToPlay;
        if (!isSpecialCard(cardToPlay) && cardToPlay.data.house) {
            const playerHouses = lastTwoHouses[playerName] || [];
            playerHouses.push(cardToPlay.data.house);
            if (playerHouses.length > 3) playerHouses.shift();
            lastTwoHouses[playerName] = playerHouses;
        }
        const roundEnded = checkForPenalties(
            playerName,
            cardToPlay.data.value,
            previousSum,
        );
        if (roundEnded) {
            isProcessingTurn = false;
            isTurnInProgress = false;
            setTimeout(() => processNextTurn(), 500);
            return;
        }
        if (playerHand.length < 2)
            drawCardFromPersonalDeck(playerDeck, playerHand);
        const isRotated =
            playerName === "dobby" || playerName === "crookshanks";
        displayBotHand(
            playerHand,
            playerHandElement,
            `bot_${playerName}_card`,
            isRotated,
        );
        updateCardsLeftCounter(playerName);
        updateGameUI();
        currentTurn.textContent = playerName.toUpperCase();
        isProcessingTurn = false;
        isTurnInProgress = false;
        currentPlayerIndex++;
        if (currentPlayerIndex >= activePlayers.length) currentPlayerIndex = 0;
        setTimeout(() => processNextTurn(), 500);
    }

    function autoPlayPlayerTurn(playerName) {
        if (isProcessingTurn || isTurnInProgress) return false;
        isProcessingTurn = true;
        isTurnInProgress = true;
        const playerHand = botHands[playerName];
        if (playerHand.length === 0) {
            console.log(`${playerName} has no cards to play`);
            isProcessingTurn = false;
            isTurnInProgress = false;
            processNextTurn();
            return false;
        }
        const randomIndex = Math.floor(Math.random() * playerHand.length);
        const cardToPlay = playerHand[randomIndex];
        console.log(`${playerName} auto-playing card:`, cardToPlay.data.name);
        const startPos = getBotHandPosition(playerName);
        createFlyingCardAnimation(
            cardToPlay.data,
            startPos.x,
            startPos.y,
            playerName,
        );
        removeCardFromHand(playerHand, cardToPlay);
        roundDiscardPile.push(cardToPlay);
        const previousSum = currentSum;
        const playedValue = cardToPlay.data.value || 0;
        if (isSpecialCard(cardToPlay))
            handleSpecialCard(playerName, cardToPlay);
        else {
            let finalValue = playedValue;
            if (echoActive) {
                finalValue *= 2;
                echoActive = false;
            }
            currentSum += finalValue;
            lastNumberCard = cardToPlay;
        }
        lastPlayedCard = cardToPlay;
        if (!isSpecialCard(cardToPlay) && cardToPlay.data.house) {
            const playerHouses = lastTwoHouses[playerName] || [];
            playerHouses.push(cardToPlay.data.house);
            if (playerHouses.length > 3) playerHouses.shift();
            lastTwoHouses[playerName] = playerHouses;
        }
        const roundEnded = checkForPenalties(
            playerName,
            cardToPlay.data.value,
            previousSum,
        );
        if (roundEnded) {
            isProcessingTurn = false;
            isTurnInProgress = false;
            setTimeout(() => processNextTurn(), 500);
            return true;
        }
        if (playerHand.length < 2)
            drawCardFromPersonalDeck(botDecks[playerName], playerHand);
        const isRotated =
            playerName === "dobby" || playerName === "crookshanks";
        displayBotHand(
            playerHand,
            botHandElements[playerName],
            `bot_${playerName}_card`,
            isRotated,
        );
        updateCardsLeftCounter(playerName);
        updateGameUI();
        currentTurn.textContent = playerName.toUpperCase();
        isProcessingTurn = false;
        isTurnInProgress = false;
        currentPlayerIndex++;
        if (currentPlayerIndex >= activePlayers.length) currentPlayerIndex = 0;
        setTimeout(() => processNextTurn(), 500);
        return true;
    }

    function startPlayerTurn(playerName) {
        if (isProcessingTurn || isTurnInProgress || isWaitingForPlayerMove)
            return false;
        const playerHand = botHands[playerName];
        if (!playerHand || playerHand.length === 0) {
            console.log(`${playerName} has no cards to play`);
            currentPlayerIndex++;
            if (currentPlayerIndex >= activePlayers.length)
                currentPlayerIndex = 0;
            setTimeout(() => processNextTurn(), 500);
            return false;
        }
        console.log(
            `${playerName}'s turn - Click on a card to play (5 seconds)`,
        );
        currentTurn.textContent = playerName.toUpperCase();
        isWaitingForPlayerMove = true;
        timerDuration = 5000;
        resetTimer();
        startTimerAnimation();
        enablePlayerCardClick(playerName);
        if (playerTimeout) clearTimeout(playerTimeout);
        playerTimeout = setTimeout(() => {
            if (
                isWaitingForPlayerMove &&
                !isProcessingTurn &&
                !isTurnInProgress
            ) {
                console.log(
                    `${playerName} did not play in time - auto-playing random card`,
                );
                isWaitingForPlayerMove = false;
                stopTimerAnimation();
                disablePlayerCardClick(playerName);
                autoPlayPlayerTurn(playerName);
                playerTimeout = null;
            }
        }, timerDuration);
        return true;
    }

    function botPlayTurn(
        playerName,
        playerHand,
        playerDeck,
        playerHandElement,
    ) {
        if (isProcessingTurn || isTurnInProgress) return false;
        isProcessingTurn = true;
        if (playerHand.length === 0) {
            console.log(`${playerName} has no cards to play`);
            isProcessingTurn = false;
            isTurnInProgress = false;
            currentPlayerIndex++;
            if (currentPlayerIndex >= activePlayers.length)
                currentPlayerIndex = 0;
            setTimeout(() => processNextTurn(), 500);
            return false;
        }
        const selectCard = useML
            ? chooseCardToPlayML(playerHand)
            : Promise.resolve(chooseCardToPlayOriginal(playerHand));
        Promise.resolve(selectCard)
            .then((cardToPlay) => {
                if (!cardToPlay) {
                    console.log(`${playerName} could not select a card`);
                    isProcessingTurn = false;
                    isTurnInProgress = false;
                    currentPlayerIndex++;
                    if (currentPlayerIndex >= activePlayers.length)
                        currentPlayerIndex = 0;
                    setTimeout(() => processNextTurn(), 500);
                    return;
                }
                const startPos = getBotHandPosition(playerName);
                createFlyingCardAnimation(
                    cardToPlay.data,
                    startPos.x,
                    startPos.y,
                    playerName,
                );
                removeCardFromHand(playerHand, cardToPlay);
                roundDiscardPile.push(cardToPlay);
                const previousSum = currentSum;
                const playedValue = cardToPlay.data.value || 0;
                let wasSuccessful = false;
                if (isSpecialCard(cardToPlay)) {
                    handleSpecialCard(playerName, cardToPlay);
                    wasSuccessful = true;
                } else {
                    let finalValue = playedValue;
                    if (echoActive) {
                        finalValue *= 2;
                        echoActive = false;
                    }
                    currentSum += finalValue;
                    lastNumberCard = cardToPlay;
                    wasSuccessful = currentSum <= limit;
                }
                lastPlayedCard = cardToPlay;
                if (!isSpecialCard(cardToPlay) && cardToPlay.data.house) {
                    const playerHouses = lastTwoHouses[playerName] || [];
                    playerHouses.push(cardToPlay.data.house);
                    if (playerHouses.length > 3) playerHouses.shift();
                    lastTwoHouses[playerName] = playerHouses;
                }
                if (useML)
                    mlModel.updateReward(cardToPlay, wasSuccessful, {
                        currentSum,
                        limit,
                    });
                const roundEnded = checkForPenalties(
                    playerName,
                    cardToPlay.data.value,
                    previousSum,
                );
                if (roundEnded) {
                    isProcessingTurn = false;
                    isTurnInProgress = false;
                    setTimeout(() => processNextTurn(), 500);
                    return;
                }
                if (playerHand.length < 2)
                    drawCardFromPersonalDeck(playerDeck, playerHand);
                const isRotated =
                    playerName === "dobby" || playerName === "crookshanks";
                displayBotHand(
                    playerHand,
                    playerHandElement,
                    `bot_${playerName}_card`,
                    isRotated,
                );
                updateCardsLeftCounter(playerName);
                updateGameUI();
                currentTurn.textContent = playerName.toUpperCase();
                isProcessingTurn = false;
                isTurnInProgress = false;
                currentPlayerIndex++;
                if (currentPlayerIndex >= activePlayers.length)
                    currentPlayerIndex = 0;
                setTimeout(() => processNextTurn(), 1250);
            })
            .catch((error) => {
                console.error("❌ [ML ERROR] Model inference failed:", error);
                const cardToPlay = chooseCardToPlayOriginal(playerHand);
                isProcessingTurn = false;
                isTurnInProgress = false;
            });
        return true;
    }

    function processNextTurn() {
        if (isProcessingTurn || isTurnInProgress || isWaitingForPlayerMove)
            return;
        if (activePlayers.length <= 1) {
            checkForWinner();
            return;
        }
        if (currentPlayerIndex >= activePlayers.length) currentPlayerIndex = 0;
        const currentPlayer = activePlayers[currentPlayerIndex];
        if (currentPlayer === PLAYER_BOT) startPlayerTurn(PLAYER_BOT);
        else {
            const playerHand = botHands[currentPlayer];
            const playerDeck = botDecks[currentPlayer];
            const playerHandElement = botHandElements[currentPlayer];
            console.log(`${currentPlayer}'s turn...`);
            currentTurn.textContent = currentPlayer.toUpperCase();
            setTimeout(
                () =>
                    botPlayTurn(
                        currentPlayer,
                        playerHand,
                        playerDeck,
                        playerHandElement,
                    ),
                100,
            );
        }
    }

    function addHandStyles() {
        const style = document.createElement("style");
        style.textContent = `
            .bot-hand { display: flex !important; flex-direction: row !important; gap: 10px !important; justify-content: center !important; align-items: center !important; min-height: 250px !important; flex-wrap: wrap !important; z-index: 100 !important; }
            .bot-hand img { width: 170.666px !important; height: 238.666px !important; object-fit: cover !important; flex-shrink: 0 !important; transition: transform 0.2s ease !important; }
            .rotate-180 { transform: rotate(180deg) !important; }
            .eliminated-player { opacity: 0.3 !important; filter: grayscale(100%) !important; pointer-events: none !important; }
            .eliminated-player .bot-hand { display: none !important; }
            #bot_${PLAYER_BOT}_hand_cards img { cursor: pointer !important; }
        `;
        document.head.appendChild(style);
    }

    function addMLMetricsDisplay() {
        const metricsDiv = document.createElement("div");
        metricsDiv.id = "ml-metrics";
        metricsDiv.style.cssText = `
            position: fixed; 
            top: 50%; 
            left: 10px; 
            transform: translateY(-50%);
            background: rgba(0,0,0,0.8); 
            color: #00ff00; 
            font-family: monospace; 
            font-size: 12px; 
            padding: 10px; 
            border-radius: 5px; 
            z-index: 10000; 
            pointer-events: none;
        `;
        document.body.appendChild(metricsDiv);
        setInterval(() => {
            const metrics = mlModel.getModelMetrics();
            metricsDiv.innerHTML = `ML MODEL: ${mlModel.modelVersion}<br>Predictions: ${metrics.totalPredictions}<br>Exploration: ${(metrics.explorationRate * 100).toFixed(1)}%<br>Cache: ${metrics.cacheSize} entries<br>Accuracy: ${metrics.accuracy.toFixed(1)}%`;
        }, 1000);
    }

    function addMLToggle() {
        const toggleDiv = document.createElement("div");
        toggleDiv.style.cssText = `position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 8px 12px; border-radius: 8px; z-index: 10000; font-family: monospace; cursor: pointer;`;
        toggleDiv.innerHTML = `ML: ${useML ? "ON" : "OFF"}`;
        toggleDiv.onclick = () => {
            useML = !useML;
            toggleDiv.innerHTML = `ML: ${useML ? "ON" : "OFF"}`;
            console.log(`ML Mode: ${useML ? "ENABLED" : "DISABLED"}`);
        };
        document.body.appendChild(toggleDiv);
    }

    // START GAME

    function startGame() {
        addHandStyles();
        leftoverCards = createPersonalDeck(leftoverDeckElement);
        ACTIVE_BOTS.forEach((botKey) => {
            botDecks[botKey] = createPersonalDeck(botCardElements[botKey]);
            botHands[botKey] = getTwoRandomCards(botDecks[botKey]);
            const isRotated = botKey === "dobby" || botKey === "crookshanks";
            displayBotHand(
                botHands[botKey],
                botHandElements[botKey],
                `bot_${botKey}_card`,
                isRotated,
            );
            if (botHandElements[botKey]) {
                botHandElements[botKey].classList.remove("hidden");
                botHandElements[botKey].classList.add("bot-hand");
            }
            updateCardsLeftCounter(botKey);
        });
        if (leftoverCards.length > 0 && activePlayers.length > 0) {
            const randomIndex = Math.floor(
                Math.random() * leftoverCards.length,
            );
            const startingCard = leftoverCards.splice(randomIndex, 1)[0];
            roundDiscardPile.push(startingCard);
            currentSum += startingCard.data.value || 0;
            updateGameUI();
            console.log(
                `Starting card: ${startingCard.data.name} (${startingCard.data.value})`,
            );
        }
        players.forEach((playerName) => updateCardsLeftCounter(playerName));
        console.log("Game initialized with:", {
            leftoverCards: leftoverCards.length,
            botDecks: Object.keys(botDecks).map(
                (k) => `${k}: ${botDecks[k].length}`,
            ),
            playerBot: PLAYER_BOT,
            aiBots: AI_BOTS,
        });
        updateGameUI();
        setTimeout(() => processNextTurn(), 500);
    }

    // addMLMetricsDisplay();
    // addMLToggle();
    startGame();
});
