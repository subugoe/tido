import { FC } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer.tsx'
import AnnotationsList from '@/components/panel/annotations/AnnotationsList.tsx'
import { PanelRight } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

const AnnotationsDrawer: FC = () => {
  return <Drawer>
    <DrawerTrigger asChild>
      <Button variant="ghost" size="icon">
        <PanelRight />
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <div className="mx-auto w-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Move Goal</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <AnnotationsList />
        </div>
      </div>
    </DrawerContent>
  </Drawer>
}

export default AnnotationsDrawer
