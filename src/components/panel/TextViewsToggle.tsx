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
  const updatePanel = usePanelStore((state) => state.updatePanel)

  function handleTextViewClick(
    e: MouseEvent<HTMLButtonElement>,
    newIndex: number
  ) {
    e.preventDefault()
    if (!panelState) return
    updatePanel(panelState.id, { viewIndex: newIndex })
  }

  return (
    <>
      { !panelState && <Skeleton /> }
      { panelState &&
        <div className="text-views-toggle flex row ml-auto rounded-md h-8 space-x-1 -mr-1">
          {Object.keys(icons).map((key, i) => (
            <Button
              key={i}
              onClick={(e) => handleTextViewClick(e, i)}
              variant={panelState.viewIndex === i ? 'secondary' : 'ghost'}
              size="icon"
              disabled={!panelState.contentTypes?.length}
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
