import AudioToggle from "./AudioToggle";

function Stat({ label, value }) {
  return (
    <div className="stat" role="group" aria-label={label}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

export default function StatsPanel({
  gamesPlayed,
  matches,
  totalPairs,
  attempts,
  accuracy,
  muted,
  onToggleMute,
  onReset,
  onDemo,
}) {
  return (
    <aside id="statsArea" aria-label="Game menu">
      <header className="brand">
        <img src="images/bttflogo.png" alt="Back to the Future" />
        <h1>Memory Match</h1>
      </header>

      <div
        className="progress"
        role="progressbar"
        aria-label="Pairs found"
        aria-valuemin={0}
        aria-valuemax={totalPairs}
        aria-valuenow={matches}
      >
        <div
          className="progress-fill"
          style={{ width: `${(matches / totalPairs) * 100}%` }}
        />
        <span className="progress-text">
          {matches} / {totalPairs} pairs
        </span>
      </div>

      <div className="stats-grid">
        <Stat label="Games Played" value={gamesPlayed} />
        <Stat label="Total Matches" value={matches} />
        <Stat label="Attempts" value={attempts} />
        <Stat label="Accuracy" value={accuracy} />
      </div>

      <nav className="actions">
        <button type="button" className="btn btn-primary" onClick={onReset}>
          ↻ New Game
        </button>
        <button type="button" className="btn btn-ghost" onClick={onDemo}>
          ▶ Demo
        </button>
        <AudioToggle muted={muted} onToggle={onToggleMute} />
      </nav>

      <a className="about-link" href="#/about">
        About
      </a>
    </aside>
  );
}
