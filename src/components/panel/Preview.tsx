import { FC, ReactNode } from 'react'

interface PreviewProps {
  children: ReactNode[],
  modes: Mode[],
  modeIndex: number,
  setModeIndex:(value: number) => void,
}

interface Mode {
  type: string
}

const Preview: FC<PreviewProps> = ({ children, modes, modeIndex, setModeIndex }) => {

  function updateModeIndex() {
    if (modeIndex === 0) {
      setModeIndex(1)
      return
    }
    setModeIndex(0)
  }

  return (
    <button onClick={() => updateModeIndex()} title={`Click to view the ${modes[modeIndex].type}`}>
      {children[modeIndex] }
    </button>
  )
}

export default Preview
