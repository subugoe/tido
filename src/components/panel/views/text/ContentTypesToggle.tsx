import { FC } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ChevronDown } from 'lucide-react'
import { useTextView } from '@/contexts/TextViewContext.tsx'

// The content type the text view shows - the label of the view stands apart in its header. With several
// content types it opens the list to switch, with a single one it only names it. Not shown at all for a view
// configured with showContentTypesToggle: false.
const ContentTypesToggle: FC = () => {
  const { usePanelTranslation, panelRootRef } = usePanel()
  const { t } = usePanelTranslation()
  const { label, contentTypes, activeContentType, showContentTypesToggle, setActiveContentType } = useTextView()

  // a view that shows none of its content types (it shows a notice instead) has nothing to name
  if (!activeContentType || !showContentTypesToggle) return null

  function handleTextTabClick(value: string) {
    setTimeout(() => setActiveContentType(value), 100)
  }

  if (contentTypes.length <= 1) {
    return <span className="min-w-0 truncate text-xs text-muted-foreground" data-cy="content-type">
      { t(activeContentType) }
    </span>
  }

  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className="-mr-2 h-7 px-2 min-w-0 text-xs [&_svg]:size-3.5 text-muted-foreground hover:text-foreground"
        data-cy="content-type">
        <span className="truncate">{ t(activeContentType) }</span>
        <ChevronDown />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent data-cy="content-types-dropdown" align="end" container={panelRootRef.current}>
      <DropdownMenuLabel>{ t(label) }</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup value={activeContentType} onValueChange={handleTextTabClick}>
        {contentTypes.map((type, i) => <DropdownMenuRadioItem value={type} key={type+i}>{ t(type) }</DropdownMenuRadioItem>) }
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
}

export default ContentTypesToggle
