import React, { FC, useEffect, useRef, useState } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  data: Annotation
  onMount: (target: HTMLElement, el: HTMLElement) => void
  onClick: (el: HTMLElement) => void
}

const Annotation: FC<Props> = React.memo(({ data, onMount, onClick }) => {
  const { panelId } = usePanel()
  const ref = useRef(null)
  const target = document.getElementById(panelId).querySelector(data.target[0].selector.value)
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    onMount(target, ref.current)
  }, [])

  function handleClick() {
    onClick(ref.current)
  }

  useEffect(() => {
    if (!ref.current) return
    setIsSelected(!!ref.current.dataset.highlighted)

  }, [ref.current?.dataset.highlighted])

  return <>
    <div
      ref={ref}
      className={`absolute flex-flex-col bg-background p-2 border border-border rounded-lg ${isSelected ? 'shadow-md' : 'shadow-sm'} w-4/5 transition-all`}
      onClick={handleClick}
    >
      { typeof data.body.value === 'string' ? <span>{ data.body.value }</span> : '' }
    </div>
  </>
})

export default Annotation
