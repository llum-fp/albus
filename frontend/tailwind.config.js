import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: "#334155",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#334155",
          "primary-content": "#ffffff",
          secondary: "#64748b",
          accent: "#f59e0b",
          neutral: "#334155",
          "base-100": "#ffffff",
          "base-200": "#f1f5f9",
          "base-300": "#e2e8f0",
          "base-content": "#0f172a",
        },
      },
      {
        dark: {
          primary: "#94a3b8",
          "primary-content": "#0f172a",
          secondary: "#64748b",
          accent: "#f59e0b",
          neutral: "#1e293b",
          "base-100": "#1e293b",
          "base-200": "#0f172a",
          "base-300": "#334155",
          "base-content": "#f1f5f9",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
  },
};
