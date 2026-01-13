import { useState, useEffect, use } from "react";
import Board from "./components/Board";
import Shipyard from "./components/Shipyard";
import { fleet } from "./fleet";
import {
  calculateCoords,
  checkCollision,
  generateShips,
  isOccupied,
  revealAura,
} from "./helpers";

function App() {
  // player states
  const [placedShips, setPlacedShips] = useState([]);
  const [clickedCells, setClickedCells] = useState([]);

  // bot states
  const [botShips, setBotShips] = useState([]);
  const [botClickedCells, setBotClickedCells] = useState([]);

  // game states
  const [gameState, setGameState] = useState("placement"); // "placement" or "play"
  const [turn, setTurn] = useState(() => Math.round(Math.random())); // 1 - player, 0 - bot, first turn random

  // bot automatic turn
  useEffect(() => {
    if (gameState === "play" && turn === 0) {
      const shoot = setTimeout(() => {
        // find target cell
        let target;
        do {
          target = Math.floor(Math.random() * 100);
        } while (clickedCells.includes(target));

        // Temporary array for logging clicks and check "sunk ship aura"
        const newClicks = [...clickedCells, target];
        const sunkPlayerAura = [];

        placedShips.forEach((ship) => {
          const isSunk = ship.coords.every((coord) =>
            newClicks.includes(coord)
          );

          // push aura coords if sunk
          if (isSunk) {
            const aura = revealAura(ship.coords);
            sunkPlayerAura.push(...aura);
          }
        });

        const allClicks = new Set([...newClicks, ...sunkPlayerAura]);

        setClickedCells(Array.from(allClicks));

        // check hit
        if (!isOccupied(placedShips, target)) setTurn(1); // switch to player turn if miss
      }, 1000);

      return () => clearTimeout(shoot);
    }
  }, [turn, gameState, clickedCells]);

  const resetGame = () => {
    setPlacedShips([]);
    setClickedCells([]);

    setBotShips([]);
    setBotClickedCells([]);

    setGameState("placement");
    setTurn(Math.round(Math.random()));
  };

  // click enemy-board (player attacking bot)
  const handleEnemyClick = (cellIndex) => {
    if (gameState !== "play") return;
    if (turn !== 1) return;

    if (!botClickedCells.includes(cellIndex)) {
      // Temporary array for logging clicks and check "sunk ship aura"
      const newClicks = [...botClickedCells, cellIndex];
      const sunkBotAura = [];

      botShips.forEach((ship) => {
        const isSunk = ship.coords.every((coord) => newClicks.includes(coord));

        // push aura coords if sunk
        if (isSunk) {
          const aura = revealAura(ship.coords);
          sunkBotAura.push(...aura);
        }
      });

      const allClicks = new Set([...newClicks, ...sunkBotAura]);

      setBotClickedCells(Array.from(allClicks));
      if (!isOccupied(botShips, cellIndex)) {
        setTurn(0); // switch to bot turn if miss
      }
    }
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
      <h1>Current Turn: {turn === 1 ? "Player" : "Bot"}</h1>
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
