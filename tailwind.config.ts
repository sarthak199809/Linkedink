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
        primary: {
          DEFAULT: "#4A90D9",
          light: "#EBF3FC",
          dark: "#2D6CB5",
        },
        accent: {
          DEFAULT: "#F97316",
          light: "#FFF7ED",
        },
        background: "#F8FAFD",
        surface: "#FFFFFF",
        heading: "#1A1A2E",
        body: "#64748B",
        muted: "#94A3B8",
        border: "#E2E8F0",
        danger: "#EF4444",
        success: "#22C55E",
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "xl": "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 10px 25px rgba(74, 144, 217, 0.1), 0 4px 10px rgba(0, 0, 0, 0.04)",
        "btn": "0 2px 8px rgba(74, 144, 217, 0.3)",
        "btn-hover": "0 4px 16px rgba(74, 144, 217, 0.4)",
        glow: "0 0 30px rgba(74, 144, 217, 0.15)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(74, 144, 217, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(74, 144, 217, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
