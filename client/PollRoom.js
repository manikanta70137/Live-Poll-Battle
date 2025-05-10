import React, { useEffect, useState } from 'react';

const socket = new WebSocket('ws://localhost:8080');

export default function PollRoom({ name, roomId }) {
  const [votes, setVotes] = useState({ A: 0, B: 0 });
  const [voted, setVoted] = useState(
    localStorage.getItem(`voted-${roomId}`) === 'true'
  );
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'JOIN_ROOM', payload: { roomId, name } }));
    };

    socket.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);

      if (type === 'VOTE_UPDATE') setVotes(payload);
      if (type === 'VOTING_ENDED') setDisabled(true);
    };
  }, []);

  const vote = (option) => {
    if (!voted && !disabled) {
      socket.send(JSON.stringify({ type: 'CAST_VOTE', payload: { roomId, option } }));
      localStorage.setItem(`voted-${roomId}`, 'true');
      setVoted(true);
    }
  };

  return (
    <div>
      <h2>Poll: Cats vs Dogs</h2>
      <button onClick={() => vote('A')} disabled={voted || disabled}>Cats</button>
      <button onClick={() => vote('B')} disabled={voted || disabled}>Dogs</button>
      <p>Cats: {votes.A} | Dogs: {votes.B}</p>
      {voted && <p>You have already voted.</p>}
      {disabled && <p>Voting has ended.</p>}
    </div>
  );
}
