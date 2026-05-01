import React from 'react';
import { Monitor } from 'lucide-react';

const TV = ({ isOn }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`p-6 transition-all duration-500 border-4 rounded-lg ${isOn ? 'bg-blue-600 border-gray-800 text-white' : 'bg-black border-gray-800 text-gray-600'}`}>
        <Monitor size={64} />
      </div>
      <span className="font-bold text-gray-700 mt-2">SMART TV</span>
    </div>
  );
};

export default TV;
