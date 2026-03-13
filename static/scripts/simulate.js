document.addEventListener("DOMContentLoaded", () => {
    const LOOP_INTERVAL = 250;

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

    let lastTwoHouses = {
        dobby: [],
        crookshanks: [],
        hedwig: [],
        trevor: [],
    };

    let currentSum = 0;
    let limit = 37;
    let currentRound = 1;
    let players = ["dobby", "crookshanks", "hedwig", "trevor"];
    let activePlayers = [...players];
    let currentPlayerIndex = Math.floor(Math.random() * activePlayers.length);
    let eliminatedPlayers = [];

    let roundDiscardPile = [];

    let lastNumberCard = null;
    let echoActive = false;
    let mirrorBlocked = false;
    let lastPlayedCard = null;

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
            .eliminated-player {
                opacity: 0.3 !important;
                filter: grayscale(100%) !important;
                pointer-events: none !important;
            }
            .eliminated-player .bot-hand {
                display: none !important;
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
                rankItem.innerHTML = `
                <span class="text-6xl tracking-widest">${rankEmojis[rankNumber - 1]} -=></span>
                <span class="tracking-widest">${capitalizedPlayer}</span>
            `;
            } else {
                rankItem.innerHTML = `
                <span class="text-6xl tracking-widest">${rankNumber}th -=></span>
                <span class="tracking-widest">${capitalizedPlayer}</span>
            `;
            }

            rankingsContainer.appendChild(rankItem);
        });

        document.body.appendChild(rankingsContainer);
    }

    function eliminatePlayer(playerName) {
        if (!activePlayers.includes(playerName)) return;

        activePlayers = activePlayers.filter((p) => p !== playerName);
        eliminatedPlayers.push(playerName);

        if (
            currentPlayerIndex >= activePlayers.length &&
            activePlayers.length > 0
        ) {
            currentPlayerIndex = 0;
        }

        let playerElement;
        switch (playerName) {
            case "dobby":
                playerElement = botDobbyElement;
                break;
            case "crookshanks":
                playerElement = botCrookshanksElement;
                break;
            case "hedwig":
                playerElement = botHedwigElement;
                break;
            case "trevor":
                playerElement = botTrevorElement;
                break;
        }

        if (playerElement) {
            playerElement.classList.add("eliminated-player");
        }

        console.log(`${playerName} has been eliminated!`);

        checkForWinner();
    }

    function checkForWinner() {
        if (activePlayers.length === 1) {
            const winner = activePlayers[0];
            console.log(`${winner} has won the game!`);
            clearInterval(gameInterval);

            displayRankings();

            return true;
        }
        return false;
    }

    function highlightPenaltyPlayer(playerName) {
        let elements = [];

        switch (playerName) {
            case "dobby":
                elements = [
                    botDobbyElement,
                    botDobbyHandElement,
                    ...botDobbyCardsElements,
                ];
                break;

            case "crookshanks":
                elements = [
                    botCrookshanksElement,
                    botCrookshanksHandElement,
                    ...botCrookshanksCardsElements,
                ];
                break;

            case "hedwig":
                elements = [
                    botHedwigElement,
                    botHedwigHandElement,
                    ...botHedwigCardsElements,
                ];
                break;

            case "trevor":
                elements = [
                    botTrevorElement,
                    botTrevorHandElement,
                    ...botTrevorCardsElements,
                ];
                break;
        }

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

    function addCardToPlayerDeck(playerName, card) {
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
                    type:
                        img && img.dataset.type
                            ? img.dataset.type
                            : "numerical",
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

        if (totalCardsLeft === 0 && activePlayers.includes(playerName)) {
            eliminatePlayer(playerName);
        }
    }

    function getNextActivePlayer() {
        if (activePlayers.length === 0) return null;

        let nextIndex = (currentPlayerIndex + 1) % activePlayers.length;
        return activePlayers[nextIndex];
    }

    function chooseCardToPlay(hand) {
        if (hand.length === 0) return null;
        if (hand.length === 1) return hand[0];

        let a = hand[0];
        let b = hand[1];

        let flag = undefined;

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
            if (a.data.type === "special" && a.data.name === "echo") {
                return a;
            }
            if (b.data.type === "special" && b.data.name === "echo") {
                return b;
            }
        }

        const nextPlayerHasEcho = nextPlayerName
            ? checkIfPlayerHasEcho(nextPlayerName)
            : false;
        if (
            nextPlayerHasEcho &&
            (a.data.name === "shield" || b.data.name === "shield")
        ) {
            return a.data.name === "shield" ? b : a;
        }

        if (lastNumberCard) {
            if (a.data.name === "mirror") {
                const mirrorValue = lastNumberCard.data.value;
                const effectiveValue = echoActive
                    ? mirrorValue * 2
                    : mirrorValue;

                if (effectiveValue + currentSum > limit) {
                    return b;
                }
                if (effectiveValue + currentSum === limit) {
                    return a;
                }
            }
            if (b.data.name === "mirror") {
                const mirrorValue = lastNumberCard.data.value;
                const effectiveValue = echoActive
                    ? mirrorValue * 2
                    : mirrorValue;

                if (effectiveValue + currentSum > limit) {
                    return a;
                }
                if (effectiveValue + currentSum === limit) {
                    return b;
                }
            }
        }

        if (a.data.name === "swap" || b.data.name === "swap") {
            const swapCard = a.data.name === "swap" ? a : b;
            const otherCard = a.data.name === "swap" ? b : a;

            if (otherCard.data.type === "numerical") {
                const otherEffective = echoActive
                    ? otherCard.data.value * 2
                    : otherCard.data.value;

                if (otherEffective + currentSum > limit) {
                    return swapCard;
                }
            }
        }

        const currentPlayerName = activePlayers[currentPlayerIndex];
        const playerDeckSize = currentPlayerName
            ? getPlayerDeckSize(currentPlayerName)
            : 0;

        if (playerDeckSize <= 2) {
            if (a.data.type === "numerical") {
                const aEffective = echoActive ? a.data.value * 2 : a.data.value;
                if (aEffective + currentSum === limit) return a;
            }
            if (b.data.type === "numerical") {
                const bEffective = echoActive ? b.data.value * 2 : b.data.value;
                if (bEffective + currentSum === limit) return b;
            }
        }

        if (limit - currentSum <= 3) {
            if (a.data.type === "numerical" && a.data.value <= 2) return a;
            if (b.data.type === "numerical" && b.data.value <= 2) return b;

            if (
                a.data.type === "special" &&
                b.data.type === "numerical" &&
                b.data.value > 2
            )
                return a;
            if (
                b.data.type === "special" &&
                a.data.type === "numerical" &&
                a.data.value > 2
            )
                return b;
        }

        const opponentsHaveManyCards = currentPlayerName
            ? checkIfOpponentsHaveManyCards(currentPlayerName)
            : false;
        if (currentSum < limit - 10 && opponentsHaveManyCards) {
            if (a.data.name === "hallows") return b;
            if (b.data.name === "hallows") return a;
        }

        if (a.data.name === "echo" && b.data.name === "mirror") {
            if (currentSum < limit - 8 && lastNumberCard) {
                return b;
            }
        }
        if (b.data.name === "echo" && a.data.name === "mirror") {
            if (currentSum < limit - 8 && lastNumberCard) {
                return a;
            }
        }

        const playerLastTwoHouses = currentPlayerName
            ? lastTwoHouses[currentPlayerName] || []
            : [];
        if (playerLastTwoHouses.length === 2) {
            const [house1, house2] = playerLastTwoHouses;
            if (house1 === house2) {
                if (a.data.house === house1 && b.data.house !== house1) {
                    if (currentSum < limit - 5) {
                        return b;
                    }
                }
                if (b.data.house === house1 && a.data.house !== house1) {
                    if (currentSum < limit - 5) {
                        return a;
                    }
                }
            }
        }

        if (!echoActive) {
            if (
                a.data.type === "numerical" &&
                a.data.value + currentSum === limit
            )
                flag = true;
            else if (
                b.data.type === "numerical" &&
                b.data.value + currentSum === limit
            )
                flag = false;
        } else {
            if (
                a.data.type === "numerical" &&
                a.data.value * 2 + currentSum === limit
            )
                flag = true;
            else if (
                b.data.type === "numerical" &&
                b.data.value * 2 + currentSum === limit
            )
                flag = false;
        }

        if (!echoActive) {
            if (
                a.data.type === "numerical" &&
                a.data.value + currentSum === limit &&
                b.data.type === "special" &&
                b.data.name !== "hallows"
            )
                flag = true;
            else if (
                b.data.type === "numerical" &&
                b.data.value + currentSum === limit &&
                a.data.type === "special" &&
                b.data.name !== "hallows"
            )
                flag = false;
        } else {
            if (
                a.data.type === "numerical" &&
                a.data.value + currentSum === limit &&
                b.data.type === "special" &&
                b.data.name !== "hallows"
            )
                flag = true;
            else if (
                b.data.type === "numerical" &&
                b.data.value + currentSum === limit &&
                a.data.type === "special" &&
                b.data.name !== "hallows"
            )
                flag = false;
        }

        if (flag === true) return a;
        if (flag === false) return b;

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

        return Math.random() < 0.5 ? a : b;
    }

    function getPlayerHandSize(playerName) {
        switch (playerName) {
            case "dobby":
                return botDobbyHand.length;
            case "crookshanks":
                return botCrookshanksHand.length;
            case "hedwig":
                return botHedwigHand.length;
            case "trevor":
                return botTrevorHand.length;
            default:
                return 0;
        }
    }

    function getPlayerDeckSize(playerName) {
        switch (playerName) {
            case "dobby":
                return botDobbyCards.filter((c) => !c.used).length;
            case "crookshanks":
                return botCrookshanksCards.filter((c) => !c.used).length;
            case "hedwig":
                return botHedwigCards.filter((c) => !c.used).length;
            case "trevor":
                return botTrevorCards.filter((c) => !c.used).length;
            default:
                return 0;
        }
    }

    function checkIfPlayerHasEcho(playerName) {
        let hand;
        switch (playerName) {
            case "dobby":
                hand = botDobbyHand;
                break;
            case "crookshanks":
                hand = botCrookshanksHand;
                break;
            case "hedwig":
                hand = botHedwigHand;
                break;
            case "trevor":
                hand = botTrevorHand;
                break;
            default:
                return false;
        }

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
        leftoverCards = [...leftoverCards, ...roundDiscardPile];
        roundDiscardPile = [];

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
        console.log(`Active players: ${activePlayers.join(", ")}`);
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

                reshufflePlayerDeck(playerName);

                drawCardsUpToLimit(playerName);

                return true;
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
        return false;
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

        const cardToPlay = chooseCardToPlay(playerHand);
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
            const roundShouldEnd = handleSpecialCard(playerName, cardToPlay);

            if (currentSum >= limit) {
                const roundEnded = checkForPenalties(
                    playerName,
                    cardToPlay.data.value,
                    previousSum,
                );
                if (roundEnded) return true;
            }

            if (roundShouldEnd) {
                return true;
            }
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
            const otherPlayers = activePlayers
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
            highlightPenaltyPlayer(playerName);

            const penaltyCards = playedValue;

            const tempDiscardPile = [...roundDiscardPile];
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

            leftoverCards = [...leftoverCards, ...tempDiscardPile];

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

    function playNextBotTurn() {
        if (activePlayers.length === 0) return;

        if (currentPlayerIndex >= activePlayers.length) {
            currentPlayerIndex = 0;
        }

        const playerName = activePlayers[currentPlayerIndex];
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
            default:
                return;
        }

        console.log(`${playerName}'s turn...`);
        botPlayTurn(playerName, playerHand, playerDeck, playerHandElement);

        currentPlayerIndex++;

        if (currentPlayerIndex >= activePlayers.length) {
            currentPlayerIndex = 0;
        }
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
            default:
                return;
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
        if (leftoverCards.length > 0 && activePlayers.length > 0) {
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
            if (activePlayers.length > 1) {
                playNextBotTurn();
            } else if (activePlayers.length === 1) {
                checkForWinner();
            }
        }, LOOP_INTERVAL);
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
        console.log("Active Players:", activePlayers);

        updateGameUI();

        startGameLoop();
    }

    startGame();
});
