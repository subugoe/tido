import { FC, MouseEvent } from 'react'
import { textViewOne, textView, splitView, imageView } from '@/utils/icons'

import { panelStore } from '@/store/PanelStore.tsx'
import { usePanel } from '@/contexts/PanelContext'
import { Button } from '@/components/ui/button.tsx'
import CustomHTML from '@/components/CustomHTML.tsx'

interface IconKeys {
  viewOne: string
  text: string
  split: string
  image: string
}

const TextViewsToggle: FC = () => {
  const { panelId } = usePanel()
  const viewIndex = panelStore((state) => state.panels[panelId].viewIndex)
  const updateViewIndex = panelStore((state) => state.updateViewIndex)

  function handleTextViewClick(
    e: MouseEvent<HTMLButtonElement>,
    newIndex: number
  ) {
    e.preventDefault()
    updateViewIndex(panelId, newIndex)
  }

  const textViewsIcons = {
    viewOne: textViewOne,
    text: textView,
    split: splitView,
    image: imageView,
  }

  return (
    <div className="text-views-toggle t-flex t-row t-ml-auto t-rounded-md t-h-8 t-space-x-1 -t-mr-1">
      {Object.keys(textViewsIcons).map((title, i) => (
        <Button
          key={i}
          onClick={(e) => handleTextViewClick(e, i)}
          variant={viewIndex === i ? 'secondary' : 'ghost'}
          size="icon"
        >
          <CustomHTML textHtml={textViewsIcons[title as keyof IconKeys]}></CustomHTML>
        </Button>
      ))}
    </div>
  )
}

export default TextViewsToggle
