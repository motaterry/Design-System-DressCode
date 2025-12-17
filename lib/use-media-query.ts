"use client"

import { useState, useEffect } from "react"

/**
 * Hook to detect if a media query matches
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    
    // Set initial value
    setMatches(mediaQuery.matches)

    // Create listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener
    mediaQuery.addEventListener("change", handler)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handler)
    }
  }, [query])

  return matches
}

/**
 * Hook to detect if viewport is mobile-sized
 * @returns boolean - true if viewport width <= 768px
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)")
}

/**
 * Hook to detect if viewport is tablet-sized
 * @returns boolean - true if viewport width <= 1024px
 */
export function useIsTablet(): boolean {
  return useMediaQuery("(max-width: 1024px)")
}

