import { FC, MouseEvent } from 'react'
import { Button } from 'primereact/button'

import { contentStore } from '@/store/ContentStore'

interface ContentTypesToggleProps {
  panelIndex: number
}

const ContentTypesToggle: FC<ContentTypesToggleProps> = ({ panelIndex }) => {

  const contentTypes: string[] | undefined = contentStore(state => state.openedPanels[panelIndex].contentTypes)
  const activeContentTypeIndex: number = contentStore(state => state.openedPanels[panelIndex].t)
  const updateContentToggleIndex = contentStore(state => state.updateContentToggleIndex)

  function handleTextTabClick(e:MouseEvent<HTMLButtonElement>, i: number) {
    e.preventDefault()
    updateContentToggleIndex(panelIndex, i)
  }

  let buttons
  if (contentTypes) {
    buttons =
      contentTypes.length > 0 &&
      contentTypes.map((type, i) => (
          <Button
            className="t-p-1 t-rounded"
            style={{ backgroundColor: activeContentTypeIndex === i ? '#FFFFFF' : '' }}
            key={i}
            label={type}
            onClick={(e) => handleTextTabClick(e, i)}
          />
        ))
  }
   

  return (
    <div className="buttons-text-views t-bg-gray-400 t-p-1 t-rounded-md t-h-8">
      {buttons}
    </div>
  )
}

export default ContentTypesToggle
