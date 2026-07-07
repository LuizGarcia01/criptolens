import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        cl: {
          bg: "var(--bg)",
          surface: "var(--surface)",
          surface2: "var(--surface-2)",
          border: "var(--border)",
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          accent: "var(--accent)",
          "accent-glow": "var(--accent-glow)",
          positive: "var(--positive)",
          negative: "var(--negative)",
          instructor: "var(--instructor)",
          "instructor-bg": "var(--instructor-bg)",
          "instructor-border": "var(--instructor-border)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
