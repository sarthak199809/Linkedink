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
        background: "#F5F0E8",
        primary: "#000000",
        accent: "#FFE500",
        danger: "#FF3B30",
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        brutal: "4px 4px 0px #000000",
        "brutal-hover": "6px 6px 0px #000000",
      },
    },
  },
  plugins: [],
};
export default config;
