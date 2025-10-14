import { TidoContentState, TidoContentStateTarget } from '@/types'

function hasContentState() {
  const params = new URL(window.location.href).searchParams
  return params.get('tido')
}

function isUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

async function encodeState(state: TidoContentState): Promise<string> {
  const jsonStr = JSON.stringify(state)
  const input = new TextEncoder().encode(jsonStr)

  // GZIP-compress the bytes
  const cs = new CompressionStream('gzip')
  const writer = cs.writable.getWriter()
  writer.write(input)
  writer.close()
  const compressedBuffer = await new Response(cs.readable).arrayBuffer()

  // Base64 encode the compressed bytes
  const base64 = btoa(String.fromCharCode(...new Uint8Array(compressedBuffer)))

  // Convert to Base64URL (replace + and /, remove =)
  const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_')
  const base64urlNoPadding = base64url.replace(/=+$/, '')

  return base64urlNoPadding
}

async function decodeState(encoded: string): Promise<TidoContentState> {
  // Convert Base64URL → Base64
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')

  // Add padding if needed (length must be a multiple of 4)
  const paddingNeeded = (4 - (base64.length % 4)) % 4
  if (paddingNeeded) base64 += '='.repeat(paddingNeeded)

  // Base64 → Uint8Array
  const binary = atob(base64)
  const compressedBytes = Uint8Array.from(binary, c => c.charCodeAt(0))

  // GZIP-decompress
  const ds = new DecompressionStream('gzip')
  const decompressedStream = new Blob([compressedBytes]).stream().pipeThrough(ds)
  const jsonStr = await new Response(decompressedStream).text()

  // Parse JSON
  return JSON.parse(jsonStr)
}

function extractPanelConfig(target): { collectionUrl: string, itemUrl: string, manifestUrl: string } {
  const result = {
    itemUrl: null,
    manifestUrl: null,
    collectionUrl: null,
  }

  function traverse(target: TidoContentStateTarget) {
    if (!target || !target.id || !isUrl(target.id) || !target.type) return

    if (target.type === 'Item') {
      result.itemUrl = target.id
    } else if (target.type === 'Manifest') {
      result.manifestUrl = target.id
    } else if (target.type === 'Collection') {
      result.collectionUrl = target.id
    }

    if (target.partOf) {
      traverse(target.partOf)
    }
  }

  traverse(target)
  return result
}

function createContentState(panelStates: PanelState[]): TidoContentState {
  const target: TidoContentStateTarget[] = panelStates.map(state => {
    return {
      id: state.item.id,
      type: 'Item',
      partOf: {
        id: state.manifest.id,
        type: 'Manifest',
        partOf: {
          id: state.collectionId,
          type: 'Collection'
        }
      }
    }
  })

  return {
    type: 'Annotation',
    motivation: ['contentState'],
    target
  }
}


export {
  hasContentState,
  isUrl,
  decodeState,
  encodeState,
  extractPanelConfig,
  createContentState
}
