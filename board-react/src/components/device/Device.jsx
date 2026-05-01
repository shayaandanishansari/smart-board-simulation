import React from 'react';
import LED from './LED';
import Fan from './Fan';
import TV from './TV';
import { DeviceType } from '../../simulation/deviceProfiles';

const Device = ({ type, isOn }) => {
  switch (type) {
    case DeviceType.LED:
      return <LED isOn={isOn} />;
    case DeviceType.FAN:
      return <Fan isOn={isOn} />;
    case DeviceType.TV:
      return <TV isOn={isOn} />;
    default:
      return <LED isOn={isOn} />;
  }
};

export default Device;
