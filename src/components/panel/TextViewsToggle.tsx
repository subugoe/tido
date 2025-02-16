import { FC, MouseEvent } from 'react'
import { textViewOne, textView, splitView, imageView } from '@/utils/icons'
import CustomHTML from '@/components/CustomHTML'

import { panelStore } from '@/store/PanelStore.tsx'
import { usePanel } from '@/contexts/PanelContext'

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

  const buttons = Object.keys(textViewsIcons).map((title, i) => (
    <button
      className="t-px-1 t-py-1 t-w-7 t-h-7 t-rounded t-mr-1"
      key={i}
      onClick={(e) => handleTextViewClick(e, i)}
      style={{
        backgroundColor: viewIndex === i ? '#E5E7EB' : 'transparent',
      }}
    >
      <CustomHTML
        textHtml={textViewsIcons[title as keyof IconKeys]}
        icon={{ type: 'icon', width: 3, height: 2 }}
      />
    </button>
  ))

  return (
    <div className="text-views-toggle t-flex t-row t-ml-auto t-p-1 t-rounded-md t-h-8">
      {buttons}
    </div>
  )
}

export default TextViewsToggle
