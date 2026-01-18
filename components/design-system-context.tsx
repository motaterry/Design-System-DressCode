"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { type EffectPreset } from "@/lib/effect-presets"

export type ButtonTextColor = "dark" | "light" | "auto"

interface DesignSystemContextType {
  buttonTextColor: ButtonTextColor
  setButtonTextColor: (color: ButtonTextColor) => void
  borderRadius: number
  setBorderRadius: (radius: number) => void
  enable3D: boolean // Deprecated: kept for backward compatibility
  setEnable3D: (enabled: boolean) => void // Deprecated: kept for backward compatibility
  effectPreset: EffectPreset
  setEffectPreset: (preset: EffectPreset) => void
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined)

export function DesignSystemProvider({ children }: { children: React.ReactNode }) {
  // Always start with default values to match server render - default to "auto" for accessibility
  const [buttonTextColor, setButtonTextColorState] = useState<ButtonTextColor>("auto")
  const [borderRadius, setBorderRadiusState] = useState<number>(8)
  // Default to "3d" preset (maintains backward compatibility)
  const [effectPreset, setEffectPresetState] = useState<EffectPreset>("3d")
  // Deprecated: kept for backward compatibility - derived from effectPreset
  const [enable3D, setEnable3DState] = useState<boolean>(true)

  // Load from localStorage after hydration (client-side only)
  // Note: Default is always "auto" - only load saved value if user explicitly set it
  useEffect(() => {
    try {
      const savedButtonTextColor = localStorage.getItem("buttonTextColor") as ButtonTextColor
      // Only load saved value if it exists and is valid, otherwise keep default "auto"
      if (savedButtonTextColor && (savedButtonTextColor === "dark" || savedButtonTextColor === "light" || savedButtonTextColor === "auto")) {
        setButtonTextColorState(savedButtonTextColor)
      } else {
        // Ensure default is "auto" if no valid saved value
        setButtonTextColorState("auto")
      }

      const savedBorderRadius = localStorage.getItem("borderRadius")
      if (savedBorderRadius) {
        const parsed = parseInt(savedBorderRadius, 10)
        if (!isNaN(parsed)) {
          setBorderRadiusState(parsed)
        }
      }

      // Load effect preset (new system)
      const savedEffectPreset = localStorage.getItem("effectPreset") as EffectPreset
      if (savedEffectPreset && (savedEffectPreset === "3d" || savedEffectPreset === "glassmorphism" || savedEffectPreset === "flat")) {
        setEffectPresetState(savedEffectPreset)
        // Sync enable3D for backward compatibility
        setEnable3DState(savedEffectPreset !== "flat")
      } else {
        // Fallback: try to load old enable3D setting and migrate
        const savedEnable3D = localStorage.getItem("enable3D")
        if (savedEnable3D !== null) {
          const enabled = savedEnable3D === "true"
          setEnable3DState(enabled)
          setEffectPresetState(enabled ? "3d" : "flat")
        }
      }
    } catch {
      // localStorage may be unavailable in some environments (e.g., incognito mode, SSR)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--button-text-color", buttonTextColor)
    try {
      localStorage.setItem("buttonTextColor", buttonTextColor)
    } catch {
      // localStorage may be unavailable
    }
  }, [buttonTextColor])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--border-radius", `${borderRadius}px`)
    try {
      localStorage.setItem("borderRadius", borderRadius.toString())
    } catch {
      // localStorage may be unavailable
    }
  }, [borderRadius])

  // Sync effectPreset with enable3D for backward compatibility
  useEffect(() => {
    const root = document.documentElement
    const is3DEnabled = effectPreset === "3d"
    root.style.setProperty("--enable-3d", is3DEnabled ? "1" : "0")
    try {
      localStorage.setItem("effectPreset", effectPreset)
      // Keep enable3D in sync for backward compatibility
      localStorage.setItem("enable3D", is3DEnabled.toString())
      setEnable3DState(is3DEnabled)
    } catch {
      // localStorage may be unavailable
    }
  }, [effectPreset])

  const setButtonTextColor = useCallback((color: ButtonTextColor) => {
    setButtonTextColorState(color)
  }, [])

  const setBorderRadius = useCallback((radius: number) => {
    setBorderRadiusState(radius)
  }, [])

  const setEffectPreset = useCallback((preset: EffectPreset) => {
    setEffectPresetState(preset)
  }, [])

  // Deprecated: kept for backward compatibility
  const setEnable3D = useCallback((enabled: boolean) => {
    setEnable3DState(enabled)
    // Migrate to new preset system
    setEffectPresetState(enabled ? "3d" : "flat")
  }, [])

  return (
    <DesignSystemContext.Provider
      value={{
        buttonTextColor,
        setButtonTextColor,
        borderRadius,
        setBorderRadius,
        enable3D, // Deprecated: kept for backward compatibility
        setEnable3D, // Deprecated: kept for backward compatibility
        effectPreset,
        setEffectPreset,
      }}
    >
      {children}
    </DesignSystemContext.Provider>
  )
}

export function useDesignSystem() {
  const context = useContext(DesignSystemContext)
  if (context === undefined) {
    throw new Error("useDesignSystem must be used within a DesignSystemProvider")
  }
  return context
}

