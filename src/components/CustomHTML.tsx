import { useEffect, useRef, FC, useState } from 'react'

interface CustomHTMLProps {
  textHtml: string,
  width?: string | number,
  elementType: string
}

const CustomHTML: FC<CustomHTMLProps> = ({ textHtml, width, elementType }) => {
  const ref = useRef<HTMLInputElement>(null)

  let iconEl = null

  useEffect(() => {
    if (ref?.current) {
    (ref.current as HTMLElement).innerHTML = textHtml
    if (elementType === 'icon') {
      const iconEls = ref.current.children
      if (iconEls && iconEls.length > 0) {
        iconEl = iconEls[0]
        iconEl.classList.add('t-w-6','t-h-5') // TODO: these should be given as props
      }
    }
    }
  }, [textHtml])

  if (elementType === 'icon' && iconEl) return iconEl

  return <div style={{ width: width+'%' }} ref={ref} />
}
export default CustomHTML
