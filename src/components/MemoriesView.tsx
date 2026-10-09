import React, { useState } from 'react';
import { useAssistant } from '../context/AssistantContext';
import {
  Brain,
  Sparkles,
  Calendar,
  Heart,
  ChevronLeft,
  Trash2,
  Plus,
  BookOpen,
  Camera,
  Shield,
  User,
} from 'lucide-react';

export const MemoriesView: React.FC = () => {
  const { deviceContext, updateDeviceContext, setCurrentTab, addLog, speakText } = useAssistant();

  const [memories, setMemories] = useState([
    {
      id: 'm1',
      date: 'Today, 10:15 AM',
      category: 'Preference',
      content: 'User prefers notifications silenced during focus study mode.',
    },
    {
      id: 'm2',
      date: 'Yesterday, 4:30 PM',
      category: 'Security',
      content: 'Camera oversight sentinel configured for 12s automatic environment sweep.',
    },
    {
      id: 'm3',
      date: 'Oct 5, 2026',
      category: 'Routine',
      content: 'Morning diagnostic routine runs battery and network check at 8:00 AM.',
    },
  ]);

  const [newMemory, setNewMemory] = useState('');
  const [userNameInput, setUserNameInput] = useState(deviceContext.userName);
  const [isEditingUser, setIsEditingUser] = useState(false);

  const handleAddMemory = () => {
    if (!newMemory.trim()) return;
    const item = {
      id: 'mem_' + Date.now(),
      date: 'Just now',
      category: 'Note',
      content: newMemory.trim(),
    };
    setMemories([item, ...memories]);
    addLog({
      type: 'system',
      title: 'Memory Stored',
      details: newMemory,
      severity: 'info',
    });
    speakText('Memory saved into Maya permanent store.');
    setNewMemory('');
  };

  const handleDelete = (id: string) => {
    setMemories(memories.filter((m) => m.id !== id));
  };

  const handleSaveUserName = () => {
    if (userNameInput.trim()) {
      updateDeviceContext({ userName: userNameInput.trim() });
      setIsEditingUser(false);
      speakText(`Name updated to ${userNameInput}.`);
    }
  };

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

        <div className="flex items-center gap-1.5 text-center">
          <Brain className="w-4 h-4 text-blue-400" />
          <h2 className="text-base font-bold text-white">Maya Memories</h2>
        </div>

        <button
          onClick={() => setCurrentTab('manager')}
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
        >
          Manager
        </button>
      </div>

      <div className="flex-1 px-4 py-3 space-y-4 overflow-y-auto">
        {/* User Identity Card */}
        <div className="p-4 rounded-2xl bg-[#0d1729] border border-blue-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              User Profile
            </span>
            <button
              onClick={() => setIsEditingUser(!isEditingUser)}
              className="text-[11px] text-blue-400 hover:underline"
            >
              {isEditingUser ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditingUser ? (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                className="flex-1 bg-[#070e1c] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
              />
              <button
                onClick={handleSaveUserName}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-base font-bold text-white">{deviceContext.userName}</h3>
              <p className="text-[11px] text-slate-400">
                Primary Operator • Full Device Administrative Authority
              </p>
            </div>
          )}
        </div>

        {/* Add Memory Input */}
        <div className="p-3.5 rounded-2xl bg-[#0d1729] border border-blue-500/20 space-y-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Add New Knowledge
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tell Maya something to remember..."
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMemory()}
              className="flex-1 bg-[#070e1c] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddMemory}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Memories List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300">Retained Intelligence</span>
            <span className="text-[10px] text-slate-500 font-mono">{memories.length} entries</span>
          </div>

          {memories.map((m) => (
            <div
              key={m.id}
              className="p-3 rounded-2xl bg-[#0c1626] border border-slate-800 flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-500/20">
                    {m.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{m.date}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{m.content}</p>
              </div>

              <button
                onClick={() => handleDelete(m.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                title="Delete memory"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
