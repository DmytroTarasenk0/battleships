import { useState } from "react";
import Board from "./components/Board";
import Shipyard from "./components/Shipyard";

function App() {
  const [placedShips, setPlacedShips] = useState([]);

  return (
    <>
      <h1>Welcome to the Game!</h1>
      <Board placedShips={placedShips} setPlacedShips={setPlacedShips} />
      <Shipyard placedShips={placedShips} />
    </>
  );
}

export default App;
