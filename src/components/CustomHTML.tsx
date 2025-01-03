import { useEffect, useRef, FC } from 'react'

interface CustomHTMLProps {
  textHtml: string,
  width: string
}

const CustomHTML: FC<CustomHTMLProps> = ({ textHtml, width }) => {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref?.current) {
    (ref.current as HTMLElement).innerHTML = textHtml
    }
  }, [textHtml])

  return <div style={{width: width + '%'}} ref={ref} />
}
export default CustomHTML
