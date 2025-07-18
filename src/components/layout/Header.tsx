import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Bell, 
  Menu, 
  User, 
  Settings, 
  LogOut, 
  MessageSquare,
  Heart,
  GraduationCap,
  Building2,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

interface HeaderProps {
  userType: 'admin' | 'student' | 'donor' | 'college'
  userName: string
  userAvatar?: string
  onMenuToggle: () => void
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
}

export function Header({ userType, userName, userAvatar, onMenuToggle }: HeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Payment Received",
      message: "Your donation of ₹50,000 has been successfully processed",
      type: "success",
      timestamp: "2 hours ago",
      read: false
    },
    {
      id: "2",
      title: "New Student Assigned",
      message: "A new student has been assigned to your sponsorship",
      type: "info",
      timestamp: "1 day ago",
      read: false
    },
    {
      id: "3",
      title: "Document Verification",
      message: "Your documents have been verified successfully",
      type: "success",
      timestamp: "2 days ago",
      read: true
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length
  const navigate = useNavigate();

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const getUserIcon = () => {
    switch (userType) {
      case 'admin':
        return <Shield className="h-5 w-5" />
      case 'student':
        return <GraduationCap className="h-5 w-5" />
      case 'donor':
        return <Heart className="h-5 w-5" />
      case 'college':
        return <Building2 className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  const getUserColor = () => {
    switch (userType) {
      case 'admin':
        return 'bg-red-100 text-red-600'
      case 'student':
        return 'bg-blue-100 text-blue-600'
      case 'donor':
        return 'bg-green-100 text-green-600'
      case 'college':
        return 'bg-purple-100 text-purple-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  // Add a function to get the portal name
  const getPortalName = () => {
    switch (userType) {
      case 'admin': return 'Admin Portal';
      case 'student': return 'Student Portal';
      case 'donor': return 'Donor Portal';
      case 'college': return 'College Portal';
      default: return 'Portal';
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ minHeight: 'var(--header)' }}
    >
      <div className="w-full flex items-center justify-between px-6 h-16">
        {/* Left: Logo */}
        <div className="flex items-center gap-4 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-primary text-white")}> {/* Use theme color */}
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold">Scholarship Connect</h1>
              <p className="text-xs text-muted-foreground capitalize">{getPortalName()}</p>
            </div>
          </div>
        </div>
        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-80 max-w-[95vw] mx-2 sm:mx-0" sideOffset={8}>
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="h-auto p-0 text-xs"
                  >
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id}
                      className={cn(
                        "flex flex-col items-start p-3 cursor-pointer",
                        !notification.read && "bg-blue-50"
                      )}
                      onClick={() => {
                        markAsRead(notification.id);
                        navigate(`/${userType}/notifications?id=${notification.id}`);
                      }}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className={cn(
                          "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                          notification.type === 'success' && "bg-green-500",
                          notification.type === 'warning' && "bg-yellow-500",
                          notification.type === 'error' && "bg-red-500",
                          notification.type === 'info' && "bg-blue-500"
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{notification.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {notification.timestamp}
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-center cursor-pointer"
                onClick={() => {
                  markAllAsRead();
                  navigate(`/${userType}/notifications`);
                }}
              >
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-primary text-white">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-w-[95vw] mx-2 sm:mx-0" align="end" forceMount sideOffset={8}>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {userType}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate(`/${userType}/profile`)}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}