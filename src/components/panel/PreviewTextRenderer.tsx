import { FC, useEffect, useRef } from 'react'

interface Props {
  htmlString: string
}

const PreviewTextRenderer: FC<Props> = ({ htmlString }) => {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!ref?.current) return
    (ref.current as HTMLElement).innerHTML = htmlString
  }, [htmlString])

  return <div ref={ref} className="t-h-full t-overflow-hidden t-text-[5px]" />
}

export default PreviewTextRenderer
