document.addEventListener("DOMContentLoaded", () => {
    const corners = [
        ["top-4", "left-4"],
        ["top-4", "right-4"],
        ["bottom-4", "left-4"],
        ["bottom-4", "right-4"],
    ];

    const icons = [
        document.getElementById("crookshanks"),
        document.getElementById("dobby"),
        document.getElementById("hedwig"),
        document.getElementById("trevor"),
    ];

    for (let i = corners.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [corners[i], corners[j]] = [corners[j], corners[i]];
    }

    icons.forEach((icon, index) => {
        const [vertical, horizontal] = corners[index];
        icon.classList.add(vertical, horizontal);
    });
});
