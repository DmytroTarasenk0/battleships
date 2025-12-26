import { useState } from "react";

function Board() {
  // cells and their states
  const cells = Array.from({ length: 100 }, (_, i) => i);
  const [clickedCells, setClickedCells] = useState([]);

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
    <div className="board">
      {cells.map((i) => {
        // class based on state
        const isClicked = clickedCells.includes(i);
        const className = isClicked ? "cell cell-clicked" : "cell";

        return (
          <div key={i} className={className} onClick={() => handleClick(i)} />
        );
      })}
    </div>
  );
}

export default Board;
