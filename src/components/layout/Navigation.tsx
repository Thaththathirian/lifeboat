import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Heart, 
  FileText, 
  MessageSquare,
  Bell,
  Settings,
  GraduationCap,
  Shield,
  CreditCard,
  Receipt,
  BarChart3,
  Calendar,
  BookOpen,
  Award,
  UserCheck,
  FileCheck,
  DollarSign,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStudentStatus } from "./StudentStatusProvider";

interface NavigationProps {
  userType: 'admin' | 'student' | 'donor' | 'college'
  className?: string
  closeSidebar?: () => void
}

interface NavItem {
  title: string
  path: string
  icon: React.ReactNode
  badge?: string | number
  children?: NavItem[]
}

export function Navigation({ userType, className, closeSidebar }: NavigationProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const navigate = useNavigate()
  const location = useLocation()

  // Add this for student status
  const { status } = userType === 'student' ? useStudentStatus() : { status: undefined };

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const getNavItems = (): NavItem[] => {
    switch (userType) {
      case 'admin':
        return [
          {
            title: "Dashboard",
            path: "/admin",
            icon: <LayoutDashboard className="h-4 w-4" />
          },
          {
            title: "Students",
            path: "/admin/students",
            icon: <GraduationCap className="h-4 w-4" />,
            children: [
              {
                title: "All Students",
                path: "/admin/students/all",
                icon: <Users className="h-4 w-4" />
              },
              {
                title: "Applied Students",
                path: "/admin/students/applied",
                icon: <FileText className="h-4 w-4" />,
                badge: 15
              },
              {
                title: "Approved Students",
                path: "/admin/students/approved",
                icon: <UserCheck className="h-4 w-4" />
              },
              {
                title: "Alumni",
                path: "/admin/students/alumni",
                icon: <Award className="h-4 w-4" />
              },
              {
                title: "Receipt Management",
                path: "/admin/students/receipts",
                icon: <Receipt className="h-4 w-4" />
              }
            ]
          },
          {
            title: "Colleges",
            path: "/admin/colleges",
            icon: <Building2 className="h-4 w-4" />,
            children: [
              {
                title: "Registered Colleges",
                path: "/admin/colleges/registered",
                icon: <Building2 className="h-4 w-4" />
              },
              {
                title: "Pending Colleges",
                path: "/admin/colleges/pending",
                icon: <FileCheck className="h-4 w-4" />,
                badge: 8
              }
              // Scholarship Account and Receipt Management removed from here
            ]
          },
          {
            title: "Donors",
            path: "/admin/donors",
            icon: <Heart className="h-4 w-4" />,
            children: [
              {
                title: "All Donors",
                path: "/admin/donors/all",
                icon: <Users className="h-4 w-4" />
              },
              {
                title: "Auto Messaging",
                path: "/admin/donors/messaging",
                icon: <MessageSquare className="h-4 w-4" />
              }
            ]
          },
          {
            title: "Payment Allotment",
            path: "/admin/payments",
            icon: <CreditCard className="h-4 w-4" />
          },
          {
            title: "Messages",
            path: "/admin/messages",
            icon: <MessageSquare className="h-4 w-4" />,
            badge: 3
          },
          {
            title: "Notifications",
            path: "/admin/notifications",
            icon: <Bell className="h-4 w-4" />,
            badge: 5
          },
          //   title: "Reports",
          //   path: "/admin/reports",
          //   icon: <BarChart3 className="h-4 w-4" />
          // },
          {
            title: "Logout",
            path: "/logout",
            icon: <LogOut className="h-4 w-4" /> 
          }
          
        ]

      case 'student':
        // No navigation items for students - they only have profile dropdown
        return [];

      case 'donor':
        return [
          {
            title: "Dashboard",
            path: "/donor",
            icon: <LayoutDashboard className="h-4 w-4" />
          },
          {
            title: "My Donations",
            path: "/donor/donations",
            icon: <Heart className="h-4 w-4" />
          },
          {
            title: "Sponsored Students",
            path: "/donor/students",
            icon: <GraduationCap className="h-4 w-4" />
          },
          {
            title: "Payment History",
            path: "/donor/payments",
            icon: <CreditCard className="h-4 w-4" />
          },
          {
            title: "Auto Payment",
            path: "/donor/auto-payment",
            icon: <TrendingUp className="h-4 w-4" />
          },
          {
            title: "Messages",
            path: "/donor/messages",
            icon: <MessageSquare className="h-4 w-4" />
          },
          {
            title: "Notifications",
            path: "/donor/notifications",
            icon: <Bell className="h-4 w-4" />,
            badge: 2
          },
          {
            title: "Logout",
            path: "/logout",
            icon: <LogOut className="h-4 w-4" />
          }
        ]

      case 'college':
        return [
          {
            title: "Dashboard",
            path: "/college",
            icon: <LayoutDashboard className="h-4 w-4" />
          },
          {
            title: "Students",
            path: "/college/students",
            icon: <GraduationCap className="h-4 w-4" />
          },
          {
            title: "Payment Verification",
            path: "/college/payments",
            icon: <CreditCard className="h-4 w-4" />,
            badge: 12
          },
          {
            title: "Receipt Management",
            path: "/college/receipts",
            icon: <Receipt className="h-4 w-4" />
          },
          {
            title: "Reports",
            path: "/college/reports",
            icon: <BarChart3 className="h-4 w-4" />
          },
          {
            title: "Messages",
            path: "/college/messages",
            icon: <MessageSquare className="h-4 w-4" />
          },
          {
            title: "Notifications",
            path: "/college/notifications",
            icon: <Bell className="h-4 w-4" />
          },
          {
            title: "Logout",
            path: "/logout",
            icon: <LogOut className="h-4 w-4" />
          }
        ]

      default:
        return []
    }
  }

  const navItems = getNavItems()

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const isActive = location.pathname === item.path;
    const isExpanded = item.children && (expandedItems.includes(item.title) || item.children!.some(child => location.pathname === child.path));
    const hasChildren = item.children && item.children.length > 0

  return (
      <div key={item.title}>
        <Button
          variant={isActive ? "default" : "ghost"}
          className={cn(
            level > 0 ? "nav-item-child" : "nav-item",
            isActive && "bg-primary text-primary-foreground"
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.title)
            } else {
              navigate(item.path)
              if (closeSidebar) closeSidebar();
            }
          }}
        >
          {item.icon}
          <span className="flex-1 text-left">{item.title}</span>
          {item.badge && (
            <Badge 
              variant={typeof item.badge === 'number' ? "secondary" : "default"}
              className="ml-auto"
            >
              {item.badge}
            </Badge>
          )}
          {hasChildren && (
            <span className={cn("transition-transform", isExpanded ? "rotate-90" : "")}>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </Button>
        {hasChildren && (
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="submenu"
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -32 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
                aria-expanded={isExpanded}
              >
                <div className="space-y-1">
                  {item.children!.map(child => renderNavItem(child, level + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    )
  }

  return (
    <nav className={cn("space-y-2", className)}>
      {navItems.map(item => renderNavItem(item))}
    </nav>
  )
}