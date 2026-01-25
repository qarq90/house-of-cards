/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html", // Scan HTML templates
    "./static/**/*.js", // Scan JS files
    "./static/**/*.css", // Scan CSS files
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        ac: "var(--ac)",

        gf: "var(--gf)",
        hf: "var(--hf)",
        rn: "var(--rn)",
        sl: "var(--sl)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // Add the Typography Plugin
    "prettier-plugin-tailwindcss", // Keep the Prettier plugin
  ],
};
