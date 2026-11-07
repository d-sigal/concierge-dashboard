import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        channelSelector: '0px 4px 6px -2px rgba(14, 25, 39, 0.05), 0px 6px 14px -4px rgba(14, 25, 39, 0.20)',
      },
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          200: 'rgb(var(--primary-200) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
          650: 'rgb(var(--primary-650) / <alpha-value>)',
          700: 'rgb(var(--primary-700) / <alpha-value>)',
          800: 'rgb(var(--primary-800) / <alpha-value>)',
        },
        brand: {
          50: 'rgb(var(--brand-50) / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
        },
        purple: {
          50: '#F8F6FE',
          100: '#F8F2FF',
          200: '#F2ECF9',
          300: '#E6D9F2',
          400: '#CCB3E6',
          500: '#B28CD9',
          600: '#8A5CB8',
          700: '#663399',
          800: '#542A7E',
          900: '#441F6A',
        },
        main: {
          200: 'rgb(var(--primary-200) / <alpha-value>)',
        },
        text: {
          secondary: '#535454',
          disabled: '#737474',
          active: 'rgb(var(--brand-100) / <alpha-value>)',
          description: '#616262',
          success: '#B1E7BF',
        },
        strokes: {
          DEFAULT: 'rgb(var(--brand-300) / <alpha-value>)',
          blocks: '#EEF0EE',
          info: '#B0C6E8',
          success: '#63CF80',
          alert: '#F14D41',
        },
        surface: {
          info: '#EBF1F9',
        },
        icon: {
          DEFAULT: 'rgb(var(--brand-600) / <alpha-value>)',
          info: '#3769B9',
          success: '#309C4D',
          light: 'rgb(var(--brand-400) / <alpha-value>)',
        },
        basic: {
          DEFAULT: '#262A29',
          divider: '#D1D3D2',
          blocks: '#F0F0F0',
          black: '#262a29',
          mint: '#EFFBE9',
          clay: '#FFD9B8',
          oxide: '#F8F2E0',
        },
        green: {
          50: '#F7FFF9',
          100: '#F2FFF5',
          200: '#ECF9EF',
          300: '#D8F3DF',
          400: '#B1E7BF',
          500: '#8ADBA0',
          600: '#63CF80',
          700: '#309C4D',
          800: '#237438',
          900: '#165D29',
        },
        red: {
          DEFAULT: '#DB200F',
          50: '#FFF8F7',
          100: '#FFF1F0',
          200: '#FDE9E7',
          300: '#FCD2CF',
          400: '#F8A6A0',
          500: '#F57970',
          600: '#F14D41',
          700: '#DB200F',
          800: '#BE1A0E',
          900: '#8F130A',
        },
        yellow: {
          50: '#FFFDF7',
          100: '#FFFBF0',
          200: '#FCF7E9',
          300: '#F8EFD3',
          400: '#F1E0A7',
          500: '#EAD07B',
          600: '#E3C14F',
          700: '#B89624',
          800: '#A38319',
          900: '#806714',
          dark: '#B28F1D',
        },
        blue: {
          50: '#F5F9FF',
          100: '#EDF3FA',
          200: '#EBF1F9',
          300: '#D8E2F3',
          400: '#B0C6E8',
          500: '#89A9DC',
          600: '#628CD0',
          700: '#3769B9',
          800: '#2F599D',
          900: '#234376',
        },
        warning: '#B89624',
        gray: {
          50: '#F6F6F5',
          100: '#F0F0F0',
          200: '#D1D3D2',
          300: '#B3B5B4',
          400: '#8D8E8E',
          500: '#737474',
          600: '#616262',
          700: '#535454',
          800: '#474848',
          900: '#3E3F3F',
        },
      },
      screens: {
        '3xl': { min: '2400px' },
        lg: { min: '1141px' },
      },
      width: {
        bigScreenWidth: '2300px',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'],
        secondary: ['var(--font-poppins)', 'sans-serif'],
      },
      fontSize: {
        '2lg': '22px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'bounce-custom': 'bounce 1.3s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        bounce: {
          '0%, 60%, 100%': {
            transform: 'translateY(0)',
          },
          '30%': {
            transform: 'translateY(-4px)',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      variants: {
        extend: {
          display: ['group-data-state'],
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: (util: Record<string, any>) => void }) {
      const newUtilities = {
        '.animation-delay-150': {
          'animation-delay': '0.15s',
        },
        '.animation-delay-300': {
          'animation-delay': '0.3s',
        },
      };
      addUtilities(newUtilities);
    },
    typography,
    animate,
  ],
};

export default config;
