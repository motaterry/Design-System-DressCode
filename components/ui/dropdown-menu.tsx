"use client"

import React, { useState, useRef, useEffect, createContext, useContext } from "react"
import { useTheme } from "@/components/theme-context"
import { cn } from "@/lib/utils"

interface DropdownContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isDark: boolean
}

const DropdownContext = createContext<DropdownContextValue | null>(null)

function useDropdown() {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error("Dropdown components must be used within a DropdownMenu")
  }
  return context
}

interface DropdownMenuProps {
  children: React.ReactNode
  className?: string
}

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { mode } = useTheme()
  const isDark = mode === "dark"
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, isDark }}>
      <div ref={containerRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

interface DropdownTriggerProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

export function DropdownTrigger({ children, className, asChild }: DropdownTriggerProps) {
  const { isOpen, setIsOpen, isDark } = useDropdown()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        handleClick(e)
        ;(children as React.ReactElement<any>).props.onClick?.(e)
      },
      "aria-expanded": isOpen,
      "aria-haspopup": "menu",
    })
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "p-1.5 rounded-md transition-all duration-200 ease-out cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]",
        isDark ? "hover:bg-white/10" : "hover:bg-gray-200",
        isOpen && (isDark ? "bg-white/10" : "bg-gray-200"),
        className
      )}
      aria-expanded={isOpen}
      aria-haspopup="menu"
    >
      {children}
    </button>
  )
}

interface DropdownContentProps {
  children: React.ReactNode
  className?: string
  align?: "start" | "center" | "end"
  sideOffset?: number
}

export function DropdownContent({ 
  children, 
  className, 
  align = "end",
  sideOffset = 4 
}: DropdownContentProps) {
  const { isOpen, isDark } = useDropdown()

  if (!isOpen) return null

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      role="menu"
      className={cn(
        "absolute z-50 min-w-[180px] overflow-hidden rounded-lg p-1",
        "shadow-lg border animate-in fade-in-0 zoom-in-95",
        "origin-top-right duration-150 ease-out",
        alignmentClasses[align],
        isDark 
          ? "bg-neutral-900 border-white/10 shadow-black/40" 
          : "bg-white border-gray-200 shadow-gray-200/50",
        className
      )}
      style={{ marginTop: sideOffset }}
    >
      {children}
    </div>
  )
}

interface DropdownItemProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  destructive?: boolean
  icon?: React.ReactNode
}

export function DropdownItem({ 
  children, 
  className, 
  onClick,
  disabled = false,
  destructive = false,
  icon
}: DropdownItemProps) {
  const { setIsOpen, isDark } = useDropdown()

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
      setIsOpen(false)
    }
  }

  return (
    <button
      role="menuitem"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md",
        "transition-colors duration-150 ease-out cursor-pointer",
        "focus:outline-none focus:ring-1",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && !destructive && (isDark 
          ? "text-white/90 hover:bg-white/10 focus:ring-white/20" 
          : "text-gray-700 hover:bg-gray-100 focus:ring-gray-300"),
        !disabled && destructive && (isDark
          ? "text-red-400 hover:bg-red-500/10 focus:ring-red-400/30"
          : "text-red-600 hover:bg-red-50 focus:ring-red-300"),
        className
      )}
    >
      {icon && (
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          {icon}
        </span>
      )}
      <span className="flex-1 text-left">{children}</span>
    </button>
  )
}

interface DropdownSeparatorProps {
  className?: string
}

export function DropdownSeparator({ className }: DropdownSeparatorProps) {
  const { isDark } = useDropdown()

  return (
    <div 
      role="separator"
      className={cn(
        "h-px my-1 -mx-1",
        isDark ? "bg-white/10" : "bg-gray-200",
        className
      )} 
    />
  )
}

interface DropdownLabelProps {
  children: React.ReactNode
  className?: string
}

export function DropdownLabel({ children, className }: DropdownLabelProps) {
  const { isDark } = useDropdown()

  return (
    <div
      className={cn(
        "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider",
        isDark ? "text-white/40" : "text-gray-400",
        className
      )}
    >
      {children}
    </div>
  )
}

