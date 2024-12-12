import { FC } from 'react'

interface ErrorProps {
  title?: string,
  message: string | boolean
}

const ErrorComponent: FC<ErrorProps> = ({ title, message }) => {
  return <div
    className="t-flex t-flex-col t-left-100 t-ml-10 t-mt-[20%] t-border-2 t-rounded-md t-p-1 t-border-slate-400">
    <span>{title ? title : ''}</span>
    <span>{message}</span>
  </div>

}
export default ErrorComponent
