"use client"

import { ColorSidebar } from "@/components/color-picker/color-sidebar"
import { ColorSidebarMobile, MobileInlineTitle } from "@/components/color-picker/color-sidebar-mobile"
import { UserProfileCard } from "@/components/demo-components/user-profile-card"
import { NotificationsPanel } from "@/components/demo-components/notifications-panel"
import { CalendarWidget } from "@/components/demo-components/calendar-widget"
import { BarChartDemo } from "@/components/demo-components/bar-chart"
import { AreaChartDemo } from "@/components/demo-components/area-chart"
import { DoughnutChartDemo } from "@/components/demo-components/doughnut-chart"
import { RadixThemesComponent } from "@/components/demo-components/radix-themes-component"
import { useTheme } from "@/components/theme-context"
import { useIsMobile } from "@/lib/use-media-query"

export default function ControlCenterPage() {
  const { mode } = useTheme()
  const isDark = mode === "dark"
  const isMobile = useIsMobile()
  
  return (
    <div className={`min-h-screen transition-colors ${
      isDark 
        ? "bg-black/[0.92]" 
        : "bg-gray-100"
    }`}>
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column - Desktop Sidebar (hidden on mobile) */}
          {!isMobile && (
            <aside className="lg:col-span-4 xl:col-span-3" aria-label="Sidebar">
              <div className="sticky top-0">
                <ColorSidebar />
              </div>
            </aside>
          )}
          
          {/* Mobile Sidebar - Bottom Sheet */}
          {isMobile && <ColorSidebarMobile />}

          {/* Right Column - Demo Components (full width on mobile) */}
          <main 
            className={`p-4 sm:p-6 lg:p-8 ${isMobile ? 'col-span-1 pt-20' : 'lg:col-span-8 xl:col-span-9'}`} 
            aria-label="Design system component previews"
          >
            {/* Mobile Inline Title - scrolls with content */}
            {isMobile && <MobileInlineTitle isDark={isDark} />}
            
            {/* 
              Fully responsive grid optimized for horizontal space fill:
              - 1 col on mobile (<640px)
              - 2 cols on tablet (640px-1023px) 
              - 2 cols on lg when sidebar present (1024px-1279px)
              - 3 cols on xl+ (1280px+)
              Chart cards span full width on intermediate breakpoints to avoid dead space
            */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {/* Two smaller cards stacked to match height of larger cards */}
              <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 min-h-full">
                <div className="flex-1 min-h-0">
                  <UserProfileCard />
                </div>
                <div className="flex-1 min-h-0">
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
          </main>
        </div>
      </div>
    </div>
  )
}
