const timerIndicator = document.getElementById("timer-indicator");
const timerIndicatorBG = document.getElementById("timer-indicator-bg");
let timeSpace = 0;
let isStart = false;
let gameStarted = false;
let playerTurn = true;
let timerInterval = null;

const totalTime = 5000; // Increased to 5 seconds for gameplay

let playerHandCardsElements = [];
let botHandCardsElements = [];
let playerCards = [];
let botCards = [];
let playerHandIndices = [];
let botHandIndices = [];

// Game state variables
let playerScore = 0;
let botScore = 0;

function startGame() {
    gameStarted = true;
    playerTurn = true;

    // Initialize cards
    const playerCardsElements = document.getElementsByClassName("player-cards");
    const botCardsElements = document.getElementsByClassName("bot-cards");

    // Store original cards
    playerCards = Array.from(playerCardsElements).map((card) => ({
        element: card,
        img: card.querySelector("img"),
        used: false,
    }));

    botCards = Array.from(botCardsElements).map((card) => ({
        element: card,
        img: card.querySelector("img"),
        used: false,
    }));

    // Setup initial hand
    setupInitialHand();

    // Start first turn
    startTurn();
}

function setupInitialHand() {
    const playerHandCards = document.getElementById("player-hand-cards");
    const botHandCards = document.getElementById("bot-hand-cards");

    // Clear existing hand cards
    playerHandCards.innerHTML = "";
    botHandCards.innerHTML = "";

    // Get random indices for player hand
    playerHandIndices = getRandomIndices(2, playerCards.length);

    // Create player hand cards
    playerHandIndices.forEach((index, i) => {
        const originalCard = playerCards[index];
        const cardContainer = document.createElement("button");
        cardContainer.className =
            "player-current-card mb-3 flex flex-col items-center";
        cardContainer.dataset.cardIndex = index;

        const img = document.createElement("img");
        img.src = originalCard.img.src;
        img.alt = originalCard.img.alt || `hand-card-${i + 1}`;
        img.className =
            "w-[170.666px] h-[238.666px] cursor-pointer hover:scale-105 transition-transform";

        // Copy data attributes
        const dataAttributes = originalCard.img.dataset;
        Object.keys(dataAttributes).forEach((key) => {
            img.dataset[key] = dataAttributes[key];
        });

        img.addEventListener("click", function () {
            if (playerTurn && gameStarted) {
                playCard(this, true);
            }
        });

        cardContainer.appendChild(img);
        playerHandCards.appendChild(cardContainer);
        playerHandCardsElements.push(cardContainer);
    });

    // Get random indices for bot hand
    botHandIndices = getRandomIndices(2, botCards.length);

    // Create bot hand cards (face down)
    botHandIndices.forEach((index, i) => {
        const cardContainer = document.createElement("div");
        cardContainer.className =
            "bot-current-card mt-3 flex flex-col absoulte items-center";
        cardContainer.dataset.cardIndex = index;

        const botImg = document.createElement("img");
        botImg.src = "../../../../../../static/cards/z_base_card.png";
        botImg.alt = "Bot Card Back";
        botImg.className =
            "rotate-180 w-[170.666px] h-[238.666px] cursor-not-allowed opacity-90";

        // Store actual card data
        const originalBotCard = botCards[index];
        botImg.dataset.actualSrc = originalBotCard.img.src;
        botImg.dataset.cardId = originalBotCard.img.dataset.cardId;
        botImg.dataset.cardName = originalBotCard.img.dataset.cardName;
        botImg.dataset.cardHouse = originalBotCard.img.dataset.cardHouse;
        botImg.dataset.cardValue = originalBotCard.img.dataset.cardValue;

        cardContainer.appendChild(botImg);
        botHandCards.appendChild(cardContainer);
        botHandCardsElements.push(cardContainer);
    });
}

