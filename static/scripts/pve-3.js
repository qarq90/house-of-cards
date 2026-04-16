document.addEventListener("DOMContentLoaded", () => {
    const configDiv = document.getElementById("game-config");
    const TARGET_LIMIT = parseInt(configDiv?.dataset.targetLimit || "27");
    const SIMULATION_SPEED = parseInt(
        configDiv?.dataset.simulationSpeed || "100",
    );

    const ACTIVE_BOTS = ["player", "hedwig", "dobby", "crookshanks"];
    const PLAYER_BOT = "player";
    const AI_BOTS = ["hedwig", "dobby", "crookshanks"];

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

        console.log(`Initialized bot: ${botKey}`, {
            handElement: botHandElements[botKey],
            cardsCount: botCardElements[botKey]?.length,
            cardsLeftElement: botCardsLeftElements[botKey],
            botElement: botElements_map[botKey],
        });
    });

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

    let isPaused = false;
    let pauseButton = null;
    let pauseIcon = null;
    let pauseText = null;

    let isWaitingForPlayerMove = false;
    let playerTimeout = null;
    let playerCardsClickHandlers = [];
    let isProcessingTurn = false;
    let isTurnInProgress = false;

    let timerDisplay = null;

    function createTimerDisplay() {
        timerDisplay = document.createElement("div");
        timerDisplay.id = "player-timer";
        timerDisplay.className =
            "fixed top-24 right-8 bg-black bg-opacity-75 text-white px-6 py-3 rounded-xl text-3xl font-bold harry-potter z-50";
        timerDisplay.textContent = "5s";
        document.body.appendChild(timerDisplay);
    }

    function updateTimerDisplay(seconds) {
        if (timerDisplay) {
            timerDisplay.textContent = `${seconds}s`;
            if (seconds <= 2) {
                timerDisplay.style.color = "#ff4444";
            } else {
                timerDisplay.style.color = "white";
            }
        }
    }

    function hideTimerDisplay() {
        if (timerDisplay) {
            timerDisplay.style.display = "none";
        }
    }

    function showTimerDisplay() {
        if (timerDisplay) {
            timerDisplay.style.display = "block";
        }
    }

    function setupPauseButton() {
        pauseButton = document.querySelector("button.absolute.left-28");
        if (!pauseButton) return;

        pauseIcon = pauseButton.querySelector("img");
        pauseText = pauseButton.querySelector("h1");

        pauseButton.addEventListener("click", togglePause);

        const pauseIndicator = document.createElement("div");
        pauseIndicator.id = "pause-indicator";
        pauseIndicator.className =
            "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-75 text-white px-12 py-6 rounded-2xl text-6xl harry-potter tracking-widest z-[9999999] hidden";
        pauseIndicator.textContent = "PAUSED";
        document.body.appendChild(pauseIndicator);
    }

    function togglePause() {
        isPaused = !isPaused;

        if (isPaused) {
            if (pauseIcon)
                pauseIcon.src = "../../../../static/icons/z_play.png";
            if (pauseText) pauseText.textContent = "Play";

            const pauseIndicator = document.getElementById("pause-indicator");
            if (pauseIndicator) pauseIndicator.classList.remove("hidden");

            console.log("Game paused");
        } else {
            if (pauseIcon)
                pauseIcon.src = "../../../../static/icons/z_pause.png";
            if (pauseText) pauseText.textContent = "Pause";

            const pauseIndicator = document.getElementById("pause-indicator");
            if (pauseIndicator) pauseIndicator.classList.add("hidden");

            console.log("Game resumed");

            if (
                !isWaitingForPlayerMove &&
                !isProcessingTurn &&
                activePlayers.length > 1
            ) {
                processNextTurn();
            }
        }
    }

    function clearPlayerClickHandlers() {
        playerCardsClickHandlers.forEach(({ element, handler }) => {
            element.removeEventListener("click", handler);
        });
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

                console.log(
                    `${playerName} clicked card:`,
                    cardToPlay.data.name,
                );

                if (playerTimeout) {
                    clearTimeout(playerTimeout);
                    playerTimeout = null;
                }

                isWaitingForPlayerMove = false;
                hideTimerDisplay();
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
                ) {
                    cardElement.style.transform = "scale(1.05)";
                }
            });
            cardElement.addEventListener("mouseleave", () => {
                cardElement.style.transform = "scale(1)";
            });
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

        if (isSpecialCard(cardToPlay)) {
            handleSpecialCard(playerName, cardToPlay);
        } else {
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
            if (playerHouses.length > 3) {
                playerHouses.shift();
            }
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
            setTimeout(() => {
                processNextTurn();
            }, 500);
            return;
        }

        if (playerHand.length < 2) {
            drawCardFromPersonalDeck(playerDeck, playerHand);
        }

        const isRotated =
            playerName === "hedwig" || playerName === "crookshanks";
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
        if (currentPlayerIndex >= activePlayers.length) {
            currentPlayerIndex = 0;
        }

        setTimeout(() => {
            processNextTurn();
        }, 500);
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

        if (isSpecialCard(cardToPlay)) {
            handleSpecialCard(playerName, cardToPlay);
        } else {
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
            if (playerHouses.length > 3) {
                playerHouses.shift();
            }
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
            setTimeout(() => {
                processNextTurn();
            }, 500);
            return true;
        }

        if (playerHand.length < 2) {
            drawCardFromPersonalDeck(botDecks[playerName], playerHand);
        }

        const isRotated =
            playerName === "hedwig" || playerName === "crookshanks";
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
        if (currentPlayerIndex >= activePlayers.length) {
            currentPlayerIndex = 0;
        }

        setTimeout(() => {
            processNextTurn();
        }, 500);

        return true;
    }

    function startPlayerTurn(playerName) {
        if (
            isPaused ||
            isProcessingTurn ||
            isTurnInProgress ||
            isWaitingForPlayerMove
        )
            return false;

        const playerHand = botHands[playerName];
        if (!playerHand || playerHand.length === 0) {
            console.log(`${playerName} has no cards to play`);
            currentPlayerIndex++;
            if (currentPlayerIndex >= activePlayers.length) {
                currentPlayerIndex = 0;
            }
            setTimeout(() => {
                processNextTurn();
            }, 500);
            return false;
        }

        console.log(
            `${playerName}'s turn - Click on a card to play (5 seconds)`,
        );
        currentTurn.textContent = playerName.toUpperCase();

        isWaitingForPlayerMove = true;
        showTimerDisplay();
        enablePlayerCardClick(playerName);

        let timeLeft = 5;
        updateTimerDisplay(timeLeft);

        const timerInterval = setInterval(() => {
            if (!isWaitingForPlayerMove) {
                clearInterval(timerInterval);
                return;
            }
            timeLeft--;
            updateTimerDisplay(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
            }
        }, 1000);

        if (playerTimeout) {
            clearTimeout(playerTimeout);
        }

        playerTimeout = setTimeout(() => {
            if (
                isWaitingForPlayerMove &&
                !isProcessingTurn &&
                !isTurnInProgress
            ) {
                console.log(
                    `${playerName} did not play in time - auto-playing random card`,
                );
                clearInterval(timerInterval);
                isWaitingForPlayerMove = false;
                hideTimerDisplay();
                disablePlayerCardClick(playerName);
                autoPlayPlayerTurn(playerName);
                playerTimeout = null;
            }
        }, 5000);

        return true;
    }

    function processNextTurn() {
        if (
            isPaused ||
            isProcessingTurn ||
            isTurnInProgress ||
            isWaitingForPlayerMove
        ) {
            return;
        }

        if (activePlayers.length <= 1) {
            checkForWinner();
            return;
        }

        if (currentPlayerIndex >= activePlayers.length) {
            currentPlayerIndex = 0;
        }

        const currentPlayer = activePlayers[currentPlayerIndex];

        if (currentPlayer === PLAYER_BOT) {
            startPlayerTurn(PLAYER_BOT);
        } else {
            const playerHand = botHands[currentPlayer];
            const playerDeck = botDecks[currentPlayer];
            const playerHandElement = botHandElements[currentPlayer];

            console.log(`${currentPlayer}'s turn...`);
            currentTurn.textContent = currentPlayer.toUpperCase();

            setTimeout(() => {
                botPlayTurn(
                    currentPlayer,
                    playerHand,
                    playerDeck,
                    playerHandElement,
                );
            }, 100);
        }
    }

    function hideAllEffects() {
        if (echoEffect) echoEffect.classList.add("hidden");
        if (hallowsEffect) hallowsEffect.classList.add("hidden");
        if (mirrorEffect) mirrorEffect.classList.add("hidden");
        if (shieldEffect) shieldEffect.classList.add("hidden");
        if (swapEffect) swapEffect.classList.add("hidden");
    }

    function showEffect(effectElement) {
        hideAllEffects();
        if (effectElement) {
            effectElement.classList.remove("hidden");
            setTimeout(() => {
                effectElement.classList.add("hidden");
            }, LOOP_INTERVAL);
        }
    }

    function addHandStyles() {
        const style = document.createElement("style");
        style.textContent = `
            .bot-hand {
                display: flex !important;
                flex-direction: row !important;
                gap: 10px !important;
                justify-content: center !important;
                align-items: center !important;
                min-height: 250px !important;
                flex-wrap: wrap !important;
                z-index: 100 !important;
            }
            .bot-hand img {
                width: 170.666px !important;
                height: 238.666px !important;
                object-fit: cover !important;
                flex-shrink: 0 !important;
                transition: transform 0.2s ease !important;
            }
            .rotate-180 {
                transform: rotate(180deg) !important;
            }
            .eliminated-player {
                opacity: 0.3 !important;
                filter: grayscale(100%) !important;
                pointer-events: none !important;
            }
            .eliminated-player .bot-hand {
                display: none !important;
            }
            #bot_player_hand_cards img {
                cursor: pointer !important;
            }
        `;
        document.head.appendChild(style);
    }

    function displayRankings() {
        const rankings = [];

        for (let i = eliminatedPlayers.length - 1; i >= 0; i--) {
            rankings.push(eliminatedPlayers[i]);
        }
        rankings.reverse();

        if (activePlayers.length === 1) {
            rankings.push(activePlayers[0]);
        }

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

        const rankEmojis = ["1st", "2nd", "3rd", "4th"];

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

            let displayName = player;
            if (player === "player") displayName = "YOU";

            if (rankNumber <= 4) {
                rankItem.innerHTML = `
                    <span class="text-6xl tracking-widest">${rankEmojis[rankNumber - 1]} -=></span>
                    <span class="tracking-widest">${displayName.toUpperCase()}</span>
                `;
            } else {
                rankItem.innerHTML = `
                    <span class="text-6xl tracking-widest">${rankNumber}th -=></span>
                    <span class="tracking-widest">${displayName.toUpperCase()}</span>
                `;
            }

            rankingsContainer.appendChild(rankItem);
        });

        document.body.appendChild(rankingsContainer);
    }

    function eliminatePlayer(playerName) {
        if (!activePlayers.includes(playerName)) return;

        if (isWaitingForPlayerMove && playerName === PLAYER_BOT) {
            isWaitingForPlayerMove = false;
            hideTimerDisplay();
            if (playerTimeout) {
                clearTimeout(playerTimeout);
                playerTimeout = null;
            }
            disablePlayerCardClick(playerName);
        }

        activePlayers = activePlayers.filter((p) => p !== playerName);
        eliminatedPlayers.push(playerName);

        if (
            currentPlayerIndex >= activePlayers.length &&
            activePlayers.length > 0
        ) {
            currentPlayerIndex = 0;
        }

        const playerElement = botElements_map[playerName];
        if (playerElement) {
            playerElement.classList.add("eliminated-player");
        }

        console.log(`${playerName} has been eliminated!`);
        checkForWinner();

        if (
            activePlayers.length > 1 &&
            !isWaitingForPlayerMove &&
            !isProcessingTurn
        ) {
            setTimeout(() => {
                processNextTurn();
            }, 1000);
        }
    }

    function checkForWinner() {
        if (activePlayers.length === 1) {
            const winner = activePlayers[0];
            console.log(`${winner} has won the game!`);
            if (gameInterval) {
                clearInterval(gameInterval);
            }
            hideTimerDisplay();
            displayRankings();
            return true;
        }
        return false;
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
            setTimeout(() => {
                el.style.backgroundColor = "";
            }, 500);
        });
    }

    function markCardAsUsed(card) {
        if (card) {
            card.used = true;
        }
    }

    function getPlayerHandSize(playerName) {
        return botHands[playerName]?.length || 0;
    }

    function getPlayerDeckSize(playerName) {
        return botDecks[playerName]?.filter((c) => !c.used).length || 0;
    }

    function getBotHandPosition(playerName) {
        const handElement = botHandElements[playerName];
        const botElement = botElements_map[playerName];

        if (!handElement || !botElement) return { x: 0, y: 0 };

        const handRect = handElement.getBoundingClientRect();
        const botRect = botElement.getBoundingClientRect();

        const x = handRect.left + handRect.width / 2 - 85.333;
        let y;
        if (playerName === "player") {
            y = botRect.top - 50;
        } else if (playerName === "dobby") {
            y = botRect.top - 50;
        } else {
            y = botRect.bottom - 50;
        }

        return { x, y };
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
        if (currentValueElement) {
            currentValueElement.textContent = currentSum;
        }
        if (targetValueElement) {
            targetValueElement.textContent = limit;
        }
        if (currentRoundElement) {
            currentRoundElement.textContent = currentRound;
        }
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

    function checkIfOpponentsHaveManyCards(currentPlayer) {
        const otherPlayers = activePlayers.filter((p) => p !== currentPlayer);
        let totalCards = 0;

        otherPlayers.forEach((player) => {
            totalCards += getPlayerHandSize(player) + getPlayerDeckSize(player);
        });

        return totalCards > 15;
    }

    function removeCardFromHand(hand, card) {
        const index = hand.findIndex((c) => c.data.id === card.data.id);
        if (index !== -1) {
            return hand.splice(index, 1)[0];
        }
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

        setTimeout(() => {
            flyingCard.remove();
        }, 1000);
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
    }

    function handleSpecialCard(playerName, card) {
        const name = card.data.name;

        switch (name) {
            case "hallows":
                showEffect(hallowsEffect);
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
                showEffect(shieldEffect);
                mirrorBlocked = true;
                echoActive = false;
                break;

            case "echo":
                showEffect(echoEffect);
                echoActive = true;
                break;

            case "mirror":
                showEffect(mirrorEffect);
                if (!mirrorBlocked && lastNumberCard) {
                    currentSum += lastNumberCard.data.value;
                }
                mirrorBlocked = false;
                break;

            case "swap":
                showEffect(swapEffect);
                swapTopCardWithHand(playerName);
                break;
        }

        updateGameUI();
        return false;
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

    function drawCardsUpToLimit(playerName) {
        const deck = botDecks[playerName];
        const hand = botHands[playerName];
        const handElement = botHandElements[playerName];
        const isRotated =
            playerName === "hedwig" || playerName === "crookshanks";

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

    function isSpecialCard(card) {
        const specials = ["hallows", "shield", "echo", "mirror", "swap"];
        return specials.includes(card.data.name);
    }

    function chooseCardToPlay(hand) {
        if (hand.length === 0) return null;
        if (hand.length === 1) return hand[0];

        let a = hand[0];
        let b = hand[1];

        if (
            a.data.value + currentSum > limit &&
            b.data.type === "special" &&
            b.data.name === "hallows"
        ) {
            return b;
        }
        if (
            b.data.value + currentSum > limit &&
            a.data.type === "special" &&
            a.data.name === "hallows"
        ) {
            return a;
        }

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
            if (aSafe && bSafe) {
                return aEffective >= bEffective ? a : b;
            }
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
            if (currentPlayerIndex >= activePlayers.length) {
                currentPlayerIndex = 0;
            }
            setTimeout(() => {
                processNextTurn();
            }, 500);
            return false;
        }

        const cardToPlay = chooseCardToPlay(playerHand);
        if (!cardToPlay) {
            console.log(`${playerName} could not select a card`);
            isProcessingTurn = false;
            isTurnInProgress = false;
            currentPlayerIndex++;
            if (currentPlayerIndex >= activePlayers.length) {
                currentPlayerIndex = 0;
            }
            setTimeout(() => {
                processNextTurn();
            }, 500);
            return false;
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

        if (isSpecialCard(cardToPlay)) {
            handleSpecialCard(playerName, cardToPlay);
        } else {
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
            if (playerHouses.length > 3) {
                playerHouses.shift();
            }
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
            setTimeout(() => {
                processNextTurn();
            }, 500);
            return true;
        }

        if (playerHand.length < 2) {
            drawCardFromPersonalDeck(playerDeck, playerHand);
        }

        const isRotated =
            playerName === "hedwig" || playerName === "crookshanks";
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
        if (currentPlayerIndex >= activePlayers.length) {
            currentPlayerIndex = 0;
        }

        setTimeout(() => {
            processNextTurn();
        }, 1250);

        return true;
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

    function reshufflePlayerDeck(playerName) {
        const deck = botDecks[playerName];
        const hand = botHands[playerName];

        hand.forEach((card) => {
            card.used = false;
            deck.push(card);
        });
        hand.length = 0;

        deck.forEach((card) => {
            card.used = false;
        });

        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function startGame() {
        addHandStyles();
        setupPauseButton();
        createTimerDisplay();
        hideTimerDisplay();

        leftoverCards = createPersonalDeck(leftoverDeckElement);

        ACTIVE_BOTS.forEach((botKey) => {
            botDecks[botKey] = createPersonalDeck(botCardElements[botKey]);
            botHands[botKey] = getTwoRandomCards(botDecks[botKey]);

            const isRotated = botKey === "hedwig" || botKey === "crookshanks";
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

        players.forEach((playerName) => {
            updateCardsLeftCounter(playerName);
        });

        console.log("Game initialized with:", {
            leftoverCards: leftoverCards.length,
            botDecks: Object.keys(botDecks).map(
                (k) => `${k}: ${botDecks[k].length}`,
            ),
            playerBot: PLAYER_BOT,
            aiBots: AI_BOTS,
        });

        updateGameUI();

        setTimeout(() => {
            processNextTurn();
        }, 500);
    }

    startGame();
});

function generateRandomString() {
    const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 32; i++) {
        result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
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
                type: img && img.dataset.type ? img.dataset.type : "numerical",
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

function displayBotHand(hand, containerElement, prefix, rotate) {
    if (!containerElement) return;

    containerElement.innerHTML = "";
    if (!containerElement.classList.contains("bot-hand")) {
        containerElement.classList.add("bot-hand");
    }

    const displayHand = hand.slice(0, 2);
    displayHand.forEach((card) => {
        if (!card || !card.data) return;

        const cardElement = document.createElement("img");
        cardElement.src = card.data.src;
        cardElement.id = `${prefix}_${card.data.id}`;
        cardElement.alt = `${card.data.house} ${card.data.name}`;
        cardElement.classList.add("w-[170.666px]", "h-[238.666px]");

        if (rotate) {
            cardElement.classList.add("rotate-180");
        }

        containerElement.appendChild(cardElement);
    });
}
