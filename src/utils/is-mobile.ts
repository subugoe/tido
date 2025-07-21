// useIsMobile.ts
import { useEffect, useState } from 'react'

type Subscriber = (isMobile: boolean) => void;

let subscribers: Subscriber[] = []
let currentIsMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false

const notifySubscribers = () => {
  subscribers.forEach((callback) => callback(currentIsMobile))
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    const next = window.innerWidth <= 768
    if (next !== currentIsMobile) {
      currentIsMobile = next
      notifySubscribers()
    }
  })
}

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(currentIsMobile)

  useEffect(() => {
    const callback: Subscriber = (val) => setIsMobile(val)
    subscribers.push(callback)

    return () => {
      subscribers = subscribers.filter((fn) => fn !== callback)
    }
  }, [])

  return isMobile
}

export default useIsMobile
