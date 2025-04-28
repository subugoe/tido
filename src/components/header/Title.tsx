import { FC } from 'react'
import { useConfigStore } from '@/store/ConfigStore.tsx'

const Title: FC = () => {
  const title = useConfigStore(state => state.config.title)

  return (
    <h1 className="t-text-lg t-font-bold">{ title }</h1>
  )
}

export default Title
