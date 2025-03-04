import { FC, MouseEvent } from 'react'

import { usePanelStore } from '@/store/PanelStore.tsx'
import { usePanel } from '@/contexts/PanelContext'

const ContentTypesToggle: FC = () => {
  const { panelId } = usePanel()

  const contentTypes = usePanelStore(
    (state) => state.panels[panelId].contentTypes
  )
  const activeContentTypeIndex = usePanelStore(
    (state) => state.panels[panelId].contentIndex
  )
  const updateContentToggleIndex = usePanelStore(
    (state) => state.updateContentToggleIndex
  )

  function handleTextTabClick(
    e: MouseEvent<HTMLButtonElement>,
    newContentIndex: number
  ) {
    e.preventDefault()
    updateContentToggleIndex(panelId, newContentIndex)
  }

  return (
    <div className="t-inline-flex t-h-9 t-items-center t-justify-center t-rounded-lg t-bg-gray-200 t-p-1 t-text-gray-200-foreground">
      { contentTypes && contentTypes.length > 0 && contentTypes.map((type, i) => (
        <button
          aria-selected={activeContentTypeIndex === i}
          data-state={activeContentTypeIndex === i ? 'active' : 'inactive'}
          className="t-inline-flex t-items-center t-justify-center t-whitespace-nowrap t-rounded-md t-px-3 t-py-1 t-text-sm t-font-medium t-ring-offset-background t-transition-all focus-visible:t-outline-none focus-visible:t-ring-2 focus-visible:t-ring-ring focus-visible:t-ring-offset-2 disabled:t-pointer-events-none disabled:t-opacity-50 data-[state=active]:t-bg-white data-[state=active]:t-text-gray-900 data-[state=active]:t-shadow t-text-gray-600 dark:t-text-gray-200"
          role="tab"
          key={i}
          onClick={(e) => handleTextTabClick(e, i)}
        >
          {type}
        </button>
      )) }
    </div>
  )
}

export default ContentTypesToggle
