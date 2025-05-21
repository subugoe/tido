/** @type {import('tailwindcss').Config} */

export default {
  important: '.tido',
  theme: {
    extend: {
      keyframes: {
        slideToCenter: {
          '0%': {
            top: '0',
            right: '0',
            left: 'auto',
            transform: 'translate(0, 0)',
          },
          '100%': {
            top: '50%',
            left: '50%',
            right: 'auto',
            transform: 'translate(-50%, -50%)',
          },
        },
      },
      animation: {
        slideToCenter: 'slideToCenter 1s ease-out forwards',
      },
    },
  }
};
