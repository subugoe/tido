function loadFont(url: string) {
  // to use a certain font on a text, then we only need to load the font file.
  // we load the font file using @font-face interface
  const root = document.querySelector(`.tido`)
  if (!root) return

  const styleEl = document.createElement('style')

  styleEl.id = url
  styleEl.innerHTML = '@font-face {\n'
    + `  src: url(${url}) ;\n`
    + '}'

  root.appendChild(styleEl)
}

function loadCss (url: string){
  const element = document.createElement('link')

  element.setAttribute('rel', 'stylesheet')
  element.setAttribute('type', 'text/css')
  element.setAttribute('href', url)
  element.setAttribute('id', url)

  document.head.appendChild(element)
}

function getMimeType(contentType: string) {
  // strip optional parameters, e.g. 'text/css; charset=utf-8' -> 'text/css'
  return contentType.split(';')[0].trim().toLowerCase()
}

export const getAssets = (assets: Asset[] | null | undefined) => {
  assets?.forEach((s) => {
    if (!s.id || !s.contentType || document.getElementById(s.id)) return

    const mimeType = getMimeType(s.contentType)
    if (mimeType === 'text/css') loadCss(s.id)
    else if (mimeType.startsWith('font/')) loadFont(s.id)
  })
}
