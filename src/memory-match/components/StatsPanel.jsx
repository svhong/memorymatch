import AudioToggle from "./AudioToggle";
import { LOGO } from "../assets";
import styles from "../MemoryGame.module.css";

function Stat({ label, value }) {
  return (
    <div className={styles.stat} role="group" aria-label={label}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
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
    <aside className={styles.menu} aria-label="Game menu">
      <header className={styles.brand}>
        <img src={LOGO} alt="Back to the Future" />
        <h1>Memory Match</h1>
      </header>

      <div
        className={styles.progress}
        role="progressbar"
        aria-label="Pairs found"
        aria-valuemin={0}
        aria-valuemax={totalPairs}
        aria-valuenow={matches}
      >
        <div
          className={styles.progressFill}
          style={{ width: `${(matches / totalPairs) * 100}%` }}
        />
        <span className={styles.progressText}>
          {matches} / {totalPairs} pairs
        </span>
      </div>

      <div className={styles.statsGrid}>
        <Stat label="Games Played" value={gamesPlayed} />
        <Stat label="Total Matches" value={matches} />
        <Stat label="Attempts" value={attempts} />
        <Stat label="Accuracy" value={accuracy} />
      </div>

      <nav className={styles.actions}>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={onReset}>
          ↻ New Game
        </button>
        <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={onDemo}>
          ▶ Demo
        </button>
        <AudioToggle muted={muted} onToggle={onToggleMute} />
      </nav>
    </aside>
  );
}
