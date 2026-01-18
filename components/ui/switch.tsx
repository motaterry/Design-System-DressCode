"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import { useDesignSystem } from "@/components/design-system-context"
import { useTheme } from "@/components/theme-context"
import { isMonochromatic } from "@/lib/effect-presets"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const { effectPreset } = useDesignSystem()
  const { mode } = useTheme()
  const isDark = mode === "dark"
  const isMonochromaticPreset = isMonochromatic(effectPreset)
  
  // In monochromatic preset, thumb needs contrast with background
  // Dark mode (checked = white bg): thumb should be black
  // Light mode (checked = black bg): thumb should be white
  const thumbColorClass = isMonochromaticPreset
    ? isDark
      ? "data-[state=checked]:bg-black data-[state=unchecked]:bg-white"
      : "data-[state=checked]:bg-white data-[state=unchecked]:bg-black"
    : "bg-white"
  
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--color-primary)] data-[state=unchecked]:bg-[var(--color-switch-unchecked-bg)]",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-all duration-300 ease-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          thumbColorClass
        )}
      />
    </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
