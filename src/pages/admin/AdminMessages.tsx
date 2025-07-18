import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  Send, 
  Users, 
  Globe, 
  Clock, 
  CheckCircle,
  AlertCircle,
  User,
  GraduationCap,
  Heart,
  Building2,
  Search,
  Filter,
  MoreVertical,
  Reply,
  Forward,
  Archive,
  Trash2,
  Star,
  StarOff
} from "lucide-react"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"

interface Message {
  id: string
  from: string
  to: string
  subject: string
  content: string
  timestamp: string
  read: boolean
  starred: boolean
  type: 'individual' | 'global' | 'auto'
  category: 'student' | 'donor' | 'college' | 'admin' | 'all'
}

interface User {
  id: string
  name: string
  email: string
  type: 'student' | 'donor' | 'college' | 'admin'
  avatar?: string
  status: 'online' | 'offline' | 'away'
}

export default function AdminMessages() {
  const [activeTab, setActiveTab] = useState("inbox")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [globalMessageOpen, setGlobalMessageOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      from: "Rahul Kumar",
      to: "Admin",
      subject: "Document Verification Request",
      content: "Hi, I have uploaded all my documents. Please verify them at your earliest convenience. Thank you.",
      timestamp: "2024-01-15T10:30:00",
      read: false,
      starred: true,
      type: "individual",
      category: "student"
    },
    {
      id: "2",
      from: "Admin",
      to: "All Students",
      subject: "Important: Document Submission Deadline",
      content: "Dear students, please note that the deadline for document submission is January 31st, 2024. Please ensure all required documents are uploaded by this date.",
      timestamp: "2024-01-14T15:45:00",
      read: true,
      starred: false,
      type: "global",
      category: "student"
    },
    {
      id: "3",
      from: "Priya Sharma",
      to: "Admin",
      subject: "Payment Status Inquiry",
      content: "Hello, I would like to know the status of my scholarship payment. It has been pending for a while now.",
      timestamp: "2024-01-13T09:15:00",
      read: true,
      starred: false,
      type: "individual",
      category: "student"
    },
    {
      id: "4",
      from: "John Doe",
      to: "Admin",
      subject: "Donation Query",
      content: "I would like to know more about the donation process and how I can contribute to the scholarship fund.",
      timestamp: "2024-01-12T14:20:00",
      read: false,
      starred: false,
      type: "individual",
      category: "donor"
    },
    {
      id: "5",
      from: "Admin",
      to: "All Donors",
      subject: "Thank You for Your Generosity",
      content: "Dear donors, we would like to express our heartfelt gratitude for your continued support. Your donations are making a real difference in students' lives.",
      timestamp: "2024-01-11T11:00:00",
      read: true,
      starred: true,
      type: "global",
      category: "donor"
    }
  ])

  const [users] = useState<User[]>([
    { id: "1", name: "Rahul Kumar", email: "rahul@email.com", type: "student", status: "online" },
    { id: "2", name: "Priya Sharma", email: "priya@email.com", type: "student", status: "offline" },
    { id: "3", name: "John Doe", email: "john@email.com", type: "donor", status: "online" },
    { id: "4", name: "Mumbai University", email: "admin@mu.ac.in", type: "college", status: "away" },
    { id: "5", name: "Sarah Wilson", email: "sarah@email.com", type: "donor", status: "offline" }
  ])

  const [composeForm, setComposeForm] = useState({
    to: "",
    subject: "",
    content: "",
    type: "individual" as const,
    category: "student" as const
  })

  const [globalForm, setGlobalForm] = useState({
    category: "all" as const,
    subject: "",
    content: "",
    scheduledDate: "",
    autoSend: false
  })

  // Mark all messages as read on mount
  useEffect(() => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })))
  }, [])

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterCategory === "all" || message.category === filterCategory
    
    return matchesSearch && matchesFilter
  })

  const unreadCount = messages.filter(m => !m.read).length
  const starredCount = messages.filter(m => m.starred).length

  const handleSendMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      from: "Admin",
      to: composeForm.to,
      subject: composeForm.subject,
      content: composeForm.content,
      timestamp: new Date().toISOString(),
      read: false,
      starred: false,
      type: composeForm.type,
      category: composeForm.category
    }

    setMessages(prev => [newMessage, ...prev])
    setComposeForm({ to: "", subject: "", content: "", type: "individual", category: "student" })
    setComposeOpen(false)
  }

  const handleSendGlobalMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      from: "Admin",
      to: `All ${globalForm.category === 'all' ? 'Users' : globalForm.category}s`,
      subject: globalForm.subject,
      content: globalForm.content,
      timestamp: new Date().toISOString(),
      read: false,
      starred: false,
      type: "global",
      category: globalForm.category
    }

    setMessages(prev => [newMessage, ...prev])
    setGlobalForm({ category: "all", subject: "", content: "", scheduledDate: "", autoSend: false })
    setGlobalMessageOpen(false)
  }

  const toggleStar = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
      )
    )
  }

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    )
  }

  const getUserIcon = (type: string) => {
    switch (type) {
      case 'student':
        return <GraduationCap className="h-4 w-4" />
      case 'donor':
        return <Heart className="h-4 w-4" />
      case 'college':
        return <Building2 className="h-4 w-4" />
      case 'admin':
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getUserColor = (type: string) => {
    switch (type) {
      case 'student':
        return 'bg-blue-100 text-blue-600'
      case 'donor':
        return 'bg-green-100 text-green-600'
      case 'college':
        return 'bg-purple-100 text-purple-600'
      case 'admin':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Manage communications with users</p>
            </div>
        <div className="flex gap-2">
          <Button onClick={() => setGlobalMessageOpen(true)}>
            <Globe className="mr-2 h-4 w-4" />
            Global Message
          </Button>
          <Button onClick={() => setComposeOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            Compose
          </Button>
                  </div>
                </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Messages</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{unreadCount} unread</Badge>
                  <Badge variant="outline">{starredCount} starred</Badge>
                </div>
          </div>

              {/* Search and Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="donor">Donors</SelectItem>
                    <SelectItem value="college">Colleges</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto">
                    {(activeTab === 'messages' ? messages : messages.filter(m => m.starred)).map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-center gap-3 px-4 py-3 border-b cursor-pointer transition-colors duration-150 ${selectedMessage?.id === message.id ? 'bg-blue-100' : 'hover:bg-gray-200'} ${!message.read ? 'font-semibold' : ''}`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>{message.from[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate w-32 block">{message.from}</span>
                            <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{format(new Date(message.timestamp), 'MMM d')}</span>
                          </div>
                          <div className="text-xs text-muted-foreground truncate w-40">{message.subject}</div>
                          <div className="text-xs text-gray-500 truncate w-40">{message.content}</div>
                        </div>
                        {message.starred && <Star className="h-4 w-4 text-yellow-400 ml-2" />}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Message Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                      <div className={getUserColor(selectedMessage.category)}>
                        {getUserIcon(selectedMessage.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedMessage.from}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(selectedMessage.timestamp), 'PPP p')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStar(selectedMessage.id)}
                      >
                        {selectedMessage.starred ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Forward className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">{selectedMessage.subject}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      To: {selectedMessage.to}
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button>
                      <Reply className="mr-2 h-4 w-4" />
                      Reply
                    </Button>
                    <Button variant="outline">
                      <Forward className="mr-2 h-4 w-4" />
                      Forward
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a message to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compose Message Dialog */}
      {composeOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Compose Message</h2>
              <Button variant="ghost" onClick={() => setComposeOpen(false)}>×</Button>
            </div>
            
                <div className="space-y-4">
              <div>
                <Label>To</Label>
                <Select value={composeForm.to} onValueChange={(value) => setComposeForm(prev => ({ ...prev, to: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.name}>
                        <div className="flex items-center gap-2">
                          <div className={getUserColor(user.type)}>
                            {getUserIcon(user.type)}
                          </div>
                          {user.name} ({user.type})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Subject</Label>
                <Input
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter subject"
                />
              </div>
              
              <div>
                <Label>Message</Label>
                <Textarea
                  value={composeForm.content}
                  onChange={(e) => setComposeForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter your message"
                  rows={6}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setComposeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage}>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
                      </div>
                    </div>
          </motion.div>
        </div>
      )}

      {/* Global Message Dialog */}
      {globalMessageOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Send Global Message</h2>
              <Button variant="ghost" onClick={() => setGlobalMessageOpen(false)}>×</Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Target Category</Label>
                <Select value={globalForm.category} onValueChange={(value) => setGlobalForm(prev => ({ ...prev, category: value as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="student">Students Only</SelectItem>
                    <SelectItem value="donor">Donors Only</SelectItem>
                    <SelectItem value="college">Colleges Only</SelectItem>
                    <SelectItem value="admin">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
                </div>

              <div>
                <Label>Subject</Label>
                  <Input 
                  value={globalForm.subject}
                  onChange={(e) => setGlobalForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter subject"
                />
              </div>
              
              <div>
                <Label>Message</Label>
                <Textarea
                  value={globalForm.content}
                  onChange={(e) => setGlobalForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter your global message"
                  rows={6}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setGlobalMessageOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendGlobalMessage}>
                  <Globe className="mr-2 h-4 w-4" />
                  Send Global Message
                  </Button>
              </div>
          </div>
        </motion.div>
      </div>
      )}
    </div>
  )
}