import React, { useState } from 'react';
import { useAssistant } from '../context/AssistantContext';
import {
  ShieldCheck,
  Smartphone,
  Phone,
  PhoneCall,
  PhoneOff,
  MessageSquare,
  Bell,
  Cpu,
  Battery,
  Wifi,
  HardDrive,
  Eye,
  Mic,
  Lock,
  Layers,
  Sparkles,
  ChevronLeft,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Contact } from '../types';

export const MobileManagerHub: React.FC = () => {
  const {
    deviceContext,
    updateDeviceContext,
    step2Permissions,
    step3Permissions,
    togglePermission,
    allowAllStep2,
    allowAllStep3,
    logs,
    addLog,
    contacts,
    activeCall,
    startCall,
    endCall,
    notifications,
    dismissNotification,
    floatingOrbActive,
    setFloatingOrbActive,
    speakText,
    setCurrentTab,
  } = useAssistant();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'permissions' | 'comms' | 'audit'>('overview');
  const [dialNumber, setDialNumber] = useState('');
  const [smsRecipient, setSmsRecipient] = useState('');
  const [smsText, setSmsText] = useState('');
  const [smsSuccess, setSmsSuccess] = useState(false);

  const totalPermissions = step2Permissions.length + step3Permissions.length;
  const grantedPermissions =
    step2Permissions.filter((p) => p.status === 'allowed').length +
    step3Permissions.filter((p) => p.status === 'allowed').length;

  const handleDial = (num: string) => {
    const contact: Contact = {
      id: 'custom_' + Date.now(),
      name: num,
      phone: num,
      avatar: '📞',
    };
    startCall(contact);
  };

  const handleSendSms = () => {
    if (!smsRecipient || !smsText) return;
    addLog({
      type: 'sms',
      title: `SMS Sent to ${smsRecipient}`,
      details: `"${smsText}" dispatched via Maya Mobile SMS Gateway.`,
      severity: 'success',
    });
    speakText(`Text message sent to ${smsRecipient}.`);
    setSmsSuccess(true);
    setTimeout(() => {
      setSmsSuccess(false);
      setSmsText('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100 flex flex-col justify-between max-w-md mx-auto relative font-sans pb-24 border-x border-slate-800/40">
      {/* Top Header */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800"
        >
          <ChevronLeft className="w-4 h-4" />
          Home
        </button>

        <div className="text-center">
          <h2 className="text-base font-bold text-white flex items-center justify-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            Device Oversight Hub
          </h2>
          <p className="text-[10px] text-slate-400">Mobile Administrative Manager</p>
        </div>

        <button
          onClick={() => {
            allowAllStep2();
            allowAllStep3();
            speakText('All mobile permissions granted and validated.');
          }}
          className="px-2.5 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-[11px] font-semibold border border-blue-500/40 transition-colors"
        >
          Allow All
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 pt-3">
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'overview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            System
          </button>
          <button
            onClick={() => setActiveSubTab('permissions')}
            className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'permissions'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Permissions
          </button>
          <button
            onClick={() => setActiveSubTab('comms')}
            className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'comms'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Comms
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'audit'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Log
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3">
        {/* SUBTAB 1: SYSTEM OVERVIEW */}
        {activeSubTab === 'overview' && (
          <div className="space-y-3">
            {/* Permission Readiness Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0c1a2f] to-[#071324] border border-blue-500/30 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold">
                    DEVICE CONTROL LEVEL
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    {grantedPermissions === totalPermissions
                      ? '100% Full Mobile Authority'
                      : `${Math.round((grantedPermissions / totalPermissions) * 100)}% Managed`}
                  </h3>
                </div>
                <div className="text-right font-mono text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold">{grantedPermissions}</span> /{' '}
                  {totalPermissions} active
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-800/80 mt-3 overflow-hidden">
                <div
                  style={{ width: `${(grantedPermissions / totalPermissions) * 100}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                />
              </div>
            </div>

            {/* Hardware Metrics 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-[#0d1627] border border-blue-500/20">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  <span>Battery State</span>
                </div>
                <div className="text-lg font-bold text-white mt-1">
                  {deviceContext.batteryLevel}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {deviceContext.isCharging ? '⚡ Fast Charging' : 'Optimized Mode'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0d1627] border border-blue-500/20">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Wifi className="w-4 h-4 text-blue-400" />
                  <span>Data & Network</span>
                </div>
                <div className="text-lg font-bold text-white mt-1">
                  {deviceContext.network}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Signal: Nominal • 42ms
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0d1627] border border-blue-500/20">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Neural Daemon</span>
                </div>
                <div className="text-lg font-bold text-white mt-1">
                  Gemini 3.8
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Multimodal Real-Time
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0d1627] border border-blue-500/20">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Floating Orb</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-white">
                    {floatingOrbActive ? 'Enabled' : 'Hidden'}
                  </span>
                  <button
                    onClick={() => setFloatingOrbActive(!floatingOrbActive)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                      floatingOrbActive
                        ? 'bg-blue-600/30 text-blue-300 border-blue-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Toggle
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Administrative Actions */}
            <div className="p-4 rounded-2xl bg-[#0c1729] border border-blue-500/20 space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Automated Device Oversight Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setCurrentTab('scan');
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
                >
                  <Eye className="w-4 h-4 text-blue-400 mb-1" />
                  <div className="text-xs font-semibold text-white">Camera Sentinel</div>
                  <div className="text-[10px] text-slate-400">Launch vision scanner</div>
                </button>

                <button
                  onClick={() => {
                    speakText('Running full mobile diagnostic check. Battery 88 percent. Storage healthy. All background threads normal.');
                    addLog({
                      type: 'system',
                      title: 'System Diagnostic Sweep Completed',
                      details: 'All hardware units verified with zero hardware faults.',
                      severity: 'success',
                    });
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-cyan-400 mb-1" />
                  <div className="text-xs font-semibold text-white">Self Diagnostic</div>
                  <div className="text-[10px] text-slate-400">Audit system health</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: PERMISSIONS MANAGEMENT */}
        {activeSubTab === 'permissions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-300">
                Runtime Hardware Permissions
              </span>
              <button
                onClick={() => setCurrentTab('setup2')}
                className="text-[11px] text-blue-400 hover:underline"
              >
                Open Step 2 Wizard
              </button>
            </div>

            <div className="space-y-2">
              {step2Permissions.map((perm) => (
                <div
                  key={perm.id}
                  onClick={() => togglePermission(perm.id)}
                  className="p-3 rounded-xl bg-[#0d1627] border border-slate-800/80 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{perm.name}</div>
                    <div className="text-[10px] text-slate-400">{perm.description}</div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      perm.status === 'allowed'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950/40 text-amber-300 border border-amber-900/30'
                    }`}
                  >
                    {perm.status === 'allowed' ? 'Allowed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-1 pt-2">
              <span className="text-xs font-bold text-slate-300">
                System Background Capabilities
              </span>
              <button
                onClick={() => setCurrentTab('setup3')}
                className="text-[11px] text-blue-400 hover:underline"
              >
                Open Step 3 Wizard
              </button>
            </div>

            <div className="space-y-2">
              {step3Permissions.map((perm) => (
                <div
                  key={perm.id}
                  onClick={() => togglePermission(perm.id)}
                  className="p-3 rounded-xl bg-[#0d1627] border border-slate-800/80 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{perm.name}</div>
                    <div className="text-[10px] text-slate-400">{perm.description}</div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      perm.status === 'allowed'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950/40 text-amber-300 border border-amber-900/30'
                    }`}
                  >
                    {perm.status === 'allowed' ? 'Allowed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: COMMS (CALLS, SMS, WHATSAPP READER) */}
        {activeSubTab === 'comms' && (
          <div className="space-y-3">
            {/* Active Call Floating Card if any */}
            {activeCall && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-blue-950/80 border border-emerald-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{activeCall.avatar}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{activeCall.name}</h4>
                      <p className="text-xs text-emerald-400 font-mono">00:14 • Call Active</p>
                    </div>
                  </div>
                  <button
                    onClick={endCall}
                    className="p-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg cursor-pointer"
                  >
                    <PhoneOff className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Contact Dialer */}
            <div className="p-3.5 rounded-2xl bg-[#0c1729] border border-blue-500/20 space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Phone Contacts (Managed via Maya)</span>
                <span className="text-[10px] text-slate-400 font-normal">One-tap dial</span>
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{c.avatar}</span>
                      <div>
                        <div className="text-xs font-semibold text-white">{c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSmsRecipient(c.name);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                        title="SMS"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => startCall(c)}
                        className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                        title="Call"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SMS Dispatch Box */}
            <div className="p-3.5 rounded-2xl bg-[#0c1729] border border-blue-500/20 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                SMS Dispatcher
              </h4>
              <input
                type="text"
                placeholder="Recipient name or number..."
                value={smsRecipient}
                onChange={(e) => setSmsRecipient(e.target.value)}
                className="w-full bg-[#070e1c] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Message text..."
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  className="flex-1 bg-[#070e1c] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendSms}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
                >
                  Send
                </button>
              </div>
              {smsSuccess && (
                <p className="text-[11px] text-emerald-400 font-medium">
                  ✓ Text message dispatched successfully!
                </p>
              )}
            </div>

            {/* Notification Interceptor (WhatsApp & Alerts) */}
            <div className="p-3.5 rounded-2xl bg-[#0c1729] border border-blue-500/20 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Notification Reader (WhatsApp & System)</span>
                <span className="text-[10px] text-blue-400 font-mono">Listener active</span>
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-400">
                          [{n.app}]
                        </span>
                        <span className="text-xs font-semibold text-white">{n.sender}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                        {n.preview}
                      </p>
                    </div>
                    <span className="text-[9px] text-slate-500 whitespace-nowrap">
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: AUDIT LOG */}
        {activeSubTab === 'audit' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-300">
                Administrative Oversight Event Stream
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {logs.length} logged
              </span>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#0a1222] border border-slate-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          log.severity === 'success'
                            ? 'bg-emerald-400'
                            : log.severity === 'warning'
                            ? 'bg-amber-400'
                            : 'bg-blue-400'
                        }`}
                      />
                      {log.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
