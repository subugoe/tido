import colors from 'tailwindcss/colors';

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ['class', '[color-scheme="dark"]'],
  prefix: 't-',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  safelist: [
    { pattern: /(text|bg)-(red|blue|primary)+/ },
  ],
  theme: {
    extend: {
      colors: {
        primary: withOpacity('--color-primary'),
        gray: colors.neutral,
      },
    },
  },
  plugins: [],
};
