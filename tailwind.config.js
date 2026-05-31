/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F6F1E7",
        sand: "#EFE6D2",
        sage: {
          50: "#EEF1EA",
          100: "#DCE4D2",
          300: "#A8B89A",
          500: "#7C8C6C",
          700: "#56654A",
          900: "#2C3526",
        },
        terracotta: {
          300: "#E2A58A",
          500: "#C97B5A",
          700: "#9C5638",
          900: "#5C2E1B",
        },
        ink: {
          DEFAULT: "#1F2421",
          soft: "#3A3F3A",
          mute: "#6B6F69",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "Lato", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(44, 53, 38, 0.15)",
        ring: "0 0 0 1px rgba(44, 53, 38, 0.08)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};
