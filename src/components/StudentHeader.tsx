import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, CreditCard, Activity, LogOut, MessageSquare, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStudent } from "@/contexts/StudentContext";

export function StudentHeader() {
  const navigate = useNavigate();
  const { profile, setStatus } = useStudent();
  const [messageCount] = useState(2); // Mock message count

  const handleLogout = () => {
    localStorage.clear();
    setStatus('login');
    navigate('/');
  };

  // Get full name or fallback
  const getFullName = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    } else if (profile?.firstName) {
      return profile.firstName;
    }
    return 'User';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Student Portal</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Message Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/student/messages')}
            className="relative"
          >
            <MessageSquare className="h-5 w-5" />
            {messageCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {messageCount}
              </Badge>
            )}
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {profile?.firstName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{getFullName()}</p>
                  <p className="text-xs text-muted-foreground">Student</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/student')}>
                <Home className="mr-2 h-4 w-4" />
                Home
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/student/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/student/payment-history')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Payment History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/student/activities')}>
                <Activity className="mr-2 h-4 w-4" />
                Your Activities
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}