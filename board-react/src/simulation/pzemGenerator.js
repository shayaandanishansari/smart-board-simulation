import { deviceProfiles } from './deviceProfiles';

export const generatePzemReading = (board) => {
  const { mains, mcb, rocker, relay_state, device_type } = board;
  
  // Power is only consumed if all switches are on
  const isPowerOn = mains && mcb && rocker && relay_state;
  
  if (!isPowerOn) {
    return {
      voltage: mains ? 230 + (Math.random() - 0.5) * 2 : 0,
      current: 0,
      power: 0,
      energy: board.energy_accumulator || 0,
    };
  }

  const profile = deviceProfiles[device_type] || deviceProfiles.LED;
  
  const voltage = profile.baseVoltage + (Math.random() - 0.5) * profile.voltageVar;
  const current = profile.baseCurrent + (Math.random() - 0.5) * profile.currentVar;
  const power = voltage * current * profile.powerFactor;
  
  // Update energy (this is a simplified simulation, usually energy is kWh)
  // Assuming this is called every second, we add (power / 3600000) to energy
  const energyIncrement = power / (3600 * 1000); 
  
  return {
    voltage: parseFloat(voltage.toFixed(2)),
    current: parseFloat(current.toFixed(2)),
    power: parseFloat(power.toFixed(2)),
    energy: parseFloat(((board.energy_accumulator || 0) + energyIncrement).toFixed(4)),
    energyIncrement,
  };
};
