import React, { useState } from 'react';
import useBoardStore from '../../store/boardStore';
import usePzem from '../../hooks/usePzem';
import useRelay from '../../hooks/useRelay';
import { boardApi } from '../../services/api';
import { DEVICES, getDeviceById } from '../../simulation/deviceProfiles';

function Wire({ d, energized, flowing, color, slow }) {
  return (
    <g>
      <path d={d} fill="none" stroke={energized ? color : "#ddddd5"}
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {(energized && flowing) && (
        <path d={d} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3"
          strokeDasharray="3 17" strokeLinecap="round"
          style={{ animation: `march ${slow ? "1.1s" : "0.48s"} linear infinite` }}/>
      )}
    </g>
  );
}

function PzemDisplay({ x, y, on, V, A, W, Hz, PF, kWh }) {
  const bg  = on ? "#f0fdf4" : "#fafaf8";
  const brd = on ? "#86efac" : "#e4e4dc";
  const val = on ? "#14532d" : "#d0d0c8";
  const lbl = on ? "#4ade80" : "#e0e0d8";
  const sep = on ? "#bbf7d0" : "#eeeeea";
  const f   = (v, dec) => on ? Number(v).toFixed(dec) : "——";
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width="96" height="76" rx="4" fill={bg} stroke={brd} strokeWidth="1.2"/>
      <text x="6"  y="13" fontSize="7" fill={lbl} fontFamily="Courier New,monospace">VOLT</text>
      <text x="52" y="13" fontSize="7" fill={lbl} fontFamily="Courier New,monospace">CURR</text>
      <text x="6"  y="25" fontSize="12" fontWeight="bold" fill={val} fontFamily="Courier New,monospace">{f(V,1)}V</text>
      <text x="52" y="25" fontSize="12" fontWeight="bold" fill={val} fontFamily="Courier New,monospace">{f(A,3)}A</text>
      <line x1="4" y1="29" x2="92" y2="29" stroke={sep} strokeWidth="0.5"/>
      <text x="6"  y="40" fontSize="7" fill={lbl} fontFamily="Courier New,monospace">WATT</text>
      <text x="52" y="40" fontSize="7" fill={lbl} fontFamily="Courier New,monospace">FREQ</text>
      <text x="6"  y="52" fontSize="12" fontWeight="bold" fill={val} fontFamily="Courier New,monospace">{f(W,1)}W</text>
      <text x="52" y="52" fontSize="12" fontWeight="bold" fill={val} fontFamily="Courier New,monospace">{f(Hz,1)}Hz</text>
      <line x1="4" y1="56" x2="92" y2="56" stroke={sep} strokeWidth="0.5"/>
      <text x="6" y="67" fontSize="7.5" fill={lbl} fontFamily="Courier New,monospace">
        {`PF ${f(PF,2)}   kWh ${on ? kWh.toFixed(3) : "——"}`}
      </text>
    </g>
  );
}

