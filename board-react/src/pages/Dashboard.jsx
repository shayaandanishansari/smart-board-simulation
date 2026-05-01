import React, { useState, useRef, useCallback, useEffect } from 'react';
import useBoardStore from '../store/boardStore';
import Board from '../components/board/Board';
import { generateBoardId } from '../utils/boardId';
import { DeviceType } from '../simulation/deviceProfiles';
import { boardApi } from '../services/api';

const Dashboard = () => {
  const boards = useBoardStore((state) => state.boards);
  const addBoardToStore = useBoardStore((state) => state.addBoard);
  
  const [zoom, setZoom] = useState(0.9);
  const [pan, setPan]   = useState({ x: 40, y: 30 });
  const containerRef    = useRef(null);
  const dragging        = useRef(false);
  const dragOrigin      = useRef({ x: 0, y: 0, px: 0, py: 0 });

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const rect   = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    setZoom(z => {
      const nz = Math.max(0.2, Math.min(3, z * factor));
      setPan(p => ({ x: mx - (mx - p.x) * nz / z, y: my - (my - p.y) * nz / z }));
      return nz;
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const onMouseDown = (e) => {
    if (e.button !== 0 || e.target.closest("[data-board]")) return;
    dragging.current = true;
    dragOrigin.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    containerRef.current.style.cursor = "grabbing";
  };
  
  const onMouseMove = (e) => {
    if (!dragging.current) return;
    setPan({ x: dragOrigin.current.px + e.clientX - dragOrigin.current.x, y: dragOrigin.current.py + e.clientY - dragOrigin.current.y });
  };
  
  const onMouseUp = () => {
    dragging.current = false;
    if (containerRef.current) containerRef.current.style.cursor = "grab";
  };

  const adjustZoom = (factor) => {
    const rect = containerRef.current.getBoundingClientRect();
    const mx = rect.width / 2, my = rect.height / 2;
    setZoom(z => {
      const nz = Math.max(0.2, Math.min(3, z * factor));
      setPan(p => ({ x: mx - (mx - p.x) * nz / z, y: my - (my - p.y) * nz / z }));
      return nz;
    });
  };

  const handleAddBoard = async () => {
    const name = prompt("Enter Board Name:", "New Board");
    if (!name) return;
    
    const location = prompt("Enter Location:", "Home");
    if (!location) return;

    const boardId = generateBoardId();
    const boardData = { 
      board_id: boardId,
      name,
      location,
      device_type: DeviceType.NONE
    };

    try {
      await boardApi.createBoard(boardData);
      addBoardToStore(boardData);
    } catch (error) {
      console.error('Failed to create board on server:', error);
      alert('Failed to connect to Node server. Board added locally only for simulation.');
      addBoardToStore(boardData);
    }
  };

  const GRID = 24;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "Courier New,monospace" }}>
      <style>{` @keyframes march { from { stroke-dashoffset: 20; } to { stroke-dashoffset: 0; } } * { box-sizing: border-box; }`}</style>

      {/* Toolbar */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e8e8e0", padding: "10px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", zIndex: 10 }}>
        <div>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a14", letterSpacing: "0.12em" }}>⚡ SMARTBOARD</div>
          <div style={{ fontSize: "8px", color: "#c0c0b0", letterSpacing: "0.16em", marginTop: "2px" }}>SIMULATION · ESP32 / PZEM-004T / MQTT</div>
        </div>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          {[["#c84010","230V mains"],["#b88a08","Switched AC"],["#1d4ed8","5V DC"],["#7c3aed","GPIO"],["#4338ca","UART"]].map(([c,l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "18px", height: "2px", background: c, borderRadius: "1px" }}/>
              <span style={{ fontSize: "8px", color: "#a8a898" }}>{l}</span>
            </div>
          ))}
          <div style={{ width: "1px", height: "20px", background: "#e8e8e0" }}/>
          <button onClick={handleAddBoard} style={{
            background: "transparent", border: "1px solid #ddddd5", borderRadius: "6px",
            padding: "6px 13px", color: "#606055", fontSize: "10px", cursor: "pointer",
            letterSpacing: "0.1em", fontFamily: "Courier New,monospace" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#c84010"; e.currentTarget.style.color="#c84010"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#ddddd5"; e.currentTarget.style.color="#606055"; }}>
            + ADD BOARD
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        style={{ flex: 1, overflow: "hidden", position: "relative", cursor: "grab",
          background: "#ededE7",
          backgroundImage: "radial-gradient(circle, #c4c4bc 1px, transparent 1px)",
          backgroundSize: `${GRID*zoom}px ${GRID*zoom}px`,
          backgroundPosition: `${((pan.x%(GRID*zoom))+(GRID*zoom))%(GRID*zoom)}px ${((pan.y%(GRID*zoom))+(GRID*zoom))%(GRID*zoom)}px` }}>

        <div style={{ position: "absolute", transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }}>
          {boards.length === 0 && (
            <div style={{ width: "400px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", color: "#c0c0b8", fontSize: "11px", letterSpacing: "0.1em" }}>
              NO BOARDS · CLICK + ADD BOARD
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {boards.map(board => (
              <Board key={board.board_id} boardId={board.board_id} />
            ))}
          </div>
        </div>

        {/* Zoom controls */}
        <div style={{ position: "absolute", bottom: 20, right: 20, background: "#ffffff",
          border: "1px solid #ddddd5", borderRadius: "8px", display: "flex", alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <button onClick={() => adjustZoom(1.15)} style={{ background:"none",border:"none",padding:"8px 13px",cursor:"pointer",fontSize:"17px",color:"#606055",borderRight:"1px solid #e8e8e0",lineHeight:1 }}>+</button>
          <span style={{ padding:"0 12px",fontSize:"10px",color:"#a8a898",minWidth:"48px",textAlign:"center" }}>{Math.round(zoom*100)}%</span>
          <button onClick={() => adjustZoom(0.87)} style={{ background:"none",border:"none",padding:"8px 13px",cursor:"pointer",fontSize:"17px",color:"#606055",borderLeft:"1px solid #e8e8e0",lineHeight:1 }}>−</button>
          <button onClick={() => { setZoom(0.9); setPan({ x:40, y:30 }); }} style={{ background:"none",border:"none",padding:"8px 13px",cursor:"pointer",fontSize:"11px",color:"#a8a898",borderLeft:"1px solid #e8e8e0",letterSpacing:"0.06em" }}>⌂</button>
        </div>

        <div style={{ position:"absolute",bottom:20,left:20,fontSize:"9px",color:"#b8b8b0",letterSpacing:"0.08em" }}>
          SCROLL to zoom · DRAG canvas to pan · CLICK components to interact
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
