import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ChevronDown } from 'lucide-react'
import { useTextView } from '@/contexts/TextViewContext.tsx'

const ContentTypesToggle: FC = () => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const { label, contentTypes, activeContentType, setActiveContentType } = useTextView()
  function handleTextTabClick(value: string) {
    setTimeout(() => setActiveContentType(value), 100)
  }

  function renderButton(isTrigger: boolean) {
    return <Button variant="ghost" size="sm" className={!isTrigger ? 'hover:bg-muted' : ''} data-cy="content-type">
      {t(label)}: { t(activeContentType) } {isTrigger && <ChevronDown />}
    </Button>
  }

  return (
    <>
      { contentTypes.length === 1 && renderButton(false)}
      { contentTypes.length > 1 && <DropdownMenu>
        <DropdownMenuTrigger asChild>
          { renderButton(true) }
        </DropdownMenuTrigger>
        <DropdownMenuContent data-cy="content-types-dropdown">
          <DropdownMenuLabel>{ t(label) } </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={activeContentType} onValueChange={handleTextTabClick}>
            {contentTypes.map((type, i) => <DropdownMenuRadioItem value={type} key={type+i}>{ t(type) }</DropdownMenuRadioItem>) }
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      }
    </>
  )
}

export default ContentTypesToggle
