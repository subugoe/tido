import { FC, useState } from 'react'
import ContentTypesToggle from '@/components/panel/ContentTypesToggle.tsx'
import { ChevronDown, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

const TextOptions: FC = () => {
  const [visible, setVisible] = useState(true)

  return <>
    <div className={`relative top-[8px] ${visible ? 'opacity-100 delay-200' : 'opacity-0'} bg-accent border rounded-lg border-border flex transition-all`}>
      <ContentTypesToggle />
      <div className="border-l border-border">
        <Button variant="ghost" size="icon" onClick={() => setVisible(false)}>
          <EyeOff />
        </Button>
      </div>
    </div>
    <div
      className={`border-b border-x border-border bg-accent w-[32px] h-[18px] ${visible ? '-top-[18px]' : 'top-0 delay-200'} absolute left-1/2 -translate-x-1/2 transition-all cursor-pointer flex justify-center items-center`}
      onClick={() => setVisible(true)}
    >
      <ChevronDown size={16} />
    </div>
  </>
}

export default TextOptions
