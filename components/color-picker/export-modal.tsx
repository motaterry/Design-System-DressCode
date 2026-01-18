"use client"

import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Download, FileCode, Palette, FileJson, Check, Copy } from "lucide-react"
import { useColorTheme } from "./color-context"
import { useTheme } from "@/components/theme-context"
import { useDesignSystem } from "@/components/design-system-context"
import { hslToHex } from "@/lib/color-utils"
import { Tooltip } from "@/components/ui/tooltip"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
}

type ExportFormat = "css" | "tailwind" | "json" | "scss"

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { theme } = useColorTheme()
  const { mode } = useTheme()
  const { buttonTextColor, borderRadius } = useDesignSystem()
  const isDark = mode === "dark"
  
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("css")
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Ensure we only render portal on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate CSS Variables export
  const generateCSS = () => {
    const primaryHex = hslToHex(theme.primary.h, theme.primary.s, theme.primary.l)
    const compHex = hslToHex(theme.complementary.h, theme.complementary.s, theme.complementary.l)
    
    return `/* DressCode Design System Export */
/* Generated at ${new Date().toISOString()} */

:root {
  /* Primary Color */
  --primary-h: ${theme.primary.h};
  --primary-s: ${theme.primary.s}%;
  --primary-l: ${theme.primary.l}%;
  --color-primary: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
  --color-primary-hex: ${primaryHex};

  /* Complementary Color */
  --comp-h: ${theme.complementary.h};
  --comp-s: ${theme.complementary.s}%;
  --comp-l: ${theme.complementary.l}%;
  --color-complementary: hsl(var(--comp-h), var(--comp-s), var(--comp-l));
  --color-complementary-hex: ${compHex};

  /* Design System Settings */
  --border-radius: ${borderRadius}px;
  --button-text-color: ${buttonTextColor};

  /* Lighter Tones (Tints) */
${theme.tints.map((color, i) => `  --tint-${(i + 1) * 10}: ${color};`).join('\n')}

  /* Darker Tones (Shades) */
${theme.shades.map((color, i) => `  --shade-${(i + 1) * 10}: ${color};`).join('\n')}

  /* Neutral Lighter */
${theme.neutralLighter.map((color, i) => `  --neutral-light-${(i + 1) * 10}: ${color};`).join('\n')}

  /* Neutral Darker */
${theme.neutralDarker.map((color, i) => `  --neutral-dark-${(i + 1) * 10}: ${color};`).join('\n')}

  /* Background colors - Dark Mode Default */
  --background: 222 47% 11%;
  --foreground: 0 0% 98%;

  /* Card colors */
  --card: 222 47% 11%;
  --card-foreground: 0 0% 98%;

  /* Border and input */
  --border: 217 33% 17%;
  --input: 217 33% 17%;
  --ring: var(--color-primary);

  /* Neutral color tokens - Dark Mode */
  --neutral-50: 0 0% 98%;
  --neutral-100: 0 0% 96%;
  --neutral-200: 0 0% 90%;
  --neutral-300: 0 0% 83%;
  --neutral-400: 0 0% 64%;
  --neutral-500: 0 0% 45%;
  --neutral-600: 0 0% 32%;
  --neutral-700: 0 0% 23%;
  --neutral-800: 0 0% 15%;
  --neutral-900: 0 0% 9%;
  --neutral-950: 0 0% 3%;

  /* Component backgrounds - Dark Mode */
  --input-bg: 0 0% 15%;
  --input-border: 0 0% 25%;
  --button-outline-bg: transparent;
  --button-outline-border: 0 0% 25%;
  --button-ghost-bg-hover: 0 0% 20%;
  --switch-unchecked-bg: 0 0% 20%;
  
  /* Toast backgrounds - Dark Mode */
  --toast-default-bg: 0 0% 15%;
  --toast-default-border: 0 0% 25%;
  
  /* Text colors - Dark Mode */
  --text-primary: 0 0% 100%;
  --text-secondary: 0 0% 80%;
  --text-tertiary: 0 0% 60%;
  --text-muted: 0 0% 50%;
  --text-disabled: 0 0% 40%;
  
  /* Bar chart base colors - Dark Mode */
  --color-primary-chart: var(--color-primary);
  --color-complementary-chart: var(--color-complementary);
  
  /* Bar chart hover colors - Dark Mode */
  --primary-l-hover: min(100%, calc(var(--primary-l) + 15%));
  --color-primary-hover: hsl(var(--primary-h), var(--primary-s), var(--primary-l-hover));
  --comp-l-hover: min(100%, calc(var(--comp-l) + 15%));
  --color-complementary-hover: hsl(var(--comp-h), var(--comp-s), var(--comp-l-hover));
  
  /* Focus visible color - Dark Mode */
  --primary-l-focus: max(0%, calc(var(--primary-l) - 20%));
  --color-primary-focus: hsl(var(--primary-h), var(--primary-s), var(--primary-l-focus));
}

[data-theme="light"] {
  /* Background colors - Light Mode */
  --background: 0 0% 98%;
  --foreground: 0 0% 9%;

  /* Card colors - Light Mode */
  --card: 0 0% 100%;
  --card-foreground: 0 0% 9%;

  /* Border and input - Light Mode */
  --border: 0 0% 90%;
  --input: 0 0% 96%;

  /* Component backgrounds - Light Mode */
  --input-bg: 0 0% 100%;
  --input-border: 0 0% 80%;
  --button-outline-bg: transparent;
  --button-outline-border: 0 0% 80%;
  --button-ghost-bg-hover: 0 0% 96%;
  --switch-unchecked-bg: 0 0% 90%;
  
  /* Toast backgrounds - Light Mode */
  --toast-default-bg: 0 0% 100%;
  --toast-default-border: 0 0% 85%;
  
  /* Text colors - Light Mode */
  --text-primary: 0 0% 9%;
  --text-secondary: 0 0% 25%;
  --text-tertiary: 0 0% 45%;
  --text-muted: 0 0% 55%;
  --text-disabled: 0 0% 65%;
  
  /* Primary color darker tone for labels in light mode */
  --primary-l-darker: max(0%, calc(var(--primary-l) - 20%));
  --color-primary-darker: hsl(var(--primary-h), var(--primary-s), var(--primary-l-darker));
  
  /* Bar chart base colors - Light Mode */
  --primary-l-chart: min(100%, calc(var(--primary-l) + 15%));
  --color-primary-chart: hsl(var(--primary-h), var(--primary-s), var(--primary-l-chart));
  --comp-l-chart: min(100%, calc(var(--comp-l) + 15%));
  --color-complementary-chart: hsl(var(--comp-h), var(--comp-s), var(--comp-l-chart));
  
  /* Bar chart hover colors - Light Mode */
  --primary-l-hover: max(0%, calc(var(--primary-l) - 15%));
  --color-primary-hover: hsl(var(--primary-h), var(--primary-s), var(--primary-l-hover));
  --comp-l-hover: max(0%, calc(var(--comp-l) - 15%));
  --color-complementary-hover: hsl(var(--comp-h), var(--comp-s), var(--comp-l-hover));
  
  /* Focus visible color - Light Mode */
  --primary-l-focus: min(100%, calc(var(--primary-l) + 15%));
  --color-primary-focus: hsl(var(--primary-h), var(--primary-s), var(--primary-l-focus));
}
`
  }

  // Generate Tailwind Config export
  const generateTailwind = () => {
    const primaryHex = hslToHex(theme.primary.h, theme.primary.s, theme.primary.l)
    const compHex = hslToHex(theme.complementary.h, theme.complementary.s, theme.complementary.l)
    
    return `// DressCode Design System - Tailwind Config
// Generated at ${new Date().toISOString()}

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${primaryHex}',
          light: '${theme.tints[2] || primaryHex}',
          dark: '${theme.shades[2] || primaryHex}',
        },
        complementary: {
          DEFAULT: '${compHex}',
          light: '${theme.tints[5] || compHex}',
          dark: '${theme.shades[5] || compHex}',
        },
        tint: {
${theme.tints.map((color, i) => `          ${(i + 1) * 10}: '${color}',`).join('\n')}
        },
        shade: {
${theme.shades.map((color, i) => `          ${(i + 1) * 10}: '${color}',`).join('\n')}
        },
        neutral: {
          light: {
${theme.neutralLighter.map((color, i) => `            ${(i + 1) * 10}: '${color}',`).join('\n')}
          },
          dark: {
${theme.neutralDarker.map((color, i) => `            ${(i + 1) * 10}: '${color}',`).join('\n')}
          },
        },
      },
      borderRadius: {
        DEFAULT: '${borderRadius}px',
      },
    },
  },
}
`
  }

  // Generate SCSS Variables export
  const generateSCSS = () => {
    const primaryHex = hslToHex(theme.primary.h, theme.primary.s, theme.primary.l)
    const compHex = hslToHex(theme.complementary.h, theme.complementary.s, theme.complementary.l)
    
    return `// DressCode Design System Export (SCSS)
// Generated at ${new Date().toISOString()}

// Primary Color
$primary-h: ${theme.primary.h};
$primary-s: ${theme.primary.s}%;
$primary-l: ${theme.primary.l}%;
$color-primary: hsl($primary-h, $primary-s, $primary-l);
$color-primary-hex: ${primaryHex};

// Complementary Color
$comp-h: ${theme.complementary.h};
$comp-s: ${theme.complementary.s}%;
$comp-l: ${theme.complementary.l}%;
$color-complementary: hsl($comp-h, $comp-s, $comp-l);
$color-complementary-hex: ${compHex};

// Design System Settings
$border-radius: ${borderRadius}px;
$button-text-color: ${buttonTextColor};

// Lighter Tones (Tints)
${theme.tints.map((color, i) => `$tint-${(i + 1) * 10}: ${color};`).join('\n')}

// Darker Tones (Shades)
${theme.shades.map((color, i) => `$shade-${(i + 1) * 10}: ${color};`).join('\n')}

// Neutral Lighter
${theme.neutralLighter.map((color, i) => `$neutral-light-${(i + 1) * 10}: ${color};`).join('\n')}

// Neutral Darker
${theme.neutralDarker.map((color, i) => `$neutral-dark-${(i + 1) * 10}: ${color};`).join('\n')}

// Background colors - Dark Mode Default
$background-dark: 222 47% 11%;
$foreground-dark: 0 0% 98%;

// Card colors - Dark Mode
$card-dark: 222 47% 11%;
$card-foreground-dark: 0 0% 98%;

// Border and input - Dark Mode
$border-dark: 217 33% 17%;
$input-dark: 217 33% 17%;

// Component backgrounds - Dark Mode
$input-bg-dark: 0 0% 15%;
$input-border-dark: 0 0% 25%;
$button-outline-bg-dark: transparent;
$button-outline-border-dark: 0 0% 25%;
$button-ghost-bg-hover-dark: 0 0% 20%;
$switch-unchecked-bg-dark: 0 0% 20%;

// Toast backgrounds - Dark Mode
$toast-default-bg-dark: 0 0% 15%;
$toast-default-border-dark: 0 0% 25%;

// Text colors - Dark Mode
$text-primary-dark: 0 0% 100%;
$text-secondary-dark: 0 0% 80%;
$text-tertiary-dark: 0 0% 60%;
$text-muted-dark: 0 0% 50%;
$text-disabled-dark: 0 0% 40%;

// Background colors - Light Mode
$background-light: 0 0% 98%;
$foreground-light: 0 0% 9%;

// Card colors - Light Mode
$card-light: 0 0% 100%;
$card-foreground-light: 0 0% 9%;

// Border and input - Light Mode
$border-light: 0 0% 90%;
$input-light: 0 0% 96%;

// Component backgrounds - Light Mode
$input-bg-light: 0 0% 100%;
$input-border-light: 0 0% 80%;
$button-outline-bg-light: transparent;
$button-outline-border-light: 0 0% 80%;
$button-ghost-bg-hover-light: 0 0% 96%;
$switch-unchecked-bg-light: 0 0% 90%;

// Toast backgrounds - Light Mode
$toast-default-bg-light: 0 0% 100%;
$toast-default-border-light: 0 0% 85%;

// Text colors - Light Mode
$text-primary-light: 0 0% 9%;
$text-secondary-light: 0 0% 25%;
$text-tertiary-light: 0 0% 45%;
$text-muted-light: 0 0% 55%;
$text-disabled-light: 0 0% 65%;
`
  }

  // Generate JSON Tokens export
  const generateJSON = () => {
    const primaryHex = hslToHex(theme.primary.h, theme.primary.s, theme.primary.l)
    const compHex = hslToHex(theme.complementary.h, theme.complementary.s, theme.complementary.l)
    
    const tokens = {
      $schema: "https://design-tokens.github.io/community-group/format/",
      name: "DressCode Design System",
      generatedAt: new Date().toISOString(),
      color: {
        primary: {
          hsl: {
            h: theme.primary.h,
            s: theme.primary.s,
            l: theme.primary.l,
          },
          hex: primaryHex,
        },
        complementary: {
          hsl: {
            h: theme.complementary.h,
            s: theme.complementary.s,
            l: theme.complementary.l,
          },
          hex: compHex,
        },
        tints: theme.tints.reduce((acc, color, i) => {
          acc[`${(i + 1) * 10}`] = color
          return acc
        }, {} as Record<string, string>),
        shades: theme.shades.reduce((acc, color, i) => {
          acc[`${(i + 1) * 10}`] = color
          return acc
        }, {} as Record<string, string>),
        neutralLighter: theme.neutralLighter.reduce((acc, color, i) => {
          acc[`${(i + 1) * 10}`] = color
          return acc
        }, {} as Record<string, string>),
        neutralDarker: theme.neutralDarker.reduce((acc, color, i) => {
          acc[`${(i + 1) * 10}`] = color
          return acc
        }, {} as Record<string, string>),
      },
      components: {
        dark: {
          background: "222 47% 11%",
          foreground: "0 0% 98%",
          card: "222 47% 11%",
          cardForeground: "0 0% 98%",
          border: "217 33% 17%",
          input: "217 33% 17%",
          inputBg: "0 0% 15%",
          inputBorder: "0 0% 25%",
          buttonOutlineBg: "transparent",
          buttonOutlineBorder: "0 0% 25%",
          buttonGhostBgHover: "0 0% 20%",
          switchUncheckedBg: "0 0% 20%",
          toastDefaultBg: "0 0% 15%",
          toastDefaultBorder: "0 0% 25%",
          textPrimary: "0 0% 100%",
          textSecondary: "0 0% 80%",
          textTertiary: "0 0% 60%",
          textMuted: "0 0% 50%",
          textDisabled: "0 0% 40%",
        },
        light: {
          background: "0 0% 98%",
          foreground: "0 0% 9%",
          card: "0 0% 100%",
          cardForeground: "0 0% 9%",
          border: "0 0% 90%",
          input: "0 0% 96%",
          inputBg: "0 0% 100%",
          inputBorder: "0 0% 80%",
          buttonOutlineBg: "transparent",
          buttonOutlineBorder: "0 0% 80%",
          buttonGhostBgHover: "0 0% 96%",
          switchUncheckedBg: "0 0% 90%",
          toastDefaultBg: "0 0% 100%",
          toastDefaultBorder: "0 0% 85%",
          textPrimary: "0 0% 9%",
          textSecondary: "0 0% 25%",
          textTertiary: "0 0% 45%",
          textMuted: "0 0% 55%",
          textDisabled: "0 0% 65%",
        },
      },
      spacing: {
        borderRadius: borderRadius,
      },
      settings: {
        buttonTextColor: buttonTextColor,
        mode: mode,
      },
    }
    
    return JSON.stringify(tokens, null, 2)
  }

  const getExportContent = () => {
    switch (selectedFormat) {
      case "css": return generateCSS()
      case "tailwind": return generateTailwind()
      case "json": return generateJSON()
      case "scss": return generateSCSS()
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getExportContent())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleDownload = () => {
    const content = getExportContent()
    const extension = selectedFormat === "json" ? "json" 
      : selectedFormat === "tailwind" ? "js" 
      : selectedFormat === "scss" ? "scss"
      : "css"
    const filename = `dresscode-theme.${extension}`
    
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isOpen || !mounted) return null

  const formats = [
    { id: "css" as const, label: "CSS Variables", icon: FileCode, desc: "Copy-paste ready" },
    { id: "scss" as const, label: "SCSS Variables", icon: FileCode, desc: "For SCSS projects" },
    { id: "tailwind" as const, label: "Tailwind Config", icon: Palette, desc: "For tailwind.config.js" },
    { id: "json" as const, label: "JSON Tokens", icon: FileJson, desc: "Design tokens format" },
  ]

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${
          isDark ? "bg-neutral-900 border border-white/10" : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${isDark ? "border-white/10" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDark ? "bg-white" : "bg-gray-900"
                }`}
              >
                <Download className={`w-5 h-5 ${isDark ? "text-gray-900" : "text-white"}`} />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Export Theme
                </h2>
                <p className={`text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>
                  Download your custom design system
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {/* Format Selection */}
          <div className="space-y-3 mb-6">
            <label className={`text-sm font-medium ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Export Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formats.map((format) => (
                <Tooltip key={format.id} content={format.desc} side="top">
                  <button
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-left flex flex-col min-h-[100px] ${
                      selectedFormat === format.id
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                        : isDark 
                          ? "border-white/10 hover:border-white/20 bg-white/5" 
                          : "border-gray-200 hover:border-gray-300 bg-gray-50"
                    }`}
                  >
                  <format.icon className={`w-5 h-5 mb-2 flex-shrink-0 ${
                    selectedFormat === format.id 
                      ? "text-[var(--color-primary)]" 
                      : isDark ? "text-white/60" : "text-gray-500"
                  }`} />
                  <div className={`text-sm font-medium mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {format.label}
                  </div>
                  <div className={`text-xs leading-tight break-words hidden sm:block flex-grow ${isDark ? "text-white/50" : "text-gray-500"}`}>
                    {format.desc}
                  </div>
                </button>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className={`text-sm font-medium ${isDark ? "text-white/80" : "text-gray-700"}`}>
              Preview
            </label>
            <div 
              className={`mt-2 p-4 rounded-xl font-mono text-xs overflow-auto max-h-40 ${
                isDark ? "bg-black/40 text-green-400" : "bg-gray-900 text-green-400"
              }`}
            >
              <pre className="whitespace-pre-wrap">{getExportContent().slice(0, 500)}...</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex gap-3 ${isDark ? "border-white/10" : "border-gray-200"}`}>
          <Tooltip content="Copy export code to clipboard" side="top">
            <button
              onClick={handleCopy}
              className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                isDark 
                  ? "bg-white/10 hover:bg-white/15 text-white" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </Tooltip>
          <Tooltip content="Download theme file" side="top">
            <button
              onClick={handleDownload}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                isDark 
                  ? "bg-white text-gray-900 hover:bg-gray-100" 
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              <Download className="w-5 h-5" />
              Download
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

