import { FC } from 'react'
import { useConfig } from '@/contexts/ConfigContext.tsx'

const Title: FC = () => {
  const { title } = useConfig()

  return (
    <h1 className="text-base sm:text-lg font-bold truncate min-w-0 max-w-40 sm:max-w-64 xl:max-w-none">{ title }</h1>
  )
}

export default Title
