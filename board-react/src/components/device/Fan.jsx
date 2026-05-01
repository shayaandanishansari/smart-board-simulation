import React from 'react';
import { Fan as FanIcon } from 'lucide-react';

const Fan = ({ isOn }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`p-6 transition-all duration-500 ${isOn ? 'text-blue-400 animate-spin' : 'text-gray-300'}`} style={{ animationDuration: '0.5s' }}>
        <FanIcon size={64} />
      </div>
      <span className="font-bold text-gray-700">CEILING FAN</span>
    </div>
  );
};

export default Fan;
