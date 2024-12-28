import { FC, MouseEvent } from 'react'
import { Button } from 'primereact/button'

import { contentStore } from '@/store/ContentStore'

interface ContentTypesToggleProps {
  panelIndex: number
  contentTypes: string[],
  activeContentTypeIndex: number,
  setActiveContentTypeIndex: (index: number) => void
}


const ContentTypesToggle: FC<ContentTypesToggleProps> = ({ panelIndex, contentTypes, activeContentTypeIndex, setActiveContentTypeIndex }) => {


  const updateContentToggleIndex = contentStore(state => state.updateContentToggleIndex)

  function handleTextTabClick(e:MouseEvent<HTMLButtonElement>, i: number) {
    e.preventDefault()
    // TODO: update the contentText View Index state for the current panel here !!
    updateContentToggleIndex(panelIndex, i)
    //setActiveContentTypeIndex(i)
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
