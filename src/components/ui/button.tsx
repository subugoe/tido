import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  't-inline-flex t-items-center t-justify-center t-gap-2 t-whitespace-nowrap t-rounded-md t-text-sm t-font-medium t-ring-offset-white t-transition-colors focus-visible:t-outline-none focus-visible:t-ring-2 focus-visible:t-ring-gray-950 focus-visible:t-ring-offset-2 disabled:t-pointer-events-none disabled:t-opacity-50 [&_svg]:t-pointer-events-none [&_svg]:t-size-4 [&_svg]:t-shrink-0 dark:t-ring-offset-gray-950 dark:focus-visible:t-ring-gray-300',
  {
    variants: {
      variant: {
        default: 't-bg-gray-900 t-text-gray-50 hover:t-bg-gray-900/90 dark:t-bg-gray-50 dark:t-text-gray-900 dark:hover:t-bg-gray-50/90',
        destructive:
          't-bg-red-500 t-text-gray-50 hover:t-bg-red-500/90 dark:t-bg-red-900 dark:t-text-gray-50 dark:t-hover:bg-red-900/90',
        outline:
          't-border t-border-gray-200 t-bg-white hover:t-bg-gray-100 hover:t-text-gray-900 dark:t-border-gray-800 dark:t-bg-gray-950 dark:hover:t-bg-gray-800 dark:hover:t-text-gray-50',
        secondary:
          't-bg-gray-100 t-text-gray-900 hover:t-bg-gray-100/80 dark:t-bg-gray-800 dark:t-text-gray-50 dark:hover:t-bg-gray-800/80',
        secondarySelected:
          't-bg-gray-300 t-text-gray-900 hover:t-bg-gray-300/80 dark:t-bg-gray-700 dark:t-text-gray-50 dark:hover:t-bg-gray-700/80',
        ghost: 'hover:t-bg-gray-100 hover:t-text-gray-900 dark:hover:t-bg-gray-800 dark:hover:t-text-gray-50',
        ghostAmber: 't-text-amber-700 hover:t-bg-amber-300 hover:t-text-amber-800 dark:hover:t-bg-amber-800 dark:hover:t-text-gray-50',
        link: 't-text-gray-900 t-underline-offset-4 hover:t-underline dark:t-text-gray-50',
      },
      size: {
        default: 't-h-10 t-px-4 t-py-2',
        sm: 't-h-9 t-rounded-md t-px-3',
        lg: 't-h-11 t-rounded-md t-px-8',
        icon: 't-h-8 t-w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
