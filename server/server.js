// server/server.js
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });
const rooms = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const { type, payload } = data;

    if (type === 'CREATE_ROOM') {
      const roomId = uuidv4().slice(0, 6);
      rooms[roomId] = { users: [], votes: {}, ended: false, timer: null };
      ws.send(JSON.stringify({ type: 'ROOM_CREATED', payload: roomId }));
    }

    if (type === 'JOIN_ROOM') {
      const { roomId, name } = payload;
      if (rooms[roomId] && !rooms[roomId].ended) {
        rooms[roomId].users.push({ ws, name });
        ws.roomId = roomId;
        ws.name = name;

        if (!rooms[roomId].timer) {
          rooms[roomId].timer = setTimeout(() => {
            rooms[roomId].ended = true;
            broadcast(roomId, { type: 'VOTING_ENDED' });
          }, 60000);
        }

        broadcast(roomId, {
          type: 'USER_JOINED',
          payload: rooms[roomId].votes
        });
      }
    }

    if (type === 'CAST_VOTE') {
      const { roomId, option } = payload;
      if (rooms[roomId] && !rooms[roomId].ended) {
        rooms[roomId].votes[ws.name] = option;
        const voteCount = countVotes(rooms[roomId].votes);
        broadcast(roomId, {
          type: 'VOTE_UPDATE',
          payload: voteCount
        });
      }
    }
  });
});

function broadcast(roomId, message) {
  const room = rooms[roomId];
  if (room) {
    room.users.forEach(({ ws }) => {
      ws.send(JSON.stringify(message));
    });
  }
}

function countVotes(votes) {
  const tally = { A: 0, B: 0 };
  Object.values(votes).forEach(vote => {
    tally[vote]++;
  });
  return tally;
}

console.log("WebSocket server running on ws://localhost:8080");

