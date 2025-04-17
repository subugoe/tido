import { FC, MouseEvent, ReactElement } from 'react'
import { PictureInPicture2, Image, AlignCenter, Columns2 } from 'lucide-react'

import { usePanelStore } from '@/store/PanelStore.tsx'
import { usePanel } from '@/contexts/PanelContext'
import { Button } from '@/components/ui/button.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

interface IconKeys {
  pip: ReactElement
  split: ReactElement
  text: ReactElement
  image: ReactElement
}

const icons = {
  pip: <PictureInPicture2 />,
  split: <Columns2 />,
  text: <AlignCenter />,
  image: <Image />,
}

const TextViewsToggle: FC = () => {
  const { panelState } = usePanel()
  const updatePanelState = usePanelStore((state) => state.updatePanelState)

  function handleTextViewClick(
    e: MouseEvent<HTMLButtonElement>,
    newIndex: number
  ) {
    e.preventDefault()
    if (!panelState) return
    updatePanelState(panelState.id, { viewIndex: newIndex })
  }

  return (
    <>
      { !panelState && <Skeleton /> }
      { panelState &&
        <div className="text-views-toggle t-flex t-row t-ml-auto t-rounded-md t-h-8 t-space-x-1 -t-mr-1">
          {Object.keys(icons).map((key, i) => (
            <Button
              key={i}
              onClick={(e) => handleTextViewClick(e, i)}
              variant={panelState.viewIndex === i ? 'secondary' : 'ghost'}
              size="icon"
              data-selected={panelState.viewIndex === i}
              data-cy={key}
            >
              { icons[key as keyof IconKeys] }
            </Button>
          ))}
        </div>
      }
    </>
  )
}

export default TextViewsToggle
