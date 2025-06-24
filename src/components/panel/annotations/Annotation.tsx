import { FC, useEffect, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  data: Annotation
}
const Annotation: FC<Props> = ({ data }) => {
  const { panelId } = usePanel()
  const target = document.getElementById(panelId).querySelector(data.target[0].selector.value)
  const [top, setTop] = useState(3)

  useEffect(() => {
    if (target) {
      const rect = target.getBoundingClientRect()
      const textContainer = document.getElementById(panelId).querySelector(`[data-panel="${panelId}"]`)
      const textRect = textContainer.getBoundingClientRect()
      console.log(rect.top, textRect.top)
      setTop(rect.top - textRect.top)
    }
  }, [target])



  return <>
    <div
      className="absolute flex-flex-col bg-background p-2 border border-border rounded-md shadow-sm"
      style={{
        ...top > -1 && { top },
      }}
    >
      { typeof data.body.value === 'string' ? <span>{ data.body.value }</span> : '' }
    </div>
  </>
}

export default Annotation
