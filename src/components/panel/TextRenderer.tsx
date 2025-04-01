import { FC, useEffect, useRef } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  htmlString: string
}

const TextRenderer: FC<Props> = ({ htmlString }) => {
  const ref = useRef<HTMLInputElement>(null)
  const { panelId } = usePanel()

  useEffect(() => {
    if (!ref?.current) return

    const scrollContainer = ref.current as HTMLElement
    const parent = scrollContainer.parentElement
    if (!parent) return

    scrollContainer.innerHTML = htmlString
  }, [htmlString])

  return <div data-panel={panelId} ref={ref} className="t-h-full t-relative t-overflow-auto" />
}

export default TextRenderer
