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
    const speedValue = document.getElementById("speedValue");

    let selectionOrder = [];

    selectedLimit.value = limitSelect.value || "37";

    const initialSliderVal = parseInt(speedSlider.value) || 4;
    const initialSpeedMs = Math.max(
        250,
        Math.min(1250, 1250 - (initialSliderVal - 1) * (1000 / 9)),
    );
    selectedSpeed.value = Math.round(initialSpeedMs);

    if (speedValue) {
        if (initialSliderVal <= 3) {
            speedValue.textContent = "Slow";
        } else if (initialSliderVal <= 6) {
            speedValue.textContent = "Medium";
        } else {
            speedValue.textContent = "Fast";
        }
    }

    function updateCheckboxesState() {
        const selectedCount = parseInt(botCountSelect.value);

        if (!selectedCount) {
            botCheckboxes.forEach((cb) => {
                cb.disabled = true;
            });
            return;
        }

        botCheckboxes.forEach((cb) => {
            cb.disabled = false;
        });
    }

    botCountSelect.addEventListener("change", function () {
        const count = parseInt(this.value);
        selectedBotCount.value = count || "";

        selectionOrder = [];

        botCheckboxes.forEach((cb) => {
            cb.checked = false;
            cb.disabled = !count;
        });
    });

    botCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            const selectedCount = parseInt(botCountSelect.value);
            const totalBots = botCheckboxes.length;

            if (!selectedCount) {
                this.checked = false;
                alert("Please select number of bots first!");
                return;
            }

            if (this.checked) {
                selectionOrder = selectionOrder.filter((cb) => cb !== this);

                selectionOrder.push(this);

                while (
                    selectedCount !== totalBots &&
                    selectionOrder.length > selectedCount
                ) {
                    const oldest = selectionOrder.shift();
                    oldest.checked = false;
                }
            } else {
                selectionOrder = selectionOrder.filter((cb) => cb !== this);
            }

            console.log(
                "Selected:",
                selectionOrder.map((cb) => cb.value),
            );
        });
    });

    limitSelect.addEventListener("change", function () {
        selectedLimit.value = this.value;
        console.log("Limit updated to:", selectedLimit.value);
    });

    speedSlider.addEventListener("input", function () {
        const val = parseInt(this.value);

        const speedMs = Math.max(
            250,
            Math.min(1250, 1250 - (val - 1) * (1000 / 9)),
        );
        selectedSpeed.value = Math.round(speedMs);

        if (speedValue) {
            if (val <= 3) {
                speedValue.textContent = "Slow";
            } else if (val <= 6) {
                speedValue.textContent = "Medium";
            } else {
                speedValue.textContent = "Fast";
            }
        }

        console.log(
            "Speed updated to:",
            selectedSpeed.value,
            "ms (slider:",
            val,
            ")",
        );
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

        if (!limitSelect.value) {
            e.preventDefault();
            alert("Please select a target limit!");
            return;
        }

        selectedLimit.value = limitSelect.value;

        if (!selectedSpeed.value) {
            const sliderVal = parseInt(speedSlider.value);
            const speedMs = Math.max(
                250,
                Math.min(1250, 1250 - (sliderVal - 1) * (1000 / 9)),
            );
            selectedSpeed.value = Math.round(speedMs);
        }

        const selectedBots = [];
        botCheckboxes.forEach((cb) => {
            if (cb.checked) {
                selectedBots.push(cb.value);
            }
        });

        selectedBotsInput.value = JSON.stringify(selectedBots);

        console.log("=== FORM SUBMISSION ===");
        console.log("Selected Bots:", selectedBots);
        console.log("Selected Bots (JSON):", selectedBotsInput.value);
        console.log("Target Limit (select):", limitSelect.value);
        console.log("Target Limit (hidden):", selectedLimit.value);
        console.log("Speed slider value:", speedSlider.value);
        console.log("Speed (hidden):", selectedSpeed.value);
        console.log("=======================");
    });

    botCheckboxes.forEach((cb) => {
        cb.disabled = true;
    });
});
