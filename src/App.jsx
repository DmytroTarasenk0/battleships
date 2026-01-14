import { useState, useEffect, use } from "react";
import Board from "./components/Board";
import Shipyard from "./components/Shipyard";
import GameOver from "./components/GameOver";
import { generateShips, isOccupied, revealAura, getNeighbors } from "./helpers";

function App() {
  // player states
  const [placedShips, setPlacedShips] = useState([]);
  const [clickedCells, setClickedCells] = useState([]);

  // bot states
  const [botShips, setBotShips] = useState([]);
  const [botClickedCells, setBotClickedCells] = useState([]);

  const [Queue, setQueue] = useState([]); // track neighbours of hits
  const [lastHit, setLastHit] = useState(null); // track last hit position

  // game states
  const [gameState, setGameState] = useState("placement"); // "placement" or "play" or "gameover"
  const [turn, setTurn] = useState(() => Math.round(Math.random())); // 1 - player, 0 - bot, first turn random
  const [winner, setWinner] = useState(null); // "player" or "bot"

  // bot automatic turn
  useEffect(() => {
    if (gameState === "play" && turn === 0) {
      const shoot = setTimeout(() => {
        // find target cell
        let target;

        // if have queued NOT-clicked neighbors, pick from them
        const validQueue = Queue.filter((i) => !clickedCells.includes(i));

        if (validQueue.length > 0) {
          // logical shoot
          target = validQueue[Math.floor(Math.random() * validQueue.length)];
        } else {
          // random shoot
          do {
            target = Math.floor(Math.random() * 100);
          } while (clickedCells.includes(target));
          setLastHit(null); // reset last hit if shooting random
        }

        // Temporary array for logging clicks and check "sunk ship aura"
        const newClicks = [...clickedCells, target];
        const sunkPlayerAura = []; // all ships' aura to add
        let shipSunk = false; // current ship sunk status

        placedShips.forEach((ship) => {
          const isSunk = ship.coords.every((coord) =>
            newClicks.includes(coord)
          );

          // push aura coords if sunk
          if (isSunk) {
            const aura = revealAura(ship.coords);
            sunkPlayerAura.push(...aura);

            // sunk current ship if it contains target
            if (ship.coords.includes(target)) {
              shipSunk = true;
            }
          }
        });

        const allClicks = new Set([...newClicks, ...sunkPlayerAura]);

        setClickedCells(Array.from(allClicks));

        const isGameOver = checkGameOver(
          placedShips,
          Array.from(allClicks),
          "bot"
        );
        if (isGameOver) return;

        // next hit
        const hit = isOccupied(placedShips, target);
        if (hit) {
          let nextTargets = validQueue.filter((t) => t !== target); // remove current target from queue
          const neighbors = getNeighbors(target).filter(
            (n) => !clickedCells.includes(n)
          ); // get unclicked neighbors

          if (shipSunk) {
            // clear queue if ship sunk and go random
            setQueue([]);
            setLastHit(null);
          } else if (lastHit !== null) {
            // determine Axis if 2 hits in a row (vertical/horizontal)

            // vertical if |difference| % 10 === 0
            // horizontal otherwise
            const diff = Math.abs(target - lastHit);
            const isVertical = diff % 10 === 0;

            // filter neighbors based on axis
            if (isVertical) {
              const col = target % 10;
              nextTargets = [...nextTargets, ...neighbors].filter(
                (t) => t % 10 === col
              );
            } else {
              const row = Math.floor(target / 10);
              nextTargets = [...nextTargets, ...neighbors].filter(
                (t) => Math.floor(t / 10) === row
              );
            }

            setQueue(nextTargets);
            setLastHit(target);
          } else {
            setQueue([...nextTargets, ...neighbors]); // add all neighbors to queue
            setLastHit(target);
          }
        } else {
          // miss
          setQueue(validQueue.filter((i) => i !== target)); // remove target from queue because clicked
          setTurn(1); // switch to player turn
        }
      }, 1000);

      return () => clearTimeout(shoot);
    }
  }, [turn, gameState, clickedCells, Queue, lastHit]);

  const resetGame = () => {
    setPlacedShips([]);
    setClickedCells([]);

    setBotShips([]);
    setBotClickedCells([]);
    setQueue([]);
    setLastHit(null);

    setGameState("placement");
    setTurn(Math.round(Math.random()));
    setWinner(null);
  };

  // check if all ships are sunk => game over and set winner
  const checkGameOver = (enemyShips, hits, fleetOwner) => {
    const isAllSunk = enemyShips.every((ship) =>
      ship.coords.every((coord) => hits.includes(coord))
    );

    if (isAllSunk) {
      setWinner(fleetOwner);
      setGameState("gameOver");
      return true;
    }
    return false;
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

      checkGameOver(botShips, Array.from(allClicks), "player");

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

      {gameState === "gameOver" && (
        <GameOver winner={winner} onReset={resetGame} />
      )}
    </div>
  );
}

export default App;
