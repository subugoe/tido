import { FC } from 'react'
import { ChevronDown } from 'lucide-react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'
import { SYNC_NAVIGATION_POSITION } from '@/utils/constants.ts'

const VERTICAL_OFFSET = '-translate-y-[calc(100%-4px)]'

interface Props {
  onOpen: () => void
  // Horizontal center of the main content, measured by TargetNavigation
  centerX: number
}

// The collapsed state of TargetNavigation: a small amber tab poking above the card that re-opens the control.
const NavigationCollapsed: FC<Props> = ({ onOpen, centerX }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return (
    <div className={`${SYNC_NAVIGATION_POSITION} ${VERTICAL_OFFSET}`} style={{ left: `${centerX}px` }}>
      <BaseTooltip message={t('open_synoptic_targets_navigation')}>
        <button
          type="button"
          aria-label={t('open_synoptic_targets_navigation')}
          onClick={onOpen}
          className="flex h-5 w-11 items-center justify-center rounded-t-md bg-amber-400 text-amber-900 shadow-sm hover:bg-amber-500"
        >
          <ChevronDown className="size-3.5" />
        </button>
      </BaseTooltip>
    </div>
  )
}

export default NavigationCollapsed
