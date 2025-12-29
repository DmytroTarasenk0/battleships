import { useState } from "react";

function Board({ placedShips, setPlacedShips }) {
  // cells and their states
  const cells = Array.from({ length: 100 }, (_, i) => i);
  const [clickedCells, setClickedCells] = useState([]);

  // column and row labels
  const colLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const rowLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  // calculate coordinates
  const calculateCoords = (startIndex, length, isRotated) => {
    const coords = [];
    const startX = startIndex % 10;
    const startY = Math.floor(startIndex / 10);

    for (let i = 0; i < length; i++) {
      const x = isRotated ? startX : startX + i;
      const y = isRotated ? startY + i : startY;

      if (x > 9 || y > 9) return null; // out of bounds

      coords.push(y * 10 + x);
    }
    return coords;
  };

  // change style on click
  const handleClick = (id) => {
    const x = id % 10;
    const y = Math.floor(id / 10);
    console.log(`Cell clicked: (${x}, ${y})`);

    if (!clickedCells.includes(id)) {
      setClickedCells([...clickedCells, id]);
    }

    // Unclick
    // setClickedCells(clickedCells.filter((cellId) => cellId !== id));
  };

  // drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const shipData = e.dataTransfer.getData("shipData");

    if (shipData) {
      const { id, length, rotated } = JSON.parse(shipData);

      const newCoords = calculateCoords(index, length, rotated);

      if (!newCoords) {
        console.log("Invalid placement error (out of bounds)");
        return;
      }

      // forbidden zone(1-field gap + self)
      const forbidden = new Set();

      placedShips.forEach((ship) => {
        ship.coords.forEach((coord) => {
          // add self
          forbidden.add(coord);

          const cx = coord % 10;
          const cy = Math.floor(coord / 10);

          // neighboring cells
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const nx = cx + dx;
              const ny = cy + dy;

              // out of bounds or add
              if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
                forbidden.add(ny * 10 + nx);
              }
            }
          }
        });
      });

      const conflict = newCoords.some((coord) => forbidden.has(coord));

      if (conflict) {
        console.log("Invalid placement error (conflict with existing ships)");
        return;
      }

      // update placed ships
      setPlacedShips((prev) => [...prev, { id, coords: newCoords }]);
    }
  };

  // reset button (clear board)
  const handleReset = () => {
    setPlacedShips([]);
    setClickedCells([]);
  };

  return (
    <div>
      <div className="board-layout">
        <div className="headers-row">
          {colLabels.map((label) => (
            <div key={label} className="label-cell">
              {label}
            </div>
          ))}
        </div>

        <div className="headers-column">
          {rowLabels.map((label) => (
            <div key={label} className="label-cell">
              {label}
            </div>
          ))}
        </div>

        <div className="game-grid">
          {cells.map((i) => {
            // class based on state
            // priority: ship-hitted => ship-present => cell-clicked => default cell
            const isClicked = clickedCells.includes(i);
            const isOccupied = placedShips.some((ship) =>
              ship.coords.includes(i)
            );

            let statusClass = "";

            if (isOccupied && isClicked) {
              statusClass = "ship-present ship-hitted";
            } else if (isOccupied) {
              statusClass = "ship-present";
            } else if (isClicked) {
              statusClass = "cell-clicked";
            }
            return (
              <div
                key={i}
                className={`cell ${statusClass}`}
                onClick={() => handleClick(i)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, i)}
              />
            );
          })}
        </div>
      </div>
      <button className="reset-btn" onClick={handleReset}>
        Reset Board
      </button>
    </div>
  );
}

export default Board;
