"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

type SnapPoint = number // percentage of viewport height (0-100)

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  snapPoints?: SnapPoint[]
  initialSnap?: number // index of initial snap point
  className?: string
  showHandle?: boolean
  showCloseButton?: boolean
  isDark?: boolean
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPoints = [40, 80, 95],
  initialSnap = 0,
  className,
  showHandle = true,
  showCloseButton = true,
  isDark = false,
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(initialSnap)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const sheetRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const startHeight = useRef(0)

  const currentHeight = snapPoints[currentSnap]

  // Reset to initial snap when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentSnap(initialSnap)
      setDragOffset(0)
    }
  }, [isOpen, initialSnap])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const findClosestSnap = useCallback(
    (heightPercent: number): number => {
      let closestIndex = 0
      let minDistance = Math.abs(snapPoints[0] - heightPercent)

      for (let i = 1; i < snapPoints.length; i++) {
        const distance = Math.abs(snapPoints[i] - heightPercent)
        if (distance < minDistance) {
          minDistance = distance
          closestIndex = i
        }
      }
      return closestIndex
    },
    [snapPoints]
  )

  const handleDragStart = useCallback(
    (clientY: number) => {
      setIsDragging(true)
      startY.current = clientY
      startHeight.current = snapPoints[currentSnap]
    },
    [currentSnap, snapPoints]
  )

  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!isDragging) return

      const deltaY = startY.current - clientY
      const deltaPercent = (deltaY / window.innerHeight) * 100
      const newOffset = deltaPercent

      // Clamp within bounds
      const newHeight = startHeight.current + newOffset
      if (newHeight >= 10 && newHeight <= 98) {
        setDragOffset(newOffset)
      }
    },
    [isDragging]
  )

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return

    setIsDragging(false)
    const finalHeight = startHeight.current + dragOffset

    // If dragged below minimum, close the sheet
    if (finalHeight < 20) {
      onClose()
      setDragOffset(0)
      return
    }

    // Snap to closest point
    const newSnapIndex = findClosestSnap(finalHeight)
    setCurrentSnap(newSnapIndex)
    setDragOffset(0)
  }, [isDragging, dragOffset, findClosestSnap, onClose])

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // Mouse handlers (for testing on desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientY)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientY)
    }

    const handleMouseUp = () => {
      handleDragEnd()
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  if (!isOpen) return null

  const displayHeight = isDragging
    ? startHeight.current + dragOffset
    : currentHeight

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          isDark ? "bg-black/60" : "bg-black/40"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl",
          "transition-[height] ease-out",
          isDragging ? "duration-0" : "duration-300",
          isDark
            ? "bg-black border-t border-white/20"
            : "bg-white border-t border-gray-200",
          className
        )}
        style={{
          height: `${displayHeight}vh`,
          maxHeight: "98vh",
        }}
      >
        {/* Drag Handle */}
        {showHandle && (
          <div
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
          >
            <div
              className={cn(
                "w-12 h-1.5 rounded-full",
                isDark ? "bg-white/30" : "bg-gray-300"
              )}
            />
          </div>
        )}

        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className={cn(
              "absolute top-4 right-4 p-2 rounded-full transition-colors",
              "min-w-[44px] min-h-[44px] flex items-center justify-center",
              isDark
                ? "hover:bg-white/10 text-white/70"
                : "hover:bg-gray-100 text-gray-500"
            )}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}

        {/* Content */}
        <div className="h-full overflow-y-auto overscroll-contain pb-safe">
          {children}
        </div>
      </div>
    </>
  )
}

/**
 * Floating Action Button to trigger the bottom sheet
 */
interface FABProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
  isDark?: boolean
  className?: string
}

export function FloatingActionButton({
  onClick,
  icon,
  label,
  isDark = false,
  className,
}: FABProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "fixed bottom-6 right-6 z-30",
        "w-14 h-14 rounded-full shadow-lg",
        "flex items-center justify-center",
        "transition-all duration-200 ease-out",
        "active:scale-95 hover:shadow-xl",
        "min-w-[56px] min-h-[56px]", // Ensure touch target
        isDark
          ? "bg-white text-gray-900 hover:bg-gray-100"
          : "bg-gray-900 text-white hover:bg-gray-800",
        className
      )}
    >
      {icon}
    </button>
  )
}

