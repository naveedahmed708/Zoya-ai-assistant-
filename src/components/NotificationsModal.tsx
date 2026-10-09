import React from 'react';
import { useAssistant } from '../context/AssistantContext';
import { Bell, X, Check, Trash2, MessageSquare, Phone } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { notifications, dismissNotification, speakText, setCurrentTab } = useAssistant();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-[#091224] border border-blue-500/30 p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">System Notifications</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No new alerts. All device activities are quiet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 rounded-2xl bg-[#0d182e] border border-slate-800 flex items-start justify-between gap-2.5"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-emerald-400">[{n.app}]</span>
                    <span className="text-xs font-semibold text-white">{n.sender}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">{n.preview}</p>
                  <span className="text-[9px] text-slate-500 font-mono">{n.time}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-1">
                  <button
                    onClick={() => {
                      speakText(`Notification from ${n.sender}: ${n.preview}`);
                    }}
                    className="p-1 text-slate-400 hover:text-blue-400"
                    title="Read out"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => dismissNotification(n.id)}
                    className="p-1 text-slate-400 hover:text-rose-400"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-between">
          <button
            onClick={() => {
              setCurrentTab('manager');
              onClose();
            }}
            className="text-xs text-blue-400 hover:underline font-semibold"
          >
            Open Device Oversight Hub
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-slate-800 text-xs text-slate-200 font-medium hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
