export interface PermissionItem {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'allowed';
  required?: boolean;
  icon: string;
  category: 'runtime' | 'system';
}

export interface DeviceContext {
  batteryLevel: number;
  isCharging: boolean;
  network: string;
  locationCity: string;
  temperature: string;
  weatherCondition: string;
  humidity: string;
  dateStr: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  userName: string;
  energy: number;
  remainingMinutes: number;
  licenseActive: boolean;
  isMayaAsleep: boolean;
  floatingOrbActive: boolean;
}

export interface OversightLog {
  id: string;
  timestamp: string;
  type: 'camera' | 'mic' | 'system' | 'permission' | 'call' | 'sms' | 'notification';
  title: string;
  details: string;
  severity: 'info' | 'warning' | 'success';
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  lastCall?: string;
  role?: string;
}

export interface MessageItem {
  id: string;
  sender: 'user' | 'maya';
  text: string;
  timestamp: string;
  systemAction?: string;
  imageData?: string;
}

export interface AppNotification {
  id: string;
  app: 'WhatsApp' | 'Phone' | 'Messages' | 'Calendar' | 'System';
  sender: string;
  preview: string;
  time: string;
  read: boolean;
}
