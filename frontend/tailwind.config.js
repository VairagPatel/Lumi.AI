/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00E5A0",
        secondary: "#00C4CC",
        dark: "#0D1B2A",
        light: "#F9FAFB",
        muted: "#F3F4F6",
      },
    },
  },
  darkMode: "class", // 🔹 enable dark mode via class
  plugins: [],
};
