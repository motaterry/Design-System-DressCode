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
            className={`p-8 ${isMobile ? 'col-span-1 pt-20' : 'lg:col-span-8 xl:col-span-9'}`} 
            aria-label="Design system component previews"
          >
            {/* Mobile Inline Title - scrolls with content */}
            {isMobile && <MobileInlineTitle isDark={isDark} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {/* Two smaller cards stacked to match height of larger cards */}
              <div className="flex flex-col gap-6 min-h-full">
                <div className="flex-1">
              <UserProfileCard />
            </div>
                <div className="flex-1">
                <CalendarWidget />
              </div>
            </div>

              {/* Larger cards - all have consistent height */}
              <div className="h-full">
                <NotificationsPanel />
              </div>
              <div className="h-full">
                <RadixThemesComponent />
              </div>
              <div className="h-full">
              <BarChartDemo />
              </div>
              <div className="h-full">
              <AreaChartDemo />
              </div>
              <div className="h-full">
              <DoughnutChartDemo />
            </div>
          </div>
          </main>
        </div>
      </div>
    </div>
  )
}
