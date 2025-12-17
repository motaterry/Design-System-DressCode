"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-context"

interface TooltipProps {
  children: React.ReactNode
  content: string
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function Tooltip({ children, content, side = "top", className }: TooltipProps) {
  const { mode } = useTheme()
  const isDark = mode === "dark"
  const [isVisible, setIsVisible] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const triggerRef = React.useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        x: rect.left + rect.width / 2,
        y: side === "top" ? rect.top : rect.bottom,
      })
    }
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  const sideStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  // Arrow position styles
  const arrowStyles = {
    top: "top-full left-1/2 -translate-x-1/2 -mt-1",
    bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1",
    left: "left-full top-1/2 -translate-y-1/2 -ml-1",
    right: "right-full top-1/2 -translate-y-1/2 -mr-1",
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 pointer-events-none whitespace-nowrap",
            sideStyles[side],
            className
          )}
          style={{
            left: side === "left" || side === "right" ? "auto" : `${position.x}px`,
            top: side === "top" || side === "bottom" ? "auto" : `${position.y}px`,
            transform: "none",
            backgroundColor: isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.7)",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
            borderRadius: "6px",
            fontSize: "11px",
            padding: "6px 10px",
            lineHeight: "1.3",
            backdropFilter: "blur(4px)",
            color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)",
            fontWeight: 500,
            boxShadow: isDark 
              ? "0 4px 12px rgba(0,0,0,0.3)" 
              : "0 4px 12px rgba(0,0,0,0.1)",
          }}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              "absolute w-2 h-2 rotate-45",
              arrowStyles[side]
            )}
            style={{
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.7)",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              borderWidth: side === "top" ? "0 1px 1px 0" : 
                           side === "bottom" ? "1px 0 0 1px" :
                           side === "left" ? "1px 1px 0 0" : "0 0 1px 1px",
              borderStyle: "solid",
            }}
          />
        </div>
      )}
    </>
  )
}

