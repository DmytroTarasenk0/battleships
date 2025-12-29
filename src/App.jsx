import { useState } from "react";
import Board from "./components/Board";
import Shipyard from "./components/Shipyard";

function App() {
  const [placedShips, setPlacedShips] = useState([]);

  return (
    <div className="app-container">
      <h1>Welcome to the Game!</h1>

      {/* This DIV is the magic fix for side-by-side layout */}
      <div className="game-area">
        <Board placedShips={placedShips} setPlacedShips={setPlacedShips} />
        <Shipyard placedShips={placedShips} />
      </div>
    </div>
  );
}

export default App;
