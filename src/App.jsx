import { useState } from "react";
import Board from "./components/Board";
import Shipyard from "./components/Shipyard";
import { fleet } from "./fleet";
import { calculateCoords, checkCollision, generateShips } from "./helpers";

function App() {
  // player states
  const [placedShips, setPlacedShips] = useState([]);
  const [clickedCells, setClickedCells] = useState([]);

  // bot states
  const [botShips, setBotShips] = useState([]);
  const [botClickedCells, setBotClickedCells] = useState([]);

  const [gameState, setGameState] = useState("placement"); // "placement" or "play"

  const resetGame = () => {
    setPlacedShips([]);
    setClickedCells([]);

    setBotShips([]);
    setBotClickedCells([]);

    setGameState("placement");
  };

  // click enemy-board (player attacking bot)
  const handleEnemyClick = (cellIndex) => {
    if (gameState !== "play") return;

    if (!botClickedCells.includes(cellIndex))
      return setBotClickedCells((prev) => [...prev, cellIndex]);
  };

  // start button handler (generate bot ships and switch state)
  const startHandler = () => {
    if (placedShips.length == 6) {
      const enemies = generateShips();
      setBotShips(enemies);

      setGameState("play");
    }
  };

  // random-button handler
  const handleRandomize = () => {
    const newPlacedShips = generateShips();
    setPlacedShips(newPlacedShips);
  };

  return (
    <div className="app-container">
      <h1>Welcome to the Game!</h1>
      <h1>Phase: {gameState}</h1>

      <div className="game-area">
        <div className="player-section">
          <h2>Your Board</h2>
          <Board
            placedShips={placedShips}
            setPlacedShips={setPlacedShips}
            gameState={gameState}
            clickedCells={clickedCells}
            onCellClick={() => {}} // no self-clicking
            onRandomize={handleRandomize}
            isEnemy={false} // player board
          />
        </div>

        <div className="enemy-section">
          {gameState === "placement" ? (
            <Shipyard placedShips={placedShips} />
          ) : (
            <>
              <h2>Enemy Board</h2>
              <Board
                placedShips={botShips}
                gameState={gameState}
                clickedCells={botClickedCells}
                onCellClick={handleEnemyClick}
                isEnemy={true} // enemy board
              />
              <button className="reset-btn" onClick={resetGame}>
                Reset Game
              </button>
            </>
          )}
        </div>
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
