import { cn } from '@/lib/utils'

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('t-animate-pulse t-rounded-md t-bg-gray-100 dark:t-bg-gray-800', className)}
      {...props}
    />
  )
}

export { Skeleton }
