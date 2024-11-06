import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const gridSize = 20; // Grid size of 20x20
  const [grid, setGrid] = useState(Array.from({ length: gridSize }, () => Array(gridSize).fill(null)));
  const [currentRow, setCurrentRow] = useState(null);
  const [currentCol, setCurrentCol] = useState(null);
  const [leftIndex, setLeftIndex] = useState(null);
  const [rightIndex, setRightIndex] = useState(null);
  const [topIndex, setTopIndex] = useState(null);
  const [bottomIndex, setBottomIndex] = useState(null);
  const [isMoving, setIsMoving] = useState(false);

  // Function to handle grid cell click
  function handleClick(row, col) {
    if (!isMoving) {
      const newGrid = grid.map(() => Array(gridSize).fill(null));
      newGrid[row][col] = "blue";

      setGrid(newGrid);
      setCurrentRow(row);
      setCurrentCol(col);
      setLeftIndex(col);
      setRightIndex(col);
      setTopIndex(row);
      setBottomIndex(row);
      setIsMoving(true);
    }
  }

  // Effect to handle the spreading effect
  useEffect(() => {
    if (!isMoving) return;

    const interval = setInterval(() => {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.map((cell) => (cell === "blue" ? null : cell)));

        // Update the boundary indices based on the current round
        const newLeftIndex = leftIndex > 0 ? leftIndex - 1 : null;
        const newRightIndex = rightIndex < gridSize - 1 ? rightIndex + 1 : null;
        const newTopIndex = topIndex > 0 ? topIndex - 1 : null;
        const newBottomIndex = bottomIndex < gridSize - 1 ? bottomIndex + 1 : null;

        // Color cells in the current round
        if (currentRow !== null) {
          if (newLeftIndex !== null) {
            for (let i = topIndex; i <= bottomIndex; i++) {
              newGrid[i][newLeftIndex] = "blue";
            }
          }
          if (newRightIndex !== null) {
            for (let i = topIndex; i <= bottomIndex; i++) {
              newGrid[i][newRightIndex] = "blue";
            }
          }
          if (newTopIndex !== null) {
            for (let i = leftIndex; i <= rightIndex; i++) {
              newGrid[newTopIndex][i] = "blue";
            }
          }
          if (newBottomIndex !== null) {
            for (let i = leftIndex; i <= rightIndex; i++) {
              newGrid[newBottomIndex][i] = "blue";
            }
          }
        }

        // Update indices for the next round
        setLeftIndex(newLeftIndex);
        setRightIndex(newRightIndex);
        setTopIndex(newTopIndex);
        setBottomIndex(newBottomIndex);

        return newGrid;
      });

      // Check if all boundaries have moved out of bounds to reset the grid
      if (
        leftIndex === null &&
        rightIndex === null &&
        topIndex === null &&
        bottomIndex === null
      ) {
        setIsMoving(false); // Stop movement
        setGrid(Array.from({ length: gridSize }, () => Array(gridSize).fill(null))); // Clear grid
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMoving, leftIndex, rightIndex, topIndex, bottomIndex, currentRow, currentCol]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, 50px)`, gap: '5px' }}>
      {grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            onClick={() => handleClick(rowIndex, cellIndex)}
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: cell || "lightgrey",
              border: "1px solid black",
            }}
          />
        ))
      )}
    </div>
  );
}

export default App;
