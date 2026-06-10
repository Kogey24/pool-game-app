import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        felt: {
          DEFAULT: "#1A472A",
          dark: "#0D2B19",
        },
        accent: {
          green: "#1D9E75",
          lime: "#9FE1CB",
          amber: "#F59E0B",
          red: "#EF4444",
        },
        surface: {
          base: "#0A0F0A",
          DEFAULT: "#111811",
          card: "#182018",
        },
      },
      boxShadow: {
        ball: "inset -3px -3px 6px rgba(0,0,0,0.4), inset 2px 2px 4px rgba(255,255,255,0.25), 2px 4px 8px rgba(0,0,0,0.5)",
        "ball-current":
          "0 0 0 3px #fff, 0 0 0 6px #1D9E75, 0 4px 16px rgba(29,158,117,0.4)",
        turn: "0 0 0 1px #1D9E75, 0 4px 20px rgba(29,158,117,0.15)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
