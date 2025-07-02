import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] overflow-hidden before:absolute before:inset-0 before:opacity-0 before:transition-opacity hover:before:opacity-100",
  {
    variants: {
      variant: {
        default: "rounded-2xl bg-gradient-primary text-white shadow-premium hover:shadow-glow hover:scale-[1.02] before:bg-gradient-to-r before:from-white/10 before:to-transparent",
        destructive:
          "rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-card hover:shadow-elegant",
        outline:
          "rounded-2xl border-2 border-border/50 bg-gradient-glass text-foreground backdrop-blur-xl hover:border-primary/20 hover:scale-[1.02] shadow-glass before:bg-gradient-to-r before:from-primary/5 before:to-transparent",
        secondary:
          "rounded-2xl bg-gradient-secondary text-white shadow-float hover:shadow-premium hover:scale-[1.02] before:bg-gradient-to-r before:from-white/10 before:to-transparent",
        ghost: "rounded-xl hover:bg-accent/10 hover:text-accent transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline transition-all duration-200",
        accent: "rounded-2xl bg-gradient-accent text-white shadow-float hover:shadow-glow hover:scale-[1.02] before:bg-gradient-to-r before:from-white/10 before:to-transparent",
        premium: "rounded-2xl bg-gradient-premium text-white shadow-premium hover:shadow-glow hover:scale-[1.02] before:bg-gradient-to-r before:from-white/20 before:to-transparent",
        glass: "rounded-2xl bg-gradient-glass text-foreground backdrop-blur-xl border border-white/10 hover:border-primary/20 hover:scale-[1.02] shadow-glass before:bg-gradient-to-r before:from-white/5 before:to-transparent",
      },
      size: {
        default: "h-12 px-8 py-4",
        sm: "h-9 rounded-xl px-6 text-sm",
        lg: "h-14 rounded-2xl px-10 text-base",
        icon: "h-12 w-12",
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
