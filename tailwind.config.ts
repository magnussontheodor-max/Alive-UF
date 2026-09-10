import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0D12",
          900: "#12141B",
          800: "#1B1E28",
          700: "#282C3A",
          600: "#3A3F52",
          500: "#565C73",
          400: "#7A8099",
          300: "#A4A9BD",
          200: "#CDD0DE",
          100: "#E6E8EF",
          50: "#F5F6FA",
        },
        paper: "#FAFAF8",
        accent: {
          50: "#EEF1FF",
          100: "#DFE4FF",
          200: "#C0C8FF",
          300: "#9CA8FF",
          400: "#7482FA",
          500: "#5B67E8",
          600: "#4750CC",
          700: "#3A41A6",
          800: "#2E3480",
          900: "#252A63",
        },
        good: {
          50: "#EEF9F1",
          500: "#2F9E5C",
          600: "#22824A",
        },
        warn: {
          50: "#FDF6EC",
          500: "#C98A2C",
          600: "#A5701F",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 18, 27, 0.04), 0 1px 1px rgba(16,18,27,0.03)",
        panel: "0 4px 16px rgba(16, 18, 27, 0.06), 0 1px 2px rgba(16,18,27,0.04)",
        pop: "0 12px 32px rgba(16, 18, 27, 0.12), 0 2px 6px rgba(16,18,27,0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out both",
        pulseSoft: "pulseSoft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
