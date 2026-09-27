import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF6F0",
        ink: "#2A2420",
        berry: {
          DEFAULT: "#7A2E43",
          light: "#9C4A5E",
          dark: "#54202E",
        },
        sage: {
          DEFAULT: "#7C8B6F",
          light: "#A6B598",
        },
        gold: "#B08D57",
        sand: "#EFE7DA",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
      maxWidth: {
        prose: "70ch",
      },
      boxShadow: {
        card: "0 1px 2px rgba(42,36,32,0.06), 0 8px 24px rgba(42,36,32,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
