import React from 'react';
import { Power } from 'lucide-react';

const MCB = ({ isOn, onToggle }) => {
  return (
    <div className="flex flex-col items-center p-4 border rounded bg-gray-100 shadow-sm">
      <span className="text-xs font-bold mb-2">MCB</span>
      <button 
        onClick={onToggle}
        className={`p-3 rounded-full transition-colors ${isOn ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
      >
        <Power size={24} />
      </button>
      <span className="text-xs mt-1 uppercase font-semibold">{isOn ? 'On' : 'Off'}</span>
    </div>
  );
};

export default MCB;
