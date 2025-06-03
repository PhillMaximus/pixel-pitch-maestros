
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        // Cores retrô personalizadas para Phillfoot Live Soccer
        'retro-green-field': '#4CAF50',
        'retro-green-dark': '#2E7D32',
        'retro-white-lines': '#FFFFFF',
        'retro-yellow-highlight': '#FFC107',
        'retro-gray-concrete': '#616161',
        'retro-gray-dark': '#424242',
        'retro-blue-team': '#2196F3',
        'retro-red-team': '#F44336',
        'retro-pixel-bg': '#1B5E20',
        'retro-pixel-accent': '#81C784',
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
        "pixel-bounce": {
          "0%, 100%": { 
            transform: "translateY(0) scale(1)",
            filter: "brightness(1)"
          },
          "50%": { 
            transform: "translateY(-8px) scale(1.05)",
            filter: "brightness(1.2)"
          },
        },
        "pixel-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(2deg)" },
          "66%": { transform: "translateY(-5px) rotate(-2deg)" },
        },
        "pixel-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 10px rgba(255, 193, 7, 0.3)",
            transform: "scale(1)"
          },
          "50%": { 
            boxShadow: "0 0 20px rgba(255, 193, 7, 0.6), 0 0 30px rgba(255, 193, 7, 0.4)",
            transform: "scale(1.02)"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pixel-bounce": "pixel-bounce 2s infinite",
        "pixel-float": "pixel-float 3s ease-in-out infinite",
        "pixel-glow": "pixel-glow 2s ease-in-out infinite",
      },
      fontFamily: {
        'pixel': ['Courier New', 'Monaco', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0,0,0,0.3)',
        'pixel-lg': '8px 8px 0px 0px rgba(0,0,0,0.3)',
        'pixel-glow': '0 0 20px rgba(255, 193, 7, 0.5)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
