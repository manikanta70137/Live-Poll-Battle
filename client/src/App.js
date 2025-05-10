import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinRoom from './components/JoinRoom';
import PollRoom from './components/PollRoom';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinRoom />} />
        <Route path="/room/:id" element={<PollRoom />} />
      </Routes>
    </Router>
  );
}
