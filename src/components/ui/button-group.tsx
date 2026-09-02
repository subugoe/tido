import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonGroupVariants = cva(
  'flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 [&>[data-slot=button-group]:not(:first-child)]:rounded-l-none [&>[data-slot=button-group]:not(:last-child)]:rounded-r-none',
  {
    variants: {
      orientation: {
        horizontal:
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
)

const ButtonGroup: React.FC<
  React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>
> = ({ className, orientation, ...props }) => {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

const ButtonGroupText: React.FC<
  React.ComponentProps<'div'> & {
    asChild?: boolean
  }
> = ({ className, asChild = false, ...props }) => {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      className={cn(
        'bg-muted shadow-xs flex items-center gap-2 rounded-md border px-4 text-sm font-medium [&_svg:not([class*="size-"])]:size-4 [&_svg]:pointer-events-none',
        className
      )}
      {...props}
    />
  )
}

const ButtonGroupSeparator: React.FC<
  React.ComponentProps<'div'> & {
    orientation?: 'horizontal' | 'vertical'
  }
> = ({ className, orientation = 'vertical', ...props }) => {
  return (
    <div
      data-slot="button-group-separator"
      className={cn(
        'bg-input relative !m-0 self-stretch',
        orientation === 'vertical' ? 'w-px' : 'mx-2 h-px',
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator,
  buttonGroupVariants,
}
