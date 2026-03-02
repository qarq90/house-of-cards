document.addEventListener("DOMContentLoaded", () => {
    const timerIndicator = document.getElementById("-indicator");
    const timerIndicatorBG = document.getElementById("timer-indicator-bg");
    const totalTime = 5000;

    const currentValueElement = document.getElementById("current_value");
    const targetValueElement = document.getElementById("targetValue");
    const currentRoundElement = document.getElementById("current_round");

    const leftoverDeckElement = document.querySelectorAll(".leftover_deck");

    const botDobbyCardsElements = document.querySelectorAll(".bot_dobby_cards");
    const botCrookshanksCardsElements = document.querySelectorAll(
        ".bot_crookshanks_cards",
    );
    const botHedwigCardsElements =
        document.querySelectorAll(".bot_hedwig_cards");
    const botTrevorCardsElements =
        document.querySelectorAll(".bot_trevor_cards");

    const botDobbyHandElement = document.getElementById("bot_dobby_hand_cards");
    const botCrookshanksHandElement = document.getElementById(
        "bot_crookshanks_hand_cards",
    );
    const botHedwigHandElement = document.getElementById(
        "bot_hedwig_hand_cards",
    );
    const botTrevorHandElement = document.getElementById(
        "bot_trevor_hand_cards",
    );

    const botDobbyElement = document.getElementById("bot_dobby");
    const botCrookshanksElement = document.getElementById("bot_crookshanks");
    const botHedwigElement = document.getElementById("bot_hedwig");
    const botTrevorElement = document.getElementById("bot_trevor");

    const botDobbyCardsLeftElement = document.getElementById(
        "bot_dobby_cards_left",
    );
    const botCrookshanksCardsLeftElement = document.getElementById(
        "bot_crookshanks_cards_left",
    );
    const botHedwigCardsLeftElement = document.getElementById(
        "bot_hedwig_cards_left",
    );
    const botTrevorCardsLeftElement = document.getElementById(
        "bot_trevor_cards_left",
    );

    const gameContainer = document.querySelector(".game-container");

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
            }
            .bot-hand img {
                width: 170.666px !important;
                height: 238.666px !important;
                object-fit: cover !important;
                flex-shrink: 0 !important;
            }
            .rotate-180 {
                transform: rotate(180deg) !important;
            }
        `;
        document.head.appendChild(style);
    }

    let timeSpace = 0;
    let timerInterval = null;
    let gameInterval = null;

    let leftoverCards = [];
    let botDobbyCards = [],
        botCrookshanksCards = [],
        botHedwigCards = [],
        botTrevorCards = [];

    let botDobbyHand = [],
        botCrookshanksHand = [],
        botHedwigHand = [],
        botTrevorHand = [];

    let currentSum = 0;
    let limit = 27;
    let currentRound = 1;
    let currentPlayerIndex = 0;
    let players = ["dobby", "crookshanks", "hedwig", "trevor"];

    let roundDiscardPile = [];

    let lastNumberCard = null;
    let echoActive = false;
    let mirrorBlocked = false;
    let lastPlayedCard = null;

    function markCardAsUsed(card) {
        if (card) {
            card.used = true;
        }
    }

    function startTimer() {
        const maxWidth = timerIndicatorBG.offsetWidth;
        const increment = 50;

        timerInterval = setInterval(() => {
            timeSpace += increment;
            const percentage = Math.min(timeSpace / totalTime, 1);
            timerIndicator.style.width = percentage * maxWidth + "px";
        }, increment);
    }

    function resetTimer() {
        timeSpace = 0;
        timerIndicator.style.width = "0px";

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function generateRandomString() {
        const charset =
            "#r&/q{g%,*$O}()@*HS^\\=sRP!ftXTQGu0?|]e\"<MD>CZ.NELb/v;JaIUc[K':2hAon-zi9j1VdmW+5Fplxw3B48k6Yy7";
        const cleanCharset = charset.replace(/\\/g, "");
        let result = "";
        const charsetLength = cleanCharset.length;

        for (let i = 0; i < 32; i++) {
            result += cleanCharset[Math.floor(Math.random() * charsetLength)];
        }

        return result;
    }

    function getTwoRandomCards(cardsArray) {
        if (cardsArray.length === 0) return [];

        const availableCards = cardsArray.filter((card) => !card.used);

        if (availableCards.length === 0) return [];

        if (availableCards.length <= 2) {
            availableCards.forEach((card) => markCardAsUsed(card));
            return availableCards.slice();
        }

        const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 2);

        selected.forEach((card) => markCardAsUsed(card));
        return selected;
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
                },
            };
        });
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

    function updateCardsLeftCounter(playerName) {
        let cardsLeftElement;
        let deck;
        let hand;

        switch (playerName) {
            case "dobby":
                cardsLeftElement = botDobbyCardsLeftElement;
                deck = botDobbyCards;
                hand = botDobbyHand;
                break;
            case "crookshanks":
                cardsLeftElement = botCrookshanksCardsLeftElement;
                deck = botCrookshanksCards;
                hand = botCrookshanksHand;
                break;
            case "hedwig":
                cardsLeftElement = botHedwigCardsLeftElement;
                deck = botHedwigCards;
                hand = botHedwigHand;
                break;
            case "trevor":
                cardsLeftElement = botTrevorCardsLeftElement;
                deck = botTrevorCards;
                hand = botTrevorHand;
                break;
        }

        if (!cardsLeftElement) return;

        const unusedDeckCards = deck.filter((card) => !card.used).length;
        const totalCardsLeft = unusedDeckCards + hand.length;

        const textContent = cardsLeftElement.textContent;
        const spanMatch = textContent.match(/<span.*?<\/span>/);
        const spanText = spanMatch
            ? spanMatch[0]
            : '<span class="lucida-bright text-3xl">left</span>';

        cardsLeftElement.innerHTML = `${totalCardsLeft} ${spanText}`;

        console.log(
            `${playerName} has ${totalCardsLeft} cards left (${unusedDeckCards} in deck + ${hand.length} in hand)`,
        );
    }

    function getRandomCardFromHand(hand) {
        if (hand.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * hand.length);
        return hand[randomIndex];
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
        leftoverCards = [...leftoverCards, ...roundDiscardPile];
        roundDiscardPile = [];

        currentSum = 0;

        if (leftoverCards.length > 0) {
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

    function checkRoundEnd() {
        if (currentSum === limit) {
            console.log("Exactly hit the limit! Starting new round...");
            startNewRound();
            return true;
        } else if (currentSum > limit) {
            console.log("Exceeded the limit! Starting new round...");
            startNewRound();
            return true;
        }
        return false;
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
        flyingCard.style.opacity = "0.9";

        setTimeout(() => {
            flyingCard.remove();
        }, 1000);

        console.log(`${playerName}'s card flying to center...`);
    }

    function getBotHandPosition(playerName) {
        let handElement;
        let botElement;

        switch (playerName) {
            case "dobby":
                handElement = botDobbyHandElement;
                botElement = botDobbyElement;
                break;
            case "crookshanks":
                handElement = botCrookshanksHandElement;
                botElement = botCrookshanksElement;
                break;
            case "hedwig":
                handElement = botHedwigHandElement;
                botElement = botHedwigElement;
                break;
            case "trevor":
                handElement = botTrevorHandElement;
                botElement = botTrevorElement;
                break;
        }

        if (!handElement || !botElement) return { x: 0, y: 0 };

        const handRect = handElement.getBoundingClientRect();
        const botRect = botElement.getBoundingClientRect();

        const x = handRect.left + handRect.width / 2 - 85.333;
        const y = botRect.bottom - 50;

        return { x, y };
    }

    function handleSpecialCard(playerName, card) {
        const name = card.data.name;

        switch (name) {
            case "Hallows":
                currentSum = limit;

                players
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

                                switch (otherPlayerName) {
                                    case "dobby":
                                        botDobbyCards.push(drawnCard);
                                        break;
                                    case "crookshanks":
                                        botCrookshanksCards.push(drawnCard);
                                        break;
                                    case "hedwig":
                                        botHedwigCards.push(drawnCard);
                                        break;
                                    case "trevor":
                                        botTrevorCards.push(drawnCard);
                                        break;
                                }
                            }
                        }
                    });

                reshufflePlayerDeck(playerName);
                drawCardsUpToLimit(playerName);
                startNewRound();
                break;

            case "Shield":
                mirrorBlocked = true;
                echoActive = false;
                break;

            case "Echo":
                echoActive = true;
                break;

            case "Mirror":
                if (!mirrorBlocked && lastNumberCard) {
                    currentSum += lastNumberCard.data.value;
                }
                mirrorBlocked = false;
                break;

            case "Swap":
                swapTopCardWithHand(playerName);
                break;
        }

        updateGameUI();
    }

    function swapTopCardWithHand(playerName) {
        let deck, hand;

        switch (playerName) {
            case "dobby":
                deck = botDobbyCards;
                hand = botDobbyHand;
                break;
            case "crookshanks":
                deck = botCrookshanksCards;
                hand = botCrookshanksHand;
                break;
            case "hedwig":
                deck = botHedwigCards;
                hand = botHedwigHand;
                break;
            case "trevor":
                deck = botTrevorCards;
                hand = botTrevorHand;
                break;
        }

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

    function botPlayTurn(
        playerName,
        playerHand,
        playerDeck,
        playerHandElement,
    ) {
        if (playerHand.length === 0) {
            console.log(`${playerName} has no cards to play`);
            return false;
        }

        const cardToPlay = getRandomCardFromHand(playerHand);
        if (!cardToPlay) {
            console.log(`${playerName} could not select a card`);
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

            if (
                cardToPlay.data.name !== "Mirror" &&
                lastPlayedCard &&
                lastPlayedCard.data.name === "Mirror" &&
                !mirrorBlocked
            ) {
                finalValue += lastNumberCard ? lastNumberCard.data.value : 0;
            }

            currentSum += finalValue;
            lastNumberCard = cardToPlay;
        }

        lastPlayedCard = cardToPlay;

        const roundEnded = checkForPenalties(
            playerName,
            cardToPlay.data.value,
            previousSum,
        );
        if (roundEnded) return true;

        if (playerHand.length < 2) {
            drawCardFromPersonalDeck(playerDeck, playerHand);
        }

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

        const cardName = cardToPlay.data.name;
        const cardValue = cardToPlay.data.value || 0;
        const newSum = currentSum;

        console.log(`Turn ${playerName}`);
        console.log(`Card Played ${cardName}`);
        console.log(`Current Value ${cardValue}`);
        console.log(`Current Sum ${previousSum}`);
        console.log(`Value after adding ${newSum}`);

        if (newSum > limit) {
            console.log(
                `${playerName} played ${cardName} and got penalty of ${cardValue} cards`,
            );
        } else if (newSum === limit) {
            const otherPlayers = players
                .filter((p) => p !== playerName)
                .join(",");
            console.log(
                `${playerName} played ${cardName} and ${otherPlayers} got 2 cards`,
            );
        } else {
            console.log(`${playerName} played ${cardName}`);
        }

        console.log("--------------------------------------------------");

        return true;
    }

    function checkForPenalties(playerName, playedValue, previousSum) {
        if (currentSum === limit) {
            console.log(`${playerName} exactly hit the limit!`);

            leftoverCards = [...leftoverCards, ...roundDiscardPile];
            roundDiscardPile = [];

            players
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

                        switch (otherPlayerName) {
                            case "dobby":
                                botDobbyCards.push(drawnCard);
                                break;
                            case "crookshanks":
                                botCrookshanksCards.push(drawnCard);
                                break;
                            case "hedwig":
                                botHedwigCards.push(drawnCard);
                                break;
                            case "trevor":
                                botTrevorCards.push(drawnCard);
                                break;
                        }
                    }
                });

            drawCardsUpToLimit(playerName);
            startNewRound();

            return true;
        }

        if (currentSum > limit) {
            console.log(`${playerName} exceeded the limit!`);

            const penaltyCards = playedValue;

            leftoverCards = [...leftoverCards, ...roundDiscardPile];
            roundDiscardPile = [];

            let playerDeck;

            switch (playerName) {
                case "dobby":
                    playerDeck = botDobbyCards;
                    break;
                case "crookshanks":
                    playerDeck = botCrookshanksCards;
                    break;
                case "hedwig":
                    playerDeck = botHedwigCards;
                    break;
                case "trevor":
                    playerDeck = botTrevorCards;
                    break;
            }

            for (let i = 0; i < penaltyCards; i++) {
                if (leftoverCards.length === 0) break;

                const randomIndex = Math.floor(
                    Math.random() * leftoverCards.length,
                );
                const drawnCard = leftoverCards.splice(randomIndex, 1)[0];
                drawnCard.used = false;

                playerDeck.push(drawnCard);
            }

            if (Math.random() > 0.5) {
                reshufflePlayerDeck(playerName);
            }

            drawCardsUpToLimit(playerName);
            startNewRound();

            return true;
        }

        return false;
    }

    function drawCardsUpToLimit(playerName) {
        let playerDeck, playerHand, playerHandElement;
        let isRotated = false;

        switch (playerName) {
            case "dobby":
                playerDeck = botDobbyCards;
                playerHand = botDobbyHand;
                playerHandElement = botDobbyHandElement;
                isRotated = true;
                break;
            case "crookshanks":
                playerDeck = botCrookshanksCards;
                playerHand = botCrookshanksHand;
                playerHandElement = botCrookshanksHandElement;
                isRotated = true;
                break;
            case "hedwig":
                playerDeck = botHedwigCards;
                playerHand = botHedwigHand;
                playerHandElement = botHedwigHandElement;
                isRotated = false;
                break;
            case "trevor":
                playerDeck = botTrevorCards;
                playerHand = botTrevorHand;
                playerHandElement = botTrevorHandElement;
                isRotated = false;
                break;
        }

        const cardsNeeded = Math.max(0, 2 - playerHand.length);

        for (let i = 0; i < cardsNeeded; i++) {
            const availableCard = playerDeck.find((card) => !card.used);
            if (availableCard) {
                markCardAsUsed(availableCard);
                playerHand.push(availableCard);
            }
        }

        displayBotHand(
            playerHand,
            playerHandElement,
            `bot_${playerName}_card`,
            isRotated,
        );

        updateCardsLeftCounter(playerName);
    }

    function drawTwoCardsFromOwnDeck(playerName) {
        drawCardsUpToLimit(playerName);
    }

    function playNextBotTurn() {
        if (currentPlayerIndex >= players.length) {
            currentPlayerIndex = 0;
        }

        const playerName = players[currentPlayerIndex];
        let playerHand, playerDeck, playerHandElement;

        switch (playerName) {
            case "dobby":
                playerHand = botDobbyHand;
                playerDeck = botDobbyCards;
                playerHandElement = botDobbyHandElement;
                break;
            case "crookshanks":
                playerHand = botCrookshanksHand;
                playerDeck = botCrookshanksCards;
                playerHandElement = botCrookshanksHandElement;
                break;
            case "hedwig":
                playerHand = botHedwigHand;
                playerDeck = botHedwigCards;
                playerHandElement = botHedwigHandElement;
                break;
            case "trevor":
                playerHand = botTrevorHand;
                playerDeck = botTrevorCards;
                playerHandElement = botTrevorHandElement;
                break;
        }

        console.log(`${playerName}'s turn...`);
        botPlayTurn(playerName, playerHand, playerDeck, playerHandElement);

        currentPlayerIndex++;
    }

    function reshufflePlayerDeck(playerName) {
        let playerDeck;
        let playerHand;

        switch (playerName) {
            case "dobby":
                playerDeck = botDobbyCards;
                playerHand = botDobbyHand;
                break;
            case "crookshanks":
                playerDeck = botCrookshanksCards;
                playerHand = botCrookshanksHand;
                break;
            case "hedwig":
                playerDeck = botHedwigCards;
                playerHand = botHedwigHand;
                break;
            case "trevor":
                playerDeck = botTrevorCards;
                playerHand = botTrevorHand;
                break;
        }

        playerHand.forEach((card) => {
            card.used = false;
            playerDeck.push(card);
        });
        playerHand.length = 0;

        playerDeck.forEach((card) => {
            card.used = false;
        });

        for (let i = playerDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playerDeck[i], playerDeck[j]] = [playerDeck[j], playerDeck[i]];
        }
    }

    function isSpecialCard(card) {
        const specials = ["Hallows", "Shield", "Echo", "Mirror", "Swap"];
        return specials.includes(card.data.name);
    }

    function startGameLoop() {
        if (leftoverCards.length > 0) {
            const randomIndex = Math.floor(
                Math.random() * leftoverCards.length,
            );
            const startingCard = leftoverCards.splice(randomIndex, 1)[0];
            roundDiscardPile.push(startingCard);
            currentSum += startingCard.data.value || 0;
            updateGameUI();
            console.log(
                `Starting card: ${startingCard.data.name} (${startingCard.data.value}). Initial sum: ${currentSum}`,
            );
        }

        players.forEach((playerName) => {
            updateCardsLeftCounter(playerName);
        });

        gameInterval = setInterval(() => {
            playNextBotTurn();

            const allBots = [
                { name: "dobby", deck: botDobbyCards, hand: botDobbyHand },
                {
                    name: "crookshanks",
                    deck: botCrookshanksCards,
                    hand: botCrookshanksHand,
                },
                { name: "hedwig", deck: botHedwigCards, hand: botHedwigHand },
                { name: "trevor", deck: botTrevorCards, hand: botTrevorHand },
            ];

            for (const bot of allBots) {
                const totalCards =
                    bot.deck.filter((c) => !c.used).length + bot.hand.length;

                if (totalCards === 0) {
                    console.log(`${bot.name} has won the game!`);
                    clearInterval(gameInterval);

                    const winMessage = document.createElement("div");
                    winMessage.classList.add("harry-potter");
                    winMessage.textContent = `${bot.name.toUpperCase()} WINS!`;
                    winMessage.classList.add(
                        "fixed",
                        "top-1/2",
                        "left-1/2",
                        "transform",
                        "-translate-x-1/2",
                        "-translate-y-1/2",
                        "text-6xl",
                        "font-bold",
                        "text-white",
                        "bg-black",
                        "bg-opacity-75",
                        "p-8",
                        "rounded-lg",
                        "z-[9999999]",
                    );

                    document.body.appendChild(winMessage);
                    return;
                }
            }
        }, 200);
    }

    function startGame() {
        addHandStyles();

        leftoverCards = createPersonalDeck(leftoverDeckElement);
        botDobbyCards = createPersonalDeck(botDobbyCardsElements);
        botCrookshanksCards = createPersonalDeck(botCrookshanksCardsElements);
        botHedwigCards = createPersonalDeck(botHedwigCardsElements);
        botTrevorCards = createPersonalDeck(botTrevorCardsElements);

        botDobbyHand = getTwoRandomCards(botDobbyCards);
        botCrookshanksHand = getTwoRandomCards(botCrookshanksCards);
        botHedwigHand = getTwoRandomCards(botHedwigCards);
        botTrevorHand = getTwoRandomCards(botTrevorCards);

        displayBotHand(
            botDobbyHand,
            botDobbyHandElement,
            "bot_dobby_card",
            true,
        );
        displayBotHand(
            botCrookshanksHand,
            botCrookshanksHandElement,
            "bot_crookshanks_card",
            true,
        );
        displayBotHand(
            botHedwigHand,
            botHedwigHandElement,
            "bot_hedwig_card",
            false,
        );
        displayBotHand(
            botTrevorHand,
            botTrevorHandElement,
            "bot_trevor_card",
            false,
        );

        [
            botDobbyHandElement,
            botCrookshanksHandElement,
            botHedwigHandElement,
            botTrevorHandElement,
        ]
            .filter((el) => el)
            .forEach((el) => {
                el.classList.remove("hidden");
                el.classList.add("bot-hand");
            });

        console.log("Bot Dobby Hand:", botDobbyHand);
        console.log("Bot Crookshanks Hand:", botCrookshanksHand);
        console.log("Bot Hedwig Hand:", botHedwigHand);
        console.log("Bot Trevor Hand:", botTrevorHand);
        console.log("Leftover Deck:", leftoverCards);

        updateGameUI();

        startGameLoop();
    }

    startGame();
});
