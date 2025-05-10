import React, { useState } from 'react';
import JoinRoom from './components/JoinRoom';
import PollRoom from './components/PollRoom';

const App = () => {
  const [roomJoined, setRoomJoined] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState(null);

  return (
    <div>
      {!roomJoined ? (
        <JoinRoom 
          setRoomJoined={setRoomJoined}
          setRoomCode={setRoomCode}
          setUsername={setUsername}
          setSocket={setSocket}
        />
      ) : (
        <PollRoom
          roomCode={roomCode}
          username={username}
          socket={socket}
        />
      )}
    </div>
  );
};

export default App;
