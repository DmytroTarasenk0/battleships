import { calculateCoords, checkCollision } from "../helpers";

function Board({
  placedShips,
  setPlacedShips,
  gameState,
  clickedCells,
  onCellClick,
  onResetGame,
  onRandomize,
}) {
  // cells and their states
  const cells = Array.from({ length: 100 }, (_, i) => i);

  // column and row labels
  const colLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const rowLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  // calculate coordinates moved to helpers.js

  // drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    if (gameState !== "placement") return;
    e.preventDefault();
    const shipData = e.dataTransfer.getData("shipData");

    if (shipData) {
      const { id, length, rotated } = JSON.parse(shipData);

      const newCoords = calculateCoords(index, length, rotated);

      if (!newCoords) {
        console.log("Invalid placement error (out of bounds)");
        return;
      }

      // check collision remade with helper
      if (checkCollision(placedShips, newCoords)) {
        console.log("Invalid placement error (conflict with existing ships)");
        return;
      }

      // update placed ships
      setPlacedShips((prev) => [...prev, { id, coords: newCoords }]);
    }
  };

  // reset button (clear board)
  const handleResetBoard = () => {
    setPlacedShips([]);
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
            } else if (isOccupied && gameState === "placement") {
              statusClass = "ship-present";
            } else if (isClicked) {
              statusClass = "cell-clicked";
            }
            return (
              <div
                key={i}
                className={`cell ${statusClass}`}
                onClick={() => onCellClick(i)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, i)}
              />
            );
          })}
        </div>
      </div>
      {gameState === "placement" ? (
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button className="reset-btn" onClick={handleResetBoard}>
            Reset Board
          </button>
          <button className="random-btn" onClick={onRandomize}>
            Randomize Ships
          </button>
        </div>
      ) : (
        <button className="reset-btn" onClick={onResetGame}>
          Reset Game
        </button>
      )}
    </div>
  );
}

export default Board;
