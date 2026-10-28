/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0b0e",
        surface: {
          50: "#181b22",
          100: "#14161c",
          200: "#0f1116",
          300: "#0b0c10",
        },
        border: {
          subtle: "#1f232d",
          default: "#2a2f3d",
          highlight: "#3d4457",
        },
        gold: {
          300: "#f6e09e",
          400: "#e6c364",
          500: "#d4af37",
          600: "#aa8822",
        },
        vermilion: {
          400: "#ff6b6b",
          500: "#e63946",
          600: "#c52233",
        },
        accent: {
          blue: "#3b82f6",
          emerald: "#10b981",
          amber: "#f59e0b",
          purple: "#8b5cf6",
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px -3px rgba(212, 175, 55, 0.25)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.25)',
        'glow-vermilion': '0 0 20px -3px rgba(230, 57, 70, 0.25)',
      }
    },
  },
  plugins: [],
};
