import { useState } from "react";

const messages = [
  { date: "2024-04-01", sender: "Admin", subject: "Welcome to the Scholarship Program", snippet: "Congratulations on your registration!", read: true },
  { date: "2024-04-06", sender: "Support", subject: "Document Verification", snippet: "Please upload your 12th marksheet.", read: false },
  { date: "2024-04-12", sender: "College", subject: "Payment Update", snippet: "First installment has been credited.", read: false },
];

export default function StudentMessages() {
  const [msgs, setMsgs] = useState(messages);

  const markAllAsRead = () => {
    setMsgs(msgs => msgs.map(m => ({ ...m, read: true })));
  };

  return (
    <div className="max-w-3xl w-full mx-auto py-10 min-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Messages</h2>
        <button
          className="text-blue-600 font-semibold text-sm px-4 py-2 rounded hover:bg-blue-50 transition"
          onClick={markAllAsRead}
        >
          Mark all as read
        </button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-soft space-y-4 flex-1">
        {msgs.map((m, i) => (
          <div key={i} className={`flex flex-col md:flex-row md:items-center gap-2 p-3 rounded-lg ${m.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
            <div className="flex-1">
              <div className="font-semibold">{m.subject}</div>
              <div className="text-sm text-gray-700">{m.snippet}</div>
              <div className="text-xs text-gray-500">From: {m.sender} • {m.date}</div>
            </div>
            {!m.read && <span className="text-xs text-blue-600 font-semibold">Unread</span>}
          </div>
        ))}
      </div>
    </div>
  );
}