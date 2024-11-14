import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Board from '../components/Board';
import { GameContext } from '../context/GameContext';

function Game() {
  const { difficulty } = useParams();
  const { resetGame } = useContext(GameContext);

  return (
    <div>
      <h2>Playing {difficulty} mode</h2>
      <button onClick={resetGame}>Reset Game</button>
      <Board difficulty={difficulty} />
    </div>
  );
}

export default Game;
