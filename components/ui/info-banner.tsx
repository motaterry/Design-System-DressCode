"use client"

import { cn } from "@/lib/utils"
import { UpdateIllustration } from "@/components/logo/update-illustration"

interface InfoBannerProps {
  /** Banner title */
  title: string
  /** Banner description/message */
  description: string
  /** Primary accent color for the illustration */
  accentColor?: string
  /** Whether dark mode is active */
  isDark?: boolean
  /** Additional CSS classes */
  className?: string
  /** Size of the illustration (default: 56) */
  illustrationSize?: number
  /** Optional action button */
  action?: {
    label: string
    onClick: () => void
  }
  /** Whether the banner can be dismissed */
  dismissible?: boolean
  /** Callback when dismissed */
  onDismiss?: () => void
}

/**
 * Info Banner component with branded illustration
 * Uses the dynamic UpdateIllustration for a unique, branded appearance
 */
export function InfoBanner({
  title,
  description,
  accentColor,
  isDark = false,
  className,
  illustrationSize = 56,
  action,
  dismissible = false,
  onDismiss,
}: InfoBannerProps) {
  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-xl transition-all duration-200",
        isDark
          ? "bg-white/5 border border-white/10"
          : "bg-gradient-to-br from-amber-50/80 to-orange-50/50 border border-amber-200/40",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Illustration */}
      <div className="shrink-0 flex items-start pt-0.5">
        <UpdateIllustration
          accentColor={accentColor}
          isDark={isDark}
          size={illustrationSize}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "text-sm font-semibold leading-tight",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            {title}
          </span>
          
          {/* Dismiss button */}
          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className={cn(
                "shrink-0 p-0.5 rounded transition-colors cursor-pointer",
                isDark
                  ? "text-white/50 hover:text-white/80 hover:bg-white/10"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              )}
              aria-label="Dismiss banner"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
        
        <p
          className={cn(
            "text-xs leading-relaxed",
            isDark ? "text-white/70" : "text-gray-600"
          )}
        >
          {description}
        </p>
        
        {/* Optional action button */}
        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              "mt-2 self-start px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer",
              isDark
                ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
            )}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

