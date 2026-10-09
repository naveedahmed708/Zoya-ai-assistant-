import React, { useState } from 'react';
import { useAssistant } from '../context/AssistantContext';
import { Sparkles, Mic, X, MessageSquare, Eye } from 'lucide-react';

const avatarImg = '/src/assets/images/maya_avatar_1791573783351.jpg';

export const FloatingOrb: React.FC = () => {
  const {
    floatingOrbActive,
    setFloatingOrbActive,
    isListening,
    startListening,
    stopListening,
    setCurrentTab,
    speakText,
  } = useAssistant();

  const [position, setPosition] = useState({ x: 20, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);

  if (!floatingOrbActive) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = Math.max(10, Math.min(window.innerWidth - 65, e.clientX - dragStart.x));
    const newY = Math.max(50, Math.min(window.innerHeight - 80, e.clientY - dragStart.y));
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleOrbClick = () => {
    if (!isDragging) {
      setMenuOpen(!menuOpen);
    }
  };

  return (
    <div
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className="fixed z-50 select-none touch-none transition-transform duration-75"
    >
      {/* The Floating Glowing Orb */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleOrbClick}
        className={`relative w-14 h-14 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center p-0.5 shadow-2xl transition-all duration-300 ${
          isListening
            ? 'ring-4 ring-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.7)] scale-110'
            : 'ring-2 ring-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:scale-105'
        }`}
      >
        {/* Pulsing Aura Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-400 to-indigo-600 animate-pulse-slow opacity-80" />

        {/* Inner Avatar Graphic */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-black/90 border border-blue-400/60 flex items-center justify-center">
          <img
            src={avatarImg}
            alt="Maya Orb"
            className="w-full h-full object-cover pointer-events-none"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Small Active Badge */}
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-black flex items-center justify-center text-[9px] text-white">
          ⚡
        </div>
      </div>

      {/* Quick Action Popup when Orb is tapped */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-44 rounded-2xl bg-[#091325]/95 border border-blue-500/40 p-2 space-y-1.5 shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="flex items-center justify-between px-2 py-0.5 border-b border-slate-800">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              Maya Quick Orb
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              setMenuOpen(false);
              if (isListening) stopListening();
              else startListening();
            }}
            className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:bg-blue-600/30 hover:text-white flex items-center gap-2 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-blue-400" />
            {isListening ? 'Stop Listening' : 'Talk to Maya'}
          </button>

          <button
            onClick={() => {
              setMenuOpen(false);
              setCurrentTab('scan');
            }}
            className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:bg-blue-600/30 hover:text-white flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Camera Vision
          </button>

          <button
            onClick={() => {
              setMenuOpen(false);
              setCurrentTab('chat');
            }}
            className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:bg-blue-600/30 hover:text-white flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            Open Chat
          </button>

          <button
            onClick={() => {
              setMenuOpen(false);
              setFloatingOrbActive(false);
              speakText('Orb overlay minimized. You can re-enable it in Settings.');
            }}
            className="w-full text-left px-2 py-1 rounded-lg text-[10px] text-slate-400 hover:text-rose-400"
          >
            Hide Floating Orb
          </button>
        </div>
      )}
    </div>
  );
};
