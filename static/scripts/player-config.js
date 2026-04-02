document.addEventListener("DOMContentLoaded", function () {
    const avatarUpload = document.getElementById("avatarUpload");
    const avatarPreview = document.getElementById("avatarPreview");
    const playerNameInput = document.getElementById("playerName");
    const form = document.getElementById("pveForm");
    const avatarInputHidden = document.getElementById("avatarInputHidden");

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

    updateAvatarStyling(false);

    avatarUpload.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            avatarUpload.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be less than 5MB.");
            avatarUpload.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = function (evt) {
            avatarPreview.src = evt.target.result;

            avatarInputHidden.value = evt.target.result;

            updateAvatarStyling(true);

            avatarPreview.style.transform = "scale(1.05)";
            setTimeout(() => {
                avatarPreview.style.transform = "scale(1)";
            }, 200);
        };

        reader.readAsDataURL(file);
    });

    avatarPreview.onerror = function () {
        avatarPreview.src = "/static/icons/z_color_player.png";
        updateAvatarStyling(false);
    };

    form.addEventListener("submit", function (e) {
        const name = playerNameInput.value.trim();

        if (!name) {
            e.preventDefault();
            alert("Please enter your name!");
            return;
        }

        if (!avatarInputHidden.value) {
            avatarInputHidden.value = "/static/icons/z_color_player.png";
        }
    });
});
