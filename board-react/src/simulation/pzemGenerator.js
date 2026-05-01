import { getDeviceById } from './deviceProfiles';

export const generatePzemReading = (board) => {
  const { mains, mcb, rocker, relay_state, device_type } = board;
  
  // Power is only consumed if all switches are on
  const esp32 = mains && mcb;
  const hot = esp32 && rocker;
  const isPowerOn = hot && relay_state;
  
  if (!isPowerOn) {
    return {
      voltage: mains ? 229 + Math.random() * 3 : 0,
      current: 0,
      power: 0,
      frequency: esp32 ? 49.88 + Math.random() * 0.24 : 0,
      pf: 0,
      energy: board.energy_accumulator || 0,
    };
  }

  const device = getDeviceById(device_type);
  
  const voltage = 229 + Math.random() * 3;
  const power = device.W * (0.97 + Math.random() * 0.06);
  const pf = Math.min(1, device.PF + (Math.random() - 0.5) * 0.015);
  const current = power / (voltage * pf);
  const frequency = 49.88 + Math.random() * 0.24;
  
  // Energy accumulator (kWh)
  // Assuming tick every 1 second (1000ms in usePzem)
  // kWh = W * h / 1000. For 1 second, h = 1/3600.
  // energyIncrement = power / (3600 * 1000)
  const energyIncrement = power / 3600000;
  const energy = (board.energy_accumulator || 0) + energyIncrement;
  
  return {
    voltage: parseFloat(voltage.toFixed(2)),
    current: parseFloat(current.toFixed(3)),
    power: parseFloat(power.toFixed(2)),
    frequency: parseFloat(frequency.toFixed(2)),
    pf: parseFloat(pf.toFixed(2)),
    energy: parseFloat(energy.toFixed(4)),
    energyIncrement,
  };
};
