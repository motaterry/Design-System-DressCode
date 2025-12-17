"use client"

import { useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useTheme } from "@/components/theme-context"
import { useDesignSystem } from "@/components/design-system-context"
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip } from "recharts"

const total = 321
const percentage = Math.round((272 / total) * 100)

// Custom active shape for hover state - only color change, same size
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, cornerRadius } = props
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={cornerRadius}
        style={{ filter: "brightness(1.2)" }}
      />
    </g>
  )
}

export function DoughnutChartDemo() {
  const { mode } = useTheme()
  const { borderRadius } = useDesignSystem()
  const isDark = mode === "dark"
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const chartRef = useRef<HTMLDivElement>(null)
  
  // Calculate pie corner radius based on design system setting (capped for arc thickness)
  const pieCornerRadius = Math.min(borderRadius, 8)
  
  // Dynamic colors based on theme
  const unconfirmedColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"
  
  // Background ring data (full circle, no corner radius)
  const backgroundData = [{ name: "Background", value: 100, color: unconfirmedColor }]
  
  // Foreground arc data (only the filled portion with corner radius)
  const foregroundData = [
    { name: "Confirmed", value: 272, color: "var(--color-primary)" },
  ]
  
  const onPieLeave = () => setActiveIndex(undefined)
  
  // Track actual mouse position relative to chart container
  const handleMouseMove = (e: React.MouseEvent) => {
    if (chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg font-semibold ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          Schedule Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center pt-0">
        {/* Chart-centric layout: chart dominates, legend is secondary */}
        <div className="flex flex-col items-center gap-4">
          {/* Larger, more prominent chart */}
          <div 
            ref={chartRef}
            className="relative w-36 h-36"
            onMouseMove={handleMouseMove}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  wrapperStyle={{ pointerEvents: "none" }}
                  isAnimationActive={false}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const data = payload[0].payload
                    const chartCenter = 72
                    
                    // Use actual mouse position for true orbit behavior
                    const dx = mousePos.x - chartCenter
                    const dy = mousePos.y - chartCenter
                    const angle = Math.atan2(dy, dx)
                    
                    // Place tooltip on outer edge, orbiting with cursor
                    const orbitRadius = 62
                    const tooltipX = Math.cos(angle) * orbitRadius
                    const tooltipY = Math.sin(angle) * orbitRadius
                    
                    // Dynamic anchor based on position around the circle
                    const anchorX = Math.cos(angle) >= 0 ? "0%" : "-100%"
                    const anchorY = Math.sin(angle) >= 0 ? "0%" : "-100%"
                    
                    return (
                      <div style={{
                        backgroundColor: isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "6px",
                        fontSize: "11px",
                        padding: "6px 10px",
                        lineHeight: "1.3",
                        backdropFilter: "blur(4px)",
                        zIndex: 50,
                        transform: `translate(calc(${tooltipX}px + ${anchorX}), calc(${tooltipY}px + ${anchorY}))`,
                      }}>
                        <div style={{
                          fontWeight: 500,
                          marginBottom: "2px",
                          color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                        }}>{data.name}</div>
                        <div style={{
                          color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)",
                          fontWeight: 600,
                        }}>
                          {data.value} schedules
                        </div>
                      </div>
                    )
                  }}
                />
                {/* Background ring - full circle, no corner radius */}
                <Pie
                  data={backgroundData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={62}
                  dataKey="value"
                  stroke="none"
                  strokeWidth={0}
                  isAnimationActive={false}
                >
                  <Cell fill={unconfirmedColor} stroke="none" />
                </Pie>
                {/* Foreground arc - filled portion with corner radius */}
                <Pie
                  data={foregroundData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={62}
                  startAngle={90}
                  endAngle={90 - (272 / 320) * 360}
                  dataKey="value"
                  stroke="none"
                  strokeWidth={0}
                  cornerRadius={pieCornerRadius}
                  activeIndex={activeIndex === 0 ? 0 : undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={() => setActiveIndex(0)}
                  onMouseLeave={onPieLeave}
                >
                  <Cell 
                    fill="var(--color-primary)"
                    stroke="none"
                    style={{ 
                      cursor: "pointer",
                      transition: "all 0.2s ease-out"
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center content with better hierarchy - pointer-events-none to not block chart hover */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className={`text-3xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  {percentage}%
                </div>
                <div className={`text-[10px] uppercase tracking-wider mt-0.5 ${
                  isDark ? "text-white/50" : "text-gray-400"
                }`}>
                  confirmed
                </div>
              </div>
            </div>
          </div>
          
          {/* Compact, inline legend */}
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--color-primary)" }}
              />
              <span className={isDark ? "text-white/70" : "text-gray-600"}>
                <span className="font-medium">272</span> confirmed
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${
                isDark ? "bg-white/15" : "bg-gray-200"
              }`} />
              <span className={isDark ? "text-white/50" : "text-gray-400"}>
                <span className="font-medium">48</span> pending
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
