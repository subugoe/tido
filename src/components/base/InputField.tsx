import { FC } from 'react'

interface InputFieldProps {
    updateInputValue: (newValue: string) => void
}

const InputField: FC<InputFieldProps> = ({ updateInputValue }) => {

  return <>
    <input className="t-border-solid t-border-[1.5px] t-w-[200px] t-h-[30px] t-mb-[10px]"
      onChange={(e) => updateInputValue(e.target.value)}/>
  </>
}

export default InputField
