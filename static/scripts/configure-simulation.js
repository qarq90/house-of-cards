document
    .getElementById("simulationForm")
    .addEventListener("submit", function (e) {
        const botCount = document.getElementById("botCount").value;
        const checkedBots = Array.from(
            document.querySelectorAll(".bot-option input:checked"),
        ).map((cb) => cb.value);

        if (!botCount) {
            alert("Please select number of bots.");
            e.preventDefault();
            return;
        }

        if (checkedBots.length !== parseInt(botCount)) {
            alert(`Please select exactly ${botCount} bots.`);
            e.preventDefault();
            return;
        }

        document.getElementById("selectedBotCount").value = botCount;
        document.getElementById("selectedBotsInput").value =
            JSON.stringify(checkedBots);
    });
