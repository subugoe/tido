import { FC, ReactNode } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'

interface Props {
  // 1-based position of the sync connection in the popover
  number: number
  // the witness items of the connection
  children: ReactNode
  // the "select all" checkbox of the connection - left out where witnesses are not selected but navigated to
  selectAll?: {
    checked: boolean | 'indeterminate'
    disabled: boolean
    onToggle: () => void
  }
}

// One sync connection of the popover: its title, a "select all" for its witnesses and the witnesses
// nested below.
const ConnectionGroup: FC<Props> = ({ number, children, selectAll }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return (
    <div data-cy="synoptical-connection" className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <h4 data-cy="synoptical-connection-title" className="text-sm font-medium">
          {t('synoptical_connection', { number })}
        </h4>
        {selectAll && (
          <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
            <Checkbox checked={selectAll.checked} disabled={selectAll.disabled} onCheckedChange={selectAll.onToggle} />
            {t('select_all')}
          </label>
        )}
      </div>
      <div data-cy="witness-list" className="flex flex-col gap-1.5 pl-4">
        {children}
      </div>
    </div>
  )
}

export default ConnectionGroup
