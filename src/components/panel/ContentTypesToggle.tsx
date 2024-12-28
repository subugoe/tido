import { FC, MouseEvent } from 'react'
import { Button } from 'primereact/button'

import { contentStore } from '@/store/ContentStore'

interface ContentTypesToggleProps {
  panelIndex: number
  contentTypes: string[]
}


const ContentTypesToggle: FC<ContentTypesToggleProps> = ({ panelIndex, contentTypes}) => {


  const updateContentToggleIndex = contentStore(state => state.updateContentToggleIndex)
  const activeContentTypeIndex = contentStore(state => state.items[panelIndex].t)

  function handleTextTabClick(e:MouseEvent<HTMLButtonElement>, i: number) {
    e.preventDefault()
    updateContentToggleIndex(panelIndex, i)
  }

  const buttons =
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

  return (
    <div className="buttons-text-views t-bg-gray-400 t-p-1 t-rounded-md t-h-8">
      {buttons}
    </div>
  )
}

export default ContentTypesToggle
