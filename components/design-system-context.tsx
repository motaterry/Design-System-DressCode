"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

export type ButtonTextColor = "dark" | "light" | "auto"

interface DesignSystemContextType {
  buttonTextColor: ButtonTextColor
  setButtonTextColor: (color: ButtonTextColor) => void
  borderRadius: number
  setBorderRadius: (radius: number) => void
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined)

export function DesignSystemProvider({ children }: { children: React.ReactNode }) {
  // Always start with default values to match server render - default to "auto" for accessibility
  const [buttonTextColor, setButtonTextColorState] = useState<ButtonTextColor>("auto")
  const [borderRadius, setBorderRadiusState] = useState<number>(8)

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

  const setButtonTextColor = useCallback((color: ButtonTextColor) => {
    setButtonTextColorState(color)
  }, [])

  const setBorderRadius = useCallback((radius: number) => {
    setBorderRadiusState(radius)
  }, [])

  return (
    <DesignSystemContext.Provider
      value={{
        buttonTextColor,
        setButtonTextColor,
        borderRadius,
        setBorderRadius,
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

