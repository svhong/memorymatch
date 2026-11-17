import AudioToggle from "./AudioToggle";

export default function StatsPanel({
  gamesPlayed,
  matches,
  attempts,
  accuracy,
  muted,
  onToggleMute,
  onReset,
  onDemo,
}) {
  return (
    <div id="statsArea">
      <div className="stat games">
        Games Played <br /> {gamesPlayed}
      </div>
      <div className="stat">
        Total Matches: <br /> {matches}
      </div>
      <div className="stat">
        Attempts: <br /> {attempts}
      </div>
      <div className="stat">
        Accuracy: <br /> {accuracy}
      </div>
      <AudioToggle muted={muted} onToggle={onToggleMute} />
      <button type="button" className="btn btn-danger" onClick={onReset}>
        Reset Game
      </button>
      <button type="button" className="btn btn-success" onClick={onDemo}>
        Demo
      </button>
    </div>
  );
}
