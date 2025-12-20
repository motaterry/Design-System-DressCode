"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { hslToHex, getAccessibleTextColor } from "@/lib/color-utils"
import { useTheme } from "@/components/theme-context"
import { useDesignSystem } from "@/components/design-system-context"
import { useColorTheme } from "@/components/color-picker/color-context"
import { use3DEffects } from "@/lib/use-3d-effects"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed relative [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&>*]:relative [&>*]:z-10",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]",
        outline: "",
        ghost: "",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        xs: "h-7 px-2.5 text-xs",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
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
    const { mode } = useTheme()
    const { buttonTextColor, enable3D } = useDesignSystem()
    const { theme } = useColorTheme()
    const isDark = mode === "dark"
    const Comp = asChild ? Slot : "button"
    
    // Get 3D effects for primary buttons
    const { effects, boxShadow, boxShadowHover, isEnabled: is3DEnabled } = use3DEffects(
      theme.primary,
      { intensity: 1.0 }
    )
    
    // Get primary color hex for contrast calculation
    const primaryHex = hslToHex(theme.primary.h, theme.primary.s, theme.primary.l)
    
    // Calculate the effective text color (handles "auto" mode)
    const getEffectiveTextColor = (): "dark" | "light" => {
      if (buttonTextColor === "auto") {
        return getAccessibleTextColor(primaryHex)
      }
      return buttonTextColor
    }
    
    const effectiveTextColor = getEffectiveTextColor()
    
    // Calculate hover color based on text color
    // White text buttons: darker on hover (5% darker)
    // Black text buttons: lighter on hover (20% lighter)
    const calculateHoverColor = (): string => {
      let hoverLightness: number
      
      if (effectiveTextColor === "light") {
        // White text → darken (reduce lightness by 5%)
        hoverLightness = Math.max(0, theme.primary.l - 5)
      } else {
        // Black text → lighten (increase lightness by 20%)
        hoverLightness = Math.min(100, theme.primary.l + 20)
      }
      
      return hslToHex(theme.primary.h, theme.primary.s, hoverLightness)
    }
    
    const hoverColor = variant === "default" || variant === undefined 
      ? calculateHoverColor() 
      : undefined
    
    // Determine text color for primary buttons based on button text color setting
    const getPrimaryTextColor = () => {
      return effectiveTextColor === "dark" ? "text-gray-900" : "text-white"
    }
    
    // For non-primary variants, use theme-aware colors
    const getNonPrimaryTextColor = () => {
      return isDark ? "text-white" : "text-gray-900"
    }
    
    const variantClasses = {
      default: `bg-[var(--color-primary)] ${getPrimaryTextColor()}`,
      outline: isDark
        ? `border-[var(--color-button-outline-border)] bg-neutral-800/50 hover:bg-neutral-800/70 ${getNonPrimaryTextColor()}`
        : `border-[var(--color-button-outline-border)] bg-neutral-100 hover:bg-neutral-200 ${getNonPrimaryTextColor()}`,
      ghost: isDark
        ? `bg-neutral-800/50 hover:bg-neutral-800/70 ${getNonPrimaryTextColor()}`
        : `bg-neutral-100 hover:bg-neutral-200 ${getNonPrimaryTextColor()}`,
    }
    
    // Apply text color via inline style for primary buttons to ensure it always takes precedence
    const textColorStyle = variant === "default" || variant === undefined 
      ? { color: effectiveTextColor === "dark" ? "#111827" : "#ffffff" } // gray-900 or white
      : undefined
    
    // Apply hover color via CSS custom property for primary buttons
    const hoverColorStyle = hoverColor 
      ? { "--color-primary-hover": hoverColor } as React.CSSProperties
      : undefined
    
    // Apply 3D effects for primary buttons when enabled
    const isPrimaryButton = variant === "default" || variant === undefined
    const shouldApply3D = isPrimaryButton && is3DEnabled && enable3D
    
    const threeDStyle = shouldApply3D && effects ? {
      background: effects.gradient,
      boxShadow: boxShadow,
    } : {}
    
    // Handle hover state for 3D effects - merge with existing handlers
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (shouldApply3D && boxShadowHover) {
        e.currentTarget.style.boxShadow = boxShadowHover
      }
      props.onMouseEnter?.(e)
    }
    
    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (shouldApply3D && boxShadow) {
        e.currentTarget.style.boxShadow = boxShadow
      }
      props.onMouseLeave?.(e)
    }
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          variant === "outline" && variantClasses.outline,
          variant === "ghost" && variantClasses.ghost,
          variant === "default" && !shouldApply3D && `bg-[var(--color-primary)]`,
          className
        )}
        style={{
          borderRadius: "var(--border-radius)",
          ...textColorStyle,
          ...hoverColorStyle,
          ...threeDStyle,
          transition: "all 200ms ease-out, box-shadow 200ms ease-out",
          ...props.style, // Merge with any existing styles
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
