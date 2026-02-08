document.addEventListener("DOMContentLoaded", () => {
    // ============ Constants =====================================================================================================================================

    // ============ Constants =====================================================================================================================================

    const timerIndicator = document.getElementById("timer-indicator");
    const timerIndicatorBG = document.getElementById("timer-indicator-bg");
    const totalTime = 5000;

    const currentValueElement = document.getElementById("current_value");
    const targetValueElement = document.getElementById("target_value");
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

    // ============ Constants =====================================================================================================================================

    // ============ Constants =====================================================================================================================================

    // ============ Declarations =====================================================================================================================================

    // ============ Declarations =====================================================================================================================================

    let timeSpace = 0;
    let timerInterval = null;

    let leftoverCards = [];

    let botDobbyCards = [],
        botCrookshanksCards = [],
        botHedwigCards = [],
        botTrevorCards = [];

    let botDobbyHand = [],
        botCrookshanksHand = [],
        botHedwigHand = [],
        botTrevorHand = [];

    let gryffindorCards = [
        //  Numerical Cards
        {
            house: "gryffindor",
            name: "0",
            value: 0,
            src: "/static/cards/gryffindor_0_1.png",
        },
        {
            house: "gryffindor",
            name: "0",
            value: 0,
            src: "/static/cards/gryffindor_0_2.png",
        },
        {
            house: "gryffindor",
            name: "1",
            value: 1,
            src: "/static/cards/gryffindor_1_1.png",
        },
        {
            house: "gryffindor",
            name: "1",
            value: 1,
            src: "/static/cards/gryffindor_1_2.png",
        },
        {
            house: "gryffindor",
            name: "2",
            value: 2,
            src: "/static/cards/gryffindor_2_1.png",
        },
        {
            house: "gryffindor",
            name: "2",
            value: 2,
            src: "/static/cards/gryffindor_2_2.png",
        },
        {
            house: "gryffindor",
            name: "3",
            value: 3,
            src: "/static/cards/gryffindor_3_1.png",
        },
        {
            house: "gryffindor",
            name: "3",
            value: 3,
            src: "/static/cards/gryffindor_3_2.png",
        },
        {
            house: "gryffindor",
            name: "4",
            value: 4,
            src: "/static/cards/gryffindor_4_1.png",
        },
        {
            house: "gryffindor",
            name: "4",
            value: 4,
            src: "/static/cards/gryffindor_4_2.png",
        },
        {
            house: "gryffindor",
            name: "5",
            value: 5,
            src: "/static/cards/gryffindor_5_1.png",
        },
        {
            house: "gryffindor",
            name: "5",
            value: 5,
            src: "/static/cards/gryffindor_5_2.png",
        },
        {
            house: "gryffindor",
            name: "6",
            value: 6,
            src: "/static/cards/gryffindor_6_1.png",
        },
        {
            house: "gryffindor",
            name: "6",
            value: 6,
            src: "/static/cards/gryffindor_6_2.png",
        },
        {
            house: "gryffindor",
            name: "7",
            value: 7,
            src: "/static/cards/gryffindor_7_1.png",
        },
        {
            house: "gryffindor",
            name: "7",
            value: 7,
            src: "/static/cards/gryffindor_7_2.png",
        },
        {
            house: "gryffindor",
            name: "8",
            value: 8,
            src: "/static/cards/gryffindor_8_1.png",
        },
        {
            house: "gryffindor",
            name: "8",
            value: 8,
            src: "/static/cards/gryffindor_8_2.png",
        },
        {
            house: "gryffindor",
            name: "9",
            value: 9,
            src: "/static/cards/gryffindor_9_1.png",
        },
        {
            house: "gryffindor",
            name: "9",
            value: 9,
            src: "/static/cards/gryffindor_9_2.png",
        },
        // Special Cards
        {
            house: "gryffindor",
            name: "mirror",
            value: 0,
            src: "/static/cards/gryffindor_mirror.png",
        },
        {
            house: "gryffindor",
            name: "hallows",
            value: 0,
            src: "/static/cards/gryffindor_hallows.png",
        },
        {
            house: "gryffindor",
            name: "echo",
            value: 0,
            src: "/static/cards/gryffindor_echo.png",
        },
        {
            house: "gryffindor",
            name: "shield",
            value: 0,
            src: "/static/cards/gryffindor_shield.png",
        },
        {
            house: "gryffindor",
            name: "swap",
            value: 0,
            src: "/static/cards/gryffindor_swap.png",
        },
    ];

    let hufflepuffCards = [
        //  Numerical Cards
        {
            house: "hufflepuff",
            name: "0",
            value: 0,
            src: "/static/cards/hufflepuff_0_1.png",
        },
        {
            house: "hufflepuff",
            name: "0",
            value: 0,
            src: "/static/cards/hufflepuff_0_2.png",
        },
        {
            house: "hufflepuff",
            name: "1",
            value: 1,
            src: "/static/cards/hufflepuff_1_1.png",
        },
        {
            house: "hufflepuff",
            name: "1",
            value: 1,
            src: "/static/cards/hufflepuff_1_2.png",
        },
        {
            house: "hufflepuff",
            name: "2",
            value: 2,
            src: "/static/cards/hufflepuff_2_1.png",
        },
        {
            house: "hufflepuff",
            name: "2",
            value: 2,
            src: "/static/cards/hufflepuff_2_2.png",
        },
        {
            house: "hufflepuff",
            name: "3",
            value: 3,
            src: "/static/cards/hufflepuff_3_1.png",
        },
        {
            house: "hufflepuff",
            name: "3",
            value: 3,
            src: "/static/cards/hufflepuff_3_2.png",
        },
        {
            house: "hufflepuff",
            name: "4",
            value: 4,
            src: "/static/cards/hufflepuff_4_1.png",
        },
        {
            house: "hufflepuff",
            name: "4",
            value: 4,
            src: "/static/cards/hufflepuff_4_2.png",
        },
        {
            house: "hufflepuff",
            name: "5",
            value: 5,
            src: "/static/cards/hufflepuff_5_1.png",
        },
        {
            house: "hufflepuff",
            name: "5",
            value: 5,
            src: "/static/cards/hufflepuff_5_2.png",
        },
        {
            house: "hufflepuff",
            name: "6",
            value: 6,
            src: "/static/cards/hufflepuff_6_1.png",
        },
        {
            house: "hufflepuff",
            name: "6",
            value: 6,
            src: "/static/cards/hufflepuff_6_2.png",
        },
        {
            house: "hufflepuff",
            name: "7",
            value: 7,
            src: "/static/cards/hufflepuff_7_1.png",
        },
        {
            house: "hufflepuff",
            name: "7",
            value: 7,
            src: "/static/cards/hufflepuff_7_2.png",
        },
        {
            house: "hufflepuff",
            name: "8",
            value: 8,
            src: "/static/cards/hufflepuff_8_1.png",
        },
        {
            house: "hufflepuff",
            name: "8",
            value: 8,
            src: "/static/cards/hufflepuff_8_2.png",
        },
        {
            house: "hufflepuff",
            name: "9",
            value: 9,
            src: "/static/cards/hufflepuff_9_1.png",
        },
        {
            house: "hufflepuff",
            name: "9",
            value: 9,
            src: "/static/cards/hufflepuff_9_2.png",
        },
        // Special Cards
        {
            house: "hufflepuff",
            name: "mirror",
            value: 0,
            src: "/static/cards/hufflepuff_mirror.png",
        },
        {
            house: "hufflepuff",
            name: "hallows",
            value: 0,
            src: "/static/cards/hufflepuff_hallows.png",
        },
        {
            house: "hufflepuff",
            name: "echo",
            value: 0,
            src: "/static/cards/hufflepuff_echo.png",
        },
        {
            house: "hufflepuff",
            name: "shield",
            value: 0,
            src: "/static/cards/hufflepuff_shield.png",
        },
        {
            house: "hufflepuff",
            name: "swap",
            value: 0,
            src: "/static/cards/hufflepuff_swap.png",
        },
    ];

    let ravenclawCards = [
        //  Numerical Cards
        {
            house: "ravenclaw",
            name: "0",
            value: 0,
            src: "/static/cards/ravenclaw_0_1.png",
        },
        {
            house: "ravenclaw",
            name: "0",
            value: 0,
            src: "/static/cards/ravenclaw_0_2.png",
        },
        {
            house: "ravenclaw",
            name: "1",
            value: 1,
            src: "/static/cards/ravenclaw_1_1.png",
        },
        {
            house: "ravenclaw",
            name: "1",
            value: 1,
            src: "/static/cards/ravenclaw_1_2.png",
        },
        {
            house: "ravenclaw",
            name: "2",
            value: 2,
            src: "/static/cards/ravenclaw_2_1.png",
        },
        {
            house: "ravenclaw",
            name: "2",
            value: 2,
            src: "/static/cards/ravenclaw_2_2.png",
        },
        {
            house: "ravenclaw",
            name: "3",
            value: 3,
            src: "/static/cards/ravenclaw_3_1.png",
        },
        {
            house: "ravenclaw",
            name: "3",
            value: 3,
            src: "/static/cards/ravenclaw_3_2.png",
        },
        {
            house: "ravenclaw",
            name: "4",
            value: 4,
            src: "/static/cards/ravenclaw_4_1.png",
        },
        {
            house: "ravenclaw",
            name: "4",
            value: 4,
            src: "/static/cards/ravenclaw_4_2.png",
        },
        {
            house: "ravenclaw",
            name: "5",
            value: 5,
            src: "/static/cards/ravenclaw_5_1.png",
        },
        {
            house: "ravenclaw",
            name: "5",
            value: 5,
            src: "/static/cards/ravenclaw_5_2.png",
        },
        {
            house: "ravenclaw",
            name: "6",
            value: 6,
            src: "/static/cards/ravenclaw_6_1.png",
        },
        {
            house: "ravenclaw",
            name: "6",
            value: 6,
            src: "/static/cards/ravenclaw_6_2.png",
        },
        {
            house: "ravenclaw",
            name: "7",
            value: 7,
            src: "/static/cards/ravenclaw_7_1.png",
        },
        {
            house: "ravenclaw",
            name: "7",
            value: 7,
            src: "/static/cards/ravenclaw_7_2.png",
        },
        {
            house: "ravenclaw",
            name: "8",
            value: 8,
            src: "/static/cards/ravenclaw_8_1.png",
        },
        {
            house: "ravenclaw",
            name: "8",
            value: 8,
            src: "/static/cards/ravenclaw_8_2.png",
        },
        {
            house: "ravenclaw",
            name: "9",
            value: 9,
            src: "/static/cards/ravenclaw_9_1.png",
        },
        {
            house: "ravenclaw",
            name: "9",
            value: 9,
            src: "/static/cards/ravenclaw_9_2.png",
        },
        // Special Cards
        {
            house: "ravenclaw",
            name: "mirror",
            value: 0,
            src: "/static/cards/ravenclaw_mirror.png",
        },
        {
            house: "ravenclaw",
            name: "hallows",
            value: 0,
            src: "/static/cards/ravenclaw_hallows.png",
        },
        {
            house: "ravenclaw",
            name: "echo",
            value: 0,
            src: "/static/cards/ravenclaw_echo.png",
        },
        {
            house: "ravenclaw",
            name: "shield",
            value: 0,
            src: "/static/cards/ravenclaw_shield.png",
        },
        {
            house: "ravenclaw",
            name: "swap",
            value: 0,
            src: "/static/cards/ravenclaw_swap.png",
        },
    ];

    let slytherinCards = [
        //  Numerical Cards
        {
            house: "slytherin",
            name: "0",
            value: 0,
            src: "/static/cards/slytherin_0_1.png",
        },
        {
            house: "slytherin",
            name: "0",
            value: 0,
            src: "/static/cards/slytherin_0_2.png",
        },
        {
            house: "slytherin",
            name: "1",
            value: 1,
            src: "/static/cards/slytherin_1_1.png",
        },
        {
            house: "slytherin",
            name: "1",
            value: 1,
            src: "/static/cards/slytherin_1_2.png",
        },
        {
            house: "slytherin",
            name: "2",
            value: 2,
            src: "/static/cards/slytherin_2_1.png",
        },
        {
            house: "slytherin",
            name: "2",
            value: 2,
            src: "/static/cards/slytherin_2_2.png",
        },
        {
            house: "slytherin",
            name: "3",
            value: 3,
            src: "/static/cards/slytherin_3_1.png",
        },
        {
            house: "slytherin",
            name: "3",
            value: 3,
            src: "/static/cards/slytherin_3_2.png",
        },
        {
            house: "slytherin",
            name: "4",
            value: 4,
            src: "/static/cards/slytherin_4_1.png",
        },
        {
            house: "slytherin",
            name: "4",
            value: 4,
            src: "/static/cards/slytherin_4_2.png",
        },
        {
            house: "slytherin",
            name: "5",
            value: 5,
            src: "/static/cards/slytherin_5_1.png",
        },
        {
            house: "slytherin",
            name: "5",
            value: 5,
            src: "/static/cards/slytherin_5_2.png",
        },
        {
            house: "slytherin",
            name: "6",
            value: 6,
            src: "/static/cards/slytherin_6_1.png",
        },
        {
            house: "slytherin",
            name: "6",
            value: 6,
            src: "/static/cards/slytherin_6_2.png",
        },
        {
            house: "slytherin",
            name: "7",
            value: 7,
            src: "/static/cards/slytherin_7_1.png",
        },
        {
            house: "slytherin",
            name: "7",
            value: 7,
            src: "/static/cards/slytherin_7_2.png",
        },
        {
            house: "slytherin",
            name: "8",
            value: 8,
            src: "/static/cards/slytherin_8_1.png",
        },
        {
            house: "slytherin",
            name: "8",
            value: 8,
            src: "/static/cards/slytherin_8_2.png",
        },
        {
            house: "slytherin",
            name: "9",
            value: 9,
            src: "/static/cards/slytherin_9_1.png",
        },
        {
            house: "slytherin",
            name: "9",
            value: 9,
            src: "/static/cards/slytherin_9_2.png",
        },
        // Special Cards
        {
            house: "slytherin",
            name: "mirror",
            value: 0,
            src: "/static/cards/slytherin_mirror.png",
        },
        {
            house: "slytherin",
            name: "hallows",
            value: 0,
            src: "/static/cards/slytherin_hallows.png",
        },
        {
            house: "slytherin",
            name: "echo",
            value: 0,
            src: "/static/cards/slytherin_echo.png",
        },
        {
            house: "slytherin",
            name: "shield",
            value: 0,
            src: "/static/cards/slytherin_shield.png",
        },
        {
            house: "slytherin",
            name: "swap",
            value: 0,
            src: "/static/cards/slytherin_swap.png",
        },
    ];

    let allCards = [
        ...gryffindorCards,
        ...hufflepuffCards,
        ...ravenclawCards,
        ...slytherinCards,
    ];

    let leftoverDeck = [];

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
    // ============ Helper Funtions =====================================================================================================================================

    // ============ Helper Funtions =====================================================================================================================================

    // ============ Game Logic =====================================================================================================================================

    // ============ Game Logic =====================================================================================================================================

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
    }

    startGame();
});
