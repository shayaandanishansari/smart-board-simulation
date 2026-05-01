export const DeviceType = {
  LED: 'LED',
  FAN: 'FAN',
  TV: 'TV',
  AC: 'AC',
};

export const deviceProfiles = {
  [DeviceType.LED]: {
    baseVoltage: 230,
    voltageVar: 2,
    baseCurrent: 0.05, // 50mA
    currentVar: 0.005,
    powerFactor: 0.9,
  },
  [DeviceType.FAN]: {
    baseVoltage: 230,
    voltageVar: 2,
    baseCurrent: 0.3, // 300mA
    currentVar: 0.02,
    powerFactor: 0.85,
  },
  [DeviceType.TV]: {
    baseVoltage: 230,
    voltageVar: 2,
    baseCurrent: 0.5, // 500mA
    currentVar: 0.05,
    powerFactor: 0.95,
  },
  [DeviceType.AC]: {
    baseVoltage: 230,
    voltageVar: 2,
    baseCurrent: 7.0, // 7A
    currentVar: 0.5,
    powerFactor: 0.98,
  },
};
