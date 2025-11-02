import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none active:scale-95",
  {
    variants: {
      variant: {
        default:
          'bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md hover:scale-105 focus-visible:ring-primary-500',
        destructive:
          'bg-error-600 text-white shadow-sm hover:bg-error-700 hover:shadow-md hover:scale-105 focus-visible:ring-error-500',
        outline:
          'border-2 border-secondary-300 bg-white hover:bg-secondary-50 hover:border-primary-400 hover:scale-105 focus-visible:ring-primary-500',
        secondary:
          'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 hover:scale-105 focus-visible:ring-secondary-500',
        ghost:
          'hover:bg-secondary-100 hover:text-secondary-900 hover:scale-105 focus-visible:ring-secondary-500',
        link:
          'text-primary-600 underline-offset-4 hover:underline hover:scale-105 focus-visible:ring-primary-500',
        success:
          'bg-success-600 text-white shadow-sm hover:bg-success-700 hover:shadow-md hover:scale-105 focus-visible:ring-success-500',
        warning:
          'bg-warning-600 text-white shadow-sm hover:bg-warning-700 hover:shadow-md hover:scale-105 focus-visible:ring-warning-500',
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-sm",
        lg: "h-12 rounded-xl px-6 text-base",
        xl: "h-14 rounded-2xl px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
