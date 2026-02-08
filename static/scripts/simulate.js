document.addEventListener("DOMContentLoaded", () => {
    // ============ Declarations =====================================================================================================================================

    // ============ Declarations =====================================================================================================================================

    const timerIndicator = document.getElementById("timer-indicator");
    const timerIndicatorBG = document.getElementById("timer-indicator-bg");
    const totalTime = 5000;

    let timeSpace = 0;
    let timerInterval = null;

    let botDobbyCards = [],
        botCrookshanksCards = [],
        botHedwigCards = [],
        botTrevorCards = [];

    let botDobbyHand = [],
        botCrookshanksHand = [],
        botHedwigHand = [],
        botTrevorHand = [];

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

    // ============ Declarations =====================================================================================================================================

    // ============ Declarations =====================================================================================================================================

    // ============ Helper Funtions =====================================================================================================================================

    // ============ Helper Funtions =====================================================================================================================================

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
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-*/=!@#$%^&*(){}\":?><,./;'[]|";

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

    // ============ Helper Funtions =====================================================================================================================================

    // ============ Helper Funtions =====================================================================================================================================

    // ============ Game Logic =====================================================================================================================================

    // ============ Game Logic =====================================================================================================================================

    function startGame() {
        botDobbyCards = Array.from(botDobbyCardsElements).map((card) => ({
            element: card,
            img: card.querySelector("img"),
            used: false,
            data: {
                id: generateRandomString(),
                name: card.querySelector("img").dataset.cardName,
                house: card.querySelector("img").dataset.cardHouse,
                src: card.querySelector("img").src,
                value:
                    parseInt(card.querySelector("img").dataset.cardValue) || 0,
            },
        }));

        botCrookshanksCards = Array.from(botCrookshanksCardsElements).map(
            (card) => ({
                element: card,
                img: card.querySelector("img"),
                used: false,
                data: {
                    id: generateRandomString(),
                    name: card.querySelector("img").dataset.cardName,
                    house: card.querySelector("img").dataset.cardHouse,
                    src: card.querySelector("img").src,
                    value:
                        parseInt(card.querySelector("img").dataset.cardValue) ||
                        0,
                },
            }),
        );

        botHedwigCards = Array.from(botHedwigCardsElements).map((card) => ({
            element: card,
            img: card.querySelector("img"),
            used: false,
            data: {
                id: generateRandomString(),
                name: card.querySelector("img").dataset.cardName,
                house: card.querySelector("img").dataset.cardHouse,
                src: card.querySelector("img").src,
                value:
                    parseInt(card.querySelector("img").dataset.cardValue) || 0,
            },
        }));

        botTrevorCards = Array.from(botTrevorCardsElements).map((card) => ({
            element: card,
            img: card.querySelector("img"),
            used: false,
            data: {
                id: generateRandomString(),
                name: card.querySelector("img").dataset.cardName,
                house: card.querySelector("img").dataset.cardHouse,
                src: card.querySelector("img").src,
                value:
                    parseInt(card.querySelector("img").dataset.cardValue) || 0,
            },
        }));

        botDobbyHand = getTwoRandomCards(botDobbyCards);
        botCrookshanksHand = getTwoRandomCards(botCrookshanksCards);
        botHedwigHand = getTwoRandomCards(botHedwigCards);
        botTrevorHand = getTwoRandomCards(botTrevorCards);

        for (let card of botDobbyHand) {
            const cardElement = document.createElement("img");
            cardElement.src = card.data.src;
            cardElement.id = `bot_dobby_card_${card.data.id}`;
            cardElement.alt = `${card.data.house} ${card.data.name}`;
            cardElement.classList.add(
                "w-[170.666px]",
                "h-[238.666px]",
                "rotate-180",
            );
            if (botDobbyHandElement)
                botDobbyHandElement.appendChild(cardElement);
        }

        for (let card of botCrookshanksHand) {
            const cardElement = document.createElement("img");
            cardElement.src = card.data.src;
            cardElement.id = `bot_crookshanks_card_${card.data.id}`;
            cardElement.alt = `${card.data.house} ${card.data.name}`;
            cardElement.classList.add(
                "w-[170.666px]",
                "h-[238.666px]",
                "rotate-180",
            );
            if (botCrookshanksHandElement)
                botCrookshanksHandElement.appendChild(cardElement);
        }

        for (let card of botHedwigHand) {
            const cardElement = document.createElement("img");
            cardElement.src = card.data.src;
            cardElement.id = `bot_hedwig_card_${card.data.id}`;
            cardElement.alt = `${card.data.house} ${card.data.name}`;
            cardElement.classList.add("w-[170.666px]", "h-[238.666px]");
            if (botHedwigHandElement)
                botHedwigHandElement.appendChild(cardElement);
        }

        for (let card of botTrevorHand) {
            const cardElement = document.createElement("img");
            cardElement.src = card.data.src;
            cardElement.id = `bot_trevor_card_${card.data.id}`;
            cardElement.alt = `${card.data.house} ${card.data.name}`;
            cardElement.classList.add("w-[170.666px]", "h-[238.666px]");
            if (botTrevorHandElement)
                botTrevorHandElement.appendChild(cardElement);
        }

        if (botDobbyHandElement) botDobbyHandElement.classList.remove("hidden");
        if (botCrookshanksHandElement)
            botCrookshanksHandElement.classList.remove("hidden");
        if (botHedwigHandElement)
            botHedwigHandElement.classList.remove("hidden");
        if (botTrevorHandElement)
            botTrevorHandElement.classList.remove("hidden");

        console.log("Bot Dobby Hand:", botDobbyHand);
        console.log("Bot Crookshanks Hand:", botCrookshanksHand);
        console.log("Bot Hedwig Hand:", botHedwigHand);
        console.log("Bot Trevor Hand:", botTrevorHand);
    }

    startGame();
});
