import { Checkbox } from '@/components/ui/checkbox.tsx'

import { FC, useRef } from 'react'

interface Props {
  updateCheckedValue: (value: boolean) => void
}

const CheckBoxInPopover: FC<Props> = ({ updateCheckedValue }) => {
  const isChecked = useRef<boolean>(false)

  function handleCheckedChange(checked) {
    isChecked.current = !!checked
    updateCheckedValue(isChecked.current)
  }

  return (
    <div className="flex items-center space-x-2 mt-4 ml-2">
      <Checkbox id="do-not-ask-again" onCheckedChange={(checked) => handleCheckedChange(checked)} />
      <label
        htmlFor="do-not-ask-again"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Do not ask again
      </label>
    </div>
  )
}

export default CheckBoxInPopover
