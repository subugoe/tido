import { FC } from 'react'
import { ChevronDown } from 'lucide-react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import BaseTooltip from '@/components/base/BaseTooltip.tsx'

const COLLAPSED_POSITION = 'absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-[calc(100%-4px)]'

interface Props {
  onOpen: () => void
}

// The collapsed state of TargetNavigation: a small amber tab poking above the card that re-opens the control.
const NavigationCollapsed: FC<Props> = ({ onOpen }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  return (
    <div className={COLLAPSED_POSITION}>
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
