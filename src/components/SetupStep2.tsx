import React, { useState } from 'react';
import { useAssistant } from '../context/AssistantContext';
import {
  Mic,
  Bell,
  Camera,
  Phone,
  Contact as ContactIcon,
  MessageSquare,
  MapPin,
  Image as ImageIcon,
  Headphones,
  Bluetooth,
  Check,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const avatarImg = '/src/assets/images/maya_avatar_1791573783351.jpg';

export const SetupStep2: React.FC = () => {
  const {
    step2Permissions,
    togglePermission,
    allowAllStep2,
    micAllowed,
    setCurrentTab,
  } = useAssistant();

  const [requestingAll, setRequestingAll] = useState(false);

  const getIcon = (id: string) => {
    switch (id) {
      case 'mic':
        return <Mic className="w-5 h-5 text-blue-400" />;
      case 'notifications':
        return <Bell className="w-5 h-5 text-blue-400" />;
      case 'camera':
        return <Camera className="w-5 h-5 text-blue-400" />;
      case 'phone':
        return <Phone className="w-5 h-5 text-blue-400" />;
      case 'contacts':
        return <ContactIcon className="w-5 h-5 text-blue-400" />;
      case 'sms':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'location':
        return <MapPin className="w-5 h-5 text-blue-400" />;
      case 'gallery':
        return <ImageIcon className="w-5 h-5 text-blue-400" />;
      case 'manage_calls':
        return <Headphones className="w-5 h-5 text-blue-400" />;
      case 'bluetooth':
        return <Bluetooth className="w-5 h-5 text-blue-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleAllowAll = async () => {
    setRequestingAll(true);
    await allowAllStep2();
    setRequestingAll(false);
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
            <p className="text-xs text-slate-400 font-medium">Step 2 of 3</p>
          </div>
        </div>

        {/* 3-Step Progress Indicator */}
        <div className="grid grid-cols-3 gap-2">
          <div className="h-1 bg-blue-500 rounded-full" />
          <div className="h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <div className="h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Section Title & Subtitle */}
        <div className="pt-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Let Maya use your phone
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            One tap — Android asks for each in turn. Only the microphone is required; the rest make her useful.
          </p>
        </div>
      </div>

      {/* Permissions List */}
      <div className="my-4 space-y-2.5 overflow-y-auto max-h-[55vh] pr-1">
        {step2Permissions.map((item) => {
          const isAllowed = item.status === 'allowed';
          return (
            <div
              key={item.id}
              onClick={() => togglePermission(item.id)}
              className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all border ${
                isAllowed
                  ? 'bg-[#0f1b30]/90 border-blue-500/30'
                  : 'bg-[#101726]/80 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border ${
                    isAllowed
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
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
                    {item.required && (
                      <span className="text-[10px] text-blue-400 font-medium">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                {isAllowed ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    Allowed
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

      {/* Action CTA Buttons */}
      <div className="pt-2 space-y-3 pb-2 bg-[#070d18]">
        <button
          onClick={handleAllowAll}
          disabled={requestingAll}
          className="w-full h-12 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all rounded-full font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-60 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          {requestingAll ? 'Requesting Permissions...' : 'Allow all'}
        </button>

        <button
          onClick={() => setCurrentTab('setup3')}
          disabled={!micAllowed}
          className={`w-full h-12 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            micAllowed
              ? 'bg-[#15233c] hover:bg-[#1c3052] text-white border border-blue-500/40 shadow-sm'
              : 'bg-[#0f1726] text-slate-600 border border-slate-800/80 cursor-not-allowed'
          }`}
        >
          <ArrowRight className="w-4 h-4" />
          Continue
        </button>

        <p className="text-[11px] text-center text-slate-400">
          Continue unlocks once the microphone is allowed.
        </p>
      </div>
    </div>
  );
};
