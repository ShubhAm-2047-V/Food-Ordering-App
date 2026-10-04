/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#FF3B30",
          pink: "#FF2D8D",
          yellow: "#FFD60A",
          blue: "#1677FF",
          purple: "#7C3AED",
          orange: "#FF7A00",
          green: "#22C55E",
          dark: "#0F172A",
          darker: "#090D16",
          light: "#FFFDF8",
          cardDark: "#1E293B",
          cardGlass: "rgba(255, 255, 255, 0.8)",
        },
      },
      borderRadius: {
        'card': '24px',
        'card-lg': '28px',
        'btn': '16px',
        'input': '16px',
      },
      boxShadow: {
        'glow-pink': '0 0 35px -5px rgba(255, 45, 141, 0.45)',
        'glow-purple': '0 0 35px -5px rgba(124, 58, 237, 0.45)',
        'glow-yellow': '0 0 35px -5px rgba(255, 214, 10, 0.45)',
        'glow-orange': '0 0 35px -5px rgba(255, 122, 0, 0.45)',
        'glow-blue': '0 0 35px -5px rgba(22, 119, 255, 0.45)',
        'glow-green': '0 0 35px -5px rgba(34, 197, 94, 0.45)',
        'glow-cyan': '0 0 35px -5px rgba(6, 182, 212, 0.45)',
        'soft': '0 10px 30px -5px rgba(0, 0, 0, 0.07), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.12)',
        '3d': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(14px) rotate(-3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(80px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(80px) rotate(-360deg)' },
        },
        laserScan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-fast': 'float 2.5s ease-in-out infinite',
        'float-reverse': 'float-reverse 4.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        'gradient-shift': 'gradientShift 6s ease infinite',
        orbit: 'orbit 12s linear infinite',
      },
    },
  },
  plugins: [],
};
