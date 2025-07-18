import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';

const allNotifications = [
  { id: "0", date: "2024-03-31", message: "Please update your profile to continue your scholarship application.", read: false, type: "update-profile", full: "Please update your profile to continue your scholarship application. All fields are required." },
  { id: "1", date: "2024-04-01", message: "Your profile has been verified.", read: true, type: "profile", full: "Your profile information has been successfully verified by the admin." },
  { id: "2", date: "2024-04-05", message: "Application verified.", read: false, type: "application", full: "Your scholarship application has been reviewed and verified." },
  { id: "3", date: "2024-04-10", message: "Document verification completed.", read: false, type: "document", full: "All your uploaded documents have been verified. You are now eligible for payment." },
  { id: "4", date: "2024-04-12", message: "First installment credited.", read: false, type: "payment", full: "Your first scholarship installment has been credited to your account." },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function StudentNotifications() {
  const { status } = useStudentStatus();
  const [openId, setOpenId] = useState<string|null>(null);
  const query = useQuery();
  const highlightId = query.get("id");
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter notifications based on status
  let notifs = allNotifications;
  if (status === "Profile Update") {
    notifs = allNotifications.filter(n => n.type === "update-profile");
  }
  // (Extend this logic for other statuses as needed)

  const handleOpen = (id: string) => setOpenId(id);
  const handleClose = () => setOpenId(null);
  const openNotif = notifs.find(n => n.id === openId);

  useEffect(() => {
    if (!openId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openId]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  return (
    <div className="max-w-full mx-auto py-10 min-h-[80vh] flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <div className="bg-white p-6 rounded-xl shadow-soft space-y-4 flex-1">
        {notifs.length === 0 ? (
          <div className="text-gray-500 text-center">No notifications yet.</div>
        ) : notifs.map((n, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer ${n.read ? 'bg-gray-50' : 'bg-blue-50'} ${highlightId === n.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleOpen(n.id)}
          >
            <div className="flex-1">
              <div className="font-medium flex items-center gap-2">
                {n.message}
                {(n.type === 'profile' || n.type === 'application' || n.type === 'document') && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div className="text-xs text-gray-500">{n.date}</div>
            </div>
            {!n.read && <span className="text-xs text-blue-600 font-semibold">New</span>}
            {highlightId === n.id && <span className="ml-2 text-xs text-blue-700 font-bold">Selected</span>}
          </div>
        ))}
      </div>
      {/* Modal for full message view */}
      {openNotif && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={handleOverlayClick}>
          <div ref={modalRef} className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={handleClose}>&times;</button>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-lg">{openNotif.message}</span>
              {(openNotif.type === 'profile' || openNotif.type === 'application' || openNotif.type === 'document') && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
            <div className="text-gray-700 mb-2">{openNotif.full}</div>
            <div className="text-xs text-gray-500">{openNotif.date}</div>
          </div>
        </div>
      )}
    </div>
  );
}