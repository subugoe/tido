export const getRGBColor = (hex, type) => {
  const color = hex.replace(/#/g, '');
  // rgb values
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  return `--color-${type}: ${r}, ${g}, ${b}; --color-${type}-accent: ${r - 15}, ${g - 15}, ${b - 15};`;
};


export default function colors() {

  const hexaDecimalColors = ['#FEF08A', '#BEF264', '#A8A29E', '#D8B4FE', '#A8A29E']
  return hexaDecimalColors;
}

export function getItemColorBasedOnIndex(index){
  return colors()[index]
}