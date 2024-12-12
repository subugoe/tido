import { useEffect, useRef, FC } from 'react'

interface CustomHTMLProps {
  textHtml: string,
  widthText: string
}

const CustomHTML: FC<CustomHTMLProps> = ({ textHtml, widthText }) => {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref?.current) {
    (ref.current as HTMLElement).innerHTML = textHtml
    }
  }, [textHtml])

  return <div style={{width: widthText+'%'}} ref={ref} />
}
export default CustomHTML