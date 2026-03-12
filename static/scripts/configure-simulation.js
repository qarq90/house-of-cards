document.addEventListener("DOMContentLoaded", function () {
    const botCountSelect = document.getElementById("botCount");
    const botCheckboxes = document.querySelectorAll('input[name="bot"]');
    const selectedBotCount = document.getElementById("selectedBotCount");
    const selectedBotsInput = document.getElementById("selectedBotsInput");
    const simulationForm = document.getElementById("simulationForm");
    const limitSelect = document.getElementById("limitSelect");
    const selectedLimit = document.getElementById("selectedLimit");
    const speedSlider = document.getElementById("speedSlider");
    const selectedSpeed = document.getElementById("selectedSpeed");

    function updateCheckboxesState() {
        const selectedCount = parseInt(botCountSelect.value);
        const checkedCount = document.querySelectorAll(
            'input[name="bot"]:checked',
        ).length;

        if (!selectedCount) {
            botCheckboxes.forEach((cb) => {
                cb.disabled = true;
            });
            return;
        }

        botCheckboxes.forEach((cb) => {
            cb.disabled = false;
        });

        if (checkedCount >= selectedCount) {
            botCheckboxes.forEach((cb) => {
                if (!cb.checked) {
                    cb.disabled = true;
                }
            });
        }
    }

    botCountSelect.addEventListener("change", function () {
        const count = parseInt(this.value);
        selectedBotCount.value = count || "";

        if (!count) {
            botCheckboxes.forEach((cb) => {
                cb.checked = false;
                cb.disabled = true;
            });
        } else {
            botCheckboxes.forEach((cb) => {
                cb.disabled = false;
            });
            updateCheckboxesState();
        }
    });

    botCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            const selectedCount = parseInt(botCountSelect.value);

            if (!selectedCount) {
                this.checked = false;
                alert("Please select number of bots first!");
                return;
            }

            const checkedCount = document.querySelectorAll(
                'input[name="bot"]:checked',
            ).length;

            if (checkedCount > selectedCount) {
                this.checked = false;
                alert(`You can only select ${selectedCount} bots!`);
            }

            updateCheckboxesState();
        });
    });

    limitSelect.addEventListener("change", function () {
        selectedLimit.value = this.value || "37";
    });

    speedSlider.addEventListener("input", function () {
        const val = parseInt(this.value);

        const speedMs = Math.max(50, Math.min(400, 400 - (val - 1) * 38.9));
        selectedSpeed.value = Math.round(speedMs);
    });

    simulationForm.addEventListener("submit", function (e) {
        const checkedCount = document.querySelectorAll(
            'input[name="bot"]:checked',
        ).length;
        const selectedCount = parseInt(botCountSelect.value);

        if (!selectedCount) {
            e.preventDefault();
            alert("Please select number of bots!");
            return;
        }

        if (checkedCount !== selectedCount) {
            e.preventDefault();
            alert(
                `Please select exactly ${selectedCount} bot${selectedCount > 1 ? "s" : ""}!`,
            );
            return;
        }

        const selectedBots = [];
        botCheckboxes.forEach((cb) => {
            if (cb.checked) {
                selectedBots.push(cb.value);
            }
        });

        selectedBotsInput.value = JSON.stringify(selectedBots);

        if (!limitSelect.value) {
            e.preventDefault();
            alert("Please select a target limit!");
            return;
        }

        console.log("Selected Bots:", selectedBots);
        console.log("Target Limit:", selectedLimit.value);
        console.log("Simulation Speed:", selectedSpeed.value);
    });

    selectedSpeed.value = "100";

    botCheckboxes.forEach((cb) => {
        cb.disabled = true;
    });
});
