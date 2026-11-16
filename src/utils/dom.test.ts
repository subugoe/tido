import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { onScrollEnd } from './dom.ts'

// The panel element only has to dispatch events here, which a plain EventTarget does in Node.
function createRoot() {
  return new EventTarget() as unknown as Element
}

function stubWindow(supportsScrollEnd: boolean) {
  vi.stubGlobal('window', {
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
    ...(supportsScrollEnd && { onscrollend: null }),
  })
}

describe('onScrollEnd', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  describe.each([true, false])('scrollend supported: %s', (supportsScrollEnd) => {
    beforeEach(() => stubWindow(supportsScrollEnd))

    it('runs right after a short wait when nothing scrolls', () => {
      const callback = vi.fn()
      onScrollEnd(createRoot(), callback)

      vi.advanceTimersByTime(149)
      expect(callback).not.toHaveBeenCalled()
      vi.advanceTimersByTime(1)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('runs at the latest after the hard limit when the scrolling does not stop', () => {
      const callback = vi.fn()
      const root = createRoot()
      onScrollEnd(root, callback)

      for (let t = 0; t < 2900; t += 100) {
        root.dispatchEvent(new Event('scroll'))
        vi.advanceTimersByTime(100)
      }
      expect(callback).not.toHaveBeenCalled()
      vi.advanceTimersByTime(100)
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  it('waits for scrollend however long the scroll takes, when scrollend is supported', () => {
    stubWindow(true)
    const callback = vi.fn()
    const root = createRoot()
    onScrollEnd(root, callback)

    root.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(1000)
    expect(callback).not.toHaveBeenCalled()

    root.dispatchEvent(new Event('scrollend'))
    vi.advanceTimersByTime(150)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('treats a scroll chained right after a scrollend as part of the same scrolling', () => {
    stubWindow(true)
    const callback = vi.fn()
    const root = createRoot()
    onScrollEnd(root, callback)

    root.dispatchEvent(new Event('scroll'))
    root.dispatchEvent(new Event('scrollend'))
    vi.advanceTimersByTime(100)
    root.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(500)
    expect(callback).not.toHaveBeenCalled()

    root.dispatchEvent(new Event('scrollend'))
    vi.advanceTimersByTime(150)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('runs once the scroll events have stopped, when scrollend is not supported', () => {
    stubWindow(false)
    const callback = vi.fn()
    const root = createRoot()
    onScrollEnd(root, callback)

    for (let i = 0; i < 5; i++) {
      root.dispatchEvent(new Event('scroll'))
      vi.advanceTimersByTime(100)
    }
    expect(callback).not.toHaveBeenCalled()
    vi.advanceTimersByTime(50)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('runs only once and stops listening afterwards', () => {
    stubWindow(true)
    const callback = vi.fn()
    const root = createRoot()
    onScrollEnd(root, callback)

    root.dispatchEvent(new Event('scroll'))
    root.dispatchEvent(new Event('scrollend'))
    vi.advanceTimersByTime(150)
    root.dispatchEvent(new Event('scroll'))
    root.dispatchEvent(new Event('scrollend'))
    vi.advanceTimersByTime(5000)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
