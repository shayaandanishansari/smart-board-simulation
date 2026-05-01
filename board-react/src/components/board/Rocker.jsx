import React from 'react';

const Rocker = ({ isOn, onToggle }) => {
  return (
    <div className="flex flex-col items-center p-4 border rounded bg-gray-100 shadow-sm">
      <span className="text-xs font-bold mb-2">ROCKER</span>
      <div 
        onClick={onToggle}
        className={`w-10 h-16 rounded cursor-pointer transition-all flex flex-col border-2 ${isOn ? 'bg-green-100 border-green-500 justify-start' : 'bg-red-100 border-red-500 justify-end'}`}
      >
        <div className={`h-1/2 w-full ${isOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>
      <span className="text-xs mt-1 uppercase font-semibold">{isOn ? 'On' : 'Off'}</span>
    </div>
  );
};

export default Rocker;
