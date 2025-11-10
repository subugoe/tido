import { FC } from 'react'
import { Image, Text } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface PreviewProps {
  activeMode?: string,
  onChange?: (value: string) => void,
}

const Swapper: FC<PreviewProps> = ({ activeMode = 'A', onChange = () => {} }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  function updateMode() {
    if (activeMode === 'A') {
      onChange('B')
      return
    }
    onChange('A')
  }

  const previewA = <Button
    data-cy='preview-image'
    className="px-2 py-3 h-auto shadow-md bg-background"
    variant="outline"
    color="secondary"
  >
    <div className="flex flex-col justify-center items-center">
      <Image className="size-8 mb-2" />
      <div>{t('show_image')}</div>
    </div>
  </Button>

  const previewB = <Button
    data-cy='preview-text'
    className="px-2 py-3 h-auto shadow-md bg-background"
    variant="outline"
    color="secondary"
  >
    <div className="flex flex-col justify-center items-center">
      <Text className="size-8 mb-2" />
      <div>{t('show_text')}</div>
    </div>
  </Button>

  return (
    <div className="z-20 absolute p-[1px] bottom-12 right-12 transition-all"
      onClick={() => updateMode()}>
      {activeMode === 'A' ? previewA : previewB  }
    </div>
  )
}

export default Swapper
