import React, { useState, useRef, useEffect } from 'react';
import { useAssistant } from '../context/AssistantContext';
import {
  Send,
  Camera,
  Paperclip,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  Check,
  Bot,
} from 'lucide-react';

const avatarImg = '/src/assets/images/maya_avatar_1791573783351.jpg';

export const ChatConsole: React.FC = () => {
  const {
    chatMessages,
    sendMessage,
    isProcessing,
    isSpeaking,
    isListening,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    setCurrentTab,
  } = useAssistant();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isProcessing]);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const samplePrompts = [
    'Check my battery health and network',
    'Simulate dialing Sarah Connor',
    'Turn on camera surveillance oversight',
    'Read my pending notifications',
  ];

  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100 flex flex-col justify-between max-w-md mx-auto relative font-sans pb-24 border-x border-slate-800/40">
      {/* Top Header */}
      <div className="px-4 pt-3 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800"
        >
          <ChevronLeft className="w-4 h-4" />
          Home
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-400/40 bg-blue-950/80">
            <img src={avatarImg} alt="Maya" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">Maya Assistant</h2>
            <p className="text-[10px] text-emerald-400 font-medium">● Device Control Online</p>
          </div>
        </div>

        <button
          onClick={() => (isSpeaking ? stopSpeaking() : speakText('Maya is ready to assist you.'))}
          className={`p-2 rounded-xl border text-xs ${
            isSpeaking
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
          title="Voice Read-out"
        >
          {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'maya' && (
              <div className="w-7 h-7 rounded-full overflow-hidden border border-blue-400/40 bg-blue-950 shrink-0 mt-0.5">
                <img src={avatarImg} alt="Maya" className="w-full h-full object-cover" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-600/20'
                  : 'bg-[#0e192c] text-slate-200 border border-blue-500/20 rounded-tl-xs shadow-sm'
              }`}
            >
              {msg.imageData && (
                <div className="rounded-lg overflow-hidden border border-white/20 mb-2 max-h-36">
                  <img src={msg.imageData} alt="Captured scan" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="whitespace-pre-line">{msg.text}</div>
              <div
                className={`text-[9px] text-right ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-blue-400 font-medium pl-9">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-400" />
            <span>Maya is thinking and accessing device controls...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => sendMessage(p)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="px-4 pt-1 pb-2">
        <div className="flex items-center gap-2 p-2 rounded-full bg-[#0d1627] border border-blue-500/30">
          <button
            onClick={() => setCurrentTab('scan')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white"
            title="Scan with Camera"
          >
            <Camera className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Command Maya (e.g. Call John)..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none px-1"
          />

          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isListening ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center shadow-md shadow-blue-500/20"
          >
            <Send className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
