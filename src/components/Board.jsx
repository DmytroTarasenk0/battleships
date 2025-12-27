import { useState } from "react";

function Board() {
  // cells and their states
  const cells = Array.from({ length: 100 }, (_, i) => i);
  const [clickedCells, setClickedCells] = useState([]);

  // column and row labels
  const colLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const rowLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

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

  return (
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
          const isClicked = clickedCells.includes(i);
          return (
            <div
              key={i}
              className={`cell ${isClicked ? "cell-clicked" : ""}`}
              onClick={() => handleClick(i)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Board;
