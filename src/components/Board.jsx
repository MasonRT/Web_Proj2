import React, { useState, useEffect } from 'react';

function Board({ difficulty }) {
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const difficulties = {
    easy: { size: 8, mines: 10 },
    medium: { size: 16, mines: 40 },
    hard: { size: 30, mines: 99 },
  };

  const { size, mines } = difficulties[difficulty] || difficulties.easy;

  // Helper function to initialize the board
  const initializeBoard = () => {
    const board = Array(size).fill().map(() =>
      Array(size).fill({ revealed: false, mine: false, count: 0, flagged: false })
    );

    // Place mines randomly
    let mineCount = 0;
    while (mineCount < mines) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (!board[row][col].mine) {
        board[row][col].mine = true;
        mineCount++;
      }
    }

    // Calculate mine counts for each cell
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c].mine) continue;
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = r + i;
            const newCol = c + j;
            if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && board[newRow][newCol].mine) {
              count++;
            }
          }
        }
        board[r][c].count = count;
      }
    }

    setGrid(board);
    setGameOver(false);
    setGameWon(false);
  };

  // Effect to initialize the board on component load
  useEffect(() => {
    initializeBoard();
  }, [difficulty]);

  // Handle cell click
  const handleClick = (row, col) => {
    if (gameOver || grid[row][col].revealed || grid[row][col].flagged) return;

    const newGrid = JSON.parse(JSON.stringify(grid));
    if (newGrid[row][col].mine) {
      setGameOver(true);
      revealAllMines(newGrid);
    } else {
      revealCell(newGrid, row, col);
      checkWin(newGrid);
    }

    setGrid(newGrid);
  };

  // Reveal a cell and recursively reveal empty cells
  const revealCell = (grid, startRow, startCol) => {
    const queue = [];
    queue.push([startRow, startCol]);

    while (queue.length > 0) {
      const [row, col] = queue.shift();

      // Skip if out of bounds or already revealed
      if (
        row < 0 ||
        row >= size ||
        col < 0 ||
        col >= size ||
        grid[row][col].revealed ||
        grid[row][col].mine
      ) {
        continue;
      }

      // Reveal the current cell
      grid[row][col].revealed = true;

      // If the cell is empty (count === 0), add its neighbors to the queue
      if (grid[row][col].count === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i !== 0 || j !== 0) {
              queue.push([row + i, col + j]);
            }
          }
        }
      }
    }
  };


  // Reveal all mines when the game is over
  const revealAllMines = (grid) => {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c].mine) {
          grid[r][c].revealed = true;
        }
      }
    }
  };

  // Check for win condition
  const checkWin = (grid) => {
    const revealedCells = grid.flat().filter((cell) => cell.revealed).length;
    const totalSafeCells = size * size - mines;
    if (revealedCells === totalSafeCells) {
      setGameWon(true);
      setGameOver(true);
    }
  };

  // Handle right-click to flag a cell
  const handleRightClick = (e, row, col) => {
    e.preventDefault();
    if (gameOver || grid[row][col].revealed) return;

    const newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[row][col].flagged = !newGrid[row][col].flagged;
    setGrid(newGrid);
  };

  // Reset game
  const resetGame = () => {
    initializeBoard();
  };

  return (
    <div>
      <h3>{gameOver ? (gameWon ? "You Won!" : "Game Over! You Lost!") : `Playing ${difficulty} mode`}</h3>
      <button onClick={resetGame}>Reset Game</button>
      <div className="board">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell.revealed ? (cell.mine ? "mine" : "safe") : "hidden"} ${cell.flagged ? "flag" : ""}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
              >
                {cell.revealed ? (cell.mine ? "💣" : cell.count || "") : cell.flagged ? "🚩" : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
