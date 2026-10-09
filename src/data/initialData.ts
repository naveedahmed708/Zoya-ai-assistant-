import { PermissionItem, Contact, AppNotification, OversightLog } from '../types';

export const INITIAL_STEP2_PERMISSIONS: PermissionItem[] = [
  {
    id: 'mic',
    name: 'Microphone',
    description: 'So you can talk to Maya. Required.',
    status: 'pending',
    required: true,
    icon: 'mic',
    category: 'runtime',
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: "Maya's own notification, which keeps her running in the background.",
    status: 'pending',
    icon: 'bell',
    category: 'runtime',
  },
  {
    id: 'camera',
    name: 'Camera',
    description: 'So she can take a photo or look at what you point the phone at.',
    status: 'pending',
    icon: 'camera',
    category: 'runtime',
  },
  {
    id: 'phone',
    name: 'Phone calls',
    description: 'So she can place a call for you.',
    status: 'pending',
    icon: 'phone',
    category: 'runtime',
  },
  {
    id: 'contacts',
    name: 'Contacts',
    description: 'So a name is enough — she looks up the number.',
    status: 'pending',
    icon: 'contact',
    category: 'runtime',
  },
  {
    id: 'sms',
    name: 'SMS',
    description: 'So she can send a text message.',
    status: 'pending',
    icon: 'message-square',
    category: 'runtime',
  },
  {
    id: 'location',
    name: 'Location',
    description: 'Weather, navigation, and where you are.',
    status: 'pending',
    icon: 'map-pin',
    category: 'runtime',
  },
  {
    id: 'gallery',
    name: 'Gallery & files',
    description: 'So she can find a photo or file and send it.',
    status: 'pending',
    icon: 'image',
    category: 'runtime',
  },
  {
    id: 'manage_calls',
    name: 'Answer & manage calls',
    description: 'So she can announce who is calling and answer or reject it.',
    status: 'pending',
    icon: 'headphones',
    category: 'runtime',
  },
  {
    id: 'bluetooth',
    name: 'Bluetooth',
    description: 'So her voice plays on your earbuds or speaker.',
    status: 'pending',
    icon: 'bluetooth',
    category: 'runtime',
  },
];

export const INITIAL_STEP3_PERMISSIONS: PermissionItem[] = [
  {
    id: 'battery',
    name: 'Battery — no optimisation',
    description: 'Required. Without it the phone kills Maya in the background and she goes quiet. Tap, then choose Allow.',
    status: 'allowed',
    required: true,
    icon: 'battery-charging',
    category: 'system',
  },
  {
    id: 'overlay',
    name: 'Display over other apps',
    description: 'So her orb can float on top of whatever you are doing.',
    status: 'allowed',
    icon: 'layers',
    category: 'system',
  },
  {
    id: 'notification_listener',
    name: 'Notification access',
    description: 'To read WhatsApp messages and know who is calling. Turn on "Maya" in the list.',
    status: 'pending',
    icon: 'bell-ring',
    category: 'system',
  },
  {
    id: 'accessibility',
    name: 'Accessibility service',
    description: 'So she can open apps, tap, and read the screen for you. Turn on "Maya" in the list.',
    status: 'pending',
    icon: 'accessibility',
    category: 'system',
  },
  {
    id: 'default_assistant',
    name: 'Default assistant',
    description: 'Long-press the power button or swipe from a corner to call her, even on the lock screen. Pick "MAYA".',
    status: 'allowed',
    icon: 'sparkles',
    category: 'system',
  },
];

export const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'John Doe', phone: '+1 (555) 019-2831', avatar: '👨‍💼', role: 'Project Lead', lastCall: 'Yesterday, 4:15 PM' },
  { id: '2', name: 'Sarah Connor', phone: '+1 (555) 482-1920', avatar: '👩‍💻', role: 'Security Ops', lastCall: '2 days ago' },
  { id: '3', name: 'Office Manager', phone: '+1 (555) 304-9844', avatar: '🏢', role: 'Headquarters', lastCall: 'Monday' },
  { id: '4', name: 'David Miller', phone: '+1 (555) 771-3928', avatar: '🧑‍🔬', role: 'Field Technician', lastCall: 'Oct 3' },
  { id: '5', name: 'Mom', phone: '+1 (555) 891-2390', avatar: '❤️', role: 'Family', lastCall: 'Today, 9:20 AM' },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', app: 'WhatsApp', sender: 'Sarah Connor', preview: 'Maya, did you run the perimeter sensor diagnostics?', time: '10:42 AM', read: false },
  { id: 'n2', app: 'Phone', sender: 'John Doe', preview: 'Missed Call (1) - 10:15 AM', time: '10:15 AM', read: true },
  { id: 'n3', app: 'WhatsApp', sender: 'Dev Team Sync', preview: 'Updated firmware ready for mobile assistant testing.', time: '09:30 AM', read: false },
  { id: 'n4', app: 'Calendar', sender: 'Daily Briefing', preview: 'Upcoming: Security sync in 45 minutes.', time: '09:00 AM', read: true },
];

export const INITIAL_LOGS: OversightLog[] = [
  {
    id: 'l1',
    timestamp: '10:45:12',
    type: 'permission',
    title: 'System Access Audit',
    details: 'M.A.Y.A initialization check complete. 12 device capabilities connected.',
    severity: 'success',
  },
  {
    id: 'l2',
    timestamp: '10:44:03',
    type: 'system',
    title: 'Background Daemon Keep-Alive',
    details: 'Battery optimization exemption confirmed. High-priority foreground task active.',
    severity: 'info',
  },
  {
    id: 'l3',
    timestamp: '10:40:22',
    type: 'notification',
    title: 'Notification Reader Hook',
    details: 'Captured WhatsApp incoming alert from Sarah Connor.',
    severity: 'info',
  },
];
