const GameOver = ({ winner, onReset, onOverview }) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        <h2>Game Over!</h2>
        <h2>{winner === "player" ? "You Win! :)" : "Defeat :("} </h2>
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
            flexDirection: "column",
          }}
        >
          <button className="new-game-btn" onClick={onReset}>
            Play again
          </button>
          <button className="random-btn" onClick={onOverview}>
            Game Overview
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
