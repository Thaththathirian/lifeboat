import { useState, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "./Header"
import { StudentHeader } from "@/components/StudentHeader"
import { Navigation } from "./Navigation"
import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"
import { useStudentStatus } from './StudentStatusProvider'

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: 'admin' | 'student' | 'donor' | 'college'
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

  // Hide sidebar for students
  const showSidebar = userType !== 'student';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Use StudentHeader for students, generic Header for others */}
      {userType === 'student' ? (
        <StudentHeader />
      ) : (
        <Header
          userType={userType}
          userName={userName}
          userAvatar={userAvatar}
          onMenuToggle={toggleSidebar}
        />
      )}

      <div className="flex">
        {/* Sidebar - Desktop - Only show for non-student users */}
        {showSidebar && (
          <div className="hidden md:block md:w-64 lg:w-72">
            <Sidebar
              userType={userType}
              className="h-[calc(100vh-4rem)] sticky top-16"
            />
          </div>
        )}

        {/* Sidebar - Mobile - Only show for non-student users */}
        {showSidebar && (
          <AnimatePresence>
            {sidebarOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={toggleSidebar}
                />
                
                {/* Sidebar */}
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ 
                    type: "spring", 
                    damping: 30, 
                    stiffness: 300,
                    duration: 0.4 
                  }}
                  className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white border-r z-50 md:hidden"
                >
                  <Sidebar
                    userType={userType}
                    className="h-full"
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] flex justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPath}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-full max-w-[100vw] sm:max-w-[98vw] md:max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] 2xl:max-w-[80vw] p-2 sm:p-4 md:p-6 lg:p-8 mx-auto flex-1"
            >
              {userType === 'student' && status ? (
                <div className="mb-3 flex flex-wrap items-center gap-3 bg-blue-50 border border-blue-200 rounded px-3 py-2 text-sm relative">
                  <span className="font-semibold text-blue-700">Current Status:</span>
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-base shadow-sm border border-blue-200">
                    {status}
                  </span>
                  {/* Only show status dropdown for dev/admin */}
                  {setStatus && (
                    <select
                      className="border rounded p-1 text-sm ml-2"
                      value={status}
                      onChange={e => { setStatus(e.target.value); console.log('Status changed to:', e.target.value); }}
                    >
                      <option value="Profile Pending">Profile Pending</option>
                      <option value="Scholarship Documents Pending">Scholarship Documents Pending</option>
                      <option value="Application form submitted">Application form submitted</option>
                      <option value="Schedule Interview">Schedule Interview</option>
                      <option value="Academic Documents Pending">Academic Documents Pending</option>
                      <option value="Academic Documents Submitted">Academic Documents Submitted</option>
                      <option value="Eligible for Scholarship">Eligible for Scholarship</option>
                      <option value="Payment Pending">Payment Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Academic results pending">Academic results pending</option>
                      <option value="Academic verification pending">Academic verification pending</option>
                      <option value="Apply for Next">Apply for Next</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  )}
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 text-2xl font-extrabold bg-red-600 text-white rounded shadow-lg" style={{letterSpacing: '2px'}}>TEST MODE</span>
                </div>
              ) : null}
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}