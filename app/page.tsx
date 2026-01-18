"use client"

import React from "react"
import { ColorSidebar } from "@/components/color-picker/color-sidebar"
import { ColorSidebarMobile, MobileInlineTitle, MobileHeader } from "@/components/color-picker/color-sidebar-mobile"
import { UserProfileCard } from "@/components/demo-components/user-profile-card"
import { NotificationsPanel } from "@/components/demo-components/notifications-panel"
import { CalendarWidget } from "@/components/demo-components/calendar-widget"
import { BarChartDemo } from "@/components/demo-components/bar-chart"
import { AreaChartDemo } from "@/components/demo-components/area-chart"
import { DoughnutChartDemo } from "@/components/demo-components/doughnut-chart"
import { RadixThemesComponent } from "@/components/demo-components/radix-themes-component"
import { ScrollingCardGrid } from "@/components/ui/scrolling-card-grid"
import { useTheme } from "@/components/theme-context"
import { useIsMobile, useIsMobileOrTablet } from "@/lib/use-media-query"
import { Tutorial } from "@/components/onboarding/tutorial"
import { useTutorial } from "@/lib/use-tutorial"
import { cn } from "@/lib/utils"

export default function ControlCenterPage() {
  const { mode } = useTheme()
  const isDark = mode === "dark"
  const isMobile = useIsMobile()
  const isMobileOrTablet = useIsMobileOrTablet()
  const { isCompleted, startTutorial } = useTutorial()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isTabletSidebarOpen, setIsTabletSidebarOpen] = React.useState(false)
  const [isSidebarMinimized, setIsSidebarMinimized] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-minimized")
      return saved === "true"
    }
    return false
  })

  // Listen for sidebar minimize state changes
  React.useEffect(() => {
    const handleSidebarMinimizedChange = (event: CustomEvent<{ isMinimized: boolean }>) => {
      setIsSidebarMinimized(event.detail.isMinimized)
    }

    window.addEventListener("sidebar-minimized-changed", handleSidebarMinimizedChange as EventListener)
    return () => {
      window.removeEventListener("sidebar-minimized-changed", handleSidebarMinimizedChange as EventListener)
    }
  }, [])

  // Auto-start tutorial for first-time users
  React.useEffect(() => {
    if (!isCompleted && typeof window !== "undefined") {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        startTutorial()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isCompleted, startTutorial])

  // Track scroll position for tablet header (same as mobile)
  React.useEffect(() => {
    if (!isMobileOrTablet) return
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMobileOrTablet])
  
  return (
    <div className={`min-h-screen transition-colors ${
      isDark 
        ? "bg-black/[0.92]" 
        : "bg-gray-100"
    }`}>
      <div className="max-w-[1800px] mx-auto">
        {/* Tablet Header - uses mobile top menu */}
        {isMobileOrTablet && !isMobile && (
          <MobileHeader 
            onOpenControls={() => setIsTabletSidebarOpen(true)} 
            isDark={isDark} 
            showTitle={isScrolled}
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column - Desktop Sidebar (hidden on mobile and tablet) */}
          {!isMobileOrTablet && (
            <aside 
              className={cn(
                isSidebarMinimized ? "lg:col-span-1" : "lg:col-span-4 xl:col-span-3"
              )} 
              style={isSidebarMinimized ? { minWidth: '132px', overflow: 'visible' } : undefined}
              aria-label="Sidebar"
            >
              <div className="sticky top-0" style={isSidebarMinimized ? { overflow: 'visible' } : undefined}>
                <ColorSidebar />
              </div>
            </aside>
          )}
          
          {/* Mobile Sidebar - Bottom Sheet */}
          {isMobile && <ColorSidebarMobile />}
          
          {/* Tablet Sidebar - Bottom Sheet (same as mobile, but header is shown separately) */}
          {isMobileOrTablet && !isMobile && (
            <ColorSidebarMobile 
              showHeader={false}
              externalScrollState={isScrolled}
              isOpen={isTabletSidebarOpen}
              onOpenChange={setIsTabletSidebarOpen}
            />
          )}

          {/* Right Column - Demo Components (full width on mobile and tablet) */}
          <main 
            className={cn(
              "p-4 sm:p-6 lg:p-8",
              isMobileOrTablet
                ? 'col-span-1 pt-20' 
                : isSidebarMinimized 
                  ? 'lg:col-span-11 xl:col-span-11' 
                  : 'lg:col-span-8 xl:col-span-9'
            )} 
            aria-label="Design system component previews"
          >
            {/* Mobile Inline Title - scrolls with content */}
            {isMobile && <MobileInlineTitle isDark={isDark} />}
            
            {/* 
              Desktop & Tablet: Scrolling store display - continuous vertical scroll, pauses on hover
              Mobile: Static grid layout
            */}
            <ScrollingCardGrid enabled={!isMobile}>
              {/* 
                Fully responsive grid optimized for horizontal space fill:
                - 1 col on mobile (<640px)
                - 2 cols on tablet (640px-1023px) 
                - 2 cols on lg when sidebar present (1024px-1279px)
                - 3 cols on xl+ (1280px+)
                Chart cards span full width on intermediate breakpoints to avoid dead space
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {/* Two smaller cards stacked - hug content on mobile, share height on desktop */}
                <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 sm:min-h-full">
                  <div className="sm:flex-1 sm:min-h-0">
                    <UserProfileCard />
                  </div>
                  <div className="sm:flex-1 sm:min-h-0">
                    <CalendarWidget />
                  </div>
                </div>

                {/* Larger cards - responsive heights and widths */}
                <div className="h-full min-h-[320px] sm:min-h-[360px] lg:min-h-[380px]">
                  <NotificationsPanel />
                </div>
                <div className="h-full min-h-[320px] sm:min-h-[360px] lg:min-h-[380px]">
                  <RadixThemesComponent />
                </div>
                
                {/* Chart cards - can span full width on 2-col layouts for better data viz */}
                <div className="h-full min-h-[300px] sm:min-h-[340px] lg:min-h-[360px] sm:col-span-2 xl:col-span-1">
                  <BarChartDemo />
                </div>
                <div className="h-full min-h-[300px] sm:min-h-[340px] lg:min-h-[360px] sm:col-span-2 xl:col-span-1">
                  <AreaChartDemo />
                </div>
                <div className="h-full min-h-[280px] sm:min-h-[320px] lg:min-h-[340px] sm:col-span-2 xl:col-span-1">
                  <DoughnutChartDemo />
                </div>
              </div>
            </ScrollingCardGrid>
          </main>
        </div>
      </div>
      <Tutorial />
    </div>
  )
}
