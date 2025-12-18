"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

type ThemeMode = "dark" | "light"

interface ThemeContextType {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Helper to safely get initial theme (reads from DOM attribute set by inline script)
function getInitialTheme(): ThemeMode {
  if (typeof window !== "undefined") {
    // Read from the data-theme attribute set by the inline script in layout.tsx
    const savedTheme = document.documentElement.getAttribute("data-theme") as ThemeMode
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme
    }
  }
  return "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(getInitialTheme)

  // Wrapped setMode that also persists to localStorage
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
    try {
      localStorage.setItem("theme", newMode)
    } catch (e) {
      // localStorage may be unavailable in some environments
    }
  }, [])

  // Apply theme to document root and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode)
  }, [mode])

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

