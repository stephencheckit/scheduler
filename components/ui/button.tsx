import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-zinc-900 text-white hover:bg-zinc-800",
          variant === "outline" && "border border-zinc-300 bg-white hover:bg-zinc-100",
          variant === "ghost" && "hover:bg-zinc-100",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-8 px-3 py-1 text-xs",
          size === "lg" && "h-12 px-6 py-3 text-base",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

