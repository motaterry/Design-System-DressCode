/**
 * Effect Presets System
 * 
 * Provides a unified system for applying different visual effect styles
 * across components. Each preset defines how gradients, shadows, blur, and
 * other effects should be calculated.
 */

export type EffectPreset = "3d" | "glassmorphism" | "flat"

export interface EffectPresetConfig {
  id: EffectPreset
  name: string
  description: string
  gradient: boolean
  shadow: "none" | "soft" | "medium" | "strong" | "glow"
  blur: boolean
  intensity: number
}

export const EFFECT_PRESETS: Record<EffectPreset, EffectPresetConfig> = {
  "3d": {
    id: "3d",
    name: "3D",
    description: "Depth with gradients and shadows",
    gradient: true,
    shadow: "strong",
    blur: false,
    intensity: 1.0,
  },
  glassmorphism: {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Frosted glass effect with blur",
    gradient: false,
    shadow: "soft",
    blur: true,
    intensity: 0.8,
  },
  flat: {
    id: "flat",
    name: "Flat",
    description: "No effects, solid colors",
    gradient: false,
    shadow: "none",
    blur: false,
    intensity: 0,
  },
}

export interface EffectStyles {
  background: string
  boxShadow: string
  boxShadowHover: string
  backdropFilter?: string
  border?: string
  opacity?: number
}

export interface EffectOptions {
  intensity?: number
}

/**
 * Calculate effect styles for colored components (buttons, etc.)
 */
export function getEffectStyles(
  preset: EffectPreset,
  color: { h: number; s: number; l: number },
  isDark: boolean,
  options: EffectOptions = {}
): EffectStyles {
  const config = EFFECT_PRESETS[preset]
  const intensity = options.intensity ?? config.intensity

  switch (preset) {
    case "3d":
      return get3DEffectStyles(color, intensity)
    
    case "glassmorphism":
      return getGlassmorphismStyles(color, isDark, intensity)
    
    case "flat":
      return getFlatStyles(color)
    
    default:
      return getFlatStyles(color)
  }
}

/**
 * Calculate effect styles for neutral components (cards, panels, etc.)
 */
export function getNeutralEffectStyles(
  preset: EffectPreset,
  isDark: boolean,
  options: EffectOptions = {}
): EffectStyles {
  const config = EFFECT_PRESETS[preset]
  const intensity = options.intensity ?? config.intensity

  switch (preset) {
    case "3d":
      return getNeutral3DEffectStyles(isDark, intensity)
    
    case "glassmorphism":
      return getNeutralGlassmorphismStyles(isDark, intensity)
    
    case "flat":
      return getNeutralFlatStyles(isDark)
    
    default:
      return getNeutralFlatStyles(isDark)
  }
}

/**
 * 3D Effect Styles (colored)
 */
function get3DEffectStyles(
  color: { h: number; s: number; l: number },
  intensity: number
): EffectStyles {
  const h = color.h
  const s = color.s
  const l = color.l

  // Gradient stops
  const gradientTopL = Math.min(100, l + 10 * intensity)
  const gradientBottomL = Math.max(0, l - 10 * intensity)
  const gradient = `linear-gradient(180deg, hsl(${h}, ${s}%, ${gradientTopL}%) 0%, hsl(${h}, ${s}%, ${gradientBottomL}%) 100%)`

  // Shadows
  const shadowOpacity = 0.3 * intensity
  const shadowSecondaryOpacity = 0.2 * intensity
  const glowOpacity = 0.2 * intensity

  const shadow = `0 ${4 * intensity}px ${12 * intensity}px hsla(${h}, ${s}%, ${l}%, ${shadowOpacity}), 0 ${2 * intensity}px ${4 * intensity}px hsla(${h}, ${s}%, ${l}%, ${shadowSecondaryOpacity})`
  const glow = `0 0 ${20 * intensity}px hsla(${h}, ${s}%, ${l}%, ${glowOpacity})`
  const boxShadow = `${shadow}, ${glow}`

  // Hover shadows
  const hoverShadowOpacity = 0.4 * intensity
  const hoverShadowSecondaryOpacity = 0.3 * intensity
  const hoverGlowOpacity = 0.3 * intensity

  const shadowHover = `0 ${6 * intensity}px ${20 * intensity}px hsla(${h}, ${s}%, ${l}%, ${hoverShadowOpacity}), 0 ${4 * intensity}px ${8 * intensity}px hsla(${h}, ${s}%, ${l}%, ${hoverShadowSecondaryOpacity})`
  const glowHover = `0 0 ${30 * intensity}px hsla(${h}, ${s}%, ${l}%, ${hoverGlowOpacity})`
  const boxShadowHover = `${shadowHover}, ${glowHover}`

  return {
    background: gradient,
    boxShadow,
    boxShadowHover,
  }
}

/**
 * Glassmorphism Effect Styles (colored)
 */