const Board = ({ boardId }) => {
  const board = useBoardStore((state) => state.getBoard(boardId));
  const updateBoard = useBoardStore((state) => state.updateBoard);
  const removeBoard = useBoardStore((state) => state.removeBoard);

  const [menu, setMenu] = useState(false);
  const r = usePzem(boardId);
  useRelay(boardId);

  if (!board) return null;

  const handleRemove = () => {
    if (window.confirm(`Remove board "${board.name}"?`)) {
      removeBoard(boardId);
    }
  };

  const handlePair = async () => {
    try {
      const response = await boardApi.pairBoard(boardId);
      alert(`Pairing initiated! PIN: ${response.data.pin}`);
    } catch (error) {
      console.error('Pairing failed:', error);
      alert('Pairing failed. Is Node server running?');
    }
  };

  const device = getDeviceById(board.device_type);
  const esp32 = board.mains && board.mcb;
  const hot = esp32 && board.rocker;
  const sockLive = hot && board.relay_state;
  const load = sockLive && device.id !== "none";

  const HY = 82, LY = 152;
  const MC = { x: 52,  y: 60, w: 36, h: 44 };
  const JX = 116;
  const RK = { x: 136, y: 60, w: 42, h: 44 };
  const RL = { x: 252, y: 60, w: 42, h: 44 };
  const PZ = { x: 352, y: 54, w: 96, h: 76 };
  const HL = { x: 136, y: 132, w: 42, h: 36 };
  const EP = { x: 252, y: 128, w: 52, h: 44 };
  const PLx = 14, PRx = 506, DVx = 532;
  const epMid = EP.x + EP.w / 2;

  return (
    <div data-board style={{
      background: "#ffffff", border: "1px solid #ddddd5", borderRadius: "14px",
      padding: "12px 14px", width: "760px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)", position: "relative", userSelect: "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "Courier New,monospace", fontSize: "10px", color: "#a8a898", letterSpacing: "0.14em" }}>{board.name}</span>
          <span style={{ fontFamily: "Courier New,monospace", fontSize: "8px", color: "#d0d0c8" }}>{board.location} · {board.board_id}</span>
        </div>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <button onClick={handlePair} style={{
            background: "none", border: "1px solid #e4e4dc", borderRadius: "4px",
            padding: "2px 8px", color: "#606055", fontSize: "9px", cursor: "pointer",
            fontFamily: "Courier New,monospace"
          }}>PAIR</button>
          <span style={{ fontFamily: "Courier New,monospace", fontSize: "9px", color: esp32 ? "#16a34a" : "#c8c8c0" }}>
            {esp32 ? "◉ ESP32 ONLINE" : "○ ESP32 OFFLINE"}
          </span>
          <button onClick={handleRemove} style={{ background: "none", border: "none", color: "#d4d4cc", cursor: "pointer", fontSize: "14px", lineHeight: 1 }}>✕</button>
        </div>
      </div>

      <svg viewBox="0 0 740 205" style={{ width: "100%", display: "block" }}>
        {/* Wires */}
        <Wire d={`M ${PLx+13} ${HY} H ${MC.x}`}           energized={board.mains} flowing={load || esp32} color="#c84010"/>
        <Wire d={`M ${MC.x+MC.w} ${HY} H ${JX}`}          energized={esp32}       flowing={load || esp32} color="#b88a08"/>
        <Wire d={`M ${JX} ${HY} H ${RK.x}`}               energized={esp32}       flowing={load}          color="#b88a08"/>
        <Wire d={`M ${JX} ${HY} V ${LY} H ${HL.x}`}       energized={esp32}       flowing={esp32}         color="#b88a08"/>
        <Wire d={`M ${RK.x+RK.w} ${HY} H ${RL.x}`}        energized={hot}         flowing={load}          color="#b88a08"/>
        <Wire d={`M ${RL.x+RL.w} ${HY} H ${PZ.x}`}        energized={sockLive}    flowing={load}          color="#b88a08"/>
        <Wire d={`M ${PZ.x+PZ.w} ${HY} H ${PRx}`}         energized={sockLive}    flowing={load}          color="#b88a08"/>
        <Wire d={`M ${PRx+13} ${HY} H ${DVx}`}            energized={load}        flowing={load}          color="#b88a08"/>
        <Wire d={`M ${HL.x+HL.w} ${LY} H ${EP.x}`}        energized={esp32}       flowing={esp32}         color="#1d4ed8" slow/>
        <path d={`M ${epMid} ${EP.y} V ${RL.y+RL.h+2}`}
          fill="none" stroke={esp32 ? "#7c3aed" : "#e4e4dc"} strokeWidth="1" strokeDasharray="3 4" strokeLinecap="round"/>
        <path d={`M ${EP.x+EP.w} ${EP.y+EP.h/2} H ${PZ.x+PZ.w/2} V ${PZ.y+PZ.h+2}`}
          fill="none" stroke={esp32 ? "#4338ca" : "#e4e4dc"} strokeWidth="1" strokeDasharray="3 4" strokeLinecap="round"/>
        <circle cx={JX} cy={HY} r="3.5" fill={esp32 ? "#b88a08" : "#ddddd5"}/>

        {/* Left plug */}
        <g transform={`translate(${PLx},${HY-16})`} onClick={() => updateBoard(boardId, { mains: !board.mains })} style={{ cursor: "pointer" }}>
          <rect width="13" height="32" rx="3" fill={board.mains ? "#fff7ed" : "#f8f8f4"} stroke={board.mains ? "#c84010" : "#d4d4cc"} strokeWidth="1.2"/>
          <rect x="1.5" y="5"  width="4" height="7" rx="1" fill={board.mains ? "#fb923c" : "#d4d4cc"}/>
          <rect x="7.5" y="5"  width="4" height="7" rx="1" fill={board.mains ? "#fb923c" : "#d4d4cc"}/>
          <rect x="3"   y="17" width="7" height="9" rx="1" fill={board.mains ? "#fb923c" : "#d4d4cc"}/>
          <title>{board.mains ? "Disconnect from mains" : "Connect to mains"}</title>
        </g>

        {/* MCB */}
        <g transform={`translate(${MC.x},${MC.y})`} onClick={() => updateBoard(boardId, { mcb: !board.mcb })} style={{ cursor: "pointer" }}>
          <rect width={MC.w} height={MC.h} rx="4" fill={board.mcb ? "#eff6ff" : "#fef2f2"} stroke={board.mcb ? "#3b82f6" : "#ef4444"} strokeWidth="1.2"/>
          <rect x="10" y="5" width="16" height="26" rx="3" fill={board.mcb ? "#bfdbfe" : "#fecaca"}/>
          <rect x="13" y={board.mcb ? 7 : 18} width="10" height="11" rx="2.5" fill={board.mcb ? "#3b82f6" : "#ef4444"}/>
          <text x={MC.w/2} y={MC.h-13} textAnchor="middle" fontSize="7" fill={board.mcb ? "#3b82f6" : "#ef4444"} fontFamily="Courier New,monospace">{board.mcb ? "ON" : "OFF"}</text>
          <text x={MC.w/2} y={MC.h-4}  textAnchor="middle" fontSize="6" fill="#a8a898" fontFamily="Courier New,monospace">MCB·16A</text>
        </g>

        {/* Rocker */}
        <g transform={`translate(${RK.x},${RK.y})`} onClick={() => updateBoard(boardId, { rocker: !board.rocker })} style={{ cursor: "pointer" }}>
          <rect width={RK.w} height={RK.h} rx="4" fill={board.rocker ? "#f0fdf4" : "#fef2f2"} stroke={board.rocker ? "#22c55e" : "#ef4444"} strokeWidth="1.2"/>
          <rect x="4" y="4" width={RK.w-8} height={RK.h-8} rx="3" fill={board.rocker ? "#dcfce7" : "#fee2e2"}/>
          <text x={RK.w/2} y="16" textAnchor="middle" fontSize="8" fill={board.rocker ? "#16a34a" : "#d4d4cc"} fontFamily="Courier New,monospace">ON</text>
          <rect x="7" y={board.rocker ? 20 : 25} width={RK.w-14} height="5" rx="2.5" fill={board.rocker ? "#22c55e" : "#ef4444"}/>
          <text x={RK.w/2} y={RK.h-5} textAnchor="middle" fontSize="8" fill={board.rocker ? "#d4d4cc" : "#ef4444"} fontFamily="Courier New,monospace">OFF</text>
          <text x={RK.w/2} y={RK.h+12} textAnchor="middle" fontSize="7" fill="#a8a898" fontFamily="Courier New,monospace">ROCKER</text>
        </g>

        {/* Relay */}
        <g transform={`translate(${RL.x},${RL.y})`} style={{ cursor: "default" }}>
          <rect width={RL.w} height={RL.h} rx="4" fill={board.relay_state ? "#f0fdf4" : "#fafaf8"} stroke={board.relay_state ? "#22c55e" : "#ddddd5"} strokeWidth="1.2"/>
          <path d="M6 20 Q9 14 12 20 Q15 26 18 20 Q21 14 24 20 Q27 26 30 20 Q33 14 36 20"
            fill="none" stroke={esp32 ? "#7c3aed" : "#ddddd5"} strokeWidth="1.5"/>
          <circle cx="8"  cy="36" r="2.5" fill={board.relay_state ? "#22c55e" : "#ef4444"}/>
          <circle cx="34" cy="36" r="2.5" fill={board.relay_state ? "#22c55e" : "#d4d4cc"}/>
          <line x1="8" y1="36" x2={board.relay_state ? 34 : 24} y2={board.relay_state ? 36 : 30}
            stroke={board.relay_state ? "#22c55e" : "#ef4444"} strokeWidth="1.8" strokeLinecap="round"/>
          <text x={RL.w/2} y={RL.h+12} textAnchor="middle" fontSize="7" fill="#a8a898" fontFamily="Courier New,monospace">RELAY</text>
          <rect x="2" y={RL.h+15} width={RL.w-4} height="12" rx="3"
            fill={board.relay_state ? "#dcfce7" : "#fee2e2"} stroke={board.relay_state ? "#22c55e" : "#ef4444"} strokeWidth="0.8"/>
          <text x={RL.w/2} y={RL.h+23} textAnchor="middle" fontSize="7"
            fill={board.relay_state ? "#15803d" : "#dc2626"} fontFamily="Courier New,monospace">
            {board.relay_state ? "CLOSED" : "OPEN"}
          </text>
        </g>

        {/* PZEM */}
        <PzemDisplay x={PZ.x} y={PZ.y} on={load} V={r.voltage} A={r.current} W={r.power} Hz={r.frequency} PF={r.pf} kWh={r.energy}/>
        <text x={PZ.x+PZ.w/2} y={PZ.y+PZ.h+12} textAnchor="middle" fontSize="7" fill="#a8a898" fontFamily="Courier New,monospace">PZEM-004T</text>

        {/* Right plug */}
        <g transform={`translate(${PRx},${HY-16})`} onClick={() => setMenu(m => !m)} style={{ cursor: "pointer" }}>
          <rect width="13" height="32" rx="3" fill={sockLive ? "#f0fdf4" : "#f8f8f4"} stroke={sockLive ? "#22c55e" : "#d4d4cc"} strokeWidth="1.2"/>
          <rect x="1.5" y="5"  width="4" height="6" rx="1" fill={sockLive ? "#4ade80" : "#d4d4cc"}/>
          <rect x="7.5" y="5"  width="4" height="6" rx="1" fill={sockLive ? "#4ade80" : "#d4d4cc"}/>
          <rect x="3"   y="15" width="7" height="9" rx="1" fill={sockLive ? "#4ade80" : "#d4d4cc"}/>
          {sockLive && !load && (
            <text x="6.5" y="35" textAnchor="middle" fontSize="5.5" fill="#16a34a" fontFamily="Courier New,monospace">LIVE</text>
          )}
        </g>

        {/* Device */}
        <g transform={`translate(${DVx},${HY-28})`} onClick={() => setMenu(m => !m)} style={{ cursor: "pointer" }}>
          {device.id === "none" ? (
            <>
              <rect width="62" height="56" rx="6" fill="#f8f8f4" stroke="#ddddd5" strokeWidth="1" strokeDasharray="4 3"/>
              <text x="31" y="34" textAnchor="middle" fontSize="24" fill="#d0d0c8">?</text>
            </>
          ) : (
            <>
              <rect width="62" height="56" rx="6" fill={load ? "#f0fdf4" : "#f8f8f4"} stroke={load ? "#86efac" : "#ddddd5"} strokeWidth="1.2"/>
              <text x="31" y="30" textAnchor="middle" fontSize="22">{device.icon}</text>
              <text x="31" y="46" textAnchor="middle" fontSize="7" fill={load ? "#16a34a" : "#a8a898"} fontFamily="Courier New,monospace">{device.W}W</text>
            </>
          )}
        </g>

        {/* Hi-Link */}
        <g transform={`translate(${HL.x},${HL.y})`}>
          <rect width={HL.w} height={HL.h} rx="4" fill="#fafaf8" stroke="#ddddd5" strokeWidth="1.2"/>
          <path d="M4 18 Q7 12 10 18 Q13 24 16 18" fill="none" stroke={esp32 ? "#b88a08" : "#ddddd5"} strokeWidth="1.5"/>
          <line x1="20" y1="10" x2="20" y2="26" stroke="#ddddd5" strokeWidth="0.8"/>
          <path d="M24 18 Q27 12 30 18 Q33 24 36 18" fill="none" stroke={esp32 ? "#1d4ed8" : "#ddddd5"} strokeWidth="1.5"/>
          <text x={HL.w/2} y={HL.h+11} textAnchor="middle" fontSize="7" fill="#a8a898" fontFamily="Courier New,monospace">HI-LINK</text>
          <text x={HL.w/2} y={HL.h+19} textAnchor="middle" fontSize="6"  fill="#c8c8c0" fontFamily="Courier New,monospace">→ 5V DC</text>
        </g>

        {/* ESP32 */}
        <g transform={`translate(${EP.x},${EP.y})`}>
          <rect width={EP.w} height={EP.h} rx="4" fill={esp32 ? "#f0fdf4" : "#fafaf8"} stroke={esp32 ? "#86efac" : "#ddddd5"} strokeWidth="1.2"/>
          {Array.from({ length: 3 }, (_, row) => Array.from({ length: 4 }, (_, col) => (
            <rect key={`${row}-${col}`} x={4+col*11} y={4+row*9} width="8" height="6" rx="1.5"
              fill={esp32 ? "#dcfce7" : "#f0f0ec"} stroke={esp32 ? "#86efac" : "#e4e4dc"} strokeWidth="0.5"/>
          )))}
          <path d="M40 26 Q44 22 48 26" fill="none" stroke={esp32 ? "#16a34a" : "#ddddd5"} strokeWidth="1.3"/>
          <path d="M37 29 Q44 20 51 29" fill="none" stroke={esp32 ? "#16a34a" : "#ddddd5"} strokeWidth="1.3" opacity="0.5"/>
          <circle cx="44" cy="31" r="1.5" fill={esp32 ? "#16a34a" : "#ddddd5"}/>
          <text x={EP.w/2} y={EP.h+11} textAnchor="middle" fontSize="7" fill="#a8a898" fontFamily="Courier New,monospace">ESP32</text>
          <text x={EP.w/2} y={EP.h+19} textAnchor="middle" fontSize="6"  fill={esp32 ? "#16a34a" : "#c8c8c0"} fontFamily="Courier New,monospace">{esp32 ? "ONLINE" : "OFFLINE"}</text>
        </g>

        <text x={epMid-22}      y={EP.y-3}         fontSize="6" fill="#c8c8c0" fontFamily="Courier New,monospace">GPIO</text>
        <text x={EP.x+EP.w+4}  y={EP.y+EP.h/2}    fontSize="6" fill="#c8c8c0" fontFamily="Courier New,monospace">UART</text>
      </svg>

      {menu && (
        <>
          <div onClick={() => setMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 50 }}/>
          <div style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            background: "#ffffff", border: "1px solid #e4e4dc", borderRadius: "8px",
            overflow: "hidden", zIndex: 100, minWidth: "210px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
          }}>
            <div style={{ padding: "8px 12px", borderBottom: "1px solid #f0f0e8",
              fontFamily: "Courier New,monospace", fontSize: "8px", color: "#a8a898", letterSpacing: "0.14em" }}>
              SELECT OUTPUT DEVICE
            </div>
            {DEVICES.map(d => (
              <div key={d.id} onClick={() => { updateBoard(boardId, { device_type: d.id }); setMenu(false); }}
                style={{ padding: "9px 14px", fontSize: "12px", cursor: "pointer",
                  fontFamily: "Courier New,monospace", letterSpacing: "0.04em",
                  borderBottom: "1px solid #f4f4f0",
                  color: board.device_type === d.id ? "#16a34a" : "#606055",
                  background: board.device_type === d.id ? "#f0fdf4" : "transparent" }}>
                {d.icon ? `${d.icon}  ` : ""}{d.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Board;
