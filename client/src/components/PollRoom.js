import React, { useEffect, useState } from 'react';

const PollRoom = ({ roomCode, username, socket }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [votes, setVotes] = useState({});
  const [voted, setVoted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!socket) return;

    const vote = localStorage.getItem(`vote-${roomCode}`);
    if (vote) {
      setVoted(true);
    }

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === 'ROOM_JOINED') {
        setQuestion(data.question);
        setOptions(data.options);
        setVotes(data.votes);
        setEnded(data.ended);
        if (!data.ended) {
          socket.send(JSON.stringify({ type: 'START_TIMER', roomCode }));
        }
      } else if (data.type === 'VOTE_UPDATE') {
        setVotes(data.votes);
      } else if (data.type === 'VOTING_ENDED') {
        setEnded(true);
      }
    };
  }, [socket, roomCode]);

  useEffect(() => {
    if (ended) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [ended]);

  const castVote = (option) => {
    if (voted || ended) return;
    socket.send(JSON.stringify({ type: 'CAST_VOTE', vote: option }));
    setVoted(true);
    localStorage.setItem(`vote-${roomCode}`, option);
  };

  return (
    <div>
      <h2>Room: {roomCode}</h2>
      <p><strong>{question}</strong></p>
      {options.map(option => (
        <button key={option} onClick={() => castVote(option)} disabled={voted || ended}>
          {option}
        </button>
      ))}
      <div style={{ marginTop: '20px' }}>
        <h3>Live Results</h3>
        {Object.entries(votes).map(([opt, count]) => (
          <p key={opt}>{opt}: {count}</p>
        ))}
        {ended && <p>Voting ended!</p>}
        {!ended && <p>Time left: {timeLeft} seconds</p>}
        {voted && !ended && <p>You have voted!</p>}
      </div>
    </div>
  );
};

export default PollRoom;
