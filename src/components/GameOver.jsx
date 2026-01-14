const GameOver = ({ winner, onReset }) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        <h2>Game Over!</h2>
        <h2>{winner === "player" ? "You Win! :)" : "Defeat :("} </h2>
        <button className="new-game-btn" onClick={onReset}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;
