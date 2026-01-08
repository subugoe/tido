import { FC } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
interface Props {
  isPrev?: boolean
  isDisabled?: boolean
  navigate: () => void
  dataCy?: string
}

const NavigationButton: FC<Props> = ({ isPrev = false, isDisabled = false, navigate, dataCy }) => {

  return <Button
    variant="ghost"
    size="icon"
    disabled={isDisabled}
    className="rounded-lg"
    onClick={navigate}
    data-cy={dataCy}>
    { isPrev ? <ChevronLeft /> : <ChevronRight /> }
  </Button>
}

export default NavigationButton
