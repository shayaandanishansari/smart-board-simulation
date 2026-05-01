import React from 'react';
import useBoardStore from '../../store/boardStore';
import MCB from './MCB';
import Rocker from './Rocker';
import Relay from './Relay';
import HiLink from './HiLink';
import Device from '../device/Device';
import usePzem from '../../hooks/usePzem';
import useRelay from '../../hooks/useRelay';
import { boardApi } from '../../services/api';
import { Share2 } from 'lucide-react';

const Board = ({ boardId }) => {
  const board = useBoardStore((state) => state.getBoard(boardId));
  const updateBoard = useBoardStore((state) => state.updateBoard);

  // Initialize simulation hooks
  usePzem(boardId);
  useRelay(boardId);

  if (!board) return null;

  const handlePair = async () => {
    try {
      const response = await boardApi.pairBoard(boardId);
      alert(`Pairing initiated! PIN: ${response.data.pin}`);
    } catch (error) {
      console.error('Pairing failed:', error);
      alert('Pairing failed. Is Node server running?');
    }
  };

  const isDevicePowered = board.mains && board.mcb && board.rocker && board.relay_state;

  return (
    <div className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-xl w-full max-w-2xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{board.name}</h2>
          <p className="text-sm text-gray-500">{board.location} | ID: {board.board_id}</p>
        </div>
        <button 
          onClick={handlePair}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
        >
          <Share2 size={18} />
          Pair
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Physical Components */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
          <MCB 
            isOn={board.mcb} 
            onToggle={() => updateBoard(boardId, { mcb: !board.mcb })} 
          />
          <Rocker 
            isOn={board.rocker} 
            onToggle={() => updateBoard(boardId, { rocker: !board.rocker })} 
          />
          <Relay isOn={board.relay_state} />
          <HiLink isPowered={board.mains} />
          
          <div className="col-span-2 mt-4 p-3 bg-white rounded border flex justify-between items-center">
            <span className="text-sm font-bold">MAIN POWER</span>
            <button 
              onClick={() => updateBoard(boardId, { mains: !board.mains })}
              className={`w-12 h-6 rounded-full transition-colors relative ${board.mains ? 'bg-green-500' : 'bg-gray-400'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${board.mains ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Device Visualization */}
        <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg border min-h-[250px]">
          <Device type={board.device_type} isOn={isDevicePowered} />
        </div>
      </div>

      {/* Connection State Info (Visual Only) */}
      <div className="mt-6 text-[10px] text-gray-400 flex justify-between uppercase tracking-widest">
        <span>Node: {board.relay_state !== undefined ? 'Connected' : 'Syncing...'}</span>
        <span>PZEM: {isDevicePowered ? 'Streaming' : 'Idle'}</span>
      </div>
    </div>
  );
};

export default Board;
