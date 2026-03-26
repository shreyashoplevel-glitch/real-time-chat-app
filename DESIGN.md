# Real-Time Room-Based Chat App - Design Specification

A real-time chat application built with Node.js, Express, and Socket.io, featuring a sleek dark-themed UI and room-based messaging.

## 1. Features
- **Room Management:** Users can join specific rooms by name.
- **Real-Time Messaging:** Instant message delivery using Socket.io.
- **Typing Indicator:** Real-time "User is typing..." updates.
- **User Presence:**
  - **Join/Leave Notifications:** Alerts when users enter or exit a room.
  - **Online User Count:** Displays the number of participants in the current room.
- **Modern Dark UI:** A polished, high-contrast dark theme for better readability and style.

## 2. Technical Stack
- **Backend:** Node.js, Express.js (HTTP server), Socket.io (WebSocket).
- **Frontend:** HTML5, Vanilla CSS3 (Custom Variables for Dark Mode), Vanilla JavaScript.
- **Persistence:** None (in-memory for the prototype).

## 3. UI/UX Strategy
- **Layout:**
  - **Join Screen:** A centered card for entering a username and room name.
  - **Chat Interface:**
    - Sidebar (optional) or header with room information and user count.
    - Scrollable chat area with message bubbles.
    - Bottom message input with a "Send" button and real-time typing status.
- **Aesthetics:** Deep charcoals, slate grays, and vibrant accent colors (e.g., electric blue) for buttons and active states. Smooth transitions and shadow depth for a "modern" feel.

## 4. Implementation Plan
### Phase 1: Setup & Backend
- Initialize `package.json` with dependencies: `express`, `socket.io`.
- Create `server.js` to handle:
  - Static file serving.
  - Socket.io connection, room joining/leaving, and message broadcasting.
  - Tracking room members and typing status.

### Phase 2: Frontend Layout (HTML/CSS)
- `public/index.html`: Structure for the Join screen and Chat container.
- `public/style.css`: Dark mode styles, message bubble layouts, and responsive design.

### Phase 3: Frontend Logic (JS)
- `public/script.js`:
  - Handle Socket.io client events.
  - Manage Join/Chat UI toggle.
  - Event listeners for message submission and typing events.

### Phase 4: Validation & Polishing
- Test room isolation (messages only go to the correct room).
- Verify typing indicator and user count updates.
- Final UI tweaks.
