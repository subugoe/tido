import { FC, useState } from 'react'
import ContentTypesToggle from '@/components/panel/views/text/ContentTypesToggle.tsx'
import { ChevronDown, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

const TextOptions: FC<{ scrolled: boolean }> = ({ scrolled }) => {
  const [visible, setVisible] = useState(true)

  return <>
    <div className={`relative top-2 ${visible ? 'opacity-100 delay-200' : 'opacity-0'} bg-muted border rounded-full border-border flex transition-opacity`}>
      <div className={`w-full flex rounded-full transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
        <ContentTypesToggle />
        <div className="border-l border-border">
          <Button variant="ghost" size="iconSm" className="rounded-r-full rounded-l-none pl-2 pr-3" onClick={() => setVisible(false)}>
            <EyeOff />
          </Button>
        </div>
      </div>
    </div>
    <div
      className={`border-b border-x border-border bg-accent w-8 h-4.5 ${visible ? '-top-4.5' : 'top-0 delay-200'} absolute left-1/2 -translate-x-1/2 transition-all cursor-pointer flex justify-center items-center rounded-b-md`}
      onClick={() => setVisible(true)}
    >
      <ChevronDown size={16} />
    </div>
  </>
}

export default TextOptions
