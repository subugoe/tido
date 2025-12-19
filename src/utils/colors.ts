
// Below is procedure of parsing the color from (hex, rgb, hsl) -> okclh

//    hex | rgb | hsl
//          ↓
//       RGB (0–1)
//          ↓
//       Linear RGB
//          ↓
//       OKLab
//          ↓
//       OKLCH


function oklabToOklch({ L, a, b }) {
  const C = Math.sqrt(a * a + b * b)
  let h = Math.atan2(b, a) * 180 / Math.PI
  if (h < 0) h += 360

  return { L, C, h }
}


function linearRgbToOklab({ r, g, b }) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  }
}

function srgbToLinear(c) {
  return c <= 0.04045
    ? c / 12.92
    : Math.pow((c + 0.055) / 1.055, 2.4)
}

function hexToRgb(hex) {
  hex = hex.replace('#', '')

  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }

  const num = parseInt(hex, 16)

  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255
  }
}

function rgbStringToRgb(str) {
  const [r, g, b] = str.match(/\d+(\.\d+)?/g).map(Number)

  return {
    r: r / 255,
    g: g / 255,
    b: b / 255
  }
}

function hslStringToHsl(str: string): [number, number, number] {
  const [h, s, l] = str.match(/\d+(\.\d+)?/g).map(Number)
  return [h, s / 100, l / 100]
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return { r, g, b }
}


function parseColorToRGB(color: string) {
  const lcColor = color.trim().toLowerCase()

  if (lcColor.startsWith('#')) {
    return hexToRgb(lcColor)
  }

  if (lcColor.startsWith('rgb')) {
    return rgbStringToRgb(lcColor)
  }

  if (lcColor.startsWith('hsl')) {
    const array: [number, number, number] = hslStringToHsl(lcColor)
    return hslToRgb(...array)
  }

  throw new Error('Unsupported color format')
}

function colorStringToOKLCH(colorString: string) {
  const rgb = parseColorToRGB(colorString)

  const linearRgb = {
    r: srgbToLinear(rgb.r),
    g: srgbToLinear(rgb.g),
    b: srgbToLinear(rgb.b)
  }

  const oklab = linearRgbToOklab(linearRgb)
  return oklabToOklch(oklab)
}


const getAppPrimaryAndForegroundColor = (primaryColor: string, type: string) => {
  const oklch = colorStringToOKLCH(primaryColor)
  return `--tido-color-${type}: oklch(${oklch?.L} ${oklch?.C} ${oklch?.h} / 1); --tido-color-${type}-foreground: oklch(0.985 0 0);
  --annotation-hover: oklch(0.93 0.04 ${oklch?.h}); --annotation-selected: oklch(0.7 0.07 ${oklch?.h})`
}






export { getAppPrimaryAndForegroundColor }
