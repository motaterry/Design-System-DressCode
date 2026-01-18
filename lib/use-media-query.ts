"use client"

import { useState, useEffect, useSyncExternalStore, useCallback } from "react"

/**
 * SSR-safe function to get media query match
 * Returns false on server, actual match on client
 */
function getServerSnapshot(): boolean {
  return false
}

/**
 * Hook to detect if a media query matches
 * Uses useSyncExternalStore for proper SSR hydration support
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  // Subscribe function for useSyncExternalStore
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener("change", callback)
      return () => mediaQuery.removeEventListener("change", callback)
    },
    [query]
  )

  // Get current snapshot
  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches
  }, [query])

  // useSyncExternalStore handles SSR hydration correctly
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
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
 * @returns boolean - true if viewport width is between 769px and 1024px
 */
export function useIsTablet(): boolean {
  const isMobile = useIsMobile()
  const isTabletOrSmaller = useMediaQuery("(max-width: 1024px)")
  return !isMobile && isTabletOrSmaller
}

/**
 * Hook to detect if viewport should use mobile layout (mobile or tablet)
 * @returns boolean - true if viewport width <= 1024px
 */
export function useIsMobileOrTablet(): boolean {
  return useMediaQuery("(max-width: 1024px)")
}

