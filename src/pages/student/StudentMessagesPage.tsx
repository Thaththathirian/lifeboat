import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Search, Clock, User } from "lucide-react";

interface Message {
  id: string;
  from: string;
  fromType: 'admin' | 'college' | 'donor' | 'student';
  to: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'received' | 'sent';
}

export default function StudentMessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const messages: Message[] = [
    {
      id: "MSG001",
      from: "Admin",
      fromType: "admin",
      to: "Student",
      subject: "Application Status Update",
      content: "Your scholarship application has been approved. Please proceed to submit your documents.",
      timestamp: "2024-01-15T10:30:00Z",
      read: false,
      type: "received"
    },
    {
      id: "MSG002",
      from: "College Admin",
      fromType: "college",
      to: "Student",
      subject: "Document Verification",
      content: "Your submitted documents have been verified successfully. No further action required.",
      timestamp: "2024-01-14T15:45:00Z",
      read: true,
      type: "received"
    },
    {
      id: "MSG003",
      from: "Donor",
      fromType: "donor",
      to: "Student",
      subject: "Congratulations!",
      content: "Congratulations on your academic achievement. Keep up the good work!",
      timestamp: "2024-01-13T09:20:00Z",
      read: true,
      type: "received"
    },
    {
      id: "MSG004",
      from: "Student",
      fromType: "student",
      to: "Admin",
      subject: "Query about payment",
      content: "Could you please let me know the expected date for the next payment?",
      timestamp: "2024-01-12T14:10:00Z",
      read: true,
      type: "sent"
    }
  ];

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.read && m.type === 'received').length;

  const getSenderColor = (fromType: string) => {
    switch (fromType) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'college': return 'bg-purple-100 text-purple-800';
      case 'donor': return 'bg-green-100 text-green-800';
      case 'student': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Communicate with admin, college, and donors</p>
      </div>

      {/* Message Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {messages.filter(m => m.type === 'received').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messages
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  } ${!message.read && message.type === 'received' ? 'border-l-4 border-l-blue-500' : ''}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={getSenderColor(message.fromType)}>
                        {message.from.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{message.from}</span>
                        <Badge className={getSenderColor(message.fromType)}>
                          {message.fromType}
                        </Badge>
                        {!message.read && message.type === 'received' && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <h4 className="font-medium text-sm mb-1 truncate">{message.subject}</h4>
                      <p className="text-xs text-muted-foreground truncate">{message.content}</p>
                      
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {selectedMessage ? 'Message Details' : 'Select a Message'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={getSenderColor(selectedMessage.fromType)}>
                        {selectedMessage.from.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedMessage.from}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(selectedMessage.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2">{selectedMessage.subject}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMessage.content}</p>
                </div>
                
                {/* Reply Section */}
                <div className="space-y-3">
                  <h4 className="font-medium">Reply</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your reply..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a message to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}