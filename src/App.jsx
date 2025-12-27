import { useState } from "react";
import Board from "./components/Board";
import Shipyard from "./components/Shipyard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Welcome to the Game!</h1>
      <Board />
      <Shipyard />
    </>
  );
}

export default App;
