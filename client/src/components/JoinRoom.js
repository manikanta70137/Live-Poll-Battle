import React, { useState } from 'react';

const JoinRoom = ({ setRoomJoined, setRoomCode, setUsername, setSocket }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const connect = () => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      setSocket(ws);
      setUsername(name);

      if (code) {
        ws.send(JSON.stringify({ type: 'JOIN_ROOM', roomCode: code, username: name }));
      } else {
        ws.send(JSON.stringify({ type: 'CREATE_ROOM' }));
      }

      ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type === 'ROOM_CREATED') {
          setRoomCode(data.roomCode);
          ws.send(JSON.stringify({ type: 'JOIN_ROOM', roomCode: data.roomCode, username: name }));
        } else if (data.type === 'ROOM_JOINED') {
          setRoomJoined(true);
        } else if (data.type === 'ERROR') {
          alert(data.message);
        }
      };
    };
  };

  return (
    <div>
      <h2>Join or Create a Poll Room</h2>
      <input
        placeholder="Enter your name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Room code (leave empty to create)"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button onClick={connect}>Join / Create</button>
    </div>
  );
};

export default JoinRoom;
