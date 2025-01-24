

import { FC, FormEvent, useRef } from 'react'

interface InputFieldProps {
    updateInputValue: (newValue: string) => void
}

const InputField: FC<InputFieldProps> = ({ updateInputValue }) => {

    const inputRef = useRef(null)

    function handleInput(e) {
        updateInputValue(e.target.value)
    }

    return <>
        <input ref={inputRef} className="t-border-solid t-border-[1.5px] t-w-[200px] t-h-[30px] t-mb-[10px]" onInput={(e) => handleInput(e)} />
    </>
}

export default InputField