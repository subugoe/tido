import { FC } from 'react'
import { useConfig } from '@/contexts/ConfigContext.tsx'

const Title: FC = () => {
  const { title } = useConfig()

  return (
    <h1 className="text-lg font-bold">{ title }</h1>
  )
}

export default Title
