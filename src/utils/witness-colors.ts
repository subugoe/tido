const witnessColorsCache = {}
let index = 0
export function generateWitnessColors(idno: string): string[] {
  const bgSaturation = 40
  const bgLightness = 93

  const saturation = 70
  const lightness = 50

  const goldenAngle = 137.508
  const hue = (index * goldenAngle) % 360

  index++

  const colorsArr = [
    `hsl(${hue}, ${bgSaturation}%, ${bgLightness}%)`,
    `hsl(${hue}, ${saturation}%, ${lightness}%)`
  ]

  witnessColorsCache[idno] = colorsArr

  return colorsArr
}

export function setColors(witnesses: Witness[]): WitnessWithColor[] {
  return witnesses.map(witness => {
    const [bgColor, color] = witnessColorsCache[witness.idno] ?? generateWitnessColors(witness.idno)
    return {
      ...witness,
      bgColor,
      color
    }
  })
}
