import { useDark } from '@vueuse/core';

let isDark;

function initUseDark(container) {
  isDark = useDark({
    selector: container,
    attribute: 'color-scheme',
    valueDark: 'dark',
    valueLight: 'light',
    onChanged(dark) {
      // Set the attribute update manually to avoid using localStorage, so it will not be polluted.
      document
        .querySelector(container)
        .setAttribute('color-scheme', dark ? 'dark' : 'light')
    },
  });
}

export {
  isDark,
  initUseDark,
};
