import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [board, setBoard] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');

  const resetGame = () => {
    setBoard([]);
    setGameStatus('playing');
  };

  return (
    <GameContext.Provider value={{ board, gameStatus, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}
