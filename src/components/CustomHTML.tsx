import { useEffect, useRef, FC } from 'react'

interface CustomHTMLProps {
  textHtml: string,
  width?: string | number,
  icon?: Icon
}

interface Icon {
  type: string,
  width: number, 
  height: number
}

const CustomHTML: FC<CustomHTMLProps> = ({ textHtml, width, icon }) => {
  const ref = useRef<HTMLInputElement>(null)

  let iconEl = null

  useEffect(() => {
    if (ref?.current) {
    (ref.current as HTMLElement).innerHTML = textHtml
    if (icon?.type === 'icon') {
      const iconEls = ref.current.children
      if (iconEls && iconEls.length > 0) {
        iconEl = iconEls[0]
        iconEl.classList.add('t-w-' + icon.width, 't-h-' + icon.height) 
      }
    }
    }
  }, [textHtml])

  if (iconEl) return iconEl

  return <div style={{ width: width+'%' }} ref={ref} />
}
export default CustomHTML
