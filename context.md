# System Summary — Smart Electric Board Simulation

## What The System Is

A simulation of a smart home electric board system. Physical boards (each with MCB, Rocker, Relay, HiLink, PZEM, and an output Device) are represented visually on a React app. Each board maps to a simulated ESP32 on Node. A Flutter app pairs to boards and controls them remotely over local WiFi.

---

## React — The Physical Layer

### What it is

React simulates the physical home environment. A homeowner adds boards, assigns devices, and controls the physical layer components (mains, MCB, rocker). It also runs the PZEM generation loop per board, simulating what the real PZEM energy meter would read.

### What it owns

- Board identity (board_id, generated here)
- Physical layer state (mains, MCB, rocker)
- Device type per board (LED, Fan, TV etc)
- Visual placement of boards on screen
- PZEM generation logic

### What it does not own

- Relay state (Node owns this)
- PZEM readings after generation (pushed to Node)

### Persistence

Zustand store with `persist` plugin syncing to IndexedDB. Survives tab closes. On boot, React renders boards from IndexedDB, shows loading screen, polls Node for relay state per board, then starts or suppresses PZEM generation loops accordingly.

### Communication with Node

- POST `/board` — when a board is added
- GET `/relay/:board_id` — on boot per board
- POST `/pair/:board_id` — when user clicks pair on a board
- WebSocket `/pzem/:board_id` — continuous PZEM stream per board, gated by relay state

### Codebase structure

```
/board-react
  /src
    /components
      /board
        Board.jsx           — board container, parent of all physical components
        MCB.jsx
        Rocker.jsx
        Relay.jsx
        HiLink.jsx
      /device
        Device.jsx          — switches rendering on device_type enum
        LED.jsx
        Fan.jsx
        TV.jsx
    /pages
      Dashboard.jsx         — renders n boards
    /hooks
      useBoard.js           — board creation and management
      useRelay.js           — relay fetch
      usePzem.js            — PZEM stream management
    /simulation
      pzemGenerator.js      — per board generation loop, gated by relay state
      deviceProfiles.js     — device enum with realistic reading ranges
    /services
      api.js                — all HTTP calls to Node
      socket.js             — WebSocket connection management
    /store
      boardStore.js         — Zustand store with IndexedDB persistence
    /utils
      boardId.js            — board ID generation
  index.html
  main.jsx
```

---

## Node — The ESP32 Firmware

### What it is

Node simulates the ESP32 firmware layer. It is the source of truth for relay state and PZEM readings. It manages pairing between boards and the Flutter app, persists all ESP32 state to SQLite, and acts as the central communication hub between React and Flutter.

### What it owns

- Relay state per board
- PZEM readings per board (received from React, forwarded to Flutter)
- PIN per board (persistent credential for Flutter auth)
- Active WebSocket connections from both React and Flutter

### What it does not own

- Physical layer state (React owns this)
- Device type (React owns this)
- Board visual placement (React owns this)

### Persistence

SQLite (`state.db`). On boot, Node loads all board records including relay state and PINs. Defaults to relay=0 for any board not found in SQLite. React polls after Node boots and reflects accordingly.

### Communication

**Receives from React:**

- POST `/board` — stores new board record
- POST `/pair/:board_id` — generates PIN, returns to React, UDP broadcasts to listening Flutter
- WebSocket `/pzem/:board_id` — receives continuous PZEM stream from React

**Receives from Flutter:**

- UDP broadcast — Node responds with IP for session discovery
- GET `/relay/:board_id` — returns relay state, auth middleware validates board_id + PIN
- POST `/relay/:board_id` — toggles relay, updates SQLite, acks on same response
- WebSocket `/pzem/:board_id` — Node streams PZEM to Flutter, auth middleware validates

**Internal:**

- PIN middleware — validates board_id + PIN on every Flutter request
- PZEM bridge — receives from React WebSocket, forwards to Flutter WebSocket
- UDP listener — responds to Flutter discovery broadcasts
- UDP broadcaster — fires on pair_esp when no Flutter session exists

### Codebase structure

