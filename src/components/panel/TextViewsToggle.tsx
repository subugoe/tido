import { FC, MouseEvent } from 'react'
import { textViewOne, textView, splitView, imageView } from '@/utils/icons'
import CustomHTML from '@/components/CustomHTML'

import { contentStore } from '@/store/ContentStore'

interface TextViewsToggleProps {
  panelId: string
}

interface IconKeys {
  viewOne: string
  text: string
  split: string
  image: string
}

const TextViewsToggle: FC<TextViewsToggleProps> = ({ panelId }) => {
  const textViewIndex = contentStore(
    (state) => state.openedPanels[panelId].textViewIndex
  )
  const updateTextViewIndex = contentStore((state) => state.updateTextViewIndex)

  function handleTextViewClick(
    e: MouseEvent<HTMLButtonElement>,
    newIndex: number
  ) {
    e.preventDefault()
    updateTextViewIndex(panelId, newIndex)
  }

  const textViewsIcons = {
    viewOne: textViewOne,
    text: textView,
    split: splitView,
    image: imageView,
  }

  const buttons = Object.keys(textViewsIcons).map((title, i) => (
    <button
      className="t-px-1 t-py-1 t-w-7 t-h-7  t-rounded t-mr-3"
      key={i}
      onClick={(e) => handleTextViewClick(e, i)}
      style={{
        backgroundColor: textViewIndex === i ? '#E5E7EB' : 'transparent',
      }}
    >
      <CustomHTML
        textHtml={textViewsIcons[title as keyof IconKeys]}
        icon={{ type: 'icon', width: 3, height: 2 }}
      />
    </button>
  ))

  return (
    <div className="text-views-toggle t-flex t-row t-ml-[40%] t-p-1 t-rounded-md t-h-8">
      {buttons}
    </div>
  )
}

export default TextViewsToggle
