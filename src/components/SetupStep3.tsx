import React from 'react';
import { useAssistant } from '../context/AssistantContext';
import {
  BatteryCharging,
  Layers,
  BellRing,
  Accessibility,
  Headset,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const avatarImg = '/src/assets/images/maya_avatar_1791573783351.jpg';

export const SetupStep3: React.FC = () => {
  const {
    step3Permissions,
    togglePermission,
    allowAllStep3,
    setCurrentTab,
  } = useAssistant();

  const getIcon = (id: string) => {
    switch (id) {
      case 'battery':
        return <BatteryCharging className="w-5 h-5 text-emerald-400" />;
      case 'overlay':
        return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'notification_listener':
        return <BellRing className="w-5 h-5 text-blue-400" />;
      case 'accessibility':
        return <Accessibility className="w-5 h-5 text-blue-400" />;
      case 'default_assistant':
        return <Headset className="w-5 h-5 text-emerald-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleFinish = () => {
    allowAllStep3();
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col justify-between max-w-md mx-auto relative px-4 py-5 font-sans select-none border-x border-slate-800/40">
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/10">
            <img
              src={avatarImg}
              alt="Maya Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Set up Maya
            </h1>
            <p className="text-xs text-slate-400 font-medium">Step 3 of 3</p>
          </div>
        </div>

        {/* 3-Step Progress Indicator */}
        <div className="grid grid-cols-3 gap-2">
          <div className="h-1 bg-blue-500 rounded-full" />
          <div className="h-1 bg-blue-500 rounded-full" />
          <div className="h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        </div>

        {/* Section Title & Subtitle */}
        <div className="pt-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Keep Maya alive in the background
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Battery is required — it is what stops her going quiet when the screen is off. The rest are optional but make her far more useful.
          </p>
        </div>
      </div>

      {/* Permissions List */}
      <div className="my-4 space-y-3 overflow-y-auto max-h-[55vh] pr-1">
        {step3Permissions.map((item) => {
          const isAllowed = item.status === 'allowed';
          return (
            <div
              key={item.id}
              onClick={() => togglePermission(item.id)}
              className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all border ${
                isAllowed
                  ? 'bg-[#0e1c2e]/90 border-blue-500/30'
                  : 'bg-[#101726]/80 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border ${
                    isAllowed
                      ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-900/90 border-slate-700/60 text-slate-400'
                  }`}
                >
                  {getIcon(item.id)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-100 truncate">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                {isAllowed ? (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#282220] text-amber-200/90 border border-amber-900/30">
                    Pending
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Notes and Action */}
      <div className="pt-2 space-y-3 pb-2 bg-[#070d18]">
        <p className="text-[11px] text-slate-400 leading-relaxed px-1">
          Tap a Pending row to open its system screen — come back here when you are done. You can change any of them later in{' '}
          <span className="text-slate-300 font-medium">Settings → Advanced → Permissions</span>.
        </p>

        <button
          onClick={handleFinish}
          className="w-full h-12 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all rounded-full font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          Finish
        </button>
      </div>
    </div>
  );
};
