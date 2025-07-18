import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const initialNotifications = [
  { id: 1, title: "Donation Received", body: "Your donation of ₹50,000 has been received.", date: "2024-01-15", read: false },
  { id: 2, title: "Student Assigned", body: "You have been assigned a new student.", date: "2024-01-10", read: false },
  { id: 3, title: "Birthday Wishes", body: "Happy Birthday from the LBF team!", date: "2023-12-25", read: true }
];

export default function DonorNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [openNotif, setOpenNotif] = useState(null);
  const markAllAsRead = () => setNotifications(n => n.map(notif => ({ ...notif, read: true })));

  const handleOpen = (id) => {
    setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif));
    setOpenNotif(id);
  };

  return (
    <div className="main-content-container">
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>All your notifications</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={markAllAsRead}>Mark all as read</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg flex items-center gap-3 ${notif.read ? 'bg-gray-50' : 'bg-blue-50'} cursor-pointer`}
              onClick={() => handleOpen(notif.id)}
            >
              {!notif.read && <Badge variant="default" className="bg-blue-600 text-white">Unread</Badge>}
              <div>
                <div className="font-semibold">{notif.title}</div>
                <div className="text-sm text-gray-700">{notif.body}</div>
                <div className="text-xs text-gray-500">{notif.date}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Dialog open={!!openNotif} onOpenChange={() => setOpenNotif(null)}>
        <DialogContent className="max-w-xs w-full p-6">
          {openNotif && (
            <>
              <DialogHeader>
                <DialogTitle>{notifications.find(n => n.id === openNotif)?.title}</DialogTitle>
                <DialogDescription>{notifications.find(n => n.id === openNotif)?.date}</DialogDescription>
              </DialogHeader>
              <div className="py-4 text-base text-gray-800">
                {notifications.find(n => n.id === openNotif)?.body}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 