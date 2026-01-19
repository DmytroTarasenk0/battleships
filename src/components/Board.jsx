import { calculateCoords, checkCollision, isOccupied } from "../helpers";
import { fleet } from "../fleet";

function Board({
  placedShips,
  setPlacedShips,
  gameState,
  clickedCells,
  onCellClick,
  onRandomize,
  isEnemy, // true or false
  selectedShipId,
  setSelectedShipId,
  rotatedShips,
}) {
  // cells and their states
  const cells = Array.from({ length: 100 }, (_, i) => i);

  // column and row labels
  const colLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const rowLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  // helper to place ship
  const placeShip = (id, length, rotated, index) => {
    const newCoords = calculateCoords(index, length, rotated);

    // out of bounds check
    if (!newCoords) return;

    // check collision with existing ships remade with helper
    if (checkCollision(placedShips, newCoords)) return;

    // update placed ships
    setPlacedShips((prev) => [...prev, { id, coords: newCoords }]);

    // deselect after placing
    if (setSelectedShipId) setSelectedShipId(null);
  };

  // drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    if (gameState !== "placement" || isEnemy) return; // no enemy placement just in case
    e.preventDefault();
    const shipData = e.dataTransfer.getData("shipData");

    if (shipData) {
      try {
        const { id, length, rotated } = JSON.parse(shipData);
        placeShip(id, length, rotated, index);
      } catch (err) {
        console.error("Drop failed", err);
      }
    }
  };

  const handleBoardClick = (index) => {
    // place ship if selected
    if (gameState === "placement" && !isEnemy && selectedShipId) {
      const ship = fleet.find((s) => s.id === selectedShipId);
      const isRotated = rotatedShips[ship.id] || false;

      placeShip(selectedShipId, ship.length, isRotated, index);
      return;
    }

    // in-game cell click
    if (onCellClick) {
      onCellClick(index);
    }
  };

  // reset button (clear board)
  const handleResetBoard = () => {
    setPlacedShips([]);
    if (setSelectedShipId) setSelectedShipId(null);
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
            const Occupied = isOccupied(placedShips, i);

            let statusClass = "";

            // hierarchy of ship-visibility
            // clicked & occupied => occupied by player => clicked => default
            if (Occupied && isClicked) {
              statusClass = "ship-present ship-hitted";
            } else if (Occupied && !isEnemy) {
              statusClass = "ship-present";
            } else if (isClicked) {
              statusClass = "cell-clicked";
            }
            return (
              <div
                key={i}
                className={`cell ${statusClass}`}
                onClick={() => handleBoardClick(i)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, i)}
              />
            );
          })}
        </div>
      </div>
      {!isEnemy && gameState === "placement" ? (
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button className="reset-btn" onClick={handleResetBoard}>
            Reset Board
          </button>
          <button className="random-btn" onClick={onRandomize}>
            Randomize Ships
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Board;
