"use client"

import { useMemo } from "react"
import { useDesignSystem } from "@/components/design-system-context"
import { useTheme } from "@/components/theme-context"
import { 
  getEffectStyles, 
  getNeutralEffectStyles, 
  type EffectPreset,
  type EffectOptions,
  type EffectStyles 
} from "./effect-presets"

export interface HSL {
  h: number
  s: number
  l: number
}

export interface UseEffectPresetsReturn {
  /** Effect styles object */
  styles: EffectStyles | null
  /** Whether effects are currently enabled (not flat) */
  isEnabled: boolean
  /** Combined box-shadow for base state */
  boxShadow: string
  /** Combined box-shadow for hover state */
  boxShadowHover: string
  /** Background style */
  background: string
  /** Backdrop filter (for glassmorphism) */
  backdropFilter?: string
  /** Border style */
  border?: string
}

/**
 * Custom hook for accessing effect styles for colored components (buttons, etc.)
 * 
 * Automatically reads effectPreset from design system context and
 * calculates effect styles based on the provided color.
 * 
 * @param color - HSL color object
 * @param options - Optional configuration for effects
 * @returns Object containing effect styles and state
 * 
 * @example
 * ```tsx
 * const { styles, boxShadow, boxShadowHover, isEnabled, background } = useEffectPresets(
 *   { h: 114, s: 100, l: 58 }
 * )
 * 
 * <button
 *   style={{
 *     background: isEnabled ? background : baseColor,
 *     boxShadow: isEnabled ? boxShadow : 'none',
 *     backdropFilter: styles?.backdropFilter,
 *     border: styles?.border,
 *   }}
 *   onMouseEnter={(e) => {
 *     if (isEnabled) {
 *       e.currentTarget.style.boxShadow = boxShadowHover
 *     }
 *   }}
 * />
 * ```
 */
export function useEffectPresets(
  color: HSL,
  options?: EffectOptions
): UseEffectPresetsReturn {
  const { effectPreset } = useDesignSystem()
  const { mode } = useTheme()
  const isDark = mode === "dark"
  
  const result = useMemo(() => {
    const styles = getEffectStyles(effectPreset, color, isDark, options)
    const isEnabled = effectPreset !== "flat"
    
    return {
      styles: isEnabled ? styles : null,
      isEnabled,
      boxShadow: styles.boxShadow,
      boxShadowHover: styles.boxShadowHover,
      background: styles.background,
      backdropFilter: styles.backdropFilter,
      border: styles.border,
    }
  }, [effectPreset, color.h, color.s, color.l, isDark, options?.intensity])
  
  return result
}

/**
 * Custom hook for accessing neutral effect styles (for cards, panels, etc.)
 * 
 * Automatically reads effectPreset from design system context and
 * calculates neutral effect styles based on theme mode.
 * 
 * @param options - Optional configuration for effects
 * @returns Object containing neutral effect styles and state
 * 
 * @example
 * ```tsx
 * const { styles, boxShadow, boxShadowHover, isEnabled, background } = useNeutralEffectPresets()
 * 
 * <Card
 *   style={{
 *     background: isEnabled ? background : baseColor,
 *     boxShadow: isEnabled ? boxShadow : 'none',
 *     backdropFilter: styles?.backdropFilter,
 *     border: styles?.border,
 *   }}
 * />
 * ```
 */
export function useNeutralEffectPresets(
  options?: EffectOptions
): UseEffectPresetsReturn {
  const { effectPreset } = useDesignSystem()
  const { mode } = useTheme()
  const isDark = mode === "dark"
  
  const result = useMemo(() => {
    const styles = getNeutralEffectStyles(effectPreset, isDark, options)
    const isEnabled = effectPreset !== "flat"
    
    return {
      styles: isEnabled ? styles : null,
      isEnabled,
      boxShadow: styles.boxShadow,
      boxShadowHover: styles.boxShadowHover,
      background: styles.background,
      backdropFilter: styles.backdropFilter,
      border: styles.border,
    }
  }, [effectPreset, isDark, options?.intensity])
  
  return result
}
