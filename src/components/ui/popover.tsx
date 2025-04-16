import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '@/lib/utils'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      't-z-50 t-absolute t-rounded-md t-border t-border-gray-200 t-bg-white t-p-4 t-text-gray-950 t-shadow-md t-outline-none data-[state=open]:t-animate-in data-[state=closed]:t-animate-out data-[state=closed]:t-fade-out-0 data-[state=open]:t-fade-in-0 data-[state=closed]:t-zoom-out-95 data-[state=open]:t-zoom-in-95 data-[side=bottom]:t-slide-in-from-top-2 data-[side=left]:t-slide-in-from-right-2 data-[side=right]:t-slide-in-from-left-2 data-[side=top]:t-slide-in-from-bottom-2 dark:t-border-gray-800 dark:t-bg-gray-950 dark:t-text-gray-50',
      className
    )}
    {...props}
  />
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName
const ClosePopover = PopoverPrimitive.Close

export { Popover, PopoverTrigger, PopoverContent, ClosePopover, PopoverAnchor }
