import React, { useState } from 'react';
import useBoardStore from '../store/boardStore';
import Board from '../components/board/Board';
import { generateBoardId } from '../utils/boardId';
import { DeviceType } from '../simulation/deviceProfiles';
import { boardApi } from '../services/api';
import { Plus, Layout } from 'lucide-react';

const Dashboard = () => {
  const boards = useBoardStore((state) => state.boards);
  const addBoardToStore = useBoardStore((state) => state.addBoard);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBoard, setNewBoard] = useState({
    name: '',
    location: '',
    device_type: DeviceType.LED,
  });

  const handleAddBoard = async (e) => {
    e.preventDefault();
    const boardId = generateBoardId();
    const boardData = { ...newBoard, board_id: boardId };

    try {
      // 1. Notify Node server
      await boardApi.createBoard(boardData);
      
      // 2. Add to local store
      addBoardToStore(boardData);
      
      // 3. Reset form
      setNewBoard({ name: '', location: '', device_type: DeviceType.LED });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create board on server:', error);
      alert('Failed to connect to Node server. Board added locally only for simulation.');
      // Still add locally for simulation even if Node is down
      addBoardToStore(boardData);
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Layout size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">SMART<span className="text-blue-600">BOARD</span></h1>
        </div>
        
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-green-200 font-bold"
        >
          <Plus size={20} />
          Add Board
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        {showAddForm && (
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-12 border-2 border-blue-100 max-w-md mx-auto animate-in fade-in slide-in-from-top-4">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Configure New Board</h3>
            <form onSubmit={handleAddBoard} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Board Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Living Room Main"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newBoard.name}
                  onChange={(e) => setNewBoard({...newBoard, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Ground Floor"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newBoard.location}
                  onChange={(e) => setNewBoard({...newBoard, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Output Device</label>
                <select 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                  value={newBoard.device_type}
                  onChange={(e) => setNewBoard({...newBoard, device_type: e.target.value})}
                >
                  {Object.values(DeviceType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-3 border rounded-lg font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        )}

        {boards.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg">No boards added yet. Click "Add Board" to start the simulation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {boards.map(board => (
              <Board key={board.board_id} boardId={board.board_id} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
