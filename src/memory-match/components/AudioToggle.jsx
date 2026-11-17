import styles from "../MemoryGame.module.css";

export default function AudioToggle({ muted, onToggle }) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.btnGhost}`}
      onClick={onToggle}
      aria-label={muted ? "Unmute music" : "Mute music"}
    >
      {muted ? "🔇 Music off" : "🔊 Music on"}
    </button>
  );
}
