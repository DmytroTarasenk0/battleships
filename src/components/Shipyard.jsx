import { useState } from "react";
import { fleet } from "../fleet";

function Shipyard({ placedShips }) {
  // fleet definition moved to fleet.js

  // store state of ships(rotated or not) in {id : boolean} format
  const [rotatedShips, setRotatedShips] = useState({});

  const toggleRotation = (shipId) => {
    setRotatedShips((prev) => ({
      ...prev,
      [shipId]: !prev[shipId],
    }));
  };

  // drag start
  const handleDragStart = (e, ship) => {
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
    // logs
    console.log(`Dragging ${ship.name} (Rotated: ${currentRotation})`);
  };

  return (
    <div className="shipyard">
      <h2>Shipyard</h2>

      {fleet.map((ship) => {
        // !! ensures getting strict "false" instead of "undefined" if it's new
        const isRotated = !!rotatedShips[ship.id];

        // don't render placed ships
        const isPlaced = placedShips.some((p) => p.id === ship.id);
        if (isPlaced) return null;

        return (
          <div
            key={ship.id}
            className={`fleet-ship ${isRotated ? "vertical" : ""}`}
            draggable={true}
            // drag and click handlers
            onDragStart={(e) => handleDragStart(e, ship)}
            onClick={() => toggleRotation(ship.id)}
          >
            {/* Check names <div>{ship.name}</div> */}
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
          Drag to place <br /> Click to rotate
        </p>
      </div>
    </div>
  );
}

export default Shipyard;
