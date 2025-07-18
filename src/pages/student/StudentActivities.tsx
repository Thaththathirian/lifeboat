import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, CreditCard, Users, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: 'profile' | 'document' | 'payment' | 'interview' | 'application' | 'academic';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'in_progress' | 'failed';
}

export default function StudentActivities() {
  const activities: Activity[] = [
    {
      id: "ACT001",
      type: "profile",
      title: "Profile Updated",
      description: "Personal information and contact details updated successfully",
      timestamp: "2024-01-10T10:30:00Z",
      status: "completed"
    },
    {
      id: "ACT002",
      type: "document",
      title: "Documents Submitted",
      description: "Scholarship documents uploaded and submitted for review",
      timestamp: "2024-01-12T14:15:00Z",
      status: "completed"
    },
    {
      id: "ACT003",
      type: "interview",
      title: "Interview Scheduled",
      description: "Interview scheduled for scholarship evaluation",
      timestamp: "2024-01-15T09:00:00Z",
      status: "completed"
    },
    {
      id: "ACT004",
      type: "application",
      title: "Application Approved",
      description: "Your scholarship application has been approved",
      timestamp: "2024-01-20T16:45:00Z",
      status: "completed"
    },
    {
      id: "ACT005",
      type: "payment",
      title: "Payment Received",
      description: "Scholarship payment of ₹25,000 credited to your account",
      timestamp: "2024-01-25T11:20:00Z",
      status: "completed"
    },
    {
      id: "ACT006",
      type: "academic",
      title: "Academic Documents Pending",
      description: "Please submit your latest semester marksheets",
      timestamp: "2024-06-01T08:00:00Z",
      status: "pending"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'profile': return <Users className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'interview': return <Users className="h-4 w-4" />;
      case 'application': return <FileText className="h-4 w-4" />;
      case 'academic': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'profile': return 'bg-blue-100 text-blue-800';
      case 'document': return 'bg-purple-100 text-purple-800';
      case 'payment': return 'bg-green-100 text-green-800';
      case 'interview': return 'bg-orange-100 text-orange-800';
      case 'application': return 'bg-indigo-100 text-indigo-800';
      case 'academic': return 'bg-cyan-100 text-cyan-800';
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

  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.timestamp).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Your Activities</h1>
        <p className="text-muted-foreground">Track your scholarship application progress and activities</p>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activities.filter(a => a.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {activities.filter(a => a.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedActivities)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, dayActivities]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium text-sm text-muted-foreground">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                  </div>
                  
                  <div className="space-y-3 ml-6">
                    {dayActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className={`p-2 rounded-lg ${getTypeColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{activity.title}</h4>
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {activity.description}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(activity.timestamp)}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0">
                          {getStatusIcon(activity.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}