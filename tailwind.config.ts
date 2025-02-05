import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#BEFF1B",
        black: "#212121",
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "#FFFFFF",
        grey: "#C8C8C8",
        lightGrey: "#383838",
        red: "#D93438",
        darkBlack: "#171717",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
