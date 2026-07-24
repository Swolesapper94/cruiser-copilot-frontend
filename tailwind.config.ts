import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        shop: {
          void: "#07080A",
          deep: "#0B0D10",
          panel: "#12151A",
          raised: "#181C22",
          line: "#242A32",
          muted: "#8A94A2",
          text: "#E6EAF0",
        },
        practical: {
          DEFAULT: "#F2A93B",
          dim: "#8A6220",
        },
        technical: {
          DEFAULT: "#5AD2E6",
          dim: "#1F5A66",
        },
        oem: {
          DEFAULT: "#5AD2E6",
        },
        community: {
          DEFAULT: "#C58BF2",
        },
        caution: {
          DEFAULT: "#FFB84D",
        },
        danger: {
          DEFAULT: "#FF6B6B",
        },
        confirm: {
          DEFAULT: "#5BE49B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 20px 40px -24px rgba(0,0,0,0.9)",
        focusRing: "0 0 0 2px #0B0D10, 0 0 0 4px #5AD2E6",
      },
      backgroundImage: {
        "shop-floor":
          "radial-gradient(120% 80% at 50% 0%, rgba(242,169,59,0.10) 0%, rgba(7,8,10,0) 60%), radial-gradient(80% 60% at 80% 100%, rgba(90,210,230,0.08) 0%, rgba(7,8,10,0) 60%)",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        scanline: "scanline 6s linear infinite",
        pulseSoft: "pulseSoft 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