function getGlassmorphismStyles(
  color: { h: number; s: number; l: number },
  isDark: boolean,
  intensity: number
): EffectStyles {
  const h = color.h
  const s = color.s
  const l = color.l

  // Semi-transparent background with color tint
  // Glassmorphism uses moderate transparency (not too low, not too high)
  const baseOpacity = isDark ? 0.25 : 0.2
  const opacity = Math.min(0.4, baseOpacity * intensity)
  const background = `hsla(${h}, ${s}%, ${l}%, ${opacity})`

  // Strong backdrop blur for authentic glassmorphism (16-24px is standard)
  const blurAmount = 16 + (8 * intensity)
  const backdropFilter = `blur(${blurAmount}px) saturate(180%) brightness(1.05)`

  // Soft shadows with slight color tint
  const shadowOpacity = isDark ? 0.15 * intensity : 0.12 * intensity
  const boxShadow = `0 8px 32px rgba(0, 0, 0, ${shadowOpacity}), inset 0 1px 0 rgba(255, 255, 255, ${isDark ? 0.1 : 0.2})`

  // Slightly stronger on hover
  const hoverShadowOpacity = isDark ? 0.2 * intensity : 0.16 * intensity
  const boxShadowHover = `0 12px 40px rgba(0, 0, 0, ${hoverShadowOpacity}), inset 0 1px 0 rgba(255, 255, 255, ${isDark ? 0.15 : 0.25})`

  // Bright, subtle border (glassmorphism borders are bright and thin)
  const borderOpacity = isDark ? 0.4 : 0.3
  const border = `1px solid rgba(255, 255, 255, ${borderOpacity * intensity})`

  return {
    background,
    boxShadow,
    boxShadowHover,
    backdropFilter,
    border,
  }
}

/**
 * Flat Effect Styles (colored)
 */
function getFlatStyles(color: { h: number; s: number; l: number }): EffectStyles {
  const background = `hsl(${color.h}, ${color.s}%, ${color.l}%)`

  return {
    background,
    boxShadow: "none",
    boxShadowHover: "none",
  }
}

/**
 * Neutral 3D Effect Styles (for cards, panels)
 */
function getNeutral3DEffectStyles(isDark: boolean, intensity: number): EffectStyles {
  const baseLightness = isDark ? 12 : 100
  const gradientTopL = isDark 
    ? Math.min(100, baseLightness + 3 * intensity)
    : Math.max(0, baseLightness - 2 * intensity)
  const gradientBottomL = isDark
    ? Math.max(0, baseLightness - 3 * intensity)
    : Math.max(0, baseLightness - 4 * intensity)

  const gradient = `linear-gradient(180deg, hsl(0, 0%, ${gradientTopL}%) 0%, hsl(0, 0%, ${gradientBottomL}%) 100%)`

  const shadowOpacity = isDark ? 0.15 * intensity : 0.08 * intensity
  const shadowSecondaryOpacity = isDark ? 0.1 * intensity : 0.05 * intensity

  const shadow = `0 ${2 * intensity}px ${8 * intensity}px rgba(0, 0, 0, ${shadowOpacity}), 0 ${1 * intensity}px ${3 * intensity}px rgba(0, 0, 0, ${shadowSecondaryOpacity})`

  const hoverShadowOpacity = isDark ? 0.2 * intensity : 0.12 * intensity
  const hoverShadowSecondaryOpacity = isDark ? 0.15 * intensity : 0.08 * intensity

  const shadowHover = `0 ${3 * intensity}px ${12 * intensity}px rgba(0, 0, 0, ${hoverShadowOpacity}), 0 ${2 * intensity}px ${6 * intensity}px rgba(0, 0, 0, ${hoverShadowSecondaryOpacity})`

  return {
    background: gradient,
    boxShadow: shadow,
    boxShadowHover: shadowHover,
  }
}

/**
 * Neutral Glassmorphism Effect Styles (for cards, panels)
 */
function getNeutralGlassmorphismStyles(isDark: boolean, intensity: number): EffectStyles {
  // Glassmorphism background: always 5% white fill for cards
  // This provides a consistent glass-like appearance regardless of mode
  const background = `rgba(255, 255, 255, 0.05)`

  // Strong backdrop blur for authentic glassmorphism (16-24px is standard)
  const blurAmount = 16 + (8 * intensity)
  const backdropFilter = `blur(${blurAmount}px) saturate(180%) brightness(1.05)`

  // Soft shadows with inset highlight for glass effect
  const shadowOpacity = isDark ? 0.15 * intensity : 0.12 * intensity
  const boxShadow = `0 8px 32px rgba(0, 0, 0, ${shadowOpacity}), inset 0 1px 0 rgba(255, 255, 255, ${isDark ? 0.1 : 0.2})`

  const hoverShadowOpacity = isDark ? 0.2 * intensity : 0.16 * intensity
  const boxShadowHover = `0 12px 40px rgba(0, 0, 0, ${hoverShadowOpacity}), inset 0 1px 0 rgba(255, 255, 255, ${isDark ? 0.15 : 0.25})`

  // Bright, subtle border (glassmorphism borders are bright and thin)
  const borderOpacity = isDark ? 0.4 * intensity : 0.3 * intensity
  const border = `1px solid rgba(255, 255, 255, ${borderOpacity})`

  return {
    background,
    boxShadow,
    boxShadowHover,
    backdropFilter,
    border,
  }
}

/**
 * Neutral Flat Effect Styles (for cards, panels)
 */
function getNeutralFlatStyles(isDark: boolean): EffectStyles {
  const background = isDark ? "rgb(23, 23, 23)" : "rgb(255, 255, 255)"

  return {
    background,
    boxShadow: "none",
    boxShadowHover: "none",
  }
}
