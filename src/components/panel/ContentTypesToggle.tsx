import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { useTranslation } from 'react-i18next'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'

const ContentTypesToggle: FC = () => {
  const { panelState, updatePanel } = usePanel()
  const { t } = useTranslation()

  const { contentTypes, contentIndex } = panelState || {}

  function handleTextTabClick(value: string) {
    const index = contentTypes.findIndex(type => type === value)
    setTimeout(() => updatePanel({ contentIndex: index }), 100)
  }

  if (!panelState || !contentTypes?.length) return <Skeleton className="w-[150px] h-6" />

  return (
    <>
      { contentTypes && contentTypes.length > 0 && <Tabs defaultValue={contentTypes[contentIndex]} onValueChange={handleTextTabClick}>
        <TabsList>
          { contentTypes.map((type) => (
            <TabsTrigger key={type} value={type}>{t(type)}</TabsTrigger>
          )) }
        </TabsList>
      </Tabs> }
    </>
  )
}

export default ContentTypesToggle
