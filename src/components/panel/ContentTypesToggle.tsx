import { FC, MouseEvent } from 'react'

import { usePanel } from '@/contexts/PanelContext'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { useTranslation } from 'react-i18next'

const ContentTypesToggle: FC = () => {
  const { panelState, updatePanel } = usePanel()
  const { t } = useTranslation()

  const { contentTypes, contentIndex } = panelState || {}

  function handleTextTabClick(
    e: MouseEvent<HTMLButtonElement>,
    contentIndex: number
  ) {
    e.preventDefault()
    updatePanel({ contentIndex })
  }

  if (!panelState || !contentTypes?.length) return <Skeleton className="w-[150px] h-6" />

  return (
    <div className="inline-flex h-9 items-center justify-center rounded-lg bg-gray-200 p-1 text-gray-200-foreground">
      { contentTypes && contentTypes.length > 0 && contentTypes.map((type, i) => (
        <button
          aria-selected={contentIndex === i}
          data-state={contentIndex === i ? 'active' : 'inactive'}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow text-gray-600 dark:text-gray-200"
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
