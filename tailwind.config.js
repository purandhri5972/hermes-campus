/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0B0F19",
        card: "#151D2E",
        border: "#1F293D",
        primary: "#6366F1",
        emerald: "#10B981",
        amber: "#F59E0B",
        red: "#EF4444",
      },
    },
  },
  plugins: [],
};
