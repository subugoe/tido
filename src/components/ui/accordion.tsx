'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="t-flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        't-flex t-flex-1 t-items-center t-justify-between t-py-1.5 t-pl-4 t-pr-2 t-mr-1 t-rounded-md  t-bg-gray-100 hover:t-bg-gray-200 t-text-gray-700 t-font-medium t-transition-all [&[data-state=open]>svg]:t-rotate-180 data-[state=open]:t-mb-4',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="t-h-4 t-w-4 t-shrink-0 t-transition-transform t-duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="t-overflow-hidden t-ml-4 t-text-sm t-transition-all data-[state=closed]:t-animate-accordion-up data-[state=open]:t-animate-accordion-down"
    {...props}
  >
    <div className={cn('t-pb-4 t-pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