function startTurn() {
    resetTimer();

    if (playerTurn) {
        // Player's turn - start timer
        startTimer();
        console.log("Player's turn");
    } else {
        // Bot's turn - wait 1 second then play
        startTimer();
        console.log("Bot's turn");
        setTimeout(() => {
            botPlayCard();
        }, 1000);
    }
}

function resetTimer() {
    timeSpace = 0;
    timerIndicator.style.width = "0px";

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function startTimer() {
    const maxWidth = timerIndicatorBG.offsetWidth;
    const increment = 50;

    timerInterval = setInterval(() => {
        timeSpace += increment;
        const percentage = Math.min(timeSpace / totalTime, 1);
        timerIndicator.style.width = percentage * maxWidth + "px";

        if (timeSpace >= totalTime) {
            // Time's up!
            clearInterval(timerInterval);
            timerInterval = null;

            if (playerTurn) {
                // Player didn't play in time - auto play random card
                autoPlayRandomCard();
            }
        }
    }, increment);
}

function playCard(cardElement, isPlayer) {
    if (!gameStarted) return;

    // Stop timer if it's player's turn
    if (isPlayer && timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Get card data
    const cardData = {
        id: cardElement.dataset.cardId,
        name: cardElement.dataset.cardName,
        house: cardElement.dataset.cardHouse,
        value: parseInt(cardElement.dataset.cardValue) || 0,
        index: cardElement.parentElement.dataset.cardIndex,
    };

    console.log(`${isPlayer ? "Player" : "Bot"} played:`, cardData);

    // Update scores
    if (isPlayer) {
        playerScore += cardData.value;
        updateScoreDisplay();

        // Mark player card as used
        const cardIndex = parseInt(cardData.index);
        playerCards[cardIndex].used = true;

        // Remove card from hand
        const handCardIndex = playerHandIndices.indexOf(cardIndex);
        if (handCardIndex > -1) {
            playerHandIndices.splice(handCardIndex, 1);
            playerHandCardsElements[handCardIndex].remove();
            playerHandCardsElements.splice(handCardIndex, 1);
        }

        // Draw new card if available
        drawNewPlayerCard();
    } else {
        botScore += cardData.value;
        updateScoreDisplay();

        // Mark bot card as used
        const cardIndex = parseInt(cardData.index);
        botCards[cardIndex].used = true;

        // Remove card from hand
        const handCardIndex = botHandIndices.indexOf(cardIndex);
        if (handCardIndex > -1) {
            botHandIndices.splice(handCardIndex, 1);
            botHandCardsElements[handCardIndex].remove();
            botHandCardsElements.splice(handCardIndex, 1);
        }

        // Draw new bot card
        drawNewBotCard();
    }

    // Show card animation in middle
    animateCardPlay(cardElement, isPlayer);

    // Check for game end
    if (checkGameEnd()) {
        endGame();
        return;
    }

    // Switch turns
    playerTurn = !playerTurn;

    // Start next turn after delay
    setTimeout(() => {
        startTurn();
    }, 1500);
}

function autoPlayRandomCard() {
    if (!playerTurn || playerHandCardsElements.length === 0) return;

    // Select random card from player's hand
    const randomIndex = Math.floor(
        Math.random() * playerHandCardsElements.length,
    );
    const randomCard = playerHandCardsElements[randomIndex];
    const cardElement = randomCard.querySelector("img");

    console.log("Auto-playing random card");
    playCard(cardElement, true);
}

function botPlayCard() {
    if (playerTurn || botHandCardsElements.length === 0) return;

    // Bot logic: play random card from hand
    const randomIndex = Math.floor(Math.random() * botHandCardsElements.length);
    const randomCard = botHandCardsElements[randomIndex];
    const cardElement = randomCard.querySelector("img");

    // Flip card to show before playing
    const originalCard = botCards[parseInt(randomCard.dataset.cardIndex)];
    cardElement.src = originalCard.img.src;
    cardElement.className = "w-[170.666px] h-[238.666px] rotate-180";

    // Wait a moment to show the card, then play it
    setTimeout(() => {
        playCard(cardElement, false);
    }, 1000);
}

function drawNewPlayerCard() {
    // Find available player cards
    const availableCards = playerCards
        .map((card, index) => ({ card, index }))
        .filter(
            ({ card }) => !card.used && !playerHandIndices.includes(card.index),
        );

    if (availableCards.length > 0 && playerHandIndices.length < 2) {
        // Draw random new card
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const newCard = availableCards[randomIndex];

        playerHandIndices.push(newCard.index);

        // Add to hand
        const playerHandCards = document.getElementById("player-hand-cards");
        const cardContainer = document.createElement("button");
        cardContainer.className =
            "player-current-card flex flex-col items-center";
        cardContainer.dataset.cardIndex = newCard.index;

        const img = document.createElement("img");
        img.src = newCard.card.img.src;
        img.alt =
            newCard.card.img.alt || `hand-card-${playerHandIndices.length}`;
        img.className =
            "w-[170.666px] h-[238.666px] cursor-pointer hover:scale-105 transition-transform";

        // Copy data attributes
        const dataAttributes = newCard.card.img.dataset;
        Object.keys(dataAttributes).forEach((key) => {
            img.dataset[key] = dataAttributes[key];
        });

        img.addEventListener("click", function () {
            if (playerTurn && gameStarted) {
                playCard(this, true);
            }
        });

        cardContainer.appendChild(img);
        playerHandCards.appendChild(cardContainer);
        playerHandCardsElements.push(cardContainer);

        updatePlayerCardsCount();
    }
}

function drawNewBotCard() {
    // Find available bot cards
    const availableCards = botCards
        .map((card, index) => ({ card, index }))
        .filter(
            ({ card }) => !card.used && !botHandIndices.includes(card.index),
        );

    if (availableCards.length > 0 && botHandIndices.length < 2) {
        // Draw random new card
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const newCard = availableCards[randomIndex];

        botHandIndices.push(newCard.index);

        // Add to hand (face down)
        const botHandCards = document.getElementById("bot-hand-cards");
        const cardContainer = document.createElement("div");
        cardContainer.className = "bot-current-card flex flex-col items-center";
        cardContainer.dataset.cardIndex = newCard.index;

        const botImg = document.createElement("img");
        botImg.src = "../../../../../../static/cards/z_base_card.png";
        botImg.alt = "Bot Card Back";
        botImg.className =
            "rotate-180 w-[170.666px] h-[238.666px] cursor-not-allowed opacity-90";

        // Store actual card data
        botImg.dataset.actualSrc = newCard.card.img.src;
        botImg.dataset.cardId = newCard.card.img.dataset.cardId;
        botImg.dataset.cardName = newCard.card.img.dataset.cardName;
        botImg.dataset.cardHouse = newCard.card.img.dataset.cardHouse;
        botImg.dataset.cardValue = newCard.card.img.dataset.cardValue;

        cardContainer.appendChild(botImg);
        botHandCards.appendChild(cardContainer);
        botHandCardsElements.push(cardContainer);

        updateBotCardsCount();
    }
}

function animateCardPlay(cardElement, isPlayer) {
    // Create flying card animation
    const animatedCard = document.createElement("img");
    animatedCard.src = cardElement.src;
    animatedCard.className = `fixed w-[85.333px] h-[119.333px] z-[999999] transition-all duration-500 ${
        isPlayer ? "rotate-0" : "rotate-180"
    }`;

    // Start position (from hand)
    const startX = isPlayer ? window.innerWidth / 2 : window.innerWidth / 2;
    const startY = isPlayer ? window.innerHeight - 150 : 150;

    animatedCard.style.left = `${startX}px`;
    animatedCard.style.top = `${startY}px`;

    document.body.appendChild(animatedCard);

    // Animate to center
    setTimeout(() => {
        animatedCard.style.left = `${window.innerWidth / 2 - 42.666}px`;
        animatedCard.style.top = `${window.innerHeight / 2 - 59.666}px`;

        // Remove after animation
        setTimeout(() => {
            animatedCard.remove();
        }, 500);
    }, 10);
}

function updatePlayerCardsCount() {
    const playerCardsCountElement = document.querySelector(
        "#player-cards-stack .harry-potter.heading",
    );
    if (playerCardsCountElement) {
        const remainingCards = playerCards.filter((card) => !card.used).length;
        playerCardsCountElement.textContent = `${remainingCards} left`;
    }
}

function updateBotCardsCount() {
    const botCardsCountElement = document.querySelector(
        "#bots-cards-stack .harry-potter.heading",
    );
    if (botCardsCountElement) {
        const remainingCards = botCards.filter((card) => !card.used).length;
        botCardsCountElement.textContent = `${remainingCards} left`;
    }
}

function checkGameEnd() {
    // Check if either player has reached 20+ or both have no cards left
    if (playerScore >= 20 || botScore >= 20) {
        return true;
    }

    // Check if both players have played all cards
    const playerCardsLeft = playerCards.filter((card) => !card.used).length;
    const botCardsLeft = botCards.filter((card) => !card.used).length;

    if (playerCardsLeft === 0 && botCardsLeft === 0) {
        return true;
    }

    return false;
}

function endGame() {
    // gameStarted = false;
    // clearInterval(timerInterval);
    // // Determine winner
    // let winnerMessage = "";
    // if (playerScore >= 20 && botScore >= 20) {
    //     winnerMessage = "It's a tie!";
    // } else if (playerScore >= 20) {
    //     winnerMessage = "Player wins!";
    // } else if (botScore >= 20) {
    //     winnerMessage = "Bot wins!";
    // } else if (playerScore > botScore) {
    //     winnerMessage = "Player wins!";
    // } else if (botScore > playerScore) {
    //     winnerMessage = "Bot wins!";
    // } else {
    //     winnerMessage = "It's a tie!";
    // }
    // alert(
    //     `Game Over!\nPlayer: ${playerScore} | Bot: ${botScore}\n${winnerMessage}`,
    // );
    // // Optionally reset game or redirect
    // setTimeout(() => {
    //     location.reload();
    // }, 3000);
}

function getRandomIndices(count, max) {
    const indices = new Set();
    while (indices.size < count && indices.size < max) {
        indices.add(Math.floor(Math.random() * max));
    }
    return Array.from(indices);
}

// Initialize game after timer completes
function moveText() {
    const increment = 50;
    const maxWidth = timerIndicatorBG.offsetWidth;

    timeSpace += increment;
    const percentage = Math.min(timeSpace / totalTime, 1);
    timerIndicator.style.width = percentage * maxWidth + "px";

    if (timeSpace >= totalTime && !isStart) {
        isStart = true;

        // Hide initial card displays
        const playerCardsElements =
            document.getElementsByClassName("player-cards");
        const botCardsElements = document.getElementsByClassName("bot-cards");

        Array.from(playerCardsElements).forEach((card) => {
            card.style.display = "none";
        });

        Array.from(botCardsElements).forEach((card) => {
            card.style.display = "none";
        });

        // Show game elements
        document.getElementById("bot").style.display = "flex";
        document.getElementById("player").style.display = "flex";
        document.getElementById("player-deck").style.display = "flex";
        document.getElementById("bot-deck").style.display = "flex";
        document.getElementById("bot-hand-cards").style.display = "flex";
        document.getElementById("player-hand-cards").style.display = "flex";

        // Start the actual game
        startGame();
        return;
    }

    if (timeSpace < totalTime) {
        setTimeout(moveText, increment);
    }
}

moveText();

// -----------------------------------------------------------------------

function updateScoreDisplay() {
    const currentScore = document.getElementById("currentValue");

    if (currentScore) currentScore.textContent = playerScore + botScore;
    console.log(`Scores - Player: ${playerScore}, Bot: ${botScore}`);
}
