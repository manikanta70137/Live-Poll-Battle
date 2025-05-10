const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });

const rooms = {}; // roomCode: { question, options, votes, users, timer }

wss.on('connection', ws => {
  ws.on('message', message => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'CREATE_ROOM':
        const roomCode = uuidv4().slice(0, 6);
        rooms[roomCode] = {
          question: 'Cats vs Dogs',
          options: ['Cats', 'Dogs'],
          votes: { Cats: 0, Dogs: 0 },
          users: new Set(),
          ended: false
        };

        ws.send(JSON.stringify({ type: 'ROOM_CREATED', roomCode }));
        break;

      case 'JOIN_ROOM':
        const room = rooms[data.roomCode];
        if (room && !room.users.has(data.username)) {
          room.users.add(data.username);
          ws.roomCode = data.roomCode;
          ws.username = data.username;
          ws.send(JSON.stringify({
            type: 'ROOM_JOINED',
            question: room.question,
            options: room.options,
            votes: room.votes,
            ended: room.ended
          }));
        } else {
          ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid room or user already exists' }));
        }
        break;

      case 'CAST_VOTE':
        const currentRoom = rooms[ws.roomCode];
        if (currentRoom && !currentRoom.ended) {
          const voteKey = data.vote;
          if (currentRoom.votes.hasOwnProperty(voteKey)) {
            currentRoom.votes[voteKey]++;
            broadcast(ws.roomCode, {
              type: 'VOTE_UPDATE',
              votes: currentRoom.votes
            });
          }
        }
        break;

      case 'START_TIMER':
        const timerRoom = rooms[data.roomCode];
        if (timerRoom && !timerRoom.timerStarted) {
          timerRoom.timerStarted = true;
          setTimeout(() => {
            timerRoom.ended = true;
            broadcast(data.roomCode, { type: 'VOTING_ENDED' });
          }, 60000);
        }
        break;
    }
  });
});

function broadcast(roomCode, message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.roomCode === roomCode) {
      client.send(JSON.stringify(message));
    }
  });
}

console.log('WebSocket server is running on ws://localhost:8080');
