/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      serif: ['Lora', 'serif'],
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        background: '#F7F6F3',
        foreground: '#111111',
        primary: {
          DEFAULT: '#8B0000', // Deep Red
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#E5E5E5',
          foreground: '#737373',
        },
        accent: {
          DEFAULT: '#F7F6F3', // Using background as accent base for now, or maybe a slightly darker shade? User said max 4 colors.
          foreground: '#111111',
        },
        success: '#4A6F44', // Muted Green
        warning: '#B48439', // Muted Amber
        border: '#E5E5E5',
      },
      spacing: {
        '0': '0px',
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px', // Adding 32px as intermediate
        '5': '40px',
        '6': '48px',
        '8': '64px',
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
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
  plugins: [],
}
