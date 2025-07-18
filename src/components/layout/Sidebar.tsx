import { useState } from "react";
import { motion } from "framer-motion"
import { Navigation } from "./Navigation"
import { cn } from "@/lib/utils"

interface SidebarProps {
  userType: 'admin' | 'student' | 'donor' | 'college'
  className?: string
}

export function Sidebar({ userType, className }: SidebarProps) {
  const [open, setOpen] = useState(true);
  // Detect mobile/tablet
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const closeSidebar = () => { if (isMobile) setOpen(false); };

  return (
    open && (
      <motion.aside
        initial={{ opacity: 0, x: -30, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.46, 0.45, 0.94] 
        }}
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col",
          className
        )}
      >
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <Navigation
            userType={userType}
            className="p-4"
            closeSidebar={closeSidebar}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-muted-foreground text-center">
            <p>Scholarship Connect Platform</p>
            <p className="mt-1">© 2024 All rights reserved</p>
          </div>
        </div>
      </motion.aside>
    )
  )
}