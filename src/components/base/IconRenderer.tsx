import { useEffect, useRef, FC, useState } from 'react'

interface IconRendererProps {
  htmlString: string
  width?: number,
  height?: number
}

const IconRenderer: FC<IconRendererProps> = ({ htmlString, width, height }) => {
  const ref = useRef<HTMLInputElement>(null)

  const [iconWidth, setIconWidth] = useState(4)
  const [iconHeight, setIconHeight] = useState(4)

  useEffect(() => {
    if (width) setIconWidth(width)
    if (height) setIconHeight(height)

    if (ref?.current) {
      (ref.current as HTMLElement).innerHTML = htmlString
      const iconEls = ref.current.children

      const iconEl = iconEls[0]
      iconEl.classList.add('w-' + iconWidth, 'h-' + iconHeight)
    }
  }, [htmlString, iconWidth, iconHeight])

  return <div ref={ref}></div>
}
export default IconRenderer
