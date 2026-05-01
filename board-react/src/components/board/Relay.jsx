import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

const Relay = ({ isOn }) => {
  return (
    <div className="flex flex-col items-center p-4 border rounded bg-gray-100 shadow-sm">
      <span className="text-xs font-bold mb-2 text-blue-600">RELAY</span>
      <div className={`p-3 transition-colors ${isOn ? 'text-blue-500' : 'text-gray-400'}`}>
        {isOn ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
      </div>
      <span className="text-[10px] mt-1 uppercase font-semibold text-gray-500">(Node Controlled)</span>
    </div>
  );
};

export default Relay;
