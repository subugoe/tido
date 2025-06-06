import { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Checkbox } from '@/components/ui/checkbox.tsx'


interface Props {
  updateCheckedValue: (value: boolean) => void
}

const DisableSelectView: FC<Props> = ({ updateCheckedValue }) => {
  const isChecked = useRef<boolean>(false)
  const { t } = useTranslation()

  function handleCheckedChange(checked) {
    isChecked.current = !!checked
    updateCheckedValue(isChecked.current)
  }

  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="do-not-ask-again" onCheckedChange={(checked) => handleCheckedChange(checked)} />
      <label
        htmlFor="do-not-ask-again"
        className="text-sm font-normal text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {t('do_not_ask_again')}
      </label>
    </div>
  )
}

export default DisableSelectView
