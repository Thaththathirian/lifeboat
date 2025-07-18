import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Mail, MessageSquare, Bell, Gift, Heart, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const mockMessageTemplates = [
  {
    id: "MT001",
    name: "Monthly Donation Reminder",
    type: "Donation Reminder",
    frequency: "Monthly",
    enabled: true,
    lastSent: "2024-03-01",
    recipients: 25
  },
  {
    id: "MT002",
    name: "Birthday Wishes",
    type: "Birthday",
    frequency: "On Birthday",
    enabled: true,
    lastSent: "2024-03-15",
    recipients: 3
  },
  {
    id: "MT003",
    name: "Anniversary Greetings",
    type: "Anniversary",
    frequency: "Yearly",
    enabled: true,
    lastSent: "2024-02-14",
    recipients: 8
  },
  {
    id: "MT004",
    name: "Referral Request",
    type: "Referral",
    frequency: "Quarterly",
    enabled: false,
    lastSent: "2024-01-01",
    recipients: 40
  },
];

const mockScheduledMessages = [
  {
    id: "SM001",
    template: "Monthly Donation Reminder",
    recipients: ["DON001", "DON004", "DON007"],
    scheduledDate: "2024-04-01",
    status: "Scheduled",
    type: "Email"
  },
  {
    id: "SM002",
    template: "Birthday Wishes",
    recipients: ["DON002"],
    scheduledDate: "2024-03-20",
    status: "Sent",
    type: "WhatsApp"
  },
];

