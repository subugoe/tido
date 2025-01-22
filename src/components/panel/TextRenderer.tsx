import { FC, useEffect, useRef } from 'react'

interface Props {
  htmlString: string
}

const TextRenderer: FC<Props> = ({ htmlString }) => {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {

    if (!ref?.current) return

    const scrollContainer = ref.current as HTMLElement
    const parent = scrollContainer.parentElement
    if (!parent) return

    scrollContainer.innerHTML = htmlString
    const scrollTargets = scrollContainer?.querySelectorAll('[data-scroll-target]')
    scrollTargets.forEach(el => {
      el.classList.add('t-bg-gray-100')
    })

    scrollContainer.addEventListener('scroll', () => {
      const inViewHeight = 300

      scrollTargets.forEach(el => {
        const { top, left, bottom, right } = el.getBoundingClientRect()
        const parentRect = parent.getBoundingClientRect()
        const isInView =
          top >= parentRect.top &&
          left >= parentRect.left &&
          bottom <= parentRect.bottom &&
          right <= parentRect.right

        if (isInView && top <= inViewHeight) {
          console.log('hi')
          const parallelTarget = document.getElementById('manifest-2-item-1-scroll-1')
          console.log(parallelTarget)
          if (!parallelTarget) return
          const parallelScrollContainer = parallelTarget.parentElement
          if (!parallelScrollContainer) return


          parallelScrollContainer.scrollTo({
            top: parallelTarget.getBoundingClientRect().top,
            behavior: 'smooth'
          })

        }
      })
    })

  }, [htmlString])

  return <div ref={ref} className="t-h-full t-overflow-auto" />

}

export default TextRenderer
