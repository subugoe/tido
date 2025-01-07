import { FC, MouseEvent } from 'react'

import { contentStore } from '@/store/ContentStore'
import { usePanel } from '@/contexts/PanelContext'

const ContentTypesToggle: FC = () => {
  const { panelId } = usePanel()

  const contentTypes = contentStore(
    (state) => state.openedPanels[panelId].contentTypes
  )
  const activeContentTypeIndex = contentStore(
    (state) => state.openedPanels[panelId].contentIndex
  )
  const updateContentToggleIndex = contentStore(
    (state) => state.updateContentToggleIndex
  )

  function handleTextTabClick(
    e: MouseEvent<HTMLButtonElement>,
    newContentIndex: number
  ) {
    e.preventDefault()
    updateContentToggleIndex(panelId, newContentIndex)
  }

  let buttons
  if (contentTypes && contentTypes.length > 0) {
    buttons = contentTypes.map((type, i) => (
      <button
        className="t-h-6 t-rounded t-mr-2 t-px-1"
        style={{
          backgroundColor: activeContentTypeIndex === i ? '#FFFFFF' : '',
        }}
        key={i}
        onClick={(e) => handleTextTabClick(e, i)}
      >
        {type}
      </button>
    ))
  }

  return (
    <div className="buttons-text-views t-bg-gray-400 t-p-1 t-rounded-md t-h-8">
      {buttons}
    </div>
  )
}

export default ContentTypesToggle
