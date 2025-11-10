import { FC } from 'react'
import AnnotationsHeader from '@/components/panel/annotations/AnnotationsHeader.tsx'
import AnnotationsView from '@/components/panel/annotations/AnnotationsView.tsx'

const SidebarView: FC = () => {
  return (
    <div className="flex flex-col h-full" data-sidebar-container>
      <AnnotationsHeader />
      <AnnotationsView />
    </div>
  )
}

export default SidebarView
