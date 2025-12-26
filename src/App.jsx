import { useState } from "react";
import Board from "./components/Board";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Welcome to the Game!</h1>
      <Board />
    </>
  );
}

export default App;
