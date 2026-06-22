/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#3B82F6',
          light: '#60A5FA',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          dark: '#8B5CF6',
          light: '#A78BFA',
        },
        accent: {
          DEFAULT: '#06B6D4',
          dark: '#22D3EE',
          light: '#67E8F9',
        },
        bg: {
          light: '#F8FAFC',
          dark: '#0F172A',
          cardLight: '#FFFFFF',
          cardDark: '#1E293B',
        },
        text: {
          light: '#0F172A',
          dark: '#F8FAFC',
          mutedLight: '#64748B',
          mutedDark: '#94A3B8',
        }
      },
      borderRadius: {
        'premium': '16px',
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'premium-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        'premium': '12px',
      }
    },
  },
  plugins: [],
}
