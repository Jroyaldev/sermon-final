import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'card-bg-featured': '#F4D8CD', // Muted Terracotta/Peach
        'card-bg-next': '#D5E8D6',     // Muted Sage Green
        'card-bg-soon-1': '#EDE4D4',  // Warm Beige/Sand
        'card-bg-soon-2': '#DEE7F0',   // Cool Muted Grey
        'card-bg-active': 'hsl(var(--card))',
        'card-fg-on-featured': '#4D3B32', // Dark Brown
        'card-fg-on-next': '#2C402D',     // Dark Green
        'card-fg-on-soon-1': '#4F4639',   // Dark Brown
        'card-fg-on-soon-2': '#303A42',   // Dark Blue/Grey
        'card-fg-active': 'hsl(var(--card-foreground))',
        'dark-card-bg-featured': '#4D3B32',
        'dark-card-bg-next': '#2C402D',
        'dark-card-bg-soon-1': '#4F4639',
        'dark-card-bg-soon-2': '#303A42',
        'dark-card-bg-active': 'hsl(var(--card))',
        'dark-card-fg-on-featured': '#F4D8CD',
        'dark-card-fg-on-next': '#D5E8D6',
        'dark-card-fg-on-soon-1': '#EDE4D4',
        'dark-card-fg-on-soon-2': '#DEE7F0',
        'dark-card-fg-active': 'hsl(var(--card-foreground))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
