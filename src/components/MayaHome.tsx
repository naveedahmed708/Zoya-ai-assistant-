import React, { useState, useEffect } from 'react';
import { useAssistant } from '../context/AssistantContext';
import {
  Menu,
  Bell,
  Lock,
  Zap,
  Moon,
  Mic,
  MicOff,
  Music,
  BookOpen,
  Edit3,
  Sun,
  Calendar,
  Heart,
  Paperclip,
  Send,
  Camera,
  MessageSquare,
  Sparkles,
  Shield,
  Activity,
  Layers,
  Phone,
} from 'lucide-react';

const avatarImg = '/src/assets/images/maya_avatar_1791573783351.jpg';
const cosmicBg = '/src/assets/images/cosmic_hud_bg_1791573800938.jpg';

interface MayaHomeProps {
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
}

export const MayaHome: React.FC<MayaHomeProps> = ({ onOpenMenu, onOpenNotifications }) => {
  const {
    deviceContext,
    updateDeviceContext,
    setCurrentTab,
    isListening,
    isSpeaking,
    audioLevel,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    sendMessage,
    isProcessing,
    assistantStatusText,
    notifications,
    addLog,
  } = useAssistant();

  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [journalOpen, setJournalOpen] = useState(false);
  const [journalNote, setJournalNote] = useState('');
  const [musicPlaying, setMusicPlaying] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSend = () => {
    if (!inputPrompt.trim()) return;
    sendMessage(inputPrompt);
    setInputPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleQuickAction = (action: 'music' | 'study' | 'journal') => {
    setSelectedAction(action);
    if (action === 'music') {
      setMusicPlaying(!musicPlaying);
      const text = !musicPlaying
        ? 'Playing your chill focus playlist via Mobile Sound Manager.'
        : 'Music paused.';
      speakText(text);
      addLog({
        type: 'system',
        title: 'Media Controller: Focus Playlist',
        details: text,
        severity: 'info',
      });
    } else if (action === 'study') {
      speakText('Study mode enabled. Distractions muted, timer set for 25 minutes.');
      addLog({
        type: 'system',
        title: 'Study Mode Activated',
        details: 'Notifications silenced and high-priority learning environment initiated.',
        severity: 'success',
      });
    } else if (action === 'journal') {
      setJournalOpen(true);
    }
  };

  // Generate dynamic waveform bars based on audio level or idle breathing
  const barCount = 28;
  const waveformBars = Array.from({ length: barCount }).map((_, idx) => {
    const centerDist = Math.abs(idx - barCount / 2) / (barCount / 2);
    let heightPercent = 15;
    if (isListening || isSpeaking) {
      const multiplier = Math.max(0.2, 1 - centerDist * 0.6);
      heightPercent = Math.min(95, Math.max(12, audioLevel * multiplier + Math.random() * 18));
    } else {
      // Gentle idle subtle sine oscillation
      heightPercent = 14 + Math.sin(idx * 0.5 + Date.now() / 800) * 8;
    }
    return heightPercent;
  });

  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100 flex flex-col justify-between max-w-md mx-auto relative font-sans select-none overflow-x-hidden border-x border-slate-800/40 pb-24">
      {/* Background subtle cosmic nebula */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url(${cosmicBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060b16]/70 to-[#060b16] pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 px-4 pt-3 space-y-4">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onOpenMenu}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer"
            title="Menu & Oversight"
          >
            <Menu className="w-6 h-6 stroke-[2]" />
          </button>

          <span className="text-xl font-bold tracking-tight text-white">Maya</span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenNotifications}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800/50 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-[#060b16]" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('manager')}
              className="w-9 h-9 rounded-xl overflow-hidden border border-blue-400/40 bg-blue-950/80 shadow-md shadow-blue-500/10 cursor-pointer"
              title="Maya Profile & Mobile Manager"
            >
              <img
                src={avatarImg}
                alt="Maya Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </button>
          </div>
        </div>

        {/* Free Mode Banner */}
        <div className="p-3 rounded-2xl bg-[#0f1b2f]/90 border border-blue-500/20 backdrop-blur-sm flex items-center justify-between gap-3 shadow-lg shadow-blue-950/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-900/60 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-300">
              <Lock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 truncate">
                <span>Free mode</span>
                <span>•</span>
                <span className="text-blue-400 font-mono">
                  {deviceContext.remainingMinutes}:00 min left today
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Activate a license for tools, PC link and unlimited talk
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              updateDeviceContext({ licenseActive: true, remainingMinutes: 999 });
              speakText('License activated! Unlimited mobile oversight unlocked.');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-xs font-semibold text-blue-300 hover:text-white border border-blue-500/40 transition-colors shrink-0 cursor-pointer"
          >
            {deviceContext.licenseActive ? 'Active' : 'Activate'}
          </button>
        </div>

        {/* Greeting Section */}
        <div className="flex items-start justify-between pt-1">
          <div>
            <p className="text-sm font-medium text-slate-400">Good morning,</p>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-0.5">
              {deviceContext.userName}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              {isListening ? (
                <span className="text-blue-400 font-medium flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  Maya is listening...
                </span>
              ) : isSpeaking ? (
                <span className="text-cyan-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  Maya is speaking...
                </span>
              ) : isProcessing ? (
                <span className="text-amber-400 font-medium flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  Maya is processing command...
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Moon className="w-3.5 h-3.5 text-slate-500" />
                  {assistantStatusText}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111e33] border border-blue-500/20 text-xs font-semibold text-white shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{deviceContext.energy} Energy</span>
          </div>
        </div>

        {/* Center Holographic Concentric HUD Visualizer */}
        <div className="relative py-4 flex flex-col items-center justify-center">
          {/* Circular HUD Background Rings */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Outer subtle orbital ring with crosshairs */}
            <div className="absolute inset-0 rounded-full border border-blue-500/15 animate-radar-sweep pointer-events-none" />
            <div className="absolute inset-3 rounded-full border border-dashed border-blue-400/20 pointer-events-none" />
            
            {/* Glowing cyan arc */}
            <div
              className={`absolute inset-6 rounded-full border-2 border-transparent transition-all duration-300 pointer-events-none ${
                isListening || isSpeaking
                  ? 'border-t-blue-400 border-r-cyan-400 shadow-[0_0_25px_rgba(59,130,246,0.35)] rotate-45'
                  : 'border-t-blue-500/40 border-l-blue-400/30'
              }`}
            />

            {/* Crosshair ticks */}
            <div className="absolute top-1 text-[10px] text-blue-400/40 font-mono">+</div>
            <div className="absolute bottom-1 text-[10px] text-blue-400/40 font-mono">+</div>
            <div className="absolute left-1 text-[10px] text-blue-400/40 font-mono">+</div>
            <div className="absolute right-1 text-[10px] text-blue-400/40 font-mono">+</div>

            {/* Inner HUD Core Box */}
            <div
              onClick={handleMicToggle}
              className="w-48 h-48 rounded-full bg-gradient-to-b from-[#0b162a]/95 to-[#070e1c]/95 border border-blue-500/30 shadow-[0_0_35px_rgba(14,165,233,0.15)] flex flex-col items-center justify-center cursor-pointer p-4 select-none hover:border-blue-400/60 transition-all active:scale-[0.98]"
            >
              <span className="text-[10px] tracking-[0.25em] text-slate-400 uppercase font-medium">
                AI ASSISTANT
              </span>

              <h1 className="text-3xl font-extrabold tracking-widest text-white mt-1 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                M.A.Y.A
              </h1>

              {/* Waveform Equalizer Display */}
              <div className="flex items-center justify-center gap-1 h-7 my-2.5 px-3 w-full">
                {waveformBars.map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`w-[2.5px] rounded-full transition-all duration-75 ${
                      isListening
                        ? 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]'
                        : isSpeaking
                        ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]'
                        : 'bg-blue-600/40'
                    }`}
                  />
                ))}
              </div>

              <span className="text-[9px] tracking-[0.18em] text-slate-400 uppercase font-semibold">
                HOW CAN I HELP YOU?
              </span>
            </div>
          </div>

          {/* Quick Action Category Shortcuts */}
          <div className="flex items-center justify-center gap-3 mt-2">
            <button
              onClick={() => handleQuickAction('music')}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                musicPlaying
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30'
                  : 'bg-[#101b2e]/80 text-slate-200 border-blue-500/20 hover:border-blue-400/40'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-blue-400" />
              Music
            </button>

            <button
              onClick={() => handleQuickAction('study')}
              className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 bg-[#101b2e]/80 text-slate-200 border border-blue-500/20 hover:border-blue-400/40 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              Study
            </button>

            <button
              onClick={() => handleQuickAction('journal')}
              className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 bg-[#101b2e]/80 text-slate-200 border border-blue-500/20 hover:border-blue-400/40 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              Journal
            </button>
          </div>
        </div>

        {/* 3 Overview Information Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Weather Widget */}
          <div
            onClick={() => {
              speakText(`Weather in ${deviceContext.locationCity} is ${deviceContext.temperature}, ${deviceContext.weatherCondition} with ${deviceContext.humidity} humidity.`);
            }}
            className="p-3 rounded-2xl bg-[#0f192b]/85 border border-blue-500/20 backdrop-blur-sm cursor-pointer hover:border-blue-400/40 transition-all"
          >
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Weather</span>
            </div>
            <div className="mt-1">
              <div className="text-lg font-bold text-white tracking-tight">
                {deviceContext.temperature}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {deviceContext.weatherCondition}
              </div>
              <div className="text-[10px] text-blue-400/90 mt-0.5">
                💧 {deviceContext.humidity}
              </div>
            </div>
          </div>

          {/* Today Date Widget */}
          <div
            onClick={() => {
              speakText(`Today is ${deviceContext.dateStr}. All scheduled phone operations are on track.`);
            }}
            className="p-3 rounded-2xl bg-[#0f192b]/85 border border-blue-500/20 backdrop-blur-sm cursor-pointer hover:border-blue-400/40 transition-all"
          >
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Today</span>
            </div>
            <div className="mt-1">
              <div className="text-lg font-bold text-white tracking-tight">
                {deviceContext.dayNumber}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {deviceContext.dayName}, {deviceContext.monthName}
              </div>
              <div className="text-[10px] text-slate-400/80 mt-0.5">
                {deviceContext.batteryLevel}% Battery
              </div>
            </div>
          </div>

          {/* Mood Widget */}
          <div
            onClick={() => {
              speakText("You are feeling warm and all good. I'm keeping everything monitored.");
            }}
            className="p-3 rounded-2xl bg-[#0f192b]/85 border border-blue-500/20 backdrop-blur-sm cursor-pointer hover:border-blue-400/40 transition-all"
          >
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>Mood</span>
            </div>
            <div className="mt-1">
              <div className="text-lg font-bold text-white tracking-tight">
                Warm
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                All good
              </div>
              <div className="text-[10px] text-emerald-400/90 mt-0.5">
                ● Balanced
              </div>
            </div>
          </div>
        </div>

        {/* Ask Maya Input Bar */}
        <div className="pt-1">
          <div className="flex items-center gap-2 p-2 rounded-full bg-[#0d1627] border border-blue-500/30 shadow-inner">
            <button
              onClick={() => setCurrentTab('scan')}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Camera Scan & Vision"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Maya anything..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none px-1"
            />

            <button
              onClick={handleSend}
              disabled={!inputPrompt.trim()}
              className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-blue-500/20"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Journal Modal if opened */}
      {journalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#0d1729] border border-blue-500/30 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-400" />
                Maya Personal Journal
              </h3>
              <button
                onClick={() => setJournalOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <textarea
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="Record a thought, reflection, or note for Maya to remember..."
              rows={4}
              className="w-full bg-[#070d18] border border-slate-700 rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-blue-400"
            />
            <button
              onClick={() => {
                if (journalNote.trim()) {
                  addLog({
                    type: 'system',
                    title: 'Journal Entry Recorded',
                    details: journalNote,
                    severity: 'success',
                  });
                  speakText('Saved to your Maya memories.');
                  setJournalNote('');
                }
                setJournalOpen(false);
              }}
              className="w-full py-2.5 rounded-full bg-blue-600 font-semibold text-xs text-white"
            >
              Save Memory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
