import { fleet } from "../fleet";

function Shipyard({
  placedShips,
  selectedShipId,
  setSelectedShipId,
  rotatedShips,
  setRotatedShips,
}) {
  // store state of ships(rotated or not) in {id : boolean} format moved to App.jsx

  const handleClick = (shipId) => {
    if (selectedShipId === shipId) {
      setRotatedShips((prev) => ({
        ...prev,
        [shipId]: !prev[shipId],
      }));
    } else {
      setSelectedShipId(shipId);
    }
  };

  // drag start
  const handleDragStart = (e, ship) => {
    setSelectedShipId(ship.id);

    e.dataTransfer.effectAllowed = "move"; // cursor
    const currentRotation = rotatedShips[ship.id] || false;

    // data to be transferred
    e.dataTransfer.setData(
      "shipData",
      JSON.stringify({
        id: ship.id,
        length: ship.length,
        rotated: currentRotation,
      })
    );
  };

  return (
    <div className="shipyard">
      <h2>Shipyard</h2>

      {fleet.map((ship) => {
        // !! ensures getting strict "false" instead of "undefined" if it's new
        const isRotated = !!rotatedShips[ship.id];
        const isSelected = selectedShipId === ship.id;

        // don't render placed ships
        const isPlaced = placedShips.some((p) => p.id === ship.id);
        if (isPlaced) return null;

        return (
          <div
            key={ship.id}
            className={`fleet-ship ${isRotated ? "vertical" : ""} ${
              isSelected ? "ship-selected" : ""
            }`}
            draggable={true}
            // drag and click handlers
            onDragStart={(e) => handleDragStart(e, ship)}
            onClick={() => handleClick(ship.id)}
          >
            {/* Ship parts */}
            {Array.from({ length: ship.length }).map((_, index) => (
              <div key={index} className="ship-part" />
            ))}
          </div>
        );
      })}

      {/* Instructions */}
      <div style={{ marginTop: "auto", fontSize: "0.8rem", opacity: 0.7 }}>
        <p>
          Drag and drop ships onto the board. <br />
          Or, tap a ship to select it, then tap the board to place it. <br />
          Note: You place the ship by its "nose" (top/left) <br />
          Tap a ship again to rotate it.
        </p>
      </div>
    </div>
  );
}

export default Shipyard;
