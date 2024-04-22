import { useDark } from '@vueuse/core';

let isDark;

function initUseDark(container) {
  isDark = useDark({
    selector: container,
    attribute: 'color-scheme',
    valueDark: 'dark',
    valueLight: 'light',
  });
}

export {
  isDark,
  initUseDark,
};
