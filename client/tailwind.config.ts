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
        contentFont: '#444444',
      },
      fontSize: {
        '15px': '15px',
        '13px': '13px',
      },
    },
  },
  plugins: [],
};
export default config;