export default function AutoMessaging() {
  const [activeTab, setActiveTab] = useState("templates");
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    type: "Donation Reminder",
    frequency: "Monthly",
    subject: "",
    message: "",
    enabled: true,
    to: "Donors"
  });
  const [templates, setTemplates] = useState(mockMessageTemplates);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<any>(null);
  const { toast } = useToast();

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Template Created",
      description: "Message template has been created successfully",
    });

    setNewTemplate({
      name: "",
      type: "Donation Reminder",
      frequency: "Monthly",
      subject: "",
      message: "",
      enabled: true,
      to: "Donors"
    });
  };

  const handleEditClick = (template: any) => {
    setEditTemplate({ ...template });
    setEditDialogOpen(true);
  };
  const handleEditSave = () => {
    setTemplates(templates.map(t => t.id === editTemplate.id ? { ...editTemplate } : t));
    setEditDialogOpen(false);
    toast({ title: 'Template Updated', description: 'Message template updated successfully.' });
  };
  const toggleTemplate = (templateId: string) => {
    setTemplates(templates => templates.map(t => t.id === templateId ? { ...t, enabled: !t.enabled } : t));
    toast({ title: 'Template Updated', description: 'Template status has been updated' });
  };

  return (
    <div className="main-content-container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Auto Messaging System</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="create">Create Template</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Messages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sent</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map(template => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell><Badge variant="outline">{template.type}</Badge></TableCell>
                      <TableCell>{template.frequency}</TableCell>
                      <TableCell><Badge variant={template.enabled ? "default" : "secondary"}>{template.enabled ? "Active" : "Inactive"}</Badge></TableCell>
                      <TableCell>{template.lastSent}</TableCell>
                      <TableCell>{template.recipients}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditClick(template)}>Edit</Button>
                          <Button size="sm" variant={template.enabled ? "destructive" : "default"} onClick={() => toggleTemplate(template.id)}>{template.enabled ? "Disable" : "Enable"}</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Message Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Select value={newTemplate.to} onValueChange={v => setNewTemplate({ ...newTemplate, to: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Donors">Donors</SelectItem>
                      <SelectItem value="Students">Students</SelectItem>
                      <SelectItem value="Colleges">Colleges</SelectItem>
                      <SelectItem value="Active Donors">Active Donors</SelectItem>
                      <SelectItem value="Active Students">Active Students</SelectItem>
                      <SelectItem value="Active Colleges">Active Colleges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-type">Message Type</Label>
                  <Select value={newTemplate.type} onValueChange={(value) => setNewTemplate({...newTemplate, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Donation Reminder">Donation Reminder</SelectItem>
                      <SelectItem value="Birthday">Birthday Wishes</SelectItem>
                      <SelectItem value="Anniversary">Anniversary Greetings</SelectItem>
                      <SelectItem value="Festival">Festival Wishes</SelectItem>
                      <SelectItem value="Referral">Referral Request</SelectItem>
                      <SelectItem value="Thank You">Thank You</SelectItem>
                      <SelectItem value="Update">Project Update</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={newTemplate.frequency} onValueChange={(value) => setNewTemplate({...newTemplate, frequency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Half Yearly">Half Yearly</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem>
                      <SelectItem value="On Birthday">On Birthday</SelectItem>
                      <SelectItem value="On Anniversary">On Anniversary</SelectItem>
                      <SelectItem value="One Time">One Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Enable Template</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={newTemplate.enabled}
                      onCheckedChange={(checked) => setNewTemplate({...newTemplate, enabled: checked})}
                    />
                    <span className="text-sm text-muted-foreground">
                      {newTemplate.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject (for emails)</Label>
                <Input
                  id="subject"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                  placeholder="Enter email subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message Content *</Label>
                <Textarea
                  id="message"
                  value={newTemplate.message}
                  onChange={(e) => setNewTemplate({...newTemplate, message: e.target.value})}
                  placeholder="Enter message content. Use {{donorName}}, {{amount}}, {{dueDate}} for dynamic content"
                  rows={6}
                />
                <p className="text-sm text-muted-foreground">
                  Available variables: {"{donorName}, {amount}, {dueDate}, {studentCount}, {organizationName}"}
                </p>
              </div>

              <Button onClick={handleCreateTemplate} className="w-full">
                Create Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Message ID</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockScheduledMessages.map(message => (
                    <TableRow key={message.id}>
                      <TableCell>{message.id}</TableCell>
                      <TableCell>{message.template}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{message.recipients.length} donors</Badge>
                      </TableCell>
                      <TableCell>{message.scheduledDate}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{message.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={message.status === "Sent" ? "default" : "secondary"}>
                          {message.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View</Button>
                          {message.status === "Scheduled" && (
                            <Button size="sm" variant="destructive">Cancel</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Messages Sent</p>
                    <p className="text-2xl font-bold">1,248</p>
                  </div>
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600 font-medium">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
                    <p className="text-2xl font-bold">68.5%</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600 font-medium">+5%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                    <p className="text-2xl font-bold">24.3%</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600 font-medium">+8%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Message Performance by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Donation Reminders", sent: 450, opened: 320, responded: 180 },
                  { type: "Birthday Wishes", sent: 120, opened: 95, responded: 45 },
                  { type: "Festival Greetings", sent: 200, opened: 165, responded: 30 },
                  { type: "Referral Requests", sent: 80, opened: 50, responded: 15 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="font-medium">{item.type}</div>
                    <div className="flex gap-6 text-sm">
                      <div>Sent: <span className="font-medium">{item.sent}</span></div>
                      <div>Opened: <span className="font-medium">{item.opened}</span></div>
                      <div>Responded: <span className="font-medium">{item.responded}</span></div>
                      <div>Rate: <span className="font-medium">{((item.responded / item.sent) * 100).toFixed(1)}%</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Template Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Message Template</DialogTitle>
          </DialogHeader>
          {editTemplate && (
            <div className="space-y-4">
              <Input value={editTemplate.name} onChange={e => setEditTemplate({ ...editTemplate, name: e.target.value })} placeholder="Template Name" />
              <Select value={editTemplate.type} onValueChange={v => setEditTemplate({ ...editTemplate, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Donation Reminder">Donation Reminder</SelectItem>
                  <SelectItem value="Birthday">Birthday Wishes</SelectItem>
                  <SelectItem value="Anniversary">Anniversary Greetings</SelectItem>
                  <SelectItem value="Festival">Festival Wishes</SelectItem>
                  <SelectItem value="Referral">Referral Request</SelectItem>
                  <SelectItem value="Thank You">Thank You</SelectItem>
                  <SelectItem value="Update">Project Update</SelectItem>
                </SelectContent>
              </Select>
              <Select value={editTemplate.frequency} onValueChange={v => setEditTemplate({ ...editTemplate, frequency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Half Yearly">Half Yearly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                  <SelectItem value="On Birthday">On Birthday</SelectItem>
                  <SelectItem value="On Anniversary">On Anniversary</SelectItem>
                  <SelectItem value="One Time">One Time</SelectItem>
                </SelectContent>
              </Select>
              <Input value={editTemplate.subject || ''} onChange={e => setEditTemplate({ ...editTemplate, subject: e.target.value })} placeholder="Subject (for emails)" />
              <Textarea value={editTemplate.message || ''} onChange={e => setEditTemplate({ ...editTemplate, message: e.target.value })} placeholder="Message Content" rows={6} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleEditSave}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}