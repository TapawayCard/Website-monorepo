import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TapAway brand
        navy: {
          950: "#050914",
          900: "#0a1024",
          800: "#101a3a",
          700: "#17264f",
          600: "#1f3468",
        },
        brand: {
          // cream ring accent from the logo
          cream: "#e7e2c9",
          sand: "#d9d2ad",
          // NFC signal blue
          blue: "#2b7fb8",
          sky: "#54b3e6",
          ice: "#a9dcff",
        },
      },
      fontFamily: {
        sans: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseRing: "pulseRing 3s ease-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
