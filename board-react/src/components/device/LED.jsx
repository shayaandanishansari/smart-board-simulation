import React from 'react';
import { Lightbulb } from 'lucide-react';

const LED = ({ isOn }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`p-6 transition-all duration-500 ${isOn ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]' : 'text-gray-300'}`}>
        <Lightbulb size={64} fill={isOn ? "currentColor" : "none"} />
      </div>
      <span className="font-bold text-gray-700">SMART LED</span>
    </div>
  );
};

export default LED;
