import { FC, ReactNode } from 'react'

interface PreviewProps {
  textEl: ReactNode,
  textShown: boolean,
  setTextShown: (textShown: boolean) => void,
  imageUrl: string | undefined,
  imageDescription?: string,
  previewStyles: string,
  additionalTextPreviewStyles: string
}

const Preview: FC<PreviewProps> = ({ textEl, imageUrl, imageDescription, textShown, setTextShown, previewStyles, additionalTextPreviewStyles }) => {
  return (
    <button className={previewStyles} onClick={() => setTextShown(!textShown)} title={textShown ? 'Click to view the image': 'Click to view the text'}>
      {textShown ? <img src={imageUrl} alt={imageDescription} /> : <div className={additionalTextPreviewStyles}> {textEl} </div> }
    </button>
  )
}

export default Preview
