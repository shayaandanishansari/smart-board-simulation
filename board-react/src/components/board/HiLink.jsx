import React from 'react';
import { Zap } from 'lucide-react';

const HiLink = ({ isPowered }) => {
  return (
    <div className="flex flex-col items-center p-4 border rounded bg-gray-100 shadow-sm">
      <span className="text-xs font-bold mb-2">HI-LINK</span>
      <div className={`p-3 transition-all ${isPowered ? 'text-yellow-500 animate-pulse' : 'text-gray-300'}`}>
        <Zap size={24} fill={isPowered ? "currentColor" : "none"} />
      </div>
      <span className="text-[10px] mt-1 uppercase font-semibold text-gray-500">AC-DC 5V</span>
    </div>
  );
};

export default HiLink;
