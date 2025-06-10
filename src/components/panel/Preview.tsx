import { FC, ReactNode } from 'react'

interface PreviewProps {
  previewA: ReactNode,
  previewB: ReactNode,
  mode: string,
  setMode: (value: string) => void,
}

const Preview: FC<PreviewProps> = ({ previewA, previewB, mode, setMode }) => {

  function updateMode() {
    if (mode === 'A') {
      setMode('B')
      return
    }
    setMode('A')
  }

  return (
    <div className="z-20 absolute p-[1px] bottom-12 right-12 transition-all"
      onClick={() => updateMode()}>
      {mode === 'A' ? previewA : previewB  }
    </div>
  )
}

export default Preview
