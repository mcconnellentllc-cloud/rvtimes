import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1f6f54",
          dark: "#164d3a",
          light: "#2e9d78",
        },
      },
    },
  },
  plugins: [],
};

export default config;
