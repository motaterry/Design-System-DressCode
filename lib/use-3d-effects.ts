"use client"

import { useMemo } from "react"
import { get3DEffects, get3DEffectsNeutral, type ThreeDEffects, type ThreeDEffectsOptions } from "./3d-effects"
import { useDesignSystem } from "@/components/design-system-context"

export interface HSL {
  h: number
  s: number
  l: number
}

export interface Use3DEffectsReturn {
  /** 3D effect styles object */
  effects: ThreeDEffects | null
  /** Enhanced effects for hover states */
  hoverEffects: {
    shadow: string
    glow: string
  } | null
  /** Whether 3D effects are currently enabled */
  isEnabled: boolean
  /** Combined box-shadow for base state (shadow + glow) */
  boxShadow: string
  /** Combined box-shadow for hover state */
  boxShadowHover: string
}

/**
 * Custom hook for accessing 3D effects
 * 
 * Automatically reads enable3D state from design system context and
 * calculates 3D effects based on the provided color.
 * 
 * @param color - HSL color object
 * @param options - Optional configuration for 3D effects
 * @returns Object containing 3D effect styles and state
 * 
 * @example
 * ```tsx
 * const { effects, boxShadow, boxShadowHover, isEnabled } = use3DEffects(
 *   { h: 114, s: 100, l: 58 }
 * )
 * 
 * <button
 *   style={{
 *     background: isEnabled ? effects?.gradient : baseColor,
 *     boxShadow: isEnabled ? boxShadow : 'none',
 *   }}
 *   onMouseEnter={(e) => {
 *     if (isEnabled) {
 *       e.currentTarget.style.boxShadow = boxShadowHover
 *     }
 *   }}
 * />
 * ```
 */
export function use3DEffects(
  color: HSL,
  options?: ThreeDEffectsOptions
): Use3DEffectsReturn {
  const { enable3D } = useDesignSystem()
  
  const result = useMemo(() => {
    if (!enable3D) {
      return {
        effects: null,
        hoverEffects: null,
        isEnabled: false,
        boxShadow: "none",
        boxShadowHover: "none",
      }
    }
    
    const effects = get3DEffects(color.h, color.s, color.l, options)
    
    return {
      effects,
      hoverEffects: {
        shadow: effects.shadowHover,
        glow: effects.glowHover,
      },
      isEnabled: true,
      boxShadow: `${effects.shadow}, ${effects.glow}`,
      boxShadowHover: `${effects.shadowHover}, ${effects.glowHover}`,
    }
  }, [enable3D, color.h, color.s, color.l, options?.intensity])
  
  return result
}

/**
 * Custom hook for accessing neutral 3D effects (for cards, panels, etc.)
 * 
 * Automatically reads enable3D state from design system context and
 * calculates neutral 3D effects based on theme mode.
 * 
 * @param isDark - Whether dark mode is active
 * @param options - Optional configuration for 3D effects
 * @returns Object containing neutral 3D effect styles and state
 * 
 * @example
 * ```tsx
 * const { effects, boxShadow, boxShadowHover, isEnabled } = use3DEffectsNeutral(isDark)
 * 
 * <Card
 *   style={{
 *     background: isEnabled ? effects?.gradient : baseColor,
 *     boxShadow: isEnabled ? boxShadow : 'none',
 *   }}
 * />
 * ```
 */
export function use3DEffectsNeutral(
  isDark: boolean,
  options?: ThreeDEffectsOptions
): Use3DEffectsReturn {
  const { enable3D } = useDesignSystem()
  
  const result = useMemo(() => {
    if (!enable3D) {
      return {
        effects: null,
        hoverEffects: null,
        isEnabled: false,
        boxShadow: "none",
        boxShadowHover: "none",
      }
    }
    
    const effects = get3DEffectsNeutral(isDark, options)
    
    // For neutral effects, glow is empty, so just use shadow
    const boxShadow = effects.shadow || "none"
    const boxShadowHover = effects.shadowHover || "none"
    
    return {
      effects,
      hoverEffects: {
        shadow: effects.shadowHover,
        glow: effects.glowHover,
      },
      isEnabled: true,
      boxShadow,
      boxShadowHover,
    }
  }, [enable3D, isDark, options?.intensity])
  
  return result
}

