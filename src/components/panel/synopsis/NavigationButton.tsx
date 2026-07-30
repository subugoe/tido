import { FC, ReactNode } from 'react'

import { Button } from '@/components/ui/button.tsx'

interface Props {
  children: ReactNode
  ariaLabel: string
  isDisabled: boolean
  onSelect: () => void
}

const NavigationButton: FC<Props> = ({ children, ariaLabel, isDisabled, onSelect }) => {
  return (
    <Button
      size="icon"
      variant="ghost"
      disabled={isDisabled}
      className="h-6 w-6 rounded-full bg-amber-400 text-amber-900 hover:bg-amber-500 disabled:bg-amber-100 disabled:text-amber-300 disabled:opacity-100"
      aria-label={ariaLabel}
      data-cy="sync-target-nav-button"
      onClick={onSelect}
    >
      {children}
    </Button>
  )
}

export default NavigationButton
