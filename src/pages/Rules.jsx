import React from 'react';

function Rules() {
  return (
    <div>
      <h2>Game Rules</h2>
      <p>The goal of Minesweeper is to find all the empty squares without hitting a mine.</p>
      <ul>
        <li>Click a square to reveal it.</li>
        <li>If you hit a mine, you lose!</li>
        <li>If you reveal all the safe squares, you win!</li>
      </ul>
    </div>
  );
}

export default Rules;
