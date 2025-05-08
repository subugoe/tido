import { FC, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Ellipsis, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePanel } from '@/contexts/PanelContext.tsx'


const Actions: FC = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { remove } = usePanel()

  function removePanel() {
    setIsOpen(false)
    remove()
  }
  return (
    <>
      <Popover open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
        <PopoverTrigger asChild>
          <Button className="-mr-2" variant="ghost" size="icon">
            <Ellipsis />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Button variant="ghostDestructive" onClick={removePanel}>
            <Trash2 className="mr-2" /> { t('remove_panel') }
          </Button>
        </PopoverContent>
      </Popover>
    </>

  )
}

export default Actions
