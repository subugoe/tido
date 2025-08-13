import { FC, useRef } from 'react'

import { Checkbox } from '@/components/ui/checkbox.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'


interface Props {
  onChange: (value: boolean) => void
}

const DontAskAgain: FC<Props> = ({ onChange }) => {
  const { usePanelTranslation } = usePanel()
  const isChecked = useRef<boolean>(false)
  const { t } = usePanelTranslation()

  function handleCheckedChange(checked) {
    isChecked.current = !!checked
    onChange(isChecked.current)
  }

  return (
    <div className="flex items-center">
      <Checkbox id="do-not-ask-again" onCheckedChange={(checked) => handleCheckedChange(checked)} />
      <label
        htmlFor="do-not-ask-again"
        className="text-sm font-normal ml-2 text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {t('do_not_ask_again')}
      </label>
    </div>
  )
}

export default DontAskAgain
