# 🗳️ Live Poll Battle

A real-time poll application where users can join or create a poll room and vote live. All votes update instantly across all clients using WebSockets.

## 🔧 Tech Stack

- **Frontend:** ReactJS
- **Backend:** NodeJS with WebSockets (using `ws`)

---

## 🚀 Features Implemented

### ✅ Frontend (React)
- User can enter a name and either:
  - Create a new poll room
  - Join an existing poll room via room code
- Displays a question with two options (e.g., **Cats vs Dogs**)
- User can vote on one option only
- Vote updates in real-time across all clients in the same room
- Users cannot vote again once they’ve voted
- Countdown timer disables voting after 60 seconds
- Local storage persists user vote on page refresh

### ✅ Backend (NodeJS + WebSocket)
- Handles creation and in-memory storage of poll rooms
- Accepts and broadcasts votes to all clients in the room
- Maintains poll state per room (no database)
- Supports multiple rooms and users concurrently

---

## 🛠️ Setup Instructions

### 🔗 Clone the Repo
```bash
git clone https://github.com/manikanta70137/Live-Poll-Battle.git
cd Live-Poll-Battle
Start Backend (WebSocket Server)
bash
Copy
Edit
cd server
npm install
node server.js
The server runs on: ws://localhost:8080

🌐 Start Frontend (React App)
bash
Copy
Edit
cd client
npm install
npm start
The app opens at: http://localhost:3000

🧠 Architecture Notes
Each poll room is represented in memory using a UUID. When a user creates or joins a room, their socket is tracked, and their votes are stored within that room's state. WebSocket events handle:

User joins

Vote submissions

Broadcasting real-time updates to other clients in the same room

Votes are stored temporarily in the backend memory, and client-side localStorage ensures vote persistence through page refreshes.
📦 Folder Structure:
Live-Poll-Battle/
├── client/        # React frontend
│   └── src/
│       └── components/
├── server/        # NodeJS backend with WebSocket
│   └── server.js
└── README.md


---
📄 Key Features:
- Real-time vote updates using WebSockets
- Room-based vote isolation
- 60-second voting timer
- Duplicate vote prevention with localStorage
- Multi-user support

Best regards,  
**Manikanta**  
