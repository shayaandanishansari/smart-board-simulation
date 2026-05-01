# SmartBoard Simulation

A full-stack simulation of a smart home electric board ecosystem.

## Architecture
- React (Physical Layer): Simulates the hardware (MCB, Rocker, PZEM sensors) and generates live energy data.
- Node (ESP-Firmware): The central hub. Manages relay states, handles pairing, and bridges data via WebSockets & UDP.
- Flutter (Remote Control): The mobile client. Discovers the hub and provides remote control/monitoring.

## Getting Started
Run everything in separate windows with one command:

```powershell
.\run.ps1
```

## Tech Stack
- Frontend: React, Zustand (Persistence), WebSockets.
- Backend: Node.js, Express, Better-SQLite3, WS, UDP.
- Mobile: Flutter, Riverpod, Hive.
