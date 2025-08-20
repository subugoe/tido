import { FC, useMemo, useRef } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'


interface HintProps {
  top: number
}

const LINE_OFFSET = 12

const Hint: FC<HintProps> = ({ top }) => {
  return <div className={`absolute bg-primary h-[3px] w-full`} style={{ top }}></div>
}

const AnnotationHints: FC = () => {
  const { panelId, matchedAnnotationsMap, resizer, showTextOptions } = usePanel()
  const filteredAnnotations = Object.values(Object.fromEntries(Object.entries(matchedAnnotationsMap).filter(([, value]) => value.filtered === true))
  ).map(value => value.annotation)
  const ref = useRef()
  const hints = useMemo(() => {
    if (!filteredAnnotations || !ref.current) return []

    const targets: HTMLElement[] = filteredAnnotations.reduce((acc, cur) => {
      const selector = cur.target[0].selector.value
      const target = document.getElementById(panelId).querySelector(selector)
      if (target) return [...acc, target]
      return acc
    }, [])

    return targets.map((target, i) => {
      const scrollHeight = resizer.textContainerEl.offsetHeight
      const barHeight = ref.current.offsetHeight
      const multiplier = target.offsetTop / scrollHeight
      const top = barHeight * multiplier + LINE_OFFSET
      return <Hint key={target.tagName + i} top={top} />
    })
  }, [filteredAnnotations])

  return <div ref={ref} className={`absolute top-0 right-0 w-[16px] h-full flex opacity-[0.5] pointer-events-none ${showTextOptions ? 'pt-12' : ''}`}>
    { hints }
  </div>
}

export default AnnotationHints
