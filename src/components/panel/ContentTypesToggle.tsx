import { FC, useRef } from 'react'

import { usePanel } from '@/contexts/PanelContext'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ChevronDown } from 'lucide-react'

const ContentTypesToggle: FC = () => {
  const { panelState, updatePanel, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const { contentTypes, contentIndex } = panelState || {}
  const triggerRef = useRef()

  function handleTextTabClick(value: string) {
    const index = contentTypes.findIndex(type => type === value)
    setTimeout(() => updatePanel({ contentIndex: index }), 100)
  }

  if (!panelState || !contentTypes?.length) return <Skeleton className="w-[150px] h-6" />

  return (
    <>
      { contentTypes && contentTypes.length > 0 && <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button ref={triggerRef} variant="ghost" size="sm">
            { t(contentTypes[contentIndex]) }<ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{ t('text_type') } </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={contentTypes[contentIndex]} onValueChange={handleTextTabClick}>
            {contentTypes.map((type, i) => <DropdownMenuRadioItem value={type} key={'contentType'+i}>{ t(type) }</DropdownMenuRadioItem>) }
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      }
    </>
  )
}

export default ContentTypesToggle
