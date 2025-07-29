import { useState, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StudentHeader } from "@/components/StudentHeader"
import { Navigation } from "./Navigation"
import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"
import { useStudentStatus } from './StudentStatusProvider'

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: 'student'
  userName: string
  userAvatar?: string
  currentPath: string
  onNavigate: (path: string) => void
}

export function DashboardLayout({ 
  children, 
  userType, 
  userName, 
  userAvatar, 
  currentPath,
  onNavigate 
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { status, setStatus } = useStudentStatus();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleNavigate = (path: string) => {
    onNavigate(path)
    setSidebarOpen(false) // Close sidebar on mobile after navigation
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Use StudentHeader for students */}
      <StudentHeader />

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}