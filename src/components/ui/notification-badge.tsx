import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Bell } from "lucide-react"

interface NotificationBadgeProps {
  count: number
  className?: string
  showIcon?: boolean
}

export function NotificationBadge({ count, className, showIcon = true }: NotificationBadgeProps) {
  return (
    <div className={cn("relative", className)}>
      {showIcon && (
        <Bell className="h-5 w-5 text-muted-foreground transition-smooth hover:text-foreground" />
      )}
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center min-w-[20px]"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </div>
  )
}