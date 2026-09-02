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
      size="iconSm"
      variant="ghost"
      disabled={isDisabled}
      aria-label={ariaLabel}
      data-cy="sync-target-nav-button"
      onClick={onSelect}
    >
      {children}
    </Button>
  )
}

export default NavigationButton
