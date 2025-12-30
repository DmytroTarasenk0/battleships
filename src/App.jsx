import { useState } from "react";
import Board from "./components/Board";
import Shipyard from "./components/Shipyard";

function App() {
  const [placedShips, setPlacedShips] = useState([]);
  const [gameState, setGameState] = useState("placement"); // "placement" or "play"
  const [clickedCells, setClickedCells] = useState([]);

  const resetGame = () => {
    setPlacedShips([]);
    setClickedCells([]);
    setGameState("placement");
  };

  // click only "in-game" and no double-click
  const handleCellClick = (cellIndex) => {
    if (gameState !== "play") return;
    if (!clickedCells.includes(cellIndex))
      return setClickedCells((prev) => [...prev, cellIndex]);
  };

  const startHandler = () => {
    if (placedShips.length == 6) {
      setGameState("play");
    }
  };

  return (
    <div className="app-container">
      <h1>Welcome to the Game!</h1>
      <h1>Phase: {gameState}</h1>

      <div className="game-area">
        <Board
          placedShips={placedShips}
          setPlacedShips={setPlacedShips}
          gameState={gameState}
          clickedCells={clickedCells}
          onCellClick={handleCellClick}
          onResetGame={resetGame}
        />
        {gameState === "placement" ? (
          <Shipyard placedShips={placedShips} />
        ) : null}
        {/* TODO change to enemy-board */}
      </div>

      {gameState === "placement" && (
        <button
          className="start-btn"
          onClick={startHandler}
          style={{
            opacity: placedShips.length === 6 ? 1 : 0.5,
            pointerEvents: placedShips.length === 6 ? "auto" : "none",
          }} // disable if not all ships placed
        >
          Start Game
        </button>
      )}
    </div>
  );
}

export default App;
