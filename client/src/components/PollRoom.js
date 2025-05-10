import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PollRoom() {
  const { id: roomId } = useParams();
  const name = localStorage.getItem('name');
  const [votes, setVotes] = useState({ A: 0, B: 0 });
  const [voted, setVoted] = useState(localStorage.getItem(`voted-${roomId}`) === 'true');
  const [disabled, setDisabled] = useState(false);

  const socket = new WebSocket('ws://localhost:8080');

  useEffect(() => {
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'JOIN_ROOM', payload: { roomId, name } }));
    };

    socket.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      if (type === 'VOTE_UPDATE' || type === 'USER_JOINED') setVotes(payload);
      if (type === 'VOTING_ENDED') setDisabled(true);
    };

    return () => socket.close();
  }, []);

  const vote = (option) => {
    if (!voted && !disabled) {
      socket.send(JSON.stringify({ type: 'CAST_VOTE', payload: { roomId, option } }));
      setVoted(true);
      localStorage.setItem(`voted-${roomId}`, 'true');
    }
  };

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <h3>Poll: Cats vs Dogs</h3>
      <button disabled={voted || disabled} onClick={() => vote('A')}>Cats</button>
      <button disabled={voted || disabled} onClick={() => vote('B')}>Dogs</button>
      <p>Cats: {votes.A} | Dogs: {votes.B}</p>
      {voted && <p>You have already voted.</p>}
      {disabled && <p>Voting has ended.</p>}
    </div>
  );
}
