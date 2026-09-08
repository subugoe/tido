import { FC, ReactNode, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import LocalTree from '@/components/tree/LocalTree.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { X } from 'lucide-react'

interface Props {
  trigger: ReactNode
  collectionId: string
}

const CollectionTreePopover: FC<Props> = ({ trigger, collectionId }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const [open, setOpen] = useState(false)

  function close() {
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-[400px] pr-0">
        <div className="font-semibold mb-2">{t('choose_your_panel_content')}</div>
        <LocalTree collectionId={collectionId} onSelect={close} />
        <X
          className="absolute right-3 top-4 text-zinc-600 hover:text-zinc-700 cursor-pointer"
          size={15} onClick={close}
        />
      </PopoverContent>
    </Popover>
  )
}

export default CollectionTreePopover