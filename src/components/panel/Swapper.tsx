import { FC } from 'react'
import { Image, Text } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface PreviewProps {
  mode?: string,
  setMode?: (value: string) => void,
}

const Swapper: FC<PreviewProps> = ({ mode = 'A', setMode = () => {} }) => {
  const { usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()

  function updateMode() {
    if (mode === 'A') {
      setMode('B')
      return
    }
    setMode('A')
  }

  const previewA = <Button
    data-cy='preview-image'
    className="px-2 py-3 h-auto shadow-xl"
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
    className="px-2 py-3 h-auto shadow-xl"
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
      {mode === 'A' ? previewA : previewB  }
    </div>
  )
}

export default Swapper
