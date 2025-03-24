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
    <div
      className="t-z-20 t-absolute t-border-[2px] t-border-zinc-800 t-p-[1px] t-w-20 t-h-24 t-overflow-hidden t-bottom-12 t-right-12 hover:t-brightness-80"
      onClick={() => updateMode()}>
      <div className="hover:t-cursor-pointer hover:t-bg-gray-100 t-bg-white">
        {mode === 'A' ? previewA : previewB  }
      </div>
    </div>
  )
}

export default Preview
