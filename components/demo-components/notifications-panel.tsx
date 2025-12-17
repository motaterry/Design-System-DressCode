"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-context"
import { useDesignSystem } from "@/components/design-system-context"
import { useColorTheme } from "@/components/color-picker/color-context"
import { hslToHex, getAccessibleTextColor } from "@/lib/color-utils"
import { 
  DropdownMenu, 
  DropdownTrigger, 
  DropdownContent, 
  DropdownItem, 
  DropdownSeparator 
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Check, X, Eye, EyeOff, Archive, Trash2, Reply } from "lucide-react"
import { UpdateIllustration } from "@/components/logo/update-illustration"
import Image from "next/image"
import { useToast } from "@/components/ui/toast"

const notifications = [
  {
    id: 1,
    name: "Mary Pereira",
    message: "has invited you to access the project",
    time: "1h",
    hasActions: true,
  },
  {
    id: 2,
    name: "Mary Pereira",
    message: "changed status of task in the project",
    time: "1h",
    hasActions: false,
  },
  {
    id: 3,
    name: "Mary Pereira",
    message: "added new tasks to the project",
    time: "1h",
    hasActions: false,
  },
]

/**
 * Notifications Panel
 * 
 * DROPDOWN DEMO: Click any ellipsis (⋮) button on notification items 
 * to see the contextual dropdown menu in action.
 */
export function NotificationsPanel() {
  const { mode } = useTheme()
  const { buttonTextColor } = useDesignSystem()
  const { theme } = useColorTheme()
  const { addToast } = useToast()
  const isDark = mode === "dark"
  
  // Calculate the effective text color (handles "auto" mode)
  const primaryHex = hslToHex(theme.primary.h, theme.primary.s, theme.primary.l)
  const effectiveTextColor = buttonTextColor === "auto" 
    ? getAccessibleTextColor(primaryHex) 
    : buttonTextColor

  const handleNotificationAction = (action: string, notifName: string) => {
    addToast({
      title: action,
      description: `Action "${action}" for ${notifName}'s notification`,
      variant: "success",
      duration: 2500,
    })
  }
  
  return (
    <Card className="h-full flex flex-col p-6">
      {/* Header - H4: Consistent spacing, H8: Clear visual hierarchy */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-current/10">
        <h2 className={`text-xl font-bold ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          Notifications
        </h2>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${
            isDark ? "text-white/70" : "text-gray-600"
          }`}>
            Unread
          </span>
          <span 
            className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--color-primary)] min-w-[28px] text-center"
            style={{ color: effectiveTextColor === "dark" ? "#111827" : "#ffffff" }}
          >
            6
          </span>
        </div>
      </div>
      
      {/* Notifications List - Negative margin allows hover to have breathing room padding */}
      <div className="flex-1 flex flex-col gap-1 overflow-y-auto min-h-0 -mx-3">
        {notifications.map((notif, index) => (
          <div key={notif.id}>
            {/* Individual notification item with full padding for hover breathing room */}
            <div 
              className={`flex flex-col gap-3 px-3 py-3 mx-1 rounded-lg transition-colors duration-200 ${
                isDark ? "hover:bg-white/[0.04]" : "hover:bg-gray-100/60"
              }`} 
              role="article"
            >
            
              <div className="flex gap-3 items-start">
                {/* Avatar */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-current/5">
                  <Image
                    src="/images/dff1d7255654f23e342cabe6f9ffcbfc8188a4c3.png"
                    alt={`${notif.name} profile picture`}
                    fill
                    className="object-cover object-top"
                    style={{ objectPosition: 'center top' }}
                    sizes="40px"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  {/* Name, Time, and Menu Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}>
                        {notif.name}
                      </span>
                      <span className={`text-xs ${
                        isDark ? "text-white/40" : "text-gray-400"
                      }`}>
                        {notif.time}
                      </span>
                    </div>
                    {/* Notification Item Dropdown Menu */}
                    <DropdownMenu>
                      <DropdownTrigger
                        className={`p-1.5 -mr-1 rounded-lg transition-all duration-200 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] flex-shrink-0 ${
                          isDark ? "hover:bg-white/10" : "hover:bg-gray-200"
                        }`}
                      >
                        <MoreVertical className={`w-4 h-4 ${
                          isDark ? "text-white/50" : "text-gray-500"
                        }`} />
                      </DropdownTrigger>
                      <DropdownContent align="end" sideOffset={4}>
                        <DropdownItem 
                          icon={<Eye className="w-4 h-4" />}
                          onClick={() => handleNotificationAction("Mark as read", notif.name)}
                        >
                          Mark as read
                        </DropdownItem>
                        <DropdownItem 
                          icon={<EyeOff className="w-4 h-4" />}
                          onClick={() => handleNotificationAction("Mark as unread", notif.name)}
                        >
                          Mark as unread
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem 
                          icon={<Reply className="w-4 h-4" />}
                          onClick={() => handleNotificationAction("Reply", notif.name)}
                        >
                          Reply
                        </DropdownItem>
                        <DropdownItem 
                          icon={<Archive className="w-4 h-4" />}
                          onClick={() => handleNotificationAction("Archive", notif.name)}
                        >
                          Archive
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem 
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={() => handleNotificationAction("Delete", notif.name)}
                          destructive
                        >
                          Delete notification
                        </DropdownItem>
                      </DropdownContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Message */}
                  <p className={`text-sm leading-relaxed ${
                    isDark ? "text-white/60" : "text-gray-600"
                  }`}>
                    {notif.message}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons - Aligned with content */}
              {notif.hasActions && (
                <div className="flex gap-2 ml-[52px]">
                  <Button 
                    size="xs" 
                    className="gap-1.5"
                    aria-label="Accept invitation"
                  >
                    <Check className="w-3 h-3" />
                    Accept
                  </Button>
                  <Button 
                    variant="outline"
                    size="xs"
                    className="gap-1.5"
                    aria-label="Deny request"
                  >
                    <X className="w-3 h-3" />
                    Deny
                  </Button>
                </div>
              )}
            </div>
            
          </div>
        ))}
        
        {/* System Notification Card with branded illustration */}
        <div className={`rounded-xl p-4 mx-1 mt-4 flex gap-4 items-center transition-all duration-200 ${
          isDark 
            ? "bg-white/10 border border-white/15" 
            : "bg-gray-100/80 border border-gray-200/60"
        }`}>
          <div className="shrink-0 flex items-center justify-center">
            <UpdateIllustration
              accentColor={primaryHex}
              isDark={isDark}
              size={88}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className={`text-sm font-semibold leading-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Terms & Conditions Updated
            </span>
            <p className={`text-xs leading-relaxed ${
              isDark ? "text-white/70" : "text-gray-600"
            }`}>
              We have updated our Terms and Conditions. Please{" "}
              <button 
                className={`underline underline-offset-2 cursor-pointer transition-colors ${
                  isDark 
                    ? "text-white/90 hover:text-white" 
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                review the changes
              </button>.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Action Buttons */}
      <div className={`flex gap-3 pt-5 mt-5 border-t ${
        isDark ? "border-white/10" : "border-gray-200"
      }`}>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
        >
          Mark all as read
        </Button>
        <Button
          size="sm"
          className="flex-1"
        >
          View all
        </Button>
      </div>
    </Card>
  )
}
