import { FC } from 'react'

interface Props {
  size?: number
}

const Loading: FC<Props> = ({ size = 32 }) => {
  const dotSize = Math.max(4, Math.round(size / 5))

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex w-full h-full justify-center items-center gap-1"
    >
      <div
        className="rounded-full bg-gray-400"
        style={{
          width: dotSize,
          height: dotSize,
          animationName: 'tido-bounce',
          animationDuration: '1.5s',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-out',
          willChange: 'transform',
        }}
      />
      <div
        className="rounded-full bg-gray-400"
        style={{
          width: dotSize,
          height: dotSize,
          animationName: 'tido-bounce',
          animationDuration: '1.5s',
          animationDelay: '0.1s',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-out',
          willChange: 'transform',
        }}
      />
      <div
        className="rounded-full bg-gray-400"
        style={{
          width: dotSize,
          height: dotSize,
          animationName: 'tido-bounce',
          animationDuration: '1.5s',
          animationDelay: '0.2s',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-out',
          willChange: 'transform',
        }}
      />
    </div>
  )
}

export default Loading
