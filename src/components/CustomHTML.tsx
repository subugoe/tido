import { useEffect, useRef, FC } from 'react'

interface CustomHTMLProps {
  textHtml: string
  width?: string | number
  icon?: Icon
}

interface Icon {
  type: string
  width: number
  height: number
}

const CustomHTML: FC<CustomHTMLProps> = ({ textHtml, width, icon }) => {
  const ref = useRef<HTMLInputElement>(null)

  let iconEl = null

  useEffect(() => {
    if (ref?.current && !icon) {
      ;(ref.current as HTMLElement).innerHTML =
        textHtml + 'loremipsum\n'.repeat(100)
      const spanEl = document.getElementById('t_ms_syr_434_N1l5l3l3l5l5l4_w_4')
      if (spanEl) {
        spanEl.setAttribute('synopsis-word-id', '11')
        const rect = spanEl.getBoundingClientRect()
        const yPos = rect.y
        console.log('y pos of first word', yPos)
      }

      const spanSecondEl = document.getElementById(
        't_Cod_Arab_236_N1l5l3l3l5l7l18_w_5'
      )
      if (spanSecondEl) {
        spanSecondEl.setAttribute('synopsis-word-id', '11')
        const rect = spanSecondEl.getBoundingClientRect()
        const yPos = rect.y
        spanSecondEl.scrollIntoView({ behavior: 'smooth' })
        console.log('y pos of second word', yPos)
      }
    }
    if (icon?.type === 'icon') {
      ;(ref.current as HTMLElement).innerHTML = textHtml
      const iconEls = ref.current.children
      if (iconEls && iconEls.length > 0) {
        iconEl = iconEls[0]
        iconEl.classList.add('t-w-' + icon.width, 't-h-' + icon.height)
      }
    }
  }, [textHtml])

  if (iconEl) return iconEl

  return (
    <div
      className="content-text t-overflow-y-scroll t-h-[500px]"
      style={{ width: width + '%' }}
      ref={ref}
    />
  )
}
export default CustomHTML
