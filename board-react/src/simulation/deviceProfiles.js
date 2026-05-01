export const DeviceType = {
  NONE: 'none',
  TV: 'tv',
  FAN: 'fan',
  LED: 'led',
  CHARGER: 'charger',
  LAPTOP: 'laptop',
  KETTLE: 'kettle',
};

export const DEVICES = [
  { id: DeviceType.NONE,    label: "— Nothing",            icon: null,  W: 0,    PF: 1.00 },
  { id: DeviceType.TV,      label: "Television · 100W",     icon: "📺",  W: 100,  PF: 0.95 },
  { id: DeviceType.FAN,     label: "Ceiling Fan · 75W",     icon: "🌀",  W: 75,   PF: 0.85 },
  { id: DeviceType.LED,     label: "LED Bulb · 12W",        icon: "💡",  W: 12,   PF: 0.90 },
  { id: DeviceType.CHARGER, label: "Phone Charger · 18W",   icon: "📱",  W: 18,   PF: 0.88 },
  { id: DeviceType.LAPTOP,  label: "Laptop · 65W",          icon: "💻",  W: 65,   PF: 0.92 },
  { id: DeviceType.KETTLE,  label: "Kettle · 2000W",        icon: "🫖",  W: 2000, PF: 0.99 },
];

export const getDeviceById = (id) => DEVICES.find(d => d.id === id) || DEVICES[0];
