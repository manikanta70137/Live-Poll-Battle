const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });
const rooms = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const { type, payload } = JSON.parse(message);

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

        broadcast(roomId, { type: 'USER_JOINED', payload: countVotes(rooms[roomId].votes) });
      }
    }

    if (type === 'CAST_VOTE') {
      const { roomId, option } = payload;
      if (rooms[roomId] && !rooms[roomId].ended) {
        rooms[roomId].votes[ws.name] = option;
        const tally = countVotes(rooms[roomId].votes);
        broadcast(roomId, { type: 'VOTE_UPDATE', payload: tally });
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
  return ['A', 'B'].reduce((acc, opt) => {
    acc[opt] = Object.values(votes).filter(v => v === opt).length;
    return acc;
  }, { A: 0, B: 0 });
}

console.log('WebSocket server started on ws://localhost:8080');
