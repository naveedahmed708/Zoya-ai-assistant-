import React from 'react';
import { useAssistant } from '../context/AssistantContext';
import { Home, Scan, Brain, MessageSquare, Mic, MicOff } from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const { currentTab, setCurrentTab, isListening, startListening, stopListening } = useAssistant();

  // If in setup wizard 2 or 3, hide bottom nav
  if (currentTab === 'setup2' || currentTab === 'setup3') {
    return null;
  }

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto z-40 bg-[#070e1c]/95 backdrop-blur-md border-t border-blue-900/30 px-3 py-1.5 select-none">
      <div className="flex items-center justify-between relative">
        {/* Tab 1: Home */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            currentTab === 'home' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Home</span>
        </button>

        {/* Tab 2: Scan */}
        <button
          onClick={() => setCurrentTab('scan')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            currentTab === 'scan' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scan className={`w-5 h-5 ${currentTab === 'scan' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Scan</span>
        </button>

        {/* Floating Center Mic Button Spacer */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <button
            onClick={handleMicClick}
            aria-label="Voice assistant microphone"
            className={`absolute -top-7 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white shadow-rose-600/40 ring-4 ring-rose-500/30 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/40 ring-4 ring-blue-500/20'
            }`}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <Mic className="w-6 h-6 stroke-[2.5]" />
            )}
          </button>
        </div>

        {/* Tab 4: Memories */}
        <button
          onClick={() => setCurrentTab('memories')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            currentTab === 'memories' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className={`w-5 h-5 ${currentTab === 'memories' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Memories</span>
        </button>

        {/* Tab 5: Chat */}
        <button
          onClick={() => setCurrentTab('chat')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            currentTab === 'chat' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare
            className={`w-5 h-5 ${currentTab === 'chat' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`}
          />
          <span className="text-[10px] font-medium tracking-tight mt-1">Chat</span>
        </button>
      </div>
    </div>
  );
};
