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
