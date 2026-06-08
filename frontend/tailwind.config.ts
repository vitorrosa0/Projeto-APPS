import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sjpa: {
          DEFAULT: "#2DB38B",
          dark:    "#25967A",
          light:   "#3FCDA0",
        },
      },
    },
  },
  plugins: [],
};

export default config;