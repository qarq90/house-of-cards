document.addEventListener("DOMContentLoaded", () => {
    const timerIndicator = document.getElementById("timer-indicator");
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
        if (cardsArray.length <= 2) {
            return cardsArray.slice();
        }
        const shuffled = [...cardsArray].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 2);
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

        hand.forEach((card) => {
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
            availableCard.used = true;
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
        updateGameUI();

        console.log(`Starting Round ${currentRound} with sum: ${currentSum}`);
    }

    function checkRoundEnd() {
        if (currentSum === limit) {
            console.log("Exactly hit the limit! Starting new round...");
            console.log("Dobby's Cards:", botDobbyCards);
            console.log("Crookshanks's Cards:", botCrookshanksCards);
            console.log("Hedwig's Cards:", botHedwigCards);
            console.log("Trevor's Cards:", botTrevorCards);
            console.log("Round Discard Pile:", roundDiscardPile);
            console.log("Leftover Cards:", leftoverCards);
            startNewRound();
            return true;
        } else if (currentSum > limit) {
            console.log("Exceeded the limit! Starting new round...");
            console.log("Dobby's Cards:", botDobbyCards);
            console.log("Crookshanks's Cards:", botCrookshanksCards);
            console.log("Hedwig's Cards:", botHedwigCards);
            console.log("Trevor's Cards:", botTrevorCards);
            console.log("Round Discard Pile:", roundDiscardPile);
            console.log("Leftover Cards:", leftoverCards);
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
        }, 800);

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

        currentSum += cardToPlay.data.value || 0;

        // Draw new card before updating the counter
        drawCardFromPersonalDeck(playerDeck, playerHand);

        setTimeout(() => {
            const isRotated =
                playerName === "dobby" || playerName === "crookshanks";
            displayBotHand(
                playerHand,
                playerHandElement,
                `bot_${playerName}_card`,
                isRotated,
            );

            // Update cards left counter after hand is displayed
            updateCardsLeftCounter(playerName);
        }, 300);

        updateGameUI();

        console.log(
            `${playerName} played ${cardToPlay.data.name} (${cardToPlay.data.value}). New sum: ${currentSum}`,
        );

        setTimeout(() => {
            checkRoundEnd();
        }, 500);

        return true;
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
                        "harry-potter",
                        "tracking-widest",
                    );
                    document.body.appendChild(winMessage);
                    return;
                }
            }
        }, 2000);
    }

    function startGame() {
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
            .forEach((el) => el.classList.remove("hidden"));

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
