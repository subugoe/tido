import { FC } from 'react'

interface Props {
  contentType: string,
  manifestLabel: string,
  itemLabel: string
}

const CrossRefTitle: FC<Props> = ({ contentType, manifestLabel, itemLabel }) => {
  return <div className="px-2 text-sm text-muted-foreground">
    <p className="mb-1">{manifestLabel ?? ''} </p>
    <p>{itemLabel ?? ''} { contentType !== '' && <span>{ ', ' + contentType }</span>}</p>
  </div>
}

export default CrossRefTitle