```
/esp-node
  /src
    /routes
      board.js              — POST /board
      relay.js              — GET and POST /relay/:board_id
      pzem.js               — WebSocket /pzem/:board_id
      pairing.js            — POST /pair/:board_id, UDP logic
    /services
      board.js              — board creation logic
      relay.js              — relay toggle, SQLite update
      pzem.js               — PZEM bridge between React and Flutter
      pairing.js            — PIN generation, UDP broadcast
    /db
      schema.js             — table definitions, runs on boot
      queries.js            — all SQLite read and write functions
    /utils
      pin.js                — PIN generation helper
      validator.js          — PIN validation middleware
  state.db
  index.js
```

---

## Flutter — The Client

### What it is

Flutter is the remote control. A homeowner uses it to view PZEM readings and toggle relay on boards they are paired to. It is a thin client — it initiates all connections, carries PIN as persistent credential, and trusts Node completely.

### What it owns

- board_id and PIN (persisted in Hive, survives app closes)
- Runtime relay state (Riverpod, ephemeral)
- Runtime PZEM readings (Riverpod, ephemeral)

### What it does not own

- Any source of truth — everything read from Node

### Startup sequence

1. Boot, load board_id and PIN from Hive
2. UDP broadcast to discover Node IP
3. GET relay state from Node with board_id + PIN
4. Open WebSocket PZEM stream with board_id + PIN
5. Render board with live data

### Pairing sequence (first time only)

1. Node UDP broadcasts pair request with board_id
2. Flutter receives, shows pairing screen
3. User enters PIN
4. Flutter sends PIN + board_id to Node
5. Node validates, Flutter stores both in Hive
6. Normal startup sequence from here on

### Communication with Node

- UDP broadcast — discover Node IP
- GET `/relay/:board_id` — once on connect
- POST `/relay/:board_id` — relay toggle, waits for ack
- WebSocket `/pzem/:board_id` — continuous PZEM stream inbound

### Codebase structure

```
/app-flutter
  /lib
    /screens
      PairingScreen.dart    — PIN entry and board discovery
      BoardScreen.dart      — relay toggle and PZEM readings
    /widgets
      RelayToggle.dart      — on/off toggle widget
      PzemDisplay.dart      — live readings display
      ConnectionStatus.dart — Node connection indicator
    /services
      udp.dart              — Node discovery broadcast
      socket.dart           — WebSocket PZEM stream
      api.dart              — HTTP relay calls
    /models
      board.dart            — board model
      pzem.dart             — PZEM reading model
    /state
      boardProvider.dart    — paired board state
      pzemProvider.dart     — live PZEM stream state
      relayProvider.dart    — relay state
    /storage
      appStorage.dart       — Hive PIN and board_id persistence
  main.dart
```

---

## Data Shapes

**React (IndexedDB):**

```js
board: {
  board_id,
  name,
  location,
  device_type,    // enum: LED, Fan, TV
  mains,          // bool
  mcb,            // bool
  rocker,         // bool
}
```

**Node (SQLite):**

```js
board: {
  board_id,
  relay_state,    // bool
  pin,            // string
  pzem: {
    voltage,      // V
    current,      // A
    power,        // W
    energy        // kWh
  }
}
```

**Flutter (Hive — persistent):**

```js
{
  board_id,
  pin
}
```

**Flutter (Riverpod — runtime):**

```js
{
  board_id,
  relay_state,
  pzem: {
    voltage,
    current,
    power,
    energy
  }
}
```

**PZEM message (travels React → Node → Flutter):**

```js
{
  board_id,
  voltage,
  current,
  power,
  energy
}
```

---

## How The Three Connect

```
React ──POST /board──────────────────────► Node
React ──GET /relay/:board_id─────────────► Node
React ──POST /pair/:board_id─────────────► Node ──UDP broadcast──► Flutter
React ──WebSocket /pzem/:board_id────────► Node ──WebSocket──────► Flutter
                                           Node ◄──UDP broadcast── Flutter
                                           Node ◄──GET /relay───── Flutter
                                           Node ◄──POST /relay──── Flutter
```

Node is the hub. React and Flutter never talk to each other directly. React owns the physical world. Flutter owns the remote control. Node owns the truth.






































