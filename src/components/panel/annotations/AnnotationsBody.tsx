import { FC } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import Annotation from '@/components/panel/annotations/Annotation.tsx'

const AnnotationsBody: FC = () => {
  const { panelState, panelId } = usePanel()

  return <div className="relative border-t border-border bg-accent flex-1 p-2">
    { panelState.annotations
      .filter(a => !!document.getElementById(panelId).querySelector(a.target[0].selector.value))
      .map(a => <Annotation data={a} key={a.id} />)
    }
  </div>
}

export default AnnotationsBody
