import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JoinRoom() {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const createRoom = async () => {
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'CREATE_ROOM' }));
      socket.onmessage = (msg) => {
        const { type, payload } = JSON.parse(msg.data);
        if (type === 'ROOM_CREATED') {
          localStorage.setItem('name', name);
          localStorage.setItem('roomId', payload);
          navigate(`/room/${payload}`);
        }
      };
    };
  };

  const joinRoom = () => {
    localStorage.setItem('name', name);
    localStorage.setItem('roomId', roomCode);
    navigate(`/room/${roomCode}`);
  };

  return (
    <div>
      <h2>Live Poll Battle</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
      <div>
        <button onClick={createRoom} disabled={!name}>Create Room</button>
      </div>
      <div>
        <input value={roomCode} onChange={(e) => setRoomCode(e.target.value)} placeholder="Room Code" />
        <button onClick={joinRoom} disabled={!name || !roomCode}>Join Room</button>
      </div>
    </div>
  );
}
