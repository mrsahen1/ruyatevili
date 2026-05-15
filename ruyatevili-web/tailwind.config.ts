import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gece teması — derin gece mavisi, altın aksanlar
        night: {
          50:  "#f5f7fc",
          100: "#e8eef7",
          200: "#cad8eb",
          300: "#9fb6d6",
          400: "#6d8dba",
          500: "#496fa0",
          600: "#385785",
          700: "#2d456a",
          800: "#1e2f4a",
          900: "#0f1a2e",
          950: "#070d1a",
        },
        gold: {
          50:  "#fdfaf0",
          100: "#faf3d8",
          200: "#f3e1a3",
          300: "#ebc967",
          400: "#e2b042",
          500: "#cf942a",
          600: "#a87021",
          700: "#7d521d",
          800: "#523619",
          900: "#2b1d10",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Cormorant Garamond", "Georgia", "serif"],
      },
      backgroundImage: {
        "stars": "radial-gradient(2px 2px at 20px 30px, rgba(235,201,103,0.3), transparent), radial-gradient(2px 2px at 60px 70px, rgba(235,201,103,0.2), transparent), radial-gradient(1px 1px at 100px 40px, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 130px 80px, rgba(235,201,103,0.3), transparent), radial-gradient(2px 2px at 170px 20px, rgba(255,255,255,0.3), transparent)",
        "night-gradient": "linear-gradient(180deg, #070d1a 0%, #0f1a2e 50%, #1e2f4a 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "twinkle": "twinkle 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
