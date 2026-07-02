import { FC, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { SyncedTargetRef, SyncTargets } from '@/store/SynopsisStore.tsx'
import WitnessesArea from '@/components/panel/annotations/popover/items/Synopsis/WitnessesArea.tsx'

interface Props {
  syncTargets: SyncTargets
  onOpenSyncedPanels: (selectedTargets: SyncedTargetRef[], replacePanels: boolean) => void
}

const SynopsisContent: FC<Props> = ({ syncTargets, onOpenSyncedPanels }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  const [selectedTargets, setSelectedTargets] = useState<SyncedTargetRef[]>([])
  const [replacePanels, setReplacePanels] = useState(false)

  return (
    <div className="flex flex-col gap-4 max-w-[360px]">
      <WitnessesArea syncTargets={syncTargets} onSelect={setSelectedTargets} />

      {/* replace-panels toggle + hint shown only when checked */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <Checkbox checked={replacePanels} onCheckedChange={(checked) => setReplacePanels(checked === true)} />
          {t('replace_panels')}
        </label>
        {replacePanels && (
          <p className="text-sm text-muted-foreground pl-6">{t('replace_panels_hint')}</p>
        )}
      </div>

      <Button
        disabled={selectedTargets.length === 0}
        onClick={() => onOpenSyncedPanels(selectedTargets, replacePanels)}
        className="w-full h-auto py-2 justify-center text-sm disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
      >
        {t('open_synced_panels')}
        {selectedTargets.length > 0 && ` (${selectedTargets.length})`}
      </Button>
    </div>
  )
}

export default SynopsisContent
