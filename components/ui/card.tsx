"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-context"
import { useDesignSystem } from "@/components/design-system-context"
import { useNeutralEffectPresets } from "@/lib/use-effect-presets"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { mode } = useTheme()
  const isDark = mode === "dark"
  
  // Get neutral effect styles for cards
  const { 
    styles,
    boxShadow, 
    boxShadowHover, 
    isEnabled: isEffectEnabled,
    background,
    backdropFilter,
    border
  } = useNeutralEffectPresets(
    { intensity: 0.7 }
  )
  
  // Base colors (fallback when effects are disabled)
  const baseBg = isDark ? "bg-neutral-900/90" : "bg-white"
  const baseBorder = isDark ? "border-white/10" : "border-gray-200"
  const baseHoverBorder = isDark ? "hover:border-white/20" : "hover:border-gray-300"
  
  // Apply effects when enabled
  const shouldApplyEffects = isEffectEnabled && styles
  
  // Build border effect using inset shadows for 3D preset (smooth gradient transition)
  // For other presets, use the border from styles
  const insetBorderShadow = shouldApplyEffects && !styles.border
    ? isDark
      ? [
          // Top highlight - bright white glow on top edge
          `inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`,
          // Bottom shadow - dark shadow on bottom edge  
          `inset 0 -1px 0 0 rgba(0, 0, 0, 0.3)`,
          // Subtle overall border glow
          `inset 0 0 0 1px rgba(255, 255, 255, 0.08)`,
        ].join(", ")
      : [
          // Top highlight - white glow on top edge
          `inset 0 1px 0 0 rgba(255, 255, 255, 0.8)`,
          // Bottom shadow - subtle dark on bottom edge
          `inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)`,
          // Subtle overall border
          `inset 0 0 0 1px rgba(0, 0, 0, 0.06)`,
        ].join(", ")
    : ""
  
  // Combine external shadow with inset border shadow (only for 3D preset)
  const combinedShadow = shouldApplyEffects && insetBorderShadow
    ? `${boxShadow}, ${insetBorderShadow}`
    : boxShadow
    
  const combinedShadowHover = shouldApplyEffects && insetBorderShadow
    ? `${boxShadowHover}, ${insetBorderShadow}`
    : boxShadowHover
  
  // Handle hover state for effects
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldApplyEffects && combinedShadowHover) {
      e.currentTarget.style.boxShadow = combinedShadowHover
    }
    props.onMouseEnter?.(e)
  }
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldApplyEffects && combinedShadow) {
      e.currentTarget.style.boxShadow = combinedShadow
    }
    props.onMouseLeave?.(e)
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-200 ease-out hover:-translate-y-0.5",
        // Only apply base border classes when effects are disabled or no border from preset
        !shouldApplyEffects && "border",
        !shouldApplyEffects && baseBorder,
        !shouldApplyEffects && baseHoverBorder,
        // Base background only when effects are disabled
        !shouldApplyEffects && baseBg,
        // Text colors
        isDark ? "text-white" : "text-gray-900",
        // Shadow classes (only when effects are disabled)
        !shouldApplyEffects && "shadow-sm",
        !shouldApplyEffects && "hover:shadow-md",
        className
      )}
      style={{
        borderRadius: "var(--border-radius)",
        // Merge props.style first (lower priority)
        ...props.style,
        // Apply effect background (override any background from props.style)
        ...(shouldApplyEffects && background ? { background: background } : {}),
        // Apply combined shadow (external + inset border for 3D, or just external for others)
        ...(shouldApplyEffects ? { boxShadow: combinedShadow } : {}),
        // Apply backdrop filter for glassmorphism
        ...(shouldApplyEffects && backdropFilter ? { backdropFilter: backdropFilter } : {}),
        // Apply border from preset (for glassmorphism and monochromatic)
        ...(shouldApplyEffects && border ? { border: border } : {}),
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
