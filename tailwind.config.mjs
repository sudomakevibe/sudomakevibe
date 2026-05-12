/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "monospace"],
      },
      colors: {
        primary: "var(--bg-primary)",
        secondary: "var(--text-secondary)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        theme: "var(--border)",
      },
      backgroundColor: {
        primary: "var(--bg-primary)",
        card: "var(--bg-card)",
        code: "var(--code-bg)",
      },
      borderColor: {
        theme: "var(--border)",
      },
      textColor: {
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        accent: "var(--accent)",
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: "'JetBrains Mono', monospace",
            color: "var(--text-primary)",
            a: {
              color: "var(--accent)",
              "&:hover": {
                color: "var(--accent-hover)",
              },
            },
            h1: { color: "var(--accent)" },
            h2: { color: "var(--accent)" },
            h3: { color: "var(--text-secondary)" },
            strong: { color: "var(--text-primary)" },
            blockquote: {
              color: "var(--text-secondary)",
              borderLeftColor: "var(--accent)",
            },
            hr: { borderColor: "var(--border)" },
            "thead th": { color: "var(--text-secondary)" },
            "tbody tr": { borderBottomColor: "var(--border)" },
            code: {
              color: "var(--code-text)",
              backgroundColor: "var(--code-bg)",
              borderRadius: "4px",
              padding: "0.1em 0.4em",
              fontWeight: "400",
              "&::before": { content: '""' },
              "&::after": { content: '""' },
            },
            pre: {
              backgroundColor: "var(--code-bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--code-text)",
            },
            "pre code": {
              backgroundColor: "transparent",
              color: "var(--code-text)",
              padding: "0",
              fontWeight: "400",
              "&::before": { content: '""' },
              "&::after": { content: '""' },
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
