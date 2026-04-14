export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#080808",
        "on-primary-fixed-variant": "#2f2ebe",
        "on-primary-container": "#c0c1ff",
        "on-secondary-fixed": "#1e025e",
        "tertiary-fixed-dim": "#ffb59a",
        "tertiary-fixed": "#ffdbcf",
        "primary-container": "#3c3dca",
        "on-tertiary-fixed-variant": "#802900",
        "surface-container-high": "#2a2a2b",
        "tertiary-container": "#943100",
        "on-surface-variant": "#cac3d9",
        "on-error-container": "#ffdad6",
        "secondary-fixed-dim": "#cbbeff",
        "on-secondary-fixed-variant": "#4a398b",
        "secondary-fixed": "#e7deff",
        "surface-variant": "#353436",
        "on-error": "#690005",
        "on-secondary-container": "#bba9ff",
        "primary-fixed-dim": "#c0c1ff",
        "on-tertiary-fixed": "#380d00",
        "primary-fixed": "#e1e0ff",
        "on-tertiary": "#5b1b00",
        "tertiary": "#ffb59a",
        "inverse-primary": "#494bd6",
        "surface-bright": "#3a393a",
        "secondary": "#cbbeff",
        "surface-container-lowest": "#0e0e0f",
        "on-primary-fixed": "#07006c",
        "on-tertiary-container": "#ffb599",
        "inverse-on-surface": "#313031",
        "primary": "#c0c1ff",
        "surface-container-low": "#1c1b1c",
        "surface-dim": "#131314",
        "on-background": "#e5e2e3",
        "on-secondary": "#332073",
        "surface-container": "#201f20",
        "error-container": "#93000a",
        "surface": "#080808",
        "outline": "#938ea2",
        "on-surface": "#e5e2e3",
        "secondary-container": "#4a398b",
        "error": "#ffb4ab",
        "on-primary": "#1000a9",
        "surface-tint": "#c0c1ff",
        "inverse-surface": "#e5e2e3",
        "outline-variant": "#484456",
        "surface-container-highest": "#353436"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"],
        "syne": ["Syne", "sans-serif"],
        "dmsans": ["DM Sans", "sans-serif"]
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
