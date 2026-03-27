
// Below is procedure of parsing the color from (hex, rgb, hsl, oklch) -> okclh

//    hex | rgb | hsl | oklch
//          ↓             ↓
//       RGB (0–1)      OKLCH
//          ↓
//       Linear RGB
//          ↓
//       OKLab
//          ↓
//       OKLCH

interface RGB {
  r: number
  g: number
  b: number
}

interface OKLCH {
  l: number
  c: number
  h: number
}

interface OKLAB {
  l: number
  a: number
  b: number
}

function hexStringToRgb(hexString: string): RGB {
  hexString = hexString.replace('#', '')

  if (hexString.length === 3) {
    hexString = hexString.split('').map(c => c + c).join('')
  }

  const num = parseInt(hexString, 16)

  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255
  }
}

function rgbStringToRgb(rgbString: string): RGB {
  const [r, g, b] = rgbString.match(/\d+(\.\d+)?/g).map(Number)

  return {
    r: r / 255,
    g: g / 255,
    b: b / 255
  }
}

function hslStringToHsl(hslString: string): [number, number, number] {
  const [h, s, l] = hslString.match(/\d+(\.\d+)?/g).map(Number)
  return [h / 360, s / 100, l / 100]
}

function hslStringToRgb(hslString: string): RGB {
  const [h, s, l] = hslStringToHsl(hslString)

  const hue2rgb = (p: number, q: number, t: number): number => {
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

function parseOklchStringOklch(oklchString: string): OKLCH {
  const str = oklchString.trim().toLowerCase()

  const body = str.slice(6, -1).trim()

  // Reject alpha explicitly
  if (body.includes('/')) {
    return null
  }

  const parts = body.split(/\s+/)
  if (parts.length < 2 || parts.length > 3) {
    return null
  }

  // Lightness
  let l: number
  if (parts[0].endsWith('%')) {
    l = parseFloat(parts[0]) / 100
  } else {
    l = parseFloat(parts[0])
  }
  if (!Number.isFinite(l)) return null

  // Chroma
  const c = parseFloat(parts[1])
  if (!Number.isFinite(c)) return null

  // Hue
  let h: number | null = null
  if (parts[2] && parts[2] !== 'none') {
    const hue = parts[2]
    const value = parseFloat(hue)
    if (!Number.isFinite(value)) return null

    if (hue.endsWith('deg') || /^[\d.+-]+$/.test(hue)) {
      h = value
    } else if (hue.endsWith('rad')) {
      h = value * (180 / Math.PI)
    } else if (hue.endsWith('turn')) {
      h = value * 360
    } else if (hue.endsWith('grad')) {
      h = value * 0.9
    } else {
      return null
    }

    h = ((h % 360) + 360) % 360
  }

  // Optional clamping (recommended)
  l = Math.min(1, Math.max(0, l))
  const cClamped = Math.max(0, c)

  return { l, c: cClamped, h }
}

function parseHexStringToOklch(hexString: string) {
  return rgbToOklch(hexStringToRgb(hexString))
}

function parseRgbStringToOklch(rgbString: string) {
  return rgbToOklch(rgbStringToRgb(rgbString))
}

function parseHslStringToOklch(hslString: string) {
  return rgbToOklch(hslStringToRgb(hslString))
}

function oklabToOklch({ l, a, b }: OKLAB): OKLCH {
  const c = Math.sqrt(a * a + b * b)
  let h = Math.atan2(b, a) * 180 / Math.PI
  if (h < 0) h += 360

  return { l, c, h }
}

function linearRgbToOklab({ r, g, b }: RGB): OKLAB {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return {
    l: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  }
}

function srgbToLinear(c: number): number {
  return c <= 0.04045
    ? c / 12.92
    : Math.pow((c + 0.055) / 1.055, 2.4)
}

function rgbToOklch(rgb: RGB): OKLCH {
  const linearRgb = {
    r: srgbToLinear(rgb.r),
    g: srgbToLinear(rgb.g),
    b: srgbToLinear(rgb.b)
  }

  const oklab = linearRgbToOklab(linearRgb)
  return oklabToOklch(oklab)
}

function colorStringToOKLCH(colorString: string): OKLCH {
  const lcColor = colorString.trim().toLowerCase()

  if (lcColor.startsWith('#')) {
    return parseHexStringToOklch(lcColor)
  }

  if (lcColor.startsWith('rgb')) {
    return parseRgbStringToOklch(lcColor)
  }

  if (lcColor.startsWith('hsl')) {
    return parseHslStringToOklch(lcColor)
  }

  if (lcColor.startsWith('oklch')) {
    return parseOklchStringOklch(lcColor)
  }

  throw new Error('Unsupported color format')
}

const getColors = (color: string) => {
  const oklch = colorStringToOKLCH(color)
  return `
    --tido-color-primary: oklch(${oklch?.l} ${oklch?.c} ${oklch?.h} / 1);
    --tido-color-primary-foreground: oklch(0.985 0 0);
    --tido-color-primary-shade-1: oklch(0.95 0.04 ${oklch?.h});
    --tido-color-primary-shade-2: oklch(0.8 0.07 ${oklch?.h});
    --tido-color-primary-shade-3: oklch(0.4 0.06 ${oklch?.h});
    --tido-color-primary-shade-4: oklch(0.25 0.03 ${oklch?.h});
  `
}

export { getColors }
