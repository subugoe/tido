import { useConfigStore } from '@/store/ConfigStore.tsx'

function loadFont(url: string, containerSelector: string) {
  // to use a certain font on a text, then we only need to load the font file.
  // we load the font file using @font-face interface
  const root = document.querySelector(`${containerSelector} .tido`)
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

export const getSupport = (support: Support[] | undefined) => {
  const { container } = useConfigStore.getState().config

  support?.forEach((s) => {
    const hasElement = document.getElementById(s.url)
    if (s.type === 'font' && !hasElement) loadFont(s.url, container)
    if (s.type === 'css' && !hasElement) loadCss(s.url)
  })
}
