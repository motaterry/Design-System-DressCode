/**
 * 3D Effects Utility
 * 
 * Provides consistent calculation of 3D visual effects (gradients, shadows, glows)
 * for use across all components. This ensures visual consistency when applying
 * 3D effects to buttons, cards, charts, and other UI elements.
 */

export interface ThreeDEffectsOptions {
  /** Intensity multiplier for effects (0.0 to 2.0, default: 1.0) */
  intensity?: number
}

export interface ThreeDEffects {
  /** CSS linear gradient string for 3D depth effect */
  gradient: string
  /** Box-shadow string for base shadow effect */
  shadow: string
  /** Box-shadow string for glow effect */
  glow: string
  /** Enhanced box-shadow string for hover state */
  shadowHover: string
  /** Enhanced box-shadow string for glow on hover */
  glowHover: string
}

/**
 * Calculate 3D effects (gradients, shadows, glows) for a given HSL color
 * 
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @param options - Optional configuration
 * @returns Object containing CSS strings for 3D effects
 */
export function get3DEffects(
  h: number,
  s: number,
  l: number,
  options: ThreeDEffectsOptions = {}
): ThreeDEffects {
  const intensity = Math.max(0, Math.min(2, options.intensity ?? 1.0))
  
  // Calculate gradient stops with intensity adjustment
  // Top is lighter, bottom is darker for depth effect
  const gradientTopL = Math.min(100, l + 10 * intensity)
  const gradientBottomL = Math.max(0, l - 10 * intensity)
  
  // Calculate shadow and glow opacities with intensity
  const shadowOpacity = 0.3 * intensity
  const shadowSecondaryOpacity = 0.2 * intensity
  const glowOpacity = 0.2 * intensity
  
  // Hover state enhancements
  const hoverShadowOpacity = 0.4 * intensity
  const hoverShadowSecondaryOpacity = 0.3 * intensity
  const hoverGlowOpacity = 0.3 * intensity
  
  // Build gradient string
  const gradient = `linear-gradient(180deg, hsl(${h}, ${s}%, ${gradientTopL}%) 0%, hsl(${h}, ${s}%, ${gradientBottomL}%) 100%)`
  
  // Build shadow strings (multi-layer for depth)
  const shadow = `0 ${4 * intensity}px ${12 * intensity}px hsla(${h}, ${s}%, ${l}%, ${shadowOpacity}), 0 ${2 * intensity}px ${4 * intensity}px hsla(${h}, ${s}%, ${l}%, ${shadowSecondaryOpacity})`
  
  // Build glow strings
  const glow = `0 0 ${20 * intensity}px hsla(${h}, ${s}%, ${l}%, ${glowOpacity})`
  
  // Build hover shadow strings (enhanced)
  const shadowHover = `0 ${6 * intensity}px ${20 * intensity}px hsla(${h}, ${s}%, ${l}%, ${hoverShadowOpacity}), 0 ${4 * intensity}px ${8 * intensity}px hsla(${h}, ${s}%, ${l}%, ${hoverShadowSecondaryOpacity})`
  
  // Build hover glow string (enhanced)
  const glowHover = `0 0 ${30 * intensity}px hsla(${h}, ${s}%, ${l}%, ${hoverGlowOpacity})`
  
  return {
    gradient,
    shadow,
    glow,
    shadowHover,
    glowHover,
  }
}

/**
 * Calculate 3D effects using neutral tones (grays) for cards and other neutral components
 * 
 * Uses subtle gradients and shadows based on theme mode (light/dark) rather than
 * colored effects. Designed for cards, panels, and other neutral UI elements.
 * 
 * @param isDark - Whether dark mode is active
 * @param options - Optional configuration
 * @returns Object containing CSS strings for neutral 3D effects
 */
export function get3DEffectsNeutral(
  isDark: boolean,
  options: ThreeDEffectsOptions = {}
): ThreeDEffects {
  // Use lower intensity for cards (more subtle than buttons)
  const intensity = Math.max(0, Math.min(2, options.intensity ?? 0.7))
  
  // Neutral color base values
  // Dark mode: neutral-900 range (around 9-15% lightness)
  // Light mode: white/neutral-50 range (around 98-100% lightness)
  const baseLightness = isDark ? 12 : 100
  
  // Very subtle gradient stops (±3-5% instead of ±10% for buttons)
  const gradientTopL = isDark 
    ? Math.min(100, baseLightness + 3 * intensity)  // Slightly lighter top
    : Math.max(0, baseLightness - 2 * intensity)     // Slightly darker top (from white)
  const gradientBottomL = isDark
    ? Math.max(0, baseLightness - 3 * intensity)   // Slightly darker bottom
    : Math.max(0, baseLightness - 4 * intensity)   // Slightly darker bottom (from white)
  
  // Build gradient string (neutral grays, no saturation)
  const gradient = `linear-gradient(180deg, hsl(0, 0%, ${gradientTopL}%) 0%, hsl(0, 0%, ${gradientBottomL}%) 100%)`
  
  // Subtle shadows with lower opacity than buttons
  // Dark mode: lighter shadows (less contrast)
  // Light mode: darker shadows (more contrast)
  const shadowOpacity = isDark ? 0.15 * intensity : 0.08 * intensity
  const shadowSecondaryOpacity = isDark ? 0.1 * intensity : 0.05 * intensity
  
  // Build shadow strings (black shadows, no color tint)
  const shadow = `0 ${2 * intensity}px ${8 * intensity}px rgba(0, 0, 0, ${shadowOpacity}), 0 ${1 * intensity}px ${3 * intensity}px rgba(0, 0, 0, ${shadowSecondaryOpacity})`
  
  // Very subtle or no glow for cards (unlike buttons)
  const glow = "" // Cards don't need glow effects
  
  // Hover state shadows (slightly stronger but still subtle)
  const hoverShadowOpacity = isDark ? 0.2 * intensity : 0.12 * intensity
  const hoverShadowSecondaryOpacity = isDark ? 0.15 * intensity : 0.08 * intensity
  
  const shadowHover = `0 ${3 * intensity}px ${12 * intensity}px rgba(0, 0, 0, ${hoverShadowOpacity}), 0 ${2 * intensity}px ${6 * intensity}px rgba(0, 0, 0, ${hoverShadowSecondaryOpacity})`
  
  // No hover glow for cards
  const glowHover = ""
  
  return {
    gradient,
    shadow,
    glow,
    shadowHover,
    glowHover,
  }
}

