const timerIndicator = document.getElementById("timer-indicator");
const timerIndicatorBG = document.getElementById("timer-indicator-bg");
let timeSpace = 0;
let isStart = false;

const totalTime = 2000;

function moveText() {
    const increment = 50;
    const maxWidth = timerIndicatorBG.offsetWidth;

    timeSpace += increment;

    const percentage = Math.min(timeSpace / totalTime, 1);

    timerIndicator.style.width = percentage * maxWidth + "px";

    if (timeSpace >= totalTime && !isStart) {
        isStart = true;

        const playerCards = document.getElementsByClassName("player-cards");
        const botCards = document.getElementsByClassName("bot-cards");

        Array.from(playerCards).forEach((card, index) => {
            card.style.position = "absolute";
            card.style.bottom = "20px";
            card.style.right = "20px";
            card.style.zIndex = "1000";
            card.style.transition = "all 0.5s ease";
            card.style.width = "170.666px";
            card.style.height = "238.666px";
            card.style.display = "none";
        });

        Array.from(botCards).forEach((card, index) => {
            card.style.position = "absolute";
            card.style.top = "20px";
            card.style.right = "20px";
            card.style.zIndex = "1000";
            card.style.transition = "all 0.5s ease";
            card.style.width = "170.666px";
            card.style.height = "238.666px";
            card.style.display = "none";
        });

        const botIcon = document.getElementById("bot-icon");
        botIcon.style.display = "flex";

        const playerCardsStack = document.getElementById("player-cards-stack");
        playerCardsStack.style.display = "flex";

        const botsCardsStack = document.getElementById("bots-cards-stack");
        botsCardsStack.style.display = "flex";

        const botHandCards = document.getElementById("bot-hand-cards");
        botHandCards.style.display = "flex";

        const playerHandCards = document.getElementById("player-hand-cards");
        playerHandCards.style.display = "flex";

        if (botCards.length > 0) {
            const botCardImages = Array.from(botCards).map((card) =>
                card.querySelector("img"),
            );

            function getRandomIndices(count, max) {
                const indices = new Set();
                while (indices.size < count && indices.size < max) {
                    indices.add(Math.floor(Math.random() * max));
                }
                return Array.from(indices);
            }

            const botRandomIndices = getRandomIndices(2, botCardImages.length);

            botRandomIndices.forEach((index, i) => {
                const botCardContainer = document.createElement("div");
                botCardContainer.className =
                    "bot-current-card flex flex-col items-center";
                botCardContainer.dataset.cardIndex = index;

                const botImg = document.createElement("img");
                botImg.src = "../../../../../../static/cards/z_base_card.png";
                botImg.alt = "Bot Card Back";
                botImg.className =
                    "rotate-180 w-[170.666px] h-[238.666px] cursor-not-allowed opacity-90";

                const originalBotImg = botCardImages[index];
                if (originalBotImg) {
                    botImg.dataset.actualSrc = originalBotImg.src;
                    botImg.dataset.cardId = originalBotImg.dataset.cardId;
                    botImg.dataset.cardName = originalBotImg.dataset.cardName;
                    botImg.dataset.cardHouse = originalBotImg.dataset.cardHouse;
                    botImg.dataset.cardValue = originalBotImg.dataset.cardValue;
                }

                botCardContainer.appendChild(botImg);
                botHandCards.appendChild(botCardContainer);
            });
        } else {
            for (let i = 0; i < 2; i++) {
                const botCardContainer = document.createElement("div");
                botCardContainer.className =
                    "bot-current-card flex flex-col items-center";

                const botImg = document.createElement("img");
                botImg.src = "../../../../../../static/cards/z_base_card.png";
                botImg.alt = "Bot Card Back";
                botImg.className =
                    "rotate-180 w-[170.666px] h-[238.666px] cursor-not-allowed opacity-90";

                const botCardLabel = document.createElement("p");
                botCardLabel.className =
                    "harry-potter text-sm mt-2 text-gray-400";
                botCardLabel.textContent = `Bot Card ${i + 1}`;

                botCardContainer.appendChild(botImg);
                botCardContainer.appendChild(botCardLabel);
                botHandCards.appendChild(botCardContainer);
            }
        }

        if (playerCards.length > 0) {
            const playerCardImages = Array.from(playerCards).map((card) =>
                card.querySelector("img"),
            );

            function getRandomIndices(count, max) {
                const indices = new Set();
                while (indices.size < count && indices.size < max) {
                    indices.add(Math.floor(Math.random() * max));
                }
                return Array.from(indices);
            }

            const playerRandomIndices = getRandomIndices(
                2,
                playerCardImages.length,
            );

            playerRandomIndices.forEach((index, i) => {
                const originalImg = playerCardImages[index];
                if (originalImg) {
                    const cardContainer = document.createElement("div");
                    cardContainer.className =
                        "player-current-card flex flex-col items-center";
                    cardContainer.dataset.cardIndex = index;

                    const img = document.createElement("img");
                    img.src = originalImg.src;
                    img.alt = originalImg.alt || `hand-card-${i + 1}`;
                    img.className =
                        originalImg.className +
                        " cursor-pointer hover:scale-105 transition-transform";

                    img.dataset.cardId = originalImg.dataset.cardId;
                    img.dataset.cardName = originalImg.dataset.cardName;
                    img.dataset.cardHouse = originalImg.dataset.cardHouse;
                    img.dataset.cardValue = originalImg.dataset.cardValue;

                    img.addEventListener("click", function () {
                        console.log("Card clicked:", {
                            id: this.dataset.cardId,
                            name: this.dataset.cardName,
                            house: this.dataset.cardHouse,
                            value: this.dataset.cardValue,
                        });
                    });

                    cardContainer.appendChild(img);
                    playerHandCards.appendChild(cardContainer);
                }
            });
        }

        return;
    }

    if (timeSpace < totalTime) {
        setTimeout(moveText, increment);
    }
}

moveText();

