import React from 'react';
import { useAssistant } from '../context/AssistantContext';
import {
  X,
  Home,
  ShieldCheck,
  Eye,
  Sliders,
  Brain,
  MessageSquare,
  Layers,
  Battery,
  Lock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const avatarImg = '/src/assets/images/maya_avatar_1791573783351.jpg';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({ isOpen, onClose }) => {
  const {
    currentTab,
    setCurrentTab,
    deviceContext,
    updateDeviceContext,
    floatingOrbActive,
    setFloatingOrbActive,
    speakText,
  } = useAssistant();

  if (!isOpen) return null;

  const navigateTo = (tab: any) => {
    setCurrentTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-start animate-fadeIn">
      <div className="w-72 h-full bg-[#070e1c] border-r border-blue-500/30 p-5 flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-blue-400/40 bg-blue-950">
                <img src={avatarImg} alt="Maya" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">M.A.Y.A OS</h3>
                <p className="text-[10px] text-blue-400 font-mono">v3.8 Full Authority</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 text-sm font-medium">
            <button
              onClick={() => navigateTo('home')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              Home HUD
            </button>

            <button
              onClick={() => navigateTo('scan')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                currentTab === 'scan'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              Camera Vision Sentinel
            </button>

            <button
              onClick={() => navigateTo('manager')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                currentTab === 'manager'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Device Oversight Hub
            </button>

            <button
              onClick={() => navigateTo('chat')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                currentTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Maya AI Assistant Chat
            </button>

            <button
              onClick={() => navigateTo('memories')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                currentTab === 'memories'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4" />
              Memories & Notes
            </button>
          </div>

          {/* Setup Wizard Quick Access */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Setup Wizard Flows
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigateTo('setup2')}
                className="px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 text-left cursor-pointer"
              >
                <div className="text-[10px] text-blue-400">Step 2 of 3</div>
                Let Maya Use Phone
              </button>

              <button
                onClick={() => navigateTo('setup3')}
                className="px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 text-left cursor-pointer"
              >
                <div className="text-[10px] text-emerald-400">Step 3 of 3</div>
                Keep Maya Alive
              </button>
            </div>
          </div>

          {/* Quick Toggle Controls */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Floating Assistant Orb
              </span>
              <button
                onClick={() => {
                  setFloatingOrbActive(!floatingOrbActive);
                  speakText(
                    floatingOrbActive ? 'Floating orb hidden.' : 'Floating orb active on screen.'
                  );
                }}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                  floatingOrbActive ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    floatingOrbActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
          <div className="flex items-center justify-between font-mono">
            <span>Operator: {deviceContext.userName}</span>
            <span>{deviceContext.batteryLevel}% ⚡</span>
          </div>
        </div>
      </div>
    </div>
  );
};
