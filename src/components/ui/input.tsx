import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          't-flex t-h-10 t-w-full t-rounded-md t-border t-border-gray-200 t-bg-white t-px-3 t-py-2 t-text-baset- ring-offset-white file:t-border-0 file:t-bg-transparent file:t-text-sm file:t-font-medium file:t-text-gray-950 placeholder:t-text-gray-500 focus-visible:t-outline-none focus-visible:t-ring-2 focus-visible:t-ring-primary/60 focus-visible:t-ring-offset-2 disabled:t-cursor-not-allowed disabled:t-opacity-50 md:t-text-sm dark:t-border-gray-800 dark:t-bg-gray-950 dark:t-ring-offset-gray-950 dark:file:t-text-gray-50 dark:placeholder:t-text-gray-400 dark:focus-visible:t-ring-gray-300',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
