export const getRGBColor = (hex: string, type: string) => {
  const color = hex.replace(/#/g, '')
  // rgb values
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)

  return `--tido-color-${type}: ${r}, ${g}, ${b}; --tido-color-${type}-accent: ${r - 15}, ${g - 15}, ${b - 15};`
}
