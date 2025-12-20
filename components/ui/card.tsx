"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-context"
import { useDesignSystem } from "@/components/design-system-context"
import { use3DEffectsNeutral } from "@/lib/use-3d-effects"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { mode } = useTheme()
  const { enable3D } = useDesignSystem()
  const isDark = mode === "dark"
  
  // Get neutral 3D effects for cards
  const { effects, boxShadow, boxShadowHover, isEnabled: is3DEnabled } = use3DEffectsNeutral(
    isDark,
    { intensity: 0.7 }
  )
  
  // Base colors (fallback when 3D is disabled)
  const baseBg = isDark ? "bg-neutral-900/90" : "bg-white"
  const baseBorder = isDark ? "border-white/10" : "border-gray-200"
  const baseHoverBorder = isDark ? "hover:border-white/20" : "hover:border-gray-300"
  
  // Apply 3D effects when enabled
  const shouldApply3D = is3DEnabled && enable3D && effects
  
  // Calculate border colors for 3D effect (lighter top, darker bottom)
  const borderTopColor = shouldApply3D && isDark
    ? "rgba(255, 255, 255, 0.15)" // Lighter top border in dark mode
    : shouldApply3D && !isDark
    ? "rgba(0, 0, 0, 0.08)" // Lighter top border in light mode
    : undefined
    
  const borderBottomColor = shouldApply3D && isDark
    ? "rgba(255, 255, 255, 0.05)" // Darker bottom border in dark mode
    : shouldApply3D && !isDark
    ? "rgba(0, 0, 0, 0.12)" // Darker bottom border in light mode
    : undefined
  
  // Handle hover state for 3D effects
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldApply3D && boxShadowHover) {
      e.currentTarget.style.boxShadow = boxShadowHover
    }
    props.onMouseEnter?.(e)
  }
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldApply3D && boxShadow) {
      e.currentTarget.style.boxShadow = boxShadow
    }
    props.onMouseLeave?.(e)
  }
  
  // Build border style for 3D effect
  const borderStyle = shouldApply3D && borderTopColor && borderBottomColor
    ? {
        borderTop: `1px solid ${borderTopColor}`,
        borderRight: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
        borderBottom: `1px solid ${borderBottomColor}`,
        borderLeft: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
      }
    : {}
  
  return (
    <div
      ref={ref}
      className={cn(
        "backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-0.5",
        // Only apply base border classes when 3D is disabled
        !shouldApply3D && "border",
        !shouldApply3D && baseBorder,
        !shouldApply3D && baseHoverBorder,
        // Base background only when 3D is disabled
        !shouldApply3D && baseBg,
        // Text colors
        isDark ? "text-white" : "text-gray-900",
        // Shadow classes (only when 3D is disabled)
        !shouldApply3D && "shadow-sm",
        !shouldApply3D && "hover:shadow-md",
        className
      )}
      style={{
        borderRadius: "var(--border-radius)",
        // Apply 3D background gradient
        ...(shouldApply3D && effects ? { background: effects.gradient } : {}),
        // Apply 3D shadow
        ...(shouldApply3D ? { boxShadow } : {}),
        // Apply 3D border
        ...borderStyle,
        ...props.style, // Merge with any existing styles
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
