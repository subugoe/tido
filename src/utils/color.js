export const getRGBColor = (hex, type) => {
  const color = hex.replace(/#/g, '');
  // rgb values
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  return `--color-${type}: ${r}, ${g}, ${b}; --color-${type}-accent: ${r - 10}, ${g - 10}, ${b - 10};`;
};
