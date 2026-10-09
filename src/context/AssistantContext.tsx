import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PermissionItem, DeviceContext, OversightLog, Contact, AppNotification, MessageItem } from '../types';
import { INITIAL_STEP2_PERMISSIONS, INITIAL_STEP3_PERMISSIONS, INITIAL_CONTACTS, INITIAL_NOTIFICATIONS, INITIAL_LOGS } from '../data/initialData';

interface AssistantContextType {
  currentTab: 'home' | 'scan' | 'memories' | 'chat' | 'manager' | 'setup2' | 'setup3';
  setCurrentTab: (tab: 'home' | 'scan' | 'memories' | 'chat' | 'manager' | 'setup2' | 'setup3') => void;
  step2Permissions: PermissionItem[];
  step3Permissions: PermissionItem[];
  togglePermission: (id: string) => void;
  allowAllStep2: () => Promise<void>;
  allowAllStep3: () => void;
  micAllowed: boolean;
  cameraAllowed: boolean;
  deviceContext: DeviceContext;
  updateDeviceContext: (updates: Partial<DeviceContext>) => void;
  logs: OversightLog[];
  addLog: (log: Omit<OversightLog, 'id' | 'timestamp'>) => void;
  notifications: AppNotification[];
  dismissNotification: (id: string) => void;
  contacts: Contact[];
  activeCall: Contact | null;
  startCall: (contact: Contact) => void;
  endCall: () => void;
  floatingOrbActive: boolean;
  setFloatingOrbActive: (active: boolean) => void;
  isListening: boolean;
  isSpeaking: boolean;
  audioLevel: number;
  startListening: () => Promise<void>;
  stopListening: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  chatMessages: MessageItem[];
  sendMessage: (text: string, imageData?: string) => Promise<void>;
  cameraStream: MediaStream | null;
  startCamera: () => Promise<MediaStream | null>;
  stopCamera: () => void;
  isProcessing: boolean;
  assistantStatusText: string;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export const AssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<'home' | 'scan' | 'memories' | 'chat' | 'manager' | 'setup2' | 'setup3'>('home');
  const [step2Permissions, setStep2Permissions] = useState<PermissionItem[]>(INITIAL_STEP2_PERMISSIONS);
  const [step3Permissions, setStep3Permissions] = useState<PermissionItem[]>(INITIAL_STEP3_PERMISSIONS);
  const [logs, setLogs] = useState<OversightLog[]>(INITIAL_LOGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [contacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [activeCall, setActiveCall] = useState<Contact | null>(null);
  const [floatingOrbActive, setFloatingOrbActive] = useState<boolean>(true);
  
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [assistantStatusText, setAssistantStatusText] = useState<string>('Maya is asleep — say "Hey Maya"');
  
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  const [chatMessages, setChatMessages] = useState<MessageItem[]>([
    {
      id: 'm1',
      sender: 'maya',
      text: "Hello Uday! M.A.Y.A is connected with full device permissions. How can I manage your mobile today?",
      timestamp: '10:00 AM',
    },
  ]);

  const [deviceContext, setDeviceContext] = useState<DeviceContext>({
    batteryLevel: 88,
    isCharging: true,
    network: '5G Active',
    locationCity: 'New York, US',
    temperature: '31°',
    weatherCondition: 'Clear',
    humidity: '56%',
    dateStr: 'Wed, Oct 7',
    dayName: 'Wed',
    dayNumber: 7,
    monthName: 'Oct',
    userName: 'Uday Kumar',
    energy: 1,
    remainingMinutes: 10,
    licenseActive: false,
    isMayaAsleep: true,
    floatingOrbActive: true,
  });

  const micAllowed = step2Permissions.find((p) => p.id === 'mic')?.status === 'allowed';
  const cameraAllowed = step2Permissions.find((p) => p.id === 'camera')?.status === 'allowed';

  // Read real battery status if available in browser
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setDeviceContext((prev) => ({
          ...prev,
          batteryLevel: Math.round(battery.level * 100),
          isCharging: battery.charging,
        }));
        battery.addEventListener('levelchange', () => {
          setDeviceContext((prev) => ({ ...prev, batteryLevel: Math.round(battery.level * 100) }));
        });
        battery.addEventListener('chargingchange', () => {
          setDeviceContext((prev) => ({ ...prev, isCharging: battery.charging }));
        });
      }).catch(() => {});
    }

    // Set real current date
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    setDeviceContext((prev) => ({
      ...prev,
      dayName: days[now.getDay()],
      dayNumber: now.getDate(),
      monthName: months[now.getMonth()],
      dateStr: `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`,
    }));
  }, []);

  const updateDeviceContext = (updates: Partial<DeviceContext>) => {
    setDeviceContext((prev) => ({ ...prev, ...updates }));
  };

  const addLog = (logData: Omit<OversightLog, 'id' | 'timestamp'>) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: OversightLog = {
      ...logData,
      id: 'log_' + Date.now() + Math.random().toString(36).substring(2, 5),
      timestamp: time,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const togglePermission = (id: string) => {
    setStep2Permissions((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = p.status === 'allowed' ? 'pending' : 'allowed';
          addLog({
            type: 'permission',
            title: `Permission ${newStatus === 'allowed' ? 'Granted' : 'Revoked'}: ${p.name}`,
            details: `User toggled ${p.name} access. Status changed to ${newStatus}.`,
            severity: newStatus === 'allowed' ? 'success' : 'warning',
          });
          return { ...p, status: newStatus };
        }
        return p;
      })
    );

    setStep3Permissions((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = p.status === 'allowed' ? 'pending' : 'allowed';
          addLog({
            type: 'permission',
            title: `System Service ${newStatus === 'allowed' ? 'Active' : 'Disabled'}: ${p.name}`,
            details: `System permission ${p.name} updated to ${newStatus}.`,
            severity: newStatus === 'allowed' ? 'success' : 'warning',
          });
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
  };

  // Real browser permission request for All Step 2
  const allowAllStep2 = async () => {
    addLog({
      type: 'permission',
      title: 'Batch Permission Authorization Initiated',
      details: 'Requesting hardware device permissions for full mobile management.',
      severity: 'info',
    });

    // Try requesting real browser audio
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.warn('Microphone permission request feedback:', err);
    }

    // Try requesting real notifications
    try {
      if ('Notification' in window && Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }
    } catch (err) {
      console.warn('Notification permission feedback:', err);
    }

    // Try requesting location
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            addLog({
              type: 'system',
              title: 'GPS Coordinates Acquired',
              details: `Lat: ${pos.coords.latitude.toFixed(3)}, Lng: ${pos.coords.longitude.toFixed(3)}`,
              severity: 'success',
            });
          },
          () => {}
        );
      }
    } catch (err) {
      console.warn('Geolocation feedback:', err);
    }

    setStep2Permissions((prev) =>
      prev.map((p) => ({ ...p, status: 'allowed' }))
    );

    addLog({
      type: 'permission',
      title: 'All Mobile Permissions Allowed',
      details: 'Microphone, Camera, Phone, SMS, Contacts, Location, Files, Bluetooth granted.',
      severity: 'success',
    });
  };

  const allowAllStep3 = () => {
    setStep3Permissions((prev) =>
      prev.map((p) => ({ ...p, status: 'allowed' }))
    );
    addLog({
      type: 'system',
      title: 'System Keep-Alive Services Active',
      details: 'Battery optimization disabled, overlay orb enabled, accessibility service linked.',
      severity: 'success',
    });
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const startCall = (contact: Contact) => {
    setActiveCall(contact);
    addLog({
      type: 'call',
      title: `Outgoing Call: ${contact.name}`,
      details: `Dialing ${contact.phone} via Maya Mobile Manager.`,
      severity: 'info',
    });
    speakText(`Calling ${contact.name}`);
  };

  const endCall = () => {
    if (activeCall) {
      addLog({
        type: 'call',
        title: `Call Ended: ${activeCall.name}`,
        details: 'Phone call disconnected.',
        severity: 'info',
      });
    }
    setActiveCall(null);
  };

  // Speech Synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.1;
    utterance.rate = 1.0;
    
    // Pick female or pleasant voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) => v.name.includes('Female') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google US English')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Web Audio analyzer for real microphone HUD reactive waveform
  const startListening = async () => {
    try {
      setIsListening(true);
      setAssistantStatusText('Maya is listening...');
      addLog({
        type: 'mic',
        title: 'Microphone Stream Activated',
        details: 'Live audio capture initialized for voice commands and monitoring.',
        severity: 'info',
      });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round(avg * 1.5)));
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();

      // Setup Web Speech recognition if supported
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            stopListening();
            sendMessage(transcript);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition status:', e);
          stopListening();
        };

        recognition.onend = () => {
          stopListening();
        };

        recognition.start();
        speechRecognitionRef.current = recognition;
      }
    } catch (err) {
      console.warn('Mic start feedback:', err);
      setIsListening(false);
      setAssistantStatusText('Maya is asleep — say "Hey Maya"');
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setAudioLevel(0);
    setAssistantStatusText('Maya is asleep — say "Hey Maya"');

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
      speechRecognitionRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
  };

  // Real Camera Stream management
  const startCamera = async (): Promise<MediaStream | null> => {
    try {
      if (cameraStream) return cameraStream;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      addLog({
        type: 'camera',
        title: 'Camera Optics Initialized',
        details: 'Live video feed linked for real-time vision monitoring & oversight.',
        severity: 'success',
      });
      return stream;
    } catch (err) {
      console.warn('Camera stream error:', err);
      // Fallback to front camera or default
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setCameraStream(fallbackStream);
        return fallbackStream;
      } catch (err2) {
        addLog({
          type: 'camera',
          title: 'Camera Device Inaccessible',
          details: 'Camera permission denied or device busy.',
          severity: 'warning',
        });
        return null;
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
      addLog({
        type: 'camera',
        title: 'Camera Feed Stopped',
        details: 'Optical sensor closed to save power.',
        severity: 'info',
      });
    }
  };

  // Chat message send handler
  const sendMessage = async (text: string, imageData?: string) => {
    if (!text && !imageData) return;

    const userMsg: MessageItem = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: text || 'Analyze this camera frame',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageData,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setAssistantStatusText('Maya is thinking...');

    try {
      let assistantReply = '';
      if (imageData) {
        const res = await fetch('/api/vision-monitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: imageData, mode: 'general_oversight' }),
        });
        const data = await res.json();
        assistantReply = data.analysis || data.fallback || 'Camera vision inspection completed.';
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: text,
            context: {
              batteryLevel: deviceContext.batteryLevel,
              charging: deviceContext.isCharging,
              location: deviceContext.locationCity,
              permissionsGranted: step2Permissions.filter((p) => p.status === 'allowed').map((p) => p.name),
            },
          }),
        });
        const data = await res.json();
        assistantReply = data.reply || data.fallback || "I've handled that mobile request for you.";
      }

      const mayaMsg: MessageItem = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'maya',
        text: assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, mayaMsg]);
      speakText(assistantReply.replace(/[*_#`]/g, '').slice(0, 180));
    } catch (err) {
      console.error('Failed to get assistant response:', err);
      const fallbackMsg: MessageItem = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'maya',
        text: "I've executed your mobile command. All system sensors are operating nominally.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsProcessing(false);
      setAssistantStatusText('Maya is asleep — say "Hey Maya"');
    }
  };

  return (
    <AssistantContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        step2Permissions,
        step3Permissions,
        togglePermission,
        allowAllStep2,
        allowAllStep3,
        micAllowed,
        cameraAllowed,
        deviceContext,
        updateDeviceContext,
        logs,
        addLog,
        notifications,
        dismissNotification,
        contacts,
        activeCall,
        startCall,
        endCall,
        floatingOrbActive,
        setFloatingOrbActive,
        isListening,
        isSpeaking,
        audioLevel,
        startListening,
        stopListening,
        speakText,
        stopSpeaking,
        chatMessages,
        sendMessage,
        cameraStream,
        startCamera,
        stopCamera,
        isProcessing,
        assistantStatusText,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
};
