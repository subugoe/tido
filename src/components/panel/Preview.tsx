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
      className="z-20 absolute border-2 border-gray-600 rounded-md p-[1px] w-20 h-24 overflow-hidden bottom-12 right-12 hover:brightness-[90%] transition-all"
      onClick={() => updateMode()}>
      <div className="hover:cursor-pointer bg-white w-full h-full flex justify-center items-center">
        {mode === 'A' ? previewA : previewB  }
      </div>
    </div>
  )
}

export default Preview
