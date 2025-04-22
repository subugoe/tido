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
      className="t-z-20 t-absolute t-border-2 t-border-gray-600 t-rounded-md t-p-[1px] t-w-20 t-h-24 t-overflow-hidden t-bottom-12 t-right-12 hover:t-brightness-[90%] t-transition-all"
      onClick={() => updateMode()}>
      <div className="hover:t-cursor-pointer t-bg-white t-w-full t-h-full t-flex t-justify-center t-items-center">
        {mode === 'A' ? previewA : previewB  }
      </div>
    </div>
  )
}

export default Preview
