import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const initialMessages = [
  { id: 1, subject: "Thank you for your donation!", body: "We appreciate your support.", date: "2024-01-16", read: false },
  { id: 2, subject: "Quarterly Reminder", body: "Your next donation is due soon.", date: "2024-01-10", read: false },
  { id: 3, subject: "Birthday Wishes", body: "Happy Birthday from the LBF team!", date: "2023-12-25", read: true }
];

export default function DonorMessages() {
  const [messages, setMessages] = useState(initialMessages);
  const [openMsg, setOpenMsg] = useState(null);
  const markAllAsRead = () => setMessages(msgs => msgs.map(m => ({ ...m, read: true })));

  const handleOpen = (id) => {
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, read: true } : m));
    setOpenMsg(id);
  };

  return (
    <div className="main-content-container">
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Inbox for admin/donor communication</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={markAllAsRead}>Mark all as read</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg ${msg.read ? 'bg-gray-50' : 'bg-blue-50'} cursor-pointer`}
              onClick={() => handleOpen(msg.id)}
            >
              <div className="font-semibold">{msg.subject}</div>
              <div className="text-sm text-gray-700">{msg.body}</div>
              <div className="text-xs text-gray-500">{msg.date}</div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Dialog open={!!openMsg} onOpenChange={() => setOpenMsg(null)}>
        <DialogContent className="max-w-xs w-full p-6">
          {openMsg && (
            <>
              <DialogHeader>
                <DialogTitle>{messages.find(m => m.id === openMsg)?.subject}</DialogTitle>
                <DialogDescription>{messages.find(m => m.id === openMsg)?.date}</DialogDescription>
              </DialogHeader>
              <div className="py-4 text-base text-gray-800">
                {messages.find(m => m.id === openMsg)?.body}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 