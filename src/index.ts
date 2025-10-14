import '@/css/style.css'

export type { TidoProps, TidoConfig, TidoContentState, TidoContentStateTarget } from './types.d.ts'

export { Tido } from './components/Tido.tsx'
export { encodeState, decodeState } from './utils/bookmarking.ts'
