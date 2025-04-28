import { FC, MouseEvent } from 'react'

import { usePanel } from '@/contexts/PanelContext'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { useTranslation } from 'react-i18next'

const ContentTypesToggle: FC = () => {
  const { panelState, updatePanelState } = usePanel()
  const { t } = useTranslation()

  const { contentTypes, contentIndex } = panelState || {}

  function handleTextTabClick(
    e: MouseEvent<HTMLButtonElement>,
    contentIndex: number
  ) {
    e.preventDefault()
    updatePanelState({ contentIndex })
  }

  if (!panelState || !contentTypes?.length) return <Skeleton className="t-w-[150px] t-h-6" />

  return (
    <div className="t-inline-flex t-h-9 t-items-center t-justify-center t-rounded-lg t-bg-gray-200 t-p-1 t-text-gray-200-foreground">
      { contentTypes && contentTypes.length > 0 && contentTypes.map((type, i) => (
        <button
          aria-selected={contentIndex === i}
          data-state={contentIndex === i ? 'active' : 'inactive'}
          className="t-inline-flex t-items-center t-justify-center t-whitespace-nowrap t-rounded-md t-px-3 t-py-1 t-text-sm t-font-medium t-ring-offset-background t-transition-all focus-visible:t-outline-none focus-visible:t-ring-2 focus-visible:t-ring-ring focus-visible:t-ring-offset-2 disabled:t-pointer-events-none disabled:t-opacity-50 data-[state=active]:t-bg-white data-[state=active]:t-text-gray-900 data-[state=active]:t-shadow t-text-gray-600 dark:t-text-gray-200"
          role="tab"
          key={i}
          onClick={(e) => handleTextTabClick(e, i)}
        >
          {t(type)}
        </button>
      )) }
    </div>
  )
}

export default ContentTypesToggle
