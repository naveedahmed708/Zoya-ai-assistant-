/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AssistantProvider, useAssistant } from './context/AssistantContext';
import { SetupStep2 } from './components/SetupStep2';
import { SetupStep3 } from './components/SetupStep3';
import { MayaHome } from './components/MayaHome';
import { ScanVisionMonitor } from './components/ScanVisionMonitor';
import { MobileManagerHub } from './components/MobileManagerHub';
import { ChatConsole } from './components/ChatConsole';
import { MemoriesView } from './components/MemoriesView';
import { BottomNavBar } from './components/BottomNavBar';
import { FloatingOrb } from './components/FloatingOrb';
import { DrawerMenu } from './components/DrawerMenu';
import { NotificationsModal } from './components/NotificationsModal';
import { Smartphone, Shield, Eye, Mic, Zap } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentTab, setCurrentTab, deviceContext } = useAssistant();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Responsive layout container: Full centered smartphone container with subtle shadow & glow */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[844px] sm:max-h-[920px] sm:my-6 sm:rounded-[40px] sm:border-[8px] sm:border-slate-800/90 sm:shadow-[0_0_50px_rgba(30,58,138,0.35)] relative overflow-hidden bg-[#060b16] flex flex-col justify-between">
        {/* Top Phone Speaker / Island Notch */}
        <div className="hidden sm:flex absolute top-2 inset-x-0 justify-center z-50 pointer-events-none">
          <div className="w-28 h-4 rounded-full bg-slate-900 border border-slate-800/60 flex items-center justify-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
            <div className="w-10 h-1 rounded-full bg-slate-800" />
          </div>
        </div>

        {/* Dynamic View Router */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'setup2' && <SetupStep2 />}
          {currentTab === 'setup3' && <SetupStep3 />}
          {currentTab === 'home' && (
            <MayaHome
              onOpenMenu={() => setDrawerOpen(true)}
              onOpenNotifications={() => setNotificationsOpen(true)}
            />
          )}
          {currentTab === 'scan' && <ScanVisionMonitor />}
          {currentTab === 'manager' && <MobileManagerHub />}
          {currentTab === 'chat' && <ChatConsole />}
          {currentTab === 'memories' && <MemoriesView />}
        </main>

        {/* Bottom Tab Navigation */}
        <BottomNavBar />

        {/* Global Floating Maya Orb (Display Over Other Apps) */}
        <FloatingOrb />

        {/* Navigation Drawer */}
        <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

        {/* Notifications Modal */}
        <NotificationsModal
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />
      </div>

      {/* Desktop Quick Control Toolbar (visible on wider viewports) */}
      <div className="hidden lg:flex fixed bottom-6 left-6 z-30 items-center gap-2 px-3 py-2 rounded-2xl bg-[#091325]/90 border border-blue-500/30 backdrop-blur-md shadow-xl text-xs text-slate-300">
        <Smartphone className="w-4 h-4 text-blue-400" />
        <span className="font-semibold text-white">Maya Mobile Manager Active</span>
        <span className="text-slate-600">|</span>
        <button
          onClick={() => setCurrentTab('setup2')}
          className="hover:text-blue-400 cursor-pointer"
        >
          Setup Step 2
        </button>
        <span className="text-slate-600">·</span>
        <button
          onClick={() => setCurrentTab('setup3')}
          className="hover:text-blue-400 cursor-pointer"
        >
          Setup Step 3
        </button>
        <span className="text-slate-600">·</span>
        <button
          onClick={() => setCurrentTab('manager')}
          className="hover:text-blue-400 cursor-pointer"
        >
          Oversight Hub
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AssistantProvider>
      <AppContent />
    </AssistantProvider>
  );
}
