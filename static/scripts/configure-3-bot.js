document.addEventListener("DOMContentLoaded", function () {
    const botRadios = document.querySelectorAll('input[name="bot"]');
    const selectedBotInput = document.getElementById("selectedBotInput");
    const pveForm = document.getElementById("pveForm");
    const playerNameInput = document.getElementById("playerName");
    const playerNameHidden = document.getElementById("playerNameInput");
    const avatarUpload = document.getElementById("avatarUpload");
    const avatarPreview = document.getElementById("avatarPreview");
    const playerAvatarInput = document.getElementById("playerAvatarInput");

    let currentAvatarData = "";
    let hasCustomAvatar = false;

    let selectedBotsQueue = [];
    const MAX_BOTS = 3;

    function updateAvatarStyling(isCustom) {
        if (isCustom) {
            avatarPreview.classList.add(
                "rounded-full",
                "border-4",
                "border-white",
                "shadow-lg",
            );
            avatarPreview.classList.remove(
                "rounded-none",
                "border-0",
                "shadow-none",
            );
        } else {
            avatarPreview.classList.remove(
                "rounded-full",
                "border-4",
                "border-white",
                "shadow-lg",
            );
            avatarPreview.classList.add(
                "rounded-none",
                "border-0",
                "shadow-none",
            );
        }
    }

    botRadios.forEach((radio) => {
        radio.addEventListener("click", function (e) {
            const botValue = this.value;

            if (this.checked) {
                if (!selectedBotsQueue.includes(botValue)) {
                    selectedBotsQueue.push(botValue);
                }

                if (selectedBotsQueue.length > MAX_BOTS) {
                    const removedBot = selectedBotsQueue.shift();

                    const oldRadio = document.querySelector(
                        `input[name="bot"][value="${removedBot}"]`,
                    );

                    if (oldRadio) {
                        oldRadio.checked = false;

                        const oldLabel = oldRadio.closest("label");
                        const oldImg = oldLabel?.querySelector(".bot-img");
                        if (oldImg) oldImg.classList.remove("selected");
                    }

                    console.log(`Removed oldest bot: ${removedBot}`);
                }
            } else {
                selectedBotsQueue = selectedBotsQueue.filter(
                    (b) => b !== botValue,
                );
            }

            document.querySelectorAll(".bot-img").forEach((img) => {
                img.classList.remove("selected");
            });

            selectedBotsQueue.forEach((bot) => {
                const r = document.querySelector(
                    `input[name="bot"][value="${bot}"]`,
                );
                const img = r?.closest("label")?.querySelector(".bot-img");
                if (img) img.classList.add("selected");
            });

            selectedBotInput.value = selectedBotsQueue.join(",");

            console.log("Selected bots:", selectedBotsQueue);
        });
    });

    const initialChecked = document.querySelector('input[name="bot"]:checked');
    if (initialChecked) {
        const initialLabel = initialChecked.closest("label");
        if (initialLabel) {
            const initialImg = initialLabel.querySelector(".bot-img");
            if (initialImg) {
                initialImg.classList.add();
            }
        }
    }

    avatarUpload.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            if (
                !file.type.match("image/jpeg") &&
                !file.type.match("image/png") &&
                !file.type.match("image/jpg") &&
                !file.type.match("image/webp") &&
                !file.type.match("image/gif")
            ) {
                alert(
                    "Please select a valid image file (JPEG, PNG, WEBP, GIF)",
                );
                avatarUpload.value = "";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("Image size must be less than 5MB");
                avatarUpload.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onload = function (evt) {
                const base64Data = evt.target.result;

                avatarPreview.src = base64Data;

                hasCustomAvatar = true;
                updateAvatarStyling(true);

                currentAvatarData = base64Data;
                playerAvatarInput.value = base64Data;

                avatarPreview.style.transform = "scale(1.05)";
                setTimeout(() => {
                    avatarPreview.style.transform = "scale(1)";
                }, 200);
            };
            reader.onerror = function () {
                alert("Error reading file. Please try again.");
                resetToDefaultAvatar();
            };
            reader.readAsDataURL(file);
        } else {
            if (!hasCustomAvatar) {
                resetToDefaultAvatar();
            }
        }
    });

    function resetToDefaultAvatar() {
        const defaultSrc = "/static/icons/z_color_player.png";
        avatarPreview.src = defaultSrc;
        hasCustomAvatar = false;
        currentAvatarData = "";
        playerAvatarInput.value = "";
        updateAvatarStyling(false);
    }

    avatarPreview.onerror = function () {
        this.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%234a5b4a'/%3E%3Ctext x='50' y='67' font-size='40' text-anchor='middle' fill='%23e6c97e'%3E🎴%3C/text%3E%3C/svg%3E";
        hasCustomAvatar = false;
        updateAvatarStyling(false);
    };

    playerNameInput.addEventListener("input", function () {
        playerNameHidden.value = this.value.trim();
    });

    pveForm.addEventListener("submit", function (e) {
        const selectedBot = document.querySelector('input[name="bot"]:checked');
        const playerName = playerNameInput.value.trim();

        if (selectedBotsQueue.length === 0) {
            e.preventDefault();
            alert("Please select a bot to play against!");
            return;
        }

        if (!playerName) {
            e.preventDefault();
            alert("Please enter your name!");
            return;
        }

        playerNameHidden.value = playerName;
        selectedBotInput.value = selectedBotsQueue.join(",");

        if (hasCustomAvatar && currentAvatarData) {
            playerAvatarInput.value = currentAvatarData;
        } else {
            playerAvatarInput.value = "";
        }
    });

    playerNameHidden.value = playerNameInput.value || "";

    updateAvatarStyling(false);

    const uploadLabel = document.querySelector('label[for="avatarUpload"]');
    if (uploadLabel) {
        uploadLabel.addEventListener("mouseenter", () => {
            uploadLabel.style.transform = "scale(1.1)";
        });
        uploadLabel.addEventListener("mouseleave", () => {
            uploadLabel.style.transform = "scale(1)";
        });
    }
});
